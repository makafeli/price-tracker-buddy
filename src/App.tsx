import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import TldDetail from "./pages/TldDetail";
import "./App.css";

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Optional: Configure default query settings
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1, // Retry failed queries once
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tld/:tld" element={<TldDetail />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;