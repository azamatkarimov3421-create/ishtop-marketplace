import { SpecialistProfile, Job, ServiceItem, Order, Category, Company, ReviewItem, NotificationItem, ChatRoom, ChatMessage } from '../types';

export const CITIES = [
  { name: "Navoiy shahri", region: "Navoiy", lat: 40.0844, lng: 65.3792 },
  { name: "Toshkent shahri", region: "Toshkent", lat: 41.2995, lng: 69.2401 },
  { name: "Samarqand shahri", region: "Samarqand", lat: 39.6270, lng: 66.9750 },
  { name: "Buxoro shahri", region: "Buxoro", lat: 39.7681, lng: 64.4556 },
  { name: "Andijon shahri", region: "Andijon", lat: 40.7821, lng: 72.3442 },
  { name: "Farg'ona shahri", region: "Farg'ona", lat: 40.3864, lng: 71.7864 },
  { name: "Namangan shahri", region: "Namangan", lat: 40.9983, lng: 71.6726 },
  { name: "Qarshi shahri", region: "Qashqadaryo", lat: 38.8606, lng: 65.7890 },
  { name: "Urganch shahri", region: "Xorazm", lat: 41.5564, lng: 60.6310 },
  { name: "Termiz shahri", region: "Surxondaryo", lat: 37.2242, lng: 67.2783 },
  { name: "Jizzax shahri", region: "Jizzax", lat: 40.1158, lng: 67.8422 },
  { name: "Nukus shahri", region: "Qoraqalpog'iston", lat: 42.4602, lng: 59.6166 },
];

export const CATEGORIES: Category[] = [
  { id: "all", name: "Barchasi", slug: "all", icon: "Home", subcategories: [] },
  { id: "qurilish", name: "Qurilish", slug: "qurilish", icon: "Hammer", subcategories: ["G'isht terish", "Beton quyish", "Suvoq", "Tom yopish", "Kafel terish"] },
  { id: "mebel", name: "Mebel", slug: "mebel", icon: "Armchair", subcategories: ["Oshxona mebeli", "Shkaf-kupe", "Yumshoq mebel", "Mebel restavratsiyasi", "Ofis mebellari"] },
  { id: "elektrik", name: "Elektrik", slug: "elektrik", icon: "Zap", subcategories: ["Elektromontaj", "Lustra va qandillar", "Shchit yig'ish", "Avtomatika", "Qisqa tutashuv bartaraf etish"] },
  { id: "santexnik", name: "Santexnik", slug: "santexnik", icon: "Wrench", subcategories: ["Quvurlar almashtirish", "Kran va unitaz o'rnatish", "Isitish tizimlari", "Kanalizatsiya tozalash", "Nasos montaji"] },
  { id: "avto", name: "Avto", slug: "avto", icon: "Car", subcategories: ["Avtoelektrik", "Dvigatel ustasi", "Xodovoy", "Kuzov ishlari", "Avtodiagnostika"] },
  { id: "tamirlash", name: "Ta'mirlash", slug: "tamirlash", icon: "Paintbrush", subcategories: ["Kvartira ta'miri", "Oboy yopishtirish", "Molyarka", "Gipsokarton", "Laminat yotqizish"] },
  { id: "it", name: "IT & Dasturlash", slug: "it", icon: "Laptop", subcategories: ["Frontend React", "Backend Node/Python", "Mobil ilova (Flutter/Android)", "WordPress/Saytlar", "Bot yaratish"] },
  { id: "dizayn", name: "Dizayn & 3D", slug: "dizayn", icon: "Palette", subcategories: ["Grafik dizayn", "Interyer dizayn", "3D modellashtirish", "Logotip & Brending", "SMM dizayn"] },
  { id: "talim", name: "Ta'lim & Repetitor", slug: "talim", icon: "GraduationCap", subcategories: ["Ingliz tili", "Matematika", "Fizika", "Rus tili", "Ona tili va adabiyot"] },
  { id: "haydovchi", name: "Haydovchi & Kuryer", slug: "haydovchi", icon: "Truck", subcategories: ["Shaxsiy haydovchi", "Yuk tashish (Gazel)", "Kuryerlik", "Shaharlararo qatnov"] },
  { id: "gozallik", name: "Go'zallik & Tikuv", slug: "gozallik", icon: "Scissors", subcategories: ["Sartarosh", "Pardalar tikish", "Kiyim tikish", "Vizajist", "Massaj"] },
  { id: "boshqa", name: "Boshqa xizmatlar", slug: "boshqa", icon: "Grid", subcategories: ["Tozalash (Cleaning)", "Oshpazlik", "Bog'bonchilik", "Payvandlash (Svarka)", "Ko'chirish xizmati"] },
];

