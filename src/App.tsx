import React, { useState, useEffect } from 'react';
import { useStore } from './lib/store';
import { Header } from './components/common/Header';
import { BottomNav, NavTab } from './components/common/BottomNav';
import { HomeView } from './components/home/HomeView';
import { SearchView } from './components/search/SearchView';
import { InteractiveMapView } from './components/map/InteractiveMapView';
import { ChatView } from './components/chat/ChatView';
import { ProfileView } from './components/profile/ProfileView';
import { DashboardView } from './components/dashboard/DashboardView';
import { FavoritesView } from './components/favorites/FavoritesView';

// Modals
import { LocationRadiusModal } from './components/common/LocationRadiusModal';
import { NotificationsDrawer } from './components/notifications/NotificationsDrawer';
import { CreateJobModal } from './components/jobs/CreateJobModal';
import { CreateOrderModal } from './components/orders/CreateOrderModal';
import { InvitationModal } from './components/jobs/InvitationModal';
import { JobDetailModal } from './components/jobs/JobDetailModal';
import { AIAssistantModal } from './components/ai/AIAssistantModal';
import { ShareQRModal } from './components/common/ShareQRModal';
import { ReportModal } from './components/common/ReportModal';
import { ReviewModal } from './components/common/ReviewModal';
import { AuthModal } from './components/auth/AuthModal';
import { AdminModal } from './components/admin/AdminModal';
import { APKDownloadModal } from './components/common/APKDownloadModal';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { CVModal } from './components/profile/CVModal';

import { SpecialistProfile, Job, Order } from './types';
import { Map, Heart, LayoutDashboard, ShieldCheck, LogIn, LogOut, CheckCircle } from 'lucide-react';

