import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "../components/ThemeToggle";
import { ThemeContext } from "../context/ThemeContext";
import { forgotPassword } from "../utils/api";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");
    const { isDark } = useContext(ThemeContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await forgotPassword(email);
            setSent(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const bg = isDark ? "#0a0a0a" : "#f5f7fa";
    const text = isDark ? "#ffffff" : "#0a0a0a";
    const sub = isDark ? "#888" : "#666";

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans"
            style={{ backgroundColor: bg }}
        >
            <ThemeToggle />

            {/* Blobs */}
            <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
                style={{ background: isDark ? "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)" : "radial-gradient(circle, rgba(33,150,243,0.1) 0%, transparent 70%)" }} />

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
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                        style={{ background: isDark ? "rgba(255,255,255,0.08)" : "rgba(33,150,243,0.1)", border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(33,150,243,0.2)"}` }}>
                        <span className="text-2xl">🔑</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight mb-1" style={{ color: text }}>
                        Forgot Password
                    </h1>
                    <p className="text-sm" style={{ color: sub }}>
                        Enter your email and we'll send you a reset link.
                    </p>
                </div>

                {/* Success State */}
                <AnimatePresence>
                    {sent ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-6"
                        >
                            <div className="text-5xl mb-4">📬</div>
                            <p className="font-bold text-lg mb-2" style={{ color: text }}>Check your inbox!</p>
                            <p className="text-sm mb-6" style={{ color: sub }}>
                                If an account with <strong style={{ color: text }}>{email}</strong> exists, you'll receive a reset link shortly.
                            </p>
                            <p className="text-xs mb-6" style={{ color: sub }}>
                                ⚠️ Also check your spam/junk folder.
                            </p>
                            <Link to="/login"
                                className="inline-block px-6 py-3 rounded-xl font-bold text-sm transition-all"
                                style={{ background: isDark ? "#ffffff" : "#2196F3", color: isDark ? "#0a0a0a" : "#ffffff" }}>
                                Back to Login
                            </Link>
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
                                <div>
                                    <label className="block text-xs font-bold mb-1.5 tracking-wide uppercase" style={{ color: sub }}>
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        style={{
                                            width: "100%", padding: "14px 16px", borderRadius: "12px",
                                            background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                                            border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
                                            color: text, fontSize: "0.95rem", outline: "none"
                                        }}
                                        onFocus={e => e.target.style.borderColor = isDark ? "rgba(255,255,255,0.3)" : "#2196F3"}
                                        onBlur={e => e.target.style.borderColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 rounded-xl font-bold tracking-wide transition-all duration-200"
                                    style={{
                                        background: loading ? (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)")
                                            : (isDark ? "#ffffff" : "#2196F3"),
                                        color: loading ? sub : (isDark ? "#0a0a0a" : "#ffffff"),
                                        border: "none",
                                        cursor: loading ? "not-allowed" : "pointer",
                                        fontSize: "0.95rem"
                                    }}
                                >
                                    {loading ? "Sending…" : "Send Reset Link"}
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!sent && (
                    <p className="text-center text-sm mt-6" style={{ color: sub }}>
                        Remembered it?{" "}
                        <Link to="/login" className="font-bold" style={{ color: isDark ? "#ffffff" : "#2196F3" }}>
                            Back to login
                        </Link>
                    </p>
                )}
            </motion.div>
        </motion.div>
    );
}

export default ForgotPassword;
