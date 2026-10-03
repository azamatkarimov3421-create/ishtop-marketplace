import React from 'react';
import { Home, Hammer, Armchair, Zap, Wrench, Car, LayoutGrid, Paintbrush, Laptop, Palette, GraduationCap, Truck, Scissors } from 'lucide-react';
import { CATEGORIES } from '../../lib/mockData';

interface CategorySliderProps {
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Home: <Home className="w-5 h-5" />,
  Hammer: <Hammer className="w-5 h-5" />,
  Armchair: <Armchair className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Wrench: <Wrench className="w-5 h-5" />,
  Car: <Car className="w-5 h-5" />,
  Grid: <LayoutGrid className="w-5 h-5" />,
  Paintbrush: <Paintbrush className="w-5 h-5" />,
  Laptop: <Laptop className="w-5 h-5" />,
  Palette: <Palette className="w-5 h-5" />,
  GraduationCap: <GraduationCap className="w-5 h-5" />,
  Truck: <Truck className="w-5 h-5" />,
  Scissors: <Scissors className="w-5 h-5" />,
};

export const CategorySlider: React.FC<CategorySliderProps> = ({
  selectedCategoryId,
  onSelectCategory,
}) => {
  return (
    <div className="overflow-x-auto no-scrollbar py-1 -mx-4 px-4">
      <div className="flex items-center gap-2.5 min-w-max">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          const icon = ICON_MAP[cat.icon] || <LayoutGrid className="w-5 h-5" />;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex flex-col items-center justify-center min-w-[70px] h-[72px] px-2 rounded-2xl transition-all duration-200 ${
                isSelected
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25 scale-[1.02]'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
            >
              <div className="mb-1.5">{icon}</div>
              <span className="text-[11px] font-semibold tracking-tight text-center truncate max-w-[64px]">
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
