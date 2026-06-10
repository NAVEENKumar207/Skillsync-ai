import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPaperPlane, FaTimes, FaRobot, FaChevronDown } from "react-icons/fa";

const INITIAL_MESSAGE = {
  role: "model",
  text: "★ HI! I'M **SKILLSYNC AI** — YOUR CAREER COACH. ASK ME ANYTHING ABOUT SKILLS, RESUMES, INTERVIEWS, OR LEARNING PATHS!",
  time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
};

function renderText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br/>");
}

function Assistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
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
        text: data.reply.toUpperCase(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: `⚠️ ERROR: ${err.message.toUpperCase()}`,
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

  return (
    <>
      {/* Floating Bubble */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full flex items-center justify-center bg-[var(--retro-text)] border-2 border-retro-yellow shadow-none"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <FaChevronDown className="text-retro-yellow text-xl" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <FaRobot className="text-retro-yellow text-xl" />
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
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] flex flex-col retro-card !p-0 shadow-none overflow-hidden"
            style={{ height: "560px" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-[var(--retro-text)] border-b-2 border-[var(--retro-text)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border-2 border-retro-yellow flex items-center justify-center bg-[var(--retro-text)]">
                  <FaRobot className="text-retro-yellow text-lg" />
                </div>
                <div>
                  <p className="font-display font-black text-xs uppercase tracking-widest text-retro-yellow">SkillSync AI</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-[var(--retro-bg)] opacity-50">Neural Assistant · Online</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-[var(--retro-bg)] opacity-50 hover:opacity-100 transition-opacity">
                <FaTimes />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-[var(--retro-bg)] retro-grid">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[90%] ${msg.role === "user" ? "bg-[var(--retro-text)] text-[var(--retro-bg)] p-4 rounded-[4px]" : "bg-[var(--retro-card-bg)] border-2 border-[var(--retro-text)] p-4 rounded-[4px] font-body"}`}>
                    {!msg.role === "user" && (
                      <div className="text-[9px] font-black uppercase tracking-[2px] text-retro-dark opacity-40 mb-2">★ AI ASSISTANT</div>
                    )}
                    <div
                      className={`text-sm leading-relaxed ${msg.role === "user" ? "font-body" : "text-retro-dark"}`}
                      dangerouslySetInnerHTML={{ __html: renderText(msg.text) }}
                    />
                    <p className={`text-[9px] mt-3 font-black uppercase tracking-widest ${msg.role === "user" ? "opacity-40 text-right" : "text-retro-dark opacity-40"}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[var(--retro-card-bg)] border-2 border-[var(--retro-text)] p-4 rounded-[4px] flex gap-2">
                    {[0, 1, 2].map((i) => (
                      <motion.div key={i} className="w-1.5 h-1.5 bg-[var(--retro-text)]"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-[var(--retro-card-bg)] border-t-2 border-[var(--retro-text)] flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="ASK ME ANYTHING..."
                className="retro-input !py-3 !text-xs placeholder:opacity-30"
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="retro-btn-primary !p-3 !aspect-square flex items-center justify-center disabled:opacity-30"
              >
                <FaPaperPlane size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Assistant;