import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { Link } from "react-router-dom";
import type { PriceChange } from "../types/price";
import { PriceCalculator } from "../utils/priceCalculations";

interface PriceCardProps {
  readonly data: PriceChange;
}

export const PriceCard = ({ data }: PriceCardProps): JSX.Element => {
  const isIncrease = data.priceChange > 0;
  const formattedDate = PriceCalculator.formatDate(data.date);
  const additionalRevenue = PriceCalculator.calculateAdditionalRevenue(data.priceChange, data.domainCount);
  const tldPath = PriceCalculator.getTldPath(data.tld);

  return (
    <Link to={`/tld/${tldPath}`} className="block">
      <div className="group relative overflow-hidden rounded-xl p-6 shadow-lg transition-all duration-300 animate-fade-up border-2 border-border hover:border-primary/40 bg-card hover:bg-accent/5 backdrop-blur-md">
        <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-2xl transform group-hover:scale-150 transition-transform duration-500" />
        
        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-sm text-muted-foreground">{formattedDate}</span>
              <h3 className="text-2xl font-bold text-foreground mt-1 group-hover:text-primary transition-all duration-300">
                {data.tld}
              </h3>
            </div>
            <div className={`flex items-center ${isIncrease ? "text-red-500" : "text-emerald-500"} px-3 py-1 rounded-full bg-accent/50`}>
              {isIncrease ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
              <span className="font-semibold ml-1 text-sm">{data.percentageChange.toFixed(2)}%</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 p-4 bg-accent/50 rounded-lg">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Current Price</p>
              <p className="text-base font-semibold text-foreground">{PriceCalculator.formatCurrency(data.oldPrice)}</p>
            </div>
            <div className="text-center px-2 py-1 rounded-md bg-accent shadow-sm">
              <p className="text-xs text-muted-foreground mb-1">Change</p>
              <p className={`text-base font-semibold ${isIncrease ? "text-red-500" : "text-emerald-500"}`}>
                {PriceCalculator.formatCurrency(Math.abs(data.priceChange))}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">New Price</p>
              <p className="text-base font-semibold text-foreground">{PriceCalculator.formatCurrency(data.newPrice)}</p>
            </div>
          </div>
          
          {data.domainCount && (
            <div className="mt-4 p-4 bg-accent/50 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Domain Count</p>
                  <p className="text-base font-semibold text-foreground">
                    {PriceCalculator.formatNumber(data.domainCount)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Additional Revenue</p>
                  <p className="text-base font-semibold text-foreground">
                    {PriceCalculator.formatCurrency(additionalRevenue)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};