export const INITIAL_SPECIALISTS: SpecialistProfile[] = [
  {
    id: "spec-1",
    userId: "user-sardor",
    name: "Sardorbek",
    surname: "Xoliqov",
    username: "sardor_mebel",
    avatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80",
    phone: "+998 90 123 45 67",
    email: "sardor.mebel@gmail.com",
    city: "Navoiy shahri",
    district: "Zarafshon ko'chasi",
    address: "Navoiy sh., G'alaba shoh ko'chasi 14",
    lat: 40.0915,
    lng: 65.3850,
    serviceRadiusKm: 20,
    profession: "Mebel ustasi",
    specialty: "Oshxona mebellari, Akril, MDF va shkaflar",
    experienceYears: 12,
    bio: "12 yillik tajribaga ega usta. Har qanday murakkablikdagi premium va zamonaviy oshxona, shkaf, yumshoq mebellarni sifatli tayyorlaymiz.",
    about: "Men o'z sohamda 2012-yildan beri faoliyat yuritib kelmoqdaman. Zamonaviy uskunalar bilan jihozlangan shaxsiy mebel sexiga egaman. Barcha furnituralarimiz Avstriya va Turkiya standartlariga mos keladi. 2 yillik kafolat beriladi.",
    skills: ["Oshxona mebeli", "Shkaf-kupe", "3D dizayn loyihalash", "CNC frezalash", "Akril qoplama", "Blum furnitura o'rnatish"],
    languages: ["O'zbekcha", "Ruscha"],
    education: "Navoiy Davlat Pedagogika va Dizayn Kolleji",
    certificates: ["Blum Furniture Master 2022", "Modern Interior Woodcraft Cert."],
    workType: "full_time",
    expectedSalary: 12000000,
    serviceRates: [
      { id: "sr-1", title: "Oshxona mebeli (pog. metr)", price: 2200000, unit: "so'm / metr" },
      { id: "sr-2", title: "Shkaf-kupe tayyorlash", price: 1800000, unit: "so'm / metr" },
      { id: "sr-3", title: "Mebel o'lchash va 3D eskiz", price: 0, unit: "bepul" },
      { id: "sr-4", title: "Mebel buzish va qayta yig'ish", price: 350000, unit: "so'm / dona" }
    ],
    workHours: "08:30 - 19:30",
    restDays: ["Yakshanba"],
    isAvailable: true,
    workMode: "onsite",
    serviceLocationType: "both",
    rating: 4.9,
    reviewCount: 127,
    completedJobsCount: 86,
    verification: {
      phone: true,
      email: true,
      identity: true,
      profession: true,
      company: true,
      portfolio: true
    },
    socialLinks: {
      instagram: "sardor_mebel_navoiy",
      telegramUsername: "sardor_usta_navoiy",
      telegramChannel: "sardor_mebellari",
      youtube: "SardorCraftUz"
    },
    portfolios: [
      {
        id: "port-1",
        title: "Neoklassika uslubidagi oshxona mebeli",
        description: "MDF emal qoplama, Blum lift tizimlari, tosh stoleshnitsa.",
        category: "Oshxona mebeli",
        price: 18500000,
        duration: "14 kun",
        date: "2026-09-15",
        location: "Navoiy sh., Bobur bog'i yaqini",
        images: [
          "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=600&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=600&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&auto=format&fit=crop&q=80"
        ],
        beforeAfter: {
          before: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
          after: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80"
        }
      },
      {
        id: "port-2",
        title: "Shkaf-kupe sensorli LED yoritgichli",
        description: "Katta shisha eshikli, sensor chiroqlar bilan jihozlangan qulay garderob.",
        category: "Shkaf-kupe",
        price: 8500000,
        duration: "7 kun",
        images: [
          "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80"
        ]
      }
    ],
    distanceKm: 5.2,
    isVip: true
  },
  {
    id: "spec-2",
    userId: "user-bekzod",
    name: "Bekzod",
    surname: "Karimov",
    username: "bekzod_elektrik",
    avatar: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&auto=format&fit=crop&q=80",
    phone: "+998 93 987 65 43",
    email: "bekzod.elektrik@mail.ru",
    city: "Navoiy shahri",
    district: "Istiqlol ko'chasi",
    address: "Navoiy sh., Do'stlik ko'chasi 28",
    lat: 40.0820,
    lng: 65.3710,
    serviceRadiusKm: 15,
    profession: "Elektrik ustasi",
    specialty: "Aqlli uy tizimlari, shchit montaji va xavfsiz elektromontaj",
    experienceYears: 9,
    bio: "Professional elektrik ustasi. Xonadon, villa, magazin va ishlab chiqarish binolari uchun 100% xavfsiz montaj.",
    about: "9 yillik tajriba. Oliy toifali elektr-montajchi diplomi. Schneider Electric va ABB uskunalaridan foydalanaman.",
    skills: ["Shchit yig'ish", "Aqlli uy montaji", "Kabel yotqizish (shtroba)", "Lustra va neon yoritish", "Generator va UPS ulash"],
    languages: ["O'zbekcha", "Ruscha"],
    education: "Navoiy Kon-Metallurgiya Universiteti",
    certificates: ["4-guruh Elektr xavfsizligi ruxsatnomasi", "Schneider Electric Certified"],
    workType: "full_time",
    expectedSalary: 9000000,
    serviceRates: [
      { id: "sr-21", title: "Elektroshchit yig'ish va sozlash", price: 400000, unit: "so'm / dona" },
      { id: "sr-22", title: "1 ta rozetka / vikluchatel nuqtasi", price: 35000, unit: "so'm / nuqta" },
      { id: "sr-23", title: "Lustra va qandil osish", price: 120000, unit: "so'm / dona" },
      { id: "sr-24", title: "Avariya holatida tezkor chaqiruv", price: 100000, unit: "so'm" }
    ],
    workHours: "08:00 - 21:00",
    restDays: [],
    isAvailable: true,
    workMode: "onsite",
    serviceLocationType: "client_place",
    rating: 4.8,
    reviewCount: 96,
    completedJobsCount: 64,
    verification: {
      phone: true,
      email: true,
      identity: true,
      profession: true,
      company: false,
      portfolio: true
    },
    socialLinks: {
      telegramUsername: "bekzod_electrician",
      instagram: "bekzod_elektromontaj"
    },
    portfolios: [
      {
        id: "port-21",
        title: "Kottejda zamonaviy elektroshchit montaji",
        description: "Schneider avtomatlar bilan yig'ilgan xavfsiz elektr taqsimlash qutisi.",
        category: "Elektrik",
        price: 3200000,
        duration: "3 kun",
        images: [
          "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80"
        ]
      }
    ],
    distanceKm: 3.1,
    isVip: false
  },
  {
    id: "spec-3",
    userId: "user-akmal",
    name: "Akmal",
    surname: "Sobirov",
    username: "akmal_santexnik",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80",
    phone: "+998 97 555 12 34",
    email: "akmal.plumber@gmail.com",
    city: "Navoiy shahri",
    district: "Tinchlik ko'chasi",
    address: "Navoiy sh., Ibn Sino ko'chasi 19",
    lat: 40.0790,
    lng: 65.3650,
    serviceRadiusKm: 30,
    profession: "Santexnik",
    specialty: "Issiq pol, qozonxona montaji va quvurlar tozalash",
    experienceYears: 10,
    bio: "Professional santexnika ishlari. Issiq pol, kotyol o'rnatish, sifatli plastik quvurlar, vanna va unitaz montaji.",
    about: "10 yildan ortiq vaqt davomida yuzlab xonadonlarda isitish va suv ta'minoti tizimlarini muammosiz topshirganman.",
    skills: ["Issiq pol (Tyoply pol)", "Kotyol va boyler ulash", "Plastik quvur payvandlash", "Suv nasoslari montaji"],
    languages: ["O'zbekcha", "Ruscha"],
    education: "Navoiy Qurilish Kasb-Hunar Kolleji",
    certificates: ["Ariston & Fondital Master Certified"],
    workType: "full_time",
    expectedSalary: 10000000,
    serviceRates: [
      { id: "sr-31", title: "Issiq pol yotqizish (kv.m)", price: 35000, unit: "so'm / kv.m" },
      { id: "sr-32", title: "Ikki konturli kotyol o'rnatish", price: 600000, unit: "so'm / dona" },
      { id: "sr-33", title: "Kran va smesitel almashtirish", price: 80000, unit: "so'm" }
    ],
    workHours: "07:30 - 20:00",
    restDays: [],
    isAvailable: true,
    workMode: "onsite",
    serviceLocationType: "client_place",
    rating: 4.7,
    reviewCount: 73,
    completedJobsCount: 51,
    verification: {
      phone: true,
      email: true,
      identity: true,
      profession: true,
      company: false,
      portfolio: true
    },
    socialLinks: {
      telegramUsername: "akmal_santexnika"
    },
    portfolios: [],
    distanceKm: 4.6,
    isVip: false
  }
];

