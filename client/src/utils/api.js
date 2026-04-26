// Central API utility — all backend calls go through here
// "proxy": "http://localhost:5000" in package.json routes /api/* → backend
const BASE = "/api";

/* ─── helpers ──────────────────────────────────────────────────── */
const post = async (url, body = {}) => {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Something went wrong.");
  return data;
};

/* ─── Auth ──────────────────────────────────────────────────────── */
export const registerUser = (body) => post(`${BASE}/auth/register`, body);
export const loginUser = (body) => post(`${BASE}/auth/login`, body);
export const forgotPassword = (email) => post(`${BASE}/auth/forgot-password`, { email });
export const resetPassword = (token, password) =>
  post(`${BASE}/auth/reset-password/${token}`, { password });

/* ─── AI Analysis ───────────────────────────────────────────────── */
export const analyzeResume = (body) => post(`${BASE}/analyze`, body);

/* ─── Session Helpers ────────────────────────────────────────────── */
export const saveSession = (token, user) => {
  try {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  } catch (e) {
    console.warn("Failed to save session to localStorage:", e);
    // Continue without storage (e.g., private browsing mode)
  }
};

export const getToken = () => {
  try {
    return localStorage.getItem("token");
  } catch (e) {
    console.warn("Failed to read token from localStorage:", e);
    return null;
  }
};

export const getUser = () => {
  try {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  } catch (e) {
    console.warn("Failed to read user from localStorage:", e);
    return null;
  }
};

export const clearSession = () => {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("resumeText");
    localStorage.removeItem("selectedCompany");
    localStorage.removeItem("aiRoadmap");
  } catch (e) {
    console.warn("Failed to clear localStorage:", e);
  }
};

export const isLoggedIn = () => !!getToken();

/* ─── Storage for Resume Data ───────────────────────────────────── */
export const saveResumeData = (text, company, role) => {
  try {
    localStorage.setItem("resumeText", text);
    if (company) localStorage.setItem("selectedCompany", company);
    if (role) localStorage.setItem("selectedRole", role);
  } catch (e) {
    console.warn("Failed to save resume data:", e);
  }
};

export const getResumeData = () => {
  try {
    return {
      resumeText: localStorage.getItem("resumeText") || "",
      selectedCompany: localStorage.getItem("selectedCompany") || "",
      selectedRole: localStorage.getItem("selectedRole") || ""
    };
  } catch (e) {
    console.warn("Failed to read resume data:", e);
    return { resumeText: "", selectedCompany: "", selectedRole: "" };
  }
};

export const clearResumeData = () => {
  try {
    localStorage.removeItem("resumeText");
    localStorage.removeItem("selectedCompany");
    localStorage.removeItem("selectedRole");
  } catch (e) {
    console.warn("Failed to clear resume data:", e);
  }
};

/* ─── Roadmap Storage ───────────────────────────────────────────── */
export const saveRoadmap = (roadmap) => {
  try {
    localStorage.setItem("aiRoadmap", JSON.stringify(roadmap));
  } catch (e) {
    console.warn("Failed to save roadmap:", e);
  }
};

export const getRoadmap = () => {
  try {
    const r = localStorage.getItem("aiRoadmap");
    return r ? JSON.parse(r) : null;
  } catch (e) {
    console.warn("Failed to read roadmap:", e);
    return null;
  }
};

/* ─── Analysis History ──────────────────────────────────────────── */
export const addToAnalysisHistory = (analysis, company, role) => {
  try {
    const existing = localStorage.getItem("analysisHistory");
    const history = existing ? JSON.parse(existing) : [];
    const newEntry = {
      id: Date.now().toString(),
      analysis,
      company,
      role,
      createdAt: new Date().toISOString()
    };
    // Keep only last 10 analyses
    const updated = [newEntry, ...history].slice(0, 10);
    localStorage.setItem("analysisHistory", JSON.stringify(updated));
    return newEntry.id;
  } catch (e) {
    console.warn("Failed to add to analysis history:", e);
    return null;
  }
};

export const getAnalysisHistory = () => {
  try {
    const h = localStorage.getItem("analysisHistory");
    return h ? JSON.parse(h) : [];
  } catch (e) {
    console.warn("Failed to read analysis history:", e);
    return [];
  }
};

export const removeFromAnalysisHistory = (id) => {
  try {
    const existing = localStorage.getItem("analysisHistory");
    if (!existing) return;
    const history = JSON.parse(existing);
    const updated = history.filter((item) => item.id !== id);
    localStorage.setItem("analysisHistory", JSON.stringify(updated));
  } catch (e) {
    console.warn("Failed to remove from analysis history:", e);
  }
};

export const clearAnalysisHistory = () => {
  try {
    localStorage.removeItem("analysisHistory");
  } catch (e) {
    console.warn("Failed to clear analysis history:", e);
  }
};
