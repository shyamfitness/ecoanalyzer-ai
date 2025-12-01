# ⚡ Quick Fix for Render Build Failure

## 🔧 Immediate Fix Steps

### 1. Go to Render Dashboard
Visit: https://dashboard.render.com/web/ecoanalyzer-backend

### 2. Update Settings
Click on **Settings** tab and update:

**Root Directory:** `backend`

**Build Command:** `npm install`

**Start Command:** `npm start`

### 3. Verify Environment Variables
Make sure ALL these are set:

- ✅ `NODE_ENV` = `production`
- ✅ `PORT` = `10000`
- ✅ `MONGODB_URI` = `your_mongodb_atlas_connection_string`
- ✅ `MONGODB_DB_NAME` = `ecoanalyzer`
- ✅ `OPENAI_API_KEY` = `your_openai_api_key`
- ✅ `JWT_SECRET` = `your_secure_random_string`
- ✅ `FRONTEND_URL` = `https://ecoanalyzer-ai.vercel.app`
- ✅ `OPENAI_MODEL` = `gpt-4o-mini`

### 4. Manual Deploy
Click **Manual Deploy** → **Deploy latest commit**

---

## 🎯 Most Common Issue

**Root Directory not set to `backend`**

This is the #1 cause of build failures. Render needs to know to look in the `backend/` folder for `package.json` and `server.js`.

---

## ✅ After Fix

Once deployed successfully:
1. Check logs for: `✅ MongoDB connected`
2. Test: `https://ecoanalyzer-backend.onrender.com/api/health`
3. Should return: `{"status":"ok",...}`

---

**Need help?** Check the build logs in Render dashboard for specific error messages.

