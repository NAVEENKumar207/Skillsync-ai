import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { forgotPassword } from "../utils/api";

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

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [favoriteColor, setFavoriteColor] = useState("");
    const [lastPassword, setLastPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const data = await forgotPassword({ email, favoriteColor, lastPassword });
            setVerified(true);
            // Redirect to reset password with the token from backend
            setTimeout(() => {
                navigate(`/reset-password/${data.resetToken}`);
            }, 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
            <Star className="absolute top-20 left-[15%] opacity-70 animate-star" size={28} />
            <Star className="absolute bottom-20 right-[15%] opacity-60 animate-star" size={32} />

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full max-w-[420px] relative z-10"
            >
                <div className="retro-card !p-10 md:!p-12 shadow-none">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-4xl font-display font-black uppercase mb-2 text-retro-dark">
                            Verify
                        </h1>
                        <p className="text-sm font-body text-retro-dark opacity-80">
                            Identity Challenge
                        </p>
                    </div>

                    <AnimatePresence>
                        {verified ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-6"
                            >
                                <div className="text-5xl mb-6">🔓</div>
                                <p className="font-display font-black text-xl mb-4 uppercase text-retro-dark">Verified!</p>
                                <p className="text-sm mb-10 text-retro-dark opacity-80 font-body leading-relaxed">
                                    Identity confirmed. Redirecting to reset page…
                                </p>
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
                                        <label className="retro-label">Account Email</label>
                                        <input
                                            type="email"
                                            placeholder="YOU@EXAMPLE.COM"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="retro-input uppercase"
                                        />
                                    </div>

                                    <div className="py-2">
                                        <div className="h-[1px] bg-retro-dark opacity-20 relative">
                                            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-retro-grid px-2 text-[10px] font-black opacity-50">OR PROVIDE ONE:</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="retro-label">Favorite Color</label>
                                        <input
                                            type="text"
                                            placeholder="SECRET COLOR"
                                            value={favoriteColor}
                                            onChange={(e) => setFavoriteColor(e.target.value)}
                                            className="retro-input uppercase"
                                        />
                                    </div>

                                    <div>
                                        <label className="retro-label">Last Remembered Password</label>
                                        <input
                                            type="password"
                                            placeholder="PREVIOUS PASSWORD"
                                            value={lastPassword}
                                            onChange={(e) => setLastPassword(e.target.value)}
                                            className="retro-input"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="retro-btn-primary w-full mt-4 flex justify-center items-center"
                                    >
                                        {loading ? "VERIFYING…" : "VERIFY IDENTITY"}
                                    </button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!verified && (
                        <p className="text-center text-[12px] mt-8 text-retro-dark font-body opacity-90">
                            Remembered it?{" "}
                            <Link
                                to="/login"
                                className="font-black text-retro-dark hover:underline underline-offset-4"
                            >
                                LOG IN
                            </Link>
                        </p>
                    )}
                </div>

                <div className="text-center mt-8">
                    <Link to="/" className="text-[11px] font-black uppercase tracking-[2px] text-retro-dark opacity-60 hover:opacity-100 transition-opacity">
                        ← Back to Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}

export default ForgotPassword;