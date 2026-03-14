import React, { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaChartLine, FaBrain } from "react-icons/fa";
import { ThemeToggle } from '../components/ThemeToggle';
import { ThemeContext } from '../context/ThemeContext';
import { analyzeResume } from '../utils/api';

function Analysis() {
  const [analyzing, setAnalyzing] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { isDark } = useContext(ThemeContext);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const fetchAnalysis = async () => {
    try {
      const resumeText = localStorage.getItem('resumeText');
      const company = localStorage.getItem('selectedCompany') || '';

      if (!resumeText) {
        setError('Please go back and upload your resume first.');
        setLoading(false);
        setAnalyzing(false);
        return;
      }

      const data = await analyzeResume({ resumeText, company });

      setAnalysis(data.analysis);
      setLoading(false);
      setAnalyzing(false);

    } catch (err) {
      setError(err.message);
      setLoading(false);
      setAnalyzing(false);
    }
  };

  const handleSpeakRoadmap = () => {
    if (!analysis) return;

    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(analysis);
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    speechSynthesis.speak(utterance);
  };

  const handleViewRoadmap = () => {
    const roadmapText = analysis;
    localStorage.setItem("aiRoadmap", roadmapText);
    navigate("/roadmap");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: isDark ? "#0a0a0a" : "#ffffff" }}>
        <p style={{ color: isDark ? "#ffffff" : "#0a0a0a" }}>Analyzing your resume...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: isDark ? "#0a0a0a" : "#ffffff" }}>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );

  return (
    <div className="min-h-screen overflow-hidden relative font-sans flex items-center justify-center p-6"
      style={{
        backgroundColor: isDark ? "#0a0a0a" : "#ffffff",
        color: isDark ? "#ffffff" : "#0a0a0a"
      }}>

      <ThemeToggle />

      {/* Ambient light */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none animate-blob-float" style={{
        background: isDark
          ? "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)"
          : "radial-gradient(circle, rgba(33,150,243,0.08) 0%, transparent 70%)"
      }}></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none animate-blob-float" style={{
        background: isDark
          ? "radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)"
          : "radial-gradient(circle, rgba(33,150,243,0.05) 0%, transparent 70%)",
        animationDelay: "5s"
      }}></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-5xl glass-card rounded-[2.5rem] p-12 relative z-10 flex flex-col items-center card-3d"
      >

        <div className="mb-12 relative">
          <div
            className="w-32 h-32 rounded-full flex items-center justify-center mx-auto"
            style={{
              background: isDark ? "rgba(255,255,255,0.04)" : "rgba(33,150,243,0.08)",
              border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(33,150,243,0.2)"
            }}
          >
            {analyzing ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              >
                <FaBrain className="text-5xl" style={{ color: isDark ? "#ffffff" : "#0a0a0a" }} />
              </motion.div>
            ) : (
              <FaChartLine className="text-5xl" style={{ color: isDark ? "#ffffff" : "#0a0a0a" }} />
            )}
          </div>
        </div>

        <h1 className="text-4xl font-black mb-6 text-center" style={{ color: isDark ? "#ffffff" : "#0a0a0a" }}>
          {analyzing ? "Analyzing Resume..." : "Analysis Complete"}
        </h1>

        {!analyzing && analysis && (
          <div className="glass-card p-8 rounded-2xl text-center mb-10 w-full max-h-64 overflow-y-auto" style={{
            background: isDark ? "rgba(255,255,255,0.03)" : "rgba(33,150,243,0.04)",
            borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(33,150,243,0.15)",
            color: isDark ? "#e0e0e0" : "#333333"
          }}>
            <p>{analysis}</p>
          </div>
        )}

        {!analyzing && (
          <div className="flex flex-col gap-4 w-full">
            <button
              onClick={() => navigate('/preparation')}
              className="px-12 py-4 rounded-xl font-bold transition-all duration-300 tracking-wide"
              style={{
                background: "transparent",
                border: isDark ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(33,150,243,0.3)",
                color: isDark ? "#ffffff" : "#0a0a0a"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = isDark ? "#ffffff" : "#2196F3";
                e.currentTarget.style.color = isDark ? "#0a0a0a" : "#ffffff";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = isDark ? "#ffffff" : "#0a0a0a";
              }}
            >
              Continue
            </button>

            <button
              className="px-12 py-4 rounded-xl font-bold transition-all duration-300 tracking-wide"
              style={{
                background: isSpeaking ? "#ef4444" : isDark ? "rgba(0,212,255,0.2)" : "rgba(33,150,243,0.2)",
                color: isDark ? "#00ffff" : "#2196F3",
                border: isDark ? "1px solid rgba(0,212,255,0.3)" : "1px solid rgba(33,150,243,0.3)"
              }}
              onClick={handleSpeakRoadmap}
            >
              {isSpeaking ? 'Stop Audio' : 'Listen to AI Roadmap'}
            </button>

            <button
              className="px-12 py-4 rounded-xl font-bold transition-all duration-300 tracking-wide"
              style={{
                background: isDark ? "rgba(34,197,94,0.2)" : "rgba(34,197,94,0.15)",
                color: isDark ? "#22c55e" : "#15803d",
                border: isDark ? "1px solid rgba(34,197,94,0.4)" : "1px solid rgba(34,197,94,0.3)"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = isDark ? "#22c55e" : "#15803d";
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = isDark ? "rgba(34,197,94,0.2)" : "rgba(34,197,94,0.15)";
                e.currentTarget.style.color = isDark ? "#22c55e" : "#15803d";
              }}
              onClick={handleViewRoadmap}
            >
              View Roadmap
            </button>
          </div>
        )}

      </motion.div>

    </div>
  );
}

export default Analysis;