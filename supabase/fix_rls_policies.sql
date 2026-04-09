-- ===================================================================
-- إصلاح مشكلة RLS - السماح للجميع بالكتابة
-- ===================================================================

-- 1. حذف جميع السياسات القديمة
DROP POLICY IF EXISTS "Allow public read" ON public.team_members;
DROP POLICY IF EXISTS "Allow public insert" ON public.team_members;
DROP POLICY IF EXISTS "Allow public update" ON public.team_members;
DROP POLICY IF EXISTS "Allow public delete" ON public.team_members;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.team_members;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.team_members;
DROP POLICY IF EXISTS "Allow authenticated delete" ON public.team_members;

-- 2. إنشاء سياسات جديدة تسمح للجميع
-- ⚠️ للتطوير فقط!

-- السماح للجميع بالقراءة
CREATE POLICY "Enable read access for all users" ON public.team_members
    FOR SELECT
    USING (true);

-- السماح للجميع بالإضافة
CREATE POLICY "Enable insert for all users" ON public.team_members
    FOR INSERT
    WITH CHECK (true);

-- السماح للجميع بالتحديث
CREATE POLICY "Enable update for all users" ON public.team_members
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- السماح للجميع بالحذف
CREATE POLICY "Enable delete for all users" ON public.team_members
    FOR DELETE
    USING (true);

-- 3. التحقق من أن RLS مُفعّل
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- ===================================================================
-- تم! الآن يجب أن يعمل الإضافة والتعديل من الموقع
-- ===================================================================

-- للتحقق من السياسات:
-- SELECT * FROM pg_policies WHERE tablename = 'team_members';
