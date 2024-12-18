interface PerformanceMetrics {
  responseTime: number;
  cacheHitRate: number;
  errorRate: number;
  apiCalls: number;
}

interface ErrorEvent {
  code: string;
  message: string;
  timestamp: string;
  context: Record<string, unknown>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

class MonitoringService {
  private static instance: MonitoringService;
  private metrics: PerformanceMetrics = {
    responseTime: 0,
    cacheHitRate: 0,
    errorRate: 0,
    apiCalls: 0,
  };
  private errors: ErrorEvent[] = [];
  private apiCallsTotal = 0;
  private apiCallsError = 0;
  private cacheHits = 0;
  private responseTimes: number[] = [];

  private constructor() {
    // Start periodic metrics calculation
    setInterval(() => this.calculateMetrics(), 60000); // Every minute
  }

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  trackApiCall(duration: number, isCacheHit: boolean, isError: boolean): void {
    this.apiCallsTotal++;
    if (isError) this.apiCallsError++;
    if (isCacheHit) this.cacheHits++;
    this.responseTimes.push(duration);

    // Keep only last hour of response times
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    this.responseTimes = this.responseTimes.filter(
      (_, index) => index > this.responseTimes.length - 3600
    );
  }

  logError(error: Omit<ErrorEvent, 'timestamp'>): void {
    this.errors.push({
      ...error,
      timestamp: new Date().toISOString(),
    });

    // Keep only last 1000 errors
    if (this.errors.length > 1000) {
      this.errors.shift();
    }

    // Log critical errors to external service
    if (error.severity === 'critical') {
      this.notifyExternalService(error);
    }
  }

  private calculateMetrics(): void {
    // Calculate average response time
    const avgResponseTime = this.responseTimes.length > 0
      ? this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length
      : 0;

    // Calculate cache hit rate
    const cacheHitRate = this.apiCallsTotal > 0
      ? (this.cacheHits / this.apiCallsTotal) * 100
      : 0;

    // Calculate error rate
    const errorRate = this.apiCallsTotal > 0
      ? (this.apiCallsError / this.apiCallsTotal) * 100
      : 0;

    this.metrics = {
      responseTime: avgResponseTime,
      cacheHitRate,
      errorRate,
      apiCalls: this.apiCallsTotal,
    };

    // Reset counters
    this.apiCallsTotal = 0;
    this.apiCallsError = 0;
    this.cacheHits = 0;
    this.responseTimes = [];
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  getRecentErrors(severity?: ErrorEvent['severity']): ErrorEvent[] {
    return severity
      ? this.errors.filter(e => e.severity === severity)
      : [...this.errors];
  }

  private async notifyExternalService(error: Omit<ErrorEvent, 'timestamp'>): Promise<void> {
    // TODO: Implement external error reporting service integration
    // Example: Sentry, LogRocket, etc.
    console.error('Critical error:', error);
  }

  // Health check endpoint data
  getHealthStatus(): Record<string, unknown> {
    const now = new Date();
    return {
      status: this.metrics.errorRate < 5 ? 'healthy' : 'degraded',
      timestamp: now.toISOString(),
      uptime: process.uptime(),
      metrics: this.metrics,
      lastError: this.errors[this.errors.length - 1] || null,
      version: process.env.VITE_APP_VERSION || '1.0.0',
    };
  }
}

export const monitoringService = MonitoringService.getInstance();

// Axios interceptor for monitoring
export const monitoringInterceptor = {
  request: (config: any) => {
    config.metadata = { startTime: Date.now() };
    return config;
  },
  response: (response: any) => {
    const duration = Date.now() - response.config.metadata.startTime;
    const isCacheHit = response.request?.fromCache || false;
    monitoringService.trackApiCall(duration, isCacheHit, false);
    return response;
  },
  error: (error: any) => {
    const duration = Date.now() - error.config.metadata.startTime;
    monitoringService.trackApiCall(duration, false, true);
    monitoringService.logError({
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message,
      context: {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
      },
      severity: error.response?.status >= 500 ? 'high' : 'medium',
    });
    throw error;
  },
};