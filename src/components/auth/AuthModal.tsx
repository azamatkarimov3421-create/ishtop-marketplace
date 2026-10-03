import React, { useState } from 'react';
import { X, Phone, Mail, Lock, ShieldCheck, Check, UserCheck } from 'lucide-react';
import { UserRole } from '../../types';
import { useStore } from '../../lib/store';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ALL_ROLES: { id: UserRole; label: string; icon: string; desc: string }[] = [
  { id: 'usta', label: 'Usta', icon: '🔨', desc: "Mebel, santexnika, ta'mir ustalari" },
  { id: 'ishchi', label: 'Ishchi', icon: '👷', desc: 'Doimiy yoki kunlik ish qidiruvchilar' },
  { id: 'freelancer', label: 'Freelancer', icon: '💻', desc: 'Dizayn, IT, tarjima va masofaviy mutaxassis' },
  { id: 'xizmat', label: "Xizmat ko'rsatuvchi", icon: '📦', desc: 'Tozalash, yuk tashish va servislar' },
  { id: 'buyurtmachi', label: 'Buyurtmachi', icon: '🏠', desc: 'Usta yoki xizmatga muhtoj shaxslar' },
  { id: 'ishberuvchi', label: 'Ish beruvchi', icon: '📢', desc: 'Vakansiya joylovchi korxona va tadbirkorlar' },
  { id: 'kompaniya', label: 'Kompaniya', icon: '🏢', desc: 'Yuridik shaxslar va brendlar' },
];

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { actions } = useStore();
  const [step, setStep] = useState<'method' | 'otp' | 'roles'>('method');
  const [phone, setPhone] = useState('+998 90 123 45 67');
  const [otpCode, setOtpCode] = useState('7788');
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>(['usta', 'buyurtmachi']);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const toggleRole = (role: UserRole) => {
    if (selectedRoles.includes(role)) {
      if (selectedRoles.length > 1) {
        setSelectedRoles(selectedRoles.filter((r) => r !== role));
      }
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSupabaseConfigured) {
      try {
        const cleanPhone = phone.replace(/\s+/g, '');
        await supabase.auth.signInWithOtp({ phone: cleanPhone });
      } catch (err) {
        console.warn("Supabase OTP send notice:", err);
      }
    }

    setLoading(false);
    setStep('otp');
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSupabaseConfigured && otpCode.length === 6) {
      try {
        const cleanPhone = phone.replace(/\s+/g, '');
        await supabase.auth.verifyOtp({ phone: cleanPhone, token: otpCode, type: 'sms' });
      } catch (err) {
        console.warn("Supabase OTP verify notice:", err);
      }
    }

    setLoading(false);
    setStep('roles');
  };

  const handleFinish = () => {
    actions.setUser({
      id: 'current-user-id',
      name: 'Sherzod',
      surname: 'Alimov',
      phone,
      email: 'sherzod.user@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      roles: selectedRoles,
      currentRole: selectedRoles[0],
      isVerified: true,
      city: 'Navoiy shahri',
      lat: 40.0844,
      lng: 65.3792,
      serviceRadiusKm: 30,
    });
    onSuccess();
    onClose();
  };

  const handleGoogleLogin = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin
          }
        });
        return;
      } catch (err) {
        console.warn("Google login fallback:", err);
      }
    }
    setStep('roles');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4 border border-slate-100 dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              {step === 'method' && 'IshTop Tizimiga Kirish'}
              {step === 'otp' && 'SMS Kodni Tasdiqlash'}
              {step === 'roles' && 'Hisob Rollarini Tanlash'}
            </h3>
            <p className="text-xs text-slate-500">
              {step === 'method' && 'Telefon raqam yoki Google orqali'}
              {step === 'otp' && `${phone} raqamiga yuborilgan kod`}
              {step === 'roles' && "Bir vaqtning o'zida bir nechta rolni tanlashingiz mumkin"}
            </p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step 1: Method */}
        {step === 'method' && (
          <div className="space-y-4 pt-1">
            <form onSubmit={handlePhoneSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Telefon raqamingiz
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-brand-500/25 active:scale-95 transition-all"
              >
                SMS Kodni olish
              </button>
            </form>

            <div className="relative flex items-center justify-center">
              <span className="h-px bg-slate-200 dark:bg-slate-800 w-full"></span>
              <span className="px-3 bg-white dark:bg-slate-900 text-[11px] font-bold text-slate-400 absolute">
                YOKI
              </span>
            </div>

            {/* Google Login button */}
            <button
              onClick={handleGoogleLogin}
              className="w-full py-2.5 px-4 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.34 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.98 0 12s.46 3.84 1.26 5.42l4.02-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Google orqali bir bosishda kirish</span>
            </button>
          </div>
        )}

        {/* Step 2: OTP */}
        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="space-y-4 pt-1">
            <div className="text-center py-2">
              <span className="text-xs text-slate-500 block mb-2">
                Sinov kodi avtomatik to'ldirildi:
              </span>
              <input
                type="text"
                maxLength={4}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-40 mx-auto text-center tracking-[12px] text-xl font-black py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-md"
            >
              Kodni tasdiqlash
            </button>
          </form>
        )}

        {/* Step 3: Multi-role selection */}
        {step === 'roles' && (
          <div className="space-y-3 pt-1">
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {ALL_ROLES.map((role) => {
                const isSelected = selectedRoles.includes(role.id);
                return (
                  <div
                    key={role.id}
                    onClick={() => toggleRole(role.id)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50/70 dark:bg-brand-950/40'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-2xl">{role.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                        {role.label}
                      </h4>
                      <p className="text-[10px] text-slate-500">{role.desc}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-brand-500/25 active:scale-95 transition-all"
            >
              Tanlangan rollar bilan boshlash
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
