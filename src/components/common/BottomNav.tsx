import React from 'react';
import { Home, Search, Plus, MessageSquare, User } from 'lucide-react';
import { useStore } from '../../lib/store';

export type NavTab = 'home' | 'search' | 'create' | 'chat' | 'profile' | 'map' | 'dashboard' | 'favorites';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenCreate: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onOpenCreate,
}) => {
  const { chatRooms } = useStore();
  const totalUnreadChat = chatRooms.reduce((acc, room) => acc + (room.unreadCount || 0), 0);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 transition-colors">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        {/* Bosh sahifa */}
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            activeTab === 'home'
              ? 'text-brand-600 dark:text-brand-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Home className={`w-5 h-5 mb-0.5 ${activeTab === 'home' ? 'fill-brand-600/20 stroke-brand-600 stroke-2' : ''}`} />
          <span className="text-[11px] tracking-tight">Bosh sahifa</span>
        </button>

        {/* Qidiruv */}
        <button
          onClick={() => onTabChange('search')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            activeTab === 'search'
              ? 'text-brand-600 dark:text-brand-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Search className={`w-5 h-5 mb-0.5 ${activeTab === 'search' ? 'stroke-brand-600 stroke-[2.5]' : ''}`} />
          <span className="text-[11px] tracking-tight">Qidiruv</span>
        </button>

        {/* Center Floating Plus Button: E'lon berish */}
        <div className="flex-1 flex justify-center -mt-5">
          <button
            onClick={onOpenCreate}
            className="w-13 h-13 w-[52px] h-[52px] rounded-full bg-brand-600 hover:bg-brand-700 active:scale-95 text-white flex flex-col items-center justify-center shadow-lg shadow-brand-500/40 border-4 border-white dark:border-slate-900 transition-transform"
            aria-label="E'lon yoki buyurtma berish"
          >
            <Plus className="w-7 h-7 stroke-[2.5]" />
          </button>
        </div>

        {/* Xabarlar */}
        <button
          onClick={() => onTabChange('chat')}
          className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            activeTab === 'chat'
              ? 'text-brand-600 dark:text-brand-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <MessageSquare className={`w-5 h-5 mb-0.5 ${activeTab === 'chat' ? 'fill-brand-600/20 stroke-brand-600 stroke-2' : ''}`} />
            {totalUnreadChat > 0 && (
              <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center border border-white dark:border-slate-900">
                {totalUnreadChat}
              </span>
            )}
          </div>
          <span className="text-[11px] tracking-tight">Xabarlar</span>
        </button>

        {/* Profil */}
        <button
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            activeTab === 'profile'
              ? 'text-brand-600 dark:text-brand-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <User className={`w-5 h-5 mb-0.5 ${activeTab === 'profile' ? 'fill-brand-600/20 stroke-brand-600 stroke-2' : ''}`} />
          <span className="text-[11px] tracking-tight">Profil</span>
        </button>
      </div>
    </nav>
  );
};
