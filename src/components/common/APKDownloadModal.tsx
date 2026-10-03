import React, { useState } from 'react';
import { X, Download, Smartphone, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';

interface APKDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const APKDownloadModal: React.FC<APKDownloadModalProps> = ({ isOpen, onClose }) => {
  const [downloadStarted, setDownloadStarted] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setDownloadStarted(true);
    // Trigger download of app-debug.apk from build folder
    const link = document.createElement('a');
    link.href = '/app-debug.apk';
    link.download = 'IshTop-Marketplace-v1.0.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                IshTop Android APK
              </h3>
              <p className="text-[11px] text-slate-400">Mobil telefonga to'liq o'rnatish</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* APK Info Card */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-800 dark:text-emerald-300">Ilova versiyasi:</span>
            <span className="font-black text-emerald-600">v1.0.0 (Capacitor Native)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Hajmi:</span>
            <span className="font-bold text-slate-700 dark:text-slate-200">~6.5 MB</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Android mosligi:</span>
            <span className="font-bold text-slate-700 dark:text-slate-200">Android 8.0 va undan yuqori</span>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-1.5 text-[11px] text-slate-500">
          <div className="flex items-start gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
            <span>1. "APK Yuklab Olish" tugmasini bosing.</span>
          </div>
          <div className="flex items-start gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
            <span>2. Yuklab olingan faylni oching va "O'rnatish"ni tasdiqlang.</span>
          </div>
          <div className="flex items-start gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
            <span>3. Telefoningizda to'liq offline / online usta va ishlar bozori ishga tushadi.</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleDownload}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>{downloadStarted ? 'Yuklab olinmoqda...' : 'APK Yuklab Olish (Yuklash)'}</span>
        </button>
      </div>
    </div>
  );
};
