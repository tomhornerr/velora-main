"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  FileText, 
  Trash2, 
  Activity, 
  Eye, 
  Search, 
  Download,
  Calendar,
  Building,
  AlertCircle,
  CheckCircle2,
  Clock,
  BarChart3,
  TrendingUp,
  Database,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSystem } from "@/contexts/SystemContext";

interface AnalyticsProps {
  className?: string;
}

export default function Analytics({ className }: AnalyticsProps) {
  const { documents, activities, deleteDocument, getTotalStorage, getProcessingCount, addActivity } = useSystem();
  const [selectedDocument, setSelectedDocument] = React.useState<any>(null);
  const [viewMode, setViewMode] = React.useState<'overview' | 'documents' | 'activity'>('overview');
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const { toast } = useToast();

  const handleDeleteDocument = (documentId: string) => {
    const document = documents.find(doc => doc.id === documentId);
    if (!document) return;
    
    deleteDocument(documentId);
    
    toast({
      title: "Document Deleted",
      description: `${document.name} has been removed from the system.`,
      duration: 3000,
      className: "border-red-200 bg-gradient-to-r from-red-50 to-rose-50"
    });
  };

  const handleRefreshData = () => {
    setIsRefreshing(true);
    
    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false);
      addActivity({
        action: 'Analytics dashboard data refreshed',
        documents: [],
        type: 'analysis',
        details: { refreshTime: new Date().toISOString() }
      });
      
      toast({
        title: "Data Refreshed",
        description: "Analytics data has been updated with the latest information.",
        duration: 2000,
        className: "border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50"
      });
    }, 1000);
  };

  const getActivityIcon = (type: any) => {
    switch (type) {
      case 'analysis': return <BarChart3 className="w-4 h-4" />;
      case 'comparison': return <TrendingUp className="w-4 h-4" />;
      case 'valuation': return <Building className="w-4 h-4" />;
      case 'search': return <Search className="w-4 h-4" />;
      case 'upload': return <FileText className="w-4 h-4" />;
      case 'deletion': return <Trash2 className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: any) => {
    switch (status) {
      case 'processed': return 'text-emerald-600 bg-emerald-100';
      case 'processing': return 'text-amber-600 bg-amber-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  return (
    <div className={`w-full h-full flex flex-col space-y-6 overflow-hidden ${className || ''}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-shrink-0"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Analytics Dashboard</h1>
          <p className="text-slate-600 text-sm">Monitor your data usage and system activity</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            onClick={handleRefreshData}
            disabled={isRefreshing}
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          
          <div className="flex items-center space-x-2 bg-white rounded-lg border border-slate-200 p-1">
          {(['overview', 'documents', 'activity'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === mode
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>
      </motion.div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto space-y-6">
        {/* Overview Cards */}
        {viewMode === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                    <Database className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-900">Total Documents</h3>
                    <p className="text-xs text-slate-500">Files in system</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2">{documents.length}</div>
                <p className="text-xs text-slate-500">Total storage: {getTotalStorage()}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-900">Active Processes</h3>
                    <p className="text-xs text-slate-500">Currently running</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2">{getProcessingCount()}</div>
                <p className="text-xs text-slate-500">Processing documents</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-900">System Actions</h3>
                    <p className="text-xs text-slate-500">Recent activity</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2">{activities.length}</div>
                <p className="text-xs text-slate-500">In the last hour</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Document Tracking */}
        {(viewMode === 'overview' || viewMode === 'documents') && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Document Property Mapping</h2>
                  <p className="text-xs text-slate-500">Interactive property locations with document links</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 h-80">
              {/* Map Area */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 relative flex items-center justify-center border-r border-slate-100">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600 font-medium text-sm">Interactive Map</p>
                  <p className="text-xs text-slate-500 mt-1">Property locations with document links</p>
                </div>
              
                {/* Mock property pins */}
                <div className="absolute top-16 left-12">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-lg"></div>
                </div>
                <div className="absolute top-24 right-16">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg"></div>
                </div>
                <div className="absolute bottom-20 left-1/3">
                  <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse shadow-lg"></div>
                </div>
              </div>

              {/* Document List */}
              <div className="p-4 overflow-y-auto bg-slate-50/50">
                <div className="space-y-3">
                <AnimatePresence>
                  {documents.map((doc, index) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.1 }}
                        className="flex items-center p-3 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-all cursor-pointer group"
                        onClick={() => setSelectedDocument(doc)}
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-orange-100 rounded-xl flex items-center justify-center">
                            <FileText className="w-5 h-5 text-red-600" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-900 truncate text-sm">{doc.name}</p>
                            <p className="text-sm text-slate-500 truncate">{doc.propertyAddress}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                                {doc.status}
                              </span>
                              <span className="text-xs text-slate-500">{doc.size}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" className="w-8 h-8 p-0 hover:bg-slate-100">
                            <Eye className="w-4 h-4 text-slate-600" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-8 h-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteDocument(doc.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                    </motion.div>
                  ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Real-time System Activity */}
        {(viewMode === 'overview' || viewMode === 'activity') && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-green-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Real-time System Activity</h2>
                  <p className="text-xs text-slate-500">Recent system operations and processes</p>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <div className="space-y-4 max-h-60 overflow-y-auto">
              <AnimatePresence>
                {activities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-4 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100/50 transition-all"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        activity.type === 'analysis' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'comparison' ? 'bg-purple-100 text-purple-600' :
                        activity.type === 'valuation' ? 'bg-emerald-100 text-emerald-600' :
                        'bg-amber-100 text-amber-600'
                      }`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      
                      <div className="flex-1">
                        <p className="text-slate-900 font-medium text-sm leading-relaxed">
                          {activity.action}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-2 text-xs text-slate-500">
                            <Clock className="w-3 h-3" />
                            {formatTimestamp(activity.timestamp)}
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-slate-500">
                            <FileText className="w-3 h-3" />
                            {activity.documents.length} document{activity.documents.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                      </div>
                  </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}