# 🔧 Render Deployment Fix

## Issue
The backend build is failing on Render because the build commands need to target the `backend/` directory.

## Solution

### Option 1: Update Render Dashboard Settings

1. Go to your Render dashboard: https://dashboard.render.com
2. Open your `ecoanalyzer-backend` service
3. Go to **Settings** tab
4. Update these fields:

   **Root Directory:** `backend`
   
   **Build Command:** `npm install`
   
   **Start Command:** `npm start`

5. **Save Changes** - This will trigger a new deployment

### Option 2: Use render.yaml (Already Updated)

The `render.yaml` file has been updated with `rootDir: backend`. If you're using Blueprint deployment, it should work automatically.

---

## Required Environment Variables

Make sure these are set in Render:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_atlas_connection_string
MONGODB_DB_NAME=ecoanalyzer
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_secure_random_string
FRONTEND_URL=https://ecoanalyzer-ai.vercel.app
OPENAI_MODEL=gpt-4o-mini
```

---

## Common Build Errors & Fixes

### Error: "Cannot find module"
- **Fix:** Ensure `rootDir: backend` is set in Render settings

### Error: "MongoDB connection failed"
- **Fix:** Check `MONGODB_URI` is set correctly
- **Fix:** Ensure MongoDB Atlas IP whitelist includes `0.0.0.0/0`

### Error: "Port already in use"
- **Fix:** Render automatically sets PORT, ensure it's set to `10000` in env vars

### Error: "JWT_SECRET not set"
- **Fix:** Add `JWT_SECRET` environment variable with a secure random string

---

## Verification

After fixing, check:
1. Build logs in Render dashboard
2. Service logs for any runtime errors
3. Health endpoint: `https://ecoanalyzer-backend.onrender.com/api/health`

---

**Last Updated:** Just now

