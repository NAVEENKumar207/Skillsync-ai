import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "../components/ThemeToggle";
import { ThemeContext } from "../context/ThemeContext";
import { registerUser, saveSession } from "../utils/api";

const getStrength = (pwd) => {
  let s = 0;
  if (pwd.length >= 8) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  if (s <= 1) return { label: "Weak", color: "#ef4444", pct: 25 };
  if (s <= 3) return { label: "Medium", color: "#eab308", pct: 60 };
  return { label: "Strong", color: "#22c55e", pct: 100 };
};

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isDark } = useContext(ThemeContext);
  const navigate = useNavigate();

  const strength = getStrength(pwd);
  const pwdMatch = pwd && confirm && pwd === confirm;
  const pwdMismatch = confirm && pwd !== confirm;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pwd !== confirm) return setError("Passwords do not match.");
    setLoading(true);
    setError("");
    try {
      const data = await registerUser({ name, email, password: pwd });
      saveSession(data.token, data.user);
      navigate("/upload");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const bg = isDark ? "#0a0a0a" : "#f5f7fa";
  const text = isDark ? "#ffffff" : "#0a0a0a";
  const sub = isDark ? "#888" : "#666";

  const inputStyle = {
    width: "100%", padding: "14px 16px", borderRadius: "12px",
    background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
    border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
    color: text, fontSize: "0.95rem", outline: "none"
  };

  const onFocus = (e) => e.target.style.borderColor = isDark ? "rgba(255,255,255,0.3)" : "#2196F3";
  const onBlur = (e) => e.target.style.borderColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans py-12"
      style={{ backgroundColor: bg }}
    >
      <ThemeToggle />

      {/* Blobs */}
      <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: isDark ? "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)" : "radial-gradient(circle, rgba(33,150,243,0.1) 0%, transparent 70%)" }} />
      <div className="absolute top-[-15%] left-[-10%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: isDark ? "radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)" : "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)" }} />

      {/* Card */}
      <motion.div
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative z-10 w-full max-w-md mx-4"
        style={{
          background: isDark ? "rgba(255,255,255,0.04)" : "#ffffff",
          border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.08)",
          borderRadius: "2rem", padding: "3rem",
          backdropFilter: "blur(20px)",
          boxShadow: isDark ? "0 24px 60px rgba(0,0,0,0.6)" : "0 24px 60px rgba(0,0,0,0.08)"
        }}
      >
        {/* Header */}
        <motion.div initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: isDark ? "rgba(255,255,255,0.08)" : "rgba(33,150,243,0.1)", border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(33,150,243,0.2)"}` }}>
            <span className="text-2xl">🚀</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-1" style={{ color: text }}>
            Create Account
          </h1>
          <p className="text-sm font-medium" style={{ color: sub }}>
            Join SkillSync AI — it's free
          </p>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 px-4 py-3 rounded-xl text-sm font-medium text-center"
              style={{ color: "#ef4444", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <motion.div initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.25 }}>
            <label className="block text-xs font-bold mb-1.5 tracking-wide uppercase" style={{ color: sub }}>Full Name</label>
            <input type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)}
              required autoComplete="name" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </motion.div>

          {/* Email */}
          <motion.div initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
            <label className="block text-xs font-bold mb-1.5 tracking-wide uppercase" style={{ color: sub }}>Email</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)}
              required autoComplete="email" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </motion.div>

          {/* Password */}
          <motion.div initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.35 }}>
            <label className="block text-xs font-bold mb-1.5 tracking-wide uppercase" style={{ color: sub }}>Password</label>
            <input type="password" placeholder="Min 6 characters" value={pwd} onChange={e => setPwd(e.target.value)}
              required autoComplete="new-password" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            {pwd && (
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1" style={{ color: sub }}>
                  <span>Strength</span>
                  <span style={{ color: strength.color, fontWeight: 700 }}>{strength.label}</span>
                </div>
                <div style={{ height: 4, borderRadius: 4, background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${strength.pct}%` }}
                    transition={{ duration: 0.4 }}
                    style={{ height: "100%", borderRadius: 4, background: strength.color }}
                  />
                </div>
              </div>
            )}
          </motion.div>

          {/* Confirm Password */}
          <motion.div initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            <label className="block text-xs font-bold mb-1.5 tracking-wide uppercase" style={{ color: sub }}>Confirm Password</label>
            <input type="password" placeholder="Repeat password" value={confirm} onChange={e => setConfirm(e.target.value)}
              required autoComplete="new-password"
              style={{ ...inputStyle, borderColor: pwdMismatch ? "#ef4444" : pwdMatch ? "#22c55e" : (isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)") }}
              onFocus={onFocus} onBlur={onBlur} />
            {confirm && (
              <p className="text-xs mt-1.5 font-semibold" style={{ color: pwdMatch ? "#22c55e" : "#ef4444" }}>
                {pwdMatch ? "✓ Passwords match" : "✗ Passwords don't match"}
              </p>
            )}
          </motion.div>

          {/* Submit */}
          <motion.button
            initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || !!pwdMismatch}
            className="w-full py-4 rounded-xl font-bold tracking-wide transition-all duration-200 mt-2"
            style={{
              background: loading ? (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)") : (isDark ? "#ffffff" : "#2196F3"),
              color: loading ? sub : (isDark ? "#0a0a0a" : "#ffffff"),
              border: "none",
              cursor: loading || !!pwdMismatch ? "not-allowed" : "pointer",
              opacity: !!pwdMismatch ? 0.5 : 1,
              fontSize: "0.95rem"
            }}
          >
            {loading ? "Creating Account…" : "Create Account"}
          </motion.button>
        </form>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="text-center text-sm mt-6" style={{ color: sub }}>
          Already have an account?{" "}
          <Link to="/login" className="font-bold" style={{ color: isDark ? "#ffffff" : "#2196F3" }}>
            Sign in
          </Link>
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

export default Signup;