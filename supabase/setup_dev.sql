-- ===================================================================
-- إعداد قاعدة البيانات - جدول team_members
-- نسخة التطوير: السماح للجميع (غير آمن للإنتاج!)
-- ===================================================================

-- 1. إنشاء الجدول
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

-- 2. إنشاء الفهارس للأداء
CREATE INDEX IF NOT EXISTS idx_team_members_display_order ON public.team_members(display_order);
CREATE INDEX IF NOT EXISTS idx_team_members_is_active ON public.team_members(is_active);

-- 3. تفعيل Row Level Security
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- 4. إنشاء سياسات تسمح للجميع (للتطوير فقط!)
-- ⚠️ تحذير: هذا غير آمن للإنتاج!

-- السماح للجميع بالقراءة
CREATE POLICY "Allow public read" ON public.team_members
    FOR SELECT
    USING (true);

-- السماح للجميع بالإضافة
CREATE POLICY "Allow public insert" ON public.team_members
    FOR INSERT
    WITH CHECK (true);

-- السماح للجميع بالتحديث
CREATE POLICY "Allow public update" ON public.team_members
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- السماح للجميع بالحذف
CREATE POLICY "Allow public delete" ON public.team_members
    FOR DELETE
    USING (true);

-- 5. إنشاء دالة لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. إنشاء Trigger لتحديث updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.team_members
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 7. إضافة بيانات تجريبية
INSERT INTO public.team_members (name, position, department, phone, email, bio, display_order, is_active) VALUES
('نوح سعيد', 'مدير مشاريع', 'إدارة المشاريع', '770496767', 'noah@alwael.com', 'خبرة 10 سنوات في إدارة المشاريع العقارية والإشراف على تنفيذ المشاريع الكبرى', 1, true),
('أحمد محمد', 'مهندس معماري', 'الهندسة', '773123456', 'ahmed@alwael.com', 'متخصص في التصميم المعماري الحديث والتخطيط العمراني', 2, true),
('فاطمة علي', 'مديرة التسويق', 'التسويق', '775987654', 'fatima@alwael.com', 'خبيرة في التسويق العقاري الرقمي وإدارة العلاقات مع العملاء', 3, true),
('سالم حسن', 'مهندس مدني', 'الهندسة', '777234567', 'salem@alwael.com', 'خبرة في الإشراف على المشاريع الإنشائية والبنية التحتية', 4, true),
('مريم أحمد', 'محاسبة', 'المالية', '779345678', 'maryam@alwael.com', 'متخصصة في المحاسبة المالية وإدارة الميزانيات', 5, true)
ON CONFLICT DO NOTHING;

-- ===================================================================
-- تم الإعداد بنجاح!
-- ===================================================================

-- للتحقق من البيانات:
-- SELECT * FROM public.team_members ORDER BY display_order;
