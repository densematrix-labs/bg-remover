# BgGone - AI Background Remover

Free AI-powered background remover. A better Photoroom alternative.

🔗 **Live Demo:** https://bg-remover.demo.densematrix.ai

## Features

- ✅ **Instant AI Background Removal** — Powered by U-2-Net
- ✅ **Free to Use** — 3 free removals, no signup required
- ✅ **No Watermark** — High quality PNG output
- ✅ **7 Languages** — EN, 中文, 日本語, Deutsch, Français, 한국어, Español

## Tech Stack

- **Frontend:** React + Vite + TypeScript + TailwindCSS
- **Backend:** Python FastAPI + rembg (U-2-Net)
- **Deployment:** Docker

## Development

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## Docker

```bash
docker compose up -d
```

- Frontend: http://localhost:30095
- Backend: http://localhost:30096

## SEO Keywords

- photoroom alternative
- free background remover
- remove background from image
- photoroom free alternative

## License

MIT
