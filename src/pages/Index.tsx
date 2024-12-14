import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, PriceChange } from "../services/api";
import { Hero } from "../components/Hero";
import { PriceCard } from "../components/PriceCard";
import { Loader2, AlertCircle, Sun, Moon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTheme } from "@/hooks/use-theme";
import { Toggle } from "@/components/ui/toggle";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, toggleTheme } = useTheme();

  const { data, isLoading, error } = useQuery({
    queryKey: ["price-changes", searchQuery],
    queryFn: () =>
      searchQuery ? api.searchTLD(searchQuery) : api.getPriceChanges(),
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const showEmptyState = !isLoading && !error && (!data || data.length === 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <div className="flex justify-end mb-4">
          <Toggle
            aria-label="Toggle theme"
            pressed={theme === 'dark'}
            onPressedChange={toggleTheme}
            className="p-2 hover:bg-muted"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Toggle>
        </div>
      </div>
      <Hero onSearch={handleSearch} />
      <div className="max-w-7xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Failed to load price changes</AlertDescription>
            </Alert>
          </div>
        ) : showEmptyState ? (
          <div className="text-center py-12">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No price changes available at the moment. The API might be empty or still initializing.
                {searchQuery && " Try searching for a different TLD."}
              </AlertDescription>
            </Alert>
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