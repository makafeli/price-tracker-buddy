import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { monitoringService, monitoringInterceptor } from '../monitoring';

describe('MonitoringService', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('API call tracking', () => {
    it('should track API calls and calculate metrics', () => {
      // Track some API calls
      monitoringService.trackApiCall(100, true, false);  // Cache hit
      monitoringService.trackApiCall(150, false, false); // Cache miss
      monitoringService.trackApiCall(200, false, true);  // Error

      // Force metrics calculation
      vi.advanceTimersByTime(60000);

      const metrics = monitoringService.getMetrics();
      expect(metrics).toEqual({
        responseTime: 150, // Average of 100, 150, 200
        cacheHitRate: 33.33333333333333, // 1/3 calls were cache hits
        errorRate: 33.33333333333333, // 1/3 calls had errors
        apiCalls: 3,
      });
    });

    it('should maintain performance over time', () => {
      // Simulate many API calls
      for (let i = 0; i < 1000; i++) {
        monitoringService.trackApiCall(100, i % 2 === 0, i % 10 === 0);
      }

      vi.advanceTimersByTime(60000);
      const metrics = monitoringService.getMetrics();

      expect(metrics.responseTime).toBe(100);
      expect(metrics.cacheHitRate).toBe(50); // Half were cache hits
      expect(metrics.errorRate).toBe(10); // 10% were errors
      expect(metrics.apiCalls).toBe(1000);
    });
  });

  describe('Error logging', () => {
    it('should log and retrieve errors', () => {
      const error = {
        code: 'TEST_ERROR',
        message: 'Test error message',
        context: { test: true },
        severity: 'high' as const,
      };

      monitoringService.logError(error);
      const errors = monitoringService.getRecentErrors();

      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatchObject({
        ...error,
        timestamp: expect.any(String),
      });
    });

    it('should filter errors by severity', () => {
      const errors = [
        { code: 'ERROR1', message: 'Error 1', context: {}, severity: 'low' as const },
        { code: 'ERROR2', message: 'Error 2', context: {}, severity: 'high' as const },
        { code: 'ERROR3', message: 'Error 3', context: {}, severity: 'high' as const },
      ];

      errors.forEach(error => monitoringService.logError(error));

      const highErrors = monitoringService.getRecentErrors('high');
      expect(highErrors).toHaveLength(2);
      expect(highErrors.every(e => e.severity === 'high')).toBe(true);
    });

    it('should limit error history', () => {
      // Log more than 1000 errors
      for (let i = 0; i < 1100; i++) {
        monitoringService.logError({
          code: `ERROR${i}`,
          message: `Error ${i}`,
          context: {},
          severity: 'low',
        });
      }

      const errors = monitoringService.getRecentErrors();
      expect(errors).toHaveLength(1000);
      expect(errors[0].code).toBe('ERROR100'); // First 100 should be dropped
    });
  });

  describe('Health status', () => {
    it('should report healthy status when error rate is low', () => {
      // Simulate mostly successful calls
      for (let i = 0; i < 100; i++) {
        monitoringService.trackApiCall(100, false, i < 2); // 2% error rate
      }

      vi.advanceTimersByTime(60000);
      const health = monitoringService.getHealthStatus();

      expect(health).toMatchObject({
        status: 'healthy',
        timestamp: expect.any(String),
        uptime: expect.any(Number),
        metrics: expect.objectContaining({
          errorRate: 2,
        }),
      });
    });

    it('should report degraded status when error rate is high', () => {
      // Simulate high error rate
      for (let i = 0; i < 100; i++) {
        monitoringService.trackApiCall(100, false, i < 10); // 10% error rate
      }

      vi.advanceTimersByTime(60000);
      const health = monitoringService.getHealthStatus();

      expect(health).toMatchObject({
        status: 'degraded',
        timestamp: expect.any(String),
        uptime: expect.any(Number),
        metrics: expect.objectContaining({
          errorRate: 10,
        }),
      });
    });
  });

  describe('Monitoring interceptor', () => {
    it('should track successful requests', async () => {
      const config = {};
      const response = {
        config: {},
        request: { fromCache: true },
      };

      // Apply request interceptor
      const configWithMetadata = monitoringInterceptor.request(config);
      expect(configWithMetadata.metadata.startTime).toBeDefined();

      // Simulate some time passing
      vi.advanceTimersByTime(150);

      // Apply response interceptor
      monitoringInterceptor.response(response);

      vi.advanceTimersByTime(60000);
      const metrics = monitoringService.getMetrics();

      expect(metrics.responseTime).toBeGreaterThan(0);
      expect(metrics.cacheHitRate).toBeGreaterThan(0);
    });

    it('should track failed requests', async () => {
      const config = {};
      const error = {
        config: {},
        response: { status: 500 },
        message: 'Test error',
      };

      // Apply request interceptor
      const configWithMetadata = monitoringInterceptor.request(config);

      // Simulate some time passing
      vi.advanceTimersByTime(150);

      // Apply error interceptor
      expect(() => monitoringInterceptor.error(error)).toThrow();

      vi.advanceTimersByTime(60000);
      const metrics = monitoringService.getMetrics();
      const errors = monitoringService.getRecentErrors();

      expect(metrics.errorRate).toBeGreaterThan(0);
      expect(errors).toHaveLength(1);
      expect(errors[0].severity).toBe('high');
    });
  });
});