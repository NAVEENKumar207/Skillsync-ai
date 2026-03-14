import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Upload from "./pages/Upload";
import Company from "./pages/Company";
import Analysis from "./pages/Analysis";
import Roadmap from "./pages/Roadmap";
import Assistant from "./components/Assistant";
import { ThemeProvider } from "./context/ThemeContext";
import "./styles/theme.css";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/company" element={<Company />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/roadmap" element={<Roadmap />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="relative min-h-screen text-white bg-dark overflow-hidden font-sans">
          <AnimatedRoutes />
          <Assistant />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;