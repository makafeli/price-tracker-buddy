import axios from "axios";
import { PriceChange } from "../types/price";

const API_BASE_URL = "https://tld-price-changes-api.vercel.app/api";

const mockData: PriceChange[] = [
  {
    tld: ".ABOGADO",
    oldPrice: 15.00,
    newPrice: 20.00,
    priceChange: 5.00,
    percentageChange: 33.33,
    date: "2022-09-01",
    domainCount: 3245
  },
  {
    tld: ".ACADEMY",
    oldPrice: 25.00,
    newPrice: 33.00,
    priceChange: 8.00,
    percentageChange: 32.00,
    date: "2024-10-04",
    domainCount: 8234
  },
  {
    tld: ".ACCOUNTANTS",
    oldPrice: 75.00,
    newPrice: 81.00,
    priceChange: 6.00,
    percentageChange: 8.00,
    date: "2024-10-04",
    domainCount: 2134
  },
  {
    tld: ".ACTOR",
    oldPrice: 29.00,
    newPrice: 31.00,
    priceChange: 2.00,
    percentageChange: 6.90,
    date: "2024-10-04",
    domainCount: 4521
  },
  {
    tld: ".ADULT",
    oldPrice: 75.00,
    newPrice: 85.00,
    priceChange: 10.00,
    percentageChange: 13.33,
    date: "2024-10-01",
    domainCount: 6451
  },
  {
    tld: ".AFRICA",
    oldPrice: 3.80,
    newPrice: 7.50,
    priceChange: 3.70,
    percentageChange: 97.37,
    date: "2025-06-01",
    domainCount: 12543
  },
  {
    tld: ".AI",
    oldPrice: 120.00,
    newPrice: 140.00,
    priceChange: 20.00,
    percentageChange: 16.67,
    date: "2023-04-15",
    domainCount: 278543
  },
  {
    tld: ".APP",
    oldPrice: 12.00,
    newPrice: 14.00,
    priceChange: 2.00,
    percentageChange: 16.67,
    date: "2024-08-01",
    domainCount: 456321
  }
];

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

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