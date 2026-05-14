# Deployment Guide 🚀

Deploy your e-commerce app to free hosting platforms in 3 easy steps!

## Option 1: Vercel (Frontend) + Replit (Backend) ⭐ Recommended

### Step 1: Deploy Backend to Replit (FREE)

1. **Sign up** at https://replit.com (GitHub login recommended)

2. **Create new Replit**:
   - Click "Create" → "Import from GitHub"
   - Paste your repo URL: `https://github.com/YOUR_USERNAME/ecommerce`
   - Select `Python` as language

3. **Configure environment**:
   - In `.replit`, ensure it has:
     ```
     run = "cd backend && python main.py"
     ```
   - Create `.env` with:
     ```
     DATABASE_URL=sqlite:///./ecommerce.db
     FRONTEND_URL=https://your-vercel-app.vercel.app
     ```

4. **Run the app**:
   - Click the play button
   - Your backend will be at: `https://YOUR_REPLIT_NAME.replit.dev`

5. **Keep it running** (optional):
   - Use Replit's "Always On" feature (paid) or
   - Use a free monitor service like UptimeRobot to ping every 5 minutes

### Step 2: Deploy Frontend to Vercel (FREE)

1. **Sign up** at https://vercel.com (GitHub login recommended)

2. **Connect repository**:
   - Click "Import Project"
   - Select your GitHub repo
   - Select project type: "Vite"

3. **Configure build settings**:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Set environment variable**:
   - Add environment variable:
     - `VITE_API_URL` = `https://YOUR_REPLIT_NAME.replit.dev/api`

5. **Deploy**:
   - Click "Deploy"
   - Your frontend will be at: `https://your-project.vercel.app`

6. **Update backend CORS**:
   - In backend `main.py`, update:
     ```python
     origins = [
         "https://your-project.vercel.app",
         "http://localhost:5173",  # Keep for local testing
     ]
     ```

### Step 3: Update API URLs

In `frontend/src/App.jsx`, update API_BASE:
```javascript
const API_BASE = process.env.VITE_API_URL || 'http://localhost:8000/api'
```

---

## Option 2: Railway (Backend) + Vercel (Frontend)

### Backend Deployment (Railway)

1. **Sign up** at https://railway.app (GitHub login)

2. **Create new project**:
   - Click "New Project" → "GitHub Repo"
   - Select your repository

3. **Configure**:
   - Add service: "Python"
   - Set start command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`

4. **Deploy**:
   - Both staging and production are automatic
   - Your backend URL: `https://your-project.up.railway.app`

**Advantage**: Easier than Replit, better uptime

---

## Option 3: Heroku (Backend) + Netlify (Frontend) - Free tier limited

### Note ⚠️
Heroku removed free tier. Railway or Replit are better options now.

---

## Local Development Testing 🧪

Before deploying, test locally:

```bash
# Terminal 1: Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`

---

## Troubleshooting 🔧

### Backend not responding
- Check if Replit app is running
- Verify frontend has correct API URL
- Check CORS settings in `main.py`

### Frontend shows errors
- Check browser console (F12)
- Verify API_URL is correct
- Check backend is accessible

### Database issues
- Replit: database is at `/home/runner/work` (persistent)
- Railway: upload CSV with products if needed
- Clear database: delete `ecommerce.db`, restart

### Cold starts slow
- Replit: takes 3-5 seconds on first request
- Railway: faster, usually <1 second
- This is normal for free tier

---

## Adding Product Images 🖼️

1. **Option A**: Use image URLs in CSV
   - Add `image_url` column to `final_dataset.csv`
   - Seed database with `python seed_data.py`

2. **Option B**: Manually update products
   - Use backend API to update product URLs
   - Or edit database directly

Example product URLs:
```
https://images.unsplash.com/photo-...
https://via.placeholder.com/300
```

---

## Performance Tips ⚡

- **Frontend**: Vercel edge caching by default (fast ✓)
- **Backend**: 
  - Replit keeps app warm with UptimeRobot ping
  - Limit API calls on frontend
  - Cache recommendations for 5 minutes

---

## Custom Domain 🌐

### Vercel
1. Buy domain (Namecheap, GoDaddy, etc.)
2. In Vercel project settings → Domains
3. Add your domain → Copy nameservers
4. Update DNS in registrar

### Replit
1. Limited custom domain support
2. Better to proxy through Vercel via API handler

---

## Monitoring & Logs 📊

### Replit Logs
- Dashboard shows all output
- Errors in red

### Vercel Logs
- Go to Deployments → Click deployment → Logs

### Railway Logs
- Dashboard → Logs tab

---

## Next Steps 🎯

After deployment:

1. ✅ Test full user flow: Browse → Recommend → Cart → Checkout
2. ✅ Add real product images (when ready)
3. ✅ Share URL with reviewer
4. ✅ Monitor for errors in console
5. ⭐ Show off your AI recommendations!

---

Good luck! Your e-commerce MVP is live! 🎉
