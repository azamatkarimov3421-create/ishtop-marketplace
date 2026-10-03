import React, { useState } from 'react';
import { X, MapPin, DollarSign, Clock, Users, Briefcase, CheckCircle2, Send, Share2 } from 'lucide-react';
import { Job } from '../../types';
import { useStore } from '../../lib/store';
import { formatCurrency, formatDistance } from '../../lib/geo';

interface JobDetailModalProps {
  job: Job | null;
  onClose: () => void;
  onSuccessApply: () => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  onClose,
  onSuccessApply,
}) => {
  const { actions, favorites } = useStore();
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState(
    "Assalomu alaykum! Ushbu vakansiyaga qiziqish bildiryapman. Tajribam va ko'nikmalarim talablaringizga to'liq mos keladi."
  );
  const [expectedSalary, setExpectedSalary] = useState(job ? job.salaryMin : 6000000);

  if (!job) return null;

  const isFavorite = favorites.jobs.includes(job.id);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    actions.applyForJob(job.id, coverLetter, Number(expectedSalary));
    onSuccessApply();
    setShowApplyForm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[92vh] flex flex-col border border-slate-100 dark:border-slate-800">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-50 text-brand-700">
            {job.category}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => actions.toggleFavorite('jobs', job.id)}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-rose-500"
            >
              ❤️
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4 overflow-y-auto flex-1 pr-1">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
              {job.title}
            </h2>
            <p className="text-xs font-bold text-slate-500 mt-1">{job.companyName}</p>
          </div>

          {/* Salary Card */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block">
                Taklif etilayotgan maosh
              </span>
              <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                {formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)}
              </span>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 dark:bg-emerald-900/60 px-2.5 py-1 rounded-xl">
              Oylik
            </span>
          </div>

          {/* Quick info grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
              <span className="text-slate-400 block text-[10px]">Ish formati</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {job.jobType === 'full_time' ? "To'liq stavka" : 'Shartnoma asosida'}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
              <span className="text-slate-400 block text-[10px]">Ish vaqti</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{job.workHours}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
              <span className="text-slate-400 block text-[10px]">Talab etilgan tajriba</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{job.experienceYears} yil</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
              <span className="text-slate-400 block text-[10px]">Bo'sh ish o'rinlari</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{job.requiredWorkersCount} nafar</span>
            </div>
          </div>

          {/* Location */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">{job.address || job.city}</p>
                <p className="text-[11px] text-slate-400">Masofa: {formatDistance(job.distanceKm)}</p>
              </div>
            </div>
          </div>

          {/* Skills Required */}
          <div>
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase mb-2">
              Kerakli ko'nikmalar
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {job.skills?.map((s, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase mb-1">
              Batafsil ma'lumot
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Apply Form Dropdown / Accordion */}
          {showApplyForm && (
            <form onSubmit={handleApply} className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <h4 className="font-bold text-xs text-brand-600 uppercase">Ariza topshirish formasi</h4>
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Kutilayotgan oylik maoshingiz (so'm)
                </label>
                <input
                  type="number"
                  value={expectedSalary}
                  onChange={(e) => setExpectedSalary(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Ish beruvchiga qisqa xat
                </label>
                <textarea
                  rows={2}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-brand-500/20"
              >
                <Send className="w-4 h-4" />
                <span>Arizani tasdiqlash va yuborish</span>
              </button>
            </form>
          )}
        </div>

        {/* Footer Actions */}
        {!showApplyForm && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setShowApplyForm(true)}
              className="w-full py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm shadow-lg shadow-brand-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Ariza topshirish</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
