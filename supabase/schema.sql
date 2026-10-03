-- ==============================================================================
-- ISHTOP MARKETPLACE - POSTGRESQL & SUPABASE COMPLETE DATABASE SCHEMA
-- ==============================================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. ROLES
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(50) UNIQUE NOT NULL,
    name_uz VARCHAR(100) NOT NULL,
    name_ru VARCHAR(100),
    name_en VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USERS
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    full_name VARCHAR(150),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. USER ROLES (A user can have multiple roles)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role_slug VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role_slug)
);

-- 4. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_uz VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(100) NOT NULL,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SUBCATEGORIES
CREATE TABLE IF NOT EXISTS public.subcategories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    name_uz VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(category_id, slug)
);

-- 6. SKILLS
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PROFILES (Detailed specialist / employer / user profile)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    username VARCHAR(100) UNIQUE,
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100),
    profession VARCHAR(150),
    specialty VARCHAR(150),
    bio TEXT,
    about TEXT,
    experience_years INT DEFAULT 0,
    education TEXT,
    work_type VARCHAR(50) DEFAULT 'full_time',
    expected_salary NUMERIC(15,2) DEFAULT 0,
    work_hours VARCHAR(100),
    rest_days TEXT[],
    is_available BOOLEAN DEFAULT TRUE,
    work_mode VARCHAR(50) DEFAULT 'onsite', -- onsite, remote, both
    service_location_type VARCHAR(50) DEFAULT 'both', -- client_place, my_place, both
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    address TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    service_radius_km INT DEFAULT 30,
    rating NUMERIC(3,2) DEFAULT 5.00,
    review_count INT DEFAULT 0,
    completed_jobs_count INT DEFAULT 0,
    is_vip BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. USER SKILLS
CREATE TABLE IF NOT EXISTS public.user_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    UNIQUE(user_id, skill_name)
);

-- 9. SOCIAL LINKS
CREATE TABLE IF NOT EXISTS public.social_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    instagram VARCHAR(255),
    youtube VARCHAR(255),
    telegram_username VARCHAR(255),
    telegram_channel VARCHAR(255),
    telegram_group VARCHAR(255),
    facebook VARCHAR(255),
    tiktok VARCHAR(255),
    linkedin VARCHAR(255),
    website VARCHAR(255),
    google_maps VARCHAR(255),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. VERIFICATIONS
CREATE TABLE IF NOT EXISTS public.verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    phone_verified BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE,
    identity_verified BOOLEAN DEFAULT FALSE,
    profession_verified BOOLEAN DEFAULT FALSE,
    company_verified BOOLEAN DEFAULT FALSE,
    portfolio_verified BOOLEAN DEFAULT FALSE,
    document_url TEXT,
    verified_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. PORTFOLIOS
CREATE TABLE IF NOT EXISTS public.portfolios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    price NUMERIC(15,2),
    duration VARCHAR(100),
    location VARCHAR(150),
    before_image TEXT,
    after_image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. PORTFOLIO IMAGES
CREATE TABLE IF NOT EXISTS public.portfolio_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    order_index INT DEFAULT 0
);

-- 13. PORTFOLIO VIDEOS
CREATE TABLE IF NOT EXISTS public.portfolio_videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT
);

-- 14. SERVICES
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    price NUMERIC(15,2) NOT NULL,
    price_unit VARCHAR(50) DEFAULT 'so''m',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. SERVICE IMAGES
CREATE TABLE IF NOT EXISTS public.service_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL
);

-- 16. COMPANIES
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    logo_url TEXT,
    description TEXT,
    established_year INT,
    employee_count VARCHAR(50),
    city VARCHAR(100) NOT NULL,
    address TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    phone VARCHAR(50),
    email VARCHAR(150),
    website VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    rating NUMERIC(3,2) DEFAULT 5.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. COMPANY MEMBERS
CREATE TABLE IF NOT EXISTS public.company_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member', -- owner, admin, recruiter, staff
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(company_id, user_id)
);

-- 18. JOBS (Vacancies & freelance work postings)
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    position VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    skills TEXT[],
    experience_years INT DEFAULT 0,
    required_workers_count INT DEFAULT 1,
    salary_min NUMERIC(15,2) DEFAULT 0,
    salary_max NUMERIC(15,2) DEFAULT 0,
    salary_type VARCHAR(50) DEFAULT 'monthly', -- monthly, daily, fixed, negotiable
    bonus TEXT,
    job_type VARCHAR(50) DEFAULT 'full_time', -- full_time, part_time, temporary, daily, freelance, one_time, online
    work_hours VARCHAR(100),
    start_date DATE,
    end_date DATE,
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    address TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    phone VARCHAR(50) NOT NULL,
    is_vip BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'active', -- active, paused, closed
    applications_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. JOB IMAGES
