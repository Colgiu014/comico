import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not configured');
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    console.log('Analyzing photo with GPT-4o-mini...');

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Describe this image in detail for use in a comic book. Focus on: characters, setting, mood, and any notable objects or actions.',
            },
            {
              type: 'image_url',
              image_url: { url: imageUrl },
            },
          ],
        },
      ],
      max_tokens: 300,
    });

    const description = completion.choices[0]?.message?.content || '';
    console.log('Photo analysis complete:', description.substring(0, 100) + '...');
    return NextResponse.json({ description });
  } catch (error: any) {
    console.error('Photo analysis error:', error);
    console.error('Error details:', error.message, error.code, error.type);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze photo' },
      { status: 500 }
    );
  }
}
