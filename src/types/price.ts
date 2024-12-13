export interface PriceChange {
  readonly tld: string;
  readonly oldPrice: number;
  readonly newPrice: number;
  readonly priceChange: number;
  readonly percentageChange: number;
  readonly date: string;
  readonly domainCount?: number;
}

export interface ChartDataPoint {
  readonly date: string;
  readonly price: number;
}

export class PriceChangeModel implements PriceChange {
  readonly tld: string;
  readonly oldPrice: number;
  readonly newPrice: number;
  readonly priceChange: number;
  readonly percentageChange: number;
  readonly date: string;
  readonly domainCount?: number;

  constructor(data: PriceChange) {
    this.tld = data.tld;
    this.oldPrice = data.oldPrice;
    this.newPrice = data.newPrice;
    this.priceChange = data.priceChange;
    this.percentageChange = data.percentageChange;
    this.date = data.date;
    this.domainCount = data.domainCount;
  }

  static fromJSON(json: PriceChange): PriceChangeModel {
    return new PriceChangeModel(json);
  }

  toChartDataPoint(): ChartDataPoint {
    return {
      date: new Date(this.date).toLocaleDateString(),
      price: this.newPrice,
    };
  }
}