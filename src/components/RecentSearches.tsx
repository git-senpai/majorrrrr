import React from 'react';
import { History, MapPin } from 'lucide-react';
import { RecentSearch } from '../types';

interface RecentSearchesProps {
  searches: RecentSearch[];
  onSelect: (location: string) => void;
}

export const RecentSearches: React.FC<RecentSearchesProps> = ({ searches, onSelect }) => {
  if (searches.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
      <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-mono uppercase mr-2">
        <History className="w-3.5 h-3.5" />
        Recent
      </div>
      {searches.map((search) => (
        <button
          key={search.timestamp}
          onClick={() => onSelect(search.location)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 rounded-full text-xs text-neutral-300 transition-colors"
        >
          <MapPin className="w-3 h-3 text-neutral-500" />
          {search.location}
        </button>
      ))}
    </div>
  );
};
