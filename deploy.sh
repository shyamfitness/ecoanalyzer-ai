#!/bin/bash

# EcoAnalyzer AI Deployment Script
# This script helps deploy both frontend and backend

set -e

echo "🚀 EcoAnalyzer AI Deployment Script"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Step 1: Building frontend for production...${NC}"
npm run build

if [ ! -d "dist" ]; then
    echo -e "${YELLOW}❌ Build failed. dist/ directory not found.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Frontend build complete!${NC}"
echo ""

echo -e "${BLUE}🌐 Step 2: Deploying frontend to Vercel...${NC}"
echo -e "${YELLOW}Note: You'll need to login to Vercel if not already logged in.${NC}"
echo ""

# Deploy to Vercel
vercel --prod

echo ""
echo -e "${GREEN}✅ Frontend deployment initiated!${NC}"
echo ""
echo -e "${BLUE}📝 Next steps:${NC}"
echo "1. Note your Vercel deployment URL"
echo "2. Deploy backend to Render (see DEPLOYMENT_INSTRUCTIONS.md)"
echo "3. Update backend CORS with your Vercel URL"
echo ""
echo -e "${GREEN}🎉 Deployment process started!${NC}"

