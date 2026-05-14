# ⚡ Quick Start Guide

Get the app running in 5 minutes!

## Prerequisites
- Python 3.7+
- Node.js 14+
- npm

## 1️⃣ Backend (Python)

```bash
cd backend

# Create environment
python -m venv venv

# Activate
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install + Run
pip install -r requirements.txt
python main.py
```

**✅ Backend running at**: `http://localhost:8000`
- API docs: `http://localhost:8000/docs`

## 2️⃣ Frontend (React)

Open NEW terminal:

```bash
cd frontend

# Install
npm install

# Run
npm run dev
```

**✅ Frontend available at**: `http://localhost:5173`

## 3️⃣ That's It! 🎉

- Browse products
- Products are tracked automatically
- Recommendations update based on browsing
- Add to cart and checkout

## Load Sample Products

If no products show:

```bash
cd backend
python seed_data.py
```

This will either:
- Load your 51K products from `../Models/final_dataset.csv` if it exists
- Or create 100 sample products for testing

---

## What You Get

✅ Full e-commerce website  
✅ Smart recommendations (purchase + browsing history)  
✅ Shopping cart  
✅ Browsing history tracking  
✅ Professional UI with gradients and animations  
✅ Ready for deployment  

---

## Deployment Ready

When ready to deploy, see: `DEPLOYMENT.md`

**Quick Deploy**:
1. Backend → Replit (free)
2. Frontend → Vercel (free)
3. Share link with reviewer

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Port 8000 in use` | Change port in `main.py` or kill process |
| `No products show` | Run `python seed_data.py` in backend folder |
| `API connection error` | Ensure backend is running at localhost:8000 |
| `npm install fails` | Try `npm install --legacy-peer-deps` |
| Module not found errors | Deactivate venv, reactivate, reinstall |

---

**Need more details?** See `README.md` for full documentation.

---

Happy building! 🚀
