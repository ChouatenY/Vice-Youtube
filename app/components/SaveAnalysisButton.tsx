import { useState } from 'react';
import { useLocalUser } from '@/lib/local-user-context';
import { saveAnalysis } from '@/lib/client-actions';
import { Button } from '@/components/ui/button';
import { Save, Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

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

    const savePromise = saveAnalysis(videoId, null, analysis);

    toast.promise(
      savePromise,
      {
        loading: 'Saving analysis...',
        success: 'Analysis saved successfully!',
        error: 'Failed to save analysis. Please try again.',
      }
    );

    try {
      await savePromise;

      setIsSuccess(true);
      onSaved();

      // Reset success state after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving analysis:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button
      onClick={handleSave}
      disabled={isSaving}
      variant={isSuccess ? "default" : "default"}
      className={`gap-2 transition-all duration-200 ${
        isSuccess
          ? 'bg-green-600 hover:bg-green-700 text-white'
          : ''
      }`}
    >
      {isSuccess ? (
        <>
          <Check className="h-4 w-4" />
          Saved!
        </>
      ) : isSaving ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Save className="h-4 w-4" />
          Save Analysis
        </>
      )}
    </Button>
  );
}