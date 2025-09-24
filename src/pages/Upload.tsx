import React from 'react';
import { motion } from 'framer-motion';
import PropertyValuationUpload from '@/components/PropertyValuationUpload';

const Upload = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-6">Property Valuation Upload</h1>
        <PropertyValuationUpload />
      </motion.div>
    </motion.div>
  );
};

export default Upload;