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
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 animate-fade-up">
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-sm text-secondary">{formattedDate}</span>
          <h3 className="text-2xl font-bold text-primary mt-1">{data.tld}</h3>
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
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-secondary">Old Price</p>
          <p className="text-lg font-semibold">${data.oldPrice.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-secondary">Change</p>
          <p
            className={`text-lg font-semibold ${
              isIncrease ? "text-danger" : "text-success"
            }`}
          >
            ${Math.abs(data.priceChange).toFixed(2)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-secondary">New Price</p>
          <p className="text-lg font-semibold">${data.newPrice.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};