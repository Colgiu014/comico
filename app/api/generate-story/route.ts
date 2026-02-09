import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { story, photoAnalyses } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not configured');
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    console.log('Generating story with GPT-4o-mini...');

    const prompt = `You are a creative comic book writer. Based on the following user story and photo descriptions, create an engaging comic book narrative.

User Story:
${story}

Photo Descriptions:
${photoAnalyses.map((p: any, i: number) => `Photo ${i + 1}: ${p.description}`).join('\n')}

Create a comic with ${photoAnalyses.length} panels, one for each photo. For each panel:
1. Write dialogue/narration that fits the photo
2. Describe the scene and mood
3. Suggest artistic style and framing

Return your response as a JSON object with this structure:
{
  "title": "Comic title",
  "panels": [
    {
      "panelNumber": 1,
      "description": "Scene description",
      "dialogue": "Character dialogue or narration",
      "mood": "Scene mood",
      "composition": "Camera angle and framing"
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a creative comic book writer. Always respond with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    const storyData = JSON.parse(content);
    console.log('Story generation complete:', storyData.title);
    return NextResponse.json(storyData);
  } catch (error: any) {
    console.error('Story generation error:', error);
    console.error('Error details:', error.message, error.code, error.type);
    return NextResponse.json(
      { error: error.message || 'Failed to generate story' },
      { status: 500 }
    );
  }
}
