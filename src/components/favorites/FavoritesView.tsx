import React, { useState } from 'react';
import { Heart, Bookmark, Star, MapPin } from 'lucide-react';
import { useStore } from '../../lib/store';
import { SpecialistProfile, Job, ServiceItem } from '../../types';
import { SpecialistCard } from '../home/SpecialistCard';
import { formatCurrency, formatDistance } from '../../lib/geo';

interface FavoritesViewProps {
  onViewProfile: (spec: SpecialistProfile) => void;
  onContact: (spec: SpecialistProfile) => void;
  onViewJob: (job: Job) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  onViewProfile,
  onContact,
  onViewJob,
}) => {
  const { favorites, specialists, jobs, services } = useStore();
  const [activeTab, setActiveTab] = useState<'profiles' | 'jobs' | 'services'>('profiles');

  const savedSpecialists = specialists.filter((s) => favorites.profiles.includes(s.id));
  const savedJobs = jobs.filter((j) => favorites.jobs.includes(j.id));
  const savedServices = services.filter((srv) => favorites.services.includes(srv.id));

  return (
    <div className="max-w-md mx-auto px-4 pb-24 pt-3 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white">Saqlanganlar (Sevimlilar)</h2>
          <p className="text-xs text-slate-500">Tez qaytish uchun saqlab qo'yilganlar</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-200/70 dark:bg-slate-800/80 p-1 rounded-2xl text-xs font-bold">
        <button
          onClick={() => setActiveTab('profiles')}
          className={`flex-1 py-2 rounded-xl transition-all ${
            activeTab === 'profiles' ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-xs' : 'text-slate-600'
          }`}
        >
          ❤️ Profillar ({savedSpecialists.length})
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          className={`flex-1 py-2 rounded-xl transition-all ${
            activeTab === 'jobs' ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-xs' : 'text-slate-600'
          }`}
        >
          🔖 Ishlar ({savedJobs.length})
        </button>
      </div>

      {/* Tab 1: Profiles */}
      {activeTab === 'profiles' && (
        <div className="space-y-3">
          {savedSpecialists.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100">
              <span className="text-3xl block mb-2">❤️</span>
              <p className="text-xs text-slate-500">Hozircha saqlangan ustalar yo'q.</p>
            </div>
          ) : (
            savedSpecialists.map((spec) => (
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

      {/* Tab 2: Jobs */}
      {activeTab === 'jobs' && (
        <div className="space-y-3">
          {savedJobs.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100">
              <span className="text-3xl block mb-2">🔖</span>
              <p className="text-xs text-slate-500">Hozircha saqlangan ishlar yo'q.</p>
            </div>
          ) : (
            savedJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => onViewJob(job)}
                className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-100 shadow-soft cursor-pointer space-y-2"
              >
                <div className="flex items-start justify-between">
                  <h4 className="font-extrabold text-xs">{job.title}</h4>
                  <span className="text-xs font-black text-emerald-600">{formatCurrency(job.salaryMin)}</span>
                </div>
                <p className="text-[11px] text-slate-500">{job.companyName} • {job.city}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
