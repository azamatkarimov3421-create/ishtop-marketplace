import React, { useState } from 'react';
import { Sparkles, X, ArrowRight, Mic, CheckCircle2, User, Search } from 'lucide-react';
import { useStore } from '../../lib/store';
import { SpecialistProfile } from '../../types';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSpecialist: (spec: SpecialistProfile) => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  onSelectSpecialist,
}) => {
  const { specialists } = useStore();
  const [query, setQuery] = useState("Menga Navoiyda 20 km ichida 5 milliongacha bo'lgan elektrik kerak");
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedParams, setExtractedParams] = useState<{
    kategoriya?: string;
    hudud?: string;
    radius?: string;
    byudjet?: string;
  } | null>(null);
  const [matchedResults, setMatchedResults] = useState<SpecialistProfile[]>([]);

  if (!isOpen) return null;

  const handleProcess = () => {
    if (!query) return;
    setIsProcessing(true);

    setTimeout(() => {
      const q = query.toLowerCase();
      let cat = 'Elektrik';
      let hudud = 'Navoiy shahri';
      let rad = '20 km';
      let byudjet = "5 000 000 so'm";

      if (q.includes('mebel')) {
        cat = 'Mebel';
      } else if (q.includes('santexnik')) {
        cat = 'Santexnik';
      } else if (q.includes('dizayn')) {
        cat = 'Dizayn';
      }

      setExtractedParams({
        kategoriya: cat,
        hudud: hudud,
        radius: rad,
        byudjet: byudjet,
      });

      const results = specialists.filter((s) =>
        s.profession.toLowerCase().includes(cat.toLowerCase())
      );
      setMatchedResults(results);
      setIsProcessing(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[90vh] flex flex-col border border-purple-200 dark:border-purple-900/40">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-base">
                IshTop AI Aqlli Qidiruv
              </h3>
              <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
                Oddiy tilda so'rang, AI topib beradi
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4 overflow-y-auto flex-1 pr-1">
          {/* Natural language input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Qanday ishchi yoki xizmat kerakligini erkin yozing:
            </label>
            <div className="relative">
              <textarea
                rows={3}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Masalan: Menga Navoiyda 20 km ichida elektrik kerak..."
                className="w-full p-3 bg-purple-50/50 dark:bg-slate-800/80 border border-purple-200 dark:border-purple-800 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <button
            onClick={handleProcess}
            disabled={isProcessing}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isProcessing ? 'AI parametrlarni tahlil qilmoqda...' : 'AI orqali mutaxassis topish'}</span>
          </button>

          {/* Extracted Parameters Card */}
          {extractedParams && (
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 animate-slide-up">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                AI ajratib olgan parametrlar:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-white dark:bg-slate-900 rounded-xl">
                  <span className="text-slate-400 text-[10px] block">Kategoriya:</span>
                  <span className="font-bold text-purple-600">{extractedParams.kategoriya}</span>
                </div>
                <div className="p-2 bg-white dark:bg-slate-900 rounded-xl">
                  <span className="text-slate-400 text-[10px] block">Hudud:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{extractedParams.hudud}</span>
                </div>
                <div className="p-2 bg-white dark:bg-slate-900 rounded-xl">
                  <span className="text-slate-400 text-[10px] block">Xizmat radiusi:</span>
                  <span className="font-bold text-brand-600">{extractedParams.radius}</span>
                </div>
                <div className="p-2 bg-white dark:bg-slate-900 rounded-xl">
                  <span className="text-slate-400 text-[10px] block">Mo'ljallangan narx:</span>
                  <span className="font-bold text-emerald-600">{extractedParams.byudjet}</span>
                </div>
              </div>
            </div>
          )}

          {/* Matched Specialists */}
          {matchedResults.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Topilgan mos mutaxassislar ({matchedResults.length} ta):
              </span>
              {matchedResults.map((spec) => (
                <div
                  key={spec.id}
                  onClick={() => {
                    onSelectSpecialist(spec);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 cursor-pointer transition-all shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <img src={spec.avatar} alt={spec.name} className="w-11 h-11 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">{spec.name}</h4>
                      <p className="text-[11px] text-slate-500">{spec.profession}</p>
                      <span className="text-[10px] text-brand-600 font-semibold">⭐ {spec.rating} ({spec.reviewCount})</span>
                    </div>
                  </div>
                  <button className="py-1 px-2.5 rounded-lg bg-purple-50 text-purple-700 text-xs font-bold">
                    Tanlash
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
