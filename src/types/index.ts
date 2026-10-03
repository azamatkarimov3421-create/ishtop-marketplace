export type UserRole = 
  | 'ishchi' 
  | 'freelancer' 
  | 'usta' 
  | 'xizmat' 
  | 'buyurtmachi' 
  | 'ishberuvchi' 
  | 'kompaniya';

export interface SocialLinks {
  instagram?: string;
  youtube?: string;
  telegramUsername?: string;
  telegramChannel?: string;
  telegramGroup?: string;
  facebook?: string;
  tiktok?: string;
  linkedin?: string;
  website?: string;
  googleMaps?: string;
  phone?: string;
}

export interface VerificationStatus {
  phone: boolean;
  email: boolean;
  identity: boolean;
  profession: boolean;
  company: boolean;
  portfolio: boolean;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  price?: number;
  duration?: string;
  date?: string;
  location?: string;
  images: string[];
  videoUrl?: string;
  beforeAfter?: {
    before: string;
    after: string;
  };
}

export interface ServiceRate {
  id: string;
  title: string;
  price: number;
  unit: string; // e.g. "so'm / xona", "so'm / nuqta", "so'm / soat"
}

export interface SpecialistProfile {
  id: string;
  userId: string;
  name: string;
  surname: string;
  username: string;
  avatar: string;
  phone: string;
  email: string;
  city: string;
  district: string;
  address: string;
  lat: number;
  lng: number;
  serviceRadiusKm: number; // e.g. 5, 15, 30, 50, 100, 999 (Butun O'zbekiston)
  profession: string;
  specialty: string;
  experienceYears: number;
  bio: string;
  about: string;
  skills: string[];
  languages: string[];
  education: string;
  certificates: string[];
  workType: 'full_time' | 'part_time' | 'temporary' | 'daily' | 'freelance' | 'one_time' | 'online';
  expectedSalary: number;
  serviceRates: ServiceRate[];
  workHours: string;
  restDays: string[];
  isAvailable: boolean; // Hozir mavjud
  workMode: 'remote' | 'onsite' | 'both';
  serviceLocationType: 'client_place' | 'my_place' | 'both';
  rating: number;
  reviewCount: number;
  completedJobsCount: number;
  verification: VerificationStatus;
  socialLinks: SocialLinks;
  portfolios: PortfolioItem[];
  distanceKm?: number; // Calculated relative to current search anchor
  isVip?: boolean;
}

export interface Job {
  id: string;
  title: string;
  companyName: string;
  companyLogo?: string;
  employerId: string;
  category: string;
  subcategory?: string;
  position: string;
  description: string;
  skills: string[];
  experienceYears: number;
  requiredWorkersCount: number;
  salaryMin: number;
  salaryMax: number;
  salaryType: 'fixed' | 'monthly' | 'daily' | 'negotiable';
  bonus?: string;
  jobType: 'full_time' | 'part_time' | 'temporary' | 'daily' | 'freelance' | 'one_time' | 'online';
  workHours: string;
  startDate?: string;
  endDate?: string;
  city: string;
  district: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  images?: string[];
  isVip?: boolean;
  createdAt: string;
  applicationsCount: number;
  distanceKm?: number;
}

export interface ServiceItem {
  id: string;
  specialistId: string;
  specialistName: string;
  specialistAvatar: string;
  specialistRating: number;
  specialistReviewCount: number;
  title: string;
  category: string;
  description: string;
  price: number;
  priceUnit: string;
  images: string[];
  city: string;
  lat: number;
  lng: number;
  distanceKm?: number;
  serviceRadiusKm: number;
}

export type OrderStatus = 
  | 'yangi' 
  | 'kelishilmoqda' 
  | 'qabul_qilindi' 
  | 'ish_boshlandi' 
  | 'jarayonda' 
  | 'bajarildi' 
  | 'bekor_qilindi' 
  | 'baholandi';

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  specialistId: string;
  specialistName: string;
  specialistAvatar: string;
  serviceTitle: string;
  category: string;
  problemDescription: string;
  budget: number;
  city: string;
  district?: string;
  address: string;
  requiredDate: string;
  status: OrderStatus;
  images?: string[];
  notes?: string;
  createdAt: string;
  completedAt?: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  applicantId: string;
  applicantName: string;
  applicantAvatar: string;
  applicantPhone: string;
  applicantProfession: string;
  coverLetter: string;
  expectedSalary: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface JobInvitation {
  id: string;
  specialistId: string;
  specialistName: string;
  employerId: string;
  employerName: string;
  companyName: string;
  position: string;
  salary: number;
  workHours: string;
  address: string;
  startDate: string;
  description: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  roomId: string;
  text: string;
  type: 'text' | 'image' | 'voice' | 'file' | 'location' | 'price_offer' | 'order_card' | 'job_card';
  mediaUrl?: string;
  priceOffer?: {
    amount: number;
    note: string;
    status: 'pending' | 'accepted' | 'declined';
  };
  orderData?: Partial<Order>;
  timestamp: string;
  isRead: boolean;
}

export interface ChatRoom {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantProfession: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'job_offer' | 'order' | 'chat' | 'view' | 'saved' | 'order_status' | 'matching_job' | 'review' | 'system';
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ReviewCriteria {
  quality: number;
  communication: number;
  timeliness: number;
  priceMatch: number;
}

export interface ReviewItem {
  id: string;
  targetId: string; // specialist ID
  authorId: string;
  authorName: string;
  authorAvatar: string;
  rating: number;
  criteria: ReviewCriteria;
  comment: string;
  images?: string[];
  isVerifiedOrder: boolean;
  createdAt: string;
}

export interface ReportItem {
  id: string;
  targetType: 'profile' | 'job' | 'portfolio' | 'review';
  targetId: string;
  targetTitle: string;
  reportedBy: string;
  reason: 'fake_profile' | 'fraud' | 'wrong_info' | 'spam' | 'inappropriate' | 'other';
  description: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  subcategories: string[];
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  description: string;
  establishedYear: number;
  employeeCount: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  email: string;
  website?: string;
  socialLinks: SocialLinks;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  vacancies: Job[];
  portfolios: PortfolioItem[];
}
