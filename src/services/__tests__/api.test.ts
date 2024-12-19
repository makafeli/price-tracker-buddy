import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '../api';
import { axiosInstance } from '../api.config';
import { mockData } from '../mockData';
import { PriceChange, PriceAlert } from '../../types/price';

// Mock dependencies
vi.mock('../api.config', () => ({
  axiosInstance: {
    get: vi.fn(),
    post: vi.fn()
  }
}));

describe('APIService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPriceChanges', () => {
    it('returns data from API', async () => {
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockData });
      const result = await api.getPriceChanges();
      expect(result.length).toBe(mockData.length);
      expect(axiosInstance.get).toHaveBeenCalledWith('/price-changes');
    });
  });

  describe('searchTLD', () => {
    it('returns filtered data', async () => {
      const query = '.com';
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: [mockData[0]] });
      const result = await api.searchTLD(query);
      expect(result.every(item => 
        item.tld.toLowerCase().includes(query.toLowerCase())
      )).toBe(true);
    });
  });

  describe('getPriceHistory', () => {
    const mockHistory = [
      { date: '2023-01-01', price: 10, source: 'api' },
      { date: '2023-01-02', price: 11, source: 'api' },
    ];

    it('fetches price history', async () => {
      const tld = '.com';
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockHistory });
      const result = await api.getPriceHistory(tld);
      expect(result).toEqual(mockHistory);
    });
  });

  describe('setAlert', () => {
    const mockAlert: PriceAlert = {
      type: 'price_drop',
      percentage: 10,
      enabled: true,
      notifyVia: ['email'],
    };

    it('sets alert successfully', async () => {
      const tld = '.com';
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({ data: {} });
      await api.setAlert(tld, mockAlert);
      expect(axiosInstance.post).toHaveBeenCalledWith('/alerts', {
        tld,
        ...mockAlert
      });
    });
  });

  describe('comparePrices', () => {
    it('compares multiple TLDs', async () => {
      const tlds = ['.com', '.net'];
      const mockResponse = {
        '.com': mockData[0],
        '.net': mockData[1]
      };
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockResponse });
      const result = await api.comparePrices(tlds);
      expect(Object.keys(result)).toEqual(tlds);
    });
  });
});