# Script to trigger the first deployment after GitHub Pages activation

Write-Host "🚀 تشغيل النشر الأول..." -ForegroundColor Cyan
Write-Host ""

# Check internet connection
Write-Host "🔍 التحقق من الاتصال بالإنترنت..." -ForegroundColor Yellow
try {
    $null = Test-Connection -ComputerName github.com -Count 1 -ErrorAction Stop
    Write-Host "✅ الاتصال بالإنترنت جيد" -ForegroundColor Green
} catch {
    Write-Host "❌ خطأ: لا يوجد اتصال بالإنترنت" -ForegroundColor Red
    Write-Host "الرجاء التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Create empty commit to trigger deployment
Write-Host "📝 إنشاء commit لتشغيل النشر..." -ForegroundColor Yellow
git commit --allow-empty -m "trigger: تفعيل النشر الأول بعد تفعيل GitHub Pages"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Commit تم بنجاح" -ForegroundColor Green
} else {
    Write-Host "❌ فشل إنشاء commit" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Push to GitHub
Write-Host "🚀 رفع التغييرات إلى GitHub..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ تم الرفع بنجاح!" -ForegroundColor Green
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host "✅ تم تشغيل النشر!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 راقب التقدم من هنا:" -ForegroundColor Yellow
    Write-Host "   https://github.com/24nse/alwael_dashboard/actions"
    Write-Host ""
    Write-Host "⏱️  الوقت المتوقع: 3-5 دقائق" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🌐 بعد اكتمال النشر، افتح:" -ForegroundColor Yellow
    Write-Host "   https://24nse.github.io/alwael_dashboard/"
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
} else {
    Write-Host "❌ فشل الرفع إلى GitHub" -ForegroundColor Red
    Write-Host ""
    Write-Host "الرجاء التحقق من:" -ForegroundColor Yellow
    Write-Host "1. اتصالك بالإنترنت" -ForegroundColor White
    Write-Host "2. أنك مسجل دخول إلى Git" -ForegroundColor White
    Write-Host "3. لديك صلاحيات الكتابة على المستودع" -ForegroundColor White
    exit 1
}
