import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { FaVolumeUp, FaVolumeMute, FaHome, FaDownload, FaSync, FaArrowLeft, FaSave } from "react-icons/fa";
import { getUser, saveHistory } from "../utils/api";
import jsPDF from "jspdf";
import "jspdf-autotable";

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

// Convert plain AI text to structured cards
function parseRoadmap(text) {
  const sections = [];
  const parts = text.split(/##\s+/g).filter(Boolean);

  if (parts.length > 1) {
    parts.forEach((part) => {
      const lines = part.trim().split("\n");
      const title = lines[0].trim();
      const content = lines.slice(1).join("\n").trim();
      sections.push({ title, content });
    });
  } else {
    sections.push({ title: "AI Career Roadmap", content: text });
  }

  return sections;
}

const Roadmap = () => {
  const [sections, setSections] = useState([]);
  const [rawText, setRawText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const user = getUser();

  const handleSaveHistory = async () => {
    try {
      setSaving(true);
      const company = localStorage.getItem("selectedCompany") || "GENERAL";
      const role = localStorage.getItem("selectedRole") || "SOFTWARE ENGINEER";
      
      await saveHistory({
        analysis: rawText,
        company,
        role
      });
      alert("Roadmap saved to your profile history!");
    } catch (err) {
      alert(err.message || "Failed to save history.");
    } finally {
      setSaving(false);
    }
  };

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

    const cleanText = rawText
      .replace(/##/g, "")
      .replace(/\*\*/g, "")
      .replace(/###/g, "")
      .replace(/^- /gm, "")
      .replace(/_/g, " ")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
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
      utterance.onerror = () => setIsSpeaking(false);
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

    const drawText = (text, x, y, size, style = "normal", color = [34, 34, 34]) => {
      doc.setFont("helvetica", style);
      doc.setFontSize(size);
      doc.setTextColor(color[0], color[1], color[2]);
      
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

    doc.setFillColor(34, 34, 34);
    doc.rect(0, 0, pageWidth, 50, "F");
    
    doc.setTextColor(232, 200, 34);
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.text("SKILLSYNC AI REPORT", margin, 30);
    
    let currentY = 65;
    doc.setTextColor(34, 34, 34);
    doc.setFontSize(10);
    doc.text(`Candidate: ${user?.name || "User"}`, margin, currentY);
    currentY += 15;

    sections.forEach((sec, i) => {
      if (currentY > pageHeight - 40) {
        doc.addPage();
        currentY = 25;
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(`${i+1}. ${sec.title.toUpperCase()}`, margin, currentY);
      currentY += 8;
      currentY = drawText(sec.content, margin, currentY, 10);
      currentY += 10;
    });

    doc.save(`SkillSync-Roadmap.pdf`);
  };

  return (
    <div className="min-h-screen text-retro-dark font-body selection:bg-retro-yellow selection:text-retro-dark relative overflow-x-hidden p-6 py-12 transition-colors duration-300">
      <Star className="absolute top-10 right-[5%] opacity-70 animate-star" size={28} />
      <Star className="absolute bottom-20 left-[5%] opacity-60 animate-star" size={32} />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-12">
            <Link to="/analysis" className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[2px] text-retro-dark opacity-60 hover:opacity-100 transition-colors">
              <FaArrowLeft size={10} /> Back to Analysis
            </Link>
            <Link to="/dashboard" className="retro-btn-secondary !py-1.5 !px-3 flex items-center gap-2">
                <FaHome size={12} /> <span className="text-[10px]">DASHBOARD</span>
            </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-20">
          <div className="text-[10px] font-black tracking-[3px] opacity-60 text-retro-dark uppercase mb-4">
            ★ FINAL STEP: GROWTH
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-black uppercase mb-4 text-retro-dark leading-none">
            Your Career <span className="text-retro-yellow text-stroke-dark">Roadmap</span>
          </h1>
          <p className="text-sm md:text-base text-retro-dark opacity-80 max-w-xl mx-auto leading-relaxed">
            A personalized step-by-step evolution plan designed by AI to bridge your current gaps.
          </p>
        </div>

        {/* Timeline Roadmap */}
        <div className="relative mb-20">
          {/* Vertical Line */}
          <div className="absolute left-[20px] md:left-[40px] top-0 bottom-0 w-[2px] bg-retro-dark z-0" />

          <div className="space-y-12">
            {sections.map((sec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative pl-16 md:pl-28"
              >
                {/* Number Circle */}
                <div className="absolute left-0 md:left-[15px] top-0 w-[42px] h-[42px] md:w-[52px] md:h-[52px] bg-retro-yellow border-2 border-retro-dark z-10 flex items-center justify-center shadow-[4px_4px_0px_var(--retro-text)]">
                  <span className="font-display font-black text-xl md:text-2xl text-black leading-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className={`retro-card group hover:bg-[var(--retro-card-bg)] transition-all ${i === 0 ? "!bg-[var(--retro-text)] !text-[var(--retro-bg)]" : ""}`}>
                  <h3 className={`text-xl font-display font-black uppercase mb-4 ${i === 0 ? "text-retro-yellow" : "text-retro-dark"}`}>
                    {sec.title}
                  </h3>
                  <div className={`text-sm md:text-base leading-relaxed whitespace-pre-wrap font-body ${i === 0 ? "opacity-80" : "text-retro-dark opacity-80"}`}>
                    {sec.content}
                  </div>
                  <Star className="absolute -bottom-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-6 justify-center items-center pb-20 border-t-2 border-retro-dark pt-12">
          <button onClick={() => handleSpeak("male")} className="retro-btn-secondary !py-4 !px-6 flex items-center gap-2">
            {isSpeaking ? <FaVolumeMute /> : <FaVolumeUp />}
            <span className="text-[10px] font-black tracking-widest uppercase">🔊 MALE AI</span>
          </button>

          <button onClick={() => handleSpeak("female")} className="retro-btn-secondary !py-4 !px-6 flex items-center gap-2">
            {isSpeaking ? <FaVolumeMute /> : <FaVolumeUp />}
            <span className="text-[10px] font-black tracking-widest uppercase">🔊 FEMALE AI</span>
          </button>

          <button onClick={handleDownload} className="retro-btn-primary !py-4 !px-8 flex items-center gap-3">
            <FaDownload /> DOWNLOAD PDF
          </button>

          <button
            onClick={handleSaveHistory}
            disabled={saving}
            className="retro-btn-secondary !py-4 !px-8 flex items-center gap-3 !bg-retro-yellow !text-black border-retro-yellow"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent animate-spin rounded-full" />
            ) : (
              <FaSave />
            )}
            {saving ? "SAVING..." : "SAVE TO HISTORY"}
          </button>

          <button onClick={() => navigate("/dashboard")} className="retro-btn-secondary !py-4 !px-8 flex items-center gap-3 !bg-[var(--retro-text)] !text-[var(--retro-bg)]">
            <FaHome /> DASHBOARD
          </button>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;