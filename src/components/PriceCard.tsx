import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { PriceChange } from "../services/api";

interface PriceCardProps {
  data: PriceChange;
}

export const PriceCard = ({ data }: PriceCardProps) => {
  const isIncrease = data.priceChange > 0;
  const formattedDate = new Date(data.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="group bg-white rounded-xl p-6 shadow-sm border border-primary/5 hover:shadow-md transition-all duration-300 animate-fade-up backdrop-blur-sm hover:border-primary/10">
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-sm text-secondary/70">{formattedDate}</span>
          <h3 className="text-2xl font-bold text-primary mt-1 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary/70 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
            {data.tld}
          </h3>
        </div>
        <div
          className={`flex items-center ${
            isIncrease ? "text-danger" : "text-success"
          }`}
        >
          {isIncrease ? (
            <ArrowUpIcon className="w-5 h-5" />
          ) : (
            <ArrowDownIcon className="w-5 h-5" />
          )}
          <span className="font-semibold ml-1">
            {data.percentageChange.toFixed(2)}%
          </span>
        </div>
      </div>
      <div className="flex justify-between items-center p-4 bg-primary/[0.02] rounded-lg">
        <div>
          <p className="text-sm text-secondary/70">Old Price</p>
          <p className="text-lg font-semibold text-primary">
            ${data.oldPrice.toFixed(2)}
          </p>
        </div>
        <div className="text-center px-4 py-2 rounded-md bg-white shadow-sm">
          <p className="text-sm text-secondary/70">Change</p>
          <p
            className={`text-lg font-semibold ${
              isIncrease ? "text-danger" : "text-success"
            }`}
          >
            ${Math.abs(data.priceChange).toFixed(2)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-secondary/70">New Price</p>
          <p className="text-lg font-semibold text-primary">
            ${data.newPrice.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};