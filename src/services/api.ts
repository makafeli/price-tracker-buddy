import axios from "axios";

const API_BASE_URL = "https://tld-price-changes-api.vercel.app/api";

export interface PriceChange {
  tld: string;
  oldPrice: number;
  newPrice: number;
  priceChange: number;
  percentageChange: number;
  date: string;
}

export const api = {
  async getPriceChanges(): Promise<PriceChange[]> {
    const response = await axios.get(`${API_BASE_URL}/price-changes`);
    return response.data;
  },

  async searchTLD(query: string): Promise<PriceChange[]> {
    const response = await axios.get(`${API_BASE_URL}/search?tld=${query}`);
    return response.data;
  },
};