import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
    FaUpload, FaBuilding, FaChartLine, FaRoute, FaSignOutAlt,
    FaSync, FaSun, FaMoon
} from "react-icons/fa";
import { getUser, clearSession } from "../utils/api";

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

function Dashboard() {
    const [isDark, setIsDark] = useState(document.documentElement.classList.contains("dark"));
    const navigate = useNavigate();
    const user = getUser();

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark(!isDark);

    const hasResume = !!localStorage.getItem("resumeText");
    const hasRoadmap = !!localStorage.getItem("aiRoadmap");
    const selectedCompany = localStorage.getItem("selectedCompany");

    const handleLogout = () => {
        clearSession();
        navigate("/");
    };

    const handleReset = () => {
        if (window.confirm("Are you sure you want to reset the entire process? This will clear your current resume and analysis data.")) {
            localStorage.removeItem("resumeText");
            localStorage.removeItem("selectedCompany");
            localStorage.removeItem("selectedRole");
            localStorage.removeItem("aiRoadmap");
            window.location.reload();
            navigate("/upload");
        }
    };

    const steps = [
        {
            icon: FaUpload, label: "Upload Resume", path: "/upload",
            desc: "Upload or paste your resume for AI analysis.",
            done: hasResume, num: "01"
        },
        {
            icon: FaBuilding, label: "Select Company", path: "/company",
            desc: "Pick a target company and specific job role.",
            done: !!selectedCompany, num: "02",
            disabled: !hasResume,
        },
        {
            icon: FaChartLine, label: "Skill Analysis", path: "/analysis",
            desc: "Get your AI-powered skill gap analysis.",
            done: hasRoadmap, num: "03",
            disabled: !hasResume,
        },
        {
            icon: FaRoute, label: "View Roadmap", path: "/roadmap",
            desc: "View your personalized 3-month learning plan.",
            done: false, num: "04",
            disabled: !hasRoadmap,
        },
    ];

    const firstName = user?.name?.split(" ")[0] || "THERE";

    return (
        <div className="min-h-screen text-retro-dark font-body selection:bg-retro-yellow selection:text-retro-dark relative overflow-x-hidden pb-20 transition-colors duration-300">
            {/* Nav Bar */}
            <nav className="border-b-2 border-retro-dark px-6 py-4 flex items-center justify-between sticky top-0 retro-nav z-50">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="border-retro-yellow border-[2.5px] px-2.5 py-1 transition-colors duration-200 group-hover:bg-retro-dark">
                        <span className="font-display font-black text-[15px] uppercase tracking-[2px] transition-colors duration-200 group-hover:text-white">
                            SkillSync AI
                        </span>
                    </div>
                </Link>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={toggleTheme}
                        className="p-2 border-2 border-retro-dark rounded-[4px] hover:bg-retro-yellow transition-colors"
                        title="Toggle Theme"
                    >
                        {isDark ? <FaSun className="text-retro-yellow" /> : <FaMoon />}
                    </button>
                    <button onClick={handleReset} className="retro-btn-secondary !py-1.5 !px-3 hidden md:flex items-center gap-2">
                        <FaSync size={12} /> <span className="text-[10px]">RESET</span>
                    </button>
                    <button onClick={handleLogout} className="retro-btn-secondary !py-1.5 !px-3 flex items-center gap-2">
                        <FaSignOutAlt size={12} /> <span className="text-[10px]">LOGOUT</span>
                    </button>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-12 md:py-20">
                {/* Hero */}
                <header className="mb-16 relative">
                    <Star className="absolute -top-10 -left-10 opacity-60 animate-star" size={32} />
                    <div className="text-[10px] font-black tracking-[3px] opacity-60 text-retro-dark uppercase mb-4">
                        ★ USER DASHBOARD
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-black uppercase mb-4 tracking-tight leading-none">
                        HEY, <span className="text-retro-yellow text-stroke-dark">{firstName}!</span>
                    </h1>
                    <p className="text-lg md:text-xl text-retro-dark opacity-80 max-w-2xl font-body">
                        Your career acceleration platform. Let's find your skill gaps and build your roadmap.
                    </p>
                </header>

                {/* Main Stats / Status */}
                {hasRoadmap && (
                    <div className="mb-12 retro-card-yellow !p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="text-[52px] font-display font-black text-outline-yellow leading-none" style={{ color: "var(--retro-text)", WebkitTextStroke: "2px var(--retro-text)" }}>
                                OK
                            </div>
                            <div>
                                <h3 className="font-display font-black uppercase text-xl text-retro-dark">Analysis Ready</h3>
                                <p className="text-sm font-body opacity-80 text-retro-dark uppercase tracking-wider">
                                    Target: {selectedCompany || "GENERAL"} ROLE
                                </p>
                            </div>
                        </div>
                        <Link to="/roadmap" className="retro-btn-primary !bg-retro-dark !text-white !py-3 !px-8">
                            VIEW ROADMAP →
                        </Link>
                    </div>
                )}

                {/* Steps Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    {steps.map((step, i) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={step.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => !step.disabled && navigate(step.path)}
                                className={`retro-card !bg-[var(--retro-card-bg)] relative group ${step.disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                            >
                                {step.done && (
                                    <div className="absolute top-4 right-4 retro-badge-yellow !mb-0">
                                        DONE
                                    </div>
                                )}
                                <div className="text-[44px] font-display font-black text-outline-yellow mb-6 leading-none">
                                    {step.num}
                                </div>
                                <h3 className="font-display font-black uppercase text-sm mb-2 text-retro-dark">{step.label}</h3>
                                <p className="text-xs text-retro-dark opacity-70 font-body leading-relaxed">{step.desc}</p>
                                
                                {step.disabled && (
                                    <div className="mt-4 text-[9px] font-black uppercase tracking-widest opacity-50 text-retro-dark">
                                        LOCKED
                                    </div>
                                )}
                                
                                <Star className="absolute -bottom-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity" size={18} />
                            </motion.div>
                        );
                    })}
                </div>

                {/* Large CTA Section */}
                <div className="retro-card !bg-[var(--retro-card-bg)] !p-12 md:!p-16 border-[4px] relative overflow-hidden">
                    <Star className="absolute top-10 right-10 opacity-40 animate-star" size={44} filled={false} />
                    <div className="max-w-2xl relative z-10">
                        <h2 className="text-3xl md:text-5xl font-display font-black uppercase mb-6 leading-tight text-retro-dark">
                            {hasRoadmap ? "Your path is set 🚀" : "Start your journey 🚀"}
                        </h2>
                        <p className="text-lg text-retro-dark opacity-80 font-body mb-10">
                            {hasRoadmap
                                ? "You've successfully analyzed your skills. Continue following your roadmap to land your dream job."
                                : "Upload your resume and get a personalized AI career roadmap in under 60 seconds."}
                        </p>
                        <div className="flex flex-wrap gap-6">
                            <Link to="/upload" className="retro-btn-primary">
                                {hasResume ? "RE-UPLOAD" : "UPLOAD"} →
                            </Link>
                            {hasRoadmap && (
                                <Link to="/roadmap" className="retro-btn-secondary !py-4 !px-10 !text-sm">
                                    VIEW ROADMAP
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                <footer className="mt-20 border-t-2 border-retro-dark pt-8 flex flex-col md:flex-row justify-between items-center opacity-60 text-retro-dark text-[11px] font-black uppercase tracking-widest gap-4">
                    <div>SKILLSYNC AI · POWERED BY GROQ</div>
                    <div>BUILT BY NAVEEN KUMAR</div>
                </footer>
            </div>
        </div>
    );
}

export default Dashboard;