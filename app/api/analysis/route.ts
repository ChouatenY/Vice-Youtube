import { NextRequest, NextResponse } from 'next/server';
import { saveAnalysis, getAnalyses } from '@/lib/server-actions';

export async function POST(request: NextRequest) {
  try {
    const { videoId, videoTitle, analysis, userId } = await request.json();

    if (!videoId || !analysis) {
      return NextResponse.json(
        { error: 'VideoId and analysis are required' },
        { status: 400 }
      );
    }

    console.log('User ID from request body:', userId || 'Not provided');

    // Use the server action to save the analysis with the user ID if provided
    const result = await saveAnalysis(videoId, videoTitle || null, analysis, userId || undefined);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error saving analysis:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error details:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to save analysis', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/analysis - Starting request');
    console.log('Request URL:', request.url);

    // Get the user ID from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    console.log('User ID from query parameters:', userId || 'Not provided');

    // Use the server action to get analyses with the user ID if provided
    console.log('Calling getAnalyses server action with userId:', userId || 'undefined');
    const result = await getAnalyses(userId || undefined);
    console.log('Server action completed successfully, result:', JSON.stringify(result));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in GET /api/analysis:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error details:', errorMessage);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');

    return NextResponse.json(
      { error: 'Failed to fetch analyses', details: errorMessage },
      { status: 500 }
    );
  }
}
