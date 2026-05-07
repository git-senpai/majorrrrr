import React, { useState } from 'react';
import { Search, MapPin, Loader2, Clock } from 'lucide-react';

interface LocationSearchProps {
  onSearch: (location: string, time: string) => void;
  isLoading: boolean;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({ onSearch, isLoading }) => {
  const [input, setInput] = useState('');
  const [timeMode, setTimeMode] = useState('now');
  const [customTime, setCustomTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      let finalTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      if (timeMode === 'past_1h') {
        const d = new Date();
        d.setHours(d.getHours() - 1);
        finalTime = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (timeMode === 'next_1h') {
        const d = new Date();
        d.setHours(d.getHours() + 1);
        finalTime = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (timeMode === 'custom' && customTime) {
        finalTime = customTime;
      }
      
      onSearch(input.trim(), finalTime);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative group space-y-4">
      <div className="relative">
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
      </div>
      
      {/* Time Options */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
        <Clock className="w-4 h-4 text-neutral-500 hidden sm:block" />
        <select 
          value={timeMode} 
          onChange={(e) => setTimeMode(e.target.value)}
          className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none w-full sm:w-auto"
        >
          <option value="now">Right Now</option>
          <option value="past_1h">Past 1 Hour</option>
          <option value="next_1h">Next 1 Hour</option>
          <option value="custom">Custom Exact Time</option>
        </select>
        
        {timeMode === 'custom' && (
          <input 
            type="time" 
            value={customTime}
            onChange={(e) => setCustomTime(e.target.value)}
            className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none w-full sm:w-auto"
            required
          />
        )}
      </div>
    </form>
  );
};
