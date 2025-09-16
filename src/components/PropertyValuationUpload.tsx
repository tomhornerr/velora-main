"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Clock, CheckCircle, TrendingUp, HelpCircle, X, Shield, Trash2, Eye, Download, Plus, Sparkles, Brain, Zap, Database, Search, Filter, Grid, List } from "lucide-react";
export interface PropertyValuationUploadProps {
  className?: string;
  onUpload?: (file: File) => void;
  onContinueWithReport?: () => void;
}
interface UploadedDocument {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadDate: string;
  status: 'processing' | 'completed' | 'error';
}
const features = [{
  id: "auto-extract",
  text: "AI extracts key property details instantly",
  icon: Brain,
  color: "from-slate-600 to-slate-700"
}, {
  id: "market-analysis",
  text: "Real-time market analysis & comparisons",
  icon: TrendingUp,
  color: "from-slate-600 to-slate-700"
}, {
  id: "instant-insights",
  text: "Comprehensive valuation insights in 30s",
  icon: Zap,
  color: "from-slate-600 to-slate-700"
}] as any[];
const processSteps = [{
  id: 1,
  title: "AI Document Analysis",
  description: "Our advanced AI extracts key property details, financial metrics, and market data in seconds.",
  color: "slate",
  bgColor: "bg-slate-50",
  textColor: "text-slate-700",
  borderColor: "border-slate-200",
  icon: Brain
}, {
  id: 2,
  title: "Market Intelligence",
  description: "We validate accuracy with current market trends, comparable sales, and neighborhood insights.",
  color: "slate",
  bgColor: "bg-slate-50",
  textColor: "text-slate-700",
  borderColor: "border-slate-200",
  icon: TrendingUp
}, {
  id: 3,
  title: "Intelligent Dashboard",
  description: "Get comprehensive insights with investment potential, risk analysis, and actionable recommendations.",
  color: "slate",
  bgColor: "bg-slate-50",
  textColor: "text-slate-700",
  borderColor: "border-slate-200",
  icon: Sparkles
}] as any[];
export default function PropertyValuationUpload({
  className,
  onUpload,
  onContinueWithReport
}: PropertyValuationUploadProps) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [showNextSteps, setShowNextSteps] = React.useState(false);
  const [showDocuments, setShowDocuments] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [uploadedDocuments, setUploadedDocuments] = React.useState<UploadedDocument[]>([{
    id: "1",
    name: "Property_Valuation_Report_2024.pdf",
    size: "2.4 MB",
    type: "PDF",
    uploadDate: "2 hours ago",
    status: "completed"
  }, {
    id: "2",
    name: "Market_Analysis_Downtown.pdf",
    size: "1.8 MB",
    type: "PDF",
    uploadDate: "1 day ago",
    status: "completed"
  }, {
    id: "3",
    name: "Property_Photos_Gallery.zip",
    size: "15.2 MB",
    type: "ZIP",
    uploadDate: "3 days ago",
    status: "processing"
  }]);

  // Enhanced state for better button interactions
  const [isDocumentsLoading, setIsDocumentsLoading] = React.useState(false);
  const [isProcessLoading, setIsProcessLoading] = React.useState(false);
  const [deletingDocId, setDeletingDocId] = React.useState<string | null>(null);
  const [viewingDocId, setViewingDocId] = React.useState<string | null>(null);
  const [downloadingDocId, setDownloadingDocId] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        setSelectedFile(file);
        onUpload?.(file);

        // Add to uploaded documents
        const newDoc: UploadedDocument = {
          id: Date.now().toString(),
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          type: file.type.includes('pdf') ? 'PDF' : 'IMAGE',
          uploadDate: 'Just now',
          status: 'processing'
        };
        setUploadedDocuments(prev => [newDoc, ...prev]);
      }
    }
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      onUpload?.(file);

      // Add to uploaded documents
      const newDoc: UploadedDocument = {
        id: Date.now().toString(),
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        type: file.type.includes('pdf') ? 'PDF' : 'IMAGE',
        uploadDate: 'Just now',
        status: 'processing'
      };
      setUploadedDocuments(prev => [newDoc, ...prev]);
    }
  };
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  const toggleNextSteps = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsProcessLoading(true);

    // Simulate loading for better UX
    setTimeout(() => {
      setShowNextSteps(!showNextSteps);
      setIsProcessLoading(false);
    }, 300);
  };
  const toggleDocuments = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDocumentsLoading(true);

    // Simulate API call for document loading
    setTimeout(() => {
      setShowDocuments(!showDocuments);
      setIsDocumentsLoading(false);
    }, 400);
  };
  const handleDeleteDocument = async (docId: string) => {
    setDeletingDocId(docId);

    // Simulate API call
    setTimeout(() => {
      setUploadedDocuments(prev => prev.filter(doc => doc.id !== docId));
      setDeletingDocId(null);
    }, 800);
  };
  const handleViewDocument = async (docId: string) => {
    setViewingDocId(docId);

    // Simulate document viewing
    setTimeout(() => {
      setViewingDocId(null);
      // Here you would typically open a document viewer
      console.log(`Viewing document ${docId}`);
    }, 1000);
  };
  const handleDownloadDocument = async (docId: string) => {
    setDownloadingDocId(docId);

    // Simulate download
    setTimeout(() => {
      setDownloadingDocId(null);
      // Here you would typically trigger the download
      console.log(`Downloading document ${docId}`);
    }, 1200);
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'processing':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'error':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'processing':
        return Clock;
      case 'error':
        return X;
      default:
        return FileText;
    }
  };
  return <div className={`w-full h-full flex flex-col ${className || ''}`}>
      <motion.div initial={{
      opacity: 0,
      y: 20,
      scale: 0.98
    }} animate={{
      opacity: 1,
      y: 0,
      scale: 1
    }} transition={{
      duration: 0.8,
      ease: [0.23, 1, 0.32, 1]
    }} className="w-full h-full flex flex-col">
        <div className="flex-1 flex flex-col bg-white/95 backdrop-blur-xl overflow-hidden">
          
          {/* Header Section */}
          <div className="px-6 lg:px-12 py-8 lg:py-12 border-b border-slate-100">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center shadow-sm">
                  <Upload className="w-7 h-7 text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                    <span>Upload & Analyze</span>
                  </h1>
                  <div className="flex items-center space-x-2 mt-2">
                    <Sparkles className="w-4 h-4 text-slate-600" strokeWidth={1.5} />
                    <span className="text-sm text-slate-600 font-medium">
                      Powered by Velora AI - Complete analysis in 30 seconds
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Document Count Badge */}
              <div className="flex items-center space-x-3">
                <button onClick={toggleDocuments} disabled={isDocumentsLoading} className={`
                    flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-300 text-sm font-medium border shadow-sm
                    ${isDocumentsLoading ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300 hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-slate-500/20'}
                  `}>
                  {isDocumentsLoading ? <motion.div animate={{
                  rotate: 360
                }} transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear"
                }} className="w-4 h-4">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </motion.div> : <Database className="w-4 h-4" strokeWidth={1.5} />}
                  <span>
                    {isDocumentsLoading ? 'Loading...' : `${uploadedDocuments.length} Documents`}
                  </span>
                  <motion.div animate={{
                  rotate: showDocuments ? 180 : 0
                }} transition={{
                  duration: 0.3,
                  ease: [0.23, 1, 0.32, 1]
                }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </button>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return <motion.div key={feature.id} initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.5,
                ease: [0.23, 1, 0.32, 1],
                delay: 0.1 + index * 0.1
              }} className="flex items-center space-x-4 p-6 bg-slate-50/50 rounded-2xl border border-slate-200/40 hover:border-slate-300/60 transition-all duration-300 hover:shadow-sm">
                    <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-sm`}>
                      <IconComponent className="w-6 h-6 text-white" strokeWidth={1.5} />
                    </div>
                    <span className="text-slate-700 font-medium text-sm leading-relaxed flex-1">
                      {feature.text}
                    </span>
                  </motion.div>;
            })}
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button onClick={toggleNextSteps} disabled={isProcessLoading} className={`
                  flex items-center justify-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 text-sm font-medium border shadow-sm flex-1
                  ${isProcessLoading ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300 hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-slate-500/20'}
                `}>
                {isProcessLoading ? <motion.div animate={{
                rotate: 360
              }} transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear"
              }} className="w-4 h-4">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </motion.div> : <HelpCircle className="w-4 h-4" strokeWidth={1.5} />}
                <span>
                  {isProcessLoading ? 'Loading...' : showNextSteps ? "Hide process details" : "How does it work?"}
                </span>
                <motion.div animate={{
                rotate: showNextSteps ? 180 : 0
              }} transition={{
                duration: 0.3,
                ease: [0.23, 1, 0.32, 1]
              }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </button>
            </div>

            {/* Process Steps Panel */}
            <AnimatePresence mode="wait">
              {showNextSteps && <motion.div key="process-steps" initial={{
              opacity: 0,
              height: 0,
              y: -10
            }} animate={{
              opacity: 1,
              height: "auto",
              y: 0
            }} exit={{
              opacity: 0,
              height: 0,
              y: -10
            }} transition={{
              duration: 0.4,
              ease: [0.23, 1, 0.32, 1]
            }} className="mb-8 overflow-hidden">
                  <div className="bg-slate-50/50 rounded-2xl p-8 border border-slate-200/40">
                    <h3 className="text-lg font-semibold text-slate-800 mb-8 flex items-center justify-center space-x-2">
                      <div className="w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" strokeWidth={2} />
                      </div>
                      <span>AI-Powered Analysis Process</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {processSteps.map((step, index) => {
                    const StepIcon = step.icon;
                    return <motion.div key={step.id} initial={{
                      opacity: 0,
                      y: 20
                    }} animate={{
                      opacity: 1,
                      y: 0
                    }} transition={{
                      duration: 0.4,
                      delay: index * 0.1,
                      ease: [0.23, 1, 0.32, 1]
                    }} className="text-center">
                            <div className={`w-16 h-16 ${step.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 border ${step.borderColor} shadow-sm`}>
                              <StepIcon className={`w-8 h-8 ${step.textColor}`} strokeWidth={1.5} />
                            </div>
                            <h4 className="font-semibold text-slate-800 text-base mb-3">
                              {step.title}
                            </h4>
                            <p className="text-slate-600 text-sm leading-relaxed">
                              {step.description}
                            </p>
                          </motion.div>;
                  })}
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-slate-200">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-slate-600">
                          <Clock className="w-4 h-4" strokeWidth={1.5} />
                          <span className="font-medium">Average processing time: ~30 seconds</span>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-700 font-medium">
                          <Shield className="w-4 h-4" strokeWidth={1.5} />
                          <span>Enterprise-grade security</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>}
            </AnimatePresence>

            {/* Document Management Panel */}
            <AnimatePresence mode="wait">
              {showDocuments && <motion.div key="documents-panel" initial={{
              opacity: 0,
              height: 0,
              y: -10
            }} animate={{
              opacity: 1,
              height: "auto",
              y: 0
            }} exit={{
              opacity: 0,
              height: 0,
              y: -10
            }} transition={{
              duration: 0.4,
              ease: [0.23, 1, 0.32, 1]
            }} className="mb-8 overflow-hidden">
                  <div className="bg-slate-50/50 rounded-2xl border border-slate-200/40 overflow-hidden">
                    {/* Header with AI Search */}
                    <div className="flex items-center justify-between p-6 bg-white border-b border-slate-200/60">
                      <div className="flex items-center space-x-4">
                        <h3 className="text-xl font-semibold text-slate-800 flex items-center space-x-3">
                          <Database className="w-6 h-6 text-slate-600" />
                          <span>Document Library</span>
                          <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-medium">
                            {uploadedDocuments.filter(doc => doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || doc.type.toLowerCase().includes(searchQuery.toLowerCase())).length} documents
                          </span>
                        </h3>
                      </div>
                      
                      {/* AI Search and Controls */}
                      <div className="flex items-center space-x-3">
                        {/* AI Search Bar */}
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Brain className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-500" />
                          <input type="text" placeholder="AI search documents..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-80 pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-300 transition-all duration-200" />
                        </div>
                        
                        {/* View Toggle */}
                        <div className="flex items-center bg-slate-100 rounded-lg p-1">
                          <button onClick={() => setViewMode('grid')} className={`
                              p-2 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500/20 active:scale-95
                              ${viewMode === 'grid' ? 'bg-white text-slate-700 shadow-sm transform scale-105' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}
                            `}>
                            <Grid className="w-4 h-4" />
                          </button>
                          <button onClick={() => setViewMode('list')} className={`
                              p-2 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500/20 active:scale-95
                              ${viewMode === 'list' ? 'bg-white text-slate-700 shadow-sm transform scale-105' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}
                            `}>
                            <List className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Documents Display */}
                    <div className="p-6">
                      {(() => {
                    const filteredDocs = uploadedDocuments.filter(doc => doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || doc.type.toLowerCase().includes(searchQuery.toLowerCase()));
                    if (filteredDocs.length === 0) {
                      return <div className="text-center py-16">
                              {searchQuery ? <>
                                  <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" strokeWidth={1} />
                                  <p className="text-slate-500 text-sm mb-2">No documents match your search</p>
                                  <p className="text-slate-400 text-xs">Try different keywords or clear the search</p>
                                </> : <>
                                  <Database className="w-12 h-12 text-slate-300 mx-auto mb-4" strokeWidth={1} />
                                  <p className="text-slate-500 text-sm">No documents uploaded yet</p>
                                </>}
                            </div>;
                    }
                    if (viewMode === 'grid') {
                      return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                              {filteredDocs.map((doc, index) => {
                          const StatusIcon = getStatusIcon(doc.status);
                          return <motion.div key={doc.id} initial={{
                            opacity: 0,
                            y: 20
                          }} animate={{
                            opacity: 1,
                            y: 0
                          }} transition={{
                            duration: 0.3,
                            delay: index * 0.05
                          }} className="group bg-white rounded-xl border border-slate-200/60 hover:border-slate-300/60 transition-all duration-200 hover:shadow-lg overflow-hidden">
                                    {/* Document Preview */}
                                    <div className="aspect-[4/3] bg-slate-50 flex items-center justify-center border-b border-slate-100 group-hover:bg-slate-100 transition-colors duration-200">
                                      <FileText className="w-12 h-12 text-slate-400 group-hover:text-slate-500 transition-colors duration-200" strokeWidth={1} />
                                    </div>
                                    
                                    {/* Document Info */}
                                    <div className="p-4">
                                      <h4 className="font-medium text-slate-800 text-sm mb-2 truncate" title={doc.name}>
                                        {doc.name}
                                      </h4>
                                      <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs text-slate-500">{doc.size}</span>
                                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(doc.status)}`}>
                                          <StatusIcon className="w-3 h-3" strokeWidth={2} />
                                          <span className="capitalize">{doc.status}</span>
                                        </div>
                                      </div>
                                      <p className="text-xs text-slate-400 mb-3">{doc.uploadDate}</p>
                                      
                                      {/* Actions */}
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-1">
                                          <button onClick={() => handleViewDocument(doc.id)} disabled={viewingDocId === doc.id} className={`
                                              p-1.5 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20
                                              ${viewingDocId === doc.id ? 'text-blue-600 bg-blue-50 cursor-not-allowed' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50 active:scale-90'}
                                            `}>
                                            {viewingDocId === doc.id ? <motion.div animate={{
                                      rotate: 360
                                    }} transition={{
                                      duration: 1,
                                      repeat: Infinity,
                                      ease: "linear"
                                    }}>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                              </motion.div> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
                                          </button>
                                          <button onClick={() => handleDownloadDocument(doc.id)} disabled={downloadingDocId === doc.id} className={`
                                              p-1.5 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20
                                              ${downloadingDocId === doc.id ? 'text-green-600 bg-green-50 cursor-not-allowed' : 'text-slate-400 hover:text-green-600 hover:bg-green-50 active:scale-90'}
                                            `}>
                                            {downloadingDocId === doc.id ? <motion.div animate={{
                                      y: [0, -2, 0]
                                    }} transition={{
                                      duration: 1,
                                      repeat: Infinity,
                                      ease: "easeInOut"
                                    }}>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                                                </svg>
                                              </motion.div> : <Download className="w-4 h-4" strokeWidth={1.5} />}
                                          </button>
                                        </div>
                                        <button onClick={() => handleDeleteDocument(doc.id)} disabled={deletingDocId === doc.id} className={`
                                            p-1.5 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/20
                                            ${deletingDocId === doc.id ? 'text-red-600 bg-red-50 cursor-not-allowed' : 'text-slate-400 hover:text-red-500 hover:bg-red-50 active:scale-90'}
                                          `}>
                                          {deletingDocId === doc.id ? <motion.div animate={{
                                    scale: [1, 0.8, 1]
                                  }} transition={{
                                    duration: 0.8,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                  }}>
                                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                          </motion.div> : <Trash2 className="w-4 h-4" strokeWidth={1.5} />}
                                        </button>
                                      </div>
                                    </div>
                                  </motion.div>;
                        })}
                            </div>;
                    } else {
                      return <div className="space-y-3">
                              {filteredDocs.map((doc, index) => {
                          const StatusIcon = getStatusIcon(doc.status);
                          return <motion.div key={doc.id} initial={{
                            opacity: 0,
                            x: -20
                          }} animate={{
                            opacity: 1,
                            x: 0
                          }} transition={{
                            duration: 0.3,
                            delay: index * 0.05
                          }} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200/60 hover:border-slate-300/60 transition-all duration-200 hover:shadow-sm">
                                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <FileText className="w-6 h-6 text-slate-600" strokeWidth={1.5} />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-slate-800 text-sm mb-1 truncate">
                                          {doc.name}
                                        </h4>
                                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                                          <span>{doc.size}</span>
                                          <span>{doc.uploadDate}</span>
                                          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full font-medium border ${getStatusColor(doc.status)}`}>
                                            <StatusIcon className="w-3 h-3" strokeWidth={2} />
                                            <span className="capitalize">{doc.status}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2 flex-shrink-0">
                                      <button onClick={() => handleViewDocument(doc.id)} disabled={viewingDocId === doc.id} className={`
                                          p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20
                                          ${viewingDocId === doc.id ? 'text-blue-600 bg-blue-50 cursor-not-allowed' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50 active:scale-90'}
                                        `}>
                                        {viewingDocId === doc.id ? <motion.div animate={{
                                  rotate: 360
                                }} transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "linear"
                                }}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                          </motion.div> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
                                      </button>
                                      <button onClick={() => handleDownloadDocument(doc.id)} disabled={downloadingDocId === doc.id} className={`
                                          p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20
                                          ${downloadingDocId === doc.id ? 'text-green-600 bg-green-50 cursor-not-allowed' : 'text-slate-400 hover:text-green-600 hover:bg-green-50 active:scale-90'}
                                        `}>
                                        {downloadingDocId === doc.id ? <motion.div animate={{
                                  y: [0, -2, 0]
                                }} transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                                            </svg>
                                          </motion.div> : <Download className="w-4 h-4" strokeWidth={1.5} />}
                                      </button>
                                      <button onClick={() => handleDeleteDocument(doc.id)} disabled={deletingDocId === doc.id} className={`
                                          p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/20
                                          ${deletingDocId === doc.id ? 'text-red-600 bg-red-50 cursor-not-allowed' : 'text-slate-400 hover:text-red-500 hover:bg-red-50 active:scale-90'}
                                        `}>
                                        {deletingDocId === doc.id ? <motion.div animate={{
                                  scale: [1, 0.8, 1]
                                }} transition={{
                                  duration: 0.8,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                          </motion.div> : <Trash2 className="w-4 h-4" strokeWidth={1.5} />}
                                      </button>
                                    </div>
                                  </motion.div>;
                        })}
                            </div>;
                    }
                  })()}
                    </div>
                  </div>
                </motion.div>}
            </AnimatePresence>
          </div>

          {/* Upload Area */}
          <div className="flex-1 flex items-center justify-center px-6 lg:px-12 py-8 lg:py-12">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            ease: [0.23, 1, 0.32, 1],
            delay: 0.4
          }} className={`
                relative border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer
                transition-all duration-300 ease-out
                ${isDragOver ? 'border-slate-400 bg-slate-50/80 scale-[1.01] shadow-lg' : 'border-slate-300 bg-slate-50/30 hover:border-slate-400 hover:bg-slate-50/60 hover:shadow-md'}
              `} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={handleClick}>
              <input ref={fileInputRef} type="file" accept=".pdf,image/*" onChange={handleFileSelect} className="hidden" />
              
              <div className="space-y-8">
                <div className="w-20 h-20 mx-auto bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-200">
                  <motion.div animate={{
                  y: isDragOver ? -4 : 0,
                  scale: isDragOver ? 1.1 : 1
                }} transition={{
                  duration: 0.2
                }}>
                    <Plus className="w-10 h-10 text-slate-600" strokeWidth={1.5} />
                  </motion.div>
                </div>
                
                <div className="max-w-md mx-auto">
                  <h3 className="text-xl font-semibold text-slate-800 mb-4 text-center">
                    <span>Drop your documents here or click to browse</span>
                  </h3>
                  <p className="text-slate-600 mb-6 text-center leading-relaxed">
                    <span>Supports PDF, JPG, PNG files up to 25MB</span>
                  </p>
                  <div className="flex items-center justify-center space-x-8 text-sm text-slate-500">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4" strokeWidth={1.5} />
                      <span>Secure upload</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4" strokeWidth={1.5} />
                      <span>Instant processing</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Brain className="w-4 h-4" strokeWidth={1.5} />
                      <span>AI-powered</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedFile && <motion.div initial={{
              opacity: 0,
              scale: 0.9
            }} animate={{
              opacity: 1,
              scale: 1
            }} className="absolute inset-0 bg-emerald-50 border-2 border-emerald-200 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                    <p className="text-emerald-800 font-semibold text-lg mb-2">
                      {selectedFile.name}
                    </p>
                    <p className="text-emerald-700">
                      <span>Successfully uploaded and ready for analysis</span>
                    </p>
                  </div>
                </motion.div>}
            </motion.div>
          </div>

          {/* Action Button */}
          <div className="px-6 lg:px-12 pb-8 lg:pb-12">
            <motion.button initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            ease: [0.23, 1, 0.32, 1],
            delay: 0.5
          }} onClick={onContinueWithReport} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 ease-out transform hover:scale-[1.01] hover:shadow-xl active:scale-[0.99] flex items-center justify-center space-x-3 shadow-lg" whileHover={{
            scale: 1.01
          }} whileTap={{
            scale: 0.99
          }}>
              <Sparkles className="w-5 h-5" strokeWidth={2} />
              <span>Analyze with Velora AI</span>
              <motion.div animate={{
              x: [0, 4, 0]
            }} transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.div>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>;
}