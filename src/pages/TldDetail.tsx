import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2, AlertCircle, Home } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTheme } from "@/hooks/use-theme";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis } from "recharts";
import { api, PriceChange } from "../services/api";
import { CHART_COLORS, THEME_STYLES } from "../constants/theme";
import { 
  calculateAdditionalRevenue, 
  formatCurrency, 
  formatNumber, 
  transformToChartData 
} from "../utils/priceCalculations";
import { ChartDataPoint } from "../types/price";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const TldDetail = () => {
  const { tld } = useParams();
  const { theme } = useTheme();
  const normalizedTld = tld ? `.${tld.toUpperCase()}` : "";
  const themeStyles = theme === 'dark' ? THEME_STYLES.dark : THEME_STYLES.light;
  const chartColors = theme === 'dark' ? CHART_COLORS.dark : CHART_COLORS.light;

  const { data: priceChanges, isLoading, error } = useQuery<PriceChange[]>({
    queryKey: ["tld-detail", normalizedTld],
    queryFn: () => api.searchTLD(normalizedTld),
  });

  const priceChange = priceChanges?.[0];
  const chartData: ChartDataPoint[] = priceChanges 
    ? transformToChartData(priceChanges).map(point => ({ ...point }))
    : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
      </div>
    );
  }

  if (error || !priceChange) {
    return (
      <div className="relative">
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
        <div className="fixed inset-0 bg-[linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="flex items-center">
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>TLD Details</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>TLD not found or error loading data</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const additionalRevenue = calculateAdditionalRevenue(priceChange.priceChange, priceChange.domainCount);

  return (
    <div className="relative min-h-screen bg-background transition-colors">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
      <div className="fixed inset-0 bg-[linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 py-12 relative">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="flex items-center">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>TLD Details</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="bg-gradient-to-br from-primary/5 via-primary/2 to-transparent rounded-xl p-8 shadow-sm backdrop-blur-sm">
          <h1 className={`text-4xl font-bold ${themeStyles.text} mb-2`}>{priceChange.tld}</h1>
          <p className={`${themeStyles.muted} mb-8`}>Price change history and details</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-card/50 backdrop-blur-sm rounded-lg border border-border">
              <p className={`text-sm ${themeStyles.muted} mb-1`}>Current Price</p>
              <p className={`text-2xl font-bold ${themeStyles.text}`}>
                {formatCurrency(priceChange.oldPrice)}
              </p>
            </div>

            <div className="p-6 bg-card/50 backdrop-blur-sm rounded-lg border border-border">
              <p className={`text-sm ${themeStyles.muted} mb-1`}>Price Change</p>
              <p className={`text-2xl font-bold ${priceChange.priceChange > 0 ? "text-danger" : "text-success"}`}>
                {formatCurrency(Math.abs(priceChange.priceChange))}
              </p>
            </div>

            <div className="p-6 bg-card/50 backdrop-blur-sm rounded-lg border border-border">
              <p className={`text-sm ${themeStyles.muted} mb-1`}>New Price</p>
              <p className={`text-2xl font-bold ${themeStyles.text}`}>
                {formatCurrency(priceChange.newPrice)}
              </p>
            </div>
          </div>

          {priceChange.domainCount && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="p-6 bg-card/50 backdrop-blur-sm rounded-lg border border-border">
                <p className={`text-sm ${themeStyles.muted} mb-1`}>Total Domains</p>
                <p className={`text-2xl font-bold ${themeStyles.text}`}>
                  {formatNumber(priceChange.domainCount)}
                </p>
              </div>

              <div className="p-6 bg-card/50 backdrop-blur-sm rounded-lg border border-border">
                <p className={`text-sm ${themeStyles.muted} mb-1`}>Additional Revenue</p>
                <p className={`text-2xl font-bold ${themeStyles.text}`}>
                  {formatCurrency(additionalRevenue)}
                </p>
              </div>
            </div>
          )}

          {chartData.length > 0 && (
            <div className="mt-8 p-6 bg-card/50 backdrop-blur-sm rounded-lg border border-border">
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
              <div className="flex justify-between py-3 border-b border-border">
                <span className={themeStyles.muted}>Current Price</span>
                <span className={`font-medium ${themeStyles.text}`}>
                  {formatCurrency(priceChange.oldPrice)}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-border">
                <span className={themeStyles.muted}>New Price</span>
                <span className={`font-medium ${themeStyles.text}`}>
                  {formatCurrency(priceChange.newPrice)}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-border">
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
    </div>
  );
};

export default TldDetail;