-- ==============================================================================
-- ISHTOP MARKETPLACE - 1-CLICK QUICK DATABASE SETUP SCRIPT
-- Supabase SQL Editor ichiga qo'yib, bitta "RUN" tugmasini bosing!
-- ==============================================================================

-- 1. PROFILES TABLE (Mutaxassislar va foydalanuvchilar profili)
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    user_id TEXT UNIQUE,
    username TEXT,
    name TEXT NOT NULL,
    surname TEXT,
    phone TEXT,
    email TEXT,
    avatar_url TEXT,
    city TEXT DEFAULT 'Navoiy shahri',
    district TEXT DEFAULT 'Markaz',
    address TEXT,
    latitude NUMERIC DEFAULT 40.0915,
    longitude NUMERIC DEFAULT 65.3850,
    service_radius_km INT DEFAULT 30,
    profession TEXT DEFAULT 'Usta',
    specialty TEXT,
    experience_years INT DEFAULT 3,
    bio TEXT,
    about TEXT,
    skills TEXT[] DEFAULT ARRAY['Malakali mutaxassis'],
    education TEXT DEFAULT 'Oliy / Maxsus',
    work_type TEXT DEFAULT 'full_time',
    expected_salary NUMERIC DEFAULT 8000000,
    work_hours TEXT DEFAULT '08:30 - 18:30',
    is_available BOOLEAN DEFAULT TRUE,
    work_mode TEXT DEFAULT 'both',
    service_location_type TEXT DEFAULT 'both',
    rating NUMERIC DEFAULT 5.0,
    review_count INT DEFAULT 1,
    completed_jobs_count INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. JOBS TABLE (Ish e'lonlari va vakansiyalar)
CREATE TABLE IF NOT EXISTS public.jobs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    title TEXT NOT NULL,
    company_name TEXT NOT NULL,
    employer_id TEXT DEFAULT 'employer-1',
    category TEXT NOT NULL,
    position TEXT,
    description TEXT,
    skills TEXT[] DEFAULT ARRAY['Tajriba'],
    experience_years INT DEFAULT 1,
    required_workers_count INT DEFAULT 1,
    salary_min NUMERIC DEFAULT 5000000,
    salary_max NUMERIC DEFAULT 9000000,
    job_type TEXT DEFAULT 'full_time',
    work_hours TEXT DEFAULT '09:00 - 18:00',
    city TEXT DEFAULT 'Navoiy shahri',
    district TEXT DEFAULT 'Markaz',
    address TEXT,
    latitude NUMERIC DEFAULT 40.0844,
    longitude NUMERIC DEFAULT 65.3792,
    phone TEXT DEFAULT '+998 90 123 45 67',
    is_vip BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ORDERS TABLE (Buyurtmalar va xizmat so'rovlari)
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    user_id TEXT,
    specialist_id TEXT,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    budget NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'yangi',
    city TEXT DEFAULT 'Navoiy shahri',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. MESSAGES TABLE (Realtime Chat xabarlari)
CREATE TABLE IF NOT EXISTS public.messages (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    room_id TEXT NOT NULL,
    sender_id TEXT NOT NULL,
    receiver_id TEXT NOT NULL,
    message_text TEXT,
    message_type TEXT DEFAULT 'text',
    media_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ROW LEVEL SECURITY (RLS) - Barchaga o'qish va yozish ruxsati berish
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all on profiles" ON public.profiles;
CREATE POLICY "Allow all on profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on jobs" ON public.jobs;
CREATE POLICY "Allow all on jobs" ON public.jobs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on orders" ON public.orders;
CREATE POLICY "Allow all on orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on messages" ON public.messages;
CREATE POLICY "Allow all on messages" ON public.messages FOR ALL USING (true) WITH CHECK (true);

-- 6. REALTIME CHAT NI YOQISH
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.jobs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;

-- 7. NAMUNA MUTAXASSISLAR VA ISHLARNI QO'SHISH
INSERT INTO public.profiles (name, surname, profession, phone, email, city, rating, review_count, avatar_url, skills)
VALUES 
('Farrux', 'Sobirov', 'Mebel ustasi', '+998 91 234 56 78', 'farrux@mebel.uz', 'Navoiy shahri', 4.9, 48, 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400', ARRAY['Oshxona mebeli', 'Shkaf-kupe', 'Yumshoq mebel']),
('Jamshid', 'Karimov', 'Elektromontajchi', '+998 93 345 67 89', 'jamshid@tok.uz', 'Navoiy shahri', 5.0, 62, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', ARRAY['Elektr montaj', 'Avtomatika', 'Qandil o''rnatish']),
('Otabek', 'Nazarov', 'Santexnik', '+998 90 456 78 90', 'otabek@santex.uz', 'Navoiy shahri', 4.8, 35, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', ARRAY['Issiq pol', 'Truba montaj', 'Kran ta''miri'])
ON CONFLICT DO NOTHING;

INSERT INTO public.jobs (title, company_name, category, salary_min, salary_max, city, description, phone)
VALUES
('Tajribali mebelchi usta kerak', 'Navoiy Mebel Servis', 'Mebel', 6000000, 10000000, 'Navoiy shahri', 'Shkaf-kupe va oshxona mebellarini yig''ish uchun usta talab qilinadi. Ish haqi o''z vaqtida.', '+998 90 123 45 67'),
('Bosh elektrik montajchi', 'Grand Stroy MCHJ', 'Elektrik', 7000000, 12000000, 'Navoiy shahri', 'Yangi ko''p qavatli bino montaj ishlari uchun brigada yoki usta.', '+998 93 888 77 66')
ON CONFLICT DO NOTHING;
