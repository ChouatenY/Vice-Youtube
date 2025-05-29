'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocalUser } from '@/lib/local-user-context';
import YouTubeInput from '../components/YouTubeInput';
import ProgressIndicator from '../components/ProgressIndicator';
import TranscriptResults from '../components/TranscriptResults';
import ErrorDisplay from '../components/ErrorDisplay';
import AnalysisResults from '../components/AnalysisResults';

interface TranscriptEntry {
  text: string;
  start: number;
  duration: number;
}

export default function EmbedPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptEntry[] | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const { user, isLoading: isUserLoading } = useLocalUser();

  const totalSteps = 5;

  const extractVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match && match[1] ? match[1] : null;
  };

  const handleSubmit = async (url: string, specificRequest?: string) => {
    try {
      // Reset states
      setIsLoading(true);
      setIsAnalyzing(false);
      setError(null);
      setAnalysis(null);
      setTranscript(null);
      setCurrentStep(1);

      // Extract video ID
      const extractedVideoId = extractVideoId(url);
      if (!extractedVideoId) {
        throw new Error('Invalid YouTube URL');
      }

      setVideoId(extractedVideoId);
      setCurrentStep(2);

      // Fetch transcript
      const response = await fetch('/api/transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoUrl: url }),
      });

      setCurrentStep(3);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch transcript');
      }

      const data = await response.json();
      setCurrentStep(4);

      if (!data.transcript || !data.transcript.length) {
        throw new Error('No transcript available for this video');
      }

      setTranscript(data.transcript);
      setIsLoading(false);

      // Start AI analysis
      setCurrentStep(5);
      setIsAnalyzing(true);

      try {
        const analysisResponse = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transcript: data.transcript,
            specificRequest: specificRequest || undefined,
            videoId: extractedVideoId
          }),
        });

        if (!analysisResponse.ok) {
          const errorData = await analysisResponse.json();
          throw new Error(errorData.details || errorData.error || 'Analysis failed');
        }

        const analysisData = await analysisResponse.json();
        setAnalysis(analysisData.analysis);
      } catch (analysisError) {
        const errorMessage = analysisError instanceof Error ? analysisError.message : 'Unknown error';
        setError(errorMessage);
      } finally {
        setIsAnalyzing(false);
      }
    } catch (err) {
      setIsLoading(false);
      setIsAnalyzing(false);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const handleReset = () => {
    setIsLoading(false);
    setIsAnalyzing(false);
    setCurrentStep(0);
    setError(null);
    setTranscript(null);
    setAnalysis(null);
    setVideoId(null);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            YouTube Video Analyzer
          </h1>
          <p className="text-muted-foreground">
            Extract and analyze content from YouTube videos with AI
          </p>
        </div>

        <div className="space-y-4 rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          {!transcript && !error && (
            <YouTubeInput onSubmit={handleSubmit} isLoading={isLoading} />
          )}

          {isLoading && currentStep > 0 && (
            <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
          )}

          {error && (
            <ErrorDisplay message={error} onRetry={handleReset} />
          )}

          {transcript && videoId && !error && (
            <>
              <TranscriptResults
                videoId={videoId}
                onReset={handleReset}
              />
              <AnalysisResults
                analysis={analysis}
                isLoading={isAnalyzing}
                videoId={videoId}
              />
            </>
          )}
        </div>
      </div>

      <style jsx global>{`
        /* Iframe-specific styles */
        body {
          margin: 0;
          padding: 0;
          overflow: auto;
        }

        /* Ensure the app fits well in an iframe */
        .min-h-screen {
          min-height: 100vh;
          height: auto;
        }

        /* Remove any fixed positioning that might cause issues */
        .fixed {
          position: relative;
        }

        /* Ensure scrolling works properly in iframe */
        html, body {
          height: auto;
          overflow-x: hidden;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
}
