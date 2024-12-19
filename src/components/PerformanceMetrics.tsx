import React from 'react';
import { Activity, Gauge, Database, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { monitoringService } from '../services/monitoring';

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
}

interface HealthStatus {
  status: 'healthy' | 'degraded';
  uptime: number;
  version: string;
  timestamp?: string;
  metrics?: Record<string, unknown>;
  lastError?: {
    message: string;
    code: string;
  };
}

function MetricCard({ title, value, description, icon, trend }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div
            className={`mt-2 text-xs ${
              trend.positive ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {trend.value > 0 ? '+' : ''}
            {trend.value}% {trend.label}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function PerformanceMetrics() {
  const [metrics, setMetrics] = React.useState(() => monitoringService.getMetrics());
  const [health, setHealth] = React.useState<HealthStatus>(() => {
    const healthData = monitoringService.getHealthStatus();
    return {
      status: healthData.status as 'healthy' | 'degraded',
      uptime: healthData.uptime as number,
      version: healthData.version as string,
      timestamp: healthData.timestamp as string | undefined,
      metrics: healthData.metrics,
      lastError: healthData.lastError as { message: string; code: string; } | undefined
    };
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(monitoringService.getMetrics());
      const healthData = monitoringService.getHealthStatus();
      setHealth({
        status: healthData.status as 'healthy' | 'degraded',
        uptime: healthData.uptime as number,
        version: healthData.version as string,
        timestamp: healthData.timestamp as string | undefined,
        metrics: healthData.metrics,
        lastError: healthData.lastError as { message: string; code: string; } | undefined
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const formatResponseTime = (ms: number) => {
    if (ms < 1) return '<1ms';
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Response Time"
          value={formatResponseTime(metrics.responseTime)}
          description="Average API response time"
          icon={<Gauge className="h-4 w-4 text-muted-foreground" />}
          trend={{
            value: -5.2,
            label: 'from last hour',
            positive: true,
          }}
        />
        <MetricCard
          title="Cache Hit Rate"
          value={`${metrics.cacheHitRate.toFixed(1)}%`}
          description="Percentage of cached responses"
          icon={<Database className="h-4 w-4 text-muted-foreground" />}
          trend={{
            value: 2.1,
            label: 'from last hour',
            positive: true,
          }}
        />
        <MetricCard
          title="Error Rate"
          value={`${metrics.errorRate.toFixed(1)}%`}
          description="Percentage of failed requests"
          icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />}
          trend={{
            value: 0.5,
            label: 'from last hour',
            positive: false,
          }}
        />
        <MetricCard
          title="API Calls"
          value={metrics.apiCalls.toLocaleString()}
          description="Total API requests"
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span>System Status</span>
                <span
                  className={
                    health.status === 'healthy'
                      ? 'text-green-500'
                      : 'text-yellow-500'
                  }
                >
                  {health.status.charAt(0).toUpperCase() + health.status.slice(1)}
                </span>
              </div>
              <Progress
                value={100 - metrics.errorRate}
                className="mt-2"
              />
            </div>

            <div className="grid gap-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-muted-foreground">Uptime</span>
                  <p className="font-medium">
                    {Math.floor(health.uptime / 3600)}h{' '}
                    {Math.floor((health.uptime % 3600) / 60)}m
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Version</span>
                  <p className="font-medium">{health.version}</p>
                </div>
              </div>

              <div>
                <span className="text-muted-foreground">Last Error</span>
                <p className="font-medium">
                  {health.lastError
                    ? `${health.lastError.message} (${health.lastError.code})`
                    : 'No recent errors'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}