export const INITIAL_JOBS: Job[] = [
  {
    id: "job-1",
    title: "Mebelchi usta va stanok operatori",
    companyName: "Navoiy Mebel Zavodi",
    companyLogo: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=200&auto=format&fit=crop&q=80",
    employerId: "user-company-navoiy-mebel",
    category: "Mebel",
    subcategory: "Oshxona mebeli",
    position: "Bosh mebel ustasi",
    description: "Bizning kengayib borayotgan sexga tajribali mebel ustalari kerak. Chizmalar asosida zamonaviy mebellarni yig'ish, sifat nazorati.",
    skills: ["Oshxona mebeli", "Stanokda ishlash", "Chizmalarni o'qish", "Aniqlik"],
    experienceYears: 3,
    requiredWorkersCount: 4,
    salaryMin: 6000000,
    salaryMax: 10000000,
    salaryType: "monthly",
    bonus: "KPI va tushlik korxona hisobidan",
    jobType: "full_time",
    workHours: "08:30 - 18:30",
    startDate: "2026-10-10",
    city: "Navoiy shahri",
    district: "Sanoat zonasi",
    address: "Navoiy sh., Sanoatchilar ko'chasi 18",
    lat: 40.0890,
    lng: 65.3780,
    phone: "+998 79 220 10 20",
    images: ["https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=600&auto=format&fit=crop&q=80"],
    isVip: true,
    createdAt: "2026-10-01",
    applicationsCount: 14,
    distanceKm: 3.8
  },
  {
    id: "job-2",
    title: "Elektrik montajchilari guruhi (Katta ob'yekt)",
    companyName: "Akfa Comfort Navoiy",
    companyLogo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=80",
    employerId: "user-akfa-navoiy",
    category: "Elektrik",
    subcategory: "Elektromontaj",
    position: "Elektrik montajchi",
    description: "Yangi qurilayotgan turar-joy majmuasiga ichki elektr simlarini tortish va shchitlarni yig'ish uchun brigada taklif qilamiz.",
    skills: ["Kabel yotqizish", "Shchit montaji", "Xavfsizlik qoidalari"],
    experienceYears: 2,
    requiredWorkersCount: 6,
    salaryMin: 5500000,
    salaryMax: 8500000,
    salaryType: "monthly",
    bonus: "Oylik ustama va yo'l haqi beriladi",
    jobType: "full_time",
    workHours: "08:00 - 17:00",
    city: "Navoiy shahri",
    district: "Yangi Navoiy siti",
    address: "Navoiy siti, 4-hudud",
    lat: 40.0930,
    lng: 65.3820,
    phone: "+998 90 777 66 55",
    isVip: true,
    createdAt: "2026-10-02",
    applicationsCount: 8,
    distanceKm: 2.9
  }
];

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: "srv-1",
    specialistId: "spec-1",
    specialistName: "Sardorbek",
    specialistAvatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80",
    specialistRating: 4.9,
    specialistReviewCount: 127,
    title: "Oshxona mebellarini 3D dizayn bilan tayyorlash",
    category: "Mebel",
    description: "Yuqori sifatli akril va MDF materiallar, bepul o'lchash va 3D loyiha.",
    price: 2200000,
    priceUnit: "so'm / metr",
    images: ["https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80"],
    city: "Navoiy shahri",
    lat: 40.0915,
    lng: 65.3850,
    distanceKm: 5.2,
    serviceRadiusKm: 20
  }
];

