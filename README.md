# ⚡ TaskFlow AI

> AI-powered task management built for people who get things done.

![TaskFlow AI](https://img.shields.io/badge/Stack-React%20%7C%20Node%20%7C%20MongoDB-6366f1?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-22d3ee?style=for-the-badge)
![Deployed](https://img.shields.io/badge/Deployed-Vercel-000?style=for-the-badge&logo=vercel)

---

## 🚀 Features

- **🤖 AI Task Generation** — describe your goal, get a full task breakdown instantly
- **📊 Live Dashboard** — real-time stats: completion rate, overdue tracking, progress bar
- **🎯 Smart Filtering** — filter by All / Active / Done / AI-generated
- **✅ One-click Complete** — toggle task status inline with animations
- **🎨 Premium UI** — glassmorphism, animated gradients, neon borders, floating elements
- **🔐 Auth** — JWT-based login/register with password visibility toggle
- **📱 Responsive** — mobile-first, works on all screen sizes
- **⚡ Vercel-ready** — zero-config deployment

---

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB + Mongoose |
| AI | OpenAI API |
| Auth | JWT + bcrypt |
| Deploy | Vercel |

---

## 🏃 Quick Start

```bash
# Clone
git clone https://github.com/Rahul777111/ai-task-manager
cd ai-task-manager

# Install all
npm install
cd client && npm install && cd ..

# Setup env
cp .env.example .env
# Fill in MONGODB_URI, JWT_SECRET, OPENAI_API_KEY

# Run dev
npm run dev
```

---

## 🌐 Deploy to Vercel

```bash
npx vercel --prod
```

Or connect this repo to [vercel.com](https://vercel.com) for auto-deploys on every push.

---

## 📁 Structure

```
ai-task-manager/
├── client/          # React frontend (Vite + Tailwind)
│   └── src/
│       ├── pages/   # Dashboard, Tasks, Login, Register
│       ├── components/  # Navbar, TaskCard, TaskModal
│       ├── context/ # Auth + Task context
│       └── services/# API + AI service
├── server/          # Express API
├── api/             # Vercel serverless functions
└── vercel.json      # Deploy config
```

---

<p align="center">Built with 💜 by <a href="https://github.com/Rahul777111">Rahul777111</a></p>
