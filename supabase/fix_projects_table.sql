-- ===================================================================
-- إصلاح سريع: إنشاء جداول المشاريع في Supabase
-- ===================================================================
-- هذا السكريبت يحل مشكلة عدم إضافة المشاريع
-- السبب: الجداول غير موجودة أو السياسات تمنع الإضافة
-- ===================================================================

-- 1. إنشاء جدول المشاريع
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    area TEXT,
    year TEXT,
    features TEXT[],
    status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'completed', 'on_hold')),
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. إنشاء جدول صور المشاريع
CREATE TABLE IF NOT EXISTS public.project_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. إنشاء الفهارس للأداء
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON public.project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_project_images_display_order ON public.project_images(display_order);

-- 4. إنشاء دالة تحديث updated_at (إذا لم تكن موجودة)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. إنشاء Trigger لتحديث updated_at تلقائياً
DROP TRIGGER IF EXISTS set_updated_at ON public.projects;
CREATE TRIGGER set_updated_at 
    BEFORE UPDATE ON public.projects 
    FOR EACH ROW 
    EXECUTE FUNCTION public.handle_updated_at();

-- 6. تفعيل Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;

-- 7. حذف السياسات القديمة (إذا كانت موجودة)
DROP POLICY IF EXISTS "Public can read projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated can update projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated can delete projects" ON public.projects;
DROP POLICY IF EXISTS "Public can read project images" ON public.project_images;
DROP POLICY IF EXISTS "Authenticated can insert project images" ON public.project_images;
DROP POLICY IF EXISTS "Authenticated can update project images" ON public.project_images;
DROP POLICY IF EXISTS "Authenticated can delete project images" ON public.project_images;

-- 8. إنشاء سياسات جديدة تسمح للجميع (للتطوير فقط!)
-- ⚠️ تحذير: هذا غير آمن للإنتاج! استخدمه فقط للتطوير والاختبار

-- سياسات جدول projects
CREATE POLICY "Allow public read projects" ON public.projects
    FOR SELECT
    USING (true);

CREATE POLICY "Allow public insert projects" ON public.projects
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public update projects" ON public.projects
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow public delete projects" ON public.projects
    FOR DELETE
    USING (true);

-- سياسات جدول project_images
CREATE POLICY "Allow public read project images" ON public.project_images
    FOR SELECT
    USING (true);

CREATE POLICY "Allow public insert project images" ON public.project_images
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public update project images" ON public.project_images
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow public delete project images" ON public.project_images
    FOR DELETE
    USING (true);

-- 9. إضافة بيانات تجريبية
INSERT INTO public.projects (title, description, category, location, area, year, features, status, featured) VALUES
('مجمع سكني فاخر', 'مجمع سكني حديث يحتوي على 50 وحدة سكنية بمواصفات عالية', 'مجمعات سكنية', 'المكلا', '5000 م²', '2024', ARRAY['مسبح', 'حديقة', 'موقف سيارات', 'أمن 24/7'], 'completed', true),
('مبنى تجاري', 'مبنى تجاري متعدد الطوابق في قلب المدينة', 'تجاري', 'المكلا', '3000 م²', '2023', ARRAY['مصاعد حديثة', 'مواقف متعددة', 'أنظمة أمان'], 'completed', true),
('فيلا عصرية', 'فيلا فاخرة بتصميم معماري حديث', 'فلل', 'المكلا', '800 م²', '2024', ARRAY['حديقة خاصة', 'مسبح', 'غرف واسعة'], 'in_progress', false)
ON CONFLICT DO NOTHING;

-- ===================================================================
-- ✅ تم الإعداد بنجاح!
-- ===================================================================

-- للتحقق من النجاح، شغل هذه الاستعلامات:

-- 1. تحقق من وجود الجداول
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('projects', 'project_images')
ORDER BY table_name;

-- 2. تحقق من البيانات
SELECT id, title, category, status, featured, created_at 
FROM public.projects 
ORDER BY created_at DESC;

-- 3. تحقق من السياسات
SELECT 
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('projects', 'project_images')
ORDER BY tablename, policyname;

-- 4. عدد الصفوف
SELECT 
    'projects' as table_name, 
    COUNT(*) as row_count 
FROM public.projects
UNION ALL
SELECT 
    'project_images' as table_name, 
    COUNT(*) as row_count 
FROM public.project_images;
