-- ===================================================================
-- COMPLETE DATABASE SETUP FOR ALWAEL DASHBOARD
-- ===================================================================
-- This script creates all tables with proper RLS policies:
-- - PUBLIC users can READ all data (for website display)
-- - AUTHENTICATED users can CREATE/UPDATE/DELETE (for admin panel)
-- ===================================================================

-- ===================================================================
-- 1. TEAM MEMBERS TABLE
-- ===================================================================
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    department TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    image_url TEXT,
    bio TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_team_members_display_order ON public.team_members(display_order);
CREATE INDEX IF NOT EXISTS idx_team_members_is_active ON public.team_members(is_active);

-- ===================================================================
-- 2. PROJECTS TABLE
-- ===================================================================
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    area TEXT,
    year TEXT,
    features TEXT[], -- Array of features
    status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'completed', 'on_hold')),
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);

-- ===================================================================
-- 3. PROJECT IMAGES TABLE (for multiple images per project)
-- ===================================================================
CREATE TABLE IF NOT EXISTS public.project_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON public.project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_project_images_display_order ON public.project_images(display_order);

-- ===================================================================
-- 4. ORDERS TABLE
-- ===================================================================
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    property_type TEXT NOT NULL,
    location TEXT NOT NULL,
    budget TEXT,
    message TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'completed', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- ===================================================================
-- 5. CONSULTATIONS TABLE
-- ===================================================================
CREATE TABLE IF NOT EXISTS public.consultations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    consultation_type TEXT NOT NULL,
    preferred_date TEXT,
    preferred_time TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_consultations_status ON public.consultations(status);
CREATE INDEX IF NOT EXISTS idx_consultations_created_at ON public.consultations(created_at DESC);

-- ===================================================================
-- 6. CONTENT SECTIONS TABLE
-- ===================================================================
CREATE TABLE IF NOT EXISTS public.content_sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    section_key TEXT UNIQUE NOT NULL, -- e.g., 'hero', 'about', 'services'
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_content_sections_section_key ON public.content_sections(section_key);
CREATE INDEX IF NOT EXISTS idx_content_sections_is_active ON public.content_sections(is_active);

-- ===================================================================
-- 7. USERS TABLE (for admin authentication)
-- ===================================================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'editor' CHECK (role IN ('super_admin', 'admin', 'editor')),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- ===================================================================
-- TRIGGERS FOR AUTO-UPDATING updated_at
-- ===================================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.consultations FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.content_sections FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ===================================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ===================================================================

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- ===================================================================
-- RLS POLICIES - PUBLIC READ, AUTHENTICATED WRITE
-- ===================================================================

-- ============ TEAM MEMBERS POLICIES ============
-- Public can read active team members (for website)
CREATE POLICY "Public can read active team members" ON public.team_members
    FOR SELECT
    USING (is_active = true);

-- Authenticated users can read all team members (for admin)
CREATE POLICY "Authenticated can read all team members" ON public.team_members
    FOR SELECT
    TO authenticated
    USING (true);

-- Authenticated users can insert
CREATE POLICY "Authenticated can insert team members" ON public.team_members
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Authenticated users can update
CREATE POLICY "Authenticated can update team members" ON public.team_members
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Authenticated users can delete
CREATE POLICY "Authenticated can delete team members" ON public.team_members
    FOR DELETE
    TO authenticated
    USING (true);

-- ============ PROJECTS POLICIES ============
-- Public can read all projects (for website)
CREATE POLICY "Public can read projects" ON public.projects
    FOR SELECT
    USING (true);

-- Authenticated users can insert
CREATE POLICY "Authenticated can insert projects" ON public.projects
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Authenticated users can update
CREATE POLICY "Authenticated can update projects" ON public.projects
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Authenticated users can delete
CREATE POLICY "Authenticated can delete projects" ON public.projects
    FOR DELETE
    TO authenticated
    USING (true);

-- ============ PROJECT IMAGES POLICIES ============
-- Public can read all project images
CREATE POLICY "Public can read project images" ON public.project_images
    FOR SELECT
    USING (true);

-- Authenticated users can manage project images
CREATE POLICY "Authenticated can insert project images" ON public.project_images
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated can update project images" ON public.project_images
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated can delete project images" ON public.project_images
    FOR DELETE
    TO authenticated
    USING (true);

-- ============ ORDERS POLICIES ============
-- Public can insert orders (from website contact form)
CREATE POLICY "Public can insert orders" ON public.orders
    FOR INSERT
    WITH CHECK (true);

-- Authenticated users can read all orders
CREATE POLICY "Authenticated can read orders" ON public.orders
    FOR SELECT
    TO authenticated
    USING (true);

-- Authenticated users can update orders
CREATE POLICY "Authenticated can update orders" ON public.orders
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Authenticated users can delete orders
CREATE POLICY "Authenticated can delete orders" ON public.orders
    FOR DELETE
    TO authenticated
    USING (true);

