import React, { useState } from 'react';
import { 
  Briefcase, 
  Clock, 
  DollarSign, 
  Star, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Wrench, 
  FileText,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { useStore } from '../../lib/store';
import { Order, Job, JobApplication } from '../../types';
import { formatCurrency } from '../../lib/geo';

interface DashboardViewProps {
  onOpenCreateJob: () => void;
  onOpenCreateOrder: () => void;
  onReviewOrder: (order: Order) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenCreateJob,
  onOpenCreateOrder,
  onReviewOrder,
}) => {
  const { user, orders, jobs, applications, actions } = useStore();
  const [activePanel, setActivePanel] = useState<'buyurtmachi' | 'usta' | 'ishchi' | 'ishberuvchi'>('usta');

  return (
    <div className="max-w-md mx-auto px-4 pb-24 pt-3 space-y-4 animate-fade-in">
      {/* Top Welcome Card */}
      <div className="bg-gradient-to-r from-brand-600 to-indigo-700 rounded-3xl p-5 text-white shadow-soft">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
              alt={user?.name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-white/40"
            />
            <div>
              <h2 className="font-extrabold text-base leading-tight">
                {user?.name} {user?.surname}
              </h2>
              <span className="text-xs text-blue-100 opacity-90">Boshqaruv Paneli</span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-xs">
            ⭐ 4.9 Reyting
          </span>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/20 text-center">
          <div>
            <span className="text-[11px] opacity-80 block">Buyurtmalar</span>
            <span className="font-black text-sm">{orders.length} ta</span>
          </div>
          <div>
            <span className="text-[11px] opacity-80 block">Arizalar</span>
            <span className="font-black text-sm">{applications.length} ta</span>
          </div>
          <div>
            <span className="text-[11px] opacity-80 block">Daromad</span>
            <span className="font-black text-sm">18.5M</span>
          </div>
        </div>
      </div>

      {/* Role Panel Switcher Bar */}
      <div>
        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
          Rol panelini tanlang:
        </label>
        <div className="grid grid-cols-4 gap-1.5 bg-slate-200/60 dark:bg-slate-800/80 p-1 rounded-2xl text-[11px] font-bold text-center">
          {[
            { id: 'usta', label: '🔨 Usta' },
            { id: 'ishchi', label: '👷 Ishchi' },
            { id: 'buyurtmachi', label: '📦 Mijoz' },
            { id: 'ishberuvchi', label: '📢 Ish beruvchi' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActivePanel(tab.id as any)}
              className={`py-2 px-1 rounded-xl transition-all ${
                activePanel === tab.id
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Panel 1: Usta Paneli */}
      {activePanel === 'usta' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Xizmat Buyurtmalari ({orders.length})
            </h3>
            <button
              onClick={onOpenCreateOrder}
              className="text-xs font-bold text-brand-600 hover:underline"
            >
              + Yangi buyurtma
            </button>
          </div>

          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-100 dark:border-slate-800 shadow-soft space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700">
                      {order.category}
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1">
                      {order.serviceTitle}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">Mijoz: {order.customerName}</p>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider ${
                      order.status === 'bajarildi'
                        ? 'bg-emerald-50 text-emerald-600'
                        : order.status === 'jarayonda'
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-amber-50 text-amber-600'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl">
                  {order.problemDescription}
                </p>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span className="font-extrabold text-emerald-600">{formatCurrency(order.budget)}</span>
                  <div className="flex gap-1.5">
                    {order.status !== 'bajarildi' && (
                      <button
                        onClick={() => actions.updateOrderStatus(order.id, 'bajarildi')}
                        className="py-1 px-3 bg-emerald-600 text-white rounded-xl font-bold text-xs"
                      >
                        Bajarildi deb belgilash
                      </button>
                    )}
                    {order.status === 'bajarildi' && (
                      <button
                        onClick={() => onReviewOrder(order)}
                        className="py-1 px-3 bg-amber-500 text-white rounded-xl font-bold text-xs"
                      >
                        ⭐ Baholash
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Panel 2: Ishchi Paneli */}
      {activePanel === 'ishchi' && (
        <div className="space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
            Yuborilgan Arizalar ({applications.length})
          </h3>
          {applications.length === 0 ? (
            <div className="text-center py-8 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100">
              <span className="text-3xl block mb-2">📄</span>
              <p className="text-xs text-slate-500">Hozircha arizalar yo'q. Ishlar bo'limidan ariza topshiring.</p>
            </div>
          ) : (
            applications.map((app) => (
              <div key={app.id} className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs">{app.jobTitle}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">
                    Kutilmoqda
                  </span>
                </div>
                <p className="text-xs text-slate-500">{app.coverLetter}</p>
                <div className="text-xs font-bold text-brand-600">
                  Kutilayotgan maosh: {formatCurrency(app.expectedSalary)}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Panel 3: Mijoz Paneli */}
      {activePanel === 'buyurtmachi' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Mening Buyurtmalarim
            </h3>
            <button onClick={onOpenCreateOrder} className="text-xs font-bold text-brand-600">
              + Yangi buyurtma
            </button>
          </div>
          <div className="space-y-2">
            {orders.map((o) => (
              <div key={o.id} className="p-3 bg-white dark:bg-slate-900 rounded-2xl border flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs">{o.serviceTitle}</h4>
                  <p className="text-[11px] text-slate-500">Usta: {o.specialistName}</p>
                </div>
                <span className="text-xs font-black text-brand-600">{formatCurrency(o.budget)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Panel 4: Ish beruvchi Paneli */}
      {activePanel === 'ishberuvchi' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              E'lonlarim ({jobs.length})
            </h3>
            <button onClick={onOpenCreateJob} className="text-xs font-bold text-brand-600">
              + E'lon berish
            </button>
          </div>
          <div className="space-y-2">
            {jobs.slice(0, 3).map((j) => (
              <div key={j.id} className="p-3 bg-white dark:bg-slate-900 rounded-2xl border flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs">{j.title}</h4>
                  <p className="text-[11px] text-slate-500">{j.applicationsCount} ta nomzod topshirdi</p>
                </div>
                <span className="text-xs font-bold text-emerald-600">Faol</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
