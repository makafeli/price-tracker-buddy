import { Navigate, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Loader2 } from "lucide-react";

const AdminLayout = () => {
  const { data: isAuthenticated, isLoading } = useQuery({
    queryKey: ["auth-status"],
    queryFn: () => api.checkAuthStatus(),
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4">
          <div className="flex flex-1 items-center justify-between">
            <span className="text-lg font-semibold">Admin Dashboard</span>
          </div>
        </div>
      </nav>
      <main className="container py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;