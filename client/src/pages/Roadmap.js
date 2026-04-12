import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaVolumeUp, FaVolumeMute, FaHome, FaDownload, FaSync } from "react-icons/fa";
import { ThemeToggle } from "../components/ThemeToggle";
import { ThemeContext } from "../context/ThemeContext";
import { getUser } from "../utils/api";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Convert plain AI text to structured cards
function parseRoadmap(text) {
  const sections = [];
  const parts = text.split(/##\s+/g).filter(Boolean);

  if (parts.length > 1) {
    parts.forEach((part) => {
      const lines = part.trim().split("\n");
      const title = lines[0].trim();
      const content = lines.slice(1).join("\n").trim();
      const emojis = {
        "TARGET": "🎯",
        "PROFILE": "👤",
        "SKILL GAP": "⚡",
        "ROADMAP": "🗺️",
        "STRENGTH": "💪",
        "QUICK WIN": "🎯",
      };
      const emoji = Object.entries(emojis).find(([k]) => title.toUpperCase().includes(k))?.[1] || "📌";
      sections.push({ title, content, emoji });
    });
  } else {
    // Fallback: treat as a single block and split by numbered lines
    sections.push({ title: "AI Career Roadmap", content: text, emoji: "🗺️" });
  }

  return sections;
}

const Roadmap = () => {
  const [sections, setSections] = useState([]);
  const [rawText, setRawText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const { isDark } = useContext(ThemeContext);
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    const savedRoadmap = localStorage.getItem("aiRoadmap");
    if (savedRoadmap) {
      setRawText(savedRoadmap);
      setSections(parseRoadmap(savedRoadmap));
    } else {
      navigate("/");
    }
    return () => speechSynthesis.cancel();
  }, [navigate]);

  const handleSpeak = (gender = "default") => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!rawText) return;

    // Clean markdown for smoother speech
    const cleanText = rawText
      .replace(/##/g, "")
      .replace(/\*\*/g, "")
      .replace(/###/g, "")
      .replace(/^- /gm, "")
      .replace(/_/g, " ")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Ensure voices are loaded
    let voices = window.speechSynthesis.getVoices();
    
    const setVoice = () => {
      voices = window.speechSynthesis.getVoices();
      if (gender === "male") {
        utterance.voice = voices.find((v) => (v.name.includes("Male") || v.name.includes("David") || v.name.includes("James")) && v.lang.startsWith("en")) || voices[0];
      } else {
        utterance.voice = voices.find((v) => (v.name.includes("Female") || v.name.includes("Zira") || v.name.includes("Samantha")) && v.lang.startsWith("en")) || voices[1] || voices[0];
      }
    };

    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        setVoice();
        startSpeaking();
      };
    } else {
      setVoice();
      startSpeaking();
    }

    function startSpeaking() {
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (e) => {
        console.error("Speech error:", e);
        setIsSpeaking(false);
      };
      
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    // Helper: Clean markdown and handle long text with page breaks
    const drawText = (text, x, y, size, style = "normal", color = [60, 60, 60]) => {
      doc.setFont("helvetica", style);
      doc.setFontSize(size);
      doc.setTextColor(color[0], color[1], color[2]);
      
      // Basic markdown cleaning
      const cleanText = text.replace(/\*\*/g, "").replace(/###/g, "").replace(/^- /gm, "• ").trim();
      const lines = doc.splitTextToSize(cleanText, contentWidth);
      
      lines.forEach(line => {
        if (y > pageHeight - 25) {
          doc.addPage();
          y = 25;
        }
        doc.text(line, x, y);
        y += size * 0.5;
      });
      return y + 5;
    };

    // --- PAGE 1: HEADER & INFO ---
    doc.setFillColor(15, 23, 42); // Deep blue-gray
    doc.rect(0, 0, pageWidth, 50, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.text("SKILLSYNC AI", margin, 25);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(200, 200, 200);
    doc.text("PERSONALIZED CAREER TRANSFORMATION REPORT", margin, 34);

    let currentY = 65;

    // User Profile Section
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("REPORT OVERVIEW", margin, currentY);
    currentY += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text(`Candidate Name:`, margin, currentY);
    doc.setFont("helvetica", "bold");
    doc.text(`${user?.name || "User"}`, margin + 40, currentY);
    currentY += 6;

    const selectedCompany = localStorage.getItem("selectedCompany");
    const selectedRole = localStorage.getItem("selectedRole");
    
    if (selectedCompany) {
      doc.setFont("helvetica", "normal");
      doc.text(`Target Company:`, margin, currentY);
      doc.setFont("helvetica", "bold");
      doc.text(`${selectedCompany}`, margin + 40, currentY);
      currentY += 6;
    }

    if (selectedRole) {
      doc.setFont("helvetica", "normal");
      doc.text(`Target Role:`, margin, currentY);
      doc.setFont("helvetica", "bold");
      doc.text(`${selectedRole}`, margin + 40, currentY);
      currentY += 6;
    }

    // AI Candidate Profile Section
    const profileSection = sections.find(s => s.title.toUpperCase().includes("PROFILE"));
    if (profileSection) {
      currentY += 10;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text("CANDIDATE SUMMARY (FROM RESUME)", margin, currentY);
      currentY += 8;
      currentY = drawText(profileSection.content, margin, currentY, 10, "normal", [100, 100, 100]);
    }

    doc.setDrawColor(230, 230, 230);
    doc.line(margin, currentY + 5, pageWidth - margin, currentY + 5);
    currentY += 15;

    // --- ROADMAP SECTIONS ---
    sections.filter(s => !s.title.toUpperCase().includes("PROFILE") && !s.title.toUpperCase().includes("TARGET")).forEach((sec) => {
      // Section Header with background
      if (currentY > pageHeight - 40) {
        doc.addPage();
        currentY = 25;
      }

      let accentColor = [139, 92, 246]; // Purple
      if (sec.title.toUpperCase().includes("GAP")) accentColor = [220, 38, 38]; // Red
      else if (sec.title.toUpperCase().includes("ROADMAP")) accentColor = [37, 99, 235]; // Blue
      else if (sec.title.toUpperCase().includes("STRENGTH")) accentColor = [22, 163, 74]; // Green
      else if (sec.title.toUpperCase().includes("WIN")) accentColor = [217, 119, 6]; // Amber

      doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.rect(margin, currentY - 5, 3, 10, "F");
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.text(sec.title.toUpperCase(), margin + 6, currentY);
      currentY += 10;

      // Section Content
      currentY = drawText(sec.content, margin + 6, currentY, 10, "normal", [40, 40, 40]);
      currentY += 10;
    });

    // Footer with Page Numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("This roadmap was generated by SkillSync AI using real-time career analysis.", pageWidth / 2, pageHeight - 15, { align: "center" });
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 10, pageHeight - 15);
    }

    doc.save(`SkillSync-Report-${user?.name?.replace(/\s+/g, "-") || "User"}.pdf`);
  };

  const bg = isDark ? "#0a0a0a" : "#f5f7fa";
  const textPrimary = isDark ? "#ffffff" : "#0a0a0a";
  const textMuted = isDark ? "#aaaaaa" : "#666666";

  const sectionColors = [
    { color: "#ef4444", bg: isDark ? "rgba(239,68,68,0.08)" : "rgba(239,68,68,0.05)", border: isDark ? "rgba(239,68,68,0.2)" : "rgba(239,68,68,0.15)" },
    { color: "#2196F3", bg: isDark ? "rgba(33,150,243,0.08)" : "rgba(33,150,243,0.05)", border: isDark ? "rgba(33,150,243,0.2)" : "rgba(33,150,243,0.15)" },
    { color: "#22c55e", bg: isDark ? "rgba(34,197,94,0.08)" : "rgba(34,197,94,0.05)", border: isDark ? "rgba(34,197,94,0.2)" : "rgba(34,197,94,0.15)" },
    { color: "#f59e0b", bg: isDark ? "rgba(245,158,11,0.08)" : "rgba(245,158,11,0.05)", border: isDark ? "rgba(245,158,11,0.2)" : "rgba(245,158,11,0.15)" },
    { color: "#8b5cf6", bg: isDark ? "rgba(139,92,246,0.08)" : "rgba(139,92,246,0.05)", border: isDark ? "rgba(139,92,246,0.2)" : "rgba(139,92,246,0.15)" },
  ];

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: bg, color: textPrimary }}>
      <ThemeToggle />

      {/* Ambient blobs */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-30"
        style={{ background: isDark ? "radial-gradient(circle, rgba(33,150,243,0.15) 0%, transparent 70%)" : "radial-gradient(circle, rgba(33,150,243,0.08) 0%, transparent 70%)", transform: "translate(-30%, -30%)" }} />

      <div className="max-w-5xl mx-auto px-6 py-20">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight neon-glow" style={{ color: textPrimary }}>
            Your Career <span className="text-gradient">Roadmap</span>
          </h1>
          <p style={{ color: textMuted }}>AI-generated personalized learning path based on your resume analysis.</p>
        </motion.div>

        {/* Section Nav */}
        {sections.length > 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-3 justify-center mb-10">
            {sections.map((sec, i) => (
              <button key={i} onClick={() => setActiveSection(i)}
                className="px-4 py-2 rounded-full text-sm font-bold transition-all duration-200"
                style={{
                  background: activeSection === i ? (sectionColors[i % sectionColors.length].color) : "transparent",
                  border: `1px solid ${sectionColors[i % sectionColors.length].border}`,
                  color: activeSection === i ? "#ffffff" : sectionColors[i % sectionColors.length].color,
                }}>
                {sec.emoji} {sec.title}
              </button>
            ))}
          </motion.div>
        )}

        {/* Active Section Content */}
        <AnimatePresence mode="wait">
          {sections.map((sec, i) => (
            activeSection === i && (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="rounded-3xl p-8 mb-8"
                style={{ background: sectionColors[i % sectionColors.length].bg, border: `1px solid ${sectionColors[i % sectionColors.length].border}` }}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">{sec.emoji}</span>
                  <h2 className="text-2xl font-bold" style={{ color: sectionColors[i % sectionColors.length].color }}>
                    {sec.title}
                  </h2>
                </div>
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans" style={{ color: isDark ? "#d0d0d0" : "#444444" }}>
                    {sec.content}
                  </pre>
                </div>
              </motion.div>
            )
          ))}
        </AnimatePresence>

        {/* If only one section (raw text), show it */}
        {sections.length === 1 && sections[0].title === "AI Career Roadmap" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl p-8 mb-8"
            style={{ background: isDark ? "rgba(33,150,243,0.06)" : "rgba(33,150,243,0.04)", border: `1px solid ${isDark ? "rgba(33,150,243,0.15)" : "rgba(33,150,243,0.12)"}` }}>
            <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans" style={{ color: isDark ? "#d0d0d0" : "#444444" }}>
              {rawText}
            </pre>
          </motion.div>
        )}

        {/* Controls */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-4 justify-center">

          <button onClick={() => handleSpeak("male")}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all"
            style={{ background: isDark ? "rgba(33,150,243,0.15)" : "rgba(33,150,243,0.1)", border: "1px solid rgba(33,150,243,0.3)", color: "#2196F3" }}>
            {isSpeaking ? <FaVolumeMute /> : <FaVolumeUp />}
            {isSpeaking ? "Stop" : "🔊 Male Voice"}
          </button>

          <button onClick={() => handleSpeak("female")}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all"
            style={{ background: isDark ? "rgba(236,72,153,0.15)" : "rgba(236,72,153,0.08)", border: "1px solid rgba(236,72,153,0.3)", color: "#ec4899" }}>
            {isSpeaking ? <FaVolumeMute /> : <FaVolumeUp />}
            {isSpeaking ? "Stop" : "🔊 Female Voice"}
          </button>

          <button onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all"
            style={{ background: isDark ? "rgba(34,197,94,0.12)" : "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e" }}>
            <FaDownload /> Download
          </button>

          <button onClick={() => navigate("/analysis")}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all"
            style={{ background: "transparent", border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`, color: textMuted }}>
            <FaSync /> Re-analyze
          </button>

          <button onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all"
            style={{ background: isDark ? "#ffffff" : "#0a0a0a", color: isDark ? "#0a0a0a" : "#ffffff" }}>
            <FaHome /> Dashboard
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Roadmap;
