import { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaCloudUploadAlt, FaFilePdf, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { ThemeToggle } from "../components/ThemeToggle";
import { ThemeContext } from "../context/ThemeContext";

function Upload() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { isDark } = useContext(ThemeContext);

  const navigate = useNavigate();

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Only PDF or DOC/DOCX files allowed 🚫");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      localStorage.setItem('resumeText', text);
    };
    reader.readAsText(selectedFile);

    setFile(selectedFile);
  };

  const simulateUpload = () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);

    let value = 0;
    const interval = setInterval(() => {
      value += 5;
      setProgress(value);

      if (value >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setUploading(false);
          navigate("/company");
        }, 1000);
      }
    }, 150);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans"
      style={{ 
        backgroundColor: isDark ? "#0a0a0a" : "#ffffff",
        color: isDark ? "#ffffff" : "#0a0a0a"
      }}
    >
      <ThemeToggle />

      {/* Subtle ambient light */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none animate-blob-float" style={{ 
        background: isDark
          ? "radial-gradient(circle, rgba(255,255,255,0.025) 0%, transparent 70%)"
          : "radial-gradient(circle, rgba(33,150,243,0.08) 0%, transparent 70%)"
      }}></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none animate-blob-float" style={{ 
        background: isDark
          ? "radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)"
          : "radial-gradient(circle, rgba(33,150,243,0.05) 0%, transparent 70%)",
        animationDelay: "5s"
      }}></div>

      {/* Upload Card */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 glass-card p-12 w-full max-w-xl rounded-[2.5rem] flex flex-col items-center card-3d"
      >
        <motion.h2
          className="text-4xl font-extrabold text-center mb-8 tracking-tight"
          style={{ color: isDark ? "#ffffff" : "#0a0a0a" }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Initialize Analysis
        </motion.h2>

        {/* Drag & Drop Area */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFile(e.dataTransfer.files[0]); }}
          className="w-full rounded-[2rem] p-12 text-center transition-all duration-300 relative overflow-hidden flex flex-col items-center justify-center min-h-[250px]"
          style={{
            borderWidth: "1px",
            borderStyle: "dashed",
            borderColor: dragActive ? (isDark ? "rgba(255,255,255,0.4)" : "rgba(33,150,243,0.4)") : (isDark ? "rgba(255,255,255,0.12)" : "rgba(33,150,243,0.15)"),
            background: dragActive ? (isDark ? "rgba(255,255,255,0.04)" : "rgba(33,150,243,0.08)") : (isDark ? "rgba(255,255,255,0.02)" : "rgba(33,150,243,0.03)"),
          }}
        >
          <AnimatePresence mode="wait">
            {!file ? (
              <motion.div
                key="upload-prompt"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center"
              >
                <div className="w-20 h-20 mb-6 rounded-full flex items-center justify-center" style={{ 
                  background: isDark ? "rgba(255,255,255,0.05)" : "rgba(33,150,243,0.1)",
                  border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(33,150,243,0.2)"
                }}>
                  <FaCloudUploadAlt className="text-4xl" style={{ color: isDark ? "#aaaaaa" : "#555555" }} />
                </div>
                <p className="text-lg font-bold mb-2" style={{ color: isDark ? "#ffffff" : "#0a0a0a" }}>Drop your resume here</p>
                <p className="text-sm mb-6" style={{ color: isDark ? "#555555" : "#aaaaaa" }}>Supported formats: PDF, DOC, DOCX</p>

                <input type="file" className="hidden" id="fileInput" onChange={(e) => handleFile(e.target.files[0])} />
                <label
                  htmlFor="fileInput"
                  className="px-8 py-3 rounded-xl cursor-pointer transition-all duration-300 text-sm font-bold tracking-wide"
                  style={{ 
                    background: isDark ? "transparent" : "transparent",
                    border: isDark ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(33,150,243,0.3)",
                    color: isDark ? "#aaaaaa" : "#555555"
                  }}
                  onMouseEnter={e => { 
                    e.currentTarget.style.background = isDark ? "#ffffff" : "#2196F3";
                    e.currentTarget.style.color = isDark ? "#0a0a0a" : "#ffffff";
                    e.currentTarget.style.borderColor = isDark ? "#ffffff" : "#1976D2";
                  }}
                  onMouseLeave={e => { 
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = isDark ? "#aaaaaa" : "#555555";
                    e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.2)" : "rgba(33,150,243,0.3)";
                  }}
                >
                  Browse Files
                </label>
              </motion.div>
            ) : (
              <motion.div
                key="file-info"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center w-full"
              >
                <div className="w-20 h-20 mb-6 rounded-full flex items-center justify-center" style={{ 
                  background: isDark ? "rgba(255,255,255,0.05)" : "rgba(33,150,243,0.1)",
                  border: isDark ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(33,150,243,0.2)"
                }}>
                  <FaFilePdf className="text-4xl" style={{ color: isDark ? "#ffffff" : "#0a0a0a" }} />
                </div>
                <p className="text-lg font-bold mb-2 truncate w-full px-4 text-center" style={{ color: isDark ? "#ffffff" : "#0a0a0a" }}>
                  {file.name}
                </p>
                <p className="text-sm font-bold mb-6 flex items-center gap-2" style={{ color: isDark ? "#aaaaaa" : "#555555" }}>
                  <FaCheckCircle /> Ready for analysis
                </p>
                <button
                  onClick={() => setFile(null)}
                  className="px-6 py-2 rounded-xl transition-colors text-sm font-bold tracking-wide flex items-center gap-2"
                  style={{ 
                    background: isDark ? "rgba(255,255,255,0.05)" : "rgba(33,150,243,0.1)",
                    border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(33,150,243,0.2)",
                    color: isDark ? "#aaaaaa" : "#555555"
                  }}
                >
                  <FaTimesCircle /> Remove File
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Upload Button */}
        <AnimatePresence>
          {file && !uploading && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onClick={simulateUpload}
              className="mt-8 w-full py-4 rounded-xl transition-all duration-300 font-bold text-lg tracking-wide"
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
              Analyze Resume
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
              <div className="flex justify-between text-sm font-bold mb-3 px-1" style={{ color: isDark ? "#aaaaaa" : "#555555" }}>
                <span>Processing Vectors...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full rounded-full h-1 overflow-hidden relative" style={{ background: isDark ? "rgba(255,255,255,0.1)" : "rgba(33,150,243,0.15)" }}>
                <div
                  className="absolute top-0 left-0 h-full transition-all duration-150"
                  style={{ width: `${progress}%`, background: isDark ? "#00ffff" : "#2196F3" }}
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
