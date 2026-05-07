import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
    FaUser, FaEnvelope, FaHistory, FaTrash, FaSignOutAlt, FaArrowLeft, FaSun, FaMoon, FaEdit, FaTimes, FaSave
} from "react-icons/fa";
import { getUser, getHistory, deleteHistory, clearSession, updateProfile, saveSession, updateHistory } from "../utils/api";

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

function Profile() {
    const [isDark, setIsDark] = useState(document.documentElement.classList.contains("dark"));
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    // User Profile Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ name: "", email: "" });
    const [updateLoading, setUpdateLoading] = useState(false);
    
    // History Entry Edit State
    const [isEditingHistory, setIsEditingHistory] = useState(false);
    const [historyEditForm, setHistoryEditForm] = useState({ id: "", company: "", role: "" });
    const [historyUpdateLoading, setHistoryUpdateLoading] = useState(false);

    const navigate = useNavigate();
    const [user, setUser] = useState(getUser());

    useEffect(() => {
        if (user) {
            setEditForm({ name: user.name, email: user.email });
        }
    }, [user]);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDark]);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const data = await getHistory();
            setHistory(data);
        } catch (err) {
            setError("Failed to load history. Please try again later.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleTheme = () => setIsDark(!isDark);

    const handleLogout = () => {
        clearSession();
        navigate("/");
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            setUpdateLoading(true);
            const data = await updateProfile(editForm);
            
            // Update local user state and localStorage
            const token = localStorage.getItem("token");
            saveSession(token, data.user);
            setUser(data.user);
            
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (err) {
            alert(err.message || "Failed to update profile.");
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleUpdateHistory = async (e) => {
        e.preventDefault();
        try {
            setHistoryUpdateLoading(true);
            const { id, company, role } = historyEditForm;
            const updated = await updateHistory(id, { company, role });
            
            setHistory(history.map(item => item._id === id ? updated : item));
            setIsEditingHistory(false);
            alert("History entry updated successfully!");
        } catch (err) {
            alert(err.message || "Failed to update history.");
        } finally {
            setHistoryUpdateLoading(false);
        }
    };

    const handleRemoveHistory = async (id) => {
        if (window.confirm("Delete this analysis from your history permanently?")) {
            try {
                await deleteHistory(id);
                setHistory(history.filter(item => item._id !== id));
            } catch (err) {
                alert("Failed to delete history entry.");
            }
        }
    };

    const viewPastAnalysis = (item) => {
        localStorage.setItem("resumeText", "HISTORICAL_DATA"); // Placeholder
        localStorage.setItem("selectedCompany", item.company);
        localStorage.setItem("selectedRole", item.role);
        localStorage.setItem("aiRoadmap", item.analysis);
        navigate("/roadmap");
    };

    if (!user) {
        navigate("/login");
        return null;
    }

    return (
        <div className="min-h-screen text-retro-dark font-body selection:bg-retro-yellow selection:text-retro-dark relative overflow-x-hidden pb-20 transition-colors duration-300">
            {/* Nav Bar */}
            <nav className="border-b-2 border-retro-dark px-6 py-4 flex items-center justify-between sticky top-0 retro-nav z-50">
                <Link to="/dashboard" className="flex items-center gap-2 group">
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
                    <Link to="/dashboard" className="retro-btn-secondary !py-1.5 !px-3 flex items-center gap-2">
                        <FaArrowLeft size={12} /> <span className="text-[10px]">DASHBOARD</span>
                    </Link>
                    <button onClick={handleLogout} className="retro-btn-secondary !py-1.5 !px-3 flex items-center gap-2">
                        <FaSignOutAlt size={12} /> <span className="text-[10px]">LOGOUT</span>
                    </button>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-12 md:py-20">
                {/* Header */}
                <header className="mb-16 relative">
                    <Star className="absolute -top-10 -left-10 opacity-60 animate-star" size={32} />
                    <div className="text-[10px] font-black tracking-[3px] opacity-60 text-retro-dark uppercase mb-4">
                        ★ USER PROFILE
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-black uppercase mb-4 tracking-tight leading-none">
                        MY <span className="text-retro-yellow text-stroke-dark">ACCOUNT</span>
                    </h1>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* User Info Card */}
                    <div className="lg:col-span-1">
                        <div className="retro-card !p-8 sticky top-32">
                            <div className="w-20 h-20 bg-retro-yellow border-4 border-retro-dark flex items-center justify-center mb-6">
                                <FaUser size={40} className="text-retro-dark" />
                            </div>
                            <h2 className="text-2xl font-display font-black uppercase mb-6 text-retro-dark">
                                {user.name}
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-retro-dark">
                                    <FaEnvelope className="opacity-60" />
                                    <span className="text-sm font-body">{user.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-retro-dark">
                                    <FaHistory className="opacity-60" />
                                    <span className="text-sm font-body">{history.length} Analyses Saved</span>
                                </div>
                            </div>

                            <button 
                                onClick={() => setIsEditing(true)}
                                className="mt-8 w-full py-3 border-2 border-retro-dark font-display font-black text-xs uppercase tracking-widest hover:bg-retro-yellow transition-all flex items-center justify-center gap-2"
                            >
                                <FaEdit /> EDIT PROFILE
                            </button>
                            
                            <div className="mt-10 pt-8 border-t-2 border-retro-dark border-dashed">
                                <div className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4">
                                    ACCOUNT ACTIONS
                                </div>
                                <button 
                                    onClick={handleLogout}
                                    className="w-full py-3 border-2 border-retro-dark font-display font-black text-xs uppercase tracking-widest hover:bg-retro-dark hover:text-white transition-all flex items-center justify-center gap-2"
                                >
                                    <FaSignOutAlt /> LOGOUT SESSION
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* History Section */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-4 mb-8">
                            <FaHistory size={20} />
                            <h2 className="text-2xl font-display font-black uppercase tracking-tight text-retro-dark">
                                Analysis History
                            </h2>
                            <div className="flex-1 h-[2px] bg-retro-dark opacity-10"></div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-retro-dark"></div>
                            </div>
                        ) : error ? (
                            <div className="retro-card !bg-red-50 !border-red-500 !p-8 text-center">
                                <p className="text-red-500 font-bold">{error}</p>
                                <button onClick={fetchHistory} className="mt-4 retro-btn-secondary !text-xs">TRY AGAIN</button>
                            </div>
                        ) : history.length === 0 ? (
                            <div className="retro-card !p-12 text-center opacity-60">
                                <p className="font-display font-black uppercase text-xl mb-4">No history yet</p>
                                <p className="text-sm font-body mb-8">Start by uploading your resume and analyzing your skills.</p>
                                <Link to="/upload" className="retro-btn-primary">START ANALYSIS →</Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {history.map((item, i) => (
                                    <motion.div
                                        key={item._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="retro-card !p-6 group relative border-2 border-retro-dark hover:border-retro-yellow transition-all flex flex-col justify-between"
                                    >
                                        <div className="absolute top-4 right-4 flex gap-2 z-20">
                                            <button 
                                                onClick={(e) => { 
                                                    e.stopPropagation(); 
                                                    setHistoryEditForm({ id: item._id, company: item.company, role: item.role });
                                                    setIsEditingHistory(true);
                                                }}
                                                className="p-2 text-retro-dark opacity-20 hover:opacity-100 hover:text-retro-yellow transition-all"
                                                title="Edit this entry"
                                            >
                                                <FaEdit size={14} />
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleRemoveHistory(item._id); }}
                                                className="p-2 text-retro-dark opacity-20 hover:opacity-100 hover:text-red-500 transition-all"
                                                title="Remove from history"
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        </div>

                                        <div className="mb-6">
                                            <div className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">
                                                {item.date}
                                            </div>
                                            <h3 className="font-display font-black uppercase text-lg leading-tight text-retro-dark group-hover:text-retro-yellow transition-colors mb-1">
                                                {item.company}
                                            </h3>
                                            <p className="text-xs font-body opacity-70 text-retro-dark uppercase tracking-wider">
                                                {item.role}
                                            </p>
                                        </div>

                                        <button 
                                            onClick={() => viewPastAnalysis(item)}
                                            className="w-full py-2 border-2 border-retro-dark font-display font-black text-[10px] uppercase tracking-widest hover:bg-retro-dark hover:text-white transition-all"
                                        >
                                            RE-ACTIVATE ROADMAP →
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <footer className="mt-20 border-t-2 border-retro-dark pt-8 flex flex-col md:flex-row justify-between items-center opacity-60 text-retro-dark text-[11px] font-black uppercase tracking-widest gap-4">
                    <div>SKILLSYNC AI · POWERED BY GROQ</div>
                    <div>BUILT BY NAVEEN KUMAR</div>
                </footer>
            </div>

            {/* Edit Profile Modal */}
            <AnimatePresence>
                {isEditing && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-retro-dark/80 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="retro-card !bg-[var(--retro-bg)] max-w-md w-full !p-8 relative"
                        >
                            <button 
                                onClick={() => setIsEditing(false)}
                                className="absolute top-4 right-4 p-2 text-retro-dark opacity-40 hover:opacity-100 transition-all"
                            >
                                <FaTimes size={20} />
                            </button>

                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-retro-yellow border-2 border-retro-dark">
                                    <FaUser className="text-xl" />
                                </div>
                                <h2 className="text-2xl font-display font-black uppercase tracking-tight text-retro-dark">
                                    Edit Profile
                                </h2>
                            </div>

                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[2px] mb-2 opacity-60">
                                        Full Name
                                    </label>
                                    <input 
                                        type="text"
                                        required
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        className="w-full bg-transparent border-2 border-retro-dark p-3 focus:bg-retro-yellow/5 outline-none font-body transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[2px] mb-2 opacity-60">
                                        Email Address
                                    </label>
                                    <input 
                                        type="email"
                                        required
                                        value={editForm.email}
                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                        className="w-full bg-transparent border-2 border-retro-dark p-3 focus:bg-retro-yellow/5 outline-none font-body transition-colors"
                                    />
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button 
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="flex-1 py-4 border-2 border-retro-dark font-display font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
                                    >
                                        CANCEL
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={updateLoading}
                                        className="flex-1 py-4 bg-retro-dark text-white border-2 border-retro-dark font-display font-black text-xs uppercase tracking-widest hover:bg-retro-yellow hover:text-retro-dark transition-all flex items-center justify-center gap-2"
                                    >
                                        {updateLoading ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
                                        ) : (
                                            <>
                                                <FaSave /> SAVE CHANGES
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit History Modal */}
            <AnimatePresence>
                {isEditingHistory && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-retro-dark/80 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="retro-card !bg-[var(--retro-bg)] max-w-md w-full !p-8 relative"
                        >
                            <button 
                                onClick={() => setIsEditingHistory(false)}
                                className="absolute top-4 right-4 p-2 text-retro-dark opacity-40 hover:opacity-100 transition-all"
                            >
                                <FaTimes size={20} />
                            </button>

                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-retro-yellow border-2 border-retro-dark">
                                    <FaHistory className="text-xl" />
                                </div>
                                <h2 className="text-2xl font-display font-black uppercase tracking-tight text-retro-dark">
                                    Edit History
                                </h2>
                            </div>

                            <form onSubmit={handleUpdateHistory} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[2px] mb-2 opacity-60">
                                        Company Name
                                    </label>
                                    <input 
                                        type="text"
                                        required
                                        value={historyEditForm.company}
                                        onChange={(e) => setHistoryEditForm({ ...historyEditForm, company: e.target.value })}
                                        className="w-full bg-transparent border-2 border-retro-dark p-3 focus:bg-retro-yellow/5 outline-none font-body transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[2px] mb-2 opacity-60">
                                        Job Role
                                    </label>
                                    <input 
                                        type="text"
                                        required
                                        value={historyEditForm.role}
                                        onChange={(e) => setHistoryEditForm({ ...historyEditForm, role: e.target.value })}
                                        className="w-full bg-transparent border-2 border-retro-dark p-3 focus:bg-retro-yellow/5 outline-none font-body transition-colors"
                                    />
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button 
                                        type="button"
                                        onClick={() => setIsEditingHistory(false)}
                                        className="flex-1 py-4 border-2 border-retro-dark font-display font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
                                    >
                                        CANCEL
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={historyUpdateLoading}
                                        className="flex-1 py-4 bg-retro-dark text-white border-2 border-retro-dark font-display font-black text-xs uppercase tracking-widest hover:bg-retro-yellow hover:text-retro-dark transition-all flex items-center justify-center gap-2"
                                    >
                                        {historyUpdateLoading ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
                                        ) : (
                                            <>
                                                <FaSave /> SAVE CHANGES
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Profile;
