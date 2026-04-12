import React, { useEffect, useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaBrain, FaVolumeUp, FaVolumeMute, FaArrowRight, FaExclamationTriangle } from "react-icons/fa";
import { ThemeToggle } from '../components/ThemeToggle';
import { ThemeContext } from '../context/ThemeContext';
import { analyzeResume } from '../utils/api';

// Parse AI response into structured sections
function parseAnalysis(text) {
  const sections = {};
  const sectionMap = {
    "TARGET GOAL": ["target goal", "target company"],
    "CANDIDATE PROFILE": ["candidate profile", "professional summary"],
    "SKILL GAPS": ["skill gap", "skills gap", "skill gaps"],
    "ROADMAP": ["roadmap", "3-month", "month roadmap", "learning plan"],
    "STRENGTHS": ["strength", "key strength"],
    "QUICK WINS": ["quick win", "this week"],
  };

  // Split by ## headings
  const parts = text.split(/##\s+/g).filter(Boolean);
  if (parts.length > 1) {
    parts.forEach((part) => {
      const lines = part.trim().split("\n");
      const heading = lines[0].trim().toUpperCase();
      const content = lines.slice(1).join("\n").trim();
      for (const [key, keywords] of Object.entries(sectionMap)) {
        if (keywords.some((kw) => heading.includes(kw.toUpperCase()))) {
          sections[key] = content;
          break;
        }
      }
    });
  }

  // Fallback: return raw text if structured parsing fails
  if (Object.keys(sections).length === 0) {
    sections["FULL ANALYSIS"] = text;
  }

  return sections;
}

const sectionConfig = {
  "TARGET GOAL": { icon: "🎯", color: "#2196F3", bgDark: "rgba(33,150,243,0.08)", bgLight: "rgba(33,150,243,0.05)", borderDark: "rgba(33,150,243,0.2)", borderLight: "rgba(33,150,243,0.15)" },
  "CANDIDATE PROFILE": { icon: "👤", color: "#8b5cf6", bgDark: "rgba(139,92,246,0.08)", bgLight: "rgba(139,92,246,0.05)", borderDark: "rgba(139,92,246,0.2)", borderLight: "rgba(139,92,246,0.15)" },
  "SKILL GAPS": { icon: "⚡", color: "#ef4444", bgDark: "rgba(239,68,68,0.08)", bgLight: "rgba(239,68,68,0.05)", borderDark: "rgba(239,68,68,0.2)", borderLight: "rgba(239,68,68,0.15)" },
  "ROADMAP": { icon: "🗺️", color: "#2196F3", bgDark: "rgba(33,150,243,0.08)", bgLight: "rgba(33,150,243,0.05)", borderDark: "rgba(33,150,243,0.2)", borderLight: "rgba(33,150,243,0.15)" },
  "STRENGTHS": { icon: "💪", color: "#22c55e", bgDark: "rgba(34,197,94,0.08)", bgLight: "rgba(34,197,94,0.05)", borderDark: "rgba(34,197,94,0.2)", borderLight: "rgba(34,197,94,0.15)" },
  "QUICK WINS": { icon: "🎯", color: "#f59e0b", bgDark: "rgba(245,158,11,0.08)", bgLight: "rgba(245,158,11,0.05)", borderDark: "rgba(245,158,11,0.2)", borderLight: "rgba(245,158,11,0.15)" },
  "FULL ANALYSIS": { icon: "📋", color: "#8b5cf6", bgDark: "rgba(139,92,246,0.08)", bgLight: "rgba(139,92,246,0.05)", borderDark: "rgba(139,92,246,0.2)", borderLight: "rgba(139,92,246,0.15)" },
};

function Analysis() {
  const [phase, setPhase] = useState("loading"); // "loading" | "done" | "error"
  const [sections, setSections] = useState({});
  const [rawAnalysis, setRawAnalysis] = useState("");
  const [error, setError] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [company, setCompany] = useState("General");
  const [role, setRole] = useState("Software Engineer");
  const { isDark } = useContext(ThemeContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalysis();
    return () => speechSynthesis.cancel();
  }, []);

  const fetchAnalysis = async () => {
    try {
      const resumeText = localStorage.getItem('resumeText');
      const selectedCompany = localStorage.getItem('selectedCompany') || '';
      const selectedRole = localStorage.getItem('selectedRole') || '';
      setCompany(selectedCompany || "General");
      setRole(selectedRole || "Software Engineer");

      if (!resumeText) {
        setError('No resume found. Please go back and upload your resume first.');
        setPhase("error");
        return;
      }

      const data = await analyzeResume({ resumeText, company: selectedCompany, role: selectedRole });
      setRawAnalysis(data.analysis);
      setSections(parseAnalysis(data.analysis));
      localStorage.setItem("aiRoadmap", data.analysis);
      setPhase("done");

    } catch (err) {
      setError(err.message);
      setPhase("error");
    }
  };

  const handleSpeak = () => {
    if (!rawAnalysis) return;
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(rawAnalysis);
    utterance.rate = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    speechSynthesis.speak(utterance);
  };

  const bg = isDark ? "#0a0a0a" : "#ffffff";
  const textPrimary = isDark ? "#ffffff" : "#0a0a0a";
  const textMuted = isDark ? "#aaaaaa" : "#666666";

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: bg, color: textPrimary }}>
      <ThemeToggle />

      {/* Ambient */}
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none animate-blob-float"
        style={{ background: isDark ? "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)" : "radial-gradient(circle, rgba(33,150,243,0.06) 0%, transparent 70%)" }} />

      <div className="max-w-5xl mx-auto px-6 py-20">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full mb-4"
            style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(33,150,243,0.08)", border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(33,150,243,0.2)"}` }}>
            <span className="text-sm font-medium" style={{ color: textMuted }}>
              🎯 {company} • {role}
            </span>
          </div>
          <h1 className="text-5xl font-black mb-3 tracking-tight" style={{ color: textPrimary }}>
            {phase === "loading" ? "Analyzing Resume..." : "Analysis Complete"}
          </h1>
          <p style={{ color: textMuted }}>
            {phase === "loading" ? "AI is processing your resume..." : "Your personalized career roadmap is ready."}
          </p>
        </motion.div>

        {/* Loading State */}
        <AnimatePresence>
          {phase === "loading" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-32">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-24 h-24 rounded-full flex items-center justify-center mb-8"
                style={{ border: `3px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(33,150,243,0.2)"}`, borderTopColor: isDark ? "#ffffff" : "#2196F3" }}>
                <FaBrain className="text-4xl" style={{ color: isDark ? "#ffffff" : "#2196F3" }} />
              </motion.div>
              <p className="text-xl font-bold mb-2" style={{ color: textPrimary }}>AI is thinking...</p>
              <p className="text-sm" style={{ color: textMuted }}>This usually takes 10–30 seconds</p>
              <div className="flex gap-2 mt-6">
                {["Parsing resume", "Identifying gaps", "Building roadmap", "Finalizing..."].map((step, i) => (
                  <motion.span key={step} initial={{ opacity: 0 }} animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2, delay: i * 0.5 }}
                    className="text-xs px-3 py-1 rounded-full font-medium"
                    style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(33,150,243,0.08)", color: textMuted }}>
                    {step}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence>
          {phase === "error" && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center py-20">
              <FaExclamationTriangle className="text-6xl text-red-400 mb-6" />
              <h2 className="text-2xl font-bold mb-3" style={{ color: textPrimary }}>Analysis Failed</h2>
              <p className="mb-8 max-w-md" style={{ color: textMuted }}>{error}</p>
              <div className="flex gap-4 flex-wrap justify-center">
                <button onClick={() => { setPhase("loading"); setError(""); fetchAnalysis(); }}
                  className="px-6 py-3 rounded-xl font-bold transition-all"
                  style={{ background: isDark ? "#ffffff" : "#2196F3", color: isDark ? "#0a0a0a" : "#ffffff" }}>
                  Retry
                </button>
                <button onClick={() => navigate("/upload")}
                  className="px-6 py-3 rounded-xl font-bold transition-all"
                  style={{ background: "transparent", border: `1px solid ${isDark ? "rgba(255,255,255,0.2)" : "rgba(33,150,243,0.3)"}`, color: textPrimary }}>
                  Re-upload Resume
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {phase === "done" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Section Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {Object.entries(sections).map(([key, content], idx) => {
                  const cfg = sectionConfig[key] || sectionConfig["FULL ANALYSIS"];
                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.15 }}
                      className={`rounded-2xl p-6 ${key === "ROADMAP" || key === "FULL ANALYSIS" ? "md:col-span-2" : ""}`}
                      style={{
                        background: isDark ? cfg.bgDark : cfg.bgLight,
                        border: `1px solid ${isDark ? cfg.borderDark : cfg.borderLight}`,
                      }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">{cfg.icon}</span>
                        <h3 className="text-lg font-bold tracking-wide" style={{ color: cfg.color }}>{key}</h3>
                      </div>
                      <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: isDark ? "#d0d0d0" : "#444444" }}>
                        {content}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={() => navigate("/roadmap")}
                  className="flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all"
                  style={{ background: isDark ? "#ffffff" : "#2196F3", color: isDark ? "#0a0a0a" : "#ffffff", boxShadow: isDark ? "0 8px 24px rgba(255,255,255,0.15)" : "0 8px 24px rgba(33,150,243,0.3)" }}
                >
                  View Full Roadmap <FaArrowRight />
                </button>

                <button
                  onClick={handleSpeak}
                  className="flex items-center gap-3 px-6 py-4 rounded-xl font-bold transition-all"
                  style={{
                    background: isSpeaking ? "rgba(239,68,68,0.15)" : isDark ? "rgba(255,255,255,0.06)" : "rgba(33,150,243,0.08)",
                    border: `1px solid ${isSpeaking ? "rgba(239,68,68,0.3)" : isDark ? "rgba(255,255,255,0.12)" : "rgba(33,150,243,0.2)"}`,
                    color: isSpeaking ? "#ef4444" : textPrimary,
                  }}
                >
                  {isSpeaking ? <FaVolumeMute /> : <FaVolumeUp />}
                  {isSpeaking ? "Stop" : "Listen"}
                </button>

                <button
                  onClick={() => { localStorage.removeItem("selectedCompany"); navigate("/company"); }}
                  className="px-6 py-4 rounded-xl font-bold transition-all"
                  style={{ background: "transparent", border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(33,150,243,0.2)"}`, color: textMuted }}
                >
                  Change Company
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Analysis;
