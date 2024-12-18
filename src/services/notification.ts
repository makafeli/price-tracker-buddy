import type { PriceAlert, PriceChange } from '../types/price';

export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, unknown>;
  timestamp: string;
  type: string;
  priority: 'low' | 'normal' | 'high';
}

export interface NotificationChannel {
  type: 'email' | 'push' | 'in_app';
  enabled: boolean;
  config?: Record<string, unknown>;
}

export interface NotificationPreferences {
  channels: NotificationChannel[];
  frequency: 'instant' | 'daily' | 'weekly';
  quiet_hours?: {
    start: string; // HH:mm format
    end: string;   // HH:mm format
    timezone: string;
  };
}

class NotificationService {
  private static instance: NotificationService;
  private preferences: Map<string, NotificationPreferences> = new Map();
  private pendingNotifications: NotificationPayload[] = [];

  private constructor() {
    // Initialize with default preferences
    this.preferences.set('default', {
      channels: [
        { type: 'in_app', enabled: true },
        { type: 'email', enabled: false },
        { type: 'push', enabled: false },
      ],
      frequency: 'instant',
    });
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  setPreferences(userId: string, prefs: NotificationPreferences): void {
    this.preferences.set(userId, prefs);
  }

  getPreferences(userId: string): NotificationPreferences {
    return this.preferences.get(userId) || this.preferences.get('default')!;
  }

  private createNotificationPayload(
    priceChange: PriceChange,
    alert: PriceAlert
  ): NotificationPayload {
    const changeType = priceChange.priceChange < 0 ? 'decreased' : 'increased';
    const changeAmount = Math.abs(priceChange.priceChange);
    const changePercent = Math.abs(priceChange.percentageChange);

    return {
      title: `Price ${changeType} for ${priceChange.tld}`,
      body: `The price has ${changeType} by $${changeAmount.toFixed(2)} (${changePercent.toFixed(1)}%)`,
      data: {
        tld: priceChange.tld,
        oldPrice: priceChange.oldPrice,
        newPrice: priceChange.newPrice,
        alertType: alert.type,
      },
      timestamp: new Date().toISOString(),
      type: 'price_alert',
      priority: changePercent >= 10 ? 'high' : changePercent >= 5 ? 'normal' : 'low',
    };
  }

  private isWithinQuietHours(prefs: NotificationPreferences): boolean {
    if (!prefs.quiet_hours) return false;

    const now = new Date();
    const userTz = prefs.quiet_hours.timezone;
    const userTime = now.toLocaleTimeString('en-US', { timeZone: userTz, hour12: false });
    const [currentHour, currentMinute] = userTime.split(':').map(Number);

    const [startHour, startMinute] = prefs.quiet_hours.start.split(':').map(Number);
    const [endHour, endMinute] = prefs.quiet_hours.end.split(':').map(Number);

    const currentMinutes = currentHour * 60 + currentMinute;
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  }

  async processAlert(
    userId: string,
    priceChange: PriceChange,
    alert: PriceAlert
  ): Promise<void> {
    const prefs = this.getPreferences(userId);

    // Check if we should send notification based on preferences
    if (this.isWithinQuietHours(prefs)) {
      console.log('Notification queued - within quiet hours');
      this.pendingNotifications.push(this.createNotificationPayload(priceChange, alert));
      return;
    }

    const notification = this.createNotificationPayload(priceChange, alert);

    // Send to each enabled channel
    for (const channel of alert.notifyVia) {
      const channelConfig = prefs.channels.find(c => c.type === channel);
      if (!channelConfig?.enabled) continue;

      try {
        await this.sendNotification(channel, notification, channelConfig.config);
      } catch (error) {
        console.error(`Failed to send ${channel} notification:`, error);
      }
    }
  }

  private async sendNotification(
    channel: 'email' | 'push' | 'in_app',
    notification: NotificationPayload,
    config?: Record<string, unknown>
  ): Promise<void> {
    switch (channel) {
      case 'email':
        // TODO: Implement email sending
        console.log('Sending email notification:', notification);
        break;

      case 'push':
        // TODO: Implement push notification
        console.log('Sending push notification:', notification);
        break;

      case 'in_app':
        // Add to in-app notification center
        this.pendingNotifications.push(notification);
        break;

      default:
        throw new Error(`Unsupported notification channel: ${channel}`);
    }
  }

  getPendingNotifications(): NotificationPayload[] {
    return this.pendingNotifications;
  }

  clearNotifications(): void {
    this.pendingNotifications = [];
  }
}

export const notificationService = NotificationService.getInstance();