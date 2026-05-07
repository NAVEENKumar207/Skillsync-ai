import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCode, FaServer, FaChartBar, FaShieldAlt, FaMobileAlt, FaArrowRight, FaArrowLeft, FaHome } from "react-icons/fa";

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

const roles = [
  { id: 'frontend', name: 'Frontend Engineer', icon: <FaCode />, description: "Building high-performance, accessible, and beautiful user interfaces." },
  { id: 'backend', name: 'Backend Engineer', icon: <FaServer />, description: "Designing scalable APIs, distributed systems, and database architectures." },
  { id: 'fullstack', name: 'Full Stack Engineer', icon: <FaCode />, description: "Mastering both ends of the wire to build complete, end-to-end products." },
  { id: 'data', name: 'Data Scientist', icon: <FaChartBar />, description: "Extracting insights from complex data to drive product decisions." },
  { id: 'devops', name: 'DevOps & SRE', icon: <FaShieldAlt />, description: "Ensuring reliability, automation, and seamless cloud deployments." },
  { id: 'mobile', name: 'Mobile Developer', icon: <FaMobileAlt />, description: "Creating world-class native experiences for iOS and Android." },
];

const Role = () => {
  const navigate = useNavigate();
  const selectedCompany = localStorage.getItem('selectedCompany') || 'COMPANY';

  const handleSelect = (roleName) => {
    localStorage.setItem('selectedRole', roleName);
    navigate('/analysis');
  };

  return (
    <div className="min-h-screen text-retro-dark font-body selection:bg-retro-yellow selection:text-retro-dark relative overflow-x-hidden p-6 py-12 transition-colors duration-300">
      <Star className="absolute top-10 right-[10%] opacity-70 animate-star" size={28} />
      <Star className="absolute bottom-10 left-[10%] opacity-60 animate-star" size={32} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-12">
            <Link to="/company" className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[2px] text-retro-dark opacity-60 hover:opacity-100 transition-colors">
              <FaArrowLeft size={10} /> Back to Company
            </Link>
            <Link to="/dashboard" className="retro-btn-secondary !py-1.5 !px-3 flex items-center gap-2">
                <FaHome size={12} /> <span className="text-[10px]">DASHBOARD</span>
            </Link>
        </div>

        <div className="text-center mb-16">
          <div className="text-[10px] font-black tracking-[3px] opacity-60 text-retro-dark uppercase mb-4">
            ★ STEP 03: DEFINE
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-black uppercase mb-4 text-retro-dark leading-none">
            WHAT'S YOUR ROLE AT <br />
            <span className="text-retro-yellow text-stroke-dark">{selectedCompany.toUpperCase()}</span>?
          </h1>
          <p className="text-sm md:text-base text-retro-dark opacity-80 max-w-xl mx-auto leading-relaxed">
            We'll customize your roadmap based on the specific engineering requirements of this role.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {roles.map((role, i) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => handleSelect(role.name)}
              className="retro-card !p-10 cursor-pointer group flex flex-col h-full hover:bg-[var(--retro-card-bg)]"
            >
              <div className="text-4xl text-retro-dark mb-8 group-hover:scale-110 group-hover:text-retro-yellow transition-all duration-300">
                {role.icon}
              </div>
              
              <h3 className="text-2xl font-display font-black uppercase mb-4 text-retro-dark leading-tight">
                {role.name}
              </h3>
              
              <p className="text-sm text-retro-dark opacity-80 leading-relaxed font-body mb-8 flex-grow">
                {role.description}
              </p>
              
              <div className="flex items-center justify-between mt-auto">
                <span className="text-[10px] font-black tracking-widest text-retro-dark uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                  SELECT ROLE →
                </span>
                <div className="w-10 h-10 border-2 border-retro-dark flex items-center justify-center group-hover:bg-[var(--retro-text)] group-hover:text-[var(--retro-bg)] transition-colors">
                  <FaArrowRight size={14} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Role;