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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { analysis } = await request.json();

    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis content is required' },
        { status: 400 }
      );
    }

    // Get the user ID from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || LOCAL_USER_ID;

    console.log('User ID from query parameters:', userId);

    // Ensure user exists
    await ensureUserExists(userId);

    // Check if the analysis belongs to the user
    const existingAnalysis = await prisma.analysis.findUnique({
      where: { id }
    });

    if (!existingAnalysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    if (existingAnalysis.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Update the analysis
    const updatedAnalysis = await prisma.analysis.update({
      where: { id },
      data: { analysis }
    });

    return NextResponse.json({
      success: true,
      analysis: updatedAnalysis
    });
  } catch (error) {
    console.error('Error updating analysis:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error details:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to update analysis', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Get the user ID from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || LOCAL_USER_ID;

    console.log('User ID from query parameters:', userId);

    // Ensure user exists
    await ensureUserExists(userId);

    // Check if the analysis belongs to the user
    const existingAnalysis = await prisma.analysis.findUnique({
      where: { id }
    });

    if (!existingAnalysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    if (existingAnalysis.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Delete the analysis
    await prisma.analysis.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting analysis:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error details:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to delete analysis', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Get the user ID from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || LOCAL_USER_ID;

    console.log('User ID from query parameters:', userId);

    // Ensure user exists
    await ensureUserExists(userId);

    // Get the specific analysis
    const analysis = await prisma.analysis.findUnique({
      where: { id }
    });

    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    if (analysis.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Error fetching analysis:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error details:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to fetch analysis', details: errorMessage },
      { status: 500 }
    );
  }
}