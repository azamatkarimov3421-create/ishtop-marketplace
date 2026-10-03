import React, { useState } from 'react';
import { X, Phone, Mail, Lock, ShieldCheck, Check, UserCheck, AlertCircle, Loader2, Copy, ExternalLink, HelpCircle } from 'lucide-react';
import { UserRole } from '../../types';
import { useStore } from '../../lib/store';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { CITIES } from '../../lib/mockData';

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
  const [mode, setMode] = useState<'register' | 'login'>('register');
  
  // Registration fields
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('Navoiy shahri');
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>(['usta', 'buyurtmachi']);
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showGoogleGuide, setShowGoogleGuide] = useState(false);
  const [copiedCallback, setCopiedCallback] = useState(false);

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg("Iltimos, ismingizni kiriting");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Parol kamida 6 ta belgidan iborat bo'lishi kerak");
      return;
    }

    setLoading(true);

    try {
      const cleanPhone = phone.trim();
      const generatedEmail = email.trim() || `user_${Date.now()}@ishtop.uz`;

      // 1. Supabase Auth Sign Up
      let userId = 'user-' + Date.now();
      if (isSupabaseConfigured) {
        const { data: authData, error: authErr } = await supabase.auth.signUp({
          email: generatedEmail,
          password: password,
          options: {
            data: {
              first_name: name.trim(),
              last_name: surname.trim(),
              full_name: `${name.trim()} ${surname.trim()}`,
              phone: cleanPhone,
              city,
              roles: selectedRoles
            }
          }
        });

        if (authErr) {
          console.warn("Supabase Auth notice:", authErr.message);
        }
        if (authData?.user) {
          userId = authData.user.id;
        }

        // 2. Insert into profiles table
        supabase.from('profiles').insert([{
          user_id: userId,
          name: name.trim(),
          surname: surname.trim(),
          phone: cleanPhone,
          email: generatedEmail,
          city,
          profession: selectedRoles.includes('usta') ? 'Usta' : selectedRoles.includes('freelancer') ? 'Freelancer' : 'Mutaxassis',
          rating: 5.0,
          review_count: 0
        }]).then(({ error }) => {
          if (error) console.info("Profiles insert note:", error.message);
        });
      }

      // 3. Save to active client store
      actions.setUser({
        id: userId,
        name: name.trim(),
        surname: surname.trim(),
        phone: cleanPhone,
        email: generatedEmail,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        roles: selectedRoles,
        currentRole: selectedRoles[0],
        isVerified: true,
        city,
        lat: 40.0844,
        lng: 65.3792,
        serviceRadiusKm: 30,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Ro'yxatdan o'tishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: loginEmail.trim(),
          password: loginPassword,
        });

        if (error) {
          throw error;
        }

        if (data?.user) {
          const meta = data.user.user_metadata || {};
          const fullName = meta.full_name || meta.name || loginEmail.split('@')[0];
          const parts = fullName.split(' ');
          actions.setUser({
            id: data.user.id,
            name: parts[0] || 'Foydalanuvchi',
            surname: parts.slice(1).join(' ') || '',
            phone: meta.phone || data.user.phone || '+998 ',
            email: data.user.email || loginEmail,
            avatar: meta.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
            roles: meta.roles || ['buyurtmachi', 'usta'],
            currentRole: meta.roles?.[0] || 'buyurtmachi',
            isVerified: true,
            city: meta.city || 'Navoiy shahri',
            lat: 40.0844,
            lng: 65.3792,
            serviceRadiusKm: 30,
          });
          onSuccess();
          onClose();
          return;
        }
      }

      // Fallback local login if offline or demo
      actions.setUser({
        id: 'usr-' + Date.now(),
        name: loginEmail.split('@')[0] || 'Foydalanuvchi',
        surname: '',
        phone: '+998 90 123 45 67',
        email: loginEmail,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        roles: ['buyurtmachi', 'usta'],
        currentRole: 'buyurtmachi',
        isVerified: true,
        city: 'Navoiy shahri',
        lat: 40.0844,
        lng: 65.3792,
        serviceRadiusKm: 30,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Kirishda xatolik: Email yoki parol noto'g'ri");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setLoading(true);
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin
          }
        });
        if (error) {
          throw error;
        }
      } catch (err: any) {
        const msg = err.message || '';
        if (msg.toLowerCase().includes('provider is not enabled') || msg.toLowerCase().includes('unsupported') || msg.toLowerCase().includes('validation_failed')) {
          setShowGoogleGuide(true);
          setErrorMsg("Supabase tizimida Google provayderi hali yoqilmagan. Quyidagi qo'llanma orqali Google OAuth sozlang.");
        } else {
          setErrorMsg(msg || "Google orqali kirishda xatolik yuz berdi.");
        }
        setLoading(false);
      }
    } else {
      setErrorMsg("Supabase ulanishi topilmadi.");
      setLoading(false);
    }
  };

  const handleCopyCallback = () => {
    navigator.clipboard.writeText('https://iugjwbeqrtjytadtfmne.supabase.co/auth/v1/callback');
    setCopiedCallback(true);
    setTimeout(() => setCopiedCallback(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4 border border-slate-100 dark:border-slate-800 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              {mode === 'register' ? "IshTop-da Ro'yxatdan O'tish" : "Tizimga Kirish"}
            </h3>
            <p className="text-xs text-slate-500">
              {mode === 'register' ? "O'z hisobingizni oching va imkoniyatlardan foydalaning" : "Shaxsiy profilingizga kiring"}
            </p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1">
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(null); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'register'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Ro'yxatdan o'tish
          </button>
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(null); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'login'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Kirish
          </button>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* REGISTRATION FORM */}
        {mode === 'register' ? (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Ismingiz *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Sardor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Familiyangiz
                </label>
                <input
                  type="text"
                  placeholder="Masalan: Karimov"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Telefon raqamingiz *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  required
                  placeholder="+998 90 123 45 67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Email (ixtiyoriy)
                </label>
                <input
                  type="email"
                  placeholder="nomi@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Parol *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Kamida 6 belgi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Hududingiz / Shahar
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
              >
                {CITIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Role Multi-Selection */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Faoliyat turlaringizni tanlang (bir nechta tanlash mumkin):
              </label>
              <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto p-1 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
                {ALL_ROLES.map((r) => {
                  const isSelected = selectedRoles.includes(r.id);
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => toggleRole(r.id)}
                      className={`flex items-center gap-2 p-2 rounded-lg border text-left text-xs transition-all ${
                        isSelected
                          ? 'border-brand-600 bg-brand-50/70 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white'
                      }`}
                    >
                      <span>{r.icon}</span>
                      <span className="truncate">{r.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 ml-auto text-brand-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-brand-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Hisob yaratish va Kirish</span>
            </button>
          </form>
        ) : (
          /* LOGIN FORM */
          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Email yoki Telefon
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="nomi@gmail.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Parolingiz
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="Parolingizni kiriting"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-brand-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Profilingizga Kirish</span>
            </button>
          </form>
        )}

        <div className="relative flex items-center justify-center pt-1">
          <span className="h-px bg-slate-200 dark:bg-slate-800 w-full"></span>
          <span className="px-3 bg-white dark:bg-slate-900 text-[10px] font-bold text-slate-400 absolute">
            YOKI
          </span>
        </div>

        {/* Google OAuth Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-2.5 px-4 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2 transition-colors active:scale-98"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.34 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.98 0 12s.46 3.84 1.26 5.42l4.02-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
          )}
          <span>Google orqali kirish</span>
        </button>

        {/* Google Setup Guide Dropdown / Box */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowGoogleGuide(!showGoogleGuide)}
            className="w-full text-center text-[11px] font-semibold text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 flex items-center justify-center gap-1 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Google orqali kirishni sozlash yo'riqnomasi</span>
          </button>

          {showGoogleGuide && (
            <div className="mt-2.5 p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-2 animate-slide-down">
              <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>Google OAuth sozlash (2 daqiqa):</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold">
                  Admin
                </span>
              </div>

              <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                <li>
                  <strong>Google Cloud Console</strong> &gt; <em>Credentials</em> &gt; <strong>+ Create Credentials</strong> &gt; <strong>OAuth client ID</strong> (Web application) tanlang.
                </li>
                <li>
                  <strong>Authorized redirect URIs</strong> qatoriga quyidagi manzilni qo'ying:
                </li>
              </ol>

              <div className="flex items-center gap-1.5 p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-[10px] break-all">
                <span className="flex-1 text-slate-700 dark:text-slate-300 select-all">
                  https://iugjwbeqrtjytadtfmne.supabase.co/auth/v1/callback
                </span>
                <button
                  type="button"
                  onClick={handleCopyCallback}
                  className="px-2 py-1 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-sans font-bold text-[10px] flex items-center gap-1 shrink-0"
                >
                  {copiedCallback ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCallback ? "Nusxalandi" : "Nusxalash"}</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                3. Chiqqan <strong>Client ID</strong> va <strong>Client Secret</strong> kodlarini <strong>Supabase &gt; Auth &gt; Providers &gt; Google</strong> ichiga qo'yib, <em>Enable</em> qiling!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
