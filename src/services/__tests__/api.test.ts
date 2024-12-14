import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '../api';
import { axiosInstance } from '../api.config';
import { mockData } from '../mockData';

vi.mock('../api.config', () => ({
  axiosInstance: {
    get: vi.fn()
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
      expect(result).toEqual(mockData);
      expect(axiosInstance.get).toHaveBeenCalledWith('/price-changes');
    });

    it('falls back to mock data when API fails', async () => {
      vi.mocked(axiosInstance.get).mockRejectedValueOnce(new Error('API Error'));

      const result = await api.getPriceChanges();
      expect(result).toEqual(mockData);
    });
  });

  describe('searchTLD', () => {
    it('returns filtered data from API when available', async () => {
      const mockApiResponse = { data: [mockData[0]] };
      vi.mocked(axiosInstance.get).mockResolvedValueOnce(mockApiResponse);

      const result = await api.searchTLD('.com');
      expect(result).toEqual([mockData[0]]);
      expect(axiosInstance.get).toHaveBeenCalledWith('/search', {
        params: { tld: '.com' }
      });
    });

    it('falls back to filtered mock data when API fails', async () => {
      vi.mocked(axiosInstance.get).mockRejectedValueOnce(new Error('API Error'));

      const result = await api.searchTLD('.com');
      expect(result).toEqual(mockData.filter(item => 
        item.tld.toLowerCase().includes('.com')
      ));
    });
  });
});