import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { resetPassword } from "../utils/api";

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

const getStrength = (pwd) => {
    let s = 0;
    if (pwd.length >= 8) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    if (s <= 1) return { label: "Weak", color: "var(--retro-text)", pct: 25 };
    if (s <= 3) return { label: "Medium", color: "var(--retro-text)", pct: 60 };
    return { label: "Strong", color: "var(--retro-text)", pct: 100 };
};

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [pwd, setPwd] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState("");

    const strength = getStrength(pwd);
    const pwdMatch = pwd && confirm && pwd === confirm;
    const pwdMismatch = confirm && pwd !== confirm;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (pwd !== confirm) return setError("Passwords do not match.");
        setLoading(true);
        setError("");
        try {
            await resetPassword(token, pwd);
            setDone(true);
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden py-12 transition-colors duration-300">
            <Star className="absolute top-10 left-[10%] opacity-70 animate-star" size={28} />
            <Star className="absolute bottom-10 right-[10%] opacity-60 animate-star" size={32} />

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full max-w-[420px] relative z-10"
            >
                <div className="retro-card !p-10 md:!p-12 shadow-none">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl md:text-4xl font-display font-black uppercase mb-2 text-retro-dark">
                            New Pass
                        </h1>
                        <p className="text-sm font-body text-retro-dark opacity-80">Choose a strong new password.</p>
                    </div>

                    <AnimatePresence>
                        {done ? (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                                <div className="text-5xl mb-6">✅</div>
                                <p className="font-display font-black text-xl mb-4 uppercase text-retro-dark">Password Reset!</p>
                                <p className="text-sm text-retro-dark opacity-80 font-body">Redirecting to login in 3 seconds…</p>
                            </motion.div>
                        ) : (
                            <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-6 p-4 border-2 border-retro-dark bg-retro-dark text-retro-yellow text-xs font-black uppercase tracking-wider text-center"
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="retro-label">New Password</label>
                                        <input type="password" placeholder="MIN 6 CHARACTERS" value={pwd}
                                            onChange={e => setPwd(e.target.value)} required className="retro-input" />
                                        {pwd && (
                                            <div className="mt-3">
                                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1.5 text-retro-dark">
                                                    <span>Strength</span>
                                                    <span className="text-retro-dark">{strength.label}</span>
                                                </div>
                                                <div className="h-2 bg-retro-grid border-[1px] border-retro-dark">
                                                    <motion.div initial={{ width: 0 }} animate={{ width: `${strength.pct}%` }}
                                                        className="h-full bg-retro-yellow border-r-[1px] border-retro-dark" />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="retro-label">Confirm Password</label>
                                        <input type="password" placeholder="REPEAT PASSWORD" value={confirm}
                                            onChange={e => setConfirm(e.target.value)} required
                                            className={`retro-input ${pwdMismatch ? "border-retro-dark bg-retro-dark/5" : ""}`} />
                                        {confirm && (
                                            <p className={`text-[10px] mt-2 font-black uppercase tracking-widest ${pwdMatch ? "text-retro-dark" : "text-retro-dark opacity-70"}`}>
                                                {pwdMatch ? "✓ MATCH" : "✗ MISMATCH"}
                                            </p>
                                        )}
                                    </div>

                                    <button type="submit" disabled={loading || !!pwdMismatch}
                                        className="retro-btn-primary w-full mt-6 flex justify-center items-center">
                                        {loading ? "RESETTING…" : "RESET PASSWORD"}
                                    </button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="text-center mt-8">
                    <Link to="/login" className="text-[11px] font-black uppercase tracking-[2px] text-retro-dark opacity-60 hover:opacity-100 transition-opacity">
                        ← Back to Login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}

export default ResetPassword;