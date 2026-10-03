import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Users, 
  Briefcase, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  DollarSign, 
  Check, 
  Trash2 
} from 'lucide-react';
import { useStore } from '../../lib/store';
import { formatCurrency } from '../../lib/geo';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const { specialists, jobs, reports, actions } = useStore();
  const [adminTab, setAdminTab] = useState<'stats' | 'users' | 'reports' | 'verification'>('stats');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl p-5 shadow-2xl max-h-[90vh] flex flex-col border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                IshTop Ma'muriyat (Admin Panel)
              </h3>
              <p className="text-xs text-slate-500">Platforma xavfsizligi, moderatsiya va nazorat</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mt-3 text-xs font-bold">
          <button
            onClick={() => setAdminTab('stats')}
            className={`flex-1 py-1.5 rounded-xl transition-all ${
              adminTab === 'stats' ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-xs' : 'text-slate-500'
            }`}
          >
            Statistika
          </button>
          <button
            onClick={() => setAdminTab('users')}
            className={`flex-1 py-1.5 rounded-xl transition-all ${
              adminTab === 'users' ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-xs' : 'text-slate-500'
            }`}
          >
            Ustalar ({specialists.length})
          </button>
          <button
            onClick={() => setAdminTab('reports')}
            className={`flex-1 py-1.5 rounded-xl transition-all ${
              adminTab === 'reports' ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-xs' : 'text-slate-500'
            }`}
          >
            Shikoyatlar ({reports.length})
          </button>
        </div>

        {/* Tab 1: Stats */}
        {adminTab === 'stats' && (
          <div className="py-4 space-y-3 overflow-y-auto flex-1 text-xs">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-slate-800 border">
                <span className="text-slate-500 block mb-1">Jami foydalanuvchilar</span>
                <span className="text-xl font-black text-brand-600">14 280 nafar</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-slate-800 border">
                <span className="text-slate-500 block mb-1">Bajarilgan buyurtmalar</span>
                <span className="text-xl font-black text-emerald-600">4 815 ta</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-purple-50/60 dark:bg-slate-800 border">
                <span className="text-slate-500 block mb-1">Faol e'lonlar</span>
                <span className="text-xl font-black text-purple-600">1 294 ta</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-slate-800 border">
                <span className="text-slate-500 block mb-1">Oylik platforma aylanmasi</span>
                <span className="text-xl font-black text-amber-600">420 mln so'm</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border space-y-2">
              <span className="font-extrabold text-slate-800 dark:text-slate-200 block">
                Server & Tizim Holati
              </span>
              <div className="flex items-center justify-between text-slate-500">
                <span>Supabase PostgreSQL ma'lumotlar bazasi</span>
                <span className="text-emerald-500 font-bold">● Ishlamoqda</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>SMS Gateway (PlayMobile)</span>
                <span className="text-emerald-500 font-bold">● Faol</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Xarita xizmati (OpenStreetMap / Leaflet)</span>
                <span className="text-emerald-500 font-bold">● Ulangan</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Users */}
        {adminTab === 'users' && (
          <div className="py-3 space-y-2 overflow-y-auto flex-1">
            {specialists.map((spec) => (
              <div key={spec.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img src={spec.avatar} alt={spec.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <h5 className="font-bold text-xs">{spec.name} {spec.surname}</h5>
                    <p className="text-[10px] text-slate-400">{spec.profession} • {spec.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button className="px-2 py-1 bg-emerald-50 text-emerald-600 font-bold rounded-lg text-[10px]">
                    Tasdiqlangan ✅
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Reports */}
        {adminTab === 'reports' && (
          <div className="py-3 space-y-2 overflow-y-auto flex-1">
            {reports.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-xs text-slate-400">Yangi shikoyatlar mavjud emas.</p>
              </div>
            ) : (
              reports.map((rep) => (
                <div key={rep.id} className="p-3 bg-rose-50/50 rounded-2xl border border-rose-100 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-700">{rep.targetTitle}</span>
                    <span className="text-[10px] text-slate-400">{rep.createdAt}</span>
                  </div>
                  <p className="text-slate-600">{rep.description}</p>
                  <span className="text-[10px] text-rose-600 block">Sabab: {rep.reason}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
