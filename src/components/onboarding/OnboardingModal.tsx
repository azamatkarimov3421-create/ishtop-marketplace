import React, { useState } from 'react';
import { ArrowRight, Check, Compass, Users, Briefcase, Wrench } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onFinish: () => void;
}

const SLIDES = [
  {
    title: 'Yaqin hududdan usta toping',
    desc: "Xarita va xizmat radiusi bo'yicha yoningizdagi eng tajribali mebelchi, elektrik va santexniklarni bir zumda toping.",
    icon: <Compass className="w-10 h-10 text-brand-600" />,
    color: 'bg-brand-50 text-brand-600',
  },
  {
    title: 'Ishchi va xodim yollang',
    desc: "Kompaniya yoki shaxsiy ish beruvchi sifatida e'lon bering, arizalarni qabul qiling va to'g'ridan-to'g'ri ishga taklif qiling.",
    icon: <Users className="w-10 h-10 text-emerald-600" />,
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    title: 'Xizmat buyurtma qiling',
    desc: "Ta'mir, oshxona mebeli, elektroshchit yoki texnika tuzatish muammosini yozing va narx takliflarini solishtiring.",
    icon: <Wrench className="w-10 h-10 text-amber-600" />,
    color: 'bg-amber-50 text-amber-600',
  },
  {
    title: 'IshTop — Ishonchli Bozor',
    desc: 'Tasdiqlangan profillar, haqiqiy sharhlar, real-time chat va AI yordamchi bilan xavfsiz va oson ishlang.',
    icon: <Briefcase className="w-10 h-10 text-purple-600" />,
    color: 'bg-purple-50 text-purple-600',
  },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onFinish }) => {
  const [slideIndex, setSlideIndex] = useState(0);

  if (!isOpen) return null;

  const handleNext = () => {
    if (slideIndex < SLIDES.length - 1) {
      setSlideIndex(slideIndex + 1);
    } else {
      onFinish();
    }
  };

  const currentSlide = SLIDES[slideIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-6 text-center border border-slate-100 dark:border-slate-800">
        {/* Visual Icon */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shadow-inner">
          {currentSlide.icon}
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h3 className="font-black text-lg text-slate-900 dark:text-white leading-tight">
            {currentSlide.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {currentSlide.desc}
          </p>
        </div>

        {/* Indicator dots */}
        <div className="flex justify-center gap-1.5 pt-2">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === slideIndex ? 'w-6 bg-brand-600' : 'w-2 bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={onFinish}
            className="flex-1 py-3 text-xs font-bold text-slate-400 hover:text-slate-600"
          >
            O'tkazib yuborish
          </button>
          <button
            onClick={handleNext}
            className="flex-1 py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-brand-500/25 flex items-center justify-center gap-1.5"
          >
            <span>{slideIndex === SLIDES.length - 1 ? 'Boshlash' : 'Keyingisi'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
