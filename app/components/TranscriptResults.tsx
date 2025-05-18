interface TranscriptResultsProps {
  videoId: string;
  onReset: () => void;
}

export default function TranscriptResults({ videoId, onReset }: TranscriptResultsProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-b pb-4">
        <h2 className="text-2xl font-semibold tracking-tight text-primary">Video Analysis</h2>
        <button
          onClick={onReset}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          Analyze Another Video
        </button>
      </div>

      <div className="aspect-video w-full max-w-md mx-auto">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-lg shadow-md"
        ></iframe>
      </div>
    </div>
  );
}