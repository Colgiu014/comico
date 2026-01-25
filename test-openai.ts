// Quick test script to verify OpenAI API connection
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testConnection() {
  try {
    console.log('Testing OpenAI API connection...');
    console.log('API Key configured:', !!process.env.OPENAI_API_KEY);
    
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: 'A simple red circle on white background',
      n: 1,
      size: '1024x1024',
      quality: 'standard',
    });
    
    console.log('✅ Success! Generated image:', response.data?.[0]?.url);
    return true;
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
    return false;
  }
}

testConnection();
