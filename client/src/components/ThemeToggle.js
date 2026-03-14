
import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import { motion } from 'framer-motion';

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <motion.button
      onClick={toggleTheme}
      className="fixed top-8 right-8 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300"
      style={{
        background: isDark
          ? 'rgba(0, 255, 255, 0.1)'
          : 'rgba(33, 150, 243, 0.15)',
        border: isDark
          ? '1px solid rgba(0, 255, 255, 0.3)'
          : '1px solid rgba(33, 150, 243, 0.4)',
        color: isDark ? '#00ffff' : '#2196F3',
        boxShadow: isDark
          ? '0 0 20px rgba(0, 255, 255, 0.2)'
          : '0 0 20px rgba(33, 150, 243, 0.2)'
      }}
      whileHover={{
        scale: 1.1,
        boxShadow: isDark
          ? '0 0 30px rgba(0, 255, 255, 0.4)'
          : '0 0 30px rgba(33, 150, 243, 0.4)'
      }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        initial={{ rotate: 0, opacity: 1 }}
        animate={{ rotate: isDark ? 180 : 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {isDark ? (
          <FaMoon className="text-xl" />
        ) : (
          <FaSun className="text-xl" />
        )}
      </motion.div>
    </motion.button>
  );
};