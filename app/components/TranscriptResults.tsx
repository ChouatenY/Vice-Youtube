interface TranscriptResultsProps {
  videoId: string;
  onReset: () => void;
}

export default function TranscriptResults({ videoId, onReset }: TranscriptResultsProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mt-8 space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Video Analysis</h2>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors"
        >
          Analyze Another Video
        </button>
      </div>

      <div className="aspect-video w-full">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-lg shadow-lg"
        ></iframe>
      </div>
    </div>
  );
} 