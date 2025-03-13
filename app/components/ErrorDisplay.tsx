interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  return (
    <div className="space-y-4 rounded-lg border border-red-200 bg-card text-card-foreground shadow-sm p-6 text-center">
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
      
      <h3 className="text-lg font-semibold">
        Error Occurred
      </h3>
      
      <p className="text-card-foreground/70">
        {message}
      </p>
      
      <button
        onClick={onRetry}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
      >
        Try Again
      </button>
    </div>
  );
} 