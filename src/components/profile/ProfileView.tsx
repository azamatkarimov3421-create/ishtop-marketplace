import React, { useState } from 'react';
import { 
  Star, 
  MapPin, 
  Car, 
  CheckCircle2, 
  Share2, 
  Phone, 
  Mail, 
  Clock, 
  Briefcase, 
  Award, 
  GraduationCap, 
  Globe, 
  Send, 
  Heart,
  AlertTriangle,
  FileText,
  DollarSign,
  ChevronRight
} from 'lucide-react';
import { SpecialistProfile, ReviewItem } from '../../types';
import { useStore } from '../../lib/store';
import { formatDistance, formatCurrency } from '../../lib/geo';

interface ProfileViewProps {
  specialist: SpecialistProfile;
  onBack: () => void;
  onContact: (spec: SpecialistProfile) => void;
  onOrder: (spec: SpecialistProfile) => void;
  onInvite: (spec: SpecialistProfile) => void;
  onShare: (spec: SpecialistProfile) => void;
  onReport: (spec: SpecialistProfile) => void;
  onOpenCV: (spec: SpecialistProfile) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  specialist,
  onBack,
  onContact,
  onOrder,
  onInvite,
  onShare,
  onReport,
  onOpenCV,
}) => {
  const { reviews, favorites, actions } = useStore();
  const [activeTab, setActiveTab] = useState<'haqida' | 'portfolio' | 'xizmatlar' | 'sharhlar'>('haqida');
  const [selectedBeforeAfter, setSelectedBeforeAfter] = useState<{ before: string; after: string } | null>(null);

  const isFavorite = favorites.profiles.includes(specialist.id);
  const specReviews = reviews.filter((r) => r.targetId === specialist.id);

  return (
    <div className="max-w-md mx-auto pb-24 animate-fade-in">
      {/* Top Bar with Back and Actions */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-brand-600"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          <span>Orqaga</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => actions.toggleFavorite('profiles', specialist.id)}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-rose-500"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
          <button
            onClick={() => onShare(specialist)}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-brand-600"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onReport(specialist)}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-600"
            title="Shikoyat qilish"
          >
            <AlertTriangle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Profile Header Hero */}
      <div className="px-4 pt-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-soft">
          <div className="flex items-start gap-4">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 border-brand-500/20 shadow-md">
              <img src={specialist.avatar} alt={specialist.name} className="w-full h-full object-cover" />
              {specialist.isAvailable && (
                <div className="absolute top-1 left-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white"></div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-lg font-black text-slate-900 dark:text-white truncate">
                  {specialist.name} {specialist.surname}
                </h1>
                {specialist.verification?.identity && (
                  <CheckCircle2 className="w-4 h-4 text-brand-600 fill-brand-600 text-white shrink-0" />
                )}
              </div>
              <p className="text-xs font-bold text-brand-600 dark:text-brand-400 mt-0.5">
                {specialist.profession}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                @{specialist.username}
              </p>

              {/* Status Pill */}
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Hozir buyurtma qabul qiladi</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <div className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
              <div className="flex items-center justify-center gap-1 text-slate-900 dark:text-white font-extrabold text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{specialist.rating.toFixed(1)}</span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                {specialist.reviewCount} ta baho
              </span>
            </div>

            <div className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
              <div className="text-slate-900 dark:text-white font-extrabold text-sm">
                {specialist.completedJobsCount} ta
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Bajarilgan ish</span>
            </div>

            <div className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
              <div className="text-slate-900 dark:text-white font-extrabold text-sm">
                {specialist.experienceYears} yil
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Tajriba</span>
            </div>
          </div>

          {/* Location & Radius info */}
          <div className="mt-3 p-3 rounded-2xl bg-blue-50/60 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
              <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
              <span className="font-semibold">{specialist.city}</span>
              <span className="text-slate-400">({formatDistance(specialist.distanceKm)} masofa)</span>
            </div>
            <div className="flex items-center gap-1 font-bold text-brand-600 dark:text-brand-400">
              <Car className="w-3.5 h-3.5" />
              <span>{specialist.serviceRadiusKm} km radiusi</span>
            </div>
          </div>

          {/* Action Buttons: Bog'lanish & Buyurtma berish */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              onClick={() => onContact(specialist)}
              className="py-3 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-extrabold text-xs shadow-md shadow-brand-500/20 flex items-center justify-center gap-1.5 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Bog'lanish / Chat</span>
            </button>
            <button
              onClick={() => onOrder(specialist)}
              className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-all"
            >
              <DollarSign className="w-4 h-4" />
              <span>Buyurtma berish</span>
            </button>
          </div>

          {/* Secondary Buttons: Ishga taklif & CV */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              onClick={() => onInvite(specialist)}
              className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-bold text-[11px] flex items-center justify-center gap-1"
            >
              <Briefcase className="w-3.5 h-3.5 text-brand-600" />
              <span>Ishga taklif qilish</span>
            </button>
            <button
              onClick={() => onOpenCV(specialist)}
              className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-bold text-[11px] flex items-center justify-center gap-1"
            >
              <FileText className="w-3.5 h-3.5 text-purple-600" />
              <span>CV / Rezyume (PDF)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="px-4 mt-4">
        <div className="flex bg-slate-200/60 dark:bg-slate-800/80 p-1 rounded-2xl">
          {[
            { id: 'haqida', label: 'Haqida' },
            { id: 'portfolio', label: `Portfolio (${specialist.portfolios?.length || 0})` },
            { id: 'xizmatlar', label: 'Xizmatlar' },
            { id: 'sharhlar', label: `Sharhlar (${specReviews.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Haqida (About) */}
      {activeTab === 'haqida' && (
        <div className="px-4 mt-4 space-y-4">
          {/* Bio & Description */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-100 dark:border-slate-800 shadow-soft">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-2">Men haqimda</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {specialist.about || specialist.bio}
            </p>
          </div>

          {/* Verification Badges */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-100 dark:border-slate-800 shadow-soft">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-3">
              Ishonch va Tasdiqlash
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-medium text-slate-700 dark:text-slate-300">Telefon tasdiqlangan</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-medium text-slate-700 dark:text-slate-300">Email tasdiqlangan</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-medium text-slate-700 dark:text-slate-300">Shaxs tasdiqlangan (ID)</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-medium text-slate-700 dark:text-slate-300">Kasb tasdiqlangan</span>
              </div>
            </div>
          </div>

          {/* Skills Tags */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-100 dark:border-slate-800 shadow-soft">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-2">Ko'nikmalar</h3>
            <div className="flex flex-wrap gap-1.5">
              {specialist.skills?.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-xl text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-100 dark:border-brand-900/40"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Working conditions */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-100 dark:border-slate-800 shadow-soft space-y-2.5 text-xs">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-3">Ish tartibi va shartlari</h3>
            
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> Ish vaqti:
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{specialist.workHours}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" /> Ish formati:
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {specialist.workMode === 'onsite' ? 'Joyida ishlash' : specialist.workMode === 'remote' ? 'Masofaviy (Online)' : 'Ikkalasi ham'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Car className="w-4 h-4" /> Manzilga borish:
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {specialist.serviceLocationType === 'both' ? 'Mijoz oldiga boradi / Mijoz keladi' : 'Mijoz oldiga boradi'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4" /> Istalgan oylik:
              </span>
              <span className="font-bold text-brand-600 dark:text-brand-400">
                {formatCurrency(specialist.expectedSalary)}
              </span>
            </div>
          </div>

          {/* Social Networks List */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-100 dark:border-slate-800 shadow-soft">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-3">
              Ijtimoiy tarmoqlar va Aloqa
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {specialist.socialLinks?.telegramUsername && (
                <a
                  href={`https://t.me/${specialist.socialLinks.telegramUsername}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-semibold hover:bg-sky-100"
                >
                  <Send className="w-4 h-4 text-sky-500" />
                  <span className="truncate">@{specialist.socialLinks.telegramUsername}</span>
                </a>
              )}
              {specialist.socialLinks?.instagram && (
                <a
                  href={`https://instagram.com/${specialist.socialLinks.instagram}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 font-semibold hover:bg-pink-100"
                >
                  <Globe className="w-4 h-4 text-pink-500" />
                  <span className="truncate">@{specialist.socialLinks.instagram}</span>
                </a>
              )}
              <a
                href={`tel:${specialist.phone}`}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold hover:bg-emerald-100"
              >
                <Phone className="w-4 h-4 text-emerald-500" />
                <span className="truncate">{specialist.phone}</span>
              </a>
              <a
                href={`mailto:${specialist.email}`}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-semibold hover:bg-purple-100"
              >
                <Mail className="w-4 h-4 text-purple-500" />
                <span className="truncate">{specialist.email}</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Portfolio */}
      {activeTab === 'portfolio' && (
        <div className="px-4 mt-4 space-y-4">
          {specialist.portfolios?.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-100 dark:border-slate-800 shadow-soft"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700">
                  {item.category}
                </span>
                {item.price && (
                  <span className="text-xs font-extrabold text-emerald-600">
                    {formatCurrency(item.price)}
                  </span>
                )}
              </div>

              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm mb-1">
                {item.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{item.description}</p>

              {/* Work Images Grid */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                {item.images.map((img, idx) => (
                  <div key={idx} className="aspect-video rounded-2xl overflow-hidden bg-slate-100">
                    <img src={img} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>

              {/* Before / After Trigger if present */}
              {item.beforeAfter && (
                <button
                  onClick={() => setSelectedBeforeAfter(item.beforeAfter!)}
                  className="w-full py-2 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800/40 flex items-center justify-center gap-1.5 mb-2 hover:bg-amber-100"
                >
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>"Oldin / Keyin" rasmlarini solishtirish</span>
                </button>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Davomiyligi: {item.duration || 'Belgilanmagan'}</span>
                <span>{item.date || 'Yaqinda bajarilgan'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Xizmatlar narxi */}
      {activeTab === 'xizmatlar' && (
        <div className="px-4 mt-4 space-y-3">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-100 dark:border-slate-800 shadow-soft">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-3">
              Xizmat narxlar tariflari
            </h3>
            <div className="space-y-2">
              {specialist.serviceRates?.map((rate) => (
                <div
                  key={rate.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60"
                >
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {rate.title}
                  </span>
                  <span className="text-xs font-extrabold text-brand-600 dark:text-brand-400">
                    {rate.price === 0 ? 'Bepul' : `${formatCurrency(rate.price)} ${rate.unit ? `(${rate.unit})` : ''}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Sharhlar (Reviews) */}
      {activeTab === 'sharhlar' && (
        <div className="px-4 mt-4 space-y-3">
          {specReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-100 dark:border-slate-800 shadow-soft"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <img src={rev.authorAvatar} alt={rev.authorName} className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">{rev.authorName}</h5>
                    <span className="text-[10px] text-slate-400">{rev.createdAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 font-bold text-xs text-slate-900 dark:text-white">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{rev.rating}</span>
                </div>
              </div>

              {rev.isVerifiedOrder && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 mb-2">
                  <CheckCircle2 className="w-3 h-3" /> Haqiqiy buyurtmadan keyin baholangan
                </span>
              )}

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                {rev.comment}
              </p>

              {/* Criteria scores */}
              <div className="grid grid-cols-2 gap-2 text-[10px] pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-500">
                <div>Ish sifati: ⭐ {rev.criteria.quality}/5</div>
                <div>Muomala: ⭐ {rev.criteria.communication}/5</div>
                <div>Vaqtida kelish: ⭐ {rev.criteria.timeliness}/5</div>
                <div>Narx mosligi: ⭐ {rev.criteria.priceMatch}/5</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Before / After Modal */}
      {selectedBeforeAfter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 max-w-sm w-full space-y-4">
            <h4 className="font-extrabold text-base text-slate-900 dark:text-white text-center">
              Oldin va Keyin
            </h4>
            <div className="space-y-3">
              <div>
                <span className="text-xs font-bold text-rose-500 block mb-1">Oldin (Boshlang'ich holat):</span>
                <img src={selectedBeforeAfter.before} alt="Oldin" className="w-full h-44 object-cover rounded-2xl" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-600 block mb-1">Keyin (Usta bajargan ish):</span>
                <img src={selectedBeforeAfter.after} alt="Keyin" className="w-full h-44 object-cover rounded-2xl" />
              </div>
            </div>
            <button
              onClick={() => setSelectedBeforeAfter(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs"
            >
              Yopish
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
