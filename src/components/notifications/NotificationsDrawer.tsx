import React from 'react';
import { X, Bell, Check, Clock, MessageSquare, Briefcase, Star, ShoppingBag } from 'lucide-react';
import { useStore } from '../../lib/store';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: any) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const { notifications, actions } = useStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[85vh] flex flex-col border border-slate-100 dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Bildirishnomalar</h3>
              <p className="text-xs text-slate-500">So'nggi yangiliklar va takliflar</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => actions.markNotificationsAsRead()}
              className="text-xs font-bold text-brand-600 hover:underline"
            >
              Hammasini o'qish
            </button>
            <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="py-3 overflow-y-auto flex-1 space-y-2.5 divide-y divide-slate-100 dark:divide-slate-800">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                if (n.link === 'chat') onNavigateTab('chat');
                if (n.link === 'jobs') onNavigateTab('search');
                onClose();
              }}
              className={`p-3 rounded-2xl flex items-start gap-3 cursor-pointer transition-colors ${
                !n.isRead ? 'bg-blue-50/50 dark:bg-slate-800/80' : 'bg-transparent hover:bg-slate-50'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border shadow-xs flex items-center justify-center shrink-0">
                {n.type === 'chat' && <MessageSquare className="w-4 h-4 text-sky-500" />}
                {n.type === 'order' && <ShoppingBag className="w-4 h-4 text-emerald-500" />}
                {n.type === 'matching_job' && <Briefcase className="w-4 h-4 text-brand-600" />}
                {n.type === 'review' && <Star className="w-4 h-4 text-amber-500" />}
                {n.type === 'system' && <Bell className="w-4 h-4 text-purple-500" />}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">{n.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                <span className="text-[10px] text-slate-400 mt-1 block">{n.createdAt}</span>
              </div>

              {!n.isRead && <span className="w-2 h-2 rounded-full bg-brand-600 shrink-0 mt-1.5" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