CREATE TABLE IF NOT EXISTS public.job_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL
);

-- 20. JOB APPLICATIONS
CREATE TABLE IF NOT EXISTS public.job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    applicant_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    cover_letter TEXT,
    expected_salary NUMERIC(15,2),
    status VARCHAR(50) DEFAULT 'pending', -- pending, accepted, rejected, interview
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(job_id, applicant_id)
);

-- 21. JOB INVITATIONS
CREATE TABLE IF NOT EXISTS public.job_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    specialist_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
    position VARCHAR(150),
    salary NUMERIC(15,2),
    work_hours VARCHAR(100),
    address TEXT,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- pending, accepted, rejected
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 22. ORDERS (Direct specialist orders & on-demand service requests)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    specialist_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    service_title VARCHAR(200) NOT NULL,
    category VARCHAR(100),
    problem_description TEXT NOT NULL,
    budget NUMERIC(15,2) DEFAULT 0,
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    address TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    required_date DATE,
    status VARCHAR(50) DEFAULT 'yangi', -- yangi, kelishilmoqda, qabul_qilindi, ish_boshlandi, jarayonda, bajarildi, bekor_qilindi, baholandi
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 23. ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    item_title VARCHAR(200) NOT NULL,
    quantity INT DEFAULT 1,
    unit_price NUMERIC(15,2) DEFAULT 0,
    total_price NUMERIC(15,2) DEFAULT 0
);

-- 24. CHAT ROOMS
CREATE TABLE IF NOT EXISTS public.chat_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user1_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    user2_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    last_message TEXT,
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user1_id, user2_id)
);

-- 25. MESSAGES
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    text TEXT,
    message_type VARCHAR(50) DEFAULT 'text', -- text, image, voice, file, location, price_offer, order_card, job_card
    media_url TEXT,
    price_offer_amount NUMERIC(15,2),
    price_offer_status VARCHAR(50), -- pending, accepted, declined
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 26. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- job_offer, order, chat, view, saved, order_status, matching_job, review, system
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 27. REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    rating NUMERIC(2,1) NOT NULL,
    quality_score INT DEFAULT 5,
    communication_score INT DEFAULT 5,
    timeliness_score INT DEFAULT 5,
    price_match_score INT DEFAULT 5,
    comment TEXT NOT NULL,
    is_verified_order BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 28. FAVORITES
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    item_type VARCHAR(50) NOT NULL, -- profile, job, service
    item_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, item_type, item_id)
);

-- 29. LOCATIONS & 30. SERVICE AREAS
CREATE TABLE IF NOT EXISTS public.service_areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    radius_km INT DEFAULT 30,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 31. REPORTS (Shikoyatlar)
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_type VARCHAR(50) NOT NULL, -- profile, job, portfolio, review
    target_id UUID NOT NULL,
    reported_by UUID REFERENCES public.users(id) ON DELETE CASCADE,
    reason VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- pending, reviewed, resolved, dismissed
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 32. SUBSCRIPTIONS & 33. PAYMENTS
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    plan_name VARCHAR(100) NOT NULL, -- basic, vip, enterprise
    price NUMERIC(15,2) NOT NULL,
    starts_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    amount NUMERIC(15,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'UZS',
    provider VARCHAR(50) NOT NULL, -- payme, click, uzum
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 34. ADMIN LOGS
CREATE TABLE IF NOT EXISTS public.admin_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES public.users(id),
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50),
    target_id UUID,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public jobs are viewable by everyone" ON public.jobs FOR SELECT USING (true);
CREATE POLICY "Public categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public subcategories are viewable by everyone" ON public.subcategories FOR SELECT USING (true);
CREATE POLICY "Public roles are viewable by everyone" ON public.roles FOR SELECT USING (true);
CREATE POLICY "Public services are viewable by everyone" ON public.services FOR SELECT USING (true);
CREATE POLICY "Public portfolios are viewable by everyone" ON public.portfolios FOR SELECT USING (true);
CREATE POLICY "Public reviews are viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Public messages are viewable by everyone" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view their notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);

-- Allow public inserts for marketplace client actions
CREATE POLICY "Allow public insert on users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on jobs" ON public.jobs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on messages" ON public.messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on reviews" ON public.reviews FOR INSERT WITH CHECK (true);

