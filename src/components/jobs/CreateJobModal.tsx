import React, { useState } from 'react';
import { X, Sparkles, Briefcase, DollarSign, MapPin, CheckCircle2 } from 'lucide-react';
import { CATEGORIES } from '../../lib/mockData';
import { useStore } from '../../lib/store';
import { Job } from '../../types';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (job: Job) => void;
}

export const CreateJobModal: React.FC<CreateJobModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user, selectedCity, actions } = useStore();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Mebel');
  const [position, setPosition] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState("Mebel yig'ish, Chizmalar");
  const [experienceYears, setExperienceYears] = useState(2);
  const [requiredWorkersCount, setRequiredWorkersCount] = useState(2);
  const [salaryMin, setSalaryMin] = useState(6000000);
  const [salaryMax, setSalaryMax] = useState(10000000);
  const [jobType, setJobType] = useState<Job['jobType']>('full_time');
  const [phone, setPhone] = useState(user?.phone || '+998 90 123 45 67');
  const [address, setAddress] = useState("Navoiy sh., Markaziy ko'cha 10");

  // AI Generation State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAiBox, setShowAiBox] = useState(false);

  if (!isOpen) return null;

  const handleAiGenerate = () => {
    if (!aiPrompt) return;
    setIsAiLoading(true);

    setTimeout(() => {
      // Natural language extraction simulation
      const promptLower = aiPrompt.toLowerCase();
      let detectedCategory = 'Mebel';
      let detectedTitle = 'Malakali usta talab etiladi';

      if (promptLower.includes('elektrik') || promptLower.includes('montaj')) {
        detectedCategory = 'Elektrik';
        detectedTitle = "Kvartira va ob'yektlar uchun Tajribali Elektrik";
      } else if (promptLower.includes('santexnik') || promptLower.includes('quvur')) {
        detectedCategory = 'Santexnik';
        detectedTitle = 'Santexnik va Issiq Pol Ustasi';
      } else if (promptLower.includes('dasturchi') || promptLower.includes('it') || promptLower.includes('react')) {
        detectedCategory = 'IT & Dasturlash';
        detectedTitle = 'Frontend / Web Dasturchi';
      } else if (promptLower.includes('mebel') || promptLower.includes('oshxona')) {
        detectedCategory = 'Mebel';
        detectedTitle = 'Mebel sexiga tajribali usta va stanokchi';
      }

      setTitle(detectedTitle);
      setCategory(detectedCategory);
      setPosition('Mutaxassis usta');
      setDescription(
        `Kompaniyamiz faoliyatini kengaytirishi munosabati bilan yangi xodimlarni jamoaga taklif qilamiz.\n\nTalablar:\n- O'z ishiga mas'uliyat bilan yondashish\n- Sohada kamida 2 yillik amaliy tajriba\n- Jamoa bilan ishlash qobiliyati\n\nTaklif etiladi:\n- O'z vaqtida beriladigan raqobatbardosh oylik maosh\n- Barcha zarur ish qurollari va sharoitlar\n- Tushlik va ustamalar`
      );
      setSkills("Tajriba, Mas'uliyat, Aniqlik, Sifatli ish");
      setIsAiLoading(false);
      setShowAiBox(false);
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const newJob: Job = {
      id: 'job-' + Date.now(),
      title,
      companyName: user?.name ? `${user.name} korxonasi` : 'Kompaniya',
      employerId: user?.id || 'current-user',
      category,
      position: position || title,
      description,
      skills: skills.split(',').map((s) => s.trim()),
      experienceYears: Number(experienceYears),
      requiredWorkersCount: Number(requiredWorkersCount),
      salaryMin: Number(salaryMin),
      salaryMax: Number(salaryMax),
      salaryType: 'monthly',
      jobType,
      workHours: '08:30 - 18:00',
      city: selectedCity.name,
      district: 'Markaz',
      address,
      lat: selectedCity.lat + (Math.random() - 0.5) * 0.02,
      lng: selectedCity.lng + (Math.random() - 0.5) * 0.02,
      phone,
      isVip: true,
      createdAt: 'Bugun',
      applicationsCount: 0,
    };

    actions.addJob(newJob);
    onSuccess(newJob);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[92vh] flex flex-col border border-slate-100 dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Yangi Ish E'loni Joylash
              </h3>
              <p className="text-xs text-slate-500">Kompaniya yoki shaxsiy ish beruvchi sifatida</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Helper Toggle Banner */}
        <div className="mt-3">
          {!showAiBox ? (
            <button
              onClick={() => setShowAiBox(true)}
              className="w-full p-2.5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-brand-500/10 to-purple-500/10 border border-purple-300 dark:border-purple-800 flex items-center justify-between text-xs font-bold text-purple-700 dark:text-purple-300 hover:opacity-90"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 animate-spin" />
                <span>AI Yordamchi bilan professional e'lon tuzish</span>
              </div>
              <span className="text-[11px] underline">Ochish</span>
            </button>
          ) : (
            <div className="p-3 rounded-2xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  Oddiy so'zlar bilan yozing:
                </span>
                <button onClick={() => setShowAiBox(false)} className="text-slate-400 hover:text-slate-600 text-xs">
                  Yopish
                </button>
              </div>
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Masalan: Navoiyda mebel sexiga 3 ta usta kerak, oylik 7-10 mln, stanok bilishi kerak"
                className="w-full p-2 bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 rounded-xl text-xs"
              />
              <button
                type="button"
                onClick={handleAiGenerate}
                disabled={isAiLoading}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
              >
                {isAiLoading ? "AI e'lonni tuzmoqda..." : "E'lon matnini avtomatik to'ldirish"}
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="py-4 space-y-4 overflow-y-auto flex-1 pr-1">
          {/* Title */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Ish / Vakansiya nomi *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masalan: Tajribali mebel ustasi"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
            />
          </div>

          {/* Category & Job Type */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Kategoriya</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              >
                {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Ish turi</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              >
                <option value="full_time">To'liq stavka (Doimiy)</option>
                <option value="part_time">Yarim stavka</option>
                <option value="one_time">Bir martalik ish</option>
                <option value="daily">Kunlik ish</option>
                <option value="freelance">Freelance / Shartnoma</option>
                <option value="online">Online / Masofaviy</option>
              </select>
            </div>
          </div>

          {/* Salary Min / Max */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Oylik maosh diapazoni (so'mda)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={salaryMin}
                onChange={(e) => setSalaryMin(Number(e.target.value))}
                placeholder="Min maosh"
                className="p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
              />
              <input
                type="number"
                value={salaryMax}
                onChange={(e) => setSalaryMax(Number(e.target.value))}
                placeholder="Maks maosh"
                className="p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
              />
            </div>
          </div>

          {/* Workers Count & Experience */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Nechta ishchi kerak?
              </label>
              <input
                type="number"
                min="1"
                value={requiredWorkersCount}
                onChange={(e) => setRequiredWorkersCount(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Talab etilgan tajriba (yil)
              </label>
              <input
                type="number"
                min="0"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Batafsil talab va vazifalar *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Vazifalar, ish sharoiti, korxona haqida ma'lumot..."
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
            />
          </div>

          {/* Address & Phone */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Manzil</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Telefon</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm shadow-lg shadow-brand-500/25 active:scale-[0.99] transition-all"
            >
              E'lonni chop etish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
