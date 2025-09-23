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
  Database
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface AnalyticsProps {
  className?: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: Date;
  size: string;
  status: 'processed' | 'processing' | 'error';
  propertyAddress: string;
  location: {
    lat: number;
    lng: number;
  };
}

interface SystemActivity {
  id: string;
  action: string;
  documents: string[];
  timestamp: Date;
  type: 'analysis' | 'comparison' | 'valuation' | 'search';
}

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Valuation Report 1.pdf',
    type: 'PDF',
    uploadDate: new Date('2024-01-15'),
    size: '2.4 MB',
    status: 'processed',
    propertyAddress: '123 Main St, Sydney NSW 2000',
    location: { lat: -33.8688, lng: 151.2093 }
  },
  {
    id: '2',
    name: 'Property Survey 2.pdf',
    type: 'PDF',
    uploadDate: new Date('2024-01-16'),
    size: '1.8 MB',
    status: 'processed',
    propertyAddress: '456 George St, Sydney NSW 2000',
    location: { lat: -33.8700, lng: 151.2100 }
  },
  {
    id: '3',
    name: 'Valuation Report 3.pdf',
    type: 'PDF',
    uploadDate: new Date('2024-01-17'),
    size: '3.1 MB',
    status: 'processing',
    propertyAddress: '789 Pitt St, Sydney NSW 2000',
    location: { lat: -33.8710, lng: 151.2080 }
  }
];

const mockActivities: SystemActivity[] = [
  {
    id: '1',
    action: 'Velora just resurfaced Valuation Report 1 & Valuation Report 3 to give a comprehensive market analysis',
    documents: ['Valuation Report 1.pdf', 'Valuation Report 3.pdf'],
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    type: 'analysis'
  },
  {
    id: '2', 
    action: 'Generated comparative analysis using Property Survey 2 and market data',
    documents: ['Property Survey 2.pdf'],
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    type: 'comparison'
  },
  {
    id: '3',
    action: 'Performed automated valuation using Valuation Report 1 data points',
    documents: ['Valuation Report 1.pdf'],
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    type: 'valuation'
  }
];

export default function Analytics({ className }: AnalyticsProps) {
  const [documents, setDocuments] = React.useState<Document[]>(mockDocuments);
  const [activities, setActivities] = React.useState<SystemActivity[]>(mockActivities);
  const [selectedDocument, setSelectedDocument] = React.useState<Document | null>(null);
  const [viewMode, setViewMode] = React.useState<'overview' | 'documents' | 'activity'>('overview');
  const { toast } = useToast();

  const handleDeleteDocument = (documentId: string) => {
    const document = documents.find(doc => doc.id === documentId);
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    
    toast({
      title: "Document Deleted",
      description: `${document?.name} has been removed from the system.`,
      duration: 3000,
      className: "border-red-200 bg-gradient-to-r from-red-50 to-rose-50"
    });
  };

  const getActivityIcon = (type: SystemActivity['type']) => {
    switch (type) {
      case 'analysis': return <BarChart3 className="w-4 h-4" />;
      case 'comparison': return <TrendingUp className="w-4 h-4" />;
      case 'valuation': return <Building className="w-4 h-4" />;
      case 'search': return <Search className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'processed': return 'text-emerald-600 bg-emerald-100';
      case 'processing': return 'text-amber-600 bg-amber-100';
      case 'error': return 'text-red-600 bg-red-100';
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
    <div className={`w-full h-full flex flex-col space-y-4 overflow-hidden ${className || ''}`}>
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
      </motion.div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {/* Overview Cards */}
        {viewMode === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-blue-900 flex items-center gap-2 text-sm">
                  <Database className="w-4 h-4" />
                  Total Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-blue-900 mb-1">{documents.length}</div>
                <p className="text-blue-700 text-xs">Across all properties</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-emerald-900 flex items-center gap-2 text-sm">
                  <Activity className="w-4 h-4" />
                  Active Processes
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-emerald-900 mb-1">
                  {documents.filter(d => d.status === 'processing').length}
                </div>
                <p className="text-emerald-700 text-xs">Currently processing</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-purple-900 flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  System Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-purple-900 mb-1">{activities.length}</div>
                <p className="text-purple-700 text-xs">In the last hour</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Document Tracking with Interactive Map */}
        {(viewMode === 'overview' || viewMode === 'documents') && (
          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="w-4 h-4 text-blue-600" />
                Document Property Mapping
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 h-80">
                {/* Map Area */}
                <div className="bg-gradient-to-br from-slate-100 to-slate-200 relative flex items-center justify-center border-r border-slate-200">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-600 font-medium text-sm">Interactive Map</p>
                    <p className="text-xs text-slate-500 mt-1">Property locations with document links</p>
                  </div>
                
                  {/* Mock property pins */}
                  <div className="absolute top-16 left-12">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="absolute top-24 right-16">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="absolute bottom-20 left-1/3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Document List */}
                <div className="p-3 overflow-y-auto">
                  <div className="space-y-2">
                  <AnimatePresence>
                    {documents.map((doc, index) => (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.1 }}
                          className="flex items-center p-2 bg-slate-50 rounded-lg border border-slate-200 hover:shadow-md transition-all cursor-pointer group"
                          onClick={() => setSelectedDocument(doc)}
                        >
                          <div className="flex items-center space-x-2 flex-1">
                            <div className="w-8 h-8 bg-gradient-to-br from-red-100 to-orange-100 rounded-lg flex items-center justify-center">
                              <FileText className="w-4 h-4 text-red-600" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-900 truncate text-xs">{doc.name}</p>
                              <p className="text-xs text-slate-500 truncate">{doc.propertyAddress}</p>
                              <div className="flex items-center space-x-1 mt-0.5">
                                <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                                  {doc.status}
                                </span>
                                <span className="text-xs text-slate-500">{doc.size}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="w-6 h-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteDocument(doc.id);
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
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
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="w-4 h-4 text-emerald-600" />
                Real-time System Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-60 overflow-y-auto">
              <AnimatePresence>
                {activities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-3 p-3 bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-lg border border-slate-200"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === 'analysis' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'comparison' ? 'bg-purple-100 text-purple-600' :
                        activity.type === 'valuation' ? 'bg-emerald-100 text-emerald-600' :
                        'bg-amber-100 text-amber-600'
                      }`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      
                      <div className="flex-1">
                        <p className="text-slate-900 font-medium text-xs leading-relaxed">
                          {activity.action}
                        </p>
                        <div className="flex items-center space-x-3 mt-1">
                          <div className="flex items-center space-x-1 text-xs text-slate-500">
                            <Clock className="w-3 h-3" />
                            {formatTimestamp(activity.timestamp)}
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-slate-500">
                            <FileText className="w-3 h-3" />
                            {activity.documents.length} document{activity.documents.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
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