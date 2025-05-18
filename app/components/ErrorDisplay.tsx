import { useState } from 'react';

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Determine if this is a common error that we can provide help for
  const isGeminiError = message.includes('Gemini API') || message.includes('models/');
  const isTranscriptError = message.includes('transcript') || message.includes('captions');
  const isNetworkError = message.includes('fetch failed') || message.includes('network') || message.includes('timeout');

  // Prepare helpful message based on error type
  let helpfulMessage = '';
  if (isGeminiError) {
    helpfulMessage = 'This might be due to an issue with the Gemini API configuration or temporary service unavailability.';
  } else if (isTranscriptError) {
    helpfulMessage = 'This video might not have captions available, or there might be an issue accessing them.';
  } else if (isNetworkError) {
    helpfulMessage = 'There seems to be a network connectivity issue. Please check your internet connection and try again.';
  }

  return (
    <div className="space-y-4 rounded-lg border border-red-200 bg-card text-card-foreground shadow-sm p-6">
      <div className="flex items-center justify-center mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <h3 className="text-lg font-semibold text-center">
        Error Occurred
      </h3>

      <div className="text-card-foreground/70 space-y-2">
        <p className="font-medium text-center">
          {message}
        </p>

        {helpfulMessage && (
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-md mt-2">
            <p className="text-amber-800 text-sm">
              <strong>Tip:</strong> {helpfulMessage}
            </p>
          </div>
        )}

        {message.length > 50 && (
          <div className="mt-2 text-center">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-primary text-sm hover:underline focus:outline-none"
            >
              {showDetails ? 'Hide technical details' : 'Show technical details'}
            </button>

            {showDetails && (
              <pre className="mt-2 p-3 bg-gray-100 rounded text-xs text-left overflow-auto max-h-40">
                {message}
              </pre>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={onRetry}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}