import { NextRequest, NextResponse } from 'next/server';
import { Innertube } from 'youtubei.js/web';

export async function POST(request: NextRequest) {
  try {
    const { videoUrl } = await request.json();
    
    if (!videoUrl) {
      return NextResponse.json(
        { error: 'Video URL is required' },
        { status: 400 }
      );
    }

    // Extract video ID from YouTube URL
    const videoIdMatch = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    
    if (!videoIdMatch || !videoIdMatch[1]) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }
    
    const videoId = videoIdMatch[1];
    
    // Initialize Innertube
    const youtube = await Innertube.create({
      lang: 'en',
      location: 'US',
      retrieve_player: false,
    });

    // Get video info
    const info = await youtube.getInfo(videoId);
    
    // Fetch transcript
    const fetchTranscript = async () => {
      try {
        const transcriptData = await info.getTranscript();
        return transcriptData.transcript.content.body.initial_segments.map((segment) => ({
          text: segment.snippet.text,
          start: segment.start_ms / 1000, // Convert ms to seconds
          duration: (segment.end_ms - segment.start_ms) / 1000 // Convert ms to seconds
        }));
      } catch (error) {
        console.error('Error fetching transcript:', error);
        throw error;
      }
    };

    const transcript = await fetchTranscript();

    if (!transcript || transcript.length === 0) {
      return NextResponse.json(
        { error: 'Failed to fetch transcript or transcript not available' },
        { status: 404 }
      );
    }

    return NextResponse.json({ transcript });
  } catch (error) {
    console.error('Error fetching transcript:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transcript' },
      { status: 500 }
    );
  }
} 