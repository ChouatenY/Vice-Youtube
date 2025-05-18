import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import SaveAnalysisButton from './SaveAnalysisButton';
import { FaClock } from 'react-icons/fa';

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
        <h2 className="text-2xl font-semibold tracking-tight text-primary">AI Analysis</h2>
        {videoId && (
          <SaveAnalysisButton
            videoId={videoId}
            analysis={analysis}
            onSaved={handleSaved}
          />
        )}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:text-foreground prose-p:text-card-foreground/80 prose-li:text-card-foreground/80 prose-strong:text-foreground prose-h2:text-xl prose-h3:text-lg prose-h2:mt-6 prose-h3:mt-4 prose-p:leading-relaxed prose-p:my-3 prose-ul:my-3 prose-ol:my-3 prose-li:my-1">
        <ReactMarkdown
          components={{
            // Custom renderer for timestamps in format [MM:SS]
            p: ({ children, ...props }) => {
              if (typeof children === 'string') {
                return <p {...props}>{children}</p>;
              }

              // Process children to find and highlight timestamps
              const processedChildren = React.Children.map(children, child => {
                if (typeof child === 'string') {
                  // Match timestamps in format [MM:SS]
                  const parts = child.split(/(\[\d+:\d+\])/g);
                  if (parts.length > 1) {
                    return parts.map((part, i) => {
                      if (part.match(/\[\d+:\d+\]/)) {
                        // Extract the timestamp without brackets
                        const timestamp = part.substring(1, part.length - 1);

                        // Convert timestamp to seconds for YouTube URL
                        const [minutes, seconds] = timestamp.split(':').map(Number);
                        const totalSeconds = minutes * 60 + seconds;

                        // Create a clickable timestamp that opens the YouTube video at that time
                        return (
                          <a
                            key={i}
                            href={`https://www.youtube.com/watch?v=${videoId}&t=${totalSeconds}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center bg-primary/10 text-primary rounded px-1.5 py-0.5 text-sm font-medium mr-1 hover:bg-primary/20 transition-colors"
                            title={`Jump to ${timestamp} in the video`}
                          >
                            <FaClock className="mr-1 h-3 w-3" />
                            {timestamp}
                          </a>
                        );
                      }
                      return part;
                    });
                  }
                }
                return child;
              });

              return <p {...props}>{processedChildren}</p>;
            }
          }}
        >
          {analysis}
        </ReactMarkdown>
      </div>
    </div>
  );
}