# GitHub Push Setup

This project is ready to initialize and push to GitHub after the generated folders and local artifacts are ignored.

## First push

```bash
git init
git add .
git commit -m "Prepare project for GitHub"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## Do not push

The repository ignores:

- `frontend/node_modules`
- `frontend/dist`
- `backend/venv`
- `backend/ecommerce.db`
- local `.env` files
- large files in `backend/models`

The files in `backend/models` are larger than GitHub's normal file limit, so keep them outside Git or use Git LFS/external storage when hosting the backend.

## Local Docker run

```bash
docker compose up --build
```

Frontend: `http://localhost:5173`

Backend API: `http://localhost:8000`

## Production-style Docker run

```bash
docker compose -f docker-compose.prod.yml up --build
```

## Hosting later

Set these environment variables on your hosting platform:

- Backend: `DATABASE_URL`
- Backend: `FRONTEND_URL`
- Frontend: `VITE_API_URL`

For a static frontend host like Vercel or Netlify, set `VITE_API_URL` to your deployed backend API URL, for example:

```bash
VITE_API_URL=https://your-backend.example.com/api
```
