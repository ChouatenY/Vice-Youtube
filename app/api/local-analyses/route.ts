import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET handler to fetch all analyses
export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/local-analyses - Fetching analyses');

    // Get the user ID from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || 'default-user';

    console.log('User ID from query parameters:', userId);

    // First, ensure the user exists in the database
    let user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      // Create the user if they don't exist
      user = await prisma.user.create({
        data: {
          id: userId,
          email: `${userId}@local.dev`,
          name: 'Local User'
        }
      });
      console.log('Created new user:', user.id);
    }

    // Fetch analyses for this user
    const userAnalyses = await prisma.analysis.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`Found ${userAnalyses.length} analyses for user ${userId}`);

    return NextResponse.json({ analyses: userAnalyses });
  } catch (error) {
    console.error('Error fetching analyses:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      { error: 'Failed to fetch analyses', details: errorMessage },
      { status: 500 }
    );
  }
}

// POST handler to create a new analysis
export async function POST(request: NextRequest) {
  try {
    const { videoId, videoTitle, analysis, userId = 'default-user' } = await request.json();

    if (!videoId || !analysis) {
      return NextResponse.json(
        { error: 'VideoId and analysis are required' },
        { status: 400 }
      );
    }

    console.log('Creating analysis for user:', userId);

    // First, ensure the user exists in the database
    let user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      // Create the user if they don't exist
      user = await prisma.user.create({
        data: {
          id: userId,
          email: `${userId}@local.dev`,
          name: 'Local User'
        }
      });
      console.log('Created new user:', user.id);
    }

    // Create the analysis in the database
    const newAnalysis = await prisma.analysis.create({
      data: {
        videoId,
        videoTitle: videoTitle || 'Untitled Video',
        analysis,
        userId
      }
    });

    console.log('Analysis created successfully:', newAnalysis.id);

    return NextResponse.json({ success: true, analysis: newAnalysis });
  } catch (error) {
    console.error('Error creating analysis:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      { error: 'Failed to create analysis', details: errorMessage },
      { status: 500 }
    );
  }
}
