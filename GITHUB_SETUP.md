# GitHub Clone and Setup Guide

Use this guide when a friend, evaluator, or teammate clones/pulls the project and wants to run it locally.

## Why products may be missing

`backend/ecommerce.db` is not pushed to GitHub because local database files are ignored in `.gitignore`:

```gitignore
*.db
*.sqlite
*.sqlite3
```

This is intentional. A SQLite database contains local runtime data such as products, users, carts, orders, and reviews. It can become large and can also cause merge conflicts if multiple people edit it.

When someone clones the repo, their backend will create a new `backend/ecommerce.db` automatically. If no product CSV files are available, the backend seeds synthetic demo products so the app still runs.

## Fresh Clone Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

### 2. Backend setup

Python 3.9 or 3.10 is recommended for the pinned backend dependencies.

Windows:

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python main.py
```

macOS/Linux:

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python main.py
```

Backend API: `http://localhost:8000`

API docs: `http://localhost:8000/docs`

### 3. Frontend setup

Open a second terminal.

Windows:

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

macOS/Linux:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend app: `http://localhost:5173`

## Product Data Options

### Option A: Use automatic demo data

This is the easiest option.

Run the backend with:

```bash
cd backend
python main.py
```

If `backend/ecommerce.db` does not exist, the app creates it. If no CSV dataset exists, it creates synthetic demo products.

### Option B: Recreate products from CSV data

For the real project catalog, place one of these files inside `backend/models/`:

- `lastcleaned_data.csv`
- `final_dataset.csv`

Then run:

```bash
cd backend
python seed_data.py --replace
```

To load the full CSV instead of the quick default:

```bash
python seed_data.py --all --replace
```

After that, start the backend:

```bash
python main.py
```

Important: `backend/models/` is ignored by Git because model/data files are large. Share those files separately using Google Drive, OneDrive, Git LFS, or another storage service.

### Option C: Copy your existing local database

If you want someone to see exactly the same local products, users, reviews, carts, and orders, send them your local file:

```text
backend/ecommerce.db
```

They should place it at the same path after cloning:

```text
YOUR_REPO/backend/ecommerce.db
```

Then they can start the backend normally:

```bash
cd backend
python main.py
```

Do not commit this file unless you intentionally switch to Git LFS or a separate release asset.

## Pulling Latest Changes

If someone already cloned the project:

```bash
git pull
```

Then update dependencies if needed:

```bash
cd backend
pip install -r requirements.txt

cd ../frontend
npm install
```

Their local `backend/ecommerce.db` will not be changed by `git pull`, because it is ignored by Git.

## Reset Local Database

If the product data looks wrong or empty, delete the local database and reseed it:

```bash
cd backend
del ecommerce.db
python main.py
```

On macOS/Linux:

```bash
cd backend
rm ecommerce.db
python main.py
```

If CSV data is available in `backend/models/`, use:

```bash
python seed_data.py --replace
```

## Docker Run

```bash
docker compose up --build
```

Frontend: `http://localhost:5173`

Backend API: `http://localhost:8000`

## Production-style Docker Run

```bash
docker compose -f docker-compose.prod.yml up --build
```

## Hosting Later

Set these environment variables on your hosting platform:

- Backend: `DATABASE_URL`
- Backend: `FRONTEND_URL`
- Frontend: `VITE_API_URL`

For a static frontend host like Vercel or Netlify, set `VITE_API_URL` to your deployed backend API URL:

```bash
VITE_API_URL=https://your-backend.example.com/api
```

For production, prefer PostgreSQL or another hosted database instead of committing `ecommerce.db`.
