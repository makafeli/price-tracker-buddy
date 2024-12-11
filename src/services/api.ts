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

const mockData: PriceChange[] = [
  {
    tld: ".ABOGADO",
    oldPrice: 15.00,
    newPrice: 20.00,
    priceChange: 5.00,
    percentageChange: 33.33,
    date: "2022-09-01",
  },
  {
    tld: ".ACADEMY",
    oldPrice: 25.00,
    newPrice: 33.00,
    priceChange: 8.00,
    percentageChange: 32.00,
    date: "2024-10-04",
  },
  {
    tld: ".ACCOUNTANTS",
    oldPrice: 75.00,
    newPrice: 81.00,
    priceChange: 6.00,
    percentageChange: 8.00,
    date: "2024-10-04",
  },
  {
    tld: ".ACTOR",
    oldPrice: 29.00,
    newPrice: 31.00,
    priceChange: 2.00,
    percentageChange: 6.90,
    date: "2024-10-04",
  },
  {
    tld: ".ADULT",
    oldPrice: 75.00,
    newPrice: 85.00,
    priceChange: 10.00,
    percentageChange: 13.33,
    date: "2024-10-01",
  },
  {
    tld: ".AFRICA",
    oldPrice: 3.80,
    newPrice: 7.50,
    priceChange: 3.70,
    percentageChange: 97.37,
    date: "2025-06-01",
  },
  {
    tld: ".AI",
    oldPrice: 120.00,
    newPrice: 140.00,
    priceChange: 20.00,
    percentageChange: 16.67,
    date: "2023-04-15",
  },
  {
    tld: ".APP",
    oldPrice: 12.00,
    newPrice: 14.00,
    priceChange: 2.00,
    percentageChange: 16.67,
    date: "2024-08-01",
  }
];

export const api = {
  async getPriceChanges(): Promise<PriceChange[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/price-changes`);
      if (response.data && response.data.length > 0) {
        return response.data;
      }
      // Return mock data if API returns empty array
      return mockData;
    } catch (error) {
      console.error("Error fetching price changes:", error);
      // Return mock data if API fails
      return mockData;
    }
  },

  async searchTLD(query: string): Promise<PriceChange[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/search?tld=${query}`);
      if (response.data && response.data.length > 0) {
        return response.data;
      }
      // Filter mock data if API returns empty array
      return mockData.filter(item => 
        item.tld.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error("Error searching TLD:", error);
      // Filter mock data if API fails
      return mockData.filter(item => 
        item.tld.toLowerCase().includes(query.toLowerCase())
      );
    }
  },
};