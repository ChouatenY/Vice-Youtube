import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { videoId, videoTitle, analysis } = await request.json();
    
    if (!videoId || !analysis) {
      return NextResponse.json(
        { error: 'VideoId and analysis are required' },
        { status: 400 }
      );
    }

    // Save the analysis to the database
    const savedAnalysis = await prisma.analysis.create({
      data: {
        videoId,
        videoTitle: videoTitle || 'Untitled Video',
        analysis,
        userId
      }
    });

    return NextResponse.json({ success: true, analysis: savedAnalysis });
  } catch (error) {
    console.error('Error saving analysis:', error);
    return NextResponse.json(
      { error: 'Failed to save analysis' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all analyses for the current user
    const analyses = await prisma.analysis.findMany({
      where: {
        userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ analyses });
  } catch (error) {
    console.error('Error fetching analyses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analyses' },
      { status: 500 }
    );
  }
} 