export function App() {
  const { specialists, user, actions } = useStore();

  // Navigation State
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [activeSpecialist, setActiveSpecialist] = useState<SpecialistProfile | null>(null);
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [activeOrderToReview, setActiveOrderToReview] = useState<Order | null>(null);

  // Modals visibility
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [isInvitationOpen, setIsInvitationOpen] = useState(false);
  const [isJobDetailOpen, setIsJobDetailOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAPKOpen, setIsAPKOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isCVOpen, setIsCVOpen] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('ishtop_onboarded');
    if (!hasSeenOnboarding) {
      setIsOnboardingOpen(true);
    }
  }, []);

  const handleFinishOnboarding = () => {
    localStorage.setItem('ishtop_onboarded', 'true');
    setIsOnboardingOpen(false);
  };

  const handleViewProfile = (spec: SpecialistProfile) => {
    setActiveSpecialist(spec);
    setActiveTab('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContact = (spec: SpecialistProfile) => {
    setActiveSpecialist(spec);
    setActiveTab('chat');
  };

  const handleViewJob = (job: Job) => {
    setActiveJob(job);
    setIsJobDetailOpen(true);
  };

  // Convert current user to specialist profile format for personal profile tab
  const currentUserSpecialist: SpecialistProfile | null = user ? {
    id: user.id,
    userId: user.id,
    name: user.name,
    surname: user.surname,
    username: (user.name + '_' + (user.surname || '')).toLowerCase().replace(/\s+/g, '_'),
    avatar: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    phone: user.phone,
    email: user.email,
    city: user.city,
    district: "Markaziy hudud",
    address: user.city,
    lat: user.lat,
    lng: user.lng,
    serviceRadiusKm: user.serviceRadiusKm,
    profession: user.roles.includes('usta') ? 'Usta / Mutaxassis' : user.roles.includes('freelancer') ? 'Freelancer' : user.roles.includes('ishchi') ? 'Ishchi' : 'Buyurtmachi',
    specialty: "IshTop platformasidagi faol a'zo",
    experienceYears: 1,
    bio: "IshTop platformasidagi shaxsiy profilim.",
    about: "Men platformada o'z xizmatlarimni taqdim etaman yoki zarur xizmatlarga buyurtma beraman.",
    skills: ["Mas'uliyat", 'Halollik', 'Sifatli xizmat'],
    languages: ["O'zbekcha"],
    education: "Ma'lumot ko'rsatilmagan",
    certificates: ['IshTop Tasdiqlangan'],
    workType: 'full_time',
    expectedSalary: 7000000,
    serviceRates: [
      { id: 'usr-1', title: "Xizmat ko'rsatish", price: 100000, unit: "so'm / soat" }
    ],
    workHours: '09:00 - 18:00',
    restDays: ['Yakshanba'],
    isAvailable: true,
    workMode: 'both',
    serviceLocationType: 'both',
    rating: 5.0,
    reviewCount: 0,
    completedJobsCount: 0,
    verification: {
      phone: true,
      email: true,
      identity: true,
      profession: false,
      company: false,
      portfolio: false,
    },
    socialLinks: {
      phone: user.phone
    },
    portfolios: [],
    distanceKm: 0,
    isVip: false,
  } : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Header */}
      <Header
        onOpenLocation={() => setIsLocationOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => {
          if (!user) {
            setIsAuthOpen(true);
          } else {
            setActiveSpecialist(null);
            setActiveTab('profile');
          }
        }}
        onOpenAPKModal={() => setIsAPKOpen(true)}
      />

      {/* Quick Navigation Utility Strip */}
      <div className="max-w-md mx-auto px-4 py-2 flex items-center justify-between overflow-x-auto no-scrollbar gap-1.5 text-[11px] font-bold">
        <button
          onClick={() => setActiveTab('map')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full border transition-colors shrink-0 ${
            activeTab === 'map'
              ? 'bg-brand-600 text-white border-brand-600'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <Map className="w-3.5 h-3.5" />
          <span>Xarita</span>
        </button>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full border transition-colors shrink-0 ${
            activeTab === 'dashboard'
              ? 'bg-brand-600 text-white border-brand-600'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full border transition-colors shrink-0 ${
            activeTab === 'favorites'
              ? 'bg-brand-600 text-white border-brand-600'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-rose-500" />
          <span>Sevimlilar</span>
        </button>

        <button
          onClick={() => setIsAdminOpen(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full border bg-rose-50/70 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 shrink-0"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Admin</span>
        </button>

        <button
          onClick={() => setIsAuthOpen(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full border bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 shrink-0"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Kirish</span>
        </button>
      </div>

      {/* Main Content Router */}
      <main className="max-w-md mx-auto">
        {activeTab === 'home' && (
          <HomeView
            onOpenSearch={() => setActiveTab('search')}
            onOpenMap={() => setActiveTab('map')}
            onOpenRadiusSelector={() => setIsLocationOpen(true)}
            onOpenCreateJob={() => setIsCreateJobOpen(true)}
            onOpenCreateOrder={() => setIsCreateOrderOpen(true)}
            onOpenAI={() => setIsAIOpen(true)}
            onViewProfile={handleViewProfile}
            onContact={handleContact}
            onSelectCategory={() => setActiveTab('search')}
          />
        )}

        {activeTab === 'search' && (
          <SearchView
            onViewProfile={handleViewProfile}
            onContact={handleContact}
            onViewJob={handleViewJob}
            onOpenAI={() => setIsAIOpen(true)}
          />
        )}

        {activeTab === 'map' && (
          <div className="p-4">
            <InteractiveMapView
              onViewProfile={handleViewProfile}
              onContact={handleContact}
              onViewJob={handleViewJob}
            />
          </div>
        )}

        {activeTab === 'chat' && (
          <ChatView
            onBackToHome={() => setActiveTab('home')}
            onOpenProfileById={(id) => {
              const spec = specialists.find((s) => s.id === id);
              if (spec) handleViewProfile(spec);
            }}
          />
        )}

        {activeTab === 'profile' && (
          activeSpecialist ? (
            <ProfileView
              specialist={activeSpecialist}
              onBack={() => {
                setActiveSpecialist(null);
                setActiveTab('home');
              }}
              onContact={handleContact}
              onOrder={(s) => {
                setActiveSpecialist(s);
                setIsCreateOrderOpen(true);
              }}
              onInvite={(s) => {
                setActiveSpecialist(s);
                setIsInvitationOpen(true);
              }}
              onShare={(s) => {
                setActiveSpecialist(s);
                setIsShareOpen(true);
              }}
              onReport={(s) => {
                setActiveSpecialist(s);
                setIsReportOpen(true);
              }}
              onOpenCV={(s) => {
                setActiveSpecialist(s);
                setIsCVOpen(true);
              }}
            />
          ) : user && currentUserSpecialist ? (
            <div className="space-y-4">
              <ProfileView
                specialist={currentUserSpecialist}
                onBack={() => setActiveTab('home')}
                onContact={handleContact}
                onOrder={() => {}}
                onInvite={() => {}}
                onShare={(s) => {
                  setActiveSpecialist(s);
                  setIsShareOpen(true);
                }}
                onReport={() => {}}
                onOpenCV={(s) => {
                  setActiveSpecialist(s);
                  setIsCVOpen(true);
                }}
              />
              <div className="max-w-md mx-auto px-4 pb-8">
                <button
                  onClick={() => {
                    actions.logout();
                    setActiveTab('home');
                    showToast("Tizimdan muvaffaqiyatli chiqdingiz");
                  }}
                  className="w-full py-3 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-extrabold text-xs rounded-2xl border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Hisobdan Chiqish (Log out)</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto p-6 text-center space-y-4 pt-16 animate-fade-in">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center shadow-inner">
                <LogIn className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Shaxsiy Profilingizga Kiring
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                O'z xizmatlaringizni qo'shish, ish topish, buyurtma berish yoki ishchilarni yollash uchun profilingizga kiring yoki yangi hisob oching.
              </p>
              <button
                onClick={() => setIsAuthOpen(true)}
                className="w-full py-3.5 px-6 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold shadow-lg shadow-brand-500/25 active:scale-95 transition-all"
              >
                Kirish yoki Ro'yxatdan o'tish
              </button>
            </div>
          )
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            onOpenCreateJob={() => setIsCreateJobOpen(true)}
            onOpenCreateOrder={() => setIsCreateOrderOpen(true)}
            onReviewOrder={(order) => {
              setActiveOrderToReview(order);
              setIsReviewOpen(true);
            }}
          />
        )}

        {activeTab === 'favorites' && (
          <FavoritesView
            onViewProfile={handleViewProfile}
            onContact={handleContact}
            onViewJob={handleViewJob}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'profile') setActiveSpecialist(null);
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCreate={() => setIsCreateJobOpen(true)}
      />

      {/* Global Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-20 left-4 right-4 z-50 flex justify-center animate-slide-up pointer-events-none">
          <div className="bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold border border-slate-700/50 backdrop-blur-md">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Modals & Dialogs */}
      <LocationRadiusModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      <CreateJobModal
        isOpen={isCreateJobOpen}
        onClose={() => setIsCreateJobOpen(false)}
        onSuccess={() => showToast("Yangi e'loningiz muvaffaqiyatli chop etildi!")}
      />

      <CreateOrderModal
        isOpen={isCreateOrderOpen}
        specialist={activeSpecialist}
        onClose={() => setIsCreateOrderOpen(false)}
        onSuccess={() => showToast("Xizmat buyurtmangiz mutaxassisga yuborildi!")}
      />

      <InvitationModal
        isOpen={isInvitationOpen}
        specialist={activeSpecialist}
        onClose={() => setIsInvitationOpen(false)}
        onSuccess={() => showToast("Rasmiy ish taklifnomangiz yuborildi!")}
      />

      <JobDetailModal
        job={activeJob}
        onClose={() => setIsJobDetailOpen(false)}
        onSuccessApply={() => showToast("Arizangiz ish beruvchiga yuborildi!")}
      />

      <AIAssistantModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        onSelectSpecialist={handleViewProfile}
      />

      <ShareQRModal
        isOpen={isShareOpen}
        specialist={activeSpecialist}
        onClose={() => setIsShareOpen(false)}
      />

      <ReportModal
        isOpen={isReportOpen}
        targetType="profile"
        targetId={activeSpecialist?.id || 'spec-1'}
        targetTitle={`${activeSpecialist?.name || 'Usta'} profili`}
        onClose={() => setIsReportOpen(false)}
        onSuccess={() => showToast("Shikoyatingiz qabul qilindi va tekshiruvga yuborildi.")}
      />

      <ReviewModal
        isOpen={isReviewOpen}
        order={activeOrderToReview}
        onClose={() => setIsReviewOpen(false)}
        onSuccess={() => showToast("Baho va fikringiz uchun rahmat!")}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => showToast("Hisobingizga muvaffaqiyatli kirdingiz!")}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      <APKDownloadModal
        isOpen={isAPKOpen}
        onClose={() => setIsAPKOpen(false)}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onFinish={handleFinishOnboarding}
      />

      <CVModal
        isOpen={isCVOpen}
        specialist={activeSpecialist}
        onClose={() => setIsCVOpen(false)}
      />
    </div>
  );
}

export default App;
