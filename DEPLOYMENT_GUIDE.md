# 🚀 دليل النشر التلقائي الكامل على GitHub Pages

## ✅ الملفات المُعدّة

جميع الملفات التقنية جاهزة:

1. ✅ `.github/workflows/deploy.yml` - سير عمل GitHub Actions
2. ✅ `vite.config.ts` - مسار القاعدة للنشر
3. ✅ `public/.nojekyll` - تعطيل Jekyll
4. ✅ متغيرات البيئة مُضافة للسير

---

## 📋 خطوات التفعيل (مرة واحدة فقط)

### الخطوة 1️⃣: إضافة أسرار GitHub (Secrets)

هذه الخطوة **ضرورية جداً** لعمل Supabase في الموقع المنشور!

1. اذهب إلى مستودع GitHub: https://github.com/24nse/alwael_dashboard
2. اضغط على **Settings** (الإعدادات)
3. في القائمة الجانبية، اختر **Secrets and variables** → **Actions**
4. اضغط على **New repository secret**
5. أضف السرّين التاليين:

   **السر الأول:**
   - Name: `VITE_SUPABASE_URL`
   - Secret: `https://ivwquhueduywrwotatxd.supabase.co`
   - اضغط **Add secret**

   **السر الثاني:**
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Secret: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2d3F1aHVlZHV5d3J3b3RhdHhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MTUyMjAsImV4cCI6MjA4NTI5MTIyMH0.9TyBVpUHUu9TGnFG6M16OAU6Q_E6KtYsb2XChIG9JD0`
   - اضغط **Add secret**

### الخطوة 2️⃣: رفع التغييرات إلى GitHub

قم بتنفيذ الأوامر التالية لرفع التحديثات:

```bash
git add .
git commit -m "feat: تحديث سير النشر التلقائي مع متغيرات البيئة"
git push origin main
```

### الخطوة 3️⃣: تفعيل GitHub Pages

1. اذهب إلى **Settings** في المستودع
2. في القائمة الجانبية، اختر **Pages**
3. في قسم **Source** (المصدر):
   - اختر **GitHub Actions**
4. احفظ التغييرات

### الخطوة 4️⃣: انتظر اكتمال النشر

- بعد الخطوة السابقة، سيبدأ GitHub Actions تلقائياً
- اذهب إلى تبويب **Actions** لمتابعة التقدم
- عادة يستغرق 2-5 دقائق

### الخطوة 5️⃣: الوصول إلى الموقع

بعد اكتمال النشر، سيكون الموقع متاحاً على:

**🌐 https://24nse.github.io/alwael_dashboard/**

---

## 🔄 النشر التلقائي (بدون تدخل يدوي)

من الآن فصاعداً، **أي تغيير** تقوم به وترفعه إلى `main` سيتم نشره **تلقائياً**!

```bash
# مثال: تعديل ملف
# ... قم بالتعديلات ...

# حفظ ورفع التغييرات
git add .
git commit -m "وصف التغييرات"
git push origin main

# ✅ سيتم النشر تلقائياً في 2-5 دقائق!
```

**لا حاجة لأي تدخل يدوي!** GitHub Actions سيقوم بـ:
1. ✅ تثبيت المكتبات
2. ✅ بناء المشروع
3. ✅ نشره على GitHub Pages
4. ✅ تحديث الموقع المباشر

---

## 🛠️ استكشاف الأخطاء

### المشكلة: فشل النشر

**الحل:**
1. اذهب إلى تبويب **Actions**: https://github.com/24nse/alwael_dashboard/actions
2. اضغط على آخر workflow run (الأحمر ❌)
3. تحقق من الأخطاء في السجلات
4. الأخطاء الشائعة:
   - أخطاء في الكود → أصلح الكود وارفع مرة أخرى
   - مكتبات ناقصة → تأكد من `package.json`

### المشكلة: الموقع لا يعمل (404)

**الحل:**
- تأكد من تفعيل GitHub Pages من Settings → Pages
- تأكد من اختيار **GitHub Actions** كمصدر
- انتظر 5-10 دقائق بعد أول نشر

### المشكلة: الموقع يظهر بدون تنسيق

**الحل:**
- تأكد من أن `base` في `vite.config.ts` يطابق اسم المستودع
- يجب أن يكون: `base: '/alwael_dashboard/'`

### المشكلة: Supabase لا يعمل في الموقع المنشور

**الحل:**
- تأكد من إضافة الأسرار في GitHub (الخطوة 1️⃣)
- تحقق من أن أسماء الأسرار صحيحة:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- أعد النشر بعد إضافة الأسرار

---

## 📊 مراقبة النشر

يمكنك مراقبة حالة النشر من:

1. **تبويب Actions**: https://github.com/24nse/alwael_dashboard/actions
   - ✅ أخضر = نجح النشر
   - ❌ أحمر = فشل النشر
   - 🟡 أصفر = جاري النشر

2. **تبويب Deployments**: https://github.com/24nse/alwael_dashboard/deployments
   - يعرض تاريخ جميع عمليات النشر

---

## 🎯 الميزات المُفعّلة

- ✅ نشر تلقائي عند كل `git push`
- ✅ بناء سريع باستخدام Vite
- ✅ دعم TypeScript و React
- ✅ دعم Supabase في الإنتاج
- ✅ تحسين للإنتاج تلقائياً
- ✅ دعم الروابط المباشرة (SPA)
- ✅ تحديث فوري للموقع المباشر

---

## 📝 ملاحظات مهمة

1. **الفرع الرئيسي**: النشر يحدث فقط عند الـ push إلى `main` أو `master`
2. **الوقت**: عادة يستغرق النشر 2-5 دقائق
3. **التكلفة**: GitHub Pages مجاني تماماً للمستودعات العامة
4. **الحد الأقصى**: 1 GB للموقع، 100 GB نطاق ترددي شهرياً
5. **الأمان**: الأسرار (Secrets) مشفرة ولا تظهر في السجلات

---

## 🔗 روابط مفيدة

- [توثيق GitHub Pages](https://docs.github.com/en/pages)
- [توثيق GitHub Actions](https://docs.github.com/en/actions)
- [توثيق GitHub Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [توثيق Vite](https://vitejs.dev/guide/static-deploy.html#github-pages)

---

## 🎉 ملخص سريع

**للبدء:**
1. أضف الأسرار في GitHub Settings → Secrets
2. ارفع التغييرات: `git push origin main`
3. فعّل GitHub Pages من Settings → Pages → GitHub Actions
4. انتظر 5 دقائق
5. افتح: https://24nse.github.io/alwael_dashboard/

**للتحديثات المستقبلية:**
```bash
git add .
git commit -m "رسالة التحديث"
git push origin main
# ✅ تم! سيُنشر تلقائياً
```

---

**آخر تحديث**: 2026-01-30
**الحالة**: ✅ جاهز للنشر التلقائي الكامل
