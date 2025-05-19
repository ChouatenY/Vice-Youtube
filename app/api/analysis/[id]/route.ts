import { NextRequest, NextResponse } from 'next/server';
import { updateAnalysis, deleteAnalysis, getAnalysisById } from '@/lib/api-actions';

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
    const userId = searchParams.get('userId');

    console.log('User ID from query parameters:', userId || 'Not provided');

    // Use the server action to update the analysis with the user ID if provided
    const result = await updateAnalysis(id, analysis, userId || undefined);
    return NextResponse.json(result);
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
    const userId = searchParams.get('userId');

    console.log('User ID from query parameters:', userId || 'Not provided');

    // Use the server action to delete the analysis with the user ID if provided
    const result = await deleteAnalysis(id, userId || undefined);
    return NextResponse.json(result);
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
    const userId = searchParams.get('userId');

    console.log('User ID from query parameters:', userId || 'Not provided');

    // Use the server action to get a specific analysis with the user ID if provided
    const result = await getAnalysisById(id, userId || undefined);
    return NextResponse.json(result);
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