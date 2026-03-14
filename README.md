# SkillSync AI 🚀

> AI-powered Resume Analyzer & Career Roadmap Generator

SkillSync AI analyzes your resume against top tech companies (Google, Meta, Amazon, etc.) using GPT-4o-mini and generates a personalized skill gap analysis and 3-month preparation roadmap.

## ✨ Features

- 🔐 **Full Authentication** — Register, Login, Forgot Password (JWT + MongoDB)
- 📄 **Resume Upload** — PDF/DOC file parsing
- 🏢 **Company Selection** — Google, Microsoft, Amazon, Meta, Apple, Netflix
- 🤖 **AI Analysis** — GPT-4o-mini powered skill gap identification
- 🗺️ **Roadmap Generation** — 3-month personalized preparation plan with resources
- 🔊 **Text-to-Speech** — Listen to your AI roadmap
- 🌙 **Dark/Light Mode** — Seamless theme switching

## 🛠️ Tech Stack

**Frontend:** React, Tailwind CSS, Framer Motion, React Router  
**Backend:** Node.js, Express.js  
**Database:** MongoDB Atlas  
**AI:** OpenAI GPT-4o-mini  
**Auth:** JWT + bcryptjs

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- OpenAI API key

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/skillsync-ai.git
cd skillsync-ai

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### Environment Setup

```bash
cd server
cp .env.example .env
# Fill in your values in .env
```

### Run Development Servers

```bash
# Terminal 1 - Backend (port 5000)
cd server && npm run dev

# Terminal 2 - Frontend (port 3000)
cd client && npm start
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
skillsync-ai/
├── client/                 # React frontend
│   └── src/
│       ├── pages/         # Landing, Login, Signup, Upload, Company, Analysis, Roadmap
│       ├── components/    # ThemeToggle, Assistant
│       ├── context/       # ThemeContext
│       └── utils/         # api.js (centralized API calls)
├── server/                 # Express backend
│   ├── server.js          # All routes: auth + AI analysis
│   └── .env.example       # Environment template
└── README.md
```

## 🔒 Security Notes

- Never commit `.env` files
- Use Gmail App Passwords (not your regular password) for email
- JWT tokens expire in 7 days
