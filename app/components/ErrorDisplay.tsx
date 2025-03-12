interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mt-8 p-6 bg-white dark:bg-gray-950 border border-red-200 dark:border-red-800 rounded-lg text-center shadow-sm">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-12 w-12 mx-auto text-red-500 mb-4" 
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
      
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Error Occurred
      </h3>
      
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        {message}
      </p>
      
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
      >
        Try Again
      </button>
    </div>
  );
} 