# 🚀 AI Task Manager

> A full-stack, AI-powered task management application built with the MERN stack.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue) ![Auth](https://img.shields.io/badge/Auth-JWT-green) ![AI](https://img.shields.io/badge/AI-OpenAI-orange) ![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

- 🔐 JWT-based Authentication (Register/Login)
- ✅ Full CRUD for Tasks (Create, Read, Update, Delete)
- 🤖 AI-powered task suggestions via OpenAI API
- 📊 Dashboard with task stats and progress
- 🏷️ Task priority levels (Low, Medium, High, Critical)
- 📅 Due date tracking with overdue alerts
- 🔍 Search & Filter tasks
- 📱 Fully responsive UI
- 🌙 Dark mode support

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Tailwind CSS, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| AI | OpenAI API (GPT-4) |
| State | React Context + useReducer |

## 📁 Project Structure

```
ai-task-manager/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Global state management
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service calls
│   │   └── utils/          # Helper functions
│   ├── index.html
│   └── package.json
├── server/                 # Node.js backend
│   ├── config/             # DB & environment config
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Auth & error middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # Express routes
│   └── server.js
├── .env.example
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)
- OpenAI API Key

### Installation

```bash
# Clone the repo
git clone https://github.com/Rahul777111/ai-task-manager.git
cd ai-task-manager

# Install server dependencies
npm install

# Install client dependencies
cd client && npm install

# Setup environment variables
cp .env.example .env
# Fill in your MongoDB URI, JWT secret, and OpenAI API key

# Run development servers (both simultaneously)
npm run dev
```

### Environment Variables

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
OPENAI_API_KEY=your_openai_api_key
PORT=5000
NODE_ENV=development
```

## 🔌 API Endpoints

### Auth Routes `/api/auth`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register new user |
| POST | `/login` | Login user |
| GET | `/me` | Get current user |

### Task Routes `/api/tasks` (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all tasks |
| POST | `/` | Create task |
| GET | `/:id` | Get single task |
| PUT | `/:id` | Update task |
| DELETE | `/:id` | Delete task |
| GET | `/stats` | Get task statistics |

### AI Routes `/api/ai` (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/suggest` | Get AI task suggestions |
| POST | `/breakdown` | Break task into subtasks |
| POST | `/prioritize` | AI-based priority suggestion |

## 📸 Screenshots

> Coming soon — deploy on Vercel + Render for live demo.

## 🤝 Contributing

Pull requests are welcome! Please open an issue first for major changes.

## 📄 License

MIT © [Rahul777111](https://github.com/Rahul777111)
