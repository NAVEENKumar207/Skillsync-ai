import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { registerUser, saveSession } from "../utils/api";

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
  return { label: "Strong", color: "var(--retro-text)", pct: 100 };};

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [favoriteColor, setFavoriteColor] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
      const data = await registerUser({ name, email, password: pwd, favoriteColor });
      saveSession(data.token, data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden py-12">
      {/* Decorative Stars */}
      <Star className="absolute top-10 right-[15%] opacity-70 animate-star" size={28} />
      <Star className="absolute bottom-10 left-[15%] opacity-60 animate-star" size={32} />
      <Star className="absolute top-1/2 left-[5%] opacity-40 animate-star" size={22} filled={false} />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-[420px] relative z-10"
      >
        <div className="retro-card !p-10 md:!p-12 shadow-none">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-black uppercase mb-2 text-retro-dark">
              Sign Up
            </h1>
            <p className="text-sm font-body text-retro-dark opacity-80">
              Join SkillSync AI — it's free
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
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="retro-label">Full Name</label>
              <input
                type="text"
                placeholder="YOUR NAME"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="retro-input placeholder:opacity-50"
              />
            </div>

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
              <label className="retro-label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="MIN 6 CHARACTERS"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  required
                  className="retro-input placeholder:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-retro-dark opacity-70 hover:opacity-100 transition-opacity"
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
              {pwd && (
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1.5 text-retro-dark">
                    <span>Strength</span>
                    <span className="text-retro-dark">{strength.label}</span>
                  </div>
                  <div className="h-2 bg-retro-grid border-[1px] border-retro-dark">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${strength.pct}%` }}
                      className="h-full bg-retro-yellow border-r-[1px] border-retro-dark"
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="retro-label">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="REPEAT PASSWORD"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  className={`retro-input placeholder:opacity-50 ${pwdMismatch ? "border-retro-dark bg-retro-dark/5" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-retro-dark opacity-70 hover:opacity-100 transition-opacity"
                >
                  {showConfirm ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
              {confirm && (
                <p className={`text-[10px] mt-2 font-black uppercase tracking-widest ${pwdMatch ? "text-retro-dark" : "text-retro-dark opacity-70"}`}>
                  {pwdMatch ? "✓ MATCH" : "✗ MISMATCH"}
                </p>
              )}
            </div>

            <div>
              <label className="retro-label">Favorite Color (Security Question)</label>
              <input
                type="text"
                placeholder="E.G. NEON BLUE"
                value={favoriteColor}
                onChange={(e) => setFavoriteColor(e.target.value)}
                required
                className="retro-input placeholder:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !!pwdMismatch}
              className="retro-btn-primary w-full mt-4 flex justify-center items-center"
            >
              {loading ? "CREATING ACCOUNT…" : "CREATE ACCOUNT"}
            </button>
          </form>

          <p className="text-center text-[12px] mt-8 text-retro-dark font-body opacity-90">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-black text-retro-dark hover:underline underline-offset-4"
            >
              LOG IN
            </Link>
          </p>
        </div>

        <div className="text-center mt-8">
          <Link to="/" className="text-[11px] font-black uppercase tracking-[2px] text-retro-dark opacity-70 hover:opacity-100 transition-opacity">
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default Signup;