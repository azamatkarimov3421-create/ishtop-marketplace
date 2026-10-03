import React from 'react';
import { X, Printer, Download, CheckCircle2, Phone, Mail, MapPin, Award } from 'lucide-react';
import { SpecialistProfile } from '../../types';
import { formatCurrency } from '../../lib/geo';

interface CVModalProps {
  isOpen: boolean;
  specialist: SpecialistProfile | null;
  onClose: () => void;
}

export const CVModal: React.FC<CVModalProps> = ({ isOpen, specialist, onClose }) => {
  if (!isOpen || !specialist) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white text-slate-900 w-full max-w-xl rounded-3xl p-6 shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header Controls */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="font-extrabold text-base">IshTop Professional Rezyume (CV)</h3>
            <p className="text-xs text-slate-500">Avtomatik shakllantirilgan rasmiy rezyume formati</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="py-1.5 px-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Chop etish / PDF</span>
            </button>
            <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable CV Document Content */}
        <div className="py-4 space-y-4 overflow-y-auto flex-1 pr-1 text-slate-800 text-xs">
          {/* Header CV Card */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <img
              src={specialist.avatar}
              alt={specialist.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-brand-500"
            />
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg font-black text-slate-900">{specialist.name} {specialist.surname}</h2>
                <CheckCircle2 className="w-4 h-4 text-brand-600 fill-brand-600 text-white" />
              </div>
              <p className="font-bold text-brand-600 text-xs mt-0.5">{specialist.profession}</p>
              <p className="text-slate-500 text-[11px]">{specialist.specialty}</p>

              <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500 flex-wrap">
                <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-brand-600" /> {specialist.phone}</span>
                <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-brand-600" /> {specialist.email}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-brand-600" /> {specialist.city}</span>
              </div>
            </div>
          </div>

          {/* Maqsad & Haqida */}
          <div>
            <h4 className="font-extrabold text-xs text-brand-700 uppercase tracking-wider mb-1">
              Kasbiy Maqsad va Bio
            </h4>
            <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {specialist.about}
            </p>
          </div>

          {/* Ko'nikmalar */}
          <div>
            <h4 className="font-extrabold text-xs text-brand-700 uppercase tracking-wider mb-1.5">
              Kasbiy Ko'nikmalar (Skills)
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {specialist.skills?.map((s, i) => (
                <span key={i} className="px-2.5 py-1 bg-brand-50 text-brand-800 font-bold rounded-lg border border-brand-200">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Tajriba & Ta'lim */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block mb-1">UMUMIY TAJRIBA</span>
              <p className="font-bold text-sm text-slate-900">{specialist.experienceYears} yil amaliy tajriba</p>
              <p className="text-slate-500 text-[11px] mt-1">{specialist.completedJobsCount} ta muvaffaqiyatli ish</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block mb-1">TA'LIM</span>
              <p className="font-bold text-sm text-slate-900">{specialist.education || 'Oliy / Maxsus kasbiy'}</p>
              <p className="text-slate-500 text-[11px] mt-1">Sertifikatlangan mutaxassis</p>
            </div>
          </div>

          {/* Sertifikatlar */}
          <div>
            <h4 className="font-extrabold text-xs text-brand-700 uppercase tracking-wider mb-1">
              Sertifikatlar va Ruxsatnomalar
            </h4>
            <div className="space-y-1">
              {specialist.certificates?.map((c, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span className="font-bold text-xs">{c}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Maosh & Hudud */}
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-emerald-800 font-bold block">ISTALGAN MAOSH / DAROMAD</span>
              <span className="font-black text-sm text-emerald-700">{formatCurrency(specialist.expectedSalary)}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-emerald-800 font-bold block">XIZMAT HUDUDI</span>
              <span className="font-bold text-xs text-emerald-700">{specialist.city} (radius: {specialist.serviceRadiusKm} km)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
