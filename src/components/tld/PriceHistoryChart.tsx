import { LineChart, Line, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { CHART_COLORS, THEME_STYLES } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { formatCurrency } from "@/utils/priceCalculations";
import { ChartDataPoint } from "@/types/price";

interface PriceHistoryChartProps {
  chartData: ChartDataPoint[];
}

export const PriceHistoryChart = ({ chartData }: PriceHistoryChartProps) => {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? THEME_STYLES.dark : THEME_STYLES.light;
  const chartColors = theme === 'dark' ? CHART_COLORS.dark : CHART_COLORS.light;

  if (chartData.length === 0) return null;

  return (
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
  );
};