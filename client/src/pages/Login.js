import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ThemeToggle } from "../components/ThemeToggle";
import { ThemeContext } from "../context/ThemeContext";
import { loginUser, saveSession } from "../utils/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { isDark } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUser({ email, password });
      saveSession(data.token, data.user);
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const bg = isDark ? "#0a0a0a" : "#f5f7fa";
  const text = isDark ? "#ffffff" : "#0a0a0a";
  const sub = isDark ? "#888" : "#666";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans"
      style={{ backgroundColor: bg }}
    >
      <ThemeToggle />

      {/* Ambient blobs */}
      <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(33,150,243,0.1) 0%, transparent 70%)"
        }} />
      <div className="absolute bottom-[-15%] left-[-10%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)"
        }} />

      {/* Card */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative z-10 w-full max-w-md mx-4"
        style={{
          background: isDark ? "rgba(255,255,255,0.04)" : "#ffffff",
          border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.08)",
          borderRadius: "2rem",
          padding: "3rem",
          backdropFilter: "blur(20px)",
          boxShadow: isDark ? "0 24px 60px rgba(0,0,0,0.6)" : "0 24px 60px rgba(0,0,0,0.08)"
        }}
      >
        {/* Header */}
        <motion.div initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: isDark ? "rgba(255,255,255,0.08)" : "rgba(33,150,243,0.1)", border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(33,150,243,0.2)"}` }}>
            <span className="text-2xl">⚡</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-1" style={{ color: text }}>
            Welcome Back
          </h1>
          <p className="text-sm font-medium" style={{ color: sub }}>
            Sign in to SkillSync AI
          </p>
        </motion.div>

        {/* Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              className="mb-4 px-4 py-3 rounded-xl text-sm font-medium text-center"
              style={{ color: "#ef4444", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Banner */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 px-4 py-3 rounded-xl text-sm font-medium text-center"
              style={{ color: "#22c55e", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}
            >
              ✓ Access granted — redirecting...
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <motion.div initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
            <label className="block text-xs font-bold mb-1.5 tracking-wide uppercase" style={{ color: sub }}>
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={{
                width: "100%", padding: "14px 16px", borderRadius: "12px",
                background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
                color: text, fontSize: "0.95rem", outline: "none"
              }}
              onFocus={e => e.target.style.borderColor = isDark ? "rgba(255,255,255,0.3)" : "#2196F3"}
              onBlur={e => e.target.style.borderColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
            />
          </motion.div>

          {/* Password */}
          <motion.div initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.35 }}>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold tracking-wide uppercase" style={{ color: sub }}>
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold transition-colors"
                style={{ color: isDark ? "#aaa" : "#2196F3" }}
                onMouseEnter={e => e.target.style.color = isDark ? "#fff" : "#1565C0"}
                onMouseLeave={e => e.target.style.color = isDark ? "#aaa" : "#2196F3"}
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={{
                  width: "100%", padding: "14px 16px", paddingRight: "48px", borderRadius: "12px",
                  background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                  border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
                  color: text, fontSize: "0.95rem", outline: "none"
                }}
                onFocus={e => e.target.style.borderColor = isDark ? "rgba(255,255,255,0.3)" : "#2196F3"}
                onBlur={e => e.target.style.borderColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-lg focus:outline-none transition-colors"
                style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </motion.div>

          {/* Submit */}
          <motion.button
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || success}
            className="w-full py-4 rounded-xl font-bold tracking-wide transition-all duration-200 mt-2"
            style={{
              background: success ? "rgba(34,197,94,0.15)"
                : loading ? (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)")
                  : (isDark ? "#ffffff" : "#2196F3"),
              color: success ? "#22c55e"
                : loading ? sub
                  : (isDark ? "#0a0a0a" : "#ffffff"),
              border: "none",
              cursor: loading || success ? "not-allowed" : "pointer",
              fontSize: "0.95rem"
            }}
          >
            {loading ? "Signing in…" : success ? "✓ Access Granted" : "Sign In"}
          </motion.button>
        </form>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="text-center text-sm mt-6"
          style={{ color: sub }}
        >
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-bold transition-colors"
            style={{ color: isDark ? "#ffffff" : "#2196F3" }}
          >
            Create one
          </Link>
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

export default Login;