import React, { useState } from 'react';
import { X, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useStore } from '../../lib/store';

interface ReportModalProps {
  isOpen: boolean;
  targetType: 'profile' | 'job' | 'portfolio' | 'review';
  targetId: string;
  targetTitle: string;
  onClose: () => void;
  onSuccess: () => void;
}

const REASONS = [
  { value: 'fake_profile', label: 'Soxta profil yoki birovning nomidan ochilgan' },
  { value: 'fraud', label: 'Firibgarlik yoki pul talab qilish' },
  { value: 'wrong_info', label: "Noto'g'ri / yolg'on ma'lumot yoki narx" },
  { value: 'spam', label: "Spam yoki takroriy e'lon" },
  { value: 'inappropriate', label: "Nojo'ya yoki haqoratomuz kontent" },
  { value: 'other', label: 'Boshqa sabab' },
];

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  targetType,
  targetId,
  targetTitle,
  onClose,
  onSuccess,
}) => {
  const { user, actions } = useStore();
  const [reason, setReason] = useState<any>('fraud');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    actions.addReport({
      targetType,
      targetId,
      targetTitle,
      reportedBy: user?.name || 'Foydalanuvchi',
      reason,
      description,
    });

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4 border border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Shikoyat Qilish (Report)
              </h3>
              <p className="text-[11px] text-slate-500 truncate max-w-[200px]">{targetTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Shikoyat sababini tanlang:
            </label>
            <div className="space-y-1.5">
              {REASONS.map((r) => (
                <button
                  type="button"
                  key={r.value}
                  onClick={() => setReason(r.value)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs font-medium transition-all ${
                    reason === r.value
                      ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Batafsil tushuntirish:
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Qanday qoidabuzarlik yuz berdi..."
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-rose-500/25 active:scale-95 transition-all"
            >
              Shikoyatni moderatorga yuborish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
