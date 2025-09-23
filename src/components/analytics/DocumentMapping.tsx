import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, FileText, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SystemDocument {
  id: string;
  name: string;
  propertyAddress?: string;
  status: string;
  size: string;
}

interface DocumentMappingProps {
  documents: SystemDocument[];
  onDocumentSelect: (doc: SystemDocument) => void;
  onDocumentDelete: (id: string) => void;
}

export default function DocumentMapping({ 
  documents, 
  onDocumentSelect, 
  onDocumentDelete 
}: DocumentMappingProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed': return 'text-emerald-700 bg-emerald-100 border-emerald-200';
      case 'processing': return 'text-amber-700 bg-amber-100 border-amber-200';
      case 'error': return 'text-red-700 bg-red-100 border-red-200';
      default: return 'text-slate-700 bg-slate-100 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Document Property Mapping</h2>
            <p className="text-sm text-slate-600">Interactive property locations with document links</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px]">
        {/* Interactive Map Area */}
        <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative flex items-center justify-center border-r border-slate-100">
          <div className="text-center z-10">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-4 mx-auto">
              <MapPin className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-slate-700 font-semibold text-lg">Interactive Map</p>
            <p className="text-sm text-slate-500 mt-2 max-w-xs">
              Property locations with document links and status indicators
            </p>
          </div>
        
          {/* Enhanced property pins with animations */}
          <motion.div 
            className="absolute top-20 left-16"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg border-2 border-white" />
          </motion.div>
          
          <motion.div 
            className="absolute top-32 right-20"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ 
              duration: 2,
              delay: 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="w-4 h-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full shadow-lg border-2 border-white" />
          </motion.div>
          
          <motion.div 
            className="absolute bottom-24 left-1/3"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ 
              duration: 2,
              delay: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="w-4 h-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full shadow-lg border-2 border-white" />
          </motion.div>

          {/* Connecting lines */}
          <div className="absolute inset-0 pointer-events-none">
            <svg className="w-full h-full opacity-20">
              <path d="M 80 100 Q 200 150 300 140" stroke="url(#gradient1)" strokeWidth="2" fill="none" strokeDasharray="5,5" />
              <path d="M 300 140 Q 250 200 150 280" stroke="url(#gradient2)" strokeWidth="2" fill="none" strokeDasharray="5,5" />
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Enhanced Document List */}
        <div className="p-6 overflow-y-auto bg-gradient-to-b from-white to-slate-50">
          <div className="space-y-4">
            <AnimatePresence>
              {documents.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, scale: 0.95 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="group flex items-center p-4 bg-white rounded-xl border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all duration-300 cursor-pointer"
                  onClick={() => onDocumentSelect(doc)}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 truncate text-base group-hover:text-slate-800 transition-colors">
                        {doc.name}
                      </p>
                            <p className="text-sm text-slate-600 truncate mt-1">
                        {doc.propertyAddress || 'No address specified'}
                      </p>
                      <div className="flex items-center space-x-3 mt-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(doc.status)}`}>
                          {doc.status}
                        </span>
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                          {doc.size}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-9 h-9 p-0 hover:bg-slate-100 rounded-lg"
                    >
                      <Eye className="w-4 h-4 text-slate-600" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-9 h-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDocumentDelete(doc.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {documents.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">No documents uploaded yet</p>
                <p className="text-sm text-slate-400 mt-1">Upload your first property document to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}