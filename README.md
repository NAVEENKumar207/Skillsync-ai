# SkillSync AI 🚀

**SkillSync AI** is a state-of-the-art, AI-powered career development platform designed to bridge the gap between your current expertise and your dream job. By leveraging the power of **Groq AI (Llama 3.3 70B)**, the platform analyzes your resume against the rigorous standards of top-tier tech companies like Google, Meta, and Amazon, providing a personalized, actionable 3-month roadmap to success.

---

## ✨ Core Features

### 📄 Intelligent Resume Parsing
- **Multi-format Support**: Seamlessly upload PDF, DOCX, or TXT files.
- **Privacy First**: Automatic sanitization of sensitive data (emails, secrets) before processing.
- **Deep Extraction**: Uses high-performance parsing to extract meaningful professional context.

### 🏢 Targeted Benchmarking
- **Company-Specific Insights**: Compare your profile against specific requirements for roles at top tech firms.
- **Granular Analysis**: Identify exact skill gaps in technical, architectural, and methodology domains.

### 🗺️ AI-Generated 3-Month Roadmaps
- **Month 1 (Deep Foundations)**: A day-by-day learning plan to solidify core concepts.
- **Month 2 (Implementation)**: Guidance on building a production-grade project to demonstrate mastery.
- **Month 3 (Mastery & Career)**: Focus on advanced system design, algorithms, and behavioral interview techniques.

### 🤖 Interactive AI Assistant
- **Persistent Support**: A floating AI chat assistant powered by Groq AI to answer career-related queries instantly.
- **Context-Aware**: Provides concise, bulleted advice tailored to your journey.

### 🔐 Robust Security & UX
- **Secure Auth**: JWT-based authentication with bcrypt password hashing.
- **Password Recovery**: Integrated email service for secure password resets.
- **Adaptive UI**: Seamless Dark/Light mode transition with a modern, responsive design using Tailwind CSS and Framer Motion.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React.js, Tailwind CSS, Framer Motion, Lucide Icons, React Router |
| **Backend** | Node.js, Express.js, MongoDB Atlas, Multer, PDF-Parse |
| **AI/ML** | Groq AI (Llama-3.3-70b-versatile) |
| **Services** | Nodemailer (Email), JWT (Security), Axios (API) |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18 or higher
- **MongoDB**: Atlas account or local instance
- **Groq AI**: API Key from [Groq Console](https://console.groq.com/)

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/NAVEENKumar207/Skillsync-ai.git
   cd Skillsync-ai
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   ```

### Environment Configuration

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key

# Optional: Email service for password resets
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:3000
```

---

## 📂 Project Structure

```text
Skillsync-ai/
├── client/              # React Frontend (Vite/CRA)
│   ├── src/
│   │   ├── components/  # Reusable UI (Assistant, ProtectedRoute, etc.)
│   │   ├── pages/       # Dashboard, Analysis, Roadmap, Landing, etc.
│   │   ├── styles/      # Tailwind configurations & Global CSS
│   │   └── utils/       # API services & Helper functions
├── server/              # Express Backend
│   ├── server.js        # API Routes, AI Integration, & DB Logic
│   └── .env             # Sensitive Configuration (Ignored by Git)
└── README.md            # Project Documentation
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:
1. **Fork** the repository.
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`).
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`).
4. **Push** to the branch (`git push origin feature/AmazingFeature`).
5. **Open** a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📧 Contact

**Naveen Kumar** - [GitHub](https://github.com/NAVEENKumar207)

Project Link: [https://github.com/NAVEENKumar207/Skillsync-ai](https://github.com/NAVEENKumar207/Skillsync-ai)
