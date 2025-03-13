import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import SaveAnalysisButton from './SaveAnalysisButton';

interface AnalysisResultsProps {
  analysis: string | null;
  isLoading: boolean;
  videoId: string | null;
}

export default function AnalysisResults({ analysis, isLoading, videoId }: AnalysisResultsProps) {
  const [isSaved, setIsSaved] = useState(false);

  const handleSaved = () => {
    setIsSaved(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-4 rounded-lg border bg-card text-card-foreground shadow-sm p-6 mt-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-secondary rounded w-1/3 mb-6"></div>
          
          <div className="space-y-3">
            <div className="h-5 bg-secondary rounded w-1/2"></div>
            <div className="space-y-2">
              <div className="h-4 bg-secondary rounded w-full"></div>
              <div className="h-4 bg-secondary rounded w-5/6"></div>
              <div className="h-4 bg-secondary rounded w-4/6"></div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="h-5 bg-secondary rounded w-2/5"></div>
            <div className="space-y-2">
              <div className="h-4 bg-secondary rounded w-full"></div>
              <div className="h-4 bg-secondary rounded w-5/6"></div>
              <div className="h-4 bg-secondary rounded w-4/6"></div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="h-5 bg-secondary rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-secondary rounded w-full"></div>
              <div className="h-4 bg-secondary rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <div className="space-y-4 rounded-lg border bg-card text-card-foreground shadow-sm p-6 mt-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-2xl font-semibold tracking-tight">AI Analysis</h2>
        {videoId && (
          <SaveAnalysisButton 
            videoId={videoId} 
            analysis={analysis} 
            onSaved={handleSaved} 
          />
        )}
      </div>
      
      <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:text-foreground prose-p:text-card-foreground/80 prose-li:text-card-foreground/80 prose-strong:text-foreground prose-h2:text-xl prose-h3:text-lg prose-h2:mt-6 prose-h3:mt-4 prose-p:leading-relaxed prose-p:my-3 prose-ul:my-3 prose-ol:my-3 prose-li:my-1">
        <ReactMarkdown>
          {analysis}
        </ReactMarkdown>
      </div>
    </div>
  );
} 