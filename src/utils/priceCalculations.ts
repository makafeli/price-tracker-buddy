import { PriceChange, ChartDataPoint } from "../types/price";

export const calculateAdditionalRevenue = (priceChange: number, domainCount?: number): number => {
  return domainCount ? priceChange * domainCount : 0;
};

export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    style: 'currency',
    currency: 'USD'
  });
};

export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

export const transformToChartData = (priceChanges: PriceChange[]): ChartDataPoint[] => {
  return priceChanges
    .map((change) => ({
      date: new Date(change.date).toLocaleDateString(),
      price: change.newPrice,
    }))
    .reverse();
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const getTldPath = (tld: string): string => {
  return tld.replace(".", "").toLowerCase();
};