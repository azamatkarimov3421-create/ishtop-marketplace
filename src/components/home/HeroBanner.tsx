import React from 'react';
import { ArrowRight, MapPin } from 'lucide-react';

interface HeroBannerProps {
  onSearchNow: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onSearchNow }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-100 via-sky-50 to-blue-100 dark:from-slate-800 dark:via-slate-850 dark:to-slate-800 border border-blue-200/60 dark:border-slate-700/60 shadow-sm p-4 min-h-[148px] flex items-center">
      {/* Left Text and CTA */}
      <div className="z-10 max-w-[62%]">
        <h2 className="text-[17px] font-extrabold text-slate-900 dark:text-white leading-tight mb-1">
          Yaqin hududdagi ishchilarni toping
        </h2>
        <p className="text-[12px] text-slate-600 dark:text-slate-300 font-medium mb-3">
          Tez, oson va ishonchli
        </p>

        <button
          onClick={onSearchNow}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-brand-500/20 transition-all"
        >
          <span>Hozir qidirish</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right Craftsman Image with Thumbs Up */}
      <div className="absolute right-0 bottom-0 top-0 w-[42%] flex items-end justify-end pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80"
          alt="Usta"
          className="h-[142px] object-cover object-top mask-image"
          style={{
            maskImage: 'linear-gradient(to top, black 85%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, black 85%, transparent 100%)'
          }}
        />
      </div>

      {/* Floating Badge: "Sizga yaqin ustalar" with blue pin */}
      <div className="absolute bottom-3 right-3 z-20 pointer-events-none">
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-800 dark:text-slate-100">
          <div className="w-5 h-5 rounded-full bg-brand-50 dark:bg-brand-950 flex items-center justify-center text-brand-600">
            <MapPin className="w-3.5 h-3.5 fill-brand-600 text-white" />
          </div>
          <span>Sizga yaqin ustalar</span>
        </div>
      </div>
    </div>
  );
};
