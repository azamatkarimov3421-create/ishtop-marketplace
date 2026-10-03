import React from 'react';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onOpenFilter: () => void;
  onOpenAI: () => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onOpenFilter,
  onOpenAI,
  placeholder = "Qaysi xizmat kerak?"
}) => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl text-sm placeholder:text-slate-400 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-sm"
        />
        {/* AI voice / smart search button inside input */}
        <button
          onClick={onOpenAI}
          title="AI Yordamchi bilan qidirish"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-brand-600 dark:text-brand-400 hover:scale-110 active:scale-95 transition-transform"
        >
          <Sparkles className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Button */}
      <button
        onClick={onOpenFilter}
        className="w-11 h-11 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-sm"
        aria-label="Filter"
      >
        <SlidersHorizontal className="w-4 h-4" />
      </button>
    </div>
  );
};
