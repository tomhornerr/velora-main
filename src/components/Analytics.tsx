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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">Analytics Dashboard</h1>
          <p className="text-slate-600 text-sm">Monitor your data usage and system activity</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            onClick={handleRefreshData}
            disabled={isRefreshing}
            size="sm"
            variant="outline"
            className="flex items-center gap-2 bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          
          <div className="flex items-center space-x-2 bg-slate-950/40 backdrop-blur-xl rounded-xl border border-slate-700/30 p-1">
          {(['overview', 'documents', 'activity'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === mode
                  ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
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
            <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-600/10 backdrop-blur-xl border border-blue-400/20 shadow-[0_8px_32px_rgba(59,130,246,0.15)]">
              <CardHeader className="pb-3">
                <CardTitle className="text-blue-100 flex items-center gap-2 text-sm font-medium">
                  <Database className="w-5 h-5" />
                  Total Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
              <div className="text-3xl font-bold text-white mb-2">{documents.length}</div>
              <p className="text-blue-200/80 text-xs">Total storage: {getTotalStorage()}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-500/10 to-green-600/10 backdrop-blur-xl border border-emerald-400/20 shadow-[0_8px_32px_rgba(16,185,129,0.15)]">
              <CardHeader className="pb-3">
                <CardTitle className="text-emerald-100 flex items-center gap-2 text-sm font-medium">
                  <Activity className="w-5 h-5" />
                  Active Processes
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
              <div className="text-3xl font-bold text-white mb-2">
                {getProcessingCount()}
              </div>
              <p className="text-emerald-200/80 text-xs">Currently processing</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 backdrop-blur-xl border border-purple-400/20 shadow-[0_8px_32px_rgba(147,51,234,0.15)]">
              <CardHeader className="pb-3">
                <CardTitle className="text-purple-100 flex items-center gap-2 text-sm font-medium">
                  <TrendingUp className="w-5 h-5" />
                  System Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-3xl font-bold text-white mb-2">{activities.length}</div>
                <p className="text-purple-200/80 text-xs">In the last hour</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Document Tracking with Interactive Map */}
        {(viewMode === 'overview' || viewMode === 'documents') && (
          <Card className="overflow-hidden bg-slate-950/40 backdrop-blur-xl border border-slate-700/30 shadow-[0_8px_32px_rgba(2,6,23,0.6)]">
            <CardHeader className="pb-4 border-b border-slate-700/30">
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <MapPin className="w-5 h-5 text-blue-400" />
                Document Property Mapping
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 h-80">
                {/* Map Area */}
                <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 relative flex items-center justify-center border-r border-slate-700/30">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                    <p className="text-white font-medium text-sm">Interactive Map</p>
                    <p className="text-xs text-slate-400 mt-1">Property locations with document links</p>
                  </div>
                
                  {/* Mock property pins */}
                  <div className="absolute top-16 left-12">
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></div>
                  </div>
                  <div className="absolute top-24 right-16">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
                  </div>
                  <div className="absolute bottom-20 left-1/3">
                    <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse shadow-lg shadow-amber-400/50"></div>
                  </div>
                </div>

                {/* Document List */}
                <div className="p-4 overflow-y-auto bg-slate-900/20">
                  <div className="space-y-3">
                  <AnimatePresence>
                    {documents.map((doc, index) => (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.1 }}
                          className="flex items-center p-3 bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-600/30 hover:shadow-lg hover:shadow-slate-900/20 transition-all cursor-pointer group hover:bg-slate-800/60"
                          onClick={() => setSelectedDocument(doc)}
                        >
                          <div className="flex items-center space-x-3 flex-1">
                            <div className="w-10 h-10 bg-gradient-to-br from-red-400/20 to-orange-400/20 rounded-xl flex items-center justify-center border border-red-400/20">
                              <FileText className="w-5 h-5 text-red-400" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-white truncate text-sm">{doc.name}</p>
                              <p className="text-sm text-slate-400 truncate">{doc.propertyAddress}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                                  {doc.status}
                                </span>
                                <span className="text-xs text-slate-500">{doc.size}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="sm" className="w-8 h-8 p-0 hover:bg-white/10">
                              <Eye className="w-4 h-4 text-slate-300" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="w-8 h-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-400/10"
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
            </CardContent>
          </Card>
        )}

        {/* Real-time System Activity */}
        {(viewMode === 'overview' || viewMode === 'activity') && (
          <Card className="bg-slate-950/40 backdrop-blur-xl border border-slate-700/30 shadow-[0_8px_32px_rgba(2,6,23,0.6)]">
            <CardHeader className="pb-4 border-b border-slate-700/30">
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <Activity className="w-5 h-5 text-emerald-400" />
                Real-time System Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4 max-h-60 overflow-y-auto">
              <AnimatePresence>
                {activities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-4 p-4 bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-600/30 hover:bg-slate-800/60 transition-all"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                        activity.type === 'analysis' ? 'bg-blue-400/20 text-blue-400 border-blue-400/20' :
                        activity.type === 'comparison' ? 'bg-purple-400/20 text-purple-400 border-purple-400/20' :
                        activity.type === 'valuation' ? 'bg-emerald-400/20 text-emerald-400 border-emerald-400/20' :
                        'bg-amber-400/20 text-amber-400 border-amber-400/20'
                      }`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm leading-relaxed">
                          {activity.action}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-2 text-xs text-slate-400">
                            <Clock className="w-3 h-3" />
                            {formatTimestamp(activity.timestamp)}
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-slate-400">
                            <FileText className="w-3 h-3" />
                            {activity.documents.length} document{activity.documents.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
                      </div>
                  </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}