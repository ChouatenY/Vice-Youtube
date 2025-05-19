'use client'

import { useState, useEffect, useCallback } from 'react'
import { UserResponse } from '@/types/user';
import { useLocalUser } from '@/lib/local-user-context';
import YouTubeInput from '../components/YouTubeInput';
import ProgressIndicator from '../components/ProgressIndicator';
import TranscriptResults from '../components/TranscriptResults';
import ErrorDisplay from '../components/ErrorDisplay';
import AnalysisResults from '../components/AnalysisResults';
import SavedAnalysesList from '../components/SavedAnalysesList';
import Image from 'next/image';

interface TranscriptEntry {
  text: string;
  start: number;
  duration: number;
}

export default function Dashboard() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [summary, setSummary] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>('')
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptEntry[] | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const { user, isLoading: isUserLoading } = useLocalUser();

  const totalSteps = 5; // Added one more step for AI analysis

  // Always consider the user as subscribed in this local version
  const isSubscribed = true;

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
      setCurrentStep(1); // Validating URL

      console.log('Specific request:', specificRequest || 'None provided');

      // Extract video ID
      const extractedVideoId = extractVideoId(url);
      if (!extractedVideoId) {
        throw new Error('Invalid YouTube URL');
      }

      setVideoId(extractedVideoId);
      setCurrentStep(2); // Fetching video details

      // Fetch transcript
      const response = await fetch('/api/transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoUrl: url }),
      });

      setCurrentStep(3); // Extracting transcript

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch transcript');
      }

      const data = await response.json();

      setCurrentStep(4); // Processing data

      // Process transcript data
      if (!data.transcript || !data.transcript.length) {
        throw new Error('No transcript available for this video');
      }

      // Store transcript but don't display it
      setTranscript(data.transcript);
      setIsLoading(false);

      // Start AI analysis
      setCurrentStep(5); // Analyzing transcript
      setIsAnalyzing(true);

      try {
        console.log('Starting transcript analysis...');

        // Add timeout and retry logic for the API call optimized for Vercel
        const fetchWithTimeout = async (url: string, options: any, timeout = 30000, retries = 1) => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => {
            controller.abort();
            console.log('Request timed out after', timeout, 'ms');
          }, timeout);

          try {
            const response = await fetch(url, {
              ...options,
              signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response;
          } catch (error) {
            clearTimeout(timeoutId);

            // Check if this was a timeout error
            if (error instanceof Error && error.name === 'AbortError') {
              console.error('Request timed out:', url);
              throw new Error('The request timed out. The server might be busy processing your video. Please try again with a shorter video or a more specific request.');
            }

            // Retry logic
            if (retries > 0) {
              console.log(`Retrying request to ${url}, ${retries} attempts left`);
              await new Promise(resolve => setTimeout(resolve, 1000));
              return fetchWithTimeout(url, options, timeout, retries - 1);
            }

            console.error('Fetch error with timeout:', error);
            throw error;
          }
        };

        console.log('Sending analysis request with transcript length:', data.transcript.length);

        try {
          const analysisResponse = await fetchWithTimeout('/api/analyze', {
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

          console.log('Analysis API response status:', analysisResponse.status);

          if (!analysisResponse.ok) {
            let errorData = {};
            try {
              errorData = await analysisResponse.json();
            } catch (jsonError) {
              console.error('Error parsing error response:', jsonError);
            }

            console.error('API error response:', errorData);
            throw new Error((errorData as {details?: string, error?: string}).details || (errorData as {details?: string, error?: string}).error || `Server responded with status ${analysisResponse.status}`);
          }

          let analysisData;
          try {
            analysisData = await analysisResponse.json();
          } catch (jsonError) {
            console.error('Error parsing analysis response:', jsonError);
            throw new Error('Failed to parse analysis response');
          }

          console.log('Analysis completed successfully');
          setAnalysis(analysisData.analysis);
        } catch (fetchError) {
          console.error('Fetch error during analysis:', fetchError);
          throw fetchError;
        }
      } catch (analysisError) {
        console.error('Analysis error:', analysisError);
        const errorMessage = analysisError instanceof Error ? analysisError.message : 'Unknown error';
        console.error('Error details:', errorMessage);
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
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Logo at the top center */}
      <div className="flex justify-center mb-8">
        <Image
          src="/logo.png"
          alt="YouTube Analyzer Logo"
          width={200}
          height={80}
          className="h-20 w-auto"
          priority
        />
      </div>

      <main className="space-y-8">
        <div className="space-y-4 rounded-lg border bg-card text-card-foreground shadow-sm p-6">

          <div className="py-2 border-b pb-4">
            <p className="text-sm font-medium text-primary flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              Ready to Analyze
            </p>
          </div>

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

        {/* Saved Analyses List */}
        {!isLoading && (
          <div className="space-y-4 rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h2 className="border-b pb-2 text-2xl font-semibold tracking-tight text-primary">Saved Analyses</h2>
            <SavedAnalysesList />
          </div>
        )}
      </main>
    </div>
  )
}
