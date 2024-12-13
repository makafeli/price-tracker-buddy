import { describe, it, expect } from 'vitest';
import { PriceCalculator } from '../priceCalculations';

describe('PriceCalculator', () => {
  describe('formatCurrency', () => {
    it('formats currency correctly', () => {
      expect(PriceCalculator.formatCurrency(10)).toBe('$10.00');
      expect(PriceCalculator.formatCurrency(10.5)).toBe('$10.50');
    });
  });

  describe('formatNumber', () => {
    it('formats numbers with commas', () => {
      expect(PriceCalculator.formatNumber(1000)).toBe('1,000');
      expect(PriceCalculator.formatNumber(1000000)).toBe('1,000,000');
    });
  });

  describe('calculateAdditionalRevenue', () => {
    it('calculates additional revenue correctly', () => {
      expect(PriceCalculator.calculateAdditionalRevenue(2, 1000)).toBe(2000);
    });
  });
});