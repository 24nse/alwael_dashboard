# Script to deploy the auto-deployment setup to GitHub
# This script will commit and push the changes needed for automatic deployment

Write-Host "🚀 Setting up automatic deployment to GitHub Pages..." -ForegroundColor Cyan
Write-Host ""

# Check if we're in a git repository
if (-not (Test-Path .git)) {
    Write-Host "❌ Error: Not a git repository" -ForegroundColor Red
    exit 1
}

# Show current status
Write-Host "📊 Current git status:" -ForegroundColor Yellow
git status --short
Write-Host ""

# Add all changes
Write-Host "📦 Adding changes..." -ForegroundColor Yellow
git add .github/workflows/deploy.yml DEPLOYMENT_GUIDE.md
Write-Host "✅ Changes added" -ForegroundColor Green
Write-Host ""

# Commit changes
Write-Host "💾 Committing changes..." -ForegroundColor Yellow
git commit -m "feat: تحديث النشر التلقائي مع دعم متغيرات البيئة

- إضافة متغيرات البيئة لـ Supabase في سير العمل
- تحديث دليل النشر مع تعليمات إضافة GitHub Secrets
- دعم النشر التلقائي الكامل بدون تدخل يدوي"
Write-Host "✅ Changes committed" -ForegroundColor Green
Write-Host ""

# Push to GitHub
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Yellow
git push origin main
Write-Host "✅ Changes pushed successfully!" -ForegroundColor Green
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "1. Go to: https://github.com/24nse/alwael_dashboard/settings/secrets/actions"
Write-Host "2. Add these secrets:"
Write-Host "   - VITE_SUPABASE_URL"
Write-Host "   - VITE_SUPABASE_ANON_KEY"
Write-Host "3. Go to: https://github.com/24nse/alwael_dashboard/settings/pages"
Write-Host "4. Set Source to: GitHub Actions"
Write-Host "5. Wait 2-5 minutes for deployment"
Write-Host "6. Visit: https://24nse.github.io/alwael_dashboard/"
Write-Host ""
Write-Host "📖 For detailed instructions, see DEPLOYMENT_GUIDE.md" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
