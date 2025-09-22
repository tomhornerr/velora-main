"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X, Check, AlertCircle, Plus, Image, FileIcon, Camera, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  preview?: string;
}

const uploadSteps = [
  { id: 1, title: "Upload", completed: false, active: true },
  { id: 2, title: "Process", completed: false, active: false },
  { id: 3, title: "Analyze", completed: false, active: false }
];

export default function PropertyValuationUpload({
  className,
  onUpload,
  onContinueWithReport
}: PropertyValuationUploadProps) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFile[]>([]);
  const [currentStep, setCurrentStep] = React.useState(1);
  const [steps, setSteps] = React.useState(uploadSteps);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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
    e.target.value = '';
  };

  const processFile = (file: File) => {
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

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === newFile.id 
              ? { ...f, preview: e.target?.result as string }
              : f
          )
        );
      };
      reader.readAsDataURL(file);
    }

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
    }, 2000);
  };

  const handleDelete = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleContinue = () => {
    setCurrentStep(2);
    setSteps(prev => prev.map(step => 
      step.id === 1 ? { ...step, completed: true, active: false } :
      step.id === 2 ? { ...step, active: true } : step
    ));
    
    setTimeout(() => {
      setCurrentStep(3);
      setSteps(prev => prev.map(step => 
        step.id === 2 ? { ...step, completed: true, active: false } :
        step.id === 3 ? { ...step, active: true } : step
      ));
    }, 2000);
    
    // Show completion notification after 10 seconds
    setTimeout(() => {
      setSteps(prev => prev.map(step => 
        step.id === 3 ? { ...step, completed: true, active: false } : step
      ));
      
      toast({
        title: "✨ Documents Successfully Processed",
        description: "Your files are now integrated and ready for intelligent analysis.",
        duration: 5000,
        className: "border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50",
      });
      
      // Continue with report after notification
      setTimeout(() => {
        onContinueWithReport?.();
      }, 1000);
    }, 10000);
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

  const completedFiles = uploadedFiles.filter(f => f.status === 'completed');
  const canContinue = completedFiles.length > 0;

  return (
    <div className={`w-full h-full flex items-center justify-center p-4 overflow-hidden ${className || ''}`}>
      <div className="w-full max-w-2xl">
        {/* Step Indicator */}
        <div className="flex-shrink-0 flex items-center justify-center mb-6">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      step.completed 
                        ? 'bg-emerald-500 text-white' 
                        : step.active
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {step.completed ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : step.id === 1 ? (
                      <Upload className="w-5 h-5" />
                    ) : step.id === 2 ? (
                      <FileText className="w-5 h-5" />
                    ) : (
                      <Camera className="w-5 h-5" />
                    )}
                  </motion.div>
                  <span className={`text-xs mt-1 font-medium ${
                    step.active ? 'text-slate-900' : 'text-slate-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 transition-colors duration-300 ${
                    steps[index + 1].completed || steps[index + 1].active 
                      ? 'bg-emerald-500' 
                      : 'bg-slate-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Upload Card - Compact when empty, expands with content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
        >
          {/* Card Header */}
          <div className="flex-shrink-0 p-4 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Upload className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900">Property Document Upload</h2>
                <p className="text-xs text-slate-500">Upload your property documents for analysis</p>
              </div>
            </div>
          </div>

          {/* Upload Section */}
          {currentStep === 1 && (
            <div className="p-4">
              <motion.div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
                  isDragOver
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50/50'
                }`}
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

                <div className="flex flex-col items-center space-y-3">
                  <motion.div
                    className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"
                    animate={{ 
                      scale: isDragOver ? 1.1 : 1,
                      rotate: isDragOver ? 5 : 0 
                    }}
                  >
                    <Plus className="w-6 h-6 text-blue-600" />
                  </motion.div>
                  
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 mb-1">
                      {isDragOver ? 'Drop your files here' : 'Choose files or drag and drop'}
                    </h3>
                    <p className="text-sm text-slate-500">
                      PDF, JPG, PNG files up to 10MB each
                    </p>
                  </div>

                  <div className="flex items-center space-x-4 text-xs text-slate-500">
                    <div className="flex items-center space-x-1">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                      <span>Secure Upload</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span>AI Analysis</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Uploaded Files Grid - Only show when files exist */}
              <AnimatePresence>
                {uploadedFiles.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 overflow-hidden"
                  >
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">
                      Uploaded Files ({uploadedFiles.length})
                    </h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400">
                      <AnimatePresence>
                        {uploadedFiles.map((file) => (
                          <motion.div
                            key={file.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex items-center p-3 bg-slate-50 rounded-lg border border-slate-200 group hover:shadow-md transition-all duration-200 mr-1"
                          >
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                              <div className="relative flex-shrink-0">
                                {file.preview ? (
                                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100">
                                    <img 
                                      src={file.preview} 
                                      alt={file.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                    file.type === 'PDF' ? 'bg-red-100' : 'bg-blue-100'
                                  }`}>
                                    {file.type === 'PDF' ? (
                                      <FileText className={`w-5 h-5 ${
                                        file.type === 'PDF' ? 'text-red-600' : 'text-blue-600'
                                      }`} />
                                    ) : (
                                      <Image className="w-5 h-5 text-blue-600" />
                                    )}
                                  </div>
                                )}
                                
                                {/* Status Indicator */}
                                <div className="absolute -top-1 -right-1">
                                  {file.status === 'completed' ? (
                                    <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                                      <Check className="w-2.5 h-2.5 text-white" />
                                    </div>
                                  ) : file.status === 'uploading' ? (
                                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                      <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-2.5 h-2.5 border border-white border-t-transparent rounded-full"
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                      <AlertCircle className="w-2.5 h-2.5 text-white" />
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-slate-900 truncate text-sm">{file.name}</p>
                                <div className="flex items-center space-x-2 mt-0.5">
                                  <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                                    file.type === 'PDF' 
                                      ? 'bg-red-100 text-red-700' 
                                      : 'bg-blue-100 text-blue-700'
                                  }`}>
                                    {file.type}
                                  </span>
                                  <span className="text-xs text-slate-500">{file.size}</span>
                                  {file.status === 'uploading' && (
                                    <span className="text-xs text-blue-600 font-medium">Uploading...</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => handleDelete(file.id)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Processing State */}
          {(currentStep === 2 || currentStep === 3) && (
            <div className="p-8 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {currentStep === 2 ? 'Processing Documents...' : 'Analyzing Properties...'}
              </h3>
              <p className="text-slate-500 mb-3">
                {currentStep === 2 
                  ? 'We\'re extracting information from your documents' 
                  : 'AI is analyzing your property details'
                }
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mx-auto max-w-md">
                <p className="text-sm text-slate-700 font-medium">
                  💡 You can leave this screen and continue working
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  We'll notify you when the analysis is complete
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons - Only show when files exist */}
          {uploadedFiles.length > 0 && currentStep === 1 && (
            <div className="flex-shrink-0 p-4 border-t border-slate-100 bg-slate-50">
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  <span>{completedFiles.length} of {uploadedFiles.length} files ready</span>
                </div>
                
                <motion.button
                  onClick={handleContinue}
                  disabled={!canContinue}
                  className={`px-4 py-2 rounded-lg font-semibold text-white transition-all duration-200 text-sm ${
                    canContinue
                      ? 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                      : 'bg-slate-300 cursor-not-allowed'
                  }`}
                  whileHover={canContinue ? { scale: 1.02 } : {}}
                  whileTap={canContinue ? { scale: 0.98 } : {}}
                >
                  Continue Analysis
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}