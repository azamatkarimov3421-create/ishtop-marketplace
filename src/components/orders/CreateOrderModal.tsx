import React, { useState } from 'react';
import { X, Calendar, DollarSign, MapPin, Wrench } from 'lucide-react';
import { SpecialistProfile } from '../../types';
import { useStore } from '../../lib/store';

interface CreateOrderModalProps {
  isOpen: boolean;
  specialist?: SpecialistProfile | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateOrderModal: React.FC<CreateOrderModalProps> = ({
  isOpen,
  specialist,
  onClose,
  onSuccess,
}) => {
  const { user, selectedCity, actions } = useStore();

  const [serviceTitle, setServiceTitle] = useState(
    specialist ? `${specialist.profession} xizmati` : 'Tezkor usta chaqirish'
  );
  const [problemDescription, setProblemDescription] = useState('');
  const [budget, setBudget] = useState(500000);
  const [address, setAddress] = useState(user?.city ? `${user.city}, Markaz` : `${selectedCity.name}, Markaz`);
  const [requiredDate, setRequiredDate] = useState('2026-10-15');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemDescription) return;

    actions.createOrder({
      customerId: user?.id || 'guest-' + Date.now(),
      customerName: user ? `${user.name} ${user.surname}` : 'Buyurtmachi',
      customerPhone: user?.phone || '+998 ',
      specialistId: specialist?.id || 'spec-1',
      specialistName: specialist?.name || 'Mutaxassis',
      specialistAvatar: specialist?.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80',
      serviceTitle,
      category: specialist?.profession || 'Usta xizmati',
      problemDescription,
      budget: Number(budget),
      city: selectedCity.name,
      address,
      requiredDate,
      notes,
    });

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[90vh] flex flex-col border border-slate-100 dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                {specialist ? `${specialist.name} ga buyurtma berish` : 'Xizmat buyurtma qilish'}
              </h3>
              <p className="text-xs text-slate-500">Mutaxassis ko'rib chiqadi va siz bilan bog'lanadi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="py-4 space-y-3.5 overflow-y-auto flex-1 pr-1">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Xizmat turi / Nomi
            </label>
            <input
              type="text"
              required
              value={serviceTitle}
              onChange={(e) => setServiceTitle(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Muammo yoki topshiriq tavsifi *
            </label>
            <textarea
              required
              rows={3}
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              placeholder="Nima qilish kerak, o'lchamlari, qanday materiallar kerak..."
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Mo'ljallangan byudjet (so'm)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Kerakli sana
              </label>
              <input
                type="date"
                value={requiredDate}
                onChange={(e) => setRequiredDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Manzil (Ustaning kelishi uchun)
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Qo'shimcha izoh / Shartlar
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Masalan: Faqat tushdan keyin telefon qiling"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/25 active:scale-[0.99] transition-all"
            >
              Buyurtmani yuborish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
