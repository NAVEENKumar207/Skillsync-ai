import React, { useContext } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
    FaUpload, FaBuilding, FaChartLine, FaRoute, FaSignOutAlt,
    FaStar, FaSync
} from "react-icons/fa";
import { ThemeToggle } from "../components/ThemeToggle";
import { ThemeContext } from "../context/ThemeContext";
import { getUser, clearSession } from "../utils/api";

function Dashboard() {
    const { isDark } = useContext(ThemeContext);
    const navigate = useNavigate();
    const user = getUser();
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
            window.location.reload(); // Refresh to update UI state or navigate
            navigate("/upload");
        }
    };

    const bg = isDark ? "#0a0a0a" : "#f5f7fa";
    const textPrimary = isDark ? "#ffffff" : "#0a0a0a";
    const textMuted = isDark ? "#aaaaaa" : "#666666";
    const cardBg = isDark ? "rgba(255,255,255,0.04)" : "#ffffff";
    const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

    const steps = [
        {
            icon: FaUpload, label: "Upload Resume", path: "/upload",
            desc: "Upload or paste your resume for AI analysis.",
            done: hasResume, color: "#2196F3",
        },
        {
            icon: FaBuilding, label: "Select Company and job role", path: "/company",
            desc: "Pick a target company and specific job role.",
            done: !!selectedCompany, color: "#8b5cf6",
            disabled: !hasResume,
        },
        {
            icon: FaChartLine, label: "Skill Analysis", path: "/analysis",
            desc: "Get your AI-powered skill gap analysis.",
            done: hasRoadmap, color: "#f59e0b",
            disabled: !hasResume,
        },
        {
            icon: FaRoute, label: "View Roadmap", path: "/roadmap",
            desc: "View your personalized 3-month learning plan.",
            done: false, color: "#22c55e",
            disabled: !hasRoadmap,
        },
    ];

    const firstName = user?.name?.split(" ")[0] || "there";

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen font-sans"
            style={{ backgroundColor: bg, color: textPrimary }}
        >
            <ThemeToggle />

            {/* Ambient */}
            <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none opacity-40"
                style={{ background: isDark ? "radial-gradient(circle, rgba(33,150,243,0.12) 0%, transparent 70%)" : "radial-gradient(circle, rgba(33,150,243,0.08) 0%, transparent 70%)" }} />
            <div className="fixed bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full pointer-events-none opacity-30"
                style={{ background: isDark ? "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)" : "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)" }} />

            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Top Bar */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-16">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg"
                            style={{ background: isDark ? "rgba(255,255,255,0.08)" : "rgba(33,150,243,0.12)", color: isDark ? "#ffffff" : "#2196F3", border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(33,150,243,0.2)"}` }}>
                            {user?.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div>
                            <p className="text-sm font-medium" style={{ color: textMuted }}>Welcome back</p>
                            <h2 className="text-xl font-black" style={{ color: textPrimary }}>{user?.name || "User"}</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleReset}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
                            style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(33,150,243,0.1)", border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(33,150,243,0.2)"}`, color: isDark ? "#ffffff" : "#2196F3" }}
                        >
                            <FaSync /> Reset Process
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
                            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444" }}
                        >
                            <FaSignOutAlt /> Sign Out
                        </button>
                    </div>
                </motion.div>

                {/* Hero */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="mb-12">
                    <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight">
                        Hey, <span className="text-gradient">{firstName}!</span> 👋
                    </h1>
                    <p className="text-xl" style={{ color: textMuted }}>
                        Ready to accelerate your career? Let's find your skill gaps and build your roadmap.
                    </p>
                </motion.div>

                {/* Status Banner (if analysis exists) */}
                {hasRoadmap && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                        className="mb-10 p-6 rounded-2xl flex items-center justify-between flex-wrap gap-4"
                        style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
                        <div className="flex items-center gap-3">
                            <FaStar className="text-2xl text-green-400" />
                            <div>
                                <p className="font-bold text-green-400">Analysis Complete!</p>
                                <p className="text-sm" style={{ color: textMuted }}>
                                    {selectedCompany ? `Targeted at ${selectedCompany}` : "General analysis"} · Ready to view
                                </p>
                            </div>
                        </div>
                        <Link to="/roadmap">
                            <button className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all"
                                style={{ background: "#22c55e", color: "#ffffff" }}>
                                View Roadmap →
                            </button>
                        </Link>
                    </motion.div>
                )}

                {/* Steps Grid */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
                    {steps.map((step, i) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={step.label}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                onClick={() => !step.disabled && navigate(step.path)}
                                className={`relative p-6 rounded-2xl transition-all duration-300 ${step.disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:-translate-y-1"}`}
                                style={{
                                    background: cardBg,
                                    border: `1px solid ${step.done ? step.color + "40" : cardBorder}`,
                                    boxShadow: step.done ? `0 4px 20px ${step.color}20` : "none",
                                }}
                            >
                                {step.done && (
                                    <div className="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center text-xs"
                                        style={{ background: step.color }}>
                                        ✓
                                    </div>
                                )}
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                                    style={{ background: step.color + "18", border: `1px solid ${step.color}30` }}>
                                    <Icon style={{ color: step.color }} className="text-xl" />
                                </div>
                                <h3 className="font-bold text-base mb-1" style={{ color: textPrimary }}>{step.label}</h3>
                                <p className="text-sm" style={{ color: textMuted }}>{step.desc}</p>
                                {step.disabled && (
                                    <p className="text-xs mt-2 font-medium" style={{ color: "#ef4444" }}>Complete previous step first</p>
                                )}
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Quick Start CTA */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                    className="text-center p-12 rounded-3xl"
                    style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(33,150,243,0.04)", border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(33,150,243,0.1)"}` }}>
                    <h2 className="text-3xl font-black mb-3" style={{ color: textPrimary }}>
                        {hasRoadmap ? "Your roadmap is waiting 🚀" : "Ready to start? 🚀"}
                    </h2>
                    <p className="mb-8" style={{ color: textMuted }}>
                        {hasRoadmap
                            ? "Continue from where you left off or start a new analysis."
                            : "Upload your resume and get a personalized AI career roadmap in under 60 seconds."}
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link to="/upload">
                            <motion.button
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.97 }}
                                className="px-10 py-4 rounded-xl font-bold text-lg"
                                style={{ background: isDark ? "#ffffff" : "#2196F3", color: isDark ? "#0a0a0a" : "#ffffff", boxShadow: isDark ? "0 8px 24px rgba(255,255,255,0.15)" : "0 8px 24px rgba(33,150,243,0.3)" }}
                            >
                                {hasResume ? "Re-upload Resume" : "Upload Resume"} →
                            </motion.button>
                        </Link>
                        {hasRoadmap && (
                            <Link to="/roadmap">
                                <motion.button
                                    whileHover={{ scale: 1.03, y: -2 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="px-10 py-4 rounded-xl font-bold text-lg"
                                    style={{ background: "transparent", border: `1px solid ${isDark ? "rgba(255,255,255,0.2)" : "rgba(33,150,243,0.3)"}`, color: textPrimary }}
                                >
                                    View Roadmap
                                </motion.button>
                            </Link>
                        )}
                    </div>
                </motion.div>

                {/* Footer */}
                <div className="text-center mt-12 text-sm" style={{ color: isDark ? "#333" : "#ccc" }}>
                    SkillSync AI · Powered by Groq · Built by Naveen Kumar
                </div>
            </div>
        </motion.div>
    );
}

export default Dashboard;
