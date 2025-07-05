import { useState } from 'react';
import ReactModal from 'react-modal';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { X, Edit3, Save, Trash2, Calendar, Video, ExternalLink } from 'lucide-react';

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
      className="max-w-5xl mx-auto mt-8 mb-8 rounded-xl border bg-card text-card-foreground shadow-2xl outline-none overflow-hidden"
      overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
    >
      {/* Header */}
      <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border/50 p-6 z-10">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-foreground mb-3 leading-tight">
              {analysis.videoTitle || 'Untitled Video'}
            </h1>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  Created {new Date(analysis.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                <span className="font-mono">{analysis.videoId}</span>
              </div>
              <a
                href={`https://youtube.com/watch?v=${analysis.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Watch Video
              </a>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-6">
            {!isEditing && (
              <Button
                onClick={handleEdit}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Edit3 className="h-4 w-4" />
                Edit
              </Button>
            )}
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isEditing ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Edit Analysis
              </label>
              <textarea
                value={editedAnalysis}
                onChange={(e) => setEditedAnalysis(e.target.value)}
                className="w-full h-96 p-4 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring transition-all resize-none font-mono text-sm leading-relaxed"
                placeholder="Enter your analysis here..."
              />
              <p className="text-xs text-muted-foreground">
                You can use Markdown formatting in your analysis.
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
              <Button
                onClick={handleCancel}
                disabled={isSaving}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
          </div>
        </div>
        ) : (
          <div className="space-y-6">
            <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h1:mt-8 prose-h2:mt-6 prose-h3:mt-4 prose-p:leading-relaxed prose-p:my-4 prose-ul:my-4 prose-ol:my-4 prose-li:my-1 prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:p-4 prose-blockquote:rounded-r-lg prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg">
              <ReactMarkdown>
                {analysis.analysis}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {!isEditing && (
        <div className="sticky bottom-0 bg-card/95 backdrop-blur-sm border-t border-border/50 p-6">
          <div className="flex justify-between items-center">
            <div className="text-xs text-muted-foreground">
              Last updated {new Date(analysis.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            <Button
              onClick={handleDelete}
              variant="destructive"
              size="sm"
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Analysis
            </Button>
          </div>
        </div>
      )}
    </ReactModal>
  );
} 