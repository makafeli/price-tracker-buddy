import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";

const TldDetail = () => {
  const { tld } = useParams();
  const normalizedTld = tld ? `.${tld.toUpperCase()}` : "";

  const { data: priceChanges, isLoading, error } = useQuery({
    queryKey: ["tld-detail", normalizedTld],
    queryFn: () => api.searchTLD(normalizedTld),
  });

  const priceChange = priceChanges?.[0];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
      </div>
    );
  }

  if (error || !priceChange) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Link to="/" className="flex items-center text-primary/70 hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Price Changes
        </Link>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            TLD not found or error loading data
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Link to="/" className="flex items-center text-primary/70 hover:text-primary mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Price Changes
      </Link>
      
      <div className="bg-white rounded-xl p-8 shadow-sm border border-primary/5">
        <h1 className="text-4xl font-bold text-primary mb-2">{priceChange.tld}</h1>
        <p className="text-secondary/70 mb-8">
          Price change history and details
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-primary/[0.02] rounded-lg">
            <p className="text-sm text-secondary/70 mb-1">Current Price</p>
            <p className="text-2xl font-bold text-primary">
              ${priceChange.newPrice.toFixed(2)}
            </p>
          </div>

          <div className="p-6 bg-primary/[0.02] rounded-lg">
            <p className="text-sm text-secondary/70 mb-1">Price Change</p>
            <p className={`text-2xl font-bold ${
              priceChange.priceChange > 0 ? "text-danger" : "text-success"
            }`}>
              ${Math.abs(priceChange.priceChange).toFixed(2)}
            </p>
          </div>

          <div className="p-6 bg-primary/[0.02] rounded-lg">
            <p className="text-sm text-secondary/70 mb-1">Percentage Change</p>
            <p className={`text-2xl font-bold ${
              priceChange.percentageChange > 0 ? "text-danger" : "text-success"
            }`}>
              {priceChange.percentageChange.toFixed(2)}%
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-primary mb-4">Price Change Details</h2>
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-primary/5">
              <span className="text-secondary/70">Previous Price</span>
              <span className="font-medium text-primary">
                ${priceChange.oldPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-primary/5">
              <span className="text-secondary/70">New Price</span>
              <span className="font-medium text-primary">
                ${priceChange.newPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-primary/5">
              <span className="text-secondary/70">Change Date</span>
              <span className="font-medium text-primary">
                {new Date(priceChange.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TldDetail;