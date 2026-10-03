import React, { useState } from 'react';
import { X, Briefcase, DollarSign, Clock, MapPin } from 'lucide-react';
import { SpecialistProfile } from '../../types';
import { useStore } from '../../lib/store';

interface InvitationModalProps {
  isOpen: boolean;
  specialist: SpecialistProfile | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const InvitationModal: React.FC<InvitationModalProps> = ({
  isOpen,
  specialist,
  onClose,
  onSuccess,
}) => {
  const { user } = useStore();
  const [position, setPosition] = useState(specialist ? `${specialist.profession} lavozimi` : 'Mutaxassis');
  const [salary, setSalary] = useState(specialist ? specialist.expectedSalary : 8000000);
  const [workHours, setWorkHours] = useState('09:00 - 18:00');
  const [startDate, setStartDate] = useState('2026-10-15');
  const [description, setDescription] = useState(
    "Assalomu alaykum! Biz sizning profilingiz va bajargan ishlaringizni ko'rib chiqdik va jamoamizga doimiy asosda ishga taklif qilmoqchimiz."
  );

  if (!isOpen || !specialist) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[90vh] flex flex-col border border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                {specialist.name} ga Ish Taklifi
              </h3>
              <p className="text-xs text-slate-500">Rasmiy ish taklifini jo'natish</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-3.5 overflow-y-auto flex-1 pr-1">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Taklif etilayotgan lavozim</label>
            <input
              type="text"
              required
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Taklif oylik maoshi</label>
              <input
                type="number"
                value={salary}
                onChange={(e) => setSalary(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Ish boshlash sanasi</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Ish grafigi</label>
            <input
              type="text"
              value={workHours}
              onChange={(e) => setWorkHours(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Xabar va shartlar</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm shadow-lg shadow-brand-500/25"
          >
            Taklifnomani yuborish
          </button>
        </form>
      </div>
    </div>
  );
};
