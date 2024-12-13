export class PriceCalculator {
  static calculateAdditionalRevenue(priceChange: number, domainCount?: number): number {
    return domainCount ? priceChange * domainCount : 0;
  }

  static formatCurrency(amount: number): string {
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      style: 'currency',
      currency: 'USD'
    });
  }

  static formatNumber(num: number): string {
    return num.toLocaleString();
  }

  static transformToChartData(priceChanges: readonly PriceChange[]): readonly ChartDataPoint[] {
    return [...priceChanges]
      .map((change) => new PriceChangeModel(change).toChartDataPoint())
      .reverse();
  }

  static formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  static getTldPath(tld: string): string {
    return tld.replace(".", "").toLowerCase();
  }
}