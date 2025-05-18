import { useState } from 'react';
import { FaYoutube } from 'react-icons/fa';
import { FaSearch } from 'react-icons/fa';

interface YouTubeInputProps {
  onSubmit: (url: string, specificRequest?: string) => void;
  isLoading: boolean;
}

export default function YouTubeInput({ onSubmit, isLoading }: YouTubeInputProps) {
  const [url, setUrl] = useState('');
  const [specificRequest, setSpecificRequest] = useState('');
  const [error, setError] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const validateYouTubeUrl = (url: string) => {
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})(&.*)?$/;
    return pattern.test(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    if (!validateYouTubeUrl(url)) {
      setError('Please enter a valid YouTube URL (e.g., https://www.youtube.com/watch?v=pcC4Dr6Wj2Q&t=1s)');
      return;
    }

    // Pass both the URL and the specific request (if any)
    onSubmit(url, specificRequest.trim() || undefined);
  };

  return (
    <div className="w-full">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-primary">
          Enter a YouTube Video URL
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaYoutube className="w-5 h-5 text-red-600" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter YouTube URL (e.g., https://www.youtube.com/watch?v=pcC4Dr6Wj2Q&t=1s)"
              className="w-full pl-10 pr-4 py-3 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-input transition-all"
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-primary hover:underline focus:outline-none"
            >
              {showAdvanced ? '- Hide advanced options' : '+ Show advanced options'}
            </button>
          </div>

          {showAdvanced && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaSearch className="w-5 h-5 text-gray-400" />
              </div>
              <textarea
                value={specificRequest}
                onChange={(e) => setSpecificRequest(e.target.value)}
                placeholder="Specify what you want from the video (e.g., 'Find timestamps where they talk about climate change' or 'Extract key statistics mentioned')"
                className="w-full pl-10 pr-4 py-3 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-input transition-all min-h-[100px]"
                disabled={isLoading}
              />
              <p className="mt-1 text-xs text-card-foreground/70">
                Leave empty for a general analysis, or specify exactly what you want the AI to focus on.
              </p>
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Analyze Video'
            )}
          </button>
        </form>

        <p className="text-xs text-card-foreground/70">
          The AI will analyze the video content and provide a comprehensive summary with timestamps for important moments.
        </p>
      </div>
    </div>
  );
}