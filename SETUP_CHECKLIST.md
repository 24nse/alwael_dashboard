# ✅ قائمة التحقق من النشر التلقائي

## 📝 الخطوات المطلوبة

### ✅ تم بالفعل (لا تحتاج لفعل شيء)

- [x] إنشاء ملف `.github/workflows/deploy.yml`
- [x] إضافة متغيرات البيئة في سير العمل
- [x] تكوين `vite.config.ts` مع المسار الصحيح
- [x] إنشاء ملف `.nojekyll` في مجلد `public`
- [x] تحديث دليل النشر `DEPLOYMENT_GUIDE.md`

### 🔲 خطوات يجب عليك القيام بها

#### الخطوة 1: رفع التغييرات إلى GitHub

قم بتشغيل أحد الأوامر التالية:

**باستخدام PowerShell (موصى به لـ Windows):**
```powershell
.\deploy-setup.ps1
```

**أو يدوياً:**
```bash
git add .
git commit -m "feat: إعداد النشر التلقائي الكامل"
git push origin main
```

- [ ] تم رفع التغييرات إلى GitHub

---

#### الخطوة 2: إضافة أسرار GitHub (Secrets)

**مهم جداً:** بدون هذه الخطوة، لن يعمل Supabase في الموقع المنشور!

1. اذهب إلى: https://github.com/24nse/alwael_dashboard/settings/secrets/actions
2. اضغط على **New repository secret**
3. أضف السر الأول:
   - **Name:** `VITE_SUPABASE_URL`
   - **Secret:** `https://ivwquhueduywrwotatxd.supabase.co`
   - اضغط **Add secret**
4. أضف السر الثاني:
   - **Name:** `VITE_SUPABASE_ANON_KEY`
   - **Secret:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2d3F1aHVlZHV5d3J3b3RhdHhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MTUyMjAsImV4cCI6MjA4NTI5MTIyMH0.9TyBVpUHUu9TGnFG6M16OAU6Q_E6KtYsb2XChIG9JD0`
   - اضغط **Add secret**

- [ ] تم إضافة `VITE_SUPABASE_URL`
- [ ] تم إضافة `VITE_SUPABASE_ANON_KEY`

---

#### الخطوة 3: تفعيل GitHub Pages

1. اذهب إلى: https://github.com/24nse/alwael_dashboard/settings/pages
2. في قسم **Source** (المصدر):
   - اختر **GitHub Actions** من القائمة المنسدلة
3. احفظ التغييرات (إن وُجدت)

- [ ] تم تفعيل GitHub Pages مع GitHub Actions

---

#### الخطوة 4: مراقبة النشر

1. اذهب إلى: https://github.com/24nse/alwael_dashboard/actions
2. انتظر حتى يكتمل سير العمل (2-5 دقائق)
3. تأكد من ظهور علامة ✅ خضراء

- [ ] اكتمل النشر بنجاح

---

#### الخطوة 5: اختبار الموقع

1. افتح: https://24nse.github.io/alwael_dashboard/
2. تأكد من:
   - [ ] الموقع يعمل بشكل صحيح
   - [ ] التنسيق يظهر بشكل صحيح
   - [ ] Supabase يعمل (جرب تسجيل الدخول)
   - [ ] جميع الصفحات تعمل

---

## 🎉 اكتمل الإعداد!

إذا أكملت جميع الخطوات أعلاه، فإن النشر التلقائي الآن **مُفعّل بالكامل**!

### ماذا يحدث الآن؟

من الآن فصاعداً، **أي تغيير** تقوم به وترفعه إلى GitHub سيتم نشره **تلقائياً**:

```bash
# قم بالتعديلات...
git add .
git commit -m "وصف التغييرات"
git push origin main

# ✅ سيُنشر تلقائياً في 2-5 دقائق!
```

**لا حاجة لأي تدخل يدوي!** 🚀

---

## 🆘 هل تحتاج مساعدة؟

راجع `DEPLOYMENT_GUIDE.md` للحصول على:
- تعليمات مفصلة
- استكشاف الأخطاء وحلها
- روابط مفيدة

---

## 📊 روابط سريعة

- **الموقع المباشر:** https://24nse.github.io/alwael_dashboard/
- **GitHub Actions:** https://github.com/24nse/alwael_dashboard/actions
- **GitHub Secrets:** https://github.com/24nse/alwael_dashboard/settings/secrets/actions
- **GitHub Pages:** https://github.com/24nse/alwael_dashboard/settings/pages
- **Deployments:** https://github.com/24nse/alwael_dashboard/deployments

---

**تاريخ الإنشاء:** 2026-01-30
