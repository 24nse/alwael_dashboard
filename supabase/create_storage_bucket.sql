-- ===================================================================
-- إنشاء Supabase Storage Bucket لصور المشاريع
-- ===================================================================
-- شغّل هذا السكريبت في Supabase SQL Editor
-- ===================================================================

-- 1. إنشاء الـ bucket (إذا لم يكن موجوداً)
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. سياسة القراءة العامة (أي شخص يمكنه رؤية الصور)
CREATE POLICY "Public can view project images"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-images');

-- 3. سياسة الرفع (مسموح للجميع - للتطوير فقط)
-- ⚠️ في الإنتاج: استبدل بـ auth.role() = 'authenticated'
CREATE POLICY "Anyone can upload project images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'project-images');

-- 4. سياسة الحذف (مسموح للجميع - للتطوير فقط)
CREATE POLICY "Anyone can delete project images"
ON storage.objects FOR DELETE
USING (bucket_id = 'project-images');

-- ===================================================================
-- ✅ للتحقق من نجاح الإنشاء:
-- SELECT * FROM storage.buckets WHERE id = 'project-images';
-- ===================================================================
