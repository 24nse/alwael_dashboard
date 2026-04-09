# 🚨 إصلاح سريع: مشكلة عدم إضافة المشاريع

## المشكلة
عند إضافة مشروع جديد، لا يتم حفظه في قاعدة البيانات.

## السبب
**جداول المشاريع غير موجودة في Supabase!**

---

## ✅ الحل (3 خطوات بسيطة)

### الخطوة 1: افتح Supabase SQL Editor
👉 https://supabase.com/dashboard/project/ivwquhueduywrwotatxd/sql

### الخطوة 2: انسخ والصق السكريبت
افتح الملف: `supabase/fix_projects_table.sql`

**أو** انسخ من هنا:
```sql
-- انسخ المحتوى من supabase/fix_projects_table.sql
```

### الخطوة 3: اضغط Run
اضغط زر **Run** (أو Ctrl+Enter)

---

## ✅ التحقق من النجاح

### 1. في Supabase Table Editor
اذهب إلى: https://supabase.com/dashboard/project/ivwquhueduywrwotatxd/editor

يجب أن ترى:
- ✅ جدول `projects`
- ✅ جدول `project_images`
- ✅ 3 مشاريع تجريبية

### 2. في التطبيق
1. افتح: https://24nse.github.io/alwael_dashboard/admin/projects
2. يجب أن ترى 3 مشاريع تجريبية
3. اضغط "إضافة مشروع"
4. املأ البيانات
5. اضغط "إضافة المشروع"
6. ✅ يجب أن يعمل الآن!

---

## 🔍 إذا لم يعمل

### تحقق من الأخطاء في Console
1. افتح المتصفح
2. اضغط F12
3. اذهب إلى تبويب Console
4. حاول إضافة مشروع
5. ابحث عن رسائل الخطأ باللون الأحمر

### الأخطاء الشائعة وحلولها

#### خطأ: "relation projects does not exist"
**الحل:** الجدول غير موجود، نفّذ السكريبت مرة أخرى

#### خطأ: "new row violates row-level security policy"
**الحل:** السياسات تمنع الإضافة، نفّذ هذا في SQL Editor:
```sql
DROP POLICY IF EXISTS "Authenticated can insert projects" ON public.projects;
CREATE POLICY "Allow public insert projects" ON public.projects
    FOR INSERT
    WITH CHECK (true);
```

#### خطأ: "null value in column violates not-null constraint"
**الحل:** تأكد من ملء جميع الحقول المطلوبة:
- اسم المشروع
- الوصف
- الفئة
- الموقع

---

## 📚 للمزيد من التفاصيل

راجع: `PROJECT_INSERT_ANALYSIS.md`

---

**الحالة:** في انتظار تنفيذ SQL Script
**التاريخ:** 2026-02-15
