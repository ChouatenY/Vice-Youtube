import { useState } from 'react';
import { useLocalUser } from '@/lib/local-user-context';
import { saveAnalysis } from '@/lib/client-actions';

interface SaveAnalysisButtonProps {
  videoId: string;
  analysis: string;
  onSaved: () => void;
}

export default function SaveAnalysisButton({ videoId, analysis, onSaved }: SaveAnalysisButtonProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { user } = useLocalUser();

  const handleSave = async () => {
    setIsSaving(true);
    setIsSuccess(false);

    try {
      // Use the client action to save the analysis
      await saveAnalysis(videoId, null, analysis);

      setIsSuccess(true);
      onSaved();

      // Reset success state after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving analysis:', error);
      alert('Failed to save analysis. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={isSaving}
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 ${
        isSuccess
          ? 'bg-green-600 text-white hover:bg-green-700'
          : 'bg-primary text-primary-foreground hover:bg-primary/90'
      }`}
    >
      {isSuccess
        ? 'Saved!'
        : isSaving
        ? 'Saving...'
        : 'Save Analysis'}
    </button>
  );
}