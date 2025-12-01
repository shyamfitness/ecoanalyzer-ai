#!/bin/bash

# Backend Deployment Helper Script
# This script prepares the backend for deployment to Render

set -e

echo "🔧 Backend Deployment Preparation"
echo "=================================="
echo ""

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

cd backend

echo -e "${BLUE}📦 Installing backend dependencies...${NC}"
npm install

echo -e "${GREEN}✅ Dependencies installed!${NC}"
echo ""
echo -e "${BLUE}📝 Environment Variables Checklist:${NC}"
echo "Make sure you have these set in Render:"
echo ""
echo "  NODE_ENV=production"
echo "  PORT=10000"
echo "  MONGODB_URI=your_mongodb_atlas_connection_string"
echo "  MONGODB_DB_NAME=ecoanalyzer"
echo "  OPENAI_API_KEY=your_openai_api_key"
echo "  JWT_SECRET=your_secure_random_string"
echo "  FRONTEND_URL=https://your-frontend.vercel.app"
echo "  OPENAI_MODEL=gpt-4o-mini"
echo ""
echo -e "${YELLOW}⚠️  Important:${NC}"
echo "1. Create a MongoDB Atlas cluster"
echo "2. Get your connection string"
echo "3. Whitelist IP: 0.0.0.0/0 in MongoDB Atlas"
echo "4. Set all environment variables in Render dashboard"
echo ""
echo -e "${GREEN}✅ Backend is ready for deployment!${NC}"
echo ""
echo -e "${BLUE}Next: Deploy to Render using the dashboard or Render CLI${NC}"

