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
import { Map, Heart, LayoutDashboard, ShieldCheck, LogIn, CheckCircle } from 'lucide-react';

export function App() {
  const { specialists, user } = useStore();

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
  const currentUserSpecialist: SpecialistProfile = {
    id: user?.id || 'current-user-id',
    userId: user?.id || 'current-user-id',
    name: user?.name || 'Sherzod',
    surname: user?.surname || 'Alimov',
    username: 'sherzodbek',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    phone: user?.phone || '+998 90 123 45 67',
    email: user?.email || 'sherzod.user@gmail.com',
    city: user?.city || 'Navoiy shahri',
    district: "Zarafshon ko'chasi",
    address: "Navoiy sh., G'alaba ko'chasi",
    lat: user?.lat || 40.0844,
    lng: user?.lng || 65.3792,
    serviceRadiusKm: user?.serviceRadiusKm || 30,
    profession: 'Mebel va Santexnika ustasi',
    specialty: "Zamonaviy mebel yig'ish va quvurlar montaji",
    experienceYears: 7,
    bio: 'IshTop platformasidagi faol foydalanuvchi va sertifikatlangan usta.',
    about: "Mebel yasash va santexnika ishlarida ko'p yillik amaliy tajribaga egaman. O'z vaqtida, sifatli va kafolatli xizmat ko'rsataman.",
    skills: ['Mebel montaji', 'Elektromontaj', 'Santexnika', 'Chizmalar bilan ishlash'],
    languages: ["O'zbekcha", 'Ruscha'],
    education: 'Navoiy Kasb-Hunar Kolleji',
    certificates: ['Universal Master Certificate 2024'],
    workType: 'full_time',
    expectedSalary: 9500000,
    serviceRates: [
      { id: 'usr-1', title: "Mebel yig'ish va o'rnatish", price: 200000, unit: "so'm / soat" },
      { id: 'usr-2', title: 'Santexnika kranlarini sozlash', price: 70000, unit: "so'm / dona" }
    ],
    workHours: '09:00 - 19:00',
    restDays: ['Yakshanba'],
    isAvailable: true,
    workMode: 'both',
    serviceLocationType: 'both',
    rating: 4.9,
    reviewCount: 38,
    completedJobsCount: 42,
    verification: {
      phone: true,
      email: true,
      identity: true,
      profession: true,
      company: false,
      portfolio: true,
    },
    socialLinks: {
      telegramUsername: 'sherzod_alimov',
      phone: '+998901234567'
    },
    portfolios: [
      {
        id: 'uport-1',
        title: 'Shaxsiy mebel montaj ishlari',
        description: "Mijoz xonadoniga zamonaviy garderob o'rnatish jarayoni.",
        category: 'Mebel',
        price: 4500000,
        duration: '2 kun',
        images: [
          'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80'
        ]
      }
    ],
    distanceKm: 0,
    isVip: true,
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Header */}
      <Header
        onOpenLocation={() => setIsLocationOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => {
          setActiveSpecialist(null);
          setActiveTab('profile');
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
          <ProfileView
            specialist={activeSpecialist || currentUserSpecialist}
            onBack={() => {
              if (activeSpecialist) {
                setActiveSpecialist(null);
                setActiveTab('home');
              } else {
                setActiveTab('home');
              }
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
