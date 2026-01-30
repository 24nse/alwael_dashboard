#!/bin/bash

# Script to deploy the auto-deployment setup to GitHub
# This script will commit and push the changes needed for automatic deployment

echo "🚀 Setting up automatic deployment to GitHub Pages..."
echo ""

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo "❌ Error: Not a git repository"
    exit 1
fi

# Show current status
echo "📊 Current git status:"
git status --short
echo ""

# Add all changes
echo "📦 Adding changes..."
git add .github/workflows/deploy.yml DEPLOYMENT_GUIDE.md
echo "✅ Changes added"
echo ""

# Commit changes
echo "💾 Committing changes..."
git commit -m "feat: تحديث النشر التلقائي مع دعم متغيرات البيئة

- إضافة متغيرات البيئة لـ Supabase في سير العمل
- تحديث دليل النشر مع تعليمات إضافة GitHub Secrets
- دعم النشر التلقائي الكامل بدون تدخل يدوي"
echo "✅ Changes committed"
echo ""

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push origin main
echo "✅ Changes pushed successfully!"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Go to: https://github.com/24nse/alwael_dashboard/settings/secrets/actions"
echo "2. Add these secrets:"
echo "   - VITE_SUPABASE_URL"
echo "   - VITE_SUPABASE_ANON_KEY"
echo "3. Go to: https://github.com/24nse/alwael_dashboard/settings/pages"
echo "4. Set Source to: GitHub Actions"
echo "5. Wait 2-5 minutes for deployment"
echo "6. Visit: https://24nse.github.io/alwael_dashboard/"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT_GUIDE.md"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
