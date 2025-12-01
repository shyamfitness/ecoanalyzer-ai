# 🚀 Deployment Guide - EcoAnalyzer AI

This guide will help you deploy EcoAnalyzer AI to production.

## 📋 Prerequisites

- GitHub account
- MongoDB Atlas account (or MongoDB instance)
- OpenAI API key
- Vercel account (for frontend)
- Render account (for backend)

---

## 🔧 Step 1: Backend Deployment (Render)

### 1.1 Prepare Backend

1. Ensure your `backend/` directory has all necessary files
2. Verify `backend/package.json` has the correct start script
3. Check that `backend/.env.example` has all required variables

### 1.2 Deploy to Render

1. **Create a new Web Service on Render:**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `shyamfitness/ecoanalyzer-ai`
   - Select the repository

2. **Configure the Service:**
   - **Name:** `ecoanalyzer-backend`
   - **Environment:** `Node`
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Root Directory:** `backend`

3. **Set Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your_mongodb_atlas_connection_string
   MONGODB_DB_NAME=ecoanalyzer
   OPENAI_API_KEY=your_openai_api_key
   JWT_SECRET=your_secure_random_string
   FRONTEND_URL=https://your-frontend.vercel.app
   OPENAI_MODEL=gpt-4o-mini
   ```

4. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy your backend URL (e.g., `https://ecoanalyzer-backend.onrender.com`)

---

## 🌐 Step 2: Frontend Deployment (Vercel)

### 2.1 Prepare Frontend

1. Ensure your root directory has `vercel.json` configuration
2. Verify `package.json` has build script
3. Check that `env.example` has `VITE_API_URL`

### 2.2 Deploy to Vercel

1. **Create a new Project on Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import your GitHub repository: `shyamfitness/ecoanalyzer-ai`

2. **Configure the Project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (root)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

3. **Set Environment Variables:**
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   VITE_NODE_ENV=production
   ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy your frontend URL (e.g., `https://ecoanalyzer-ai.vercel.app`)

5. **Update Backend CORS:**
   - Go back to Render dashboard
   - Update `FRONTEND_URL` environment variable to include your Vercel URL
   - Redeploy the backend service

---

## 🗄️ Step 3: MongoDB Atlas Setup

### 3.1 Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (Free tier is fine)
3. Create a database user
4. Whitelist IP addresses (or use `0.0.0.0/0` for Render)
5. Get your connection string

### 3.2 Connection String Format

```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/ecoanalyzer?retryWrites=true&w=majority
```

---

## ✅ Step 4: Verify Deployment

### 4.1 Test Backend

1. Visit: `https://your-backend-url.onrender.com/api/health`
2. Should return: `{"status":"ok",...}`

### 4.2 Test Frontend

1. Visit your Vercel URL
2. Try signing up/logging in
3. Test product analysis
4. Check History page
5. Verify Dashboard loads

### 4.3 Test API Endpoints

- `GET /api/health` - Health check
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/analyze/text` - Text analysis
- `GET /api/v1/history` - Get user history

---

## 🔄 Step 5: Continuous Deployment

Both Vercel and Render automatically deploy when you push to GitHub:

1. **Make changes locally**
2. **Commit and push:**
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```
3. **Vercel and Render will automatically deploy**

---

## 🐛 Troubleshooting

### Backend Issues

- **Build fails:** Check Node.js version (should be 18+)
- **Database connection fails:** Verify MongoDB Atlas IP whitelist
- **CORS errors:** Update `FRONTEND_URL` in backend environment variables

### Frontend Issues

- **API calls fail:** Verify `VITE_API_URL` is set correctly
- **Build fails:** Check for TypeScript/ESLint errors
- **Routing issues:** Verify `vercel.json` rewrites are correct

### Common Errors

1. **"Cannot connect to server"**
   - Check backend URL in frontend environment variables
   - Verify backend is running on Render

2. **"CORS policy error"**
   - Update `FRONTEND_URL` in backend
   - Ensure credentials are enabled

3. **"MongoDB connection failed"**
   - Check connection string format
   - Verify IP whitelist includes Render IPs
   - Check database user credentials

---

## 📝 Environment Variables Summary

### Backend (Render)
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/ecoanalyzer
MONGODB_DB_NAME=ecoanalyzer
OPENAI_API_KEY=<your-openai-api-key>
JWT_SECRET=<your-secure-random-string>
FRONTEND_URL=https://your-frontend.vercel.app
OPENAI_MODEL=gpt-4o-mini
```

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend.onrender.com/api
VITE_NODE_ENV=production
```

---

## 🎉 Success!

Once deployed, your EcoAnalyzer AI will be live at:
- **Frontend:** `https://your-app.vercel.app`
- **Backend:** `https://your-backend.onrender.com`

Share your live URL and enjoy your deployed application!

---

## 📞 Support

If you encounter issues:
1. Check Render and Vercel deployment logs
2. Verify all environment variables are set
3. Test API endpoints directly
4. Check browser console for frontend errors

