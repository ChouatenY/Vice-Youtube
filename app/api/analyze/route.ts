import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { transcript, specificRequest, videoId } = await request.json();

    if (!transcript || transcript.length === 0) {
      return NextResponse.json(
        { error: 'Transcript is required' },
        { status: 400 }
      );
    }

    // Prepare the transcript with timestamps for analysis
    const transcriptWithTimestamps = transcript.map((entry: { text: string, start: number, duration: number }) => {
      const minutes = Math.floor(entry.start / 60);
      const seconds = Math.floor(entry.start % 60);
      const timestamp = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      return `[${timestamp}] ${entry.text}`;
    }).join('\n');

    // Calculate transcript length for logging
    const transcriptLength = transcript.length;
    console.log(`Processing transcript with ${transcriptLength} segments`);

    // Check if Google API key is available
    if (!process.env.GOOGLE_API_KEY) {
      console.error('GOOGLE_API_KEY is not set in environment variables');
      return NextResponse.json(
        { error: 'API key configuration error' },
        { status: 500 }
      );
    }

    console.log('Using Google API with key:', process.env.GOOGLE_API_KEY.substring(0, 5) + '...');

    // Determine the prompt based on whether there's a specific request
    let promptText;

    if (specificRequest) {
      // Custom prompt for specific requests
      promptText = `You are an expert video content analyzer with the ability to extract specific information from video transcripts.

I have a YouTube video with ID: ${videoId}
The user has requested: "${specificRequest}"

Below is the transcript with timestamps. Please focus specifically on what the user requested.
Include relevant timestamps in your response to help the user navigate to the important parts of the video.

Format your response in markdown with clear sections and use timestamps like [MM:SS] when referring to specific parts of the video.
If the request asks for specific information that isn't in the transcript, clearly state that.

TRANSCRIPT WITH TIMESTAMPS:
${transcriptWithTimestamps}`;
    } else {
      // Default comprehensive analysis prompt
      promptText = `You are an expert video content analyzer. Your task is to analyze video transcripts and provide insightful, well-structured summaries.

Format your response in markdown with the following sections:
1. **Summary**: A concise 2-3 sentence overview of what the video is about
2. **Key Points**: 3-5 main ideas or arguments presented in the video with timestamps [MM:SS]
3. **Insights**: 2-3 deeper observations or implications from the content
4. **Highlights**: 3-5 notable moments in the video with their timestamps [MM:SS]
5. **Audience**: Who would find this video most valuable
6. **Conclusion**: A brief closing thought

Keep your analysis professional, clear, and easy to read. Use headings (##) for each section.
Include timestamps [MM:SS] when referring to specific parts of the video to help the user navigate to important moments.

TRANSCRIPT WITH TIMESTAMPS:
${transcriptWithTimestamps}`;
    }

    console.log('Calling Gemini API with Flash Pro model...');

    // Add timeout and retry logic for the API call optimized for Vercel
    const fetchWithRetry = async (url: string, options: any, retries = 2, timeout = 8000) => {
      // Use a shorter timeout for Vercel serverless functions (10s limit on hobby plan)
      // We use 8 seconds to leave some buffer for processing the response
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.log('Request timed out after', timeout, 'ms');
      }, timeout);

      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        clearTimeout(timeoutId);

        // Check if this was a timeout error
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Request timed out. The analysis is taking too long. Please try with a shorter video or a more specific request.');
        }

        if (retries <= 1) throw error;

        console.log(`Fetch attempt failed, retrying... (${retries - 1} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait 0.5 second before retrying
        return fetchWithRetry(url, options, retries - 1, timeout);
      }
    };

    let response;
    try {
      response = await fetchWithRetry(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': process.env.GOOGLE_API_KEY
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: promptText
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: 1000,
              topK: 40,
              topP: 0.95
            }
          })
        }
      );
    } catch (fetchError) {
      console.error('Error calling Gemini API:', fetchError);
      throw new Error(`Failed to call Gemini API: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`);
    }

    console.log('Gemini API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error response:', JSON.stringify(errorData, null, 2));
      throw new Error(errorData.error?.message || 'Failed to analyze transcript');
    }

    const data = await response.json();
    console.log('Gemini API response structure:', JSON.stringify(Object.keys(data), null, 2));

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts) {
      console.error('Unexpected Gemini API response structure:', JSON.stringify(data, null, 2));
      throw new Error('Unexpected API response format');
    }

    const analysis = data.candidates[0].content.parts[0].text;
    console.log('Analysis generated successfully, length:', analysis.length);

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Error analyzing transcript:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error details:', errorMessage);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');

    // Check if it's a Gemini API error
    if (errorMessage.includes('models/') && errorMessage.includes('not found')) {
      return NextResponse.json(
        {
          error: 'Gemini API model error',
          details: 'The specified model is not available. Please check your Gemini API key and model configuration.',
          originalError: errorMessage
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to analyze transcript', details: errorMessage },
      { status: 500 }
    );
  }
}