import { axiosInstance } from "./api.config";
import { mockData } from "./mockData";
import type { PriceChange } from "../types/price";
import { PriceChangeModel } from "../types/price";

export type { PriceChange };

class APIService {
  private static instance: APIService;
  
  private constructor() {}

  static getInstance(): APIService {
    if (!APIService.instance) {
      APIService.instance = new APIService();
    }
    return APIService.instance;
  }

  async getPriceChanges(): Promise<PriceChange[]> {
    try {
      const response = await axiosInstance.get<PriceChange[]>('/price-changes');
      if (response.data?.length > 0) {
        return response.data.map(PriceChangeModel.fromJSON);
      }
      console.info('No data from API, falling back to mock data');
      return mockData;
    } catch (error) {
      console.error('Error fetching price changes:', error);
      console.info('API error, falling back to mock data');
      return mockData;
    }
  }

  async searchTLD(query: string): Promise<PriceChange[]> {
    try {
      const response = await axiosInstance.get<PriceChange[]>(`/search`, {
        params: { tld: query }
      });
      if (response.data?.length > 0) {
        return response.data.map(PriceChangeModel.fromJSON);
      }
      return mockData.filter(item => 
        item.tld.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching TLD:', error);
      return mockData.filter(item => 
        item.tld.toLowerCase().includes(query.toLowerCase())
      );
    }
  }
}

export const api = APIService.getInstance();