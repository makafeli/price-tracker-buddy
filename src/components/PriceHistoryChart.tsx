import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import type { PriceHistory } from '../types/price';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface PriceHistoryChartProps {
  data: PriceHistory[];
  tld: string;
  onTimeRangeChange?: (range: string) => void;
  className?: string;
}

const timeRanges = [
  { value: '7d', label: 'Last 7 Days' },
  { value: '1m', label: 'Last Month' },
  { value: '3m', label: 'Last 3 Months' },
  { value: '1y', label: 'Last Year' },
  { value: 'all', label: 'All Time' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium">
          {format(parseISO(label), 'MMM d, yyyy')}
        </p>
        <p className="text-sm text-muted-foreground">
          Price: ${payload[0].value.toFixed(2)}
        </p>
        <p className="text-xs text-muted-foreground">
          Source: {payload[0].payload.source}
        </p>
      </div>
    );
  }
  return null;
};

export function PriceHistoryChart({
  data,
  tld,
  onTimeRangeChange,
  className,
}: PriceHistoryChartProps) {
  const [timeRange, setTimeRange] = React.useState('1m');
  const [showGridLines, setShowGridLines] = React.useState(true);

  const chartData = useMemo(() => {
    return data.map(item => ({
      ...item,
      formattedDate: format(parseISO(item.date), 'MMM d'),
    }));
  }, [data]);

  const minPrice = useMemo(() => 
    Math.floor(Math.min(...data.map(d => d.price))),
    [data]
  );

  const maxPrice = useMemo(() => 
    Math.ceil(Math.max(...data.map(d => d.price))),
    [data]
  );

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    onTimeRangeChange?.(value);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Price History for {tld}</CardTitle>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGridLines(!showGridLines)}
            >
              {showGridLines ? 'Hide Grid' : 'Show Grid'}
            </Button>
            <Select value={timeRange} onValueChange={handleTimeRangeChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeRanges.map(range => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              {showGridLines && (
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-muted/20"
                />
              )}
              <XAxis
                dataKey="formattedDate"
                stroke="currentColor"
                className="text-muted-foreground text-xs"
              />
              <YAxis
                stroke="currentColor"
                className="text-muted-foreground text-xs"
                domain={[minPrice, maxPrice]}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="price"
                name="Price"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Min: ${minPrice.toFixed(2)}
          </div>
          <div>
            Max: ${maxPrice.toFixed(2)}
          </div>
          <div>
            Avg: ${(data.reduce((acc, d) => acc + d.price, 0) / data.length).toFixed(2)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}