export interface PriceHistory {
  readonly date: string;
  readonly price: number;
  readonly source: string;
}

export interface PriceAlert {
  readonly type: 'price_drop' | 'price_increase' | 'threshold';
  readonly threshold?: number;
  readonly percentage?: number;
  readonly enabled: boolean;
  readonly notifyVia: ('email' | 'push' | 'in_app')[];
}

export interface PriceChange {
  readonly id: string;
  readonly tld: string;
  readonly oldPrice: number;
  readonly newPrice: number;
  readonly priceChange: number;
  readonly percentageChange: number;
  readonly date: string;
  readonly domainCount?: number;
  readonly history: PriceHistory[];
  readonly alerts?: PriceAlert[];
  readonly lastChecked: string;
  readonly nextCheck: string;
  readonly sources: string[];
  readonly metadata?: Record<string, unknown>;
}

export interface ChartDataPoint {
  readonly date: string;
  readonly price: number;
  readonly source?: string;
}

export interface PriceAnalytics {
  readonly minPrice: number;
  readonly maxPrice: number;
  readonly avgPrice: number;
  readonly priceVolatility: number;
  readonly trendDirection: 'up' | 'down' | 'stable';
  readonly confidence: number;
}

export class PriceChangeModel implements PriceChange {
  readonly id: string;
  readonly tld: string;
  readonly oldPrice: number;
  readonly newPrice: number;
  readonly priceChange: number;
  readonly percentageChange: number;
  readonly date: string;
  readonly domainCount?: number;
  readonly history: PriceHistory[];
  readonly alerts?: PriceAlert[];
  readonly lastChecked: string;
  readonly nextCheck: string;
  readonly sources: string[];
  readonly metadata?: Record<string, unknown>;

  constructor(data: Partial<PriceChange>) {
    this.id = data.id || crypto.randomUUID();
    this.tld = data.tld!;
    this.oldPrice = data.oldPrice!;
    this.newPrice = data.newPrice!;
    this.priceChange = data.priceChange!;
    this.percentageChange = data.percentageChange!;
    this.date = data.date!;
    this.domainCount = data.domainCount;
    this.history = data.history || [];
    this.alerts = data.alerts || [];
    this.lastChecked = data.lastChecked || new Date().toISOString();
    this.nextCheck = data.nextCheck || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    this.sources = data.sources || ['default'];
    this.metadata = data.metadata;
  }

  static fromJSON(json: Partial<PriceChange>): PriceChangeModel {
    return new PriceChangeModel(json);
  }

  toChartDataPoint(): ChartDataPoint {
    return {
      date: new Date(this.date).toLocaleDateString(),
      price: this.newPrice,
      source: this.sources[0],
    };
  }

  getHistoryChartData(): ChartDataPoint[] {
    return [
      ...this.history.map(h => ({
        date: new Date(h.date).toLocaleDateString(),
        price: h.price,
        source: h.source,
      })),
      this.toChartDataPoint(),
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  getAnalytics(): PriceAnalytics {
    const prices = this.getHistoryChartData().map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    
    // Calculate price volatility (standard deviation)
    const variance = prices.reduce((acc, p) => acc + Math.pow(p - avgPrice, 2), 0) / prices.length;
    const priceVolatility = Math.sqrt(variance);

    // Determine trend direction
    const recentPrices = prices.slice(-3);
    const trendDirection = recentPrices[recentPrices.length - 1] > recentPrices[0] 
      ? 'up' 
      : recentPrices[recentPrices.length - 1] < recentPrices[0] 
        ? 'down' 
        : 'stable';

    // Calculate confidence based on data points and consistency
    const confidence = Math.min(
      (this.history.length / 30) * 0.5 + // More history = higher confidence
      (1 - priceVolatility / avgPrice) * 0.5, // Less volatility = higher confidence
      1
    );

    return {
      minPrice,
      maxPrice,
      avgPrice,
      priceVolatility,
      trendDirection,
      confidence,
    };
  }

  shouldNotify(alert: PriceAlert): boolean {
    if (!alert.enabled) return false;

    switch (alert.type) {
      case 'price_drop':
        return this.priceChange < 0 && 
          (!alert.percentage || Math.abs(this.percentageChange) >= alert.percentage);
      
      case 'price_increase':
        return this.priceChange > 0 && 
          (!alert.percentage || this.percentageChange >= alert.percentage);
      
      case 'threshold':
        return alert.threshold !== undefined && 
          (this.newPrice <= alert.threshold || this.oldPrice > alert.threshold);
      
      default:
        return false;
    }
  }
}