-- ============ CONSULTATIONS POLICIES ============
-- Public can insert consultations (from website)
CREATE POLICY "Public can insert consultations" ON public.consultations
    FOR INSERT
    WITH CHECK (true);

-- Authenticated users can read all consultations
CREATE POLICY "Authenticated can read consultations" ON public.consultations
    FOR SELECT
    TO authenticated
    USING (true);

-- Authenticated users can update consultations
CREATE POLICY "Authenticated can update consultations" ON public.consultations
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Authenticated users can delete consultations
CREATE POLICY "Authenticated can delete consultations" ON public.consultations
    FOR DELETE
    TO authenticated
    USING (true);

-- ============ CONTENT SECTIONS POLICIES ============
-- Public can read active content (for website)
CREATE POLICY "Public can read active content" ON public.content_sections
    FOR SELECT
    USING (is_active = true);

-- Authenticated users can read all content
CREATE POLICY "Authenticated can read all content" ON public.content_sections
    FOR SELECT
    TO authenticated
    USING (true);

-- Authenticated users can manage content
CREATE POLICY "Authenticated can insert content" ON public.content_sections
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated can update content" ON public.content_sections
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated can delete content" ON public.content_sections
    FOR DELETE
    TO authenticated
    USING (true);

-- ============ USERS POLICIES ============
-- Authenticated users can read all users
CREATE POLICY "Authenticated can read users" ON public.users
    FOR SELECT
    TO authenticated
    USING (true);

-- Only super_admin can manage users (you'll need to implement this logic in your app)
CREATE POLICY "Authenticated can insert users" ON public.users
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated can update users" ON public.users
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated can delete users" ON public.users
    FOR DELETE
    TO authenticated
    USING (true);

-- ===================================================================
-- SAMPLE DATA
-- ===================================================================

-- Team Members
INSERT INTO public.team_members (name, position, department, phone, email, bio, display_order, is_active) VALUES
('نوح سعيد', 'مدير مشاريع', 'إدارة المشاريع', '770496767', 'noah@alwael.com', 'خبرة 10 سنوات في إدارة المشاريع العقارية والإشراف على تنفيذ المشاريع الكبرى', 1, true),
('أحمد محمد', 'مهندس معماري', 'الهندسة', '773123456', 'ahmed@alwael.com', 'متخصص في التصميم المعماري الحديث والتخطيط العمراني', 2, true),
('فاطمة علي', 'مديرة التسويق', 'التسويق', '775987654', 'fatima@alwael.com', 'خبيرة في التسويق العقاري الرقمي وإدارة العلاقات مع العملاء', 3, true),
('سالم حسن', 'مهندس مدني', 'الهندسة', '777234567', 'salem@alwael.com', 'خبرة في الإشراف على المشاريع الإنشائية والبنية التحتية', 4, true),
('مريم أحمد', 'محاسبة', 'المالية', '779345678', 'maryam@alwael.com', 'متخصصة في المحاسبة المالية وإدارة الميزانيات', 5, true)
ON CONFLICT DO NOTHING;

-- Content Sections
INSERT INTO public.content_sections (section_key, title, content, is_active) VALUES
('hero', 'مؤسسة الوعل للعقارات والمقاولات', 'نبني أحلامكم بخبرة وجودة عالية في المكلا، اليمن', true),
('about', 'من نحن', 'مؤسسة الوعل للعقارات والمقاولات هي شركة رائدة في مجال العقارات والمقاولات في المكلا، اليمن. نقدم خدمات متكاملة من التصميم إلى التنفيذ.', true),
('services', 'خدماتنا', 'نقدم مجموعة واسعة من الخدمات العقارية والإنشائية', true)
ON CONFLICT (section_key) DO NOTHING;

-- Sample Projects
INSERT INTO public.projects (title, description, category, location, area, year, features, status, featured) VALUES
('مجمع سكني فاخر', 'مجمع سكني حديث يحتوي على 50 وحدة سكنية بمواصفات عالية', 'سكني', 'المكلا', '5000 م²', '2024', ARRAY['مسبح', 'حديقة', 'موقف سيارات', 'أمن 24/7'], 'completed', true),
('مبنى تجاري', 'مبنى تجاري متعدد الطوابق في قلب المدينة', 'تجاري', 'المكلا', '3000 م²', '2023', ARRAY['مصاعد حديثة', 'مواقف متعددة', 'أنظمة أمان'], 'completed', true),
('فيلا عصرية', 'فيلا فاخرة بتصميم معماري حديث', 'سكني', 'المكلا', '800 م²', '2024', ARRAY['حديقة خاصة', 'مسبح', 'غرف واسعة'], 'in_progress', false)
ON CONFLICT DO NOTHING;

-- ===================================================================
-- VERIFICATION QUERIES (run these to check)
-- ===================================================================

-- SELECT * FROM public.team_members ORDER BY display_order;
-- SELECT * FROM public.projects ORDER BY created_at DESC;
-- SELECT * FROM public.content_sections ORDER BY section_key;
-- SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename, policyname;
