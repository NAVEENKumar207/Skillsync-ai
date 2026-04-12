import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { FaCloudUploadAlt, FaFilePdf, FaCheckCircle, FaTimesCircle, FaArrowLeft } from "react-icons/fa";

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

function Upload() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("file"); // "file" | "paste"
  const [pastedText, setPastedText] = useState("");
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

  return (
    <div className="min-h-screen text-retro-dark font-body selection:bg-retro-yellow selection:text-retro-dark relative overflow-x-hidden p-6 py-12 transition-colors duration-300">
      {/* Decorative Stars */}
      <Star className="absolute top-10 left-[10%] opacity-70 animate-star" size={28} />
      <Star className="absolute bottom-10 right-[10%] opacity-60 animate-star" size={32} />

      <div className="max-w-3xl mx-auto relative z-10">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[2px] text-retro-dark opacity-60 hover:opacity-100 transition-colors mb-12">
          <FaArrowLeft size={10} /> Back to Dashboard
        </Link>

        <div className="retro-card !p-10 md:!p-16 shadow-none relative overflow-hidden">
          <Star className="absolute top-8 right-8 opacity-40 animate-star" size={24} filled={false} />
          
          <div className="text-center mb-12">
            <div className="text-[10px] font-black tracking-[3px] opacity-60 text-retro-dark uppercase mb-4">
              ★ STEP 01: RESUME
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-black uppercase mb-4 text-retro-dark leading-none">
              Upload Your <span className="text-retro-yellow text-stroke-dark">Resume</span>
            </h1>
            <p className="text-sm md:text-base font-body text-retro-dark opacity-80 max-w-lg mx-auto leading-relaxed">
              Our AI will analyze your skills and build a personalized learning roadmap based on your current experience.
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex border-2 border-retro-dark p-1 mb-10 w-full max-w-sm mx-auto bg-[var(--retro-grid)] opacity-50">
            {[
              { key: "file", label: "UPLOAD FILE" },
              { key: "paste", label: "PASTE TEXT" },
            ].map((m) => (
              <button
                key={m.key}
                onClick={() => { setMode(m.key); setError(""); }}
                className={`flex-1 py-3 text-[11px] font-black tracking-widest transition-all duration-150 ${
                  mode === m.key ? "bg-[var(--retro-text)] text-[var(--retro-bg)]" : "text-retro-dark hover:opacity-100"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-8 p-5 border-2 border-retro-dark bg-[var(--retro-text)] text-retro-yellow text-xs font-black uppercase tracking-wider text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {mode === "file" ? (
              <motion.div key="file-mode" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFile(e.dataTransfer.files[0]); }}
                  onClick={() => !file && fileRef.current?.click()}
                  className={`w-full p-12 text-center transition-all duration-150 relative border-[2.5px] border-dashed flex flex-col items-center justify-center min-h-[280px] cursor-pointer rounded-[4px] ${
                    dragActive ? "bg-retro-yellow/10 border-retro-yellow" : "bg-transparent border-retro-dark"
                  }`}
                >
                  <input ref={fileRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.txt" onChange={(e) => handleFile(e.target.files[0])} />

                  {!file ? (
                    <div className="flex flex-col items-center">
                      <FaCloudUploadAlt className="text-5xl text-retro-dark mb-6" />
                      <h3 className="text-lg font-display font-black uppercase mb-2">Drop resume here</h3>
                      <p className="text-xs text-retro-dark opacity-60 uppercase tracking-[1.5px] font-black">PDF, DOC, DOCX, TXT</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center w-full">
                      <div className="w-20 h-20 mb-6 bg-retro-yellow border-2 border-retro-dark flex items-center justify-center">
                        <FaFilePdf className="text-3xl text-black" />
                      </div>
                      <p className="text-lg font-display font-black uppercase mb-2 truncate w-full px-10 text-center">{file.name}</p>
                      <p className="text-xs font-black uppercase tracking-widest text-retro-dark mb-6">
                         READY — {(file.size / 1024).toFixed(1)} KB
                      </p>
                      <button
                        onClick={(e) => { e.stopPropagation(); setFile(null); setError(""); }}
                        className="retro-btn-secondary !text-[10px] !py-2 !px-4"
                      >
                        REMOVE FILE
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div key="paste-mode" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
                <textarea
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="PASTE YOUR RESUME CONTENT HERE... (SKILLS, EXPERIENCE, EDUCATION)"
                  className="retro-input !min-h-[280px] !font-body !text-base !p-6 resize-none placeholder:opacity-30 uppercase"
                />
                <p className="text-[10px] font-black mt-4 text-right uppercase tracking-widest text-retro-dark opacity-60">
                  {pastedText.length} CHARACTERS
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {((mode === "file" && file) || (mode === "paste" && pastedText.length >= 50)) && !uploading && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                onClick={handleUpload}
                className="retro-btn-primary w-full mt-10"
              >
                🚀 ANALYZE MY RESUME
              </motion.button>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {uploading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10 w-full">
                <div className="flex justify-between text-[11px] font-black tracking-widest mb-3 uppercase">
                  <span>{progress < 90 ? "EXTRACTING TEXT..." : progress < 100 ? "PROCESSING..." : "✓ DONE!"}</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-4 bg-[var(--retro-grid)] border-2 border-retro-dark rounded-none overflow-hidden relative">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-retro-yellow border-r-2 border-retro-dark"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default Upload;