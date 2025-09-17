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
        return <Check className="w-4 h-4 text-emerald-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full"
          />
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
            <div className="max-h-48 overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400">
              <AnimatePresence>
                {uploadedFiles.map((file, index) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: deletingIds.has(file.id) ? 0 : 1,
                      y: 0,
                      scale: deletingIds.has(file.id) ? 0.95 : 1
                    }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-8 h-8 bg-slate-100 rounded-md flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-slate-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {file.name}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-slate-500">
                          <span>{file.type}</span>
                          <span>•</span>
                          <span>{file.size}</span>
                          {index === 0 && file.status === 'completed' && (
                            <>
                              <span>•</span>
                              <span className="text-emerald-600 font-medium">Latest</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <div className="w-4 h-4 flex items-center justify-center">
                        {getStatusIcon(file.status)}
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(file.id);
                        }}
                        className="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        disabled={deletingIds.has(file.id)}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Files Summary */}
            {uploadedFiles.length > 0 && (
              <div className="mt-3 p-2 bg-slate-50 rounded-md">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center space-x-3">
                    <span>
                      <strong>{uploadedFiles.filter(f => f.status === 'completed').length}</strong> completed
                    </span>
                    {uploadedFiles.filter(f => f.status === 'uploading').length > 0 && (
                      <span>
                        <strong>{uploadedFiles.filter(f => f.status === 'uploading').length}</strong> processing
                      </span>
                    )}
                  </div>
                  <div className="text-slate-500">
                    {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
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