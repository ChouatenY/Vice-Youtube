'use client'

import { useState, useEffect, useCallback } from 'react'
import { UserResponse } from '@/types/user';
import { UserButton } from '@clerk/nextjs';
import YouTubeInput from '../components/YouTubeInput';
import ProgressIndicator from '../components/ProgressIndicator';
import TranscriptResults from '../components/TranscriptResults';
import ErrorDisplay from '../components/ErrorDisplay';
import AnalysisResults from '../components/AnalysisResults';
import SavedAnalysesList from '../components/SavedAnalysesList';

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
  const [userData, setUserData] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptEntry[] | null>(null);
  const [transcriptText, setTranscriptText] = useState<string>('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const totalSteps = 5;

  const isSubscribed = userData?.subscription?.status === 'active';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user');
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const data: UserResponse = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const extractVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match && match[1] ? match[1] : null;
  };

  const handleSubmit = async (url: string) => {
    try {
      // Reset states
      setIsLoading(true);
      setIsAnalyzing(false);
      setError(null);
      setAnalysis(null);
      setTranscript(null);
      setTranscriptText('');
      setShowAnalysis(false);
      setCurrentStep(1); // Validating URL

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

      // Store transcript and create transcript text
      setTranscript(data.transcript);
      
      // Create a plain text version of the transcript
      const plainText = data.transcript
        .map((entry: { text: string }) => entry.text)
        .join(' ');
      
      setTranscriptText(plainText);
      setIsLoading(false);
      
      // Analysis will now be triggered by the "Confirm Analysis" button
    } catch (err) {
      setIsLoading(false);
      setIsAnalyzing(false);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const handleConfirmAnalysis = async () => {
    if (!transcriptText) return;
    
    try {
      // Start AI analysis
      setCurrentStep(5); // Analyzing transcript
      setIsAnalyzing(true);
      setShowAnalysis(true);
      
      const analysisResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcriptText }),
      });

      if (!analysisResponse.ok) {
        const errorData = await analysisResponse.json();
        throw new Error(errorData.error || 'Failed to analyze transcript');
      }

      const analysisData = await analysisResponse.json();
      setAnalysis(analysisData.analysis);
    } catch (analysisError) {
      console.error('Analysis error:', analysisError);
      setError(analysisError instanceof Error ? analysisError.message : 'Failed to analyze transcript');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setIsLoading(false);
    setIsAnalyzing(false);
    setCurrentStep(0);
    setError(null);
    setTranscript(null);
    setTranscriptText('');
    setAnalysis(null);
    setVideoId(null);
    setShowAnalysis(false);
  };

  if (!isSubscribed) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center space-y-8 p-4">
        <div className="bg-[#1A1A23] p-10 rounded-2xl shadow-2xl border border-[#2A2A35] max-w-md w-full">
          <p className="text-2xl font-bold text-white mb-6 text-center">Premium Access Required</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-gray-200">
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-[#1A1A23] p-10 rounded-2xl shadow-2xl border border-[#2A2A35]">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-white">YouTube Video Analyzer</h1>
              <UserButton afterSignOutUrl="/" />
            </div>
            <p className="text-xl text-emerald-400 font-semibold flex items-center gap-2 mb-6">
              <span className="inline-block w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></span>
              Subscription Active
            </p>
            
            <p className="mt-3 text-xl text-gray-400 mb-8">
              Extract and analyze content from YouTube videos with AI
            </p>

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
                  transcript={transcript}
                  onConfirmAnalysis={handleConfirmAnalysis}
                />
                {showAnalysis && (
                  <AnalysisResults 
                    analysis={analysis} 
                    isLoading={isAnalyzing}
                    videoId={videoId}
                  />
                )}
              </>
            )}

            {/* Saved Analyses List */}
            {!isLoading && (
              <SavedAnalysesList />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}