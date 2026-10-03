import React, { useState } from 'react';
import { X, Star, CheckCircle2 } from 'lucide-react';
import { Order } from '../../types';
import { useStore } from '../../lib/store';

interface ReviewModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  order,
  onClose,
  onSuccess,
}) => {
  const { user, actions } = useStore();
  const [rating, setRating] = useState(5);
  const [quality, setQuality] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [timeliness, setTimeliness] = useState(5);
  const [priceMatch, setPriceMatch] = useState(5);
  const [comment, setComment] = useState('');

  if (!isOpen || !order) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment) return;

    actions.addReview({
      targetId: order.specialistId,
      authorId: user?.id || 'current-user-id',
      authorName: user ? `${user.name} ${user.surname}` : 'Mijoz',
      authorAvatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      rating,
      criteria: {
        quality,
        communication,
        timeliness,
        priceMatch,
      },
      comment,
      isVerifiedOrder: true,
    });

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4 border border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              {order.specialistName} ustani baholash
            </h3>
            <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Tasdiqlangan buyurtma asosida
            </span>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {/* Main Star Picker */}
          <div className="text-center py-2 bg-amber-50/50 dark:bg-slate-800/60 rounded-2xl">
            <span className="text-xs font-bold text-slate-600 block mb-1">Umumiy baho</span>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setRating(s)}
                  className="p-1 transform hover:scale-125 transition-transform"
                >
                  <Star
                    className={`w-7 h-7 ${
                      s <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Criteria Selectors */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-medium">Ish sifati:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((v) => (
                  <button
                    type="button"
                    key={v}
                    onClick={() => setQuality(v)}
                    className={`w-6 h-6 rounded-lg text-[11px] font-bold ${
                      v === quality ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-medium">Muomala va madaniyat:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((v) => (
                  <button
                    type="button"
                    key={v}
                    onClick={() => setCommunication(v)}
                    className={`w-6 h-6 rounded-lg text-[11px] font-bold ${
                      v === communication ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-medium">Vaqtida kelish:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((v) => (
                  <button
                    type="button"
                    key={v}
                    onClick={() => setTimeliness(v)}
                    className={`w-6 h-6 rounded-lg text-[11px] font-bold ${
                      v === timeliness ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-medium">Narxning mosligi:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((v) => (
                  <button
                    type="button"
                    key={v}
                    onClick={() => setPriceMatch(v)}
                    className={`w-6 h-6 rounded-lg text-[11px] font-bold ${
                      v === priceMatch ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Fikr va tavsiyangiz:
            </label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Usta ishni qanday bajardi, kelajakdagi mijozlarga nima deya olasiz..."
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-md shadow-amber-500/25 active:scale-95 transition-all"
          >
            Bahoni saqlash va e'lon qilish
          </button>
        </form>
      </div>
    </div>
  );
};
