import { useState, useEffect } from 'react';
import { 
  SpecialistProfile, 
  Job, 
  ServiceItem, 
  Order, 
  ReviewItem, 
  NotificationItem, 
  ChatRoom, 
  ChatMessage, 
  UserRole,
  ReportItem,
  JobApplication
} from '../types';
import { 
  INITIAL_SPECIALISTS, 
  INITIAL_JOBS, 
  INITIAL_SERVICES, 
  INITIAL_ORDERS, 
  INITIAL_REVIEWS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_CHAT_ROOMS, 
  INITIAL_MESSAGES,
  CITIES
} from './mockData';
import { calculateDistanceKm } from './geo';
import { supabase, isSupabaseConfigured } from './supabase';

export interface CurrentUser {
  id: string;
  name: string;
  surname: string;
  phone: string;
  email: string;
  avatar: string;
  roles: UserRole[];
  currentRole: UserRole;
  isVerified: boolean;
  city: string;
  lat: number;
  lng: number;
  serviceRadiusKm: number;
}

const DEFAULT_USER: CurrentUser = {
  id: 'current-user-id',
  name: 'Sherzod',
  surname: 'Alimov',
  phone: '+998 90 123 45 67',
  email: 'sherzod.user@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  roles: ['buyurtmachi', 'usta', 'ishberuvchi'],
  currentRole: 'buyurtmachi',
  isVerified: true,
  city: 'Navoiy shahri',
  lat: 40.0844,
  lng: 65.3792,
  serviceRadiusKm: 30
};

interface AppState {
  user: CurrentUser | null;
  selectedCity: typeof CITIES[0];
  serviceRadiusKm: number;
  specialists: SpecialistProfile[];
  jobs: Job[];
  services: ServiceItem[];
  orders: Order[];
  reviews: ReviewItem[];
  notifications: NotificationItem[];
  chatRooms: ChatRoom[];
  messages: Record<string, ChatMessage[]>;
  applications: JobApplication[];
  reports: ReportItem[];
  favorites: {
    profiles: string[];
    jobs: string[];
    services: string[];
  };
  darkMode: boolean;
  language: 'uz' | 'ru' | 'en';
}

function loadInitialState(): AppState {
  try {
    const saved = localStorage.getItem('ishtop_state_v1');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        // Ensure fresh city coords fallback
        selectedCity: parsed.selectedCity || CITIES[0],
      };
    }
  } catch (e) {
    console.error('Failed to load state from localStorage', e);
  }

  return {
    user: DEFAULT_USER,
    selectedCity: CITIES[0], // Navoiy shahri
    serviceRadiusKm: 30,
    specialists: INITIAL_SPECIALISTS,
    jobs: INITIAL_JOBS,
    services: INITIAL_SERVICES,
    orders: INITIAL_ORDERS,
    reviews: INITIAL_REVIEWS,
    notifications: INITIAL_NOTIFICATIONS,
    chatRooms: INITIAL_CHAT_ROOMS,
    messages: INITIAL_MESSAGES,
    applications: [],
    reports: [],
    favorites: {
      profiles: ['spec-1'],
      jobs: ['job-1'],
      services: ['srv-1']
    },
    darkMode: false,
    language: 'uz'
  };
}

let state: AppState = loadInitialState();
const listeners = new Set<() => void>();

function notify() {
  try {
    localStorage.setItem('ishtop_state_v1', JSON.stringify(state));
  } catch (e) {
    console.error(e);
  }
  listeners.forEach(fn => fn());
}

