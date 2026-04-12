import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTwitter, FaLinkedin, FaGithub, FaEnvelope, FaSun, FaMoon } from "react-icons/fa";

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

function Landing() {
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains("dark"));

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

  return (
    <div className="min-h-screen text-retro-dark font-body selection:bg-retro-yellow selection:text-retro-dark transition-colors duration-300">
      
      {/* Navigation Bar */}
      <nav className="border-b-2 border-retro-dark px-6 py-4 flex items-center justify-between sticky top-0 retro-nav z-50">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="border-retro-yellow border-[2.5px] px-2.5 py-1 transition-colors duration-200 group-hover:bg-retro-dark">
            <span className="font-display font-black text-[15px] uppercase tracking-[2px] transition-colors duration-200 group-hover:text-white">
              SkillSync AI
            </span>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {/* Navigation links removed */}
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 border-2 border-retro-dark rounded-[4px] hover:bg-retro-yellow transition-colors"
            title="Toggle Theme"
          >
            {isDark ? <FaSun className="text-retro-yellow" /> : <FaMoon />}
          </button>
          <Link to="/signup" className="retro-btn-primary !py-2 !px-5 !text-[11px] !bg-retro-yellow !text-retro-dark">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-6 overflow-hidden border-b-2 border-retro-dark" id="home">
        {/* Decorative Stars */}
        <Star className="absolute top-10 left-[10%] opacity-70 animate-star" size={28} />
        <Star className="absolute top-40 right-[15%] opacity-50 animate-star" size={22} filled={false} />
        <Star className="absolute bottom-20 left-[20%] opacity-60 animate-star" size={16} />
        <Star className="absolute top-1/2 right-[5%] opacity-80 animate-star" size={32} />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-black mb-8 leading-[1.1] tracking-tight text-retro-dark"
          >
            <span className="text-stroke-dark">BUILDING</span> <br />
            <span className="text-retro-yellow text-stroke-dark-thick">INTELLIGENT</span> <br />
            <span className="text-stroke-dark">SKILLS FOR AI</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-retro-dark opacity-80 max-w-xl mx-auto mb-12 leading-relaxed font-body"
          >
            Engineer your career with next-generation AI analysis. 
            Blending intuitive roadmap design with state-of-the-art skill gap detection.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link to="/login" className="retro-btn-primary">
              Analyze My Resume
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Marquee Ticker */}
      <div className="marquee-container">
        <div className="marquee-inner border-y-2 border-retro-dark bg-[var(--retro-bg)]">
          <span className="marquee-text">★ AI-POWERED</span>
          <span className="marquee-text">★ CAREER ROADMAP</span>
          <span className="marquee-text">★ SKILL ANALYSIS</span>
          <span className="marquee-text">★ RESUME REVIEW</span>
          <span className="marquee-text">★ TOP COMPANIES</span>
          <span className="marquee-text">★ AI-POWERED</span>
          <span className="marquee-text">★ CAREER ROADMAP</span>
          <span className="marquee-text">★ SKILL ANALYSIS</span>
          <span className="marquee-text">★ RESUME REVIEW</span>
          <span className="marquee-text">★ TOP COMPANIES</span>
        </div>
      </div>

      {/* Features Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 border-b-2 border-retro-dark" id="features">
        {[
          { num: '01', title: 'Resume Analysis', desc: 'Detailed breakdown of your current skill set against industry standards.' },
          { num: '02', title: 'Career Roadmap', desc: 'Personalized step-by-step guide to landing your dream job at top companies.' },
          { num: '03', title: 'AI Assistant', desc: 'Real-time guidance and feedback to help you navigate your career journey.' }
        ].map((f, i) => (
          <div key={i} className={`p-10 md:p-12 border-b-2 md:border-b-0 md:border-r-2 border-retro-dark last:border-r-0 hover:bg-[var(--retro-card-bg)] transition-colors duration-150`}>
            <div className="text-[44px] font-display font-black text-outline-yellow mb-6">
              {f.num}
            </div>
            <h3 className="text-xl font-display font-black uppercase mb-4 text-retro-dark">
              {f.title}
            </h3>
            <p className="text-sm md:text-base text-retro-dark opacity-80 leading-relaxed font-body">
              {f.desc}
            </p>
          </div>
        ))}
      </section>

      {/* About Section */}
      <section className="py-24 md:py-32 px-6 border-b-2 border-retro-dark" id="about">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1">
            <div className="text-[10px] font-black tracking-[3px] opacity-60 text-retro-dark uppercase mb-4">
              ★ ARCHITECT OF TOMORROW
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-black uppercase mb-8 leading-tight">
              SCALING <br /> <span className="text-retro-yellow text-stroke-dark">YOUR FUTURE.</span>
            </h2>
            <div className="h-0.5 w-24 bg-retro-dark mb-8" />
          </div>
          <div className="flex-1 retro-card !p-12 relative overflow-hidden group">
            <Star className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
            <p className="text-lg md:text-xl leading-relaxed text-retro-dark opacity-90 font-body">
              SkillSync AI is built for developers and students focused on landing high-tier roles. 
              We bridge the gap between your current skills and company requirements, 
              engineering a path that merges powerful analysis with breathtaking clarity.
            </p>
          </div>
        </div>
      </section>

      {/* Contact / CTA Section */}
      <section className="py-24 md:py-32 px-6" id="contact">
        <div className="max-w-4xl mx-auto text-center retro-card !p-16 !bg-[var(--retro-text)] !text-[var(--retro-bg)] rounded-[4px]">
          <h2 className="text-3xl md:text-5xl font-display font-black mb-6 uppercase">
            Let's Build Your <span className="text-retro-yellow">Contact</span>
          </h2>
          <p className="text-lg mb-12 opacity-80 font-body">
            Stop guessing your career path. Get a data-driven strategy to level up your skills today.
          </p>

          <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-12">
            {[
              { icon: FaEnvelope, label: "Email", href: "#" },
              { icon: FaTwitter, label: "X", href: "https://x.com/NaveenK51833756" },
              { icon: FaLinkedin, label: "LinkedIn", href: "#" },
              { icon: FaGithub, label: "GitHub", href: "#" },
            ].map((contact, i) => (
              <a
                key={i}
                href={contact.href}
                className="group flex items-center justify-center w-16 h-16 border-2 border-[var(--retro-bg)] opacity-20 hover:opacity-100 hover:border-retro-yellow transition-all duration-300 rounded-[4px]"
              >
                <contact.icon className="text-2xl text-[var(--retro-bg)] group-hover:text-retro-yellow transition-colors duration-300" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-retro-dark py-12 px-6 md:px-10 flex flex-col md:flex-row justify-between items-center gap-8 bg-[var(--retro-bg)]">
        <div className="font-display font-black text-[18px] uppercase tracking-[2px] text-retro-yellow">
          SkillSync AI
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          {['Privacy', 'Terms', 'Help', 'Career'].map((link) => (
            <a key={link} href="#" className="text-[11px] font-black uppercase tracking-[1px] opacity-60 text-retro-dark hover:text-retro-yellow transition-colors">
              {link}
            </a>
          ))}
        </div>
        <div className="text-[11px] opacity-40 text-retro-dark font-body">
          © {new Date().getFullYear()} SKILLSYNC AI. ALL RIGHTS RESERVED.
        </div>
      </footer>

    </div>
  );
}

export default Landing;