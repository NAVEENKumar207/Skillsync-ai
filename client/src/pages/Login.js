import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginUser, saveSession } from "../utils/api";

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

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
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

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Stars */}
      <Star className="absolute top-20 left-[10%] opacity-70 animate-star" size={28} />
      <Star className="absolute bottom-20 right-[10%] opacity-60 animate-star" size={32} />
      <Star className="absolute top-[40%] right-[5%] opacity-40 animate-star" size={22} filled={false} />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-[420px] relative z-10"
      >
        <div className="retro-card !p-10 md:!p-12 shadow-none">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-display font-black uppercase mb-2 text-retro-dark">
              Login
            </h1>
            <p className="text-sm font-body text-retro-dark opacity-80">
              Welcome back to SkillSync AI
            </p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-6 p-4 border-2 border-retro-dark bg-retro-dark text-retro-yellow text-[11px] font-black uppercase tracking-[1.5px] text-center"
              >
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 p-4 border-2 border-retro-dark bg-retro-yellow text-retro-dark text-[11px] font-black uppercase tracking-[1.5px] text-center"
              >
                ✓ Access granted — redirecting...
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="retro-label">Email Address</label>
              <input
                type="email"
                placeholder="YOU@EXAMPLE.COM"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="retro-input placeholder:opacity-50"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="retro-label !mb-0">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-[10px] font-black uppercase tracking-wider text-retro-dark opacity-70 hover:opacity-100 transition-opacity"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="retro-input pr-12 placeholder:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-retro-dark opacity-70 hover:opacity-100 transition-opacity"
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="retro-btn-primary w-full mt-4 flex justify-center items-center"
            >
              {loading ? "PROCESSING..." : success ? "SUCCESS" : "SIGN IN"}
            </button>
          </form>

          <p className="text-center text-[12px] mt-8 text-retro-dark font-body opacity-90">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-black text-retro-dark hover:underline underline-offset-4"
            >
              SIGN UP
            </Link>
          </p>
        </div>
        
        {/* Back to Home Link */}
        <div className="text-center mt-8">
          <Link to="/" className="text-[11px] font-black uppercase tracking-[2px] text-retro-dark opacity-70 hover:opacity-100 transition-opacity">
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;