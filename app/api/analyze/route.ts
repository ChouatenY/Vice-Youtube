import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { transcript } = await request.json();
    
    if (!transcript || transcript.length === 0) {
      return NextResponse.json(
        { error: 'Transcript is required' },
        { status: 400 }
      );
    }

    // Prepare the transcript text for analysis
    const transcriptText = transcript
      .map((entry: { text: string }) => entry.text)
      .join(' ');

    // Use DeepSeek AI API for analysis
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `You are an expert video content analyzer. Your task is to analyze video transcripts and provide insightful, well-structured summaries.

Format your response in markdown with the following sections:
1. **Summary**: A concise 2-3 sentence overview of what the video is about
2. **Key Points**: 3-5 main ideas or arguments presented in the video
3. **Insights**: 2-3 deeper observations or implications from the content
4. **Audience**: Who would find this video most valuable
5. **Conclusion**: A brief closing thought

Keep your analysis professional, clear, and easy to read. Use headings (##) for each section.`
          },
          {
            role: 'user',
            content: `Please analyze this video transcript and provide a comprehensive analysis: ${transcriptText}`
          }
        ],
        temperature: 0.5,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to analyze transcript');
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Error analyzing transcript:', error);
    return NextResponse.json(
      { error: 'Failed to analyze transcript' },
      { status: 500 }
    );
  }
} 