-- Indexes for lightning fast radius and search queries
CREATE INDEX IF NOT EXISTS idx_profiles_city ON public.profiles(city);
CREATE INDEX IF NOT EXISTS idx_profiles_coords ON public.profiles(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_jobs_city ON public.jobs(city);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON public.jobs(category);

-- ==============================================================================
-- 35. SEED DATA (BOSHLANG'ICH MA'LUMOTLAR)
-- ==============================================================================

-- ROLES
INSERT INTO public.roles (slug, name_uz, name_ru, name_en) VALUES
('ishchi', 'Ishchi', 'Рабочий', 'Worker'),
('freelancer', 'Freelancer', 'Фрилансер', 'Freelancer'),
('usta', 'Usta / Mutaxassis', 'Мастер', 'Craftsman / Specialist'),
('xizmat_korsatuvchi', 'Xizmat ko''rsatuvchi', 'Поставщик услуг', 'Service Provider'),
('buyurtmachi', 'Buyurtmachi', 'Заказчик', 'Client / Customer'),
('ishberuvchi', 'Ish beruvchi', 'Работодатель', 'Employer'),
('kompaniya', 'Kompaniya / Korxona', 'Компания', 'Company')
ON CONFLICT (slug) DO NOTHING;

-- CATEGORIES
INSERT INTO public.categories (slug, name_uz, icon, order_index) VALUES
('qurilish', 'Qurilish', 'Hammer', 1),
('mebel', 'Mebel', 'Armchair', 2),
('elektrik', 'Elektrik', 'Zap', 3),
('santexnik', 'Santexnik', 'Wrench', 4),
('avto', 'Avto', 'Car', 5),
('tamirlash', 'Ta''mirlash', 'Paintbrush', 6),
('it', 'IT & Dasturlash', 'Laptop', 7),
('dizayn', 'Dizayn & 3D', 'Palette', 8),
('talim', 'Ta''lim & Repetitor', 'GraduationCap', 9),
('haydovchi', 'Haydovchi & Kuryer', 'Truck', 10),
('gozallik', 'Go''zallik & Tikuv', 'Scissors', 11),
('boshqa', 'Boshqa xizmatlar', 'Grid', 12)
ON CONFLICT (slug) DO NOTHING;

-- SUBCATEGORIES FOR MEBEL
INSERT INTO public.subcategories (category_id, name_uz, slug)
SELECT id, 'Oshxona mebeli', 'oshxona-mebeli' FROM public.categories WHERE slug = 'mebel'
ON CONFLICT (category_id, slug) DO NOTHING;

INSERT INTO public.subcategories (category_id, name_uz, slug)
SELECT id, 'Shkaf-kupe', 'shkaf-kupe' FROM public.categories WHERE slug = 'mebel'
ON CONFLICT (category_id, slug) DO NOTHING;

INSERT INTO public.subcategories (category_id, name_uz, slug)
SELECT id, 'Yumshoq mebel', 'yumshoq-mebel' FROM public.categories WHERE slug = 'mebel'
ON CONFLICT (category_id, slug) DO NOTHING;

-- SUBCATEGORIES FOR ELEKTRIK
INSERT INTO public.subcategories (category_id, name_uz, slug)
SELECT id, 'Elektromontaj', 'elektromontaj' FROM public.categories WHERE slug = 'elektrik'
ON CONFLICT (category_id, slug) DO NOTHING;

INSERT INTO public.subcategories (category_id, name_uz, slug)
SELECT id, 'Lustra va qandillar', 'lustra-qandillar' FROM public.categories WHERE slug = 'elektrik'
ON CONFLICT (category_id, slug) DO NOTHING;

INSERT INTO public.subcategories (category_id, name_uz, slug)
SELECT id, 'Shchit yig''ish', 'shchit-yigish' FROM public.categories WHERE slug = 'elektrik'
ON CONFLICT (category_id, slug) DO NOTHING;

-- SUBCATEGORIES FOR IT
INSERT INTO public.subcategories (category_id, name_uz, slug)
SELECT id, 'Frontend React', 'frontend-react' FROM public.categories WHERE slug = 'it'
ON CONFLICT (category_id, slug) DO NOTHING;

INSERT INTO public.subcategories (category_id, name_uz, slug)
SELECT id, 'Backend Node/Python', 'backend-node-python' FROM public.categories WHERE slug = 'it'
ON CONFLICT (category_id, slug) DO NOTHING;

INSERT INTO public.subcategories (category_id, name_uz, slug)
SELECT id, 'Mobil ilova (Flutter/Android)', 'mobil-ilova' FROM public.categories WHERE slug = 'it'
ON CONFLICT (category_id, slug) DO NOTHING;

