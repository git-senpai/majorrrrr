import React, { useState } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';

interface LocationSearchProps {
  onSearch: (location: string) => void;
  isLoading: boolean;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({ onSearch, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSearch(input.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative group">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <MapPin className="w-5 h-5 text-neutral-500 group-focus-within:text-white transition-colors" />
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter location (e.g., India Gate, UIT RGPV...)"
        disabled={isLoading}
        className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-xl py-4 pl-12 pr-16 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-neutral-600 transition-all placeholder:text-neutral-600 font-sans"
      />
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        className="absolute right-2 top-2 bottom-2 px-4 bg-white text-black rounded-lg font-medium hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Analyze</span>
          </>
        )}
      </button>
    </form>
  );
};