export const INITIAL_COMPANIES: Company[] = [
  {
    id: "comp-1",
    name: "NAVOIY MEBEL",
    logo: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=200&auto=format&fit=crop&q=80",
    description: "Navoiy viloyatidagi eng yirik zamonaviy mebel ishlab chiqarish majmuasi.",
    establishedYear: 2015,
    employeeCount: "45-60 nafar",
    city: "Navoiy shahri",
    address: "Sanoatchilar ko'chasi 18",
    lat: 40.0890,
    lng: 65.3780,
    phone: "+998 79 220 10 20",
    email: "info@navoiymebel.uz",
    website: "https://navoiymebel.uz",
    socialLinks: {
      instagram: "navoiymebel_official",
      telegramChannel: "navoiymebel_uz",
      youtube: "NavoiyMebelTV"
    },
    rating: 4.9,
    reviewCount: 184,
    isVerified: true,
    vacancies: [],
    portfolios: []
  }
];

export const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: "rev-1",
    targetId: "spec-1",
    authorId: "user-client-1",
    authorName: "Otabek Mirzayev",
    authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
    rating: 5.0,
    criteria: { quality: 5, communication: 5, timeliness: 5, priceMatch: 5 },
    comment: "Sardorbek ustaga katta rahmat! Oshxona mebelimizni aytilgan vaqtda topshirdi. Materiallari juda sifatli, hamma furnituralari yumshoq yopiladi.",
    images: ["https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=300&auto=format&fit=crop&q=80"],
    isVerifiedOrder: true,
    createdAt: "2026-09-20"
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: "ord-101",
    customerId: "current-user-id",
    customerName: "Siz (Buyurtmachi)",
    customerPhone: "+998 90 123 45 67",
    specialistId: "spec-1",
    specialistName: "Sardorbek",
    specialistAvatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80",
    serviceTitle: "Oshxona mebeli buyurtmasi",
    category: "Mebel",
    problemDescription: "Yangi uyimiz uchun 4 metrli neoklassika oshxona mebeli tayyorlash va o'rnatish.",
    budget: 12000000,
    city: "Navoiy shahri",
    address: "Navoiy sh., G'alaba ko'chasi 14/2",
    requiredDate: "2026-10-15",
    status: "jarayonda",
    createdAt: "2026-10-02",
    notes: "Rangini och kulrang qilamiz."
  }
];

