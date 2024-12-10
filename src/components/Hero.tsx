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
    <div className="w-full py-32 px-4 bg-gradient-to-br from-primary/5 via-primary/2 to-transparent relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      <div className="max-w-4xl mx-auto text-center animate-fade-up relative">
        <div className="space-y-2 mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Track TLD Price Changes
          </h1>
          <p className="text-lg md:text-xl text-secondary/80">
            Stay informed about domain pricing across all top-level domains
          </p>
        </div>
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a TLD (e.g., .com, .io)"
            className="w-full px-6 py-4 text-lg rounded-full border border-primary/10 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-200 shadow-sm"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};