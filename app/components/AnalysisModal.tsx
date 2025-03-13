import { useState } from 'react';
import ReactModal from 'react-modal';
import ReactMarkdown from 'react-markdown';

interface Analysis {
  id: string;
  videoId: string;
  videoTitle: string;
  analysis: string;
  createdAt: string;
  updatedAt: string;
}

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: Analysis;
  onUpdate: (id: string, analysis: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

// Make sure to bind modal to your app element
if (typeof window !== 'undefined') {
  ReactModal.setAppElement('body');
}

export default function AnalysisModal({ isOpen, onClose, analysis, onUpdate, onDelete }: AnalysisModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAnalysis, setEditedAnalysis] = useState(analysis.analysis);
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = () => {
    setEditedAnalysis(analysis.analysis);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedAnalysis(analysis.analysis);
  };

  const handleSave = async () => {
    if (editedAnalysis.trim() === '') {
      alert('Analysis cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      await onUpdate(analysis.id, editedAnalysis);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating analysis:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    await onDelete(analysis.id);
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Analysis Details"
      className="max-w-4xl mx-auto mt-20 space-y-4 rounded-lg border bg-card text-card-foreground shadow-sm p-6 outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center overflow-y-auto"
    >
      <div className="flex justify-between items-start border-b pb-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            {analysis.videoTitle || 'Untitled Video'}
          </h2>
          <p className="text-sm text-card-foreground/60 mt-1">
            {new Date(analysis.createdAt).toLocaleDateString()} • Video ID: {analysis.videoId}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-card-foreground/60 hover:text-card-foreground"
        >
          ✕
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <textarea
            value={editedAnalysis}
            onChange={(e) => setEditedAnalysis(e.target.value)}
            className="w-full h-96 p-4 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-input transition-all"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:text-foreground prose-p:text-card-foreground/80 prose-li:text-card-foreground/80 prose-strong:text-foreground prose-h2:text-xl prose-h3:text-lg prose-h2:mt-6 prose-h3:mt-4 prose-p:leading-relaxed prose-p:my-3 prose-ul:my-3 prose-ol:my-3 prose-li:my-1">
            <ReactMarkdown>
              {analysis.analysis}
            </ReactMarkdown>
          </div>
          <div className="flex justify-between pt-4 border-t">
            <button
              onClick={handleDelete}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2"
            >
              Delete
            </button>
            <button
              onClick={handleEdit}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Edit
            </button>
          </div>
        </div>
      )}
    </ReactModal>
  );
} 