export const INITIAL_CHAT_ROOMS: ChatRoom[] = [
  {
    id: "room-1",
    participantId: "spec-1",
    participantName: "Sardorbek (Mebelchi)",
    participantAvatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80",
    participantProfession: "Mebel ustasi",
    lastMessage: "Assalomu alaykum! Ertaga soat 14:00 da o'lchashga borishim mumkin.",
    lastMessageTime: "09:42",
    unreadCount: 2,
    isOnline: true
  },
  {
    id: "room-2",
    participantId: "spec-2",
    participantName: "Bekzod (Elektrik)",
    participantAvatar: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&auto=format&fit=crop&q=80",
    participantProfession: "Elektrik ustasi",
    lastMessage: "Narx taklifini yubordim. Ko'rib chiqing.",
    lastMessageTime: "Kecha",
    unreadCount: 1,
    isOnline: true
  }
];

export const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  "room-1": [
    {
      id: "m1",
      senderId: "spec-1",
      receiverId: "current-user-id",
      roomId: "room-1",
      text: "Assalomu alaykum! IshTop orqali bog'langaningiz uchun rahmat. Qanday mebel yasatmoqchisiz?",
      type: "text",
      timestamp: "09:30",
      isRead: true
    },
    {
      id: "m2",
      senderId: "current-user-id",
      receiverId: "spec-1",
      roomId: "room-1",
      text: "Va alaykum assalom Sardorbek aka. Yangi kvartiraga oshxona mebeli kerak edi. 4 metr atrofida.",
      type: "text",
      timestamp: "09:34",
      isRead: true
    },
    {
      id: "m3",
      senderId: "spec-1",
      receiverId: "current-user-id",
      roomId: "room-1",
      text: "Assalomu alaykum! Ertaga soat 14:00 da o'lchashga borishim mumkin.",
      type: "text",
      timestamp: "09:42",
      isRead: false
    }
  ],
  "room-2": [
    {
      id: "m21",
      senderId: "spec-2",
      receiverId: "current-user-id",
      roomId: "room-2",
      text: "Assalomu alaykum! Elektr ishlari bo'yicha qanday muammo bor?",
      type: "text",
      timestamp: "18:10",
      isRead: true
    },
    {
      id: "m22",
      senderId: "spec-2",
      receiverId: "current-user-id",
      roomId: "room-2",
      text: "Rozetkalar va shchit montaji uchun taklif:",
      type: "price_offer",
      priceOffer: {
        amount: 850000,
        note: "Barcha materiallar va montaj xizmati bilan",
        status: "pending"
      },
      timestamp: "18:20",
      isRead: false
    }
  ]
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    userId: "current-user",
    type: "order_status",
    title: "Buyurtmangiz holati o'zgardi",
    message: "Sardorbek mebel buyurtmangiz ustida ish boshladi (Status: Jarayonda).",
    link: "orders",
    isRead: false,
    createdAt: "10 daqiqa oldin"
  },
  {
    id: "notif-2",
    userId: "current-user",
    type: "chat",
    title: "Yangi xabar: Sardorbek",
    message: "Ertaga soat 14:00 da o'lchashga borishim mumkin.",
    link: "chat",
    isRead: false,
    createdAt: "25 daqiqa oldin"
  }
];
