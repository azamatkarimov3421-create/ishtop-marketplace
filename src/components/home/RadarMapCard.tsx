import React from 'react';
import { Compass, ChevronRight, ChevronDown, Wrench, Zap, Car, MapPin, Hammer } from 'lucide-react';
import { useStore } from '../../lib/store';

interface RadarMapCardProps {
  onOpenFullMap: () => void;
  onOpenRadiusSelector: () => void;
}

export const RadarMapCard: React.FC<RadarMapCardProps> = ({
  onOpenFullMap,
  onOpenRadiusSelector,
}) => {
  const { serviceRadiusKm } = useStore();

  return (
    <div className="relative w-full h-[155px] rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm bg-slate-50 dark:bg-slate-900 group cursor-pointer transition-all">
      {/* Background Stylized Map Pattern */}
      <div 
        onClick={onOpenFullMap}
        className="absolute inset-0 opacity-40 dark:opacity-25"
        style={{
          backgroundImage: `
            linear-gradient(to right, #94a3b8 1px, transparent 1px),
            linear-gradient(to bottom, #94a3b8 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Decorative City Road curved lines in SVG */}
      <svg 
        onClick={onOpenFullMap}
        className="absolute inset-0 w-full h-full opacity-60 dark:opacity-40" 
        preserveAspectRatio="none"
      >
        <path d="M-20 40 Q 120 80, 240 30 T 500 70" stroke="#cbd5e1" strokeWidth="6" fill="none" />
        <path d="M-20 110 Q 150 90, 280 140 T 520 90" stroke="#cbd5e1" strokeWidth="5" fill="none" />
        <path d="M140 -20 Q 180 80, 160 180" stroke="#e2e8f0" strokeWidth="4" fill="none" />
        <path d="M320 -20 Q 300 70, 340 180" stroke="#e2e8f0" strokeWidth="4" fill="none" />
      </svg>

      {/* Concentric Radar Circles centered on user */}
      <div 
        onClick={onOpenFullMap}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        {/* Outer Circle */}
        <div className="w-[200px] h-[200px] rounded-full border border-brand-400/30 bg-brand-500/5 dark:bg-brand-500/10 flex items-center justify-center">
          {/* Middle Circle */}
          <div className="w-[130px] h-[130px] rounded-full border border-brand-400/40 bg-brand-500/10 flex items-center justify-center">
            {/* Inner Circle */}
            <div className="w-[70px] h-[70px] rounded-full border border-brand-500/50 bg-brand-500/15 flex items-center justify-center">
              {/* Radar pulse ping */}
              <div className="w-5 h-5 rounded-full bg-brand-600 dark:bg-brand-400 border-2 border-white dark:border-slate-900 shadow-md animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Realistic Map Pins Scattered within radius matching screenshot */}
      <div 
        onClick={onOpenFullMap}
        className="absolute inset-0 pointer-events-none"
      >
        {/* Top-center: Orange Hammer/Wrench Pin */}
        <div className="absolute top-[28px] left-[53%] -translate-x-1/2 flex items-center justify-center w-7 h-7 rounded-full bg-amber-500 text-white shadow-md transform hover:scale-110 transition-transform">
          <Hammer className="w-3.5 h-3.5" />
        </div>

        {/* Center-Right: Green Wrench Pin */}
        <div className="absolute top-[68px] left-[63%] flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500 text-white shadow-md">
          <Wrench className="w-3.5 h-3.5" />
        </div>

        {/* Right: Red Zap Pin */}
        <div className="absolute top-[52px] right-[24%] flex items-center justify-center w-7 h-7 rounded-full bg-rose-500 text-white shadow-md">
          <Zap className="w-3.5 h-3.5" />
        </div>

        {/* Top-right: Purple Car Pin */}
        <div className="absolute top-[24px] right-[35%] flex items-center justify-center w-7 h-7 rounded-full bg-purple-600 text-white shadow-md">
          <Car className="w-3.5 h-3.5" />
        </div>

        {/* Center-Left: Blue Car Pin */}
        <div className="absolute bottom-[44px] left-[40%] flex items-center justify-center w-7 h-7 rounded-full bg-sky-500 text-white shadow-md">
          <Car className="w-3.5 h-3.5" />
        </div>

        {/* Bottom-left: Blue Location Pin */}
        <div className="absolute bottom-[20px] left-[20%] flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white shadow-md">
          <MapPin className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Top Left Pill: Xarita bo'yicha qidirish > */}
      <div className="absolute top-3 left-3 z-10">
        <button
          onClick={onOpenFullMap}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 rounded-full text-slate-800 dark:text-white font-bold text-xs shadow-sm hover:bg-white dark:hover:bg-slate-800 transition-colors"
        >
          <Compass className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
          <span>Xarita bo'yicha qidirish</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* Bottom Right Pill: Radius selector */}
      <div className="absolute bottom-3 right-3 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenRadiusSelector();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 rounded-full text-slate-800 dark:text-white font-bold text-xs shadow-sm hover:border-brand-500 transition-colors"
        >
          <Compass className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
          <span>{serviceRadiusKm} km</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>
    </div>
  );
};
