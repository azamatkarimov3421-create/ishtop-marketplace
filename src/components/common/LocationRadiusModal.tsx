import React, { useState } from 'react';
import { X, MapPin, Check, Compass } from 'lucide-react';
import { CITIES } from '../../lib/mockData';
import { useStore } from '../../lib/store';
import { getCurrentGpsPosition, reverseGeocodeOsm } from '../../lib/geo';

interface LocationRadiusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RADIUS_OPTIONS = [
  { value: 1, label: '1 km (Piyoda masofa)' },
  { value: 5, label: '5 km (Mahalla / Atrof)' },
  { value: 10, label: '10 km (Shahar ichida)' },
  { value: 15, label: '15 km (Tavsiya etiladi)' },
  { value: 20, label: '20 km' },
  { value: 30, label: '30 km (Keng qamrov)' },
  { value: 50, label: '50 km (Viloyat yaqin tumanlar)' },
  { value: 100, label: "100 km (Viloyat bo'yicha)" },
  { value: 999, label: "Butun O'zbekiston / Online" },
];

export const LocationRadiusModal: React.FC<LocationRadiusModalProps> = ({ isOpen, onClose }) => {
  const { selectedCity, serviceRadiusKm, actions } = useStore();
  const [tempCity, setTempCity] = useState(selectedCity);
  const [tempRadius, setTempRadius] = useState(serviceRadiusKm);

  if (!isOpen) return null;

  const handleSave = () => {
    actions.setSelectedCity(tempCity);
    actions.setServiceRadiusKm(tempRadius);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[90vh] flex flex-col border border-slate-100 dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Joylashuv va Xizmat Radiusi
              </h3>
              <p className="text-xs text-slate-500">Mutaxassis va ishlarni qidirish hududingiz</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-5 overflow-y-auto flex-1 pr-1">
          {/* GPS Auto-Detect Button */}
          <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-850 rounded-2xl border border-blue-200/70 dark:border-slate-700">
            <button
              type="button"
              onClick={async () => {
                try {
                  const pos = await getCurrentGpsPosition();
                  const geo = await reverseGeocodeOsm(pos.lat, pos.lng);
                  setTempCity({
                    name: geo.city || "Aniq lokatsiya",
                    region: geo.district || "Navoiy",
                    lat: pos.lat,
                    lng: pos.lng
                  });
                } catch (e) {
                  alert("GPS ruxsati berilmadi yoki qurilmangizda GPS yoqilmagan");
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-black shadow-sm transition-all active:scale-95"
            >
              <Compass className="w-4 h-4" />
              <span>📍 Aniq GPS orqali joylashuvimni aniqlash</span>
            </button>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 text-center">
              Hozirgi turgan joyingiz: <strong className="text-slate-700 dark:text-slate-200">{tempCity.name}</strong>
            </p>
          </div>

          {/* City Selection */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
              Yoki shaharni qo'lda tanlang:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CITIES.map((city) => {
                const isSelected = tempCity.name === city.name;
                return (
                  <button
                    key={city.name}
                    onClick={() => setTempCity(city)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50/70 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 ring-2 ring-brand-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <MapPin className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-brand-600' : 'text-slate-400'}`} />
                    <span className="truncate">{city.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 ml-auto text-brand-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Radius Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Xizmat Ko'rsatish Radiusi:
              </label>
              <span className="text-xs font-extrabold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-2 py-0.5 rounded-full">
                {tempRadius === 999 ? "Butun O'zbekiston" : `${tempRadius} km`}
              </span>
            </div>

            <div className="space-y-1.5">
              {RADIUS_OPTIONS.map((opt) => {
                const isSelected = tempRadius === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setTempRadius(opt.value)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50/60 dark:bg-brand-950/50 text-brand-800 dark:text-brand-200 font-semibold'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span>{opt.label}</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-brand-600 bg-brand-600' : 'border-slate-300'}`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Bekor qilish
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition-all"
          >
            Tanlashni saqlash
          </button>
        </div>
      </div>
    </div>
  );
};
