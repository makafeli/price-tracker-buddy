import { describe, it, expect, vi, beforeEach } from 'vitest';
import { notificationService } from '../notification';
import type { PriceAlert, PriceChange } from '../../types/price';
import type { NotificationPreferences } from '../notification';

describe('NotificationService', () => {
  const userId = 'test-user';
  const mockPriceChange: PriceChange = {
    id: '1',
    tld: '.com',
    oldPrice: 100,
    newPrice: 90,
    priceChange: -10,
    percentageChange: -10,
    date: '2024-01-01',
    history: [],
    lastChecked: '2024-01-01T00:00:00Z',
    nextCheck: '2024-01-02T00:00:00Z',
    sources: ['test'],
  };

  const mockAlert: PriceAlert = {
    type: 'price_drop',
    percentage: 5,
    enabled: true,
    notifyVia: ['email', 'in_app'],
  };

  beforeEach(() => {
    // Reset notification service state
    notificationService.clearNotifications();
  });

  describe('preferences management', () => {
    it('should provide default preferences', () => {
      const prefs = notificationService.getPreferences(userId);
      expect(prefs.channels).toContainEqual({
        type: 'in_app',
        enabled: true,
      });
      expect(prefs.frequency).toBe('instant');
    });

    it('should allow setting custom preferences', () => {
      const customPrefs: NotificationPreferences = {
        channels: [
          { type: 'email', enabled: true },
          { type: 'push', enabled: false },
          { type: 'in_app', enabled: true },
        ],
        frequency: 'daily',
        quiet_hours: {
          start: '22:00',
          end: '08:00',
          timezone: 'America/New_York',
        },
      };

      notificationService.setPreferences(userId, customPrefs);
      expect(notificationService.getPreferences(userId)).toEqual(customPrefs);
    });
  });

  describe('alert processing', () => {
    it('should create appropriate notification for price drop', async () => {
      await notificationService.processAlert(userId, mockPriceChange, mockAlert);
      
      const notifications = notificationService.getPendingNotifications();
      expect(notifications).toHaveLength(1);
      expect(notifications[0]).toMatchObject({
        title: expect.stringContaining('decreased'),
        body: expect.stringContaining('$10.00'),
        type: 'price_alert',
        priority: 'high',
        data: {
          tld: '.com',
          oldPrice: 100,
          newPrice: 90,
          alertType: 'price_drop',
        },
      });
    });

    it('should respect quiet hours', async () => {
      const quietPrefs: NotificationPreferences = {
        channels: [{ type: 'in_app', enabled: true }],
        frequency: 'instant',
        quiet_hours: {
          start: '00:00',
          end: '23:59', // Almost full day
          timezone: 'UTC',
        },
      };
      notificationService.setPreferences(userId, quietPrefs);

      await notificationService.processAlert(userId, mockPriceChange, mockAlert);
      
      const notifications = notificationService.getPendingNotifications();
      expect(notifications).toHaveLength(1);
      expect(notifications[0]).toMatchObject({
        title: expect.stringContaining('decreased'),
        data: expect.objectContaining({
          tld: '.com',
        }),
      });
    });

    it('should set appropriate priority based on percentage change', async () => {
      const smallChange: PriceChange = {
        ...mockPriceChange,
        newPrice: 98,
        priceChange: -2,
        percentageChange: -2,
      };

      await notificationService.processAlert(userId, smallChange, mockAlert);
      
      const notifications = notificationService.getPendingNotifications();
      expect(notifications).toHaveLength(1);
      expect(notifications[0].priority).toBe('low');
    });
  });

  describe('notification management', () => {
    it('should accumulate notifications', async () => {
      const changes: PriceChange[] = [
        mockPriceChange,
        {
          ...mockPriceChange,
          id: '2',
          tld: '.net',
          newPrice: 85,
          priceChange: -15,
          percentageChange: -15,
        },
      ];

      for (const change of changes) {
        await notificationService.processAlert(userId, change, mockAlert);
      }

      const notifications = notificationService.getPendingNotifications();
      expect(notifications).toHaveLength(2);
      expect(notifications.map(n => n.data?.tld)).toEqual(['.com', '.net']);
    });

    it('should clear notifications', async () => {
      await notificationService.processAlert(userId, mockPriceChange, mockAlert);
      expect(notificationService.getPendingNotifications()).toHaveLength(1);

      notificationService.clearNotifications();
      expect(notificationService.getPendingNotifications()).toHaveLength(0);
    });
  });
});