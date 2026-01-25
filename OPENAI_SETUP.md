# OpenAI DALL-E 3 Integration Guide

This guide will help you set up OpenAI DALL-E 3 for comic generation in the Comico application.

## Prerequisites

- OpenAI account
- Node.js and npm installed
- Comico project set up

## Step 1: Create OpenAI Account

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in with your account
3. Complete any required verification steps

## Step 2: Get Your API Key

1. Navigate to [API Keys](https://platform.openai.com/api-keys)
2. Click **"Create new secret key"**
3. Give it a name (e.g., "Comico Generator")
4. **Copy the key immediately** - you won't be able to see it again!
5. Keep it secure - never commit it to version control

## Step 3: Add Credits to Your Account

1. Go to [Billing](https://platform.openai.com/account/billing)
2. Add a payment method
3. Purchase credits or set up automatic recharge
4. DALL-E 3 costs:
   - Standard quality (1024×1024): **$0.040 per image**
   - HD quality (1024×1024): **$0.080 per image**
   - HD quality (1024×1792 or 1792×1024): **$0.120 per image**

## Step 4: Configure Environment Variables

1. Create or update your `.env.local` file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=sk-proj-your_actual_api_key_here
   ```

## Step 5: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/create`
3. Upload photos and write a story
4. Click "Generate Comic"
5. The app will use DALL-E 3 to generate comic panels

## Features

### Available Styles

You can specify different artistic styles when generating comics:

- **comic** (default): Vibrant comic book style with bold lines and dynamic composition
- **manga**: Japanese manga style with expressive characters and speed lines
- **graphic_novel**: Mature, realistic style with atmospheric lighting
- **cartoon**: Playful cartoon style with exaggerated features
- **watercolor**: Soft watercolor illustration style

### Quality Options

- **Standard**: Good quality, faster generation, lower cost ($0.04/image)
- **HD**: Higher quality, more detailed, higher cost ($0.08/image)

### Panel Generation

- Automatically generates 4-8 panels based on story length
- Creates detailed prompts for each panel
- Handles opening shots, action sequences, and closing panels appropriately
- 1.5 second delay between generations to avoid rate limits

## Cost Estimation

Example comic generation costs:

| Panels | Quality | Cost per Comic |
|--------|---------|----------------|
| 4      | Standard | $0.16         |
| 6      | Standard | $0.24         |
| 8      | Standard | $0.32         |
| 4      | HD      | $0.32         |
| 6      | HD      | $0.48         |
| 8      | HD      | $0.64         |

## Rate Limits

OpenAI DALL-E 3 rate limits (as of 2026):
- **Tier 1**: 5 requests per minute
- **Tier 2**: 7 requests per minute  
- **Tier 3**: 7 requests per minute
- **Tier 4**: 15 requests per minute
- **Tier 5**: 50 requests per minute

Your tier increases with usage. The integration includes delays to stay within limits.

## Customization

### Change Default Style

Edit [lib/comicGenerator.ts](lib/comicGenerator.ts):

```typescript
const options: ComicGenerationOptions = {
  style: 'manga', // Change this
  quality: 'hd',
  size: '1024x1024',
};
```

### Adjust Panel Count

Modify `createPanelDescriptions()` in [lib/comicGenerator.ts](lib/comicGenerator.ts):

```typescript
if (storyLength < 200) {
  numPanels = 4;
} else if (storyLength < 500) {
  numPanels = 6;
} else {
  numPanels = 12; // Increase max panels
}
```

### Change Image Size

Update the API route in [app/api/generate-comic/route.ts](app/api/generate-comic/route.ts):

```typescript
const options: ComicGenerationOptions = {
  style: 'comic',
  quality: 'hd',
  size: '1792x1024', // Landscape format
};
```

## Troubleshooting

### "OPENAI_API_KEY environment variable is not set"

- Check that `.env.local` exists in your project root
- Verify the key is correctly formatted: `OPENAI_API_KEY=sk-proj-...`
- Restart your development server after adding the key

### "Insufficient credits"

- Go to [OpenAI Billing](https://platform.openai.com/account/billing)
- Add credits to your account
- Check your current balance and usage

### "Rate limit exceeded"

- Your account has hit the requests-per-minute limit
- Wait a minute and try again
- Consider upgrading to a higher tier for more capacity
- The integration already includes delays to prevent this

### "Invalid API key"

- Verify you copied the entire key correctly
- Make sure there are no extra spaces or characters
- Generate a new API key if needed
- Check the key hasn't been revoked

### Poor Image Quality

- Try using `quality: 'hd'` in the options
- Make your story descriptions more detailed
- Adjust the prompt generation in `createDallePrompts()`

## Security Best Practices

1. ✅ **Never commit your API key** - keep `.env.local` in `.gitignore`
2. ✅ **Use environment variables** - never hardcode keys in your code
3. ✅ **Monitor usage** - regularly check your OpenAI dashboard
4. ✅ **Set spending limits** - configure in OpenAI billing settings
5. ✅ **Rotate keys periodically** - generate new keys every few months
6. ✅ **Use separate keys** - different keys for development and production

## API Reference

### Main Functions

```typescript
// Generate a complete comic
const panels = await generateComic(story, photos, options);

// Generate a single panel
const imageUrl = await generatePanel(prompt, options);

// Regenerate a specific panel
const panel = await regeneratePanel(panelNumber, description, options);
```

### Options Interface

```typescript
interface ComicGenerationOptions {
  style?: 'comic' | 'manga' | 'graphic_novel' | 'cartoon' | 'watercolor';
  quality?: 'standard' | 'hd';
  size?: '1024x1024' | '1792x1024' | '1024x1792';
}
```

## Additional Resources

- [OpenAI DALL-E Documentation](https://platform.openai.com/docs/guides/images)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference/images)
- [OpenAI Pricing](https://openai.com/pricing)
- [OpenAI Community Forum](https://community.openai.com/)
- [Rate Limits Documentation](https://platform.openai.com/docs/guides/rate-limits)

## Advantages of DALL-E 3

✅ **High Quality**: State-of-the-art image generation  
✅ **Easy Setup**: Just need an API key, no complex OAuth  
✅ **Good Documentation**: Extensive examples and guides  
✅ **Reliable**: Stable service with good uptime  
✅ **Flexible**: Multiple sizes and quality options  
✅ **Safe**: Built-in content filtering and safety measures  

## Support

For OpenAI-specific issues:
- [OpenAI Help Center](https://help.openai.com/)
- [Community Forum](https://community.openai.com/)

For Comico application issues:
- Check the application logs in the terminal
- Review [README.md](./README.md)
