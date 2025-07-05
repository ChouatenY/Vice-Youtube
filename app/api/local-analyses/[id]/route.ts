import { NextRequest, NextResponse } from 'next/server';
import { prisma, isPrismaAvailable } from '@/lib/prisma';

// GET handler to fetch a specific analysis
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if Prisma is available
    if (!isPrismaAvailable() || !prisma) {
      return NextResponse.json(
        { error: 'Database not configured', details: 'DATABASE_URL environment variable is missing' },
        { status: 500 }
      );
    }

    const { id } = params;
    console.log(`GET /api/local-analyses/${id} - Fetching analysis`);

    // Get the user ID from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || 'default-user';

    console.log('User ID from query parameters:', userId);

    // Find the specific analysis in the database
    const analysis = await prisma.analysis.findFirst({
      where: {
        id: id,
        userId: userId
      }
    });

    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Error fetching analysis:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      { error: 'Failed to fetch analysis', details: errorMessage },
      { status: 500 }
    );
  }
}

// PUT handler to update an analysis
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
    const userId = searchParams.get('userId') || 'default-user';

    console.log(`PUT /api/local-analyses/${id} - Updating analysis for user:`, userId);

    // Update the analysis in the database
    const updatedAnalysis = await prisma.analysis.updateMany({
      where: {
        id: id,
        userId: userId
      },
      data: {
        analysis: analysis
      }
    });

    if (updatedAnalysis.count === 0) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    // Fetch the updated analysis to return it
    const fetchedAnalysis = await prisma.analysis.findFirst({
      where: {
        id: id,
        userId: userId
      }
    });

    return NextResponse.json({ success: true, analysis: fetchedAnalysis });
  } catch (error) {
    console.error('Error updating analysis:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      { error: 'Failed to update analysis', details: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE handler to delete an analysis
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Get the user ID from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || 'default-user';

    console.log(`DELETE /api/local-analyses/${id} - Deleting analysis for user:`, userId);

    // Delete the analysis from the database
    const deletedAnalysis = await prisma.analysis.deleteMany({
      where: {
        id: id,
        userId: userId
      }
    });

    if (deletedAnalysis.count === 0) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting analysis:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      { error: 'Failed to delete analysis', details: errorMessage },
      { status: 500 }
    );
  }
}
