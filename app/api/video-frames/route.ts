'use server';

import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Convert exec to Promise-based
const execAsync = promisify(exec);

// Define the directory for storing frames
const FRAMES_DIR = path.join(process.cwd(), 'public', 'frames');

// Ensure the frames directory exists
const ensureFramesDir = () => {
  if (!fs.existsSync(FRAMES_DIR)) {
    fs.mkdirSync(FRAMES_DIR, { recursive: true });
  }
};

// Function to get YouTube thumbnail URLs as a fallback
async function getYouTubeThumbnails(videoId: string): Promise<string[]> {
  // YouTube provides several thumbnail options
  const thumbnailUrls = [
    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`, // High quality
    `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,     // Standard definition
    `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,     // High quality
    `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,     // Medium quality
    `https://img.youtube.com/vi/${videoId}/default.jpg`        // Default quality
  ];

  return thumbnailUrls;
}

// Function to extract frames from a YouTube video
async function extractFrames(videoId: string, timestamps: number[]): Promise<string[]> {
  ensureFramesDir();

  // Generate a unique ID for this extraction session
  const sessionId = uuidv4();

  // Create a directory for this session
  const sessionDir = path.join(FRAMES_DIR, sessionId);
  fs.mkdirSync(sessionDir, { recursive: true });

  // YouTube video URL
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

  // Array to store frame paths
  const framePaths: string[] = [];

  try {
    // Check if yt-dlp and ffmpeg are available
    try {
      await execAsync('yt-dlp --version');
      await execAsync('ffmpeg -version');
    } catch (error) {
      console.log('yt-dlp or ffmpeg not available, using thumbnail fallback');
      // If tools are not available, use YouTube thumbnails as fallback
      return getYouTubeThumbnails(videoId);
    }

    // For each timestamp, extract a frame
    for (const timestamp of timestamps) {
      const outputPath = path.join(sessionDir, `frame_${timestamp}.jpg`);
      const relativeOutputPath = `/frames/${sessionId}/frame_${timestamp}.jpg`;

      // Use yt-dlp and ffmpeg to extract the frame
      // Note: This requires yt-dlp and ffmpeg to be installed on the server
      const command = `yt-dlp -f "best[height<=720]" --downloader ffmpeg --downloader-args "ffmpeg_i:-ss ${timestamp} -frames:v 1" -o - ${videoUrl} | ffmpeg -i - -vframes 1 -q:v 2 ${outputPath}`;

      try {
        await execAsync(command);
        framePaths.push(relativeOutputPath);
      } catch (error) {
        console.error(`Error extracting frame at timestamp ${timestamp}:`, error);
        // Continue with other timestamps even if one fails
      }
    }

    // If we couldn't extract any frames, fall back to thumbnails
    if (framePaths.length === 0) {
      console.log('No frames extracted, using thumbnail fallback');
      return getYouTubeThumbnails(videoId);
    }

    return framePaths;
  } catch (error) {
    console.error('Error in frame extraction process:', error);
    // Fall back to thumbnails on error
    console.log('Error in frame extraction, using thumbnail fallback');
    return getYouTubeThumbnails(videoId);
  }
}

// API route handler
export async function POST(request: NextRequest) {
  try {
    const { videoId, timestamps } = await request.json();

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    if (!timestamps || !Array.isArray(timestamps) || timestamps.length === 0) {
      return NextResponse.json(
        { error: 'At least one timestamp is required' },
        { status: 400 }
      );
    }

    // Extract frames
    const framePaths = await extractFrames(videoId, timestamps);

    return NextResponse.json({ frames: framePaths });
  } catch (error) {
    console.error('Error processing video frames request:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      { error: 'Failed to extract video frames', details: errorMessage },
      { status: 500 }
    );
  }
}
