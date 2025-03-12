interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  const steps = [
    'Validating URL',
    'Fetching video details',
    'Extracting transcript',
    'Processing data',
    'Analyzing content'
  ];

  const progress = Math.min(Math.round((currentStep / totalSteps) * 100), 100);

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Processing Your Video
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {currentStep <= totalSteps 
            ? `Step ${currentStep} of ${totalSteps}: ${steps[currentStep - 1]}` 
            : 'Complete'}
        </p>
      </div>
      
      <div className="mb-4 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5 mb-6">
        <div 
          className="bg-red-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="grid grid-cols-5 gap-2">
        {steps.map((step, index) => (
          <div 
            key={index}
            className={`text-xs text-center p-2 rounded-md ${
              index + 1 < currentStep 
                ? 'bg-white dark:bg-gray-900 border border-red-200 dark:border-red-800 text-gray-900 dark:text-gray-100' 
                : index + 1 === currentStep 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400'
            }`}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );
} 