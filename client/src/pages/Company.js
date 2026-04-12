import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaArrowRight } from "react-icons/fa";
import { ThemeToggle } from '../components/ThemeToggle';
import { ThemeContext } from '../context/ThemeContext';

const companies = [
  { id: 1, name: 'Google', description: "Organize the world's information and make it universally accessible.", logo: 'G' },
  { id: 2, name: 'Microsoft', description: "Empower every person and every organization on the planet to achieve more.", logo: 'M' },
  { id: 3, name: 'Amazon', description: "Earth's most customer-centric company, where customers can find anything.", logo: 'A' },
  { id: 4, name: 'Meta', description: "Give people the power to build community and bring the world closer together.", logo: 'M' },
  { id: 5, name: 'Apple', description: "Think Different. Designing the best personal computers in the world.", logo: 'A' },
  { id: 6, name: 'Netflix', description: "Entertain the world. Whatever your taste, and no matter where you live.", logo: 'N' },
];

const Company = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { isDark } = useContext(ThemeContext);
  const navigate = useNavigate();
  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (company) => {
    localStorage.setItem('selectedCompany', company.name);
    navigate('/role');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div className="min-h-screen overflow-hidden relative font-sans" style={{
      backgroundColor: isDark ? "#0a0a0a" : "#ffffff",
      color: isDark ? "#ffffff" : "#0a0a0a"
    }}>
      <ThemeToggle />

      {/* 3D Ambient Lights */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full pointer-events-none animate-blob-float" style={{
        background: isDark
          ? "radial-gradient(circle, rgba(255,255,255,0.025) 0%, transparent 70%)"
          : "radial-gradient(circle, rgba(33,150,243,0.08) 0%, transparent 70%)"
      }}></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full pointer-events-none animate-blob-float" style={{
        background: isDark
          ? "radial-gradient(circle, rgba(255,255,255,0.015) 0%, transparent 70%)"
          : "radial-gradient(circle, rgba(33,150,243,0.05) 0%, transparent 70%)",
        animationDelay: "5s"
      }}></div>

      <div className="container mx-auto px-6 py-32 relative z-10 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -30, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
          style={{ transformPerspective: 1000 }}
        >
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight neon-glow" style={{ color: isDark ? "#ffffff" : "#0a0a0a" }}>
            Select Destination
          </h1>
          <p className="text-xl max-w-2xl mx-auto font-medium leading-relaxed" style={{ color: isDark ? "#aaaaaa" : "#555555" }}>
            Target a specific tech giant to configure the preparation neural engines.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="max-w-3xl mx-auto mb-24 relative card-3d"
        >
          <div className="relative flex items-center glass-card rounded-full px-8 py-5 transition-all duration-300 focus-within:border-white/20">
            <FaSearch className="text-xl mr-5" style={{ color: isDark ? "#444444" : "#aaaaaa" }} />
            <input
              type="text"
              placeholder="Search organizations..."
              className="bg-transparent w-full text-xl font-bold focus:outline-none"
              style={{ color: isDark ? "#ffffff" : "#0a0a0a" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredCompanies.map((company) => (
            <motion.div
              key={company.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -6 }}
              className="relative group h-full cursor-pointer card-3d"
              onClick={() => handleSelect(company)}
            >
              <div
                className="relative h-full flex flex-col glass-card rounded-[2rem] p-10 transition-all duration-500 lift-3d"
                style={{
                  borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(33,150,243,0.15)",
                  background: isDark ? "rgba(255,255,255,0.03)" : "rgba(33,150,243,0.05)"
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.2)" : "rgba(33,150,243,0.3)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(33,150,243,0.15)"}
              >
                <div
                  className="w-20 h-20 rounded-[1.2rem] flex items-center justify-center text-3xl font-bold mb-8 transition-transform duration-500 group-hover:scale-105"
                  style={{
                    background: isDark ? "rgba(255,255,255,0.05)" : "rgba(33,150,243,0.1)",
                    border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(33,150,243,0.2)"
                  }}
                >
                  <span style={{ color: isDark ? "#ffffff" : "#0a0a0a" }}>{company.logo}</span>
                </div>

                <h3 className="text-3xl font-extrabold mb-4 tracking-tight" style={{ color: isDark ? "#ffffff" : "#0a0a0a" }}>
                  {company.name}
                </h3>

                <p className="mb-10 flex-grow leading-relaxed font-medium text-lg" style={{ color: isDark ? "#aaaaaa" : "#555555" }}>
                  {company.description}
                </p>

                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center self-end transition-all duration-300"
                  style={{
                    background: isDark ? "rgba(255,255,255,0.05)" : "rgba(33,150,243,0.1)",
                    border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(33,150,243,0.2)"
                  }}
                >
                  <FaArrowRight style={{ color: isDark ? "#555555" : "#aaaaaa" }} className="group-hover:text-white transition-colors" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredCompanies.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mt-20 text-2xl font-medium"
            style={{ color: isDark ? "#555555" : "#aaaaaa" }}
          >
            No matching entities discovered for <span style={{ color: isDark ? "#ffffff" : "#0a0a0a" }} className="font-bold">"{searchTerm}"</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Company;