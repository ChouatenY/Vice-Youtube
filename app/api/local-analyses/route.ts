'use server';

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Define the path to the local JSON file
const DATA_FILE = path.join(process.cwd(), 'local-data', 'analyses.json');

// Ensure the directory exists
const ensureDirectoryExists = () => {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Read data from the file
const readData = () => {
  ensureDirectoryExists();
  
  if (!fs.existsSync(DATA_FILE)) {
    // Create an empty file if it doesn't exist
    fs.writeFileSync(DATA_FILE, JSON.stringify({ analyses: [] }));
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
  ensureDirectoryExists();
  
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing data file:', error);
    return false;
  }
};

// GET handler to fetch all analyses
export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/local-analyses - Fetching analyses');
    
    // Get the user ID from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || 'default-user';
    
    console.log('User ID from query parameters:', userId);
    
    // Read data from the file
    const data = readData();
    
    // Filter analyses by user ID
    const userAnalyses = data.analyses.filter((analysis: any) => analysis.userId === userId);
    
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
    
    // Read existing data
    const data = readData();
    
    // Create a new analysis
    const newAnalysis = {
      id: uuidv4(),
      videoId,
      videoTitle: videoTitle || 'Untitled Video',
      analysis,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add the new analysis
    data.analyses.push(newAnalysis);
    
    // Write the updated data
    if (writeData(data)) {
      return NextResponse.json({ success: true, analysis: newAnalysis });
    } else {
      throw new Error('Failed to write data to file');
    }
  } catch (error) {
    console.error('Error creating analysis:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { error: 'Failed to create analysis', details: errorMessage },
      { status: 500 }
    );
  }
}
