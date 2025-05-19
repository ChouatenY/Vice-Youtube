import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { LOCAL_USER_ID } from '@/lib/local-user';

// Helper function to initialize user if needed
async function ensureUserExists(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    await prisma.user.create({
      data: {
        id: userId,
        email: `${userId}@example.com`,
        name: 'Local User'
      }
    });
  }

  return true;
}

export async function POST(request: NextRequest) {
  try {
    const { videoId, videoTitle, analysis, userId = LOCAL_USER_ID } = await request.json();

    if (!videoId || !analysis) {
      return NextResponse.json(
        { error: 'VideoId and analysis are required' },
        { status: 400 }
      );
    }

    console.log('User ID from request body:', userId);

    // Ensure user exists
    await ensureUserExists(userId);

    // Save the analysis to the database
    const savedAnalysis = await prisma.analysis.create({
      data: {
        videoId,
        videoTitle: videoTitle || 'Untitled Video',
        analysis,
        userId
      }
    });

    return NextResponse.json({
      success: true,
      analysis: savedAnalysis
    });
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
    const userId = searchParams.get('userId') || LOCAL_USER_ID;

    console.log('User ID from query parameters:', userId);

    // Ensure user exists
    await ensureUserExists(userId);

    // Get all analyses for the user
    const analyses = await prisma.analysis.findMany({
      where: {
        userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`Found ${analyses.length} analyses for user ${userId}`);

    return NextResponse.json({ analyses });
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
