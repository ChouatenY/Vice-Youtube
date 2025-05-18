'use server';

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define the path to the local JSON file
const DATA_FILE = path.join(process.cwd(), 'local-data', 'analyses.json');

// Read data from the file
const readData = () => {
  if (!fs.existsSync(DATA_FILE)) {
    return { analyses: [] };
  }
  
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data file:', error);
    return { analyses: [] };
  }
};

// Write data to the file
const writeData = (data: any) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing data file:', error);
    return false;
  }
};

// GET handler to fetch a specific analysis
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log(`GET /api/local-analyses/${id} - Fetching analysis`);
    
    // Get the user ID from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || 'default-user';
    
    console.log('User ID from query parameters:', userId);
    
    // Read data from the file
    const data = readData();
    
    // Find the specific analysis
    const analysis = data.analyses.find((a: any) => a.id === id && a.userId === userId);
    
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
    
    // Read data from the file
    const data = readData();
    
    // Find the index of the analysis
    const index = data.analyses.findIndex((a: any) => a.id === id && a.userId === userId);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }
    
    // Update the analysis
    data.analyses[index] = {
      ...data.analyses[index],
      analysis,
      updatedAt: new Date().toISOString()
    };
    
    // Write the updated data
    if (writeData(data)) {
      return NextResponse.json({ success: true, analysis: data.analyses[index] });
    } else {
      throw new Error('Failed to write data to file');
    }
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
    
    // Read data from the file
    const data = readData();
    
    // Find the index of the analysis
    const index = data.analyses.findIndex((a: any) => a.id === id && a.userId === userId);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }
    
    // Remove the analysis
    data.analyses.splice(index, 1);
    
    // Write the updated data
    if (writeData(data)) {
      return NextResponse.json({ success: true });
    } else {
      throw new Error('Failed to write data to file');
    }
  } catch (error) {
    console.error('Error deleting analysis:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { error: 'Failed to delete analysis', details: errorMessage },
      { status: 500 }
    );
  }
}
