import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/hooks/use-theme";
import Index from "./pages/Index";
import TldDetail from "./pages/TldDetail";
import TldList from "./pages/TldList";
import AdminLayout from "./components/layouts/AdminLayout";
import AdminLogin from "./pages/admin/Login";
import AdminPerformance from "./pages/admin/Performance";
import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tld/:tld" element={<TldDetail />} />
            <Route path="/tld-list" element={<TldList />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="performance" element={<AdminPerformance />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;