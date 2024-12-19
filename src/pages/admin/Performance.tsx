import { PerformanceMetrics } from "@/components/PerformanceMetrics";

const AdminPerformance = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">System Performance</h1>
        <p className="text-muted-foreground">Monitor system metrics and performance indicators</p>
      </div>
      <PerformanceMetrics />
    </div>
  );
};

export default AdminPerformance;