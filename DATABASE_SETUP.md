# 🗄️ دليل إعداد قاعدة البيانات Supabase

## ❌ المشكلة الحالية

عند محاولة إضافة عضو في فريق العمل، تظهر رسالة خطأ:
```
خطأ - حدث خطأ أثناء حفظ البيانات
```

### 🔍 السبب

**قاعدة البيانات في Supabase فارغة!**

التطبيق يحاول الكتابة إلى جدول `team_members` لكن الجدول **غير موجود**.

---

## ✅ الحل: إنشاء الجداول في Supabase

### الخطوة 1: افتح Supabase SQL Editor

1. اذهب إلى: https://supabase.com/dashboard
2. اختر مشروعك (الذي يحتوي على URL: `ivwquhueduywrwotatxd.supabase.co`)
3. من القائمة الجانبية، اختر **SQL Editor**

---

### الخطوة 2: نفّذ SQL Script

انسخ والصق الكود التالي في SQL Editor:

```sql
-- Create team_members table
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_team_members_display_order ON public.team_members(display_order);
CREATE INDEX IF NOT EXISTS idx_team_members_is_active ON public.team_members(is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access" ON public.team_members
    FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated insert" ON public.team_members
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON public.team_members
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated delete" ON public.team_members
    FOR DELETE
    TO authenticated
    USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.team_members
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample data
INSERT INTO public.team_members (name, position, department, phone, email, bio, display_order) VALUES
('نوح سعيد', 'مدير مشاريع', 'إدارة المشاريع', '770496767', 'aad@alwael.com', 'خبرة 10 سنوات في إدارة المشاريع العقارية', 1),
('أحمد محمد', 'مهندس معماري', 'الهندسة', '773123456', 'ahmed@alwael.com', 'متخصص في التصميم المعماري الحديث', 2),
('فاطمة علي', 'مديرة التسويق', 'التسويق', '775987654', 'fatima@alwael.com', 'خبيرة في التسويق العقاري الرقمي', 3)
ON CONFLICT DO NOTHING;
```

---

### الخطوة 3: تشغيل السكريبت

1. اضغط على زر **Run** (أو Ctrl+Enter)
2. انتظر حتى ترى رسالة **Success**

---

### الخطوة 4: التحقق من الجدول

1. من القائمة الجانبية، اختر **Table Editor**
2. يجب أن ترى جدول `team_members`
3. يجب أن ترى 3 صفوف من البيانات التجريبية

---

## 🔐 شرح Row Level Security (RLS)

السكريبت يُفعّل RLS مع السياسات التالية:

### 1. القراءة (SELECT)
```sql
"Allow public read access"
```
- **من يمكنه:** الجميع (حتى غير المسجلين)
- **ماذا:** قراءة جميع البيانات
- **لماذا:** لعرض فريق العمل في الموقع العام

### 2. الإضافة (INSERT)
```sql
"Allow authenticated insert"
```
- **من يمكنه:** المستخدمون المسجلون فقط
- **ماذا:** إضافة أعضاء جدد
- **لماذا:** لحماية البيانات من الإضافات غير المصرح بها

### 3. التحديث (UPDATE)
```sql
"Allow authenticated update"
```
- **من يمكنه:** المستخدمون المسجلون فقط
- **ماذا:** تعديل بيانات الأعضاء
- **لماذا:** لحماية البيانات من التعديلات غير المصرح بها

### 4. الحذف (DELETE)
```sql
"Allow authenticated delete"
```
- **من يمكنه:** المستخدمون المسجلون فقط
- **ماذا:** حذف أعضاء
- **لماذا:** لحماية البيانات من الحذف غير المصرح به

---

## ⚠️ مشكلة: "Allow authenticated" لكن لا يوجد تسجيل دخول!

### المشكلة الحالية

السياسات تطلب `authenticated` (مستخدم مسجل)، لكن التطبيق **لا يوجد به نظام تسجيل دخول فعلي**!

