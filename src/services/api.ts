import { PriceChange } from "../types/price";
import { axiosInstance } from "./api.config";
import { mockData } from "./mockData";

export type { PriceChange } from "../types/price";

export const api = {
  async getPriceChanges(): Promise<PriceChange[]> {
    try {
      const response = await axiosInstance.get<PriceChange[]>('/price-changes');
      if (response.data && response.data.length > 0) {
        return response.data;
      }
      console.info('No data from API, falling back to mock data');
      return mockData;
    } catch (error) {
      console.error('Error fetching price changes:', error);
      console.info('API error, falling back to mock data');
      return mockData;
    }
  },

  async searchTLD(query: string): Promise<PriceChange[]> {
    try {
      const response = await axiosInstance.get<PriceChange[]>(`/search`, {
        params: { tld: query }
      });
      if (response.data && response.data.length > 0) {
        return response.data;
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
  },
};