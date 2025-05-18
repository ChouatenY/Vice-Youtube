'use client';

// This file contains client-side wrappers for server actions
// These functions will be called from client components

/**
 * Client-side wrapper for the getAnalyses server action
 */
export async function fetchAnalyses() {
  try {
    // Get the user ID from local storage
    const userId = typeof window !== 'undefined' ? localStorage.getItem('localUserId') : null;
    console.log('User ID from local storage:', userId);

    // Add the user ID as a query parameter if available
    const url = userId ? `/api/local-analyses?userId=${userId}` : '/api/local-analyses';
    console.log('Fetching analyses with URL:', url);

    const response = await fetch(url);
    console.log('Response status:', response.status);

    if (!response.ok) {
      let errorMessage = 'Failed to fetch analyses';
      try {
        const errorData = await response.json();
        console.log('Error data:', errorData);
        errorMessage = errorData.details || errorMessage;
      } catch (jsonError) {
        console.error('Error parsing error response:', jsonError);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Analyses data received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching analyses:', error);
    throw error;
  }
}

/**
 * Client-side wrapper for the saveAnalysis server action
 */
export async function saveAnalysis(videoId: string, videoTitle: string | null, analysis: string) {
  try {
    // Get the user ID from local storage
    const userId = typeof window !== 'undefined' ? localStorage.getItem('localUserId') : null;
    console.log('User ID from local storage:', userId);

    const response = await fetch('/api/local-analyses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ videoId, videoTitle, analysis, userId }),
    });

    console.log('Save analysis response status:', response.status);

    if (!response.ok) {
      let errorMessage = 'Failed to save analysis';
      try {
        const errorData = await response.json();
        console.log('Error data:', errorData);
        errorMessage = errorData.details || errorMessage;
      } catch (jsonError) {
        console.error('Error parsing error response:', jsonError);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Save analysis response data:', data);
    return data;
  } catch (error) {
    console.error('Error saving analysis:', error);
    throw error;
  }
}

/**
 * Client-side wrapper for the deleteAnalysis server action
 */
export async function deleteAnalysis(id: string) {
  try {
    // Get the user ID from local storage
    const userId = typeof window !== 'undefined' ? localStorage.getItem('localUserId') : null;
    console.log('User ID from local storage:', userId);

    // Add the user ID as a query parameter if available
    const url = userId ? `/api/local-analyses/${id}?userId=${userId}` : `/api/local-analyses/${id}`;
    console.log('Deleting analysis with URL:', url);

    const response = await fetch(url, {
      method: 'DELETE',
    });

    console.log('Delete analysis response status:', response.status);

    if (!response.ok) {
      let errorMessage = 'Failed to delete analysis';
      try {
        const errorData = await response.json();
        console.log('Error data:', errorData);
        errorMessage = errorData.details || errorMessage;
      } catch (jsonError) {
        console.error('Error parsing error response:', jsonError);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Delete analysis response data:', data);
    return data;
  } catch (error) {
    console.error('Error deleting analysis:', error);
    throw error;
  }
}

/**
 * Client-side wrapper for the updateAnalysis server action
 */
export async function updateAnalysis(id: string, analysis: string) {
  try {
    // Get the user ID from local storage
    const userId = typeof window !== 'undefined' ? localStorage.getItem('localUserId') : null;
    console.log('User ID from local storage:', userId);

    // Add the user ID as a query parameter if available
    const url = userId ? `/api/local-analyses/${id}?userId=${userId}` : `/api/local-analyses/${id}`;
    console.log('Updating analysis with URL:', url);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ analysis }),
    });

    console.log('Update analysis response status:', response.status);

    if (!response.ok) {
      let errorMessage = 'Failed to update analysis';
      try {
        const errorData = await response.json();
        console.log('Error data:', errorData);
        errorMessage = errorData.details || errorMessage;
      } catch (jsonError) {
        console.error('Error parsing error response:', jsonError);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Update analysis response data:', data);
    return data;
  } catch (error) {
    console.error('Error updating analysis:', error);
    throw error;
  }
}
