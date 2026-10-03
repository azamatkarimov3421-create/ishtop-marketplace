import React from 'react';
import { MapPin, Bell, Moon, Sun, ChevronDown, Download, LogIn } from 'lucide-react';
import { useStore } from '../../lib/store';

interface HeaderProps {
  onOpenLocation: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenAPKModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenLocation,
  onOpenNotifications,
  onOpenProfile,
  onOpenAPKModal,
}) => {
  const { selectedCity, serviceRadiusKm, notifications, darkMode, actions, user } = useStore();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors">
      <div className="max-w-md mx-auto px-4 pt-3 pb-2 flex items-center justify-between">
        {/* Location & Radius selector */}
        <button
          onClick={onOpenLocation}
          className="flex items-center gap-2.5 text-left group hover:opacity-85 transition-opacity"
        >
          <div className="w-9 h-9 rounded-full bg-brand-50 dark:bg-brand-950/60 flex items-center justify-center text-brand-600 dark:text-brand-400">
            <MapPin className="w-5 h-5 fill-brand-600 dark:fill-brand-400 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-slate-900 dark:text-white text-[15px] leading-tight">
                {selectedCity.name}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-500 group-hover:translate-y-0.5 transition-transform" />
            </div>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-tight">
              Xizmat radiusi: <span className="font-semibold text-brand-600 dark:text-brand-400">{serviceRadiusKm} km</span>
            </p>
          </div>
        </button>

        {/* Right action icons */}
        <div className="flex items-center gap-2">
          {/* APK download pill */}
          <button
            onClick={onOpenAPKModal}
            title="Android APK Yuklab olish"
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 rounded-full hover:bg-emerald-100 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">APK</span>
          </button>

          {/* Dark mode switch */}
          <button
            onClick={() => actions.setDarkMode(!darkMode)}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications bell */}
          <button
            onClick={onOpenNotifications}
            className="relative w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* User Avatar or Login Button */}
          {user ? (
            <button
              onClick={onOpenProfile}
              className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-brand-500/20 hover:ring-brand-500 transition-all ml-0.5"
              title={`${user.name} profili`}
            >
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'}
                alt={user.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white"></span>
            </button>
          ) : (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-xs font-black shadow-sm active:scale-95 transition-all ml-0.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Kirish</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
