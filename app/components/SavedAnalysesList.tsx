import { useState, useEffect } from 'react';
import { useLocalUser } from '@/lib/local-user-context';
import AnalysisModal from './AnalysisModal';
import { fetchAnalyses, deleteAnalysis, updateAnalysis } from '@/lib/client-actions';
import { Button } from '@/components/ui/button';
import { RefreshCw, Calendar, Video, Trash2, Eye } from 'lucide-react';

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-muted-foreground">
            {analyses.length} saved {analyses.length === 1 ? 'analysis' : 'analyses'}
          </span>
        </div>
        <Button
          onClick={getAnalysesData}
          variant="outline"
          size="sm"
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="rounded-lg border bg-card p-6 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="h-5 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                  <div className="h-8 w-16 bg-muted rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : fetchError ? (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center">
          <div className="space-y-3">
            <div className="text-destructive font-semibold">Error fetching analyses</div>
            <p className="text-sm text-muted-foreground">{fetchError}</p>
            <Button
              onClick={getAnalysesData}
              variant="destructive"
              size="sm"
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      ) : analyses.length === 0 ? (
        <div className="text-center py-12">
          <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No saved analyses yet</h3>
          <p className="text-muted-foreground">
            Analyze a YouTube video and save it to see your analyses here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {analyses.map(analysis => (
            <div
              key={analysis.id}
              className="group rounded-lg border bg-card hover:bg-accent/5 transition-all duration-200 hover:shadow-md hover:border-primary/20"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-foreground mb-2 truncate">
                      {analysis.videoTitle || 'Untitled Video'}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(analysis.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Video className="h-4 w-4" />
                        <span className="font-mono text-xs">{analysis.videoId}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      onClick={() => handleOpenModal(analysis)}
                      variant="outline"
                      size="sm"
                      className="gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(analysis.id);
                      }}
                      variant="outline"
                      size="sm"
                      className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>

                <div
                  className="cursor-pointer"
                  onClick={() => handleOpenModal(analysis)}
                >
                  <div className="prose prose-sm max-w-none">
                    <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                      {analysis.analysis.substring(0, 200)}
                      {analysis.analysis.length > 200 && '...'}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Click to view full analysis</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        Last updated {new Date(analysis.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
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