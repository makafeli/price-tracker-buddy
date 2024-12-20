import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2, AlertCircle, Home } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTheme } from "@/hooks/use-theme";
import { api, PriceChange } from "../services/api";
import { THEME_STYLES } from "../constants/theme";
import { calculateAdditionalRevenue, transformToChartData } from "../utils/priceCalculations";
import { ChartDataPoint } from "../types/price";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PriceStatCards } from "@/components/tld/PriceStatCards";
import { PriceHistoryChart } from "@/components/tld/PriceHistoryChart";
import { PriceChangeDetails } from "@/components/tld/PriceChangeDetails";

const TldDetail = () => {
  const { tld } = useParams();
  const { theme } = useTheme();
  const normalizedTld = tld ? `.${tld.toUpperCase()}` : "";
  const themeStyles = theme === 'dark' ? THEME_STYLES.dark : THEME_STYLES.light;

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
                    <Home className="w-4 h-4" />
                    <span className="sr-only">Home</span>
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
                  <Home className="w-4 h-4" />
                  <span className="sr-only">Home</span>
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

          <PriceStatCards priceChange={priceChange} additionalRevenue={additionalRevenue} />
          <PriceHistoryChart chartData={chartData} />
          <PriceChangeDetails priceChange={priceChange} />
        </div>
      </div>
    </div>
  );
};

export default TldDetail;