### الحل المؤقت: تغيير السياسات للسماح للجميع

إذا كنت تريد السماح للجميع بالإضافة/التعديل/الحذف (للتطوير فقط):

```sql
-- حذف السياسات القديمة
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.team_members;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.team_members;
DROP POLICY IF EXISTS "Allow authenticated delete" ON public.team_members;

-- إنشاء سياسات جديدة تسمح للجميع
CREATE POLICY "Allow public insert" ON public.team_members
    FOR INSERT
    USING (true);

CREATE POLICY "Allow public update" ON public.team_members
    FOR UPDATE
    USING (true);

CREATE POLICY "Allow public delete" ON public.team_members
    FOR DELETE
    USING (true);
```

⚠️ **تحذير:** هذا **غير آمن** للإنتاج! استخدمه فقط للتطوير والاختبار.

---

### الحل الدائم: إضافة نظام تسجيل دخول

لاحقاً، يجب إضافة:
1. نظام تسجيل دخول باستخدام Supabase Auth
2. حماية صفحات الإدارة
3. التحقق من الصلاحيات

---

## 📊 بنية الجدول

| العمود | النوع | الوصف |
|--------|------|-------|
| `id` | UUID | معرّف فريد (يُنشأ تلقائياً) |
| `name` | TEXT | اسم العضو |
| `position` | TEXT | المنصب |
| `department` | TEXT | القسم |
| `phone` | TEXT | رقم الهاتف |
| `email` | TEXT | البريد الإلكتروني |
| `image_url` | TEXT | رابط الصورة |
| `bio` | TEXT | نبذة عن العضو |
| `is_active` | BOOLEAN | نشط/غير نشط |
| `display_order` | INTEGER | ترتيب العرض |
| `created_at` | TIMESTAMP | تاريخ الإنشاء |
| `updated_at` | TIMESTAMP | تاريخ آخر تحديث |

---

## 🧪 اختبار بعد الإعداد

1. افتح الموقع: https://24nse.github.io/alwael_dashboard/admin/team
2. اضغط على "إضافة عضو جديد"
3. املأ البيانات
4. اضغط "إضافة العضو"
5. يجب أن يُضاف العضو بنجاح! ✅

---

## 📝 ملاحظات مهمة

### 1. البيانات التجريبية
السكريبت يُضيف 3 أعضاء تجريبيين. يمكنك حذفهم أو تعديلهم لاحقاً.

### 2. الصور
حقل `image_url` يقبل روابط الصور. يمكنك:
- استخدام روابط خارجية
- رفع الصور إلى Supabase Storage
- استخدام خدمة مثل Cloudinary

### 3. الترتيب
حقل `display_order` يحدد ترتيب ظهور الأعضاء. الأرقام الأصغر تظهر أولاً.

### 4. التحديث التلقائي
حقل `updated_at` يُحدّث تلقائياً عند كل تعديل بفضل الـ Trigger.

---

## 🆘 استكشاف الأخطاء

### الخطأ: "permission denied for table team_members"
**الحل:** تأكد من تشغيل سياسات RLS

### الخطأ: "relation team_members does not exist"
**الحل:** تأكد من تشغيل السكريبت في SQL Editor

### الخطأ: "new row violates row-level security policy"
**الحل:** استخدم الحل المؤقت أعلاه (السماح للجميع)

---

## 📚 الخطوات التالية

بعد إنشاء جدول `team_members`، ستحتاج لإنشاء جداول أخرى:

1. `orders` - للطلبات
2. `consultations` - للاستشارات
3. `projects` - للمشاريع
4. `content` - للمحتوى
5. `settings` - للإعدادات

يمكنني مساعدتك في إنشاء هذه الجداول لاحقاً!

---

**تاريخ الإنشاء:** 2026-01-30
**الحالة:** في انتظار تنفيذ SQL Script
