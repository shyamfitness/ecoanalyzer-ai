# 🔧 MongoDB Connection Fix

## ✅ Backend Status
**Backend is LIVE:** https://ecoanalyzer-backend.onrender.com  
**Server is running** on port 10000  
**Issue:** MongoDB connection string is invalid or missing

---

## 🔧 Fix MongoDB Connection

### Step 1: Get MongoDB Atlas Connection String

1. **Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)**
2. **If you don't have an account:**
   - Sign up (Free tier available)
   - Create a new cluster (Free M0)
   - Wait for cluster to be created (~3-5 minutes)

3. **Get Connection String:**
   - Click **"Connect"** on your cluster
   - Choose **"Connect your application"**
   - Copy the connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/ecoanalyzer?retryWrites=true&w=majority`

4. **Replace placeholders:**
   - Replace `<username>` with your database username
   - Replace `<password>` with your database password
   - Replace `<dbname>` with `ecoanalyzer` (or keep default)

### Step 2: Set Up Database User

1. In MongoDB Atlas, go to **Database Access**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Create username and password (save these!)
5. Set user privileges: **"Read and write to any database"**
6. Click **"Add User"**

### Step 3: Whitelist IP Addresses

1. Go to **Network Access** in MongoDB Atlas
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
4. Click **"Confirm"**

### Step 4: Update Render Environment Variable

1. **Go to Render Dashboard:** https://dashboard.render.com
2. **Open your `ecoanalyzer-backend` service**
3. **Go to Environment tab**
4. **Find `MONGODB_URI`**
5. **Update the value** with your MongoDB Atlas connection string:
   ```
   mongodb+srv://your-username:your-password@cluster.mongodb.net/ecoanalyzer?retryWrites=true&w=majority
   ```
6. **Save Changes** - Render will automatically redeploy

---

## ✅ Example Connection String

```
mongodb+srv://ecoanalyzer:MySecurePassword123@cluster0.abc123.mongodb.net/ecoanalyzer?retryWrites=true&w=majority
```

**Important:**
- Replace `ecoanalyzer` with your actual username
- Replace `MySecurePassword123` with your actual password
- Replace `cluster0.abc123.mongodb.net` with your actual cluster URL
- Keep `/ecoanalyzer` as the database name
- Keep `?retryWrites=true&w=majority` at the end

---

## 🧪 Test After Fix

1. **Wait for Render to redeploy** (~2 minutes)
2. **Check Render logs** - should see: `✅ MongoDB connected`
3. **Test health endpoint:**
   ```
   https://ecoanalyzer-backend.onrender.com/api/health
   ```
4. **Should return:**
   ```json
   {
     "status": "ok",
     "timestamp": "...",
     "environment": "production",
     "version": "v1"
   }
   ```

---

## ⚠️ Common Issues

### "Invalid scheme" error
- **Cause:** Connection string doesn't start with `mongodb://` or `mongodb+srv://`
- **Fix:** Make sure you copied the full connection string from MongoDB Atlas

### "Authentication failed"
- **Cause:** Wrong username or password
- **Fix:** Double-check your database user credentials

### "IP not whitelisted"
- **Cause:** Render's IP not in MongoDB Atlas whitelist
- **Fix:** Add `0.0.0.0/0` to Network Access (allows all IPs)

### "Connection timeout"
- **Cause:** Network or firewall issue
- **Fix:** Check MongoDB Atlas cluster status, ensure it's running

---

## 🎯 Quick Checklist

- [ ] MongoDB Atlas account created
- [ ] Cluster created and running
- [ ] Database user created with username/password
- [ ] IP whitelist includes `0.0.0.0/0`
- [ ] Connection string copied from Atlas
- [ ] `MONGODB_URI` updated in Render
- [ ] Render service redeployed
- [ ] Health endpoint returns `{"status":"ok"}`

---

**After fixing MongoDB, the backend will be fully functional!** 🚀

