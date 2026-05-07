import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { FaBrain, FaVolumeUp, FaVolumeMute, FaArrowRight, FaExclamationTriangle, FaArrowLeft, FaSave, FaHome, FaHistory } from "react-icons/fa";
import { analyzeResume, saveHistory } from '../utils/api';

const Star = ({ className, filled = true, size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" className={className}>
    <polygon 
      points="14,2 17,11 26,11 19,17 22,26 14,20 6,26 9,17 2,11 11,11" 
      fill={filled ? "#E8C822" : "none"} 
      stroke="var(--retro-text)" 
      strokeWidth={filled ? "1.5" : "2"}
    />
  </svg>
);

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

  if (Object.keys(sections).length === 0) {
    sections["FULL ANALYSIS"] = text;
  }

  return sections;
}

function Analysis() {
  const [phase, setPhase] = useState("loading"); // "loading" | "done" | "error"
  const [sections, setSections] = useState({});
  const [rawAnalysis, setRawAnalysis] = useState("");
  const [error, setError] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [company, setCompany] = useState("GENERAL");
  const [role, setRole] = useState("SOFTWARE ENGINEER");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalysis();
    return () => speechSynthesis.cancel();
  }, []);

  const handleSaveHistory = async () => {
    try {
      setSaving(true);
      await saveHistory({
        analysis: rawAnalysis,
        company,
        role
      });
      alert("Analysis saved to your profile history!");
    } catch (err) {
      alert(err.message || "Failed to save history.");
    } finally {
      setSaving(false);
    }
  };

  const fetchAnalysis = async () => {
    try {
      const resumeText = localStorage.getItem('resumeText');
      const selectedCompany = localStorage.getItem('selectedCompany') || '';
      const selectedRole = localStorage.getItem('selectedRole') || '';
      setCompany(selectedCompany.toUpperCase() || "GENERAL");
      setRole(selectedRole.toUpperCase() || "SOFTWARE ENGINEER");

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

  return (
    <div className="min-h-screen text-retro-dark font-body selection:bg-retro-yellow selection:text-retro-dark relative overflow-x-hidden p-6 py-12 transition-colors duration-300">
      <Star className="absolute top-10 left-[10%] opacity-70 animate-star" size={28} />
      <Star className="absolute bottom-10 right-[10%] opacity-60 animate-star" size={32} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-12">
            <Link to="/role" className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[2px] text-retro-dark opacity-60 hover:opacity-100 transition-colors">
              <FaArrowLeft size={10} /> Back to Role
            </Link>
            <Link to="/dashboard" className="retro-btn-secondary !py-1.5 !px-3 flex items-center gap-2">
                <FaHome size={12} /> <span className="text-[10px]">DASHBOARD</span>
            </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-[10px] font-black tracking-[3px] opacity-60 text-retro-dark uppercase mb-4">
            ★ STEP 04: ANALYSIS
          </div>
          <div className="inline-block border-2 border-retro-dark bg-[var(--retro-card-bg)] px-4 py-1 text-[11px] font-black uppercase tracking-widest mb-6">
            {company} • {role}
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-black uppercase mb-4 text-retro-dark leading-none">
            {phase === "loading" ? (
              <>AI ENGINE <span className="text-retro-yellow text-stroke-dark">RUNNING</span></>
            ) : (
              <>ANALYSIS <span className="text-retro-yellow text-stroke-dark">COMPLETE</span></>
            )}
          </h1>
        </div>

        {/* Loading State */}
        <AnimatePresence mode="wait">
          {phase === "loading" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 retro-card">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-24 h-24 border-[4px] border-retro-dark flex items-center justify-center mb-10 bg-retro-yellow shadow-[6px_6px_0px_var(--retro-text)]"
              >
                <FaBrain className="text-4xl text-black" />
              </motion.div>
              <h2 className="text-2xl font-display font-black uppercase mb-2 text-retro-dark">Neural Engine Processing</h2>
              <p className="text-sm font-body text-retro-dark opacity-60 mb-10">This usually takes 10–30 seconds...</p>
              
              <div className="flex flex-wrap justify-center gap-3">
                {["PARSING...", "IDENTIFYING GAPS...", "BUILDING ROADMAP...", "FINALIZING..."].map((step, i) => (
                  <motion.span key={step} 
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2, delay: i * 0.5 }}
                    className="text-[10px] px-4 py-2 bg-[var(--retro-text)] text-[var(--retro-bg)] font-black uppercase tracking-widest border-2 border-retro-dark"
                  >
                    {step}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence mode="wait">
          {phase === "error" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center text-center py-20 retro-card !bg-[var(--retro-text)] !text-[var(--retro-bg)]">
              <FaExclamationTriangle className="text-6xl text-retro-yellow mb-8" />
              <h2 className="text-3xl font-display font-black uppercase mb-4">Analysis Failed</h2>
              <p className="mb-10 max-w-md opacity-70 font-body">{error}</p>
              <div className="flex gap-6 flex-wrap justify-center">
                <button onClick={() => { setPhase("loading"); setError(""); fetchAnalysis(); }}
                  className="retro-btn-primary !bg-retro-yellow !text-black !border-retro-yellow">
                  RETRY ENGINE
                </button>
                <button onClick={() => navigate("/upload")}
                  className="retro-btn-secondary !text-[var(--retro-bg)] !border-[var(--retro-bg)] opacity-20 hover:opacity-100 transition-opacity">
                  RE-UPLOAD RESUME
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence mode="wait">
          {phase === "done" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Section Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {Object.entries(sections).map(([key, content], idx) => {
                  const isYellow = key === "SKILL GAPS" || key === "QUICK WINS";
                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`retro-card !p-8 group hover:bg-[var(--retro-card-bg)] ${key === "ROADMAP" || key === "FULL ANALYSIS" ? "md:col-span-2" : ""}`}
                      style={isYellow ? { backgroundColor: '#E8C822', color: '#222' } : {}}
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <div className="text-[32px] font-display font-black leading-none" style={{ color: isYellow ? '#222' : '#E8C822', WebkitTextStroke: '2px var(--retro-text)' }}>
                          ★
                        </div>
                        <h3 className={`text-xl font-display font-black uppercase tracking-tight ${isYellow ? 'text-black' : 'text-retro-dark'}`}>{key}</h3>
                      </div>
                      <div className={`text-sm leading-relaxed whitespace-pre-wrap font-body ${isYellow ? 'text-black opacity-80' : 'text-retro-dark opacity-80'} prose prose-sm max-w-none`}>
                        {content}
                      </div>
                      <Star className="absolute -bottom-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                    </motion.div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-6 justify-center items-center pb-12">
                <button
                  onClick={() => navigate("/roadmap")}
                  className="retro-btn-primary !py-5 !px-10 text-lg flex items-center gap-3"
                >
                  VIEW FULL ROADMAP <FaArrowRight />
                </button>

                <button
                  onClick={handleSpeak}
                  className={`retro-btn-secondary !py-5 !px-8 flex items-center gap-3 ${isSpeaking ? "!bg-[var(--retro-text)] !text-[var(--retro-bg)]" : ""}`}
                >
                  {isSpeaking ? <FaVolumeMute /> : <FaVolumeUp />}
                  {isSpeaking ? "STOP AUDIO" : "LISTEN TO AI"}
                </button>

                <button
                  onClick={() => { localStorage.removeItem("selectedCompany"); navigate("/company"); }}
                  className="text-[11px] font-black uppercase tracking-[2px] text-retro-dark opacity-60 hover:opacity-100 transition-colors"
                >
                  CHANGE TARGET
                </button>

                <button
                  onClick={handleSaveHistory}
                  disabled={saving}
                  className="retro-btn-secondary !py-5 !px-8 flex items-center gap-3 !bg-retro-yellow !text-black border-retro-yellow"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent animate-spin rounded-full" />
                  ) : (
                    <FaSave />
                  )}
                  {saving ? "SAVING..." : "SAVE TO HISTORY"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Analysis;
