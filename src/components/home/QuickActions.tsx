import React from 'react';
import { Users, Wrench, MapPin } from 'lucide-react';

interface QuickActionsProps {
  onPostJob: () => void;
  onBecomeMaster: () => void;
  onOpenMap: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onPostJob,
  onBecomeMaster,
  onOpenMap,
}) => {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {/* 1. E'lon joylash / Ishchi qidiring */}
      <button
        onClick={onPostJob}
        className="flex flex-col items-center text-center p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/50 active:scale-95 transition-all group"
      >
        <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
          <Users className="w-5 h-5" />
        </div>
        <span className="text-[12px] font-bold text-slate-800 dark:text-slate-100 leading-tight">
          E'lon joylash
        </span>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
          Ishchi qidiring
        </span>
      </button>

      {/* 2. Xizmat ko'rsatish / O'z profilingizni yarating */}
      <button
        onClick={onBecomeMaster}
        className="flex flex-col items-center text-center p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 hover:bg-amber-100/70 dark:hover:bg-amber-900/50 active:scale-95 transition-all group"
      >
        <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
          <Wrench className="w-5 h-5" />
        </div>
        <span className="text-[12px] font-bold text-slate-800 dark:text-slate-100 leading-tight">
          Xizmat ko'rsatish
        </span>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight truncate max-w-full">
          O'z profilingizni...
        </span>
      </button>

      {/* 3. Xaritadagi ustalar / Yaqin hududda */}
      <button
        onClick={onOpenMap}
        className="flex flex-col items-center text-center p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 hover:bg-purple-100/70 dark:hover:bg-purple-900/50 active:scale-95 transition-all group"
      >
        <div className="w-11 h-11 rounded-2xl bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
          <MapPin className="w-5 h-5" />
        </div>
        <span className="text-[12px] font-bold text-slate-800 dark:text-slate-100 leading-tight">
          Xaritadagi ustalar
        </span>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
          Yaqin hududda
        </span>
      </button>
    </div>
  );
};
