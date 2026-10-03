import React, { useState } from 'react';
import { Search, SlidersHorizontal, Star, MapPin, Car, Briefcase, Wrench, X, Sparkles } from 'lucide-react';
import { useStore } from '../../lib/store';
import { SpecialistProfile, Job, ServiceItem } from '../../types';
import { SpecialistCard } from '../home/SpecialistCard';
import { CATEGORIES } from '../../lib/mockData';
import { formatCurrency, formatDistance } from '../../lib/geo';

interface SearchViewProps {
  onViewProfile: (spec: SpecialistProfile) => void;
  onContact: (spec: SpecialistProfile) => void;
  onViewJob: (job: Job) => void;
  onOpenAI: () => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  onViewProfile,
  onContact,
  onViewJob,
  onOpenAI,
}) => {
  const { specialists, jobs, services, serviceRadiusKm } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'ustalar' | 'ishlar' | 'xizmatlar'>('ustalar');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxDistance, setMaxDistance] = useState(serviceRadiusKm || 30);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState<'yaqin' | 'reyting' | 'maosh' | 'tajriba'>('yaqin');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Filter Specialists
  const filteredSpecialists = specialists.filter((spec) => {
    const matchesQuery = 
      spec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spec.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spec.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = 
      selectedCategory === 'all' || 
      spec.profession.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesDistance = (spec.distanceKm || 0) <= maxDistance;
    const matchesAvail = !onlyAvailable || spec.isAvailable;

    return matchesQuery && matchesCategory && matchesDistance && matchesAvail;
  }).sort((a, b) => {
    if (sortBy === 'yaqin') return (a.distanceKm || 0) - (b.distanceKm || 0);
    if (sortBy === 'reyting') return b.rating - a.rating;
    if (sortBy === 'tajriba') return b.experienceYears - a.experienceYears;
    return 0;
  });

  // Filter Jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesQuery = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || job.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesDistance = (job.distanceKm || 0) <= maxDistance;

    return matchesQuery && matchesCategory && matchesDistance;
  }).sort((a, b) => {
    if (sortBy === 'yaqin') return (a.distanceKm || 0) - (b.distanceKm || 0);
    if (sortBy === 'maosh') return b.salaryMax - a.salaryMax;
    return 0;
  });

  return (
    <div className="max-w-md mx-auto px-4 pb-24 pt-3 space-y-4 animate-fade-in">
      {/* Top Search Input */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Qanday ish yoki xizmat kerak?"
            className="w-full pl-10 pr-10 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white shadow-soft focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            onClick={onOpenAI}
            title="AI Yordamchi"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-brand-600 dark:text-brand-400"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => setShowFilterDrawer(true)}
          className="w-11 h-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center text-slate-700 dark:text-slate-300 shadow-soft hover:bg-slate-50"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Main Tabs (Ustalar, Ishlar, Xizmatlar) */}
      <div className="flex bg-slate-200/70 dark:bg-slate-800/80 p-1 rounded-2xl">
        <button
          onClick={() => setActiveTab('ustalar')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'ustalar'
              ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          👷 Ustalar ({filteredSpecialists.length})
        </button>
        <button
          onClick={() => setActiveTab('ishlar')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'ishlar'
              ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          💼 Ishlar ({filteredJobs.length})
        </button>
      </div>

      {/* Quick Category filter chips */}
      <div className="overflow-x-auto no-scrollbar -mx-4 px-4 flex gap-1.5 py-1">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors ${
            selectedCategory === 'all'
              ? 'bg-brand-600 text-white'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          Barchasi
        </button>
        {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors ${
              selectedCategory === cat.name
                ? 'bg-brand-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Results Header with Sorting summary */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
        <span>Topildi: {activeTab === 'ustalar' ? filteredSpecialists.length : filteredJobs.length} ta natija</span>
        <div className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
          <span>Saralash:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent font-bold text-brand-600 outline-none"
          >
            <option value="yaqin">Eng yaqin</option>
            <option value="reyting">Yuqori reyting</option>
            <option value="tajriba">Ko'p tajriba</option>
            <option value="maosh">Katta maosh</option>
          </select>
        </div>
      </div>

      {/* Specialists List */}
      {activeTab === 'ustalar' && (
        <div className="space-y-3.5">
          {filteredSpecialists.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800">
              <span className="text-3xl block mb-2">🔍</span>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mb-1">
                Hozircha yaqin hududingizda mos mutaxassis topilmadi
              </h4>
              <p className="text-xs text-slate-400">
                Xizmat radiusini yoki qidiruv so'zini o'zgartirib ko'ring
              </p>
            </div>
          ) : (
            filteredSpecialists.map((spec) => (
              <SpecialistCard
                key={spec.id}
                specialist={spec}
                onViewProfile={onViewProfile}
                onContact={onContact}
              />
            ))
          )}
        </div>
      )}

      {/* Jobs List */}
      {activeTab === 'ishlar' && (
        <div className="space-y-3">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800">
              <span className="text-3xl block mb-2">💼</span>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mb-1">
                Mos ish e'loni topilmadi
              </h4>
              <p className="text-xs text-slate-400">Filtr parametrlarini kengaytirib ko'ring</p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => onViewJob(job)}
                className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-100 dark:border-slate-800 shadow-soft hover:shadow-md cursor-pointer transition-all space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700">
                      {job.category}
                    </span>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1">
                      {job.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold">{job.companyName}</p>
                  </div>
                  <span className="text-xs font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-xl">
                    {formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.city} ({formatDistance(job.distanceKm)})</span>
                  </div>
                  <div>• {job.jobType === 'full_time' ? "To'liq stavka" : 'Vaqtinchalik'}</div>
                  <div>• {job.experienceYears} yil tajriba</div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">{job.applicationsCount} ta ariza</span>
                  <button className="py-1.5 px-3 bg-brand-600 text-white rounded-xl text-xs font-bold">
                    Ariza topshirish
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Filter Modal Drawer */}
      {showFilterDrawer && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Qidiruv Filtrlari</h3>
              <button onClick={() => setShowFilterDrawer(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Maksimal masofa: {maxDistance} km
                </label>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="w-full accent-brand-600"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-y border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Faqat hozir bo'sh (mavjud) ustalar</span>
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="w-4 h-4 accent-brand-600"
              />
            </div>

            <button
              onClick={() => setShowFilterDrawer(false)}
              className="w-full py-3 bg-brand-600 text-white font-extrabold text-xs rounded-xl shadow-md shadow-brand-500/25"
            >
              Natijalarni ko'rish
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
