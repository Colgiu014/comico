// Check OpenAI account status
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function checkStatus() {
  try {
    console.log('Checking OpenAI API status...\n');
    
    // Try to list models (this is a cheap API call)
    const models = await openai.models.list();
    console.log('✅ API Key is valid and working');
    console.log(`✅ Found ${models.data.length} models available\n`);
    
    // Check if DALL-E 3 is available
    const hasDallE3 = models.data.some(m => m.id === 'dall-e-3');
    console.log(`DALL-E 3 available: ${hasDallE3 ? '✅ Yes' : '❌ No'}\n`);
    
    console.log('To check your billing and credits:');
    console.log('👉 Visit: https://platform.openai.com/account/billing/overview');
    console.log('👉 Check usage: https://platform.openai.com/account/usage\n');
    
    console.log('If you just added credits, they may take 5-10 minutes to activate.');
    console.log('Try refreshing the billing page to see if credits are showing.\n');
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    
    if (error.status === 401) {
      console.error('\n⚠️  Your API key is invalid or has been revoked.');
      console.error('Generate a new one at: https://platform.openai.com/api-keys');
    } else if (error.code === 'billing_hard_limit_reached') {
      console.error('\n⚠️  Billing limit reached. This means:');
      console.error('   1. You need to add credits to your account');
      console.error('   2. OR credits were just added but haven\'t activated yet (wait 5-10 min)');
      console.error('   3. OR you hit your hard spending limit\n');
      console.error('Check your billing at: https://platform.openai.com/account/billing');
    }
  }
}

checkStatus();
