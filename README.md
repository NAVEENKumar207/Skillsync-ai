# SkillSync AI 🚀

**SkillSync AI** is a cutting-edge, AI-powered career development platform designed to bridge the gap between your current skills and your dream job. By analyzing your resume against the high standards of top tech companies (Google, Meta, Amazon, Netflix, etc.), SkillSync AI identifies skill deficiencies and generates a personalized, actionable career roadmap to help you succeed.

---

## ✨ Features

- 📄 **Intelligent Resume Analysis** — Uses Groq AI (Llama 3.3 70B) to parse and evaluate your resume with high accuracy.
- 🏢 **Targeted Benchmarking** — Compare your profile against requirements for specific roles at top-tier tech companies.
- 🗺️ **Personalized Career Roadmaps** — Get a step-by-step learning path tailored to your unique skill gaps.
- 🤖 **Interactive AI Assistant** — A persistent, intelligent chat assistant to help you navigate your career journey.
- 🔊 **Text-to-Speech Integration** — Listen to your AI-generated roadmap and career advice.
- 🔐 **Secure Authentication** — Full JWT-based authentication system with password reset functionality.
- 🌓 **Adaptive Theme System** — Seamlessly switch between Dark and Light modes for a comfortable experience.
- 🎭 **Smooth Animations** — Beautifully crafted transitions and interactions using Framer Motion.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** — Modern UI components and state management.
- **Tailwind CSS** — Utility-first styling for a sleek, responsive design.
- **Framer Motion** — High-performance web animations.
- **React Router** — Seamless navigation with protected routes.
- **Context API** — Global state management for themes and user sessions.

### Backend
- **Node.js & Express.js** — Fast and scalable server architecture.
- **MongoDB Atlas** — Cloud-based NoSQL database for user data and analysis history.
- **Groq AI (Llama 3.3 70B)** — Advanced Large Language Model for deep analysis and roadmap generation.
- **JWT & bcryptjs** — Secure password hashing and session management.
- **Nodemailer** — Professional email handling for password recovery.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- [Groq AI API Key](https://wow.groq.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/NAVEENKumar207/Skillsync-ai.git
   cd Skillsync-ai
   ```

2. **Setup Backend:**
   ```bash
   cd server
   npm install
   ```

3. **Setup Frontend:**
   ```bash
   cd ../client
   npm install
   ```

### Environment Configuration

Create a `.env` file in the `server` directory and configure the following variables:

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

### Running the Application

1. **Start the Backend Server:**
   ```bash
   cd server
   npm start
   ```
   The server will run on `http://localhost:5000`.

2. **Start the Frontend Application:**
   ```bash
   cd client
   npm start
   ```
   The application will be available at `http://localhost:3000`.

---

## 📂 Project Structure

```text
Skillsync-ai/
├── client/              # React Frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components (Assistant, ThemeToggle, etc.)
│   │   ├── context/     # Global state (ThemeContext)
│   │   ├── pages/       # Application views (Dashboard, Analysis, Roadmap, etc.)
│   │   ├── styles/      # Global CSS and themes
│   │   └── utils/       # API services and helpers
├── server/              # Express Backend
│   ├── server.js        # Core logic, routes, and AI integration
│   └── .env             # Environment configuration (not committed)
└── README.md
```

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📧 Contact

**Naveen Kumar** - [GitHub](https://github.com/NAVEENKumar207)

Project Link: [https://github.com/NAVEENKumar207/Skillsync-ai](https://github.com/NAVEENKumar207/Skillsync-ai)
