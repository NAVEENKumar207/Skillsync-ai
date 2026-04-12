import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCode, FaServer, FaChartBar, FaShieldAlt, FaMobileAlt, FaArrowRight } from "react-icons/fa";
import { ThemeToggle } from '../components/ThemeToggle';
import { ThemeContext } from '../context/ThemeContext';

const roles = [
  { id: 'frontend', name: 'Frontend Engineer', icon: <FaCode />, description: "Building high-performance, accessible, and beautiful user interfaces." },
  { id: 'backend', name: 'Backend Engineer', icon: <FaServer />, description: "Designing scalable APIs, distributed systems, and database architectures." },
  { id: 'fullstack', name: 'Full Stack Engineer', icon: <FaCode />, description: "Mastering both ends of the wire to build complete, end-to-end products." },
  { id: 'data', name: 'Data Scientist', icon: <FaChartBar />, description: "Extracting insights from complex data to drive product decisions." },
  { id: 'devops', name: 'DevOps & SRE', icon: <FaShieldAlt />, description: "Ensuring reliability, automation, and seamless cloud deployments." },
  { id: 'mobile', name: 'Mobile Developer', icon: <FaMobileAlt />, description: "Creating world-class native experiences for iOS and Android." },
];

const Role = () => {
  const { isDark } = useContext(ThemeContext);
  const navigate = useNavigate();
  const selectedCompany = localStorage.getItem('selectedCompany') || 'Company';

  const handleSelect = (roleName) => {
    localStorage.setItem('selectedRole', roleName);
    navigate('/analysis');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen relative font-sans" style={{
      backgroundColor: isDark ? "#0a0a0a" : "#ffffff",
      color: isDark ? "#ffffff" : "#0a0a0a"
    }}>
      <ThemeToggle />

      <div className="container mx-auto px-6 py-32 relative z-10 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1.5 rounded-full mb-4 text-sm font-bold uppercase tracking-widest"
               style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(33,150,243,0.1)", color: isDark ? "#888" : "#2196F3" }}>
            Step 3: Define Your Path
          </div>
          <h1 className="text-5xl font-black mb-4 tracking-tight">
            What's your role at <span style={{ color: isDark ? "#00ffff" : "#2196F3" }}>{selectedCompany}</span>?
          </h1>
          <p className="text-lg max-w-xl mx-auto" style={{ color: isDark ? "#aaaaaa" : "#555555" }}>
            We'll customize your roadmap based on the specific engineering requirements of this role.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {roles.map((role) => (
            <motion.div
              key={role.id}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={() => handleSelect(role.name)}
              className="cursor-pointer p-8 rounded-3xl border transition-all duration-300 group"
              style={{
                background: isDark ? "rgba(255,255,255,0.03)" : "rgba(33,150,243,0.03)",
                borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(33,150,243,0.15)"
              }}
            >
              <div className="text-3xl mb-6 transition-transform group-hover:scale-110" style={{ color: isDark ? "#ffffff" : "#2196F3" }}>
                {role.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3">{role.name}</h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color: isDark ? "#888" : "#666" }}>
                {role.description}
              </p>
              <div className="flex items-center gap-2 text-sm font-bold transition-all group-hover:translate-x-2" style={{ color: isDark ? "#ffffff" : "#2196F3" }}>
                Select Role <FaArrowRight className="text-xs" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Role;
