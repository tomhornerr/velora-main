"use client";

import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { useSystem } from "@/contexts/SystemContext";
import AnalyticsHeader from "./analytics/AnalyticsHeader";
import OverviewCards from "./analytics/OverviewCards";
import DocumentMapping from "./analytics/DocumentMapping";
import ActivityFeed from "./analytics/ActivityFeed";

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
    
    // Simulate data refresh with more realistic timing
    setTimeout(() => {
      setIsRefreshing(false);
      addActivity({
        action: 'Analytics dashboard data refreshed successfully',
        documents: [],
        type: 'analysis',
        details: { refreshTime: new Date().toISOString() }
      });
      
      toast({
        title: "✨ Data Refreshed",
        description: "Analytics data has been updated with the latest information.",
        duration: 2000,
        className: "border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50"
      });
    }, 1200);
  };


  return (
    <div className={`w-full h-full flex flex-col space-y-8 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50 ${className || ''}`}>
      {/* Enhanced Header */}
      <AnalyticsHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        onRefresh={handleRefreshData}
        isRefreshing={isRefreshing}
      />

      {/* Scrollable Content with better spacing */}
      <div className="flex-1 overflow-y-auto space-y-8 pb-8">
        {/* Overview Cards - Enhanced */}
        {viewMode === 'overview' && (
          <OverviewCards
            totalDocuments={documents.length}
            totalStorage={getTotalStorage()}
            processingCount={getProcessingCount()}
            activitiesCount={activities.length}
          />
        )}

        {/* Document Mapping - Enhanced */}
        {(viewMode === 'overview' || viewMode === 'documents') && (
          <DocumentMapping
            documents={documents}
            onDocumentSelect={setSelectedDocument}
            onDocumentDelete={handleDeleteDocument}
          />
        )}

        {/* Activity Feed - Enhanced */}
        {(viewMode === 'overview' || viewMode === 'activity') && (
          <ActivityFeed activities={activities} />
        )}
      </div>
    </div>
  );
}