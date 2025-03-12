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
      className="max-w-4xl mx-auto mt-20 p-6 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 shadow-xl outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center overflow-y-auto"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {analysis.videoTitle || 'Untitled Video'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {new Date(analysis.createdAt).toLocaleDateString()} • Video ID: {analysis.videoId}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>

      {isEditing ? (
        <div className="mt-4">
          <textarea
            value={editedAnalysis}
            onChange={(e) => setEditedAnalysis(e.target.value)}
            className="w-full h-96 p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <div className="prose prose-gray dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white prose-h2:text-xl prose-h3:text-lg prose-h2:mt-8 prose-h3:mt-6 prose-p:leading-relaxed prose-p:my-4 prose-ul:my-4 prose-ol:my-4 prose-li:my-1">
            <ReactMarkdown>
              {analysis.analysis}
            </ReactMarkdown>
          </div>
          <div className="flex justify-between mt-6">
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Delete
            </button>
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Edit
            </button>
          </div>
        </div>
      )}
    </ReactModal>
  );
} 