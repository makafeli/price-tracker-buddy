export interface PriceChange {
  tld: string;
  oldPrice: number;
  newPrice: number;
  priceChange: number;
  percentageChange: number;
  date: string;
  domainCount?: number;
}

export interface ChartDataPoint {
  date: string;
  price: number;
}