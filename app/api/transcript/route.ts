'use server';

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

    // Initialize Innertube with timeout
    const youtubePromise = Innertube.create({
      lang: 'en',
      location: 'US',
      retrieve_player: false,
    });

    // Add timeout for Vercel serverless functions
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('YouTube API initialization timed out'));
      }, 8000); // 8 second timeout
    });

    // Race between initialization and timeout
    const youtube = await Promise.race([youtubePromise, timeoutPromise]) as Awaited<ReturnType<typeof Innertube.create>>;

    // Get video info with timeout
    const infoPromise = youtube.getInfo(videoId);
    const infoTimeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Video info fetch timed out'));
      }, 8000); // 8 second timeout
    });

    // Race between video info fetch and timeout
    const info = await Promise.race([infoPromise, infoTimeoutPromise]);

    // Fetch transcript
    const fetchTranscript = async () => {
      try {
        console.log(`Fetching transcript for video ID: ${videoId}`);

        // Add timeout for transcript fetch
        const transcriptPromise = info.getTranscript();
        const transcriptTimeoutPromise = new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error('Transcript fetch timed out'));
          }, 8000); // 8 second timeout
        });

        // Race between transcript fetch and timeout
        const transcriptData = await Promise.race([transcriptPromise, transcriptTimeoutPromise]);

        if (!transcriptData || !transcriptData.transcript || !transcriptData.transcript.content || !transcriptData.transcript.content.body || !transcriptData.transcript.content.body.initial_segments) {
          console.error('Invalid transcript data structure:', JSON.stringify(transcriptData, null, 2));
          throw new Error('Invalid transcript data structure');
        }

        console.log(`Successfully retrieved transcript with ${transcriptData.transcript.content.body.initial_segments.length} segments`);

        return transcriptData.transcript.content.body.initial_segments.map((segment) => ({
          text: segment.snippet.text,
          start: segment.start_ms / 1000, // Convert ms to seconds
          duration: (segment.end_ms - segment.start_ms) / 1000 // Convert ms to seconds
        }));
      } catch (error) {
        console.error('Error fetching transcript:', error);

        // Try alternative method if available
        try {
          console.log('Attempting to fetch captions as fallback...');

          // Add timeout for captions fetch
          const captionsPromise = youtube.getTranscript(videoId);
          const captionsTimeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
              reject(new Error('Captions fetch timed out'));
            }, 8000); // 8 second timeout
          });

          // Race between captions fetch and timeout
          const captions = await Promise.race([captionsPromise, captionsTimeoutPromise]);

          if (!captions || captions.length === 0) {
            throw new Error('No captions available');
          }

          console.log(`Successfully retrieved ${captions.length} caption segments as fallback`);

          return captions.map((caption) => ({
            text: caption.text,
            start: caption.start,
            duration: caption.duration
          }));
        } catch (fallbackError) {
          console.error('Fallback transcript fetch also failed:', fallbackError);
          throw error; // Throw the original error
        }
      }
    };

    let transcript;
    try {
      transcript = await fetchTranscript();
    } catch (transcriptError) {
      console.error('Failed to fetch transcript:', transcriptError);
      return NextResponse.json(
        { error: 'Failed to fetch transcript', details: transcriptError instanceof Error ? transcriptError.message : 'Unknown error' },
        { status: 500 }
      );
    }

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