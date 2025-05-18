import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import SaveAnalysisButton from './SaveAnalysisButton';
import { FaClock, FaImage, FaYoutube, FaExternalLinkAlt } from 'react-icons/fa';
import Image from 'next/image';

interface AnalysisResultsProps {
  analysis: string | null;
  isLoading: boolean;
  videoId: string | null;
}

export default function AnalysisResults({ analysis, isLoading, videoId }: AnalysisResultsProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [timestamps, setTimestamps] = useState<number[]>([]);
  const [frames, setFrames] = useState<string[]>([]);
  const [isLoadingFrames, setIsLoadingFrames] = useState(false);
  const [frameError, setFrameError] = useState<string | null>(null);
  const [showEmbeddedVideo, setShowEmbeddedVideo] = useState(false);
  const [currentTimestamp, setCurrentTimestamp] = useState<number | null>(null);

  const handleSaved = () => {
    setIsSaved(true);
  };

  // Extract timestamps from the analysis
  useEffect(() => {
    if (analysis) {
      // Extract all timestamps in format [MM:SS]
      const timestampRegex = /\[(\d+):(\d+)\]/g;
      const matches = [...analysis.matchAll(timestampRegex)];

      if (matches.length > 0) {
        // Convert timestamps to seconds
        const timestampsInSeconds = matches.map(match => {
          const minutes = parseInt(match[1], 10);
          const seconds = parseInt(match[2], 10);
          return minutes * 60 + seconds;
        });

        // Get unique timestamps
        const uniqueTimestamps = [...new Set(timestampsInSeconds)];

        // Limit to 5 timestamps to avoid too many API calls
        const limitedTimestamps = uniqueTimestamps.slice(0, 5);

        setTimestamps(limitedTimestamps);
      }
    }
  }, [analysis]);

  // Extract frames for the timestamps
  useEffect(() => {
    const extractFrames = async () => {
      if (videoId && timestamps.length > 0) {
        setIsLoadingFrames(true);
        setFrameError(null);

        try {
          const response = await fetch('/api/video-frames', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ videoId, timestamps }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.details || 'Failed to extract video frames');
          }

          const data = await response.json();
          setFrames(data.frames || []);
        } catch (error) {
          console.error('Error extracting frames:', error);
          setFrameError(error instanceof Error ? error.message : 'Unknown error');
          setFrames([]);
        } finally {
          setIsLoadingFrames(false);
        }
      }
    };

    extractFrames();
  }, [videoId, timestamps]);

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
        <div className="flex items-center space-x-2">
          {videoId && (
            <>
              <button
                onClick={() => setShowEmbeddedVideo(!showEmbeddedVideo)}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-3"
                title={showEmbeddedVideo ? "Hide video player" : "Show video player"}
              >
                <FaYoutube className="mr-1 h-4 w-4" />
                {showEmbeddedVideo ? "Hide Video" : "Show Video"}
              </button>
              <SaveAnalysisButton
                videoId={videoId}
                analysis={analysis}
                onSaved={handleSaved}
              />
            </>
          )}
        </div>
      </div>

      {/* Embedded YouTube Player */}
      {showEmbeddedVideo && videoId && (
        <div className="aspect-video w-full rounded-lg overflow-hidden border border-border mb-4">
          <iframe
            key={`${videoId}-${currentTimestamp || 'default'}`} // Add key to force re-render when timestamp changes
            src={`https://www.youtube.com/embed/${videoId}${currentTimestamp ? `?start=${currentTimestamp}&enablejsapi=1` : '?enablejsapi=1'}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          ></iframe>
        </div>
      )}

      {/* Video Frames Section */}
      {timestamps.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Key Moments</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {isLoadingFrames ? (
              // Loading state for frames
              Array.from({ length: Math.min(5, timestamps.length) }).map((_, index) => (
                <div key={index} className="aspect-video bg-secondary animate-pulse rounded-md"></div>
              ))
            ) : frameError ? (
              // Error state
              <div className="col-span-full p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                <p className="font-medium">Couldn't load video frames</p>
                <p className="text-xs mt-1">{frameError}</p>
              </div>
            ) : frames.length > 0 ? (
              // Display extracted frames
              frames.map((framePath, index) => {
                const timestamp = timestamps[index];
                const minutes = Math.floor(timestamp / 60);
                const seconds = timestamp % 60;
                const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

                return (
                  <div key={index} className="relative group">
                    <div className="aspect-video bg-secondary rounded-md overflow-hidden relative">
                      {framePath.startsWith('http') ? (
                        // External image URL (YouTube thumbnail)
                        <img
                          src={framePath}
                          alt={`Frame at ${formattedTime}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        // Local image path
                        <Image
                          src={framePath}
                          alt={`Frame at ${formattedTime}`}
                          width={320}
                          height={180}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <a
                          href={`https://www.youtube.com/watch?v=${videoId}&t=${timestamp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-primary text-white rounded-full p-2"
                          title={`Open YouTube at ${formattedTime}`}
                        >
                          <FaExternalLinkAlt className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setCurrentTimestamp(timestamp);
                        setShowEmbeddedVideo(true);
                      }}
                      className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center"
                    >
                      <FaClock className="mr-1 h-3 w-3" />
                      {formattedTime}
                    </button>
                  </div>
                );
              })
            ) : (
              // No frames available
              <div className="col-span-full p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-700">
                <p>No video frames available. Click on timestamps in the analysis to jump to specific moments.</p>
              </div>
            )}
          </div>
        </div>
      )}

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

                        // Create a clickable timestamp with simpler interaction
                        return (
                          <span
                            key={i}
                            className="inline-flex items-center bg-primary/10 text-primary rounded px-1.5 py-0.5 text-sm font-medium mr-1 cursor-pointer"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setCurrentTimestamp(totalSeconds);
                              setShowEmbeddedVideo(true);

                              // Scroll to the embedded player if it's not in view
                              setTimeout(() => {
                                const playerElement = document.querySelector('.aspect-video');
                                if (playerElement) {
                                  playerElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }
                              }, 100);
                            }}
                            title={`Jump to ${timestamp} in the video`}
                          >
                            <FaClock className="mr-1 h-3 w-3" />
                            {timestamp}
                          </span>
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