# ⚡ SKILLSYNC AI
### *Bridge the Gap Between Your Resume and Tier-1 Reality*

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Groq AI](https://img.shields.io/badge/Groq_AI-F3D03E?style=for-the-badge&logo=google-gemini&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MIT License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)

```text
   _____ _    _ _ _       _____                     
  / ____| |  (_) | |     / ____|                    
 | (___ | | ___| | |    | (___  _   _ _ __   ___    
  \___ \| |/ / | | |     \___ \| | | | '_ \ / __|   
  ____) |   <| | | |     ____) | |_| | | | | (__    
 |_____/|_|\_\_|_|_|    |_____/ \__, |_| |_|\___|   
                                 __/ |              
                                |___/               
```

---

## 🌟 OVERVIEW
**SkillSync AI** is a professional career acceleration engine. It doesn't just "check" your resume; it simulates a Tier-1 technical recruiter's mindset. By leveraging the **Groq Llama-3.3-70B** model, SkillSync identifies deep architectural gaps in your experience and builds a hyper-personalized, 90-day execution protocol to get you hired at companies like Google, Meta, and Amazon.

---

## 🔥 KEY CAPABILITIES

### 🧠 [01] Deep Neural Parsing
SkillSync uses advanced text extraction to pull raw logic from **PDF, DOCX, and TXT** files, sanitizing PII (Personally Identifiable Information) before it ever hits the AI core.

### 🎯 [02] Tier-1 Benchmarking
Our AI compares your profile against the actual "Logic Gates" used by FAANG+ engineering managers. It looks for specific markers: System Design mastery, Production-grade implementation, and Behavioral leadership.

### 💾 [03] Analysis Persistence & History
Persist your AI-generated roadmap and analysis directly to your profile database. Review your career evolution over time through your personal dashboard.

### 🛡️ [04] Identity Challenge Recovery
A secure **Identity Challenge** system allows you to regain access using your **Security Color** or **Last Remembered Password**, eliminating the need for complex email integrations.

---

## 🛠️ TECH STACK

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React, Framer Motion, Tailwind CSS |
| **Backend** | Node.js, Express (Modular Architecture) |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **AI Engine** | Groq Cloud (Llama-3.3-70B-Versatile) |
| **Security** | JWT, Helmet, Rate-Limit, Bcrypt |

---

## 🚀 QUICK START

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account
- Groq AI API Key

### Installation

1. **Clone & Install**
   ```bash
   git clone https://github.com/NAVEENKumar207/Skillsync-ai-1.git
   cd Skillsync-ai-1
   ```

2. **Configure Environment**
   Create a `.env` file in the `server/` directory (see `.env.example`).

3. **Launch System**
   ```bash
   # Backend
   cd server && npm install && npm start

   # Frontend
   cd client && npm install && npm start
   ```

---

## 📂 DETAILED SYSTEM ARCHITECTURE

SkillSync AI follows a professional **Modular MVC-like architecture** designed for high maintainability, scalability, and testability.

### 🏗️ 1. Backend Layer (Express.js)
The backend is decoupled into specialized directories to enforce a strict **Separation of Concerns (SoC)**.

#### **Directory Breakdown:**
- **`config/`**: Centralized configuration management.
  - `db.js`: Handles MongoDB Atlas connection with SRV and DNS fault-tolerance.
  - `env.js`: Boot-time environment variable validation.
- **`routes/`**: The entry point for all API requests. Routes are grouped by domain (auth, history, ai, etc.).
- **`middlewares/`**: Interceptors for the request-response lifecycle.
  - `authMiddleware.js`: Validates JWT tokens and injects user context.
  - `rateLimitMiddleware.js`: Protects against brute-force and DDoS.
  - `uploadMiddleware.js`: Manages in-memory file buffering for resumes.
  - `errorMiddleware.js`: Unified catch-all for application-wide exceptions.
- **`controllers/`**: Orchestrates the flow. It parses request data, invokes services, and returns standardized JSON responses.
- **`services/`**: The "Brain" of the backend. Contains pure business logic and external integrations (Groq API, Resume Parsers).
- **`models/`**: Defines the data structure and schema constraints using Mongoose.
- **`utils/`**: Reusable utility functions (token generation, text sanitization, health checks).

### 🔄 2. Backend Request Lifecycle
```text
[CLIENT REQUEST] 
       ↓
[RATE LIMITER] (middleware/rateLimitMiddleware.js)
       ↓
[AUTH CHECK] (middleware/authMiddleware.js)
       ↓
[ROUTING] (routes/*.js)
       ↓
[CONTROLLER] (controllers/*.js)
       ↓
[SERVICE LAYER] (services/*.js) ──→ [EXTERNAL API / DB]
       ↓
[JSON RESPONSE] 
```

### 🧠 3. AI Processing Pipeline
1. **Extraction**: Raw file buffers (PDF/DOCX) are parsed into plain text via `resumeService`.
2. **Sanitization**: `sanitize.js` removes emails, secrets, and PII using regex patterns.
3. **Context Injection**: The `aiController` constructs a high-density prompt combining the resume text with target role/company parameters.
4. **LLM Execution**: `groqService` communicates with the Llama-3.3-70B model via a secure TLS connection.
5. **Output Parsing**: The structured analysis is returned to the client and optionally persisted to MongoDB.

### 🎨 4. Frontend Layer (React)
- **State Management**: Local state for interactive UI, `localStorage` for session persistence.
- **Theming**: Dynamic CSS variables driven by a dual-theme (Light/Dark) engine.
- **Animations**: `framer-motion` for fluid page transitions and component-level entry effects.

---

## 🤝 CONTRIBUTING
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 LICENSE
Distributed under the **MIT License**.

---

## ✉️ CONTACT
**Naveen Kumar** - [GitHub](https://github.com/NAVEENKumar207)

Project Link: [https://github.com/NAVEENKumar207/Skillsync-ai-1](https://github.com/NAVEENKumar207/Skillsync-ai-1)
