# 🕹️ SKILLSYNC AI [v1.0.0]
## AI-POWERED CAREER UPGRADE ENGINE

```text
  ____  _ _ _ _ ____                   _    ___ 
 / ___|| | (_) | ___| _   _ _ __   ___| |  / _ \
 \___ \| | | | \___ \| | | | '_ \ / __| | | | | |
  ___) | | | |  ___) | |_| | | | | (__|_| | |_| |
 |____/|_|_|_|_|____/ \__, |_| |_|\___|_|  \___/ 
                      |___/                     
```

---

### 🚀 SYSTEM STATUS: OPERATIONAL
**SkillSync AI** is a high-performance career optimization platform designed to bridge the gap between your current technical profile and your dream role at top-tier tech entities. Powered by **Groq Llama-3.3-70B**, it executes deep, multi-dimensional analysis of your resume against corporate logic gates.

---

### ✨ CORE FEATURES

- **[P-01] DEEP PARSING ENGINE** 📄  
  Accepts **.PDF**, **.DOCX**, and **.TXT** inputs. Automatically redacts sensitive metadata (PII) before analysis to ensure privacy.
  
- **[P-02] TARGETED BENCHMARKING** 🏢  
  Cross-references your profile against specific hiring standards for roles at Google, Meta, Amazon, Netflix, and more.

- **[P-03] 3-MONTH UPGRADE ROADMAP** 🗺️  
  Generates a week-by-week, day-by-day protocol:
  - **Month 1:** Core technical foundation and gap filling.
  - **Month 2:** Production-grade implementation of complex projects.
  - **Month 3:** System design mastery and behavioral interview excellence.

- **[P-04] INTEGRATED AI ASSISTANT** 🤖  
  A persistent, Groq-powered chat module for real-time career debugging, interview prep, and technical advice.

- **[P-05] SECURE AUTHENTICATION** 🔐  
  Robust JWT-based authentication system with password recovery via email.

---

### 🛠️ CORE ARCHITECTURE (STACK)

| MODULE | COMPONENT |
| :--- | :--- |
| **USER INTERFACE** | React.js 19, Tailwind CSS (Retro-Modern), Framer Motion |
| **LOGIC ENGINE** | Node.js, Express.js (v5), JWT Auth |
| **DATA STORAGE** | MongoDB Atlas (NoSQL) |
| **AI CORE** | Groq Cloud API (Llama-3.3-70B-Versatile) |
| **SERVICES** | Nodemailer (Gmail), PDF-Parse, Mammoth (DOCX) |
| **SECURITY** | Helmet.js, Express-Rate-Limit, BcryptJS |

---

### 📂 SYSTEM STRUCTURE

```text
SKILLSYNC-AI/
├── client/              # React Frontend (Vite/CRA)
│   ├── public/          # Static Assets
│   └── src/
│       ├── components/  # Reusable UI Modules
│       ├── context/     # State Management
│       ├── pages/       # Route Views (Dashboard, Upload, etc.)
│       ├── styles/      # Global CSS & Tailwind Config
│       └── utils/       # API Helpers & Client-side Logic
├── server/              # Node.js/Express Backend
│   ├── server.js        # Main API Gateway & Routes
│   ├── .env.example     # Environment Blueprint
│   └── package.json     # Backend Dependencies
└── README.md            # System Protocols
```

---

### 🕹️ INITIALIZATION SEQUENCE

#### 1. CLONE SOURCE
```bash
git clone https://github.com/NAVEENKumar207/Skillsync-ai.git
cd Skillsync-ai
```

#### 2. BOOT BACKEND (SERVER)
```bash
cd server
npm install
# Create .env from template
cp .env.example .env
# Start production server
npm start
# OR start development mode (requires nodemon)
npm run dev
```

#### 3. BOOT FRONTEND (CLIENT)
```bash
cd ../client
npm install
npm start
```

---

### 🔐 ENVIRONMENT CONFIGURATION

Configure your `server/.env` with these critical constants:

| Variable | Description |
| :--- | :--- |
| `PORT` | Local server port (default: 5000) |
| `MONGO_URI` | MongoDB Atlas Connection String |
| `JWT_SECRET` | Secret key for token signing |
| `GROQ_API_KEY` | Your API key from Groq Cloud |
| `EMAIL_USER` | Gmail address for recovery system |
| `EMAIL_PASS` | Gmail App Password (not account password) |
| `CLIENT_URL` | Frontend URL (default: http://localhost:3000) |

---

### 🤝 CONTRIBUTION PROTOCOL

1. **FORK** the source code.
2. **BRANCH** your feature (`git checkout -b feature/NewModule`).
3. **COMMIT** changes (`git commit -m 'feat: add deep-link parsing'`).
4. **PUSH** to origin and open a **PULL REQUEST**.

---

### 📄 LICENSE
**DISTRIBUTED UNDER THE MIT LICENSE.** (C) 2026 SKILLSYNC AI.

---

### 📧 TERMINAL CONTACT

**Naveen Kumar** - [GitHub Profile](https://github.com/NAVEENKumar207)  
Project Link: [https://github.com/NAVEENKumar207/Skillsync-ai](https://github.com/NAVEENKumar207/Skillsync-ai)
