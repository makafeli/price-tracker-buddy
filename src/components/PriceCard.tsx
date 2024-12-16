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
      <div className="group relative overflow-hidden rounded-xl p-6 shadow-lg transition-all duration-300 animate-fade-up border-2 dark:border-white/20 border-white/30 hover:border-white/40 dark:hover:border-white/40 bg-white/10 hover:bg-white/15 dark:bg-black/20 dark:hover:bg-black/30 backdrop-blur-md">
        <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-2xl transform group-hover:scale-150 transition-transform duration-500" />
        
        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-sm text-white/70">{formattedDate}</span>
              <h3 className="text-2xl font-bold text-white mt-1 group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-blue-300 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                {data.tld}
              </h3>
            </div>
            <div className={`flex items-center ${isIncrease ? "text-red-400" : "text-emerald-400"} px-3 py-1 rounded-full bg-white/10`}>
              {isIncrease ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
              <span className="font-semibold ml-1 text-sm">{data.percentageChange.toFixed(2)}%</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 p-4 bg-white/5 dark:bg-black/20 rounded-lg">
            <div className="text-center">
              <p className="text-xs text-white/60 mb-1">Current Price</p>
              <p className="text-base font-semibold text-white">{PriceCalculator.formatCurrency(data.oldPrice)}</p>
            </div>
            <div className="text-center px-2 py-1 rounded-md bg-white/10 dark:bg-black/30 shadow-sm">
              <p className="text-xs text-white/60 mb-1">Change</p>
              <p className={`text-base font-semibold ${isIncrease ? "text-red-400" : "text-emerald-400"}`}>
                {PriceCalculator.formatCurrency(Math.abs(data.priceChange))}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-white/60 mb-1">New Price</p>
              <p className="text-base font-semibold text-white">{PriceCalculator.formatCurrency(data.newPrice)}</p>
            </div>
          </div>
          
          {data.domainCount && (
            <div className="mt-4 p-4 bg-white/5 dark:bg-black/20 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-xs text-white/60 mb-1">Domain Count</p>
                  <p className="text-base font-semibold text-white">
                    {PriceCalculator.formatNumber(data.domainCount)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-white/60 mb-1">Additional Revenue</p>
                  <p className="text-base font-semibold text-white">
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