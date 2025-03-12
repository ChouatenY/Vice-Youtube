import { useState } from 'react';

interface TranscriptEntry {
  text: string;
  start: number;
  duration: number;
}

interface TranscriptResultsProps {
  videoId: string;
  onReset: () => void;
  transcript: TranscriptEntry[] | null;
  onConfirmAnalysis: () => void;
}

export default function TranscriptResults({ 
  videoId, 
  onReset, 
  transcript, 
  onConfirmAnalysis 
}: TranscriptResultsProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mt-8 space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Video Analysis</h2>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors"
        >
          Analyze Another Video
        </button>
      </div>

      <div className="aspect-video w-full">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-lg shadow-lg"
        ></iframe>
      </div>

      {transcript && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Transcript Preview</h3>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 h-64 overflow-y-auto">
            {transcript.slice(0, 20).map((entry, index) => (
              <p key={index} className="mb-2 text-gray-700 dark:text-gray-300">
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  {Math.floor(entry.start / 60)}:{Math.floor(entry.start % 60).toString().padStart(2, '0')}
                </span>
                {' '}{entry.text}
              </p>
            ))}
            {transcript.length > 20 && (
              <p className="text-gray-500 dark:text-gray-400 italic mt-4">
                (Showing first 20 entries of {transcript.length} total)
              </p>
            )}
          </div>
          
          <div className="mt-6 flex justify-center">
            <button
              onClick={onConfirmAnalysis}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Confirm Analysis
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 