import React from 'react';
import { motion } from 'framer-motion';

export const DashboardCard = ({ children, hoverable = true, className = '', ...props }) => {
  return (
    <motion.div
      whileHover={hoverable ? { y: -2 } : {}}
      transition={{ duration: 0.15 }}
      className={`bg-card border border-border/60 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-border/90 transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default DashboardCard;
