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
      <div className="w-full max-w-4xl mx-auto mt-8 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-8"></div>
          
          <div className="space-y-3">
            <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/6"></div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-2/5"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/6"></div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
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
    <div className="w-full max-w-4xl mx-auto mt-8 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Analysis</h2>
        {videoId && (
          <SaveAnalysisButton 
            videoId={videoId} 
            analysis={analysis} 
            onSaved={handleSaved} 
          />
        )}
      </div>
      
      <div className="prose prose-gray dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white prose-h2:text-xl prose-h3:text-lg prose-h2:mt-8 prose-h3:mt-6 prose-p:leading-relaxed prose-p:my-4 prose-ul:my-4 prose-ol:my-4 prose-li:my-1">
        <ReactMarkdown>
          {analysis}
        </ReactMarkdown>
      </div>
    </div>
  );
} 