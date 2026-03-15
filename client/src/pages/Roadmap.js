import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "../components/ThemeToggle";
import { ThemeContext } from "../context/ThemeContext";
import "../styles/Roadmap.css";

const Roadmap = () => {
  const [roadmap, setRoadmap] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { isDark } = useContext(ThemeContext);
  const navigate = useNavigate();

  useEffect(() => {
    const savedRoadmap = localStorage.getItem("aiRoadmap");
    if (savedRoadmap) {
      setRoadmap(savedRoadmap);
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleSpeak = (voiceGender) => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(roadmap);
      const voices = speechSynthesis.getVoices();
      if (voiceGender === 'male') {
        utterance.voice = voices.find(voice => voice.name.includes('Google US English Male')) || voices.find(voice => voice.name.includes('Male') && voice.lang.startsWith('en'));
      } else {
        utterance.voice = voices.find(voice => voice.name.includes('Google US English Female')) || voices.find(voice => voice.name.includes('Female') && voice.lang.startsWith('en'));
      }
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="roadmap-container" style={{ 
      backgroundColor: isDark ? "#0a0a0a" : "#ffffff",
      background: isDark 
        ? "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)"
        : "linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)",
      color: isDark ? "#ffffff" : "#0a0a0a"
    }}>
      <ThemeToggle />
      <div className="roadmap-card card-3d" style={{
        background: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(33, 150, 243, 0.06)",
        borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(33, 150, 243, 0.2)"
      }}>
        <h1 className="roadmap-title neon-glow" style={{ color: isDark ? "#ffffff" : "#0a0a0a" }}>
          AI Career Roadmap
        </h1>
        <div className="roadmap-content" style={{
          background: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(33, 150, 243, 0.04)",
          borderColor: isDark ? "rgba(0, 212, 255, 0.2)" : "rgba(33, 150, 243, 0.3)",
          color: isDark ? "#e0e0e0" : "#333333"
        }}>
          <p>{roadmap}</p>
        </div>
        <div className="roadmap-buttons">
          <button
            className="btn-speak"
            onClick={() => handleSpeak('male')}
            disabled={!roadmap}
            style={{
              background: isDark 
                ? "linear-gradient(135deg, #00d4ff, #0099ff)"
                : "linear-gradient(135deg, #2196F3, #1976D2)",
              color: isDark ? "#000" : "#fff",
              boxShadow: isDark
                ? "0 4px 15px rgba(0, 212, 255, 0.3)"
                : "0 4px 15px rgba(33, 150, 243, 0.3)"
            }}
          >
            {isSpeaking ? "Stop Audio" : "🔊 Read (Male)"}
          </button>
          <button
            className="btn-speak"
            onClick={() => handleSpeak('female')}
            disabled={!roadmap}
            style={{
              background: isDark 
                ? "linear-gradient(135deg, #ff00d4, #ff0099)"
                : "linear-gradient(135deg, #F321AB, #D21976)",
              color: isDark ? "#000" : "#fff",
              boxShadow: isDark
                ? "0 4px 15px rgba(255, 0, 212, 0.3)"
                : "0 4px 15px rgba(243, 33, 171, 0.3)"
            }}
          >
            {isSpeaking ? "Stop Audio" : "🔊 Read (Female)"}
          </button>
          <button className="btn-home" onClick={handleBackToHome} style={{
            borderColor: isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(33, 150, 243, 0.3)",
            color: isDark ? "#ffffff" : "#0a0a0a"
          }}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
