import React from 'react';
import { motion } from 'framer-motion';
import AnalyticsComponent from '@/components/Analytics';

const Analytics = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      <AnalyticsComponent />
    </motion.div>
  );
};

export default Analytics;