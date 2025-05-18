import { useState, useEffect } from 'react';
import { useLocalUser } from '@/lib/local-user-context';
import AnalysisModal from './AnalysisModal';
import { fetchAnalyses, deleteAnalysis, updateAnalysis } from '@/lib/client-actions';

interface Analysis {
  id: string;
  videoId: string;
  videoTitle: string;
  analysis: string;
  createdAt: string;
  updatedAt: string;
}

export default function SavedAnalysesList() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useLocalUser();

  useEffect(() => {
    if (user) {
      getAnalysesData();
    }
  }, [user]);

  const [fetchError, setFetchError] = useState<string | null>(null);

  const getAnalysesData = async () => {
    if (!user) {
      console.log('No user available, skipping analyses fetch');
      return;
    }

    setIsLoading(true);
    setFetchError(null);

    try {
      console.log('Fetching analyses using client action...');
      console.log('Current user:', user);

      // Get the user ID from local storage
      const userId = typeof window !== 'undefined' ? localStorage.getItem('localUserId') : null;
      console.log('User ID from local storage:', userId);

      if (!userId) {
        console.warn('No user ID found in local storage, using default user ID');
      }

      // Use the client action to fetch analyses
      const result = await fetchAnalyses();
      console.log('Fetch analyses result:', result);

      if (!result || !result.analyses) {
        throw new Error('Invalid response format: missing analyses array');
      }

      const { analyses: fetchedAnalyses } = result;
      console.log('Analyses fetched successfully:', fetchedAnalyses?.length || 0, 'items');
      setAnalyses(fetchedAnalyses || []);
    } catch (error) {
      console.error('Error fetching analyses:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error details:', errorMessage);
      setFetchError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (analysis: Analysis) => {
    setSelectedAnalysis(analysis);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAnalysis(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this analysis?')) {
      return;
    }

    try {
      // Use the client action to delete the analysis
      await deleteAnalysis(id);

      // Remove the deleted analysis from the list
      setAnalyses(analyses.filter(analysis => analysis.id !== id));

      // Close the modal if the deleted analysis was selected
      if (selectedAnalysis?.id === id) {
        handleCloseModal();
      }
    } catch (error) {
      console.error('Error deleting analysis:', error);
      alert('Failed to delete analysis. Please try again.');
    }
  };

  const handleUpdate = async (id: string, updatedAnalysis: string) => {
    try {
      // Use the client action to update the analysis
      await updateAnalysis(id, updatedAnalysis);

      // Update the analysis in the list
      setAnalyses(
        analyses.map(analysis =>
          analysis.id === id
            ? { ...analysis, analysis: updatedAnalysis, updatedAt: new Date().toISOString() }
            : analysis
        )
      );

      // Update the selected analysis if it was the one that was updated
      if (selectedAnalysis?.id === id) {
        setSelectedAnalysis({
          ...selectedAnalysis,
          analysis: updatedAnalysis,
          updatedAt: new Date().toISOString()
        });
      }

      alert('Analysis updated successfully!');
    } catch (error) {
      console.error('Error updating analysis:', error);
      alert('Failed to update analysis. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <button
          onClick={getAnalysesData}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
        >
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-secondary rounded-lg"></div>
          ))}
        </div>
      ) : fetchError ? (
        <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
          <p className="font-bold">Error fetching analyses:</p>
          <p>{fetchError}</p>
          <button
            onClick={getAnalysesData}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Try Again
          </button>
        </div>
      ) : analyses.length === 0 ? (
        <p className="text-card-foreground/70 text-center py-6">
          You haven't saved any analyses yet.
        </p>
      ) : (
        <div className="space-y-4">
          {analyses.map(analysis => (
            <div
              key={analysis.id}
              className="p-4 bg-background rounded-lg border border-input hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => handleOpenModal(analysis)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">
                    {analysis.videoTitle || 'Untitled Video'}
                  </h3>
                  <p className="text-sm text-card-foreground/60 mt-1">
                    {new Date(analysis.createdAt).toLocaleDateString()} • Video ID: {analysis.videoId}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(analysis.id);
                    }}
                    className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-card-foreground/70 mt-2 line-clamp-2">
                {analysis.analysis.substring(0, 150)}...
              </p>
            </div>
          ))}
        </div>
      )}

      {selectedAnalysis && (
        <AnalysisModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          analysis={selectedAnalysis}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}