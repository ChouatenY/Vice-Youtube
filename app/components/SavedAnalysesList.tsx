import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import AnalysisModal from './AnalysisModal';

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
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      fetchAnalyses();
    }
  }, [isSignedIn]);

  const fetchAnalyses = async () => {
    if (!isSignedIn) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/analysis');
      if (!response.ok) {
        throw new Error('Failed to fetch analyses');
      }
      const data = await response.json();
      setAnalyses(data.analyses);
    } catch (error) {
      console.error('Error fetching analyses:', error);
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
      const response = await fetch(`/api/analysis/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete analysis');
      }

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
      const response = await fetch(`/api/analysis/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ analysis: updatedAnalysis }),
      });

      if (!response.ok) {
        throw new Error('Failed to update analysis');
      }

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

  if (!isSignedIn) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8 p-6 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Saved Analyses
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Sign in to view and manage your saved analyses.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 p-6 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Saved Analyses
        </h2>
        <button
          onClick={fetchAnalyses}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm transition-colors"
        >
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
          ))}
        </div>
      ) : analyses.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
          You haven't saved any analyses yet.
        </p>
      ) : (
        <div className="space-y-4">
          {analyses.map(analysis => (
            <div
              key={analysis.id}
              className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors cursor-pointer"
              onClick={() => handleOpenModal(analysis)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {analysis.videoTitle || 'Untitled Video'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
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
              <p className="text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
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