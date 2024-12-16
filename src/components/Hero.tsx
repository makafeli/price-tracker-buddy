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
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
            Track TLD Price Changes
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-medium">
            Stay informed about domain pricing across all top-level domains
          </p>
        </div>
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a TLD (e.g., .com, .io)"
            className="w-full px-6 py-4 text-lg rounded-full border border-white/20 bg-white/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-200 shadow-sm text-white placeholder:text-white/70"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors duration-200 shadow-md hover:shadow-lg backdrop-blur-sm"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};