export const store = {
  getState() {
    return state;
  },

  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  setUser(user: CurrentUser | null) {
    state = { ...state, user };
    notify();
  },

  setCurrentRole(role: UserRole) {
    if (state.user) {
      state = {
        ...state,
        user: { ...state.user, currentRole: role }
      };
      notify();
    }
  },

  setSelectedCity(city: typeof CITIES[0]) {
    state = { ...state, selectedCity: city };
    notify();
  },

  setServiceRadiusKm(radius: number) {
    state = { ...state, serviceRadiusKm: radius };
    notify();
  },

  setDarkMode(isDark: boolean) {
    state = { ...state, darkMode: isDark };
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    notify();
  },

  toggleFavorite(type: 'profiles' | 'jobs' | 'services', id: string) {
    const list = state.favorites[type];
    const exists = list.includes(id);
    const updated = exists ? list.filter(item => item !== id) : [...list, id];
    state = {
      ...state,
      favorites: {
        ...state.favorites,
        [type]: updated
      }
    };
    notify();
  },

  // Specialists
  addSpecialist(spec: SpecialistProfile) {
    state = {
      ...state,
      specialists: [spec, ...state.specialists]
    };
    notify();
  },

  updateSpecialist(id: string, update: Partial<SpecialistProfile>) {
    state = {
      ...state,
      specialists: state.specialists.map(s => s.id === id ? { ...s, ...update } : s)
    };
    notify();
  },

  // Jobs
  addJob(job: Job) {
    state = {
      ...state,
      jobs: [job, ...state.jobs],
      notifications: [
        {
          id: 'notif-' + Date.now(),
          userId: 'current-user',
          type: 'matching_job',
          title: "Yangi ish e'loni joylandi!",
          message: `"${job.title}" e'loningiz muvaffaqiyatli chop etildi.`,
          link: 'jobs',
          isRead: false,
          createdAt: 'Hozirgina'
        },
        ...state.notifications
      ]
    };
    notify();

    // Live Supabase Sync
    if (isSupabaseConfigured) {
      supabase.from('jobs').insert([{
        title: job.title,
        category: job.category,
        position: job.position,
        description: job.description,
        city: job.city,
        district: job.district,
        address: job.address,
        latitude: job.lat,
        longitude: job.lng,
        phone: job.phone,
        salary_min: job.salaryMin,
        salary_max: job.salaryMax,
        job_type: job.jobType,
        skills: job.skills,
        is_vip: job.isVip
      }]).then(({ error }) => {
        if (error) console.info("Supabase job sync fallback:", error.message);
      });
    }
  },

  applyForJob(jobId: string, coverLetter: string, expectedSalary: number) {
    const job = state.jobs.find(j => j.id === jobId);
    if (!job || !state.user) return;

    const application: JobApplication = {
      id: 'app-' + Date.now(),
      jobId,
      jobTitle: job.title,
      applicantId: state.user.id,
      applicantName: `${state.user.name} ${state.user.surname}`,
      applicantAvatar: state.user.avatar,
      applicantPhone: state.user.phone,
      applicantProfession: 'Mutaxassis',
      coverLetter,
      expectedSalary,
      status: 'pending',
      createdAt: 'Hozirgina'
    };

    state = {
      ...state,
      applications: [application, ...state.applications],
      jobs: state.jobs.map(j => j.id === jobId ? { ...j, applicationsCount: j.applicationsCount + 1 } : j),
      notifications: [
        {
          id: 'notif-' + Date.now(),
          userId: 'current-user',
          type: 'job_offer',
          title: 'Arizangiz yuborildi',
          message: `"${job.title}" bo'yicha arizangiz ish beruvchiga yuborildi.`,
          link: 'dashboard',
          isRead: false,
          createdAt: 'Hozirgina'
        },
        ...state.notifications
      ]
    };
    notify();
  },

  // Orders
  createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) {
    const newOrder: Order = {
      ...orderData,
      id: 'ord-' + Date.now(),
      status: 'yangi',
      createdAt: new Date().toISOString().split('T')[0]
    };

    state = {
      ...state,
      orders: [newOrder, ...state.orders],
      notifications: [
        {
          id: 'notif-' + Date.now(),
          userId: 'current-user',
          type: 'order',
          title: 'Yangi buyurtma yuborildi!',
          message: `${orderData.specialistName} ga buyurtmangiz muvaffaqiyatli jo'natildi.`,
          link: 'orders',
          isRead: false,
          createdAt: 'Hozirgina'
        },
        ...state.notifications
      ]
    };
    notify();

    // Live Supabase Sync
    if (isSupabaseConfigured) {
      supabase.from('orders').insert([{
        service_title: orderData.serviceTitle,
        category: orderData.category,
        problem_description: orderData.problemDescription,
        budget: orderData.budget,
        city: orderData.city,
        address: orderData.address,
        required_date: orderData.requiredDate,
        notes: orderData.notes,
        status: 'yangi'
      }]).then(({ error }) => {
        if (error) console.info("Supabase order sync fallback:", error.message);
      });
    }
  },

  updateOrderStatus(orderId: string, status: Order['status']) {
    state = {
      ...state,
      orders: state.orders.map(o => o.id === orderId ? { ...o, status } : o),
      notifications: [
        {
          id: 'notif-' + Date.now(),
          userId: 'current-user',
          type: 'order_status',
          title: "Buyurtma holati o'zgardi",
          message: `Buyurtma statusi: "${status}" ga yangilandi.`,
          link: 'orders',
          isRead: false,
          createdAt: 'Hozirgina'
        },
        ...state.notifications
      ]
    };
    notify();
  },

  // Chat
  sendMessage(roomId: string, message: Omit<ChatMessage, 'id' | 'timestamp' | 'isRead'>) {
    const newMessage: ChatMessage = {
      ...message,
      id: 'msg-' + Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false
    };

    const roomMessages = state.messages[roomId] || [];
    const updatedMessages = {
      ...state.messages,
      [roomId]: [...roomMessages, newMessage]
    };

    const updatedRooms = state.chatRooms.map(r => 
      r.id === roomId 
        ? { ...r, lastMessage: message.text || 'Yangi xabar', lastMessageTime: 'Hozirgina' }
        : r
    );

    state = {
      ...state,
      messages: updatedMessages,
      chatRooms: updatedRooms
    };
    notify();

    // Live Supabase Sync
    if (isSupabaseConfigured) {
      supabase.from('messages').insert([{
        room_id: roomId,
        sender_id: message.senderId,
        receiver_id: message.receiverId,
        message_text: message.text,
        message_type: message.type,
        media_url: message.mediaUrl
      }]).then(({ error }) => {
        if (error) console.info("Supabase message sync fallback:", error.message);
      });
    }
  },

  updatePriceOfferStatus(roomId: string, messageId: string, status: 'accepted' | 'declined') {
    const roomMessages = state.messages[roomId] || [];
    const updated = roomMessages.map(m => {
      if (m.id === messageId && m.priceOffer) {
        return {
          ...m,
          priceOffer: {
            ...m.priceOffer,
            status
          }
        };
      }
      return m;
    });

    state = {
      ...state,
      messages: {
        ...state.messages,
        [roomId]: updated
      }
    };
    notify();
  },

  appendIncomingMessage(roomId: string, message: ChatMessage) {
    const roomMessages = state.messages[roomId] || [];
    state = {
      ...state,
      messages: {
        ...state.messages,
        [roomId]: [...roomMessages, message]
      }
    };
    notify();
  },

  // Reviews
  addReview(reviewData: Omit<ReviewItem, 'id' | 'createdAt'>) {
    const newReview: ReviewItem = {
      ...reviewData,
      id: 'rev-' + Date.now(),
      createdAt: 'Hozirgina'
    };

    // Recalculate specialist rating
    const targetSpec = state.specialists.find(s => s.id === reviewData.targetId);
    let updatedSpecialists = state.specialists;
    if (targetSpec) {
      const newReviewCount = targetSpec.reviewCount + 1;
      const newRating = Number(((targetSpec.rating * targetSpec.reviewCount + reviewData.rating) / newReviewCount).toFixed(1));
      updatedSpecialists = state.specialists.map(s => 
        s.id === reviewData.targetId 
          ? { ...s, rating: newRating, reviewCount: newReviewCount }
          : s
      );
    }

    state = {
      ...state,
      reviews: [newReview, ...state.reviews],
      specialists: updatedSpecialists,
      notifications: [
        {
          id: 'notif-' + Date.now(),
          userId: 'current-user',
          type: 'review',
          title: 'Baholashingiz qabul qilindi',
          message: `Fikringiz uchun rahmat! Baho mutaxassis profilida aks etadi.`,
          link: 'reviews',
          isRead: false,
          createdAt: 'Hozirgina'
        },
        ...state.notifications
      ]
    };
    notify();
  },

  // Reports
  addReport(reportData: Omit<ReportItem, 'id' | 'status' | 'createdAt'>) {
    const report: ReportItem = {
      ...reportData,
      id: 'rep-' + Date.now(),
      status: 'pending',
      createdAt: new Date().toLocaleDateString('uz-UZ')
    };

    state = {
      ...state,
      reports: [report, ...state.reports],
      notifications: [
        {
          id: 'notif-' + Date.now(),
          userId: 'current-user',
          type: 'system',
          title: 'Shikoyatingiz qabul qilindi',
          message: "Moderatsiya bo'limi 24 soat ichida ko'rib chiqadi.",
          link: 'reports',
          isRead: false,
          createdAt: 'Hozirgina'
        },
        ...state.notifications
      ]
    };
    notify();
  },

  markNotificationsAsRead() {
    state = {
      ...state,
      notifications: state.notifications.map(n => ({ ...n, isRead: true }))
    };
    notify();
  }
};

