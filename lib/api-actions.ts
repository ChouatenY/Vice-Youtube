// This file contains the same functions as server-actions.ts but without the 'use server' directive
// It's meant to be used by API routes

import { prisma } from './prisma';
import { LOCAL_USER_ID, LOCAL_USER_EMAIL } from './local-user';

/**
 * Get all analyses for the local user
 */
export async function getAnalyses(userId?: string) {
  try {
    console.log('Starting getAnalyses server action');
    console.log('Received userId parameter:', userId);

    // Use the provided userId or fall back to LOCAL_USER_ID
    const userIdToUse = userId || LOCAL_USER_ID;
    console.log('Using userId:', userIdToUse);

    try {
      // Initialize the local user if it doesn't exist
      console.log('Initializing local user...');
      await initializeLocalUser(userIdToUse);
      console.log('Local user initialized successfully');
    } catch (initError) {
      console.error('Error initializing user:', initError);
      const errorMessage = initError instanceof Error ? initError.message : 'Unknown error';
      console.error('Error details:', errorMessage);
      console.error('Error stack:', initError instanceof Error ? initError.stack : 'No stack trace');
      throw new Error(`Failed to initialize user: ${errorMessage}`);
    }

    try {
      // Get all analyses for the user
      console.log('Fetching analyses for user:', userIdToUse);
      const analyses = await prisma.analysis.findMany({
        where: {
          userId: userIdToUse
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      console.log('Analyses fetched successfully:', analyses.length);
      console.log('Analysis IDs:', analyses.map(a => a.id).join(', '));

      return { analyses };
    } catch (dbError) {
      console.error('Error fetching analyses from database:', dbError);
      const errorMessage = dbError instanceof Error ? dbError.message : 'Unknown error';
      console.error('Error details:', errorMessage);
      console.error('Error stack:', dbError instanceof Error ? dbError.stack : 'No stack trace');
      throw new Error(`Failed to fetch analyses from database: ${errorMessage}`);
    }
  } catch (error) {
    console.error('Error in getAnalyses server action:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error details:', errorMessage);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    throw new Error(`Failed to fetch analyses: ${errorMessage}`);
  }
}

/**
 * Initialize the local user in the database if it doesn't exist
 */
export async function initializeLocalUser(userId: string = LOCAL_USER_ID) {
  try {
    console.log('Checking if user exists with ID:', userId);

    try {
      // Check if the user exists
      console.log('Querying database for user with ID:', userId);
      const existingUser = await prisma.user.findUnique({
        where: { id: userId }
      });
      console.log('Database query result:', existingUser ? 'User found' : 'User not found');

      // If the user doesn't exist, create it
      if (!existingUser) {
        console.log('User not found, creating with ID:', userId);
        try {
          const newUser = await prisma.user.create({
            data: {
              id: userId,
              email: LOCAL_USER_EMAIL, // Using the same email for simplicity
              name: 'Local User'
            }
          });
          console.log('User created successfully with ID:', userId);
          console.log('New user details:', JSON.stringify(newUser));
        } catch (createError) {
          console.error('Error creating user:', createError);
          const errorMessage = createError instanceof Error ? createError.message : 'Unknown error';
          console.error('Error details:', errorMessage);
          console.error('Error stack:', createError instanceof Error ? createError.stack : 'No stack trace');
          throw new Error(`Failed to create user: ${errorMessage}`);
        }
      } else {
        console.log('User already exists with ID:', userId);
        console.log('Existing user details:', JSON.stringify(existingUser));
      }
    } catch (dbError) {
      console.error('Error querying database:', dbError);
      const errorMessage = dbError instanceof Error ? dbError.message : 'Unknown error';
      console.error('Error details:', errorMessage);
      console.error('Error stack:', dbError instanceof Error ? dbError.stack : 'No stack trace');
      throw new Error(`Failed to query database: ${errorMessage}`);
    }
  } catch (error) {
    console.error('Error initializing user:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error details:', errorMessage);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    throw new Error(`Failed to initialize user: ${errorMessage}`);
  }
}

/**
 * Get a specific analysis by ID
 */
export async function getAnalysisById(id: string, userId?: string) {
  try {
    // Use the provided userId or fall back to LOCAL_USER_ID
    const userIdToUse = userId || LOCAL_USER_ID;

    // Initialize the user if it doesn't exist
    await initializeLocalUser(userIdToUse);

    // Get the specific analysis
    const analysis = await prisma.analysis.findUnique({
      where: { id }
    });

    if (!analysis) {
      throw new Error('Analysis not found');
    }

    if (analysis.userId !== userIdToUse) {
      throw new Error('Unauthorized');
    }

    return { analysis };
  } catch (error) {
    console.error('Error fetching analysis:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error details:', errorMessage);
    throw new Error(`Failed to fetch analysis: ${errorMessage}`);
  }
}

/**
 * Save a new analysis
 */
export async function saveAnalysis(videoId: string, videoTitle: string | null, analysis: string, userId?: string) {
  try {
    // Use the provided userId or fall back to LOCAL_USER_ID
    const userIdToUse = userId || LOCAL_USER_ID;

    // Initialize the user if it doesn't exist
    await initializeLocalUser(userIdToUse);

    // Save the analysis to the database using the user ID
    const savedAnalysis = await prisma.analysis.create({
      data: {
        videoId,
        videoTitle: videoTitle || 'Untitled Video',
        analysis,
        userId: userIdToUse
      }
    });

    return { success: true, analysis: savedAnalysis };
  } catch (error) {
    console.error('Error saving analysis:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error details:', errorMessage);
    throw new Error(`Failed to save analysis: ${errorMessage}`);
  }
}

/**
 * Delete an analysis
 */
export async function deleteAnalysis(id: string, userId?: string) {
  try {
    // Use the provided userId or fall back to LOCAL_USER_ID
    const userIdToUse = userId || LOCAL_USER_ID;

    // Initialize the user if it doesn't exist
    await initializeLocalUser(userIdToUse);

    // Check if the analysis belongs to the user
    const existingAnalysis = await prisma.analysis.findUnique({
      where: { id }
    });

    if (!existingAnalysis) {
      throw new Error('Analysis not found');
    }

    if (existingAnalysis.userId !== userIdToUse) {
      throw new Error('Unauthorized');
    }

    // Delete the analysis
    await prisma.analysis.delete({
      where: { id }
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting analysis:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error details:', errorMessage);
    throw new Error(`Failed to delete analysis: ${errorMessage}`);
  }
}

/**
 * Update an analysis
 */
export async function updateAnalysis(id: string, analysis: string, userId?: string) {
  try {
    // Use the provided userId or fall back to LOCAL_USER_ID
    const userIdToUse = userId || LOCAL_USER_ID;

    // Initialize the user if it doesn't exist
    await initializeLocalUser(userIdToUse);

    // Check if the analysis belongs to the user
    const existingAnalysis = await prisma.analysis.findUnique({
      where: { id }
    });

    if (!existingAnalysis) {
      throw new Error('Analysis not found');
    }

    if (existingAnalysis.userId !== userIdToUse) {
      throw new Error('Unauthorized');
    }

    // Update the analysis
    const updatedAnalysis = await prisma.analysis.update({
      where: { id },
      data: { analysis }
    });

    return { success: true, analysis: updatedAnalysis };
  } catch (error) {
    console.error('Error updating analysis:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error details:', errorMessage);
    throw new Error(`Failed to update analysis: ${errorMessage}`);
  }
}