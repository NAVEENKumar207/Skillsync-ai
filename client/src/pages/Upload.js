import { useState, useContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaCloudUploadAlt, FaFilePdf, FaCheckCircle, FaTimesCircle, FaKeyboard } from "react-icons/fa";
import { ThemeToggle } from "../components/ThemeToggle";
import { ThemeContext } from "../context/ThemeContext";

function Upload() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("file"); // "file" | "paste"
  const [pastedText, setPastedText] = useState("");
  const { isDark } = useContext(ThemeContext);
  const navigate = useNavigate();
  const fileRef = useRef();

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    setError("");

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Only PDF, DOC, DOCX, or TXT files are allowed.");
      return;
    }
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    setError("");

    if (mode === "paste") {
      if (!pastedText.trim() || pastedText.trim().length < 50) {
        setError("Please paste at least 50 characters of resume text.");
        return;
      }
      localStorage.setItem("resumeText", pastedText.trim());
      navigate("/company");
      return;
    }

    if (!file) return;
    setUploading(true);
    setProgress(0);

    try {
      // Animate progress while uploading
      const progressTimer = setInterval(() => {
        setProgress((p) => Math.min(p + 3, 85));
      }, 80);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressTimer);
      setProgress(95);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to parse file.");
      }

      localStorage.setItem("resumeText", data.text);
      setProgress(100);

      setTimeout(() => {
        setUploading(false);
        navigate("/company");
      }, 800);
    } catch (err) {
      setUploading(false);
      setProgress(0);
      setError(err.message);
    }
  };

  const accentColor = isDark ? "rgba(255,255,255,0.12)" : "rgba(33,150,243,0.15)";
  const accentStrong = isDark ? "#ffffff" : "#2196F3";
  const textPrimary = isDark ? "#ffffff" : "#0a0a0a";
  const textMuted = isDark ? "#aaaaaa" : "#555555";
  const bg = isDark ? "#0a0a0a" : "#ffffff";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans"
      style={{ backgroundColor: bg, color: textPrimary }}
    >
      <ThemeToggle />

      {/* Ambient light */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none animate-blob-float"
        style={{ background: isDark ? "radial-gradient(circle, rgba(255,255,255,0.025) 0%, transparent 70%)" : "radial-gradient(circle, rgba(33,150,243,0.08) 0%, transparent 70%)" }} />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none animate-blob-float"
        style={{ background: isDark ? "radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)" : "radial-gradient(circle, rgba(33,150,243,0.05) 0%, transparent 70%)", animationDelay: "5s" }} />

      {/* Upload Card */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 glass-card p-10 w-full max-w-2xl rounded-[2.5rem] flex flex-col items-center card-3d mx-4"
      >
        <motion.h2
          className="text-4xl font-extrabold text-center mb-2 tracking-tight"
          style={{ color: textPrimary }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Upload Your Resume
        </motion.h2>
        <p className="text-sm mb-8 text-center" style={{ color: textMuted }}>
          Let AI analyze your skills and build your personalized learning roadmap.
        </p>

        {/* Mode Toggle */}
        <div className="flex rounded-xl p-1 mb-8 w-full max-w-xs"
          style={{ background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}>
          {[
            { key: "file", label: "📎 Upload File" },
            { key: "paste", label: "⌨️ Paste Text" },
          ].map((m) => (
            <button
              key={m.key}
              onClick={() => { setMode(m.key); setError(""); }}
              className="flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200"
              style={{
                background: mode === m.key ? (isDark ? "#ffffff" : "#2196F3") : "transparent",
                color: mode === m.key ? (isDark ? "#0a0a0a" : "#ffffff") : textMuted,
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full mb-4 px-4 py-3 rounded-xl text-sm font-medium text-center"
              style={{ color: "#ef4444", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {mode === "file" ? (
            <motion.div key="file-mode" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
              {/* Drag & Drop */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFile(e.dataTransfer.files[0]); }}
                onClick={() => !file && fileRef.current?.click()}
                className="w-full rounded-[2rem] p-10 text-center transition-all duration-300 relative overflow-hidden flex flex-col items-center justify-center min-h-[220px] cursor-pointer"
                style={{
                  borderWidth: "1px", borderStyle: "dashed",
                  borderColor: dragActive ? accentStrong : isDark ? "rgba(255,255,255,0.12)" : "rgba(33,150,243,0.15)",
                  background: dragActive ? (isDark ? "rgba(255,255,255,0.04)" : "rgba(33,150,243,0.06)") : (isDark ? "rgba(255,255,255,0.02)" : "rgba(33,150,243,0.02)"),
                }}
              >
                <input ref={fileRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.txt" onChange={(e) => handleFile(e.target.files[0])} />

                <AnimatePresence mode="wait">
                  {!file ? (
                    <motion.div key="no-file" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex flex-col items-center">
                      <div className="w-20 h-20 mb-5 rounded-full flex items-center justify-center"
                        style={{ background: isDark ? "rgba(255,255,255,0.05)" : "rgba(33,150,243,0.1)", border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(33,150,243,0.2)"}` }}>
                        <FaCloudUploadAlt className="text-4xl" style={{ color: isDark ? "#aaaaaa" : "#555555" }} />
                      </div>
                      <p className="text-lg font-bold mb-1" style={{ color: textPrimary }}>Drop your resume here</p>
                      <p className="text-sm" style={{ color: textMuted }}>or click to browse — PDF, DOC, DOCX, TXT</p>
                    </motion.div>
                  ) : (
                    <motion.div key="has-file" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex flex-col items-center w-full">
                      <div className="w-20 h-20 mb-4 rounded-full flex items-center justify-center"
                        style={{ background: isDark ? "rgba(34,197,94,0.1)" : "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)" }}>
                        <FaFilePdf className="text-4xl" style={{ color: "#22c55e" }} />
                      </div>
                      <p className="text-lg font-bold mb-1 truncate w-full px-4 text-center" style={{ color: textPrimary }}>{file.name}</p>
                      <p className="text-sm font-medium mb-4 flex items-center gap-2" style={{ color: "#22c55e" }}>
                        <FaCheckCircle /> Ready — {(file.size / 1024).toFixed(1)} KB
                      </p>
                      <button
                        onClick={(e) => { e.stopPropagation(); setFile(null); setError(""); }}
                        className="px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
                        style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444" }}
                      >
                        <FaTimesCircle /> Remove
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <motion.div key="paste-mode" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste your resume content here... (Name, Skills, Experience, Education, Projects...)"
                rows={10}
                className="w-full rounded-2xl p-5 text-sm font-mono resize-none transition-all duration-200"
                style={{
                  background: isDark ? "rgba(255,255,255,0.04)" : "rgba(33,150,243,0.03)",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(33,150,243,0.15)"}`,
                  color: textPrimary, outline: "none", lineHeight: 1.7,
                }}
                onFocus={(e) => e.target.style.borderColor = accentStrong}
                onBlur={(e) => e.target.style.borderColor = isDark ? "rgba(255,255,255,0.12)" : "rgba(33,150,243,0.15)"}
              />
              <p className="text-xs mt-2 text-right" style={{ color: textMuted }}>
                {pastedText.length} characters
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Analyze Button */}
        <AnimatePresence>
          {((mode === "file" && file) || (mode === "paste" && pastedText.length >= 50)) && !uploading && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onClick={handleUpload}
              className="mt-8 w-full py-4 rounded-xl transition-all duration-300 font-bold text-lg tracking-wide"
              style={{
                background: isDark ? "#ffffff" : "#2196F3",
                color: isDark ? "#0a0a0a" : "#ffffff",
                boxShadow: isDark ? "0 8px 24px rgba(255,255,255,0.15)" : "0 8px 24px rgba(33,150,243,0.3)",
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              🚀 Analyze My Resume
            </motion.button>
          )}
        </AnimatePresence>

        {/* Progress Bar */}
        <AnimatePresence>
          {uploading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8 w-full"
            >
              <div className="flex justify-between text-sm font-bold mb-3 px-1" style={{ color: textMuted }}>
                <span>{progress < 90 ? "Extracting text..." : progress < 100 ? "Processing..." : "✓ Done!"}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full rounded-full h-2 overflow-hidden relative" style={{ background: isDark ? "rgba(255,255,255,0.1)" : "rgba(33,150,243,0.15)" }}>
                <motion.div
                  className="absolute top-0 left-0 h-full rounded-full"
                  style={{ background: isDark ? "linear-gradient(90deg, #00ffff, #0099ff)" : "linear-gradient(90deg, #2196F3, #1976D2)" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default Upload;
