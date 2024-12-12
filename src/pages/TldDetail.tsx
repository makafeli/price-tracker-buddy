import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTheme } from "@/hooks/use-theme";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis } from "recharts";
import { api } from "../services/api";
import { CHART_COLORS, THEME_STYLES } from "../constants/theme";
import { calculateAdditionalRevenue, formatCurrency, formatNumber, transformToChartData } from "../utils/priceCalculations";

const TldDetail = () => {
  const { tld } = useParams();
  const { theme } = useTheme();
  const normalizedTld = tld ? `.${tld.toUpperCase()}` : "";
  const themeStyles = theme === 'dark' ? THEME_STYLES.dark : THEME_STYLES.light;
  const chartColors = theme === 'dark' ? CHART_COLORS.dark : CHART_COLORS.light;

  const { data: priceChanges, isLoading, error } = useQuery({
    queryKey: ["tld-detail", normalizedTld],
    queryFn: () => api.searchTLD(normalizedTld),
  });

  const priceChange = priceChanges?.[0];
  const chartData = priceChanges ? transformToChartData(priceChanges) : [];

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
          <AlertDescription>TLD not found or error loading data</AlertDescription>
        </Alert>
      </div>
    );
  }

  const additionalRevenue = calculateAdditionalRevenue(priceChange.priceChange, priceChange.domainCount);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 dark:bg-gray-900 transition-colors">
      <Link to="/" className={`flex items-center ${themeStyles.muted} hover:${themeStyles.text} mb-6`}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Price Changes
      </Link>
      
      <div className={`${themeStyles.background} rounded-xl p-8 shadow-sm border ${themeStyles.border}`}>
        <h1 className={`text-4xl font-bold ${themeStyles.text} mb-2`}>{priceChange.tld}</h1>
        <p className={`${themeStyles.muted} mb-8`}>Price change history and details</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-primary/[0.02] dark:bg-white/[0.02] rounded-lg">
            <p className={`text-sm ${themeStyles.muted} mb-1`}>Current Price</p>
            <p className={`text-2xl font-bold ${themeStyles.text}`}>
              {formatCurrency(priceChange.oldPrice)}
            </p>
          </div>

          <div className="p-6 bg-primary/[0.02] dark:bg-white/[0.02] rounded-lg">
            <p className={`text-sm ${themeStyles.muted} mb-1`}>Price Change</p>
            <p className={`text-2xl font-bold ${priceChange.priceChange > 0 ? "text-danger" : "text-success"}`}>
              {formatCurrency(Math.abs(priceChange.priceChange))}
            </p>
          </div>

          <div className="p-6 bg-primary/[0.02] dark:bg-white/[0.02] rounded-lg">
            <p className={`text-sm ${themeStyles.muted} mb-1`}>New Price</p>
            <p className={`text-2xl font-bold ${themeStyles.text}`}>
              {formatCurrency(priceChange.newPrice)}
            </p>
          </div>
        </div>

        {priceChange.domainCount && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="p-6 bg-primary/[0.02] dark:bg-white/[0.02] rounded-lg">
              <p className={`text-sm ${themeStyles.muted} mb-1`}>Total Domains</p>
              <p className={`text-2xl font-bold ${themeStyles.text}`}>
                {formatNumber(priceChange.domainCount)}
              </p>
            </div>

            <div className="p-6 bg-primary/[0.02] dark:bg-white/[0.02] rounded-lg">
              <p className={`text-sm ${themeStyles.muted} mb-1`}>Additional Revenue</p>
              <p className={`text-2xl font-bold ${themeStyles.text}`}>
                {formatCurrency(additionalRevenue)}
              </p>
            </div>
          </div>
        )}

        {chartData.length > 0 && (
          <div className={`mt-8 p-4 ${themeStyles.background} rounded-lg`}>
            <h2 className={`text-xl font-semibold ${themeStyles.text} mb-4`}>Price History</h2>
            <ChartContainer className="w-full h-[300px]" config={{ line: { color: chartColors.line } }}>
              <LineChart data={chartData}>
                <XAxis dataKey="date" stroke={chartColors.text} fontSize={12} />
                <YAxis
                  stroke={chartColors.text}
                  fontSize={12}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <ChartTooltip
                  content={({ active, payload }) => (
                    <ChartTooltipContent
                      active={active}
                      payload={payload}
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                  )}
                />
                <Line type="monotone" dataKey="price" strokeWidth={2} dot={{ strokeWidth: 2 }} />
              </LineChart>
            </ChartContainer>
          </div>
        )}

        <div className="mt-8">
          <h2 className={`text-xl font-semibold ${themeStyles.text} mb-4`}>Price Change Details</h2>
          <div className="space-y-4">
            <div className={`flex justify-between py-3 border-b ${themeStyles.border}`}>
              <span className={themeStyles.muted}>Current Price</span>
              <span className={`font-medium ${themeStyles.text}`}>
                {formatCurrency(priceChange.oldPrice)}
              </span>
            </div>
            <div className={`flex justify-between py-3 border-b ${themeStyles.border}`}>
              <span className={themeStyles.muted}>New Price</span>
              <span className={`font-medium ${themeStyles.text}`}>
                {formatCurrency(priceChange.newPrice)}
              </span>
            </div>
            <div className={`flex justify-between py-3 border-b ${themeStyles.border}`}>
              <span className={themeStyles.muted}>Change Date</span>
              <span className={`font-medium ${themeStyles.text}`}>
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