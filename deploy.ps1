# ============================================================
# deploy.ps1 - Automated Deployment Script for Al-Wael Dashboard
# ============================================================
# Usage: npm run deploy   (or .\deploy.ps1 directly)
# ============================================================

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "   Al-Wael Dashboard - Auto Deploy     " -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# --- 1. Stage all changes ---
Write-Host ">> Staging all changes..." -ForegroundColor Yellow
git add -A
if ($LASTEXITCODE -ne 0) { Write-Host "ERROR: git add failed" -ForegroundColor Red; exit 1 }

# --- 2. Check if there's anything to commit ---
$status = git status --porcelain
if (-not $status) {
    Write-Host ">> Nothing to commit. Pushing latest to GitHub anyway..." -ForegroundColor DarkYellow
} else {
    # Build a commit message with timestamp
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
    $commitMsg = "deploy: update dashboard [$timestamp]"

    Write-Host ">> Committing: $commitMsg" -ForegroundColor Yellow
    git commit -m $commitMsg
    if ($LASTEXITCODE -ne 0) { Write-Host "ERROR: git commit failed" -ForegroundColor Red; exit 1 }
}

# --- 3. Push to GitHub ---
Write-Host ">> Pushing to GitHub (main)..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host ">> Trying 'master' branch..." -ForegroundColor DarkYellow
    git push origin master
    if ($LASTEXITCODE -ne 0) { Write-Host "ERROR: git push failed" -ForegroundColor Red; exit 1 }
}

# --- 4. Done! ---
Write-Host ""
Write-Host "=======================================" -ForegroundColor Green
Write-Host "   Deployment triggered successfully!  " -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
Write-Host ""
Write-Host ">> GitHub Actions is now building your dashboard." -ForegroundColor Cyan
Write-Host ">> Check progress at:" -ForegroundColor Cyan
Write-Host "   https://github.com/24nse/alwael_dashboard/actions" -ForegroundColor White
Write-Host ""
Write-Host ">> Your live dashboard will be available at:" -ForegroundColor Cyan
Write-Host "   https://24nse.github.io/alwael_dashboard/" -ForegroundColor White
Write-Host ""
Write-Host ">> Wait 2-3 minutes, then visit the URL above." -ForegroundColor DarkCyan
Write-Host ""

# Optionally open the Actions page in browser
$openBrowser = Read-Host "Open GitHub Actions in browser? (y/N)"
if ($openBrowser -eq 'y' -or $openBrowser -eq 'Y') {
    Start-Process "https://github.com/24nse/alwael_dashboard/actions"
}
