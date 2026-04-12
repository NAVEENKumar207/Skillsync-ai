import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaArrowRight, FaArrowLeft } from "react-icons/fa";

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
  const navigate = useNavigate();
  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (company) => {
    localStorage.setItem('selectedCompany', company.name);
    navigate('/role');
  };

  return (
    <div className="min-h-screen text-retro-dark font-body selection:bg-retro-yellow selection:text-retro-dark relative overflow-x-hidden p-6 py-12 transition-colors duration-300">
      <Star className="absolute top-10 left-[10%] opacity-70 animate-star" size={28} />
      <Star className="absolute bottom-10 right-[10%] opacity-60 animate-star" size={32} />

      <div className="max-w-6xl mx-auto relative z-10">
        <Link to="/upload" className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[2px] text-retro-dark opacity-60 hover:opacity-100 transition-colors mb-12">
          <FaArrowLeft size={10} /> Back to Upload
        </Link>

        <div className="text-center mb-16">
          <div className="text-[10px] font-black tracking-[3px] opacity-60 text-retro-dark uppercase mb-4">
            ★ STEP 02: TARGET
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-black uppercase mb-4 text-retro-dark leading-none">
            Select <span className="text-retro-yellow text-stroke-dark">Destination</span>
          </h1>
          <p className="text-sm md:text-base text-retro-dark opacity-80 max-w-xl mx-auto leading-relaxed">
            Target a specific tech giant to configure the preparation engines for their specific interview standards.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-retro-dark opacity-50" />
            <input
              type="text"
              placeholder="SEARCH ORGANIZATIONS..."
              className="retro-input !pl-12 uppercase placeholder:opacity-30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCompanies.map((company) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => handleSelect(company)}
              className="retro-card !p-10 cursor-pointer group flex flex-col h-full hover:bg-[var(--retro-card-bg)]"
            >
              <div className="w-16 h-16 border-2 border-retro-dark flex items-center justify-center text-3xl font-display font-black mb-8 bg-retro-yellow text-black shadow-[4px_4px_0px_var(--retro-text)] group-hover:shadow-none group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all">
                {company.logo}
              </div>

              <h3 className="text-2xl font-display font-black uppercase mb-4 text-retro-dark">
                {company.name}
              </h3>

              <p className="text-sm text-retro-dark opacity-80 leading-relaxed font-body mb-8 flex-grow">
                {company.description}
              </p>

              <div className="flex items-center justify-between mt-auto">
                <span className="text-[10px] font-black tracking-widest text-retro-dark uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                  SELECT TARGET →
                </span>
                <div className="w-10 h-10 border-2 border-retro-dark flex items-center justify-center group-hover:bg-[var(--retro-text)] group-hover:text-[var(--retro-bg)] transition-colors">
                  <FaArrowRight size={14} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCompanies.length === 0 && (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🛸</div>
            <p className="font-display font-black uppercase text-retro-dark opacity-40 tracking-widest">
              No entities discovered for "{searchTerm}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Company;