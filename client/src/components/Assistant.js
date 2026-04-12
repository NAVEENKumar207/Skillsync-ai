import { useState, useRef, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPaperPlane, FaTimes, FaRobot, FaChevronDown } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";

const INITIAL_MESSAGE = {
  role: "model",
  text: "👋 Hi! I'm **SkillSync AI** — your career coach. Ask me anything about skills, resumes, interviews, or learning paths!",
  time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
};

function renderText(text) {
  // Convert **bold** to <strong> and newlines to <br>
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br/>");
}

function Assistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { isDark } = useContext(ThemeContext);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open, messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: "user", text, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = messages.slice(-8).map((m) => ({ role: m.role, text: m.text }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong.");

      const botMsg = {
        role: "model",
        text: data.reply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: `⚠️ ${err.message}`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const bg = isDark ? "#111111" : "#ffffff";
  const headerBg = isDark ? "#0a0a0a" : "#f8f9fa";
  const inputBg = isDark ? "#0a0a0a" : "#f0f0f0";
  const textPrimary = isDark ? "#ffffff" : "#0a0a0a";
  const textMuted = isDark ? "#888888" : "#888888";
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

  return (
    <>
      {/* Floating Bubble */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
        style={{
          background: isDark
            ? "linear-gradient(135deg, #1a1a2e, #16213e)"
            : "linear-gradient(135deg, #2196F3, #1565C0)",
          border: `2px solid ${isDark ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.4)"}`,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={open ? {} : {
          boxShadow: ["0 0 0 0 rgba(33,150,243,0.4)", "0 0 0 15px rgba(33,150,243,0)", "0 0 0 0 rgba(33,150,243,0)"],
        }}
        transition={{ repeat: Infinity, duration: 2.5, delay: 2 }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <FaChevronDown className="text-white text-xl" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <FaRobot className="text-white text-xl" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] rounded-3xl overflow-hidden flex flex-col shadow-2xl"
            style={{ height: "520px", background: bg, border: `1px solid ${border}` }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" style={{ background: headerBg, borderBottom: `1px solid ${border}` }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: isDark ? "rgba(33,150,243,0.2)" : "rgba(33,150,243,0.15)" }}>
                  <FaRobot className="text-blue-400 text-sm" />
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: textPrimary }}>SkillSync AI</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <p className="text-xs" style={{ color: textMuted }}>Career Coach · Online</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)}
                className="p-2 rounded-full transition-colors"
                style={{ color: textMuted }}>
                <FaTimes />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ scrollbarWidth: "thin" }}>
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] ${msg.role === "user" ? "" : "flex gap-2"}`}>
                    {msg.role !== "user" && (
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                        style={{ background: "rgba(33,150,243,0.15)" }}>
                        <FaRobot className="text-blue-400 text-xs" />
                      </div>
                    )}
                    <div>
                      <div
                        className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
                        style={{
                          background: msg.role === "user"
                            ? (isDark ? "#2196F3" : "#2196F3")
                            : msg.error
                              ? "rgba(239,68,68,0.1)"
                              : (isDark ? "rgba(255,255,255,0.06)" : "#f0f0f0"),
                          color: msg.role === "user" ? "#ffffff" : msg.error ? "#ef4444" : textPrimary,
                          borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                        }}
                        dangerouslySetInnerHTML={{ __html: renderText(msg.text) }}
                      />
                      <p className="text-xs mt-1 px-1" style={{ color: isDark ? "#444" : "#bbb", textAlign: msg.role === "user" ? "right" : "left" }}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="flex gap-2 items-start">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(33,150,243,0.15)" }}>
                      <FaRobot className="text-blue-400 text-xs" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl flex gap-1.5 items-center"
                      style={{ background: isDark ? "rgba(255,255,255,0.06)" : "#f0f0f0", borderRadius: "18px 18px 18px 4px" }}>
                      {[0, 1, 2].map((i) => (
                        <motion.div key={i} className="w-1.5 h-1.5 rounded-full"
                          style={{ background: textMuted }}
                          animate={{ y: [0, -4, 0] }}
                          transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Quick prompts */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {["Review my resume tips", "Best skills for 2025", "How to prepare for Google?"].map((q) => (
                  <button key={q} onClick={() => { setInput(q); inputRef.current?.focus(); }}
                    className="text-xs px-3 py-1.5 rounded-full font-medium transition-all"
                    style={{ background: isDark ? "rgba(33,150,243,0.1)" : "rgba(33,150,243,0.08)", border: "1px solid rgba(33,150,243,0.2)", color: "#2196F3" }}>
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-4 py-4 flex gap-3 flex-shrink-0" style={{ borderTop: `1px solid ${border}` }}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{ background: inputBg, color: textPrimary, border: `1px solid ${border}` }}
                disabled={loading}
              />
              <motion.button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  background: input.trim() && !loading ? "#2196F3" : (isDark ? "rgba(255,255,255,0.05)" : "#e5e7eb"),
                  color: input.trim() && !loading ? "#ffffff" : textMuted,
                  cursor: !input.trim() || loading ? "not-allowed" : "pointer",
                }}
              >
                <FaPaperPlane className="text-sm" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Assistant;