export function useStore() {
  const [appState, setAppState] = useState<AppState>(store.getState());

  useEffect(() => {
    return store.subscribe(() => {
      setAppState(store.getState());
    });
  }, []);

  // Compute live distance relative to selected city
  const specialistsWithDistance = appState.specialists.map(s => {
    const dist = calculateDistanceKm(
      appState.selectedCity.lat,
      appState.selectedCity.lng,
      s.lat,
      s.lng
    );
    return { ...s, distanceKm: dist };
  });

  const jobsWithDistance = appState.jobs.map(j => {
    const dist = calculateDistanceKm(
      appState.selectedCity.lat,
      appState.selectedCity.lng,
      j.lat,
      j.lng
    );
    return { ...j, distanceKm: dist };
  });

  return {
    ...appState,
    specialists: specialistsWithDistance,
    jobs: jobsWithDistance,
    actions: store
  };
}

// Initialize Supabase Sync on client load
async function initSupabaseSync() {
  if (!isSupabaseConfigured) return;

  try {
    // 1. Fetch live jobs if any
    const { data: dbJobs } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (dbJobs && dbJobs.length > 0) {
      const mappedJobs: Job[] = dbJobs.map((j: any) => ({
        id: j.id || 'job-' + Date.now(),
        title: j.title || 'Ish',
        companyName: j.company_name || 'Ish beruvchi',
        employerId: j.employer_id || 'employer-1',
        category: j.category || 'Mebel',
        position: j.position || j.title,
        description: j.description || '',
        skills: Array.isArray(j.skills) ? j.skills : ['Tajriba'],
        experienceYears: j.experience_years || 1,
        requiredWorkersCount: j.required_workers_count || 1,
        salaryMin: Number(j.salary_min) || 5000000,
        salaryMax: Number(j.salary_max) || 8000000,
        salaryType: 'monthly',
        jobType: j.job_type || 'full_time',
        workHours: j.work_hours || '09:00 - 18:00',
        city: j.city || 'Navoiy shahri',
        district: j.district || 'Markaz',
        address: j.address || '',
        lat: Number(j.latitude) || 40.0844,
        lng: Number(j.longitude) || 65.3792,
        phone: j.phone || '+998 90 123 45 67',
        isVip: Boolean(j.is_vip),
        createdAt: 'Yangi',
        applicationsCount: 0
      }));

      state = {
        ...state,
        jobs: [...mappedJobs, ...state.jobs.filter(sj => !mappedJobs.some(mj => mj.id === sj.id))]
      };
      notify();
    }

    // 2. Setup Realtime messages subscription
    supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload: any) => {
        const row = payload.new;
        if (row && row.room_id) {
          const currentUserId = state.user?.id || 'current-user-id';
          if (row.sender_id !== currentUserId) {
            const incoming: ChatMessage = {
              id: 'msg-' + (row.id || Date.now()),
              senderId: row.sender_id,
              receiverId: row.receiver_id,
              roomId: row.room_id,
              text: row.message_text || '',
              type: row.message_type || 'text',
              mediaUrl: row.media_url,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isRead: false
            };
            store.appendIncomingMessage(row.room_id, incoming);
          }
        }
      })
      .subscribe();
  } catch (e) {
    console.info("Supabase live init notice:", e);
  }
}

if (typeof window !== 'undefined') {
  initSupabaseSync();
}
