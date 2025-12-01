# 🌐 Live Deployment URLs

## ✅ Production URLs

### Frontend
**URL:** https://ecoanalyzer-ai.vercel.app  
**Platform:** Vercel  
**Status:** ✅ Live

### Backend API
**URL:** https://ecoanalyzer-backend.onrender.com  
**Platform:** Render  
**Status:** ✅ Live

### API Endpoints
- Health Check: https://ecoanalyzer-backend.onrender.com/api/health
- API Base: https://ecoanalyzer-backend.onrender.com/api/v1

---

## 🔧 Environment Configuration

### Frontend (Vercel)
```
VITE_API_URL=https://ecoanalyzer-backend.onrender.com/api
VITE_NODE_ENV=production
```

### Backend (Render)
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

## 🧪 Testing

1. **Frontend:** Visit https://ecoanalyzer-ai.vercel.app
2. **Backend Health:** https://ecoanalyzer-backend.onrender.com/api/health
3. **Test Sign Up/Login**
4. **Test Product Analysis**
5. **Test History Page**
6. **Test Dashboard**

---

## 📝 Notes

- Frontend and backend are now connected
- CORS is configured to allow requests from the frontend
- All API endpoints should be accessible
- MongoDB Atlas connection required for full functionality

---

**Last Updated:** Just now  
**Status:** ✅ Fully Deployed

