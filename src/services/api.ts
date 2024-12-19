import axios from "axios";
import { PriceChange, PriceHistory, PriceAlert } from "../types/price";

const apiClient = axios.create({
  baseURL: "https://api.example.com",
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error);
  }
);

export const api = {
  async getPriceChanges(): Promise<PriceChange[]> {
    const response = await apiClient.get<PriceChange[]>("/price-changes");
    return response;
  },

  async searchTLD(query: string): Promise<PriceChange[]> {
    const response = await apiClient.get<PriceChange[]>(`/price-changes/search?query=${query}`);
    return response;
  },

  async getPriceHistory(tld: string): Promise<PriceHistory[]> {
    const response = await apiClient.get<PriceHistory[]>(`/history/${tld}`);
    return response;
  },

  async setAlert(tld: string, alert: PriceAlert): Promise<void> {
    await apiClient.post(`/alerts`, { tld, ...alert });
  },

  async checkAlerts(userId: string): Promise<void> {
    await apiClient.get(`/alerts/check/${userId}`);
  },

  async comparePrices(tlds: string[]): Promise<Record<string, PriceChange>> {
    const response = await apiClient.get<Record<string, PriceChange>>(`/compare?tlds=${tlds.join(',')}`);
    return response;
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