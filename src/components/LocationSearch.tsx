import React, { useState } from 'react';
import { Search, MapPin, Loader2, Clock } from 'lucide-react';

interface LocationSearchProps {
  onSearch: (location: string, timeOffsetHours: number) => void;
  isLoading: boolean;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({ onSearch, isLoading }) => {
  const [input, setInput] = useState('');
  const [timeOffset, setTimeOffset] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSearch(input.trim(), timeOffset);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative group flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <MapPin className="w-5 h-5 text-neutral-500 group-focus-within:text-white transition-colors" />
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter location (e.g., India Gate, UIT RGPV...)"
          disabled={isLoading}
          className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-neutral-600 transition-all placeholder:text-neutral-600 font-sans"
        />
      </div>
      
      <div className="flex gap-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Clock className="w-5 h-5 text-neutral-500" />
          </div>
          <select 
            value={timeOffset}
            onChange={(e) => setTimeOffset(Number(e.target.value))}
            disabled={isLoading}
            className="h-full appearance-none bg-neutral-900 border border-neutral-800 text-white rounded-xl py-4 pl-12 pr-10 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-neutral-600 transition-all font-sans cursor-pointer"
          >
            <option value={0}>Live (Now)</option>
            <option value={1}>+1 Hour</option>
            <option value={3}>+3 Hours</option>
            <option value={6}>+6 Hours</option>
            <option value={12}>+12 Hours</option>
          </select>
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
             <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-6 py-4 bg-white text-black rounded-xl font-medium hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
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
      </div>

    </form>
  );
};
