import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, PriceChange } from "../services/api";
import { Hero } from "../components/Hero";
import { PriceCard } from "../components/PriceCard";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["price-changes", searchQuery],
    queryFn: () =>
      searchQuery ? api.searchTLD(searchQuery) : api.getPriceChanges(),
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/50">
      <Hero onSearch={handleSearch} />
      <div className="max-w-7xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-danger">Failed to load price changes</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.map((priceChange: PriceChange) => (
              <PriceCard
                key={`${priceChange.tld}-${priceChange.date}`}
                data={priceChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;