# EcoAnalyzer AI Deployment Script for Windows PowerShell
# This script helps deploy both frontend and backend

Write-Host "🚀 EcoAnalyzer AI Deployment Script" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "⚠️  Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
}

# Check if Node.js is installed
$nodeInstalled = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeInstalled) {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

Write-Host "📦 Step 1: Building frontend for production..." -ForegroundColor Blue
npm run build

if (-not (Test-Path "dist")) {
    Write-Host "❌ Build failed. dist/ directory not found." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Frontend build complete!" -ForegroundColor Green
Write-Host ""

Write-Host "🌐 Step 2: Deploying frontend to Vercel..." -ForegroundColor Blue
Write-Host "Note: You'll need to login to Vercel if not already logged in." -ForegroundColor Yellow
Write-Host ""

# Deploy to Vercel
vercel --prod

Write-Host ""
Write-Host "✅ Frontend deployment initiated!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Blue
Write-Host "1. Note your Vercel deployment URL"
Write-Host "2. Deploy backend to Render (see DEPLOYMENT_INSTRUCTIONS.md)"
Write-Host "3. Update backend CORS with your Vercel URL"
Write-Host ""
Write-Host "🎉 Deployment process started!" -ForegroundColor Green

