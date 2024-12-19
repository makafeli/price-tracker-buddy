import axios from "axios";
import { PriceChange, PriceHistory, PriceAlert } from "../types/price";

const apiClient = axios.create({
  baseURL: "https://api.example.com",
  timeout: 10000,
});

// Configure interceptors to automatically extract data from response
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export const api = {
  async getPriceChanges(): Promise<PriceChange[]> {
    // Mock data for development
    return [
      {
        id: "1",
        tld: ".com",
        oldPrice: 10.99,
        newPrice: 12.99,
        priceChange: 2,
        percentageChange: 18.2,
        date: new Date().toISOString(),
        domainCount: 1000,
        history: [],
        lastChecked: new Date().toISOString(),
        nextCheck: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        sources: ["registrar-a"]
      },
      {
        id: "2",
        tld: ".net",
        oldPrice: 9.99,
        newPrice: 8.99,
        priceChange: -1,
        percentageChange: -10,
        date: new Date().toISOString(),
        domainCount: 500,
        history: [],
        lastChecked: new Date().toISOString(),
        nextCheck: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        sources: ["registrar-b"]
      }
    ];
    // When API is ready, uncomment this:
    // return await apiClient.get<PriceChange[]>("/price-changes");
  },

  async searchTLD(query: string): Promise<PriceChange[]> {
    // Mock data filtered by query
    return (await this.getPriceChanges()).filter(
      change => change.tld.toLowerCase().includes(query.toLowerCase())
    );
    // When API is ready, uncomment this:
    // return await apiClient.get<PriceChange[]>(`/price-changes/search?query=${query}`);
  },

  async getPriceHistory(tld: string): Promise<PriceHistory[]> {
    // Mock history data
    return [
      { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), price: 9.99, source: "registrar-a" },
      { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), price: 10.99, source: "registrar-a" },
      { date: new Date().toISOString(), price: 12.99, source: "registrar-a" }
    ];
    // When API is ready, uncomment this:
    // return await apiClient.get<PriceHistory[]>(`/history/${tld}`);
  },

  async setAlert(tld: string, alert: PriceAlert): Promise<void> {
    await apiClient.post(`/alerts`, { tld, ...alert });
  },

  async checkAlerts(userId: string): Promise<void> {
    await apiClient.get(`/alerts/check/${userId}`);
  },

  async comparePrices(tlds: string[]): Promise<Record<string, PriceChange>> {
    // Mock comparison data
    const changes = await this.getPriceChanges();
    return Object.fromEntries(
      changes
        .filter(change => tlds.includes(change.tld))
        .map(change => [change.tld, change])
    );
    // When API is ready, uncomment this:
    // return await apiClient.get<Record<string, PriceChange>>(`/compare?tlds=${tlds.join(',')}`);
  },

  async adminLogin(password: string): Promise<boolean> {
    return password === "admin123";
  },

  async checkAuthStatus(): Promise<boolean> {
    const isAuthenticated = localStorage.getItem("adminAuthenticated") === "true";
    return isAuthenticated;
  },
};

export type { PriceChange, PriceHistory, PriceAlert } from "../types/price";