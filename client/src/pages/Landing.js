import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaInstagram, FaLinkedin, FaPhoneAlt, FaEnvelope, FaHome, FaUser } from "react-icons/fa";
import { ThemeToggle } from "../components/ThemeToggle";
import { ThemeContext } from "../context/ThemeContext";

function Landing() {
  const { scrollYProgress } = useScroll();
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const { isDark } = useContext(ThemeContext);

  return (
    <div className="min-h-screen text-white relative font-sans" style={{ 
      backgroundColor: isDark ? "#0a0a0a" : "#ffffff",
      color: isDark ? "#ffffff" : "#0a0a0a"
    }}>
      <ThemeToggle />

      {/* 3D Ambient Lights with Theme */}
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none animate-blob-float" style={{ 
        background: isDark 
          ? "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)"
          : "radial-gradient(circle, rgba(33,150,243,0.08) 0%, transparent 70%)"
      }}></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none animate-blob-float" style={{ 
        background: isDark
          ? "radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)"
          : "radial-gradient(circle, rgba(33,150,243,0.05) 0%, transparent 70%)",
        animationDelay: "4s"
      }}></div>

      {/* Hero Section with 3D */}
      <motion.section
        className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden perspective"
        style={{ opacity: opacityHero }}
        id="home"
      >
        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center z-10 max-w-4xl"
          style={{ transformPerspective: 1000 }}
        >
          <motion.h1
            className="text-6xl md:text-8xl font-black mb-6 tracking-tighter neon-glow"
            initial={{ opacity: 0, y: 20, z: -100 }}
            animate={{ opacity: 1, y: 0, z: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ color: isDark ? "#ffffff" : "#0a0a0a" }}
          >
            Building <br />
            <span className="text-gradient">Intelligent AI Experiences</span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl mb-12 font-light max-w-2xl mx-auto leading-relaxed"
            style={{ color: isDark ? "#aaaaaa" : "#555555" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            I engineer next-generation systems, blending intuitive design with state-of-the-art machine learning.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Link to="/login">
              <button className="studio-btn px-8 py-4 font-semibold text-lg">
                Try SkillSync AI
              </button>
            </Link>
            <a href="#contact">
              <button className="px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 lift-3d" style={{ 
                color: isDark ? "#aaaaaa" : "#555555",
                border: isDark ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(33,150,243,0.3)",
                background: isDark ? "rgba(255,255,255,0.05)" : "rgba(33,150,243,0.05)"
              }}>
                Contact Me
              </button>
            </a>
          </motion.div>
        </motion.div>

        {/* 3D Glass Card Preview */}
        <motion.div
          className="absolute bottom-[-15%] w-[80%] md:w-[60%] h-[30vh] glass-card rounded-t-[40px] z-0 card-3d"
          initial={{ y: 200, rotateX: 45, opacity: 0 }}
          animate={{ y: 0, rotateX: 15, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
          style={{ transformPerspective: 1000 }}
        />
      </motion.section>

      {/* About Section */}
      <section id="about" className="py-32 px-6 relative z-10" style={{ 
        borderTop: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(33,150,243,0.15)",
        backgroundColor: isDark ? "#111111" : "#f5f7fa"
      }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6" style={{ color: isDark ? "#ffffff" : "#0a0a0a" }}>
              Architect of <br /> <span className="text-gradient">Tomorrow.</span>
            </h2>
            <div className="h-px w-24 mb-8" style={{ background: isDark ? "rgba(255,255,255,0.2)" : "rgba(33,150,243,0.3)" }} />
          </motion.div>
          <motion.div
            className="flex-1 glass-card p-10 rounded-3xl relative overflow-hidden card-3d"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-lg leading-relaxed font-light relative z-10" style={{ color: isDark ? "#aaaaaa" : "#555555" }}>
              I am an AI Developer &amp; CSBS Student focused on building highly intelligent, scalable systems. With a startup mindset and a relentless drive for innovation, I engineer platforms that merge powerful backend capabilities with breathtaking cinematic frontend experiences.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6 relative z-10 pb-64" style={{ 
        borderTop: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(33,150,243,0.15)"
      }}>
        <div className="max-w-4xl mx-auto text-center glass-card p-16 rounded-[3rem] card-3d">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ color: isDark ? "#ffffff" : "#0a0a0a" }}
          >
            Let's Build Something <span className="text-gradient">Powerful</span>
          </motion.h2>
          <motion.p
            className="text-lg mb-12"
            style={{ color: isDark ? "#aaaaaa" : "#555555" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            I'm currently open to collaborations, innovative projects, and new opportunities.
          </motion.p>

          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {[
              { icon: FaEnvelope, label: "Email", href: "mailto:naveenkumarsaro@gmail.com" },
              { icon: FaInstagram, label: "Instagram", href: "https://www.instagram.com/itz_me_naveensaro?igsh=MW05cjBzOHUwbnExcg==" },
              { icon: FaLinkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/naveen-kumar-s-60b18232a" },
              { icon: FaPhoneAlt, label: "Call Me", href: "tel:+919944679814" },
            ].map((contact, i) => (
              <motion.a
                key={contact.label}
                href={contact.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.1, y: -4 }}
                className="group relative flex items-center justify-center w-20 h-20 rounded-2xl glass-card transition-all duration-300 lift-3d"
                style={{ color: isDark ? "#aaaaaa" : "#555555" }}
              >
                <contact.icon className="text-2xl group-hover:text-white transition-colors duration-300" />
                <div className="absolute -bottom-10 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold tracking-wide px-3 py-1 rounded" style={{ 
                  background: isDark ? "#1a1a1a" : "#f0f0f0",
                  color: isDark ? "#ffffff" : "#0a0a0a",
                  border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(33,150,243,0.2)"
                }}>
                  {contact.label}
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Dock */}
      <motion.div
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 dock-blur rounded-full px-8 py-4 flex items-center gap-8 card-3d"
        style={{ 
          border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(33,150,243,0.2)",
          background: isDark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.9)"
        }}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        {[
          { icon: FaHome, label: "Home", href: "#home" },
          { icon: FaUser, label: "About", href: "#about" },
          { icon: FaEnvelope, label: "Contact", href: "#contact" },
        ].map((item) => (
          <a key={item.label} href={item.href} className="group relative p-2 transition-opacity duration-300 lift-3d" style={{ color: isDark ? "#555555" : "#aaaaaa" }}>
            <item.icon className="text-xl group-hover:text-white transition-colors duration-300" />
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold px-3 py-1.5 rounded pointer-events-none" style={{ 
              background: isDark ? "#111111" : "#ffffff",
              color: isDark ? "#ffffff" : "#0a0a0a",
              border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(33,150,243,0.2)"
            }}>
              {item.label}
            </div>
          </a>
        ))}
      </motion.div>

    </div>
  );
}

export default Landing;