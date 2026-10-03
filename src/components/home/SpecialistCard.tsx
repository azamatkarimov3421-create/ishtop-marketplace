import React from 'react';
import { Star, MapPin, Car, CheckCircle2, Heart } from 'lucide-react';
import { SpecialistProfile } from '../../types';
import { useStore } from '../../lib/store';
import { formatDistance } from '../../lib/geo';

interface SpecialistCardProps {
  specialist: SpecialistProfile;
  onViewProfile: (spec: SpecialistProfile) => void;
  onContact: (spec: SpecialistProfile) => void;
  onOpenPortfolioImage?: (imgUrl: string) => void;
}

export const SpecialistCard: React.FC<SpecialistCardProps> = ({
  specialist,
  onViewProfile,
  onContact,
  onOpenPortfolioImage,
}) => {
  const { favorites, actions } = useStore();
  const isFavorite = favorites.profiles.includes(specialist.id);

  // Gather preview images from portfolios
  const previewImages: string[] = [];
  specialist.portfolios?.forEach((port) => {
    port.images.forEach((img) => {
      if (previewImages.length < 3) {
        previewImages.push(img);
      }
    });
  });

  // Fallbacks if specialist has fewer than 3 images
  if (previewImages.length === 0) {
    previewImages.push(
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=300&auto=format&fit=crop&q=80'
    );
  }

  const extraCount = specialist.completedJobsCount > 10 ? specialist.completedJobsCount - 3 : 12;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-3.5 border border-slate-100 dark:border-slate-800 shadow-soft hover:shadow-md transition-all">
      {/* Top Section: Photo + Details + Status Pill */}
      <div className="flex gap-3">
        {/* Main Photo with Online dot & Favorite heart */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
          <img
            src={specialist.avatar}
            alt={specialist.name}
            className="w-full h-full object-cover"
          />

          {/* Online green indicator */}
          <div className="absolute top-2 left-2 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs"></div>

          {/* Heart / Favorite button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              actions.toggleFavorite('profiles', specialist.id);
            }}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs flex items-center justify-center text-slate-400 hover:text-rose-500 active:scale-90 transition-transform shadow-xs"
            aria-label="Sevimlilar"
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-600 dark:text-slate-300'
              }`}
            />
          </button>
        </div>

        {/* Right Details */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            {/* Name + Verified Badge + Status pill */}
            <div className="flex items-start justify-between gap-1 mb-0.5">
              <div className="flex items-center gap-1.5 truncate">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-[15px] truncate">
                  {specialist.name}
                </h3>
                {specialist.verification?.identity && (
                  <CheckCircle2 className="w-4 h-4 text-brand-600 fill-brand-600 text-white shrink-0" />
                )}
              </div>

              {/* Status: Hozir mavjud */}
              {specialist.isAvailable && (
                <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Hozir mavjud
                </span>
              )}
            </div>

            {/* Profession */}
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 truncate mb-1">
              {specialist.profession}
            </p>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 mb-1.5">
              <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-white">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{specialist.rating.toFixed(1)}</span>
              </div>
              <span className="text-slate-400 font-medium">({specialist.reviewCount})</span>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <div className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                <span>{specialist.completedJobsCount} ta ish</span>
              </div>
            </div>

            {/* Location & Distance */}
            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1 truncate">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">Navoiy, {formatDistance(specialist.distanceKm)}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Car className="w-3.5 h-3.5 text-slate-400" />
                <span>{specialist.serviceRadiusKm} km gacha</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Portfolio Thumbnail Strip with +12 overlay */}
      <div className="mt-3 grid grid-cols-4 gap-2">
        {previewImages.slice(0, 3).map((img, idx) => (
          <div
            key={idx}
            onClick={() => onOpenPortfolioImage ? onOpenPortfolioImage(img) : onViewProfile(specialist)}
            className="aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <img src={img} alt="Portfolio preview" className="w-full h-full object-cover" />
          </div>
        ))}

        {/* 4th tile: Dark overlay with +12 / +8 */}
        <div
          onClick={() => onViewProfile(specialist)}
          className="relative aspect-square rounded-xl overflow-hidden bg-slate-800 cursor-pointer group"
        >
          <img
            src={previewImages[2] || previewImages[0]}
            alt="More works"
            className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform"
          />
          <div className="absolute inset-0 flex items-center justify-center text-white font-extrabold text-sm bg-black/40">
            +{extraCount}
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons: Bog'lanish and Profilni ko'rish */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={() => onContact(specialist)}
          className="py-2.5 px-3 rounded-2xl bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white font-bold text-xs shadow-sm shadow-brand-500/20 transition-all text-center"
        >
          Bog'lanish
        </button>
        <button
          onClick={() => onViewProfile(specialist)}
          className="py-2.5 px-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.98] text-slate-800 dark:text-slate-100 font-bold text-xs transition-all text-center"
        >
          Profilni ko'rish
        </button>
      </div>
    </div>
  );
};
