import { describe, it, expect } from 'vitest';
import { PriceCalculator } from '../priceCalculations';

describe('PriceCalculator', () => {
  describe('formatCurrency', () => {
    it('formats currency correctly', () => {
      expect(PriceCalculator.formatCurrency(10)).toBe('$10.00');
      expect(PriceCalculator.formatCurrency(10.5)).toBe('$10.50');
      expect(PriceCalculator.formatCurrency(0)).toBe('$0.00');
      expect(PriceCalculator.formatCurrency(-10.5)).toBe('-$10.50');
    });
  });

  describe('formatNumber', () => {
    it('formats numbers with commas', () => {
      expect(PriceCalculator.formatNumber(1000)).toBe('1,000');
      expect(PriceCalculator.formatNumber(1000000)).toBe('1,000,000');
      expect(PriceCalculator.formatNumber(0)).toBe('0');
    });
  });

  describe('calculateAdditionalRevenue', () => {
    it('calculates additional revenue correctly', () => {
      expect(PriceCalculator.calculateAdditionalRevenue(2, 1000)).toBe(2000);
      expect(PriceCalculator.calculateAdditionalRevenue(2, 0)).toBe(0);
      expect(PriceCalculator.calculateAdditionalRevenue(2)).toBe(0);
    });
  });

  describe('formatDate', () => {
    it('formats date correctly', () => {
      expect(PriceCalculator.formatDate('2024-03-20')).toBe('March 20, 2024');
    });
  });

  describe('getTldPath', () => {
    it('formats TLD path correctly', () => {
      expect(PriceCalculator.getTldPath('.COM')).toBe('com');
      expect(PriceCalculator.getTldPath('.co.uk')).toBe('co.uk');
    });
  });
});