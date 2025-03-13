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
    <div className="space-y-4 rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">
          Processing Your Video
        </h3>
        <p className="text-sm text-card-foreground/70">
          {currentStep <= totalSteps 
            ? `Step ${currentStep} of ${totalSteps}: ${steps[currentStep - 1]}` 
            : 'Complete'}
        </p>
      </div>
      
      <div className="flex justify-between items-center text-xs text-card-foreground/50">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
      
      <div className="w-full bg-secondary rounded-full h-2.5">
        <div 
          className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="grid grid-cols-5 gap-2">
        {steps.map((step, index) => (
          <div 
            key={index}
            className={`text-xs text-center p-2 rounded-md ${
              index + 1 < currentStep 
                ? 'bg-background border border-primary/20 text-foreground' 
                : index + 1 === currentStep 
                ? 'bg-primary text-primary-foreground animate-pulse' 
                : 'bg-background border border-input text-card-foreground/50'
            }`}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );
} 