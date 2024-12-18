import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '../api';
import { axiosInstance } from '../api.config';
import { mockData } from '../mockData';
import { PriceChangeModel } from '../../types/price';
import type { PriceAlert, PriceHistory } from '../../types/price';
import { notificationService } from '../notification';

// Mock dependencies
vi.mock('../api.config', () => ({
  axiosInstance: {
    get: vi.fn()
  }
}));

vi.mock('../notification', () => ({
  notificationService: {
    processAlert: vi.fn()
  }
}));

describe('APIService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPriceChanges', () => {
    it('returns data from API when available', async () => {
      const mockApiResponse = { data: mockData };
      vi.mocked(axiosInstance.get).mockResolvedValueOnce(mockApiResponse);

      const result = await api.getPriceChanges();
      expect(result.length).toBe(mockData.length);
      expect(result[0]).toBeInstanceOf(PriceChangeModel);
      expect(axiosInstance.get).toHaveBeenCalledWith('/price-changes');
    });

    it('falls back to cached data when API fails', async () => {
      vi.mocked(axiosInstance.get).mockRejectedValueOnce(new Error('API Error'));

      const result = await api.getPriceChanges();
      expect(result.length).toBe(mockData.length);
      expect(result[0]).toBeInstanceOf(PriceChangeModel);
    });

    it('uses cache when data is fresh', async () => {
      // First call to populate cache
      const mockApiResponse = { data: mockData };
      vi.mocked(axiosInstance.get).mockResolvedValueOnce(mockApiResponse);
      await api.getPriceChanges();

      // Second call should use cache
      vi.clearAllMocks();
      const result = await api.getPriceChanges();
      
      expect(result.length).toBe(mockData.length);
      expect(axiosInstance.get).not.toHaveBeenCalled();
    });
  });

  describe('searchTLD', () => {
    it('returns filtered data from API when available', async () => {
      const query = '.com';
      const mockApiResponse = { data: [mockData[0]] };
      vi.mocked(axiosInstance.get).mockResolvedValueOnce(mockApiResponse);

      const result = await api.searchTLD(query);
      expect(result[0]).toBeInstanceOf(PriceChangeModel);
      expect(axiosInstance.get).toHaveBeenCalledWith('/search', {
        params: { tld: query }
      });
    });

    it('falls back to cached search when API fails', async () => {
      const query = '.com';
      vi.mocked(axiosInstance.get).mockRejectedValueOnce(new Error('API Error'));

      const result = await api.searchTLD(query);
      expect(result.every(item => 
        item.tld.toLowerCase().includes(query.toLowerCase())
      )).toBe(true);
    });

    it('performs case-insensitive search', async () => {
      const query = '.COM';
      vi.mocked(axiosInstance.get).mockRejectedValueOnce(new Error('API Error'));

      const result = await api.searchTLD(query);
      expect(result.every(item => 
        item.tld.toLowerCase().includes(query.toLowerCase())
      )).toBe(true);
    });
  });

  describe('getPriceHistory', () => {
    const mockHistory: PriceHistory[] = [
      { date: '2023-01-01', price: 10, source: 'api' },
      { date: '2023-01-02', price: 11, source: 'api' },
    ];

    it('fetches and caches price history', async () => {
      const tld = '.com';
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockHistory });

      const result = await api.getPriceHistory(tld);
      expect(result).toEqual(mockHistory);
      expect(axiosInstance.get).toHaveBeenCalledWith(`/history/${tld}`);

      // Should be cached now
      vi.clearAllMocks();
      const cachedResult = await api.getPriceHistory(tld);
      expect(cachedResult).toEqual(mockHistory);
      expect(axiosInstance.get).not.toHaveBeenCalled();
    });
  });

  describe('setAlert', () => {
    const mockAlert: PriceAlert = {
      type: 'price_drop',
      percentage: 10,
      enabled: true,
      notifyVia: ['email'],
    };

    it('sets and caches alert', async () => {
      const tld = mockData[0].tld;
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: {} });

      await api.setAlert(tld, mockAlert);
      expect(axiosInstance.get).toHaveBeenCalledWith('/alerts', {
        params: {
          tld,
          type: mockAlert.type,
          percentage: '10',
          enabled: 'true',
          notifyVia: 'email',
        },
      });

      // Verify alert is cached
      const changes = await api.getPriceChanges();
      const item = changes.find(c => c.tld === tld);
      expect(item?.alerts).toContainEqual(mockAlert);
    });

    it('throws error for non-existent TLD', async () => {
      const tld = 'nonexistent';
      await expect(api.setAlert(tld, mockAlert))
        .rejects.toThrow(`TLD ${tld} not found`);
    });
  });

  describe('checkAlerts', () => {
    const userId = 'test-user';
    const mockAlert: PriceAlert = {
      type: 'price_drop',
      percentage: 5,
      enabled: true,
      notifyVia: ['email'],
    };

    it('processes alerts for price changes', async () => {
      // Setup a price change that should trigger alert
      const mockPriceChange = {
        ...mockData[0],
        oldPrice: 100,
        newPrice: 90,
        priceChange: -10,
        percentageChange: -10,
        alerts: [mockAlert],
      };

      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ 
        data: [mockPriceChange] 
      });

      await api.checkAlerts(userId);

      expect(notificationService.processAlert).toHaveBeenCalledWith(
        userId,
        expect.objectContaining({
          tld: mockPriceChange.tld,
          priceChange: -10,
        }),
        mockAlert
      );
    });

    it('skips disabled alerts', async () => {
      const mockPriceChange = {
        ...mockData[0],
        alerts: [{
          ...mockAlert,
          enabled: false,
        }],
      };

      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ 
        data: [mockPriceChange] 
      });

      await api.checkAlerts(userId);
      expect(notificationService.processAlert).not.toHaveBeenCalled();
    });
  });

  describe('comparePrices', () => {
    it('compares multiple TLDs', async () => {
      const tlds = ['.com', '.net'];
      const mockResponses = tlds.map(tld => ({
        data: mockData.find(item => item.tld === tld),
      }));

      vi.mocked(axiosInstance.get)
        .mockResolvedValueOnce(mockResponses[0])
        .mockResolvedValueOnce(mockResponses[1]);

      const result = await api.comparePrices(tlds);

      expect(Object.keys(result)).toEqual(tlds);
      tlds.forEach(tld => {
        expect(result[tld]).toBeInstanceOf(PriceChangeModel);
      });
    });

    it('uses cached data for failed requests', async () => {
      const tlds = ['.com', '.fail'];
      vi.mocked(axiosInstance.get)
        .mockResolvedValueOnce({ data: mockData[0] })
        .mockRejectedValueOnce(new Error('API Error'));

      const result = await api.comparePrices(tlds);

      expect(Object.keys(result)).toEqual(tlds);
      expect(result['.com']).toBeInstanceOf(PriceChangeModel);
      expect(result['.fail']).toBeInstanceOf(PriceChangeModel);
    });
  });
});