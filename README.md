# SkillSync AI 🚀

> AI-powered Resume Analyzer & Career Roadmap Generator

SkillSync AI analyzes your resume against top tech companies (Google, Meta, Amazon, etc.) using Google Gemini Pro and generates a personalized skill gap analysis and 3-month preparation roadmap.

## ✨ Features

- 🔐 **Full Authentication** — Register, Login, Forgot Password (JWT + MongoDB)
- 📄 **Resume Upload** — PDF/DOC file parsing
- 🏢 **Company Selection** — Google, Microsoft, Amazon, Meta, Apple, Netflix
- 🤖 **AI Analysis** — Google Gemini Pro powered skill gap identification
- 🗺️ **Roadmap Generation** — 3-month personalized preparation plan with resources
- 🔊 **Text-to-Speech** — Listen to your AI roadmap
- 🌙 **Dark/Light Mode** — Seamless theme switching

## 🛠️ Tech Stack

**Frontend:** React, Tailwind CSS, Framer Motion, React Router  
**Backend:** Node.js, Express.js  
**Database:** MongoDB Atlas  
**AI:** Google Gemini Pro  
**Auth:** JWT + bcryptjs

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Google Gemini API key

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

In the `server` directory, create a `.env` file and add the following:

```
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=YOUR_JWT_SECRET_KEY
GEMINI_API_KEY=YOUR_GOOGLE_GEMINI_API_KEY

# Optional: For sending password reset emails
EMAIL_USER=YOUR_GMAIL_ADDRESS
EMAIL_PASS=YOUR_GMAIL_APP_PASSWORD
CLIENT_URL=http://localhost:3000
```

### Run Development Servers

```bash
# Terminal 1 - Backend (port 5000)
cd server && npm start

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
│   └── .env               # Environment variables
└── README.md
```

## 🔒 Security Notes

- Never commit `.env` files.
- Use Gmail App Passwords (not your regular password) for email.
- JWT tokens expire in 7 days.
