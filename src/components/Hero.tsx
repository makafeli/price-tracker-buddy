import { useState } from "react";
import { Search } from "lucide-react";

interface HeroProps {
  onSearch: (query: string) => void;
}

export const Hero = ({ onSearch }: HeroProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="w-full py-24 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto text-center animate-fade-up">
        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
          Track TLD Price Changes
        </h1>
        <p className="text-lg md:text-xl text-secondary mb-12">
          Stay informed about domain pricing across all top-level domains
        </p>
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a TLD (e.g., .com, .io)"
            className="w-full px-6 py-4 text-lg rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all duration-200"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors duration-200"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};