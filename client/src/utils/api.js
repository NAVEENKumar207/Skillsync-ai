// Central API utility — all backend calls go through here
// "proxy": "http://localhost:5000" in package.json routes /api/* → backend
const BASE = process.env.REACT_APP_API_URL || "/api";

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
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
};
export const getToken = () => localStorage.getItem("token");
export const getUser = () => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
};
export const clearSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("resumeText");
    localStorage.removeItem("selectedCompany");
    localStorage.removeItem("aiRoadmap");
};
export const isLoggedIn = () => !!getToken();
