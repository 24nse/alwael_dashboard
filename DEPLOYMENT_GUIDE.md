# دليل النشر التلقائي على GitHub Pages

## ✅ ما تم إعداده

تم إعداد جميع الملفات المطلوبة للنشر التلقائي:

1. ✅ `.github/workflows/deploy.yml` - ملف GitHub Actions
2. ✅ `vite.config.ts` - تم إضافة base path
3. ✅ `public/.nojekyll` - لتعطيل Jekyll
4. ✅ `README.md` - تم التحديث مع التعليمات

## 📋 خطوات التفعيل (مرة واحدة فقط)

### 1. رفع التغييرات إلى GitHub

إذا لم يتم رفع التغييرات بعد، قم بتنفيذ الأوامر التالية:

\`\`\`bash
# التأكد من حفظ جميع التغييرات
git add .
git commit -m "feat: إضافة النشر التلقائي على GitHub Pages"
git push origin main
\`\`\`

### 2. تفعيل GitHub Pages

1. اذهب إلى مستودع GitHub: https://github.com/24nse/alwael_dashboard
2. اضغط على **Settings** (الإعدادات)
3. في القائمة الجانبية، اختر **Pages**
4. في قسم **Source** (المصدر):
   - اختر **GitHub Actions**
5. احفظ التغييرات

### 3. انتظر اكتمال النشر

- بعد الخطوة السابقة، سيبدأ GitHub Actions تلقائياً في بناء ونشر الموقع
- يمكنك متابعة التقدم من تبويب **Actions** في المستودع
- عادة يستغرق 2-5 دقائق

### 4. الوصول إلى الموقع

بعد اكتمال النشر، سيكون الموقع متاحاً على:

**🌐 https://24nse.github.io/alwael_dashboard/**

## 🔄 النشر التلقائي

من الآن فصاعداً، أي تغيير تقوم به وترفعه إلى branch `main` سيتم نشره تلقائياً!

\`\`\`bash
# مثال: تعديل ملف
# ... قم بالتعديلات ...

# حفظ ورفع التغييرات
git add .
git commit -m "وصف التغييرات"
git push origin main

# ✅ سيتم النشر تلقائياً!
\`\`\`

## 🛠️ استكشاف الأخطاء

### إذا فشل النشر:

1. اذهب إلى تبويب **Actions** في GitHub
2. اضغط على آخر workflow run
3. تحقق من الأخطاء في السجلات

### المشاكل الشائعة:

#### الموقع لا يعمل (404)
- تأكد من تفعيل GitHub Pages من الإعدادات
- تأكد من اختيار **GitHub Actions** كمصدر

#### الموقع يظهر بدون تنسيق
- تأكد من أن `base` في `vite.config.ts` يطابق اسم المستودع
- يجب أن يكون: `base: '/alwael_dashboard/'`

#### فشل البناء
- تحقق من أن جميع المكتبات مثبتة بشكل صحيح
- تأكد من عدم وجود أخطاء في الكود

## 📊 مراقبة النشر

يمكنك مراقبة حالة النشر من:

1. **تبويب Actions**: https://github.com/24nse/alwael_dashboard/actions
2. **تبويب Deployments**: https://github.com/24nse/alwael_dashboard/deployments

## 🎯 الميزات

- ✅ نشر تلقائي عند كل push
- ✅ بناء سريع باستخدام Vite
- ✅ دعم TypeScript و React
- ✅ تحسين للإنتاج تلقائياً
- ✅ دعم الروابط المباشرة (SPA)

## 📝 ملاحظات مهمة

1. **الفرع الرئيسي**: النشر يحدث فقط عند الـ push إلى `main` أو `master`
2. **الوقت**: عادة يستغرق النشر 2-5 دقائق
3. **التكلفة**: GitHub Pages مجاني تماماً للمستودعات العامة
4. **الحد الأقصى**: 1 GB للموقع، 100 GB نطاق ترددي شهرياً

## 🔗 روابط مفيدة

- [توثيق GitHub Pages](https://docs.github.com/en/pages)
- [توثيق GitHub Actions](https://docs.github.com/en/actions)
- [توثيق Vite](https://vitejs.dev/guide/static-deploy.html#github-pages)

---

**آخر تحديث**: 2026-01-28
