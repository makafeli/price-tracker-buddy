import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTheme } from "@/hooks/use-theme";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis } from "recharts";

const TldDetail = () => {
  const { tld } = useParams();
  const { theme } = useTheme();
  const normalizedTld = tld ? `.${tld.toUpperCase()}` : "";

  const { data: priceChanges, isLoading, error } = useQuery({
    queryKey: ["tld-detail", normalizedTld],
    queryFn: () => api.searchTLD(normalizedTld),
  });

  const priceChange = priceChanges?.[0];

  // Transform data for the chart
  const chartData = priceChanges?.map((change) => ({
    date: new Date(change.date).toLocaleDateString(),
    price: change.newPrice,
  })).reverse();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
      </div>
    );
  }

  if (error || !priceChange) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 dark:bg-gray-900">
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

  // Calculate additional revenue
  const additionalRevenue = priceChange.domainCount
    ? priceChange.priceChange * priceChange.domainCount
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 dark:bg-gray-900 transition-colors">
      <Link to="/" className="flex items-center text-primary/70 hover:text-primary mb-6 dark:text-white/70 dark:hover:text-white">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Price Changes
      </Link>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-primary/5 dark:border-white/5">
        <h1 className="text-4xl font-bold text-primary dark:text-white mb-2">{priceChange.tld}</h1>
        <p className="text-secondary/70 dark:text-gray-400 mb-8">
          Price change history and details
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-primary/[0.02] dark:bg-white/[0.02] rounded-lg">
            <p className="text-sm text-secondary/70 dark:text-gray-400 mb-1">Current Price</p>
            <p className="text-2xl font-bold text-primary dark:text-white">
              ${priceChange.newPrice.toFixed(2)}
            </p>
          </div>

          <div className="p-6 bg-primary/[0.02] dark:bg-white/[0.02] rounded-lg">
            <p className="text-sm text-secondary/70 dark:text-gray-400 mb-1">Price Change</p>
            <p className={`text-2xl font-bold ${
              priceChange.priceChange > 0 ? "text-danger" : "text-success"
            }`}>
              ${Math.abs(priceChange.priceChange).toFixed(2)}
            </p>
          </div>

          <div className="p-6 bg-primary/[0.02] dark:bg-white/[0.02] rounded-lg">
            <p className="text-sm text-secondary/70 dark:text-gray-400 mb-1">Percentage Change</p>
            <p className={`text-2xl font-bold ${
              priceChange.percentageChange > 0 ? "text-danger" : "text-success"
            }`}>
              {priceChange.percentageChange.toFixed(2)}%
            </p>
          </div>
        </div>

        {priceChange.domainCount && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="p-6 bg-primary/[0.02] dark:bg-white/[0.02] rounded-lg">
              <p className="text-sm text-secondary/70 dark:text-gray-400 mb-1">Total Domains</p>
              <p className="text-2xl font-bold text-primary dark:text-white">
                {priceChange.domainCount.toLocaleString()}
              </p>
            </div>

            <div className="p-6 bg-primary/[0.02] dark:bg-white/[0.02] rounded-lg">
              <p className="text-sm text-secondary/70 dark:text-gray-400 mb-1">Additional Revenue</p>
              <p className="text-2xl font-bold text-primary dark:text-white">
                ${additionalRevenue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        )}

        {chartData && chartData.length > 0 && (
          <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold text-primary dark:text-white mb-4">Price History</h2>
            <ChartContainer
              className="w-full h-[300px]"
              config={{
                line: {
                  color: theme === 'dark' ? '#60A5FA' : '#2563EB',
                },
              }}
            >
              <LineChart data={chartData}>
                <XAxis
                  dataKey="date"
                  stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                  fontSize={12}
                />
                <YAxis
                  stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                  fontSize={12}
                  tickFormatter={(value) => `$${value}`}
                />
                <ChartTooltip
                  content={({ active, payload }) => (
                    <ChartTooltipContent
                      active={active}
                      payload={payload}
                      formatter={(value) => `$${value}`}
                    />
                  )}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  strokeWidth={2}
                  dot={{ strokeWidth: 2 }}
                />
              </LineChart>
            </ChartContainer>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-primary dark:text-white mb-4">Price Change Details</h2>
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-primary/5 dark:border-white/5">
              <span className="text-secondary/70 dark:text-gray-400">Previous Price</span>
              <span className="font-medium text-primary dark:text-white">
                ${priceChange.oldPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-primary/5 dark:border-white/5">
              <span className="text-secondary/70 dark:text-gray-400">New Price</span>
              <span className="font-medium text-primary dark:text-white">
                ${priceChange.newPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-primary/5 dark:border-white/5">
              <span className="text-secondary/70 dark:text-gray-400">Change Date</span>
              <span className="font-medium text-primary dark:text-white">
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