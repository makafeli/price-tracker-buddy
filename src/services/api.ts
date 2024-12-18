import { axiosInstance } from "./api.config";
import { mockData } from "./mockData";
import type { PriceChange, PriceHistory, PriceAlert } from "../types/price";
import { PriceChangeModel } from "../types/price";
import { notificationService } from "./notification";

export type { PriceChange, PriceHistory, PriceAlert };

interface APIError extends Error {
  isApiError: true;
  status: number;
  code: string;
}

class APIService {
  private static instance: APIService;
  private cache: Map<string, PriceChange> = new Map();
  private lastUpdate: Date = new Date();
  private updateInterval = 1000 * 60 * 60; // 1 hour
  
  private constructor() {
    // Initialize cache with mock data
    mockData.forEach(item => {
      const model = PriceChangeModel.fromJSON(item);
      this.cache.set(model.tld, model);
    });
  }

  static getInstance(): APIService {
    if (!APIService.instance) {
      APIService.instance = new APIService();
    }
    return APIService.instance;
  }

  private shouldUpdate(): boolean {
    return Date.now() - this.lastUpdate.getTime() >= this.updateInterval;
  }

  private async fetchFromAPI<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    try {
      const response = await axiosInstance.get<T>(endpoint, { params });
      return response.data;
    } catch (error) {
      const apiError = error as APIError;
      if (apiError.isApiError && apiError.status === 429) {
        // Rate limit hit, wait and retry
        await new Promise(resolve => setTimeout(resolve, 5000));
        return this.fetchFromAPI(endpoint, params);
      }
      throw error;
    }
  }

  async getPriceChanges(): Promise<PriceChange[]> {
    if (!this.shouldUpdate() && this.cache.size > 0) {
      return Array.from(this.cache.values());
    }

    try {
      const data = await this.fetchFromAPI<PriceChange[]>('/price-changes');
      if (data?.length > 0) {
        // Update cache
        data.forEach(item => {
          const model = PriceChangeModel.fromJSON(item);
          this.cache.set(model.tld, model);
        });
        this.lastUpdate = new Date();
        return data.map(PriceChangeModel.fromJSON);
      }
      return Array.from(this.cache.values());
    } catch (error) {
      console.error('Error fetching price changes:', error);
      return Array.from(this.cache.values());
    }
  }

  async searchTLD(query: string): Promise<PriceChange[]> {
    try {
      const data = await this.fetchFromAPI<PriceChange[]>('/search', { tld: query });
      if (data?.length > 0) {
        // Update cache with new data
        data.forEach(item => {
          const model = PriceChangeModel.fromJSON(item);
          this.cache.set(model.tld, model);
        });
        return data.map(PriceChangeModel.fromJSON);
      }
      // Fall back to cache search
      return Array.from(this.cache.values()).filter(item => 
        item.tld.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching TLD:', error);
      return Array.from(this.cache.values()).filter(item => 
        item.tld.toLowerCase().includes(query.toLowerCase())
      );
    }
  }

  async getPriceHistory(tld: string): Promise<PriceHistory[]> {
    try {
      const data = await this.fetchFromAPI<PriceHistory[]>(`/history/${tld}`);
      if (data?.length > 0) {
        // Update cache
        const existing = this.cache.get(tld);
        if (existing) {
          const updated = new PriceChangeModel({
            ...existing,
            history: data,
          });
          this.cache.set(tld, updated);
        }
        return data;
      }
      return this.cache.get(tld)?.history || [];
    } catch (error) {
      console.error(`Error fetching price history for ${tld}:`, error);
      return this.cache.get(tld)?.history || [];
    }
  }

  async setAlert(tld: string, alert: PriceAlert): Promise<void> {
    const existing = this.cache.get(tld);
    if (!existing) throw new Error(`TLD ${tld} not found`);

    try {
      await this.fetchFromAPI('/alerts', {
        tld,
        type: alert.type,
        threshold: alert.threshold?.toString(),
        percentage: alert.percentage?.toString(),
        enabled: alert.enabled.toString(),
        notifyVia: alert.notifyVia.join(','),
      });

      // Update cache
      const updated = new PriceChangeModel({
        ...existing,
        alerts: [...(existing.alerts || []), alert],
      });
      this.cache.set(tld, updated);
    } catch (error) {
      console.error(`Error setting alert for ${tld}:`, error);
      throw error;
    }
  }

  async checkAlerts(userId: string): Promise<void> {
    const priceChanges = await this.getPriceChanges();
    
    for (const priceChange of priceChanges) {
      if (!priceChange.alerts?.length) continue;

      for (const alert of priceChange.alerts) {
        if (new PriceChangeModel(priceChange).shouldNotify(alert)) {
          await notificationService.processAlert(userId, priceChange, alert);
        }
      }
    }
  }

  async comparePrices(tlds: string[]): Promise<Record<string, PriceChange>> {
    const result: Record<string, PriceChange> = {};
    
    await Promise.all(tlds.map(async tld => {
      try {
        const data = await this.fetchFromAPI<PriceChange>(`/price/${tld}`);
        if (data) {
          const model = PriceChangeModel.fromJSON(data);
          this.cache.set(tld, model);
          result[tld] = model;
        } else {
          result[tld] = this.cache.get(tld)!;
        }
      } catch (error) {
        console.error(`Error fetching price for ${tld}:`, error);
        result[tld] = this.cache.get(tld)!;
      }
    }));

    return result;
  }
}

export const api = APIService.getInstance();