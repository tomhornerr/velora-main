"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X, Check, AlertCircle, Plus } from "lucide-react";

export interface PropertyValuationUploadProps {
  className?: string;
  onUpload?: (file: File) => void;
  onContinueWithReport?: () => void;
}

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  status: 'uploading' | 'completed' | 'error';
  file: File;
}

export default function PropertyValuationUpload({
  className,
  onUpload,
  onContinueWithReport
}: PropertyValuationUploadProps) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFile[]>([]);
  const [deletingIds, setDeletingIds] = React.useState<Set<string>>(new Set());
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach(processFile);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(processFile);
    // Reset input
    e.target.value = '';
  };

  const processFile = (file: File) => {
    // Only accept PDF, JPG, PNG files
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return;
    }

    const newFile: UploadedFile = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: formatFileSize(file.size),
      type: getFileType(file.type),
      status: 'uploading',
      file
    };

    setUploadedFiles(prev => [...prev, newFile]);
    onUpload?.(file);

    // Simulate upload process
    setTimeout(() => {
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === newFile.id 
            ? { ...f, status: 'completed' as const }
            : f
        )
      );
    }, 1500);
  };

  const handleDelete = async (id: string) => {
    setDeletingIds(prev => new Set([...prev, id]));
    
    // Animate out then remove
    setTimeout(() => {
      setUploadedFiles(prev => prev.filter(f => f.id !== id));
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, 300);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileType = (mimeType: string): string => {
    if (mimeType === 'application/pdf') return 'PDF';
    if (mimeType.startsWith('image/')) return 'Image';
    return 'File';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-4 h-4 bg-emerald-100 rounded-full flex items-center justify-center"
          >
            <Check className="w-3 h-3 text-emerald-600" />
          </motion.div>
        );
      case 'error':
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center"
          >
            <AlertCircle className="w-3 h-3 text-red-600" />
          </motion.div>
        );
      default:
        return (
          <div className="w-4 h-4 relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-slate-200 border-t-blue-500 rounded-full"
            />
            <div className="absolute inset-0 bg-blue-50 rounded-full opacity-50 animate-pulse" />
          </div>
        );
    }
  };

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return (
          <div className="w-8 h-8 bg-red-100 rounded-md flex items-center justify-center">
            <FileText className="w-4 h-4 text-red-600" />
          </div>
        );
      case 'Image':
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-slate-100 rounded-md flex items-center justify-center">
            <FileText className="w-4 h-4 text-slate-600" />
          </div>
        );
    }
  };

  return (
    <div className={`w-full h-full flex flex-col ${className || ''}`}>
      {/* Header */}
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8 text-white" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Upload & Analyze
        </h1>
        <p className="text-slate-600">
          Drop your property documents here or click to browse
        </p>
      </div>

      {/* Upload Area */}
      <div className="flex-1 px-8 pb-8">
        <motion.div
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 cursor-pointer ${
            isDragOver
              ? 'border-slate-400 bg-slate-50'
              : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50/50'
          }`}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="flex flex-col items-center space-y-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
              isDragOver ? 'bg-slate-200' : 'bg-slate-100'
            }`}>
              <Plus className="w-8 h-8 text-slate-600" strokeWidth={1.5} />
            </div>
            
            <div>
              <p className="text-lg font-semibold text-slate-800 mb-1">
                Drop your documents here or click to browse
              </p>
              <p className="text-sm text-slate-500">
                Supports PDF, JPG, PNG files up to 25MB
              </p>
            </div>

            <div className="flex items-center space-x-6 text-xs text-slate-500">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span>Secure upload</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Instant processing</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>AI-powered</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">
                Uploaded Files ({uploadedFiles.length})
              </h3>
              {uploadedFiles.length > 3 && (
                <div className="text-sm text-slate-500">
                  Scroll to see all files
                </div>
              )}
            </div>
            
            {/* Scrollable container */}
            <div className="max-h-64 overflow-y-auto pr-3 space-y-3 scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400">
              <AnimatePresence>
                {uploadedFiles.map((file, index) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ 
                      opacity: deletingIds.has(file.id) ? 0 : 1,
                      y: 0,
                      scale: deletingIds.has(file.id) ? 0.95 : 1
                    }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    whileHover={{ 
                      scale: 1.02,
                      y: -2,
                      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)"
                    }}
                    className={`group relative flex items-center justify-between p-4 bg-white rounded-xl border transition-all duration-200 cursor-pointer ${
                      file.status === 'completed' 
                        ? 'border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50/30' 
                        : file.status === 'uploading'
                        ? 'border-blue-200 hover:border-blue-300 hover:bg-blue-50/30'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {/* Progress bar for uploading files */}
                    {file.status === 'uploading' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-100 rounded-b-xl overflow-hidden">
                        <motion.div
                          className="h-full bg-blue-500"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 1.5, ease: "easeInOut" }}
                        />
                      </div>
                    )}

                    {/* Completion glow effect */}
                    {file.status === 'completed' && (
                      <motion.div
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400/5 to-green-400/5 opacity-0 group-hover:opacity-100"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.3, 0] }}
                        transition={{ duration: 2, delay: 0.5 }}
                      />
                    )}

                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                        className="flex-shrink-0"
                      >
                        {getFileTypeIcon(file.type)}
                      </motion.div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate group-hover:text-slate-800 mb-1">
                          {file.name}
                        </p>
                        <div className="flex items-center space-x-3 text-xs">
                          <motion.span 
                            className={`px-2 py-1 rounded-md text-xs font-medium ${
                              file.type === 'PDF' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                            }`}
                            whileHover={{ scale: 1.05 }}
                          >
                            {file.type}
                          </motion.span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-500 font-medium">{file.size}</span>
                          {index === 0 && file.status === 'completed' && (
                            <motion.span
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-medium"
                            >
                              Latest
                            </motion.span>
                          )}
                          {file.status === 'uploading' && (
                            <motion.span
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className="text-blue-600 font-medium"
                            >
                              Processing...
                            </motion.span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 flex-shrink-0">
                      <div className="flex items-center justify-center">
                        {getStatusIcon(file.status)}
                      </div>
                      
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(file.id);
                        }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                        disabled={deletingIds.has(file.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Empty state when scrolling */}
              {uploadedFiles.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 text-slate-500"
                >
                  <FileText className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No files uploaded yet</p>
                </motion.div>
              )}
            </div>

            {/* Enhanced Files Summary */}
            {uploadedFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-xl border border-slate-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-6">
                    <motion.div
                      className="flex items-center space-x-2"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <span className="text-sm text-slate-600">
                        <strong className="text-emerald-700">{uploadedFiles.filter(f => f.status === 'completed').length}</strong> ready
                      </span>
                    </motion.div>
                    
                    {uploadedFiles.filter(f => f.status === 'uploading').length > 0 && (
                      <motion.div
                        className="flex items-center space-x-2"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-slate-600">
                          <strong className="text-blue-700">{uploadedFiles.filter(f => f.status === 'uploading').length}</strong> processing
                        </span>
                      </motion.div>
                    )}
                    
                    {uploadedFiles.filter(f => f.status === 'error').length > 0 && (
                      <motion.div
                        className="flex items-center space-x-2"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-slate-600">
                          <strong className="text-red-700">{uploadedFiles.filter(f => f.status === 'error').length}</strong> failed
                        </span>
                      </motion.div>
                    )}
                  </div>
                  
                  <div className="text-sm text-slate-500 font-medium">
                    {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''}
                  </div>
                </div>
                
                {/* Progress bar for overall completion */}
                <div className="mt-2">
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${(uploadedFiles.filter(f => f.status === 'completed').length / uploadedFiles.length) * 100}%` 
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Continue Button */}
            {uploadedFiles.some(f => f.status === 'completed') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-center"
              >
                <button
                  onClick={onContinueWithReport}
                  className="px-8 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors shadow-sm"
                >
                  Analyze Documents
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}