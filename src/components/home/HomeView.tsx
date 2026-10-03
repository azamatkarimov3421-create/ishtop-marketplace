import React from 'react';
import { ChevronRight } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { CategorySlider } from './CategorySlider';
import { RadarMapCard } from './RadarMapCard';
import { HeroBanner } from './HeroBanner';
import { QuickActions } from './QuickActions';
import { SpecialistCard } from './SpecialistCard';
import { SpecialistProfile } from '../../types';
import { useStore } from '../../lib/store';

interface HomeViewProps {
  onOpenSearch: () => void;
  onOpenMap: () => void;
  onOpenRadiusSelector: () => void;
  onOpenCreateJob: () => void;
  onOpenCreateOrder: () => void;
  onOpenAI: () => void;
  onViewProfile: (spec: SpecialistProfile) => void;
  onContact: (spec: SpecialistProfile) => void;
  onSelectCategory: (categoryId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onOpenSearch,
  onOpenMap,
  onOpenRadiusSelector,
  onOpenCreateJob,
  onOpenCreateOrder,
  onOpenAI,
  onViewProfile,
  onContact,
  onSelectCategory,
}) => {
  const { specialists, serviceRadiusKm } = useStore();
  const [selectedCatId, setSelectedCatId] = React.useState('all');
  const [searchVal, setSearchVal] = React.useState('');

  const handleCategoryClick = (catId: string) => {
    setSelectedCatId(catId);
    onSelectCategory(catId);
  };

  // Filter specialists within radius
  const nearbySpecialists = specialists.filter((s) => {
    const withinRadius = (s.distanceKm || 0) <= (serviceRadiusKm === 999 ? 999 : serviceRadiusKm + 5);
    const matchesCategory = selectedCatId === 'all' || s.profession.toLowerCase().includes(selectedCatId.toLowerCase());
    return withinRadius && matchesCategory;
  });

  return (
    <div className="max-w-md mx-auto px-4 pb-24 pt-2 space-y-4 animate-fade-in">
      {/* 1. Search Bar with filter & AI sparkle */}
      <SearchBar
        value={searchVal}
        onChange={(val) => {
          setSearchVal(val);
          if (val.length > 1) onOpenSearch();
        }}
        onOpenFilter={onOpenSearch}
        onOpenAI={onOpenAI}
      />

      {/* 2. Category horizontal scroll pills */}
      <CategorySlider
        selectedCategoryId={selectedCatId}
        onSelectCategory={handleCategoryClick}
      />

      {/* 3. Radar Map Banner with radius selector & pins */}
      <RadarMapCard
        onOpenFullMap={onOpenMap}
        onOpenRadiusSelector={onOpenRadiusSelector}
      />

      {/* 4. Promotional Hero Banner */}
      <HeroBanner onSearchNow={onOpenSearch} />

      {/* 5. Quick Actions 3-Card Row */}
      <QuickActions
        onPostJob={onOpenCreateJob}
        onBecomeMaster={onOpenCreateOrder}
        onOpenMap={onOpenMap}
      />

      {/* 6. Section Header: Yaqin hududdagi ustalar */}
      <div className="pt-1">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[17px] font-black text-slate-900 dark:text-white tracking-tight">
            Yaqin hududdagi ustalar
          </h2>
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 transition-colors"
          >
            <span>Barchasini ko'rish</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 7. Specialists Cards List */}
        <div className="space-y-3.5">
          {nearbySpecialists.length === 0 ? (
            <div className="text-center py-8 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-500">
                Ushbu radiusda usta topilmadi. Radiusni oshirib ko'ring.
              </p>
            </div>
          ) : (
            nearbySpecialists.map((spec) => (
              <SpecialistCard
                key={spec.id}
                specialist={spec}
                onViewProfile={onViewProfile}
                onContact={onContact}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
