# Adobe Firefly Integration Guide

This guide will help you set up Adobe Firefly API integration for comic generation in the Comico application.

## Prerequisites

- Adobe account (free to create)
- Access to Adobe Developer Console
- Node.js and npm installed
- Comico project set up

## Step 1: Create Adobe Developer Account

1. Go to [Adobe Developer Console](https://developer.adobe.com/console)
2. Sign in with your Adobe ID (or create a new account)
3. Accept the Developer Terms of Service

## Step 2: Create a New Project

1. Click **Create new project** in the Developer Console
2. Give your project a name (e.g., "Comico Generator")
3. Click **Create**

## Step 3: Add Firefly API

1. In your project, click **Add API**
2. Search for **Firefly Services** or **Firefly API**
3. Select **Firefly Services**
4. Choose **OAuth Server-to-Server** credential type
5. Click **Save configured API**

## Step 4: Get Your Credentials

### For Development (Access Token Method)

1. In your project, go to the **Credentials** section
2. Copy your **Client ID**
3. Generate an **Access Token** using the OAuth playground
4. Add to your `.env.local`:
   ```
   ADOBE_CLIENT_ID=your_client_id_here
   ADOBE_ACCESS_TOKEN=your_access_token_here
   ```

### For Production (OAuth Client Credentials)

1. In your project, go to **OAuth Server-to-Server** credentials
2. Copy your **Client ID**
3. Copy your **Client Secret**
4. Add to your `.env.local`:
   ```
   ADOBE_CLIENT_ID=your_client_id_here
   ADOBE_CLIENT_SECRET=your_client_secret_here
   ```

## Step 5: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and fill in your Adobe credentials:
   ```env
   # Adobe Firefly API
   ADOBE_CLIENT_ID=your_client_id
   ADOBE_CLIENT_SECRET=your_client_secret
   # OR use access token for quick testing
   ADOBE_ACCESS_TOKEN=your_access_token
   ```

## Step 6: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/create` in your browser
3. Upload photos and write a story
4. Click "Generate Comic"
5. The app will use Adobe Firefly to generate comic panels

## API Features Used

The integration uses the following Adobe Firefly API endpoints:

- **Text-to-Image Generation**: Creates comic panels from text prompts
- **Style Presets**: Applies comic book and graphic novel styles
- **Image Size Control**: Generates 1024x1024 images for optimal quality
- **Negative Prompts**: Filters out unwanted elements

## Pricing and Quotas

- Adobe Firefly API has usage-based pricing
- Check current pricing at [Adobe Firefly Pricing](https://developer.adobe.com/firefly-services/pricing/)
- Free tier available for development and testing
- Monitor your usage in the Developer Console

## Troubleshooting

### "Failed to authenticate with Adobe Firefly API"

- Check that your `ADOBE_CLIENT_ID` and `ADOBE_CLIENT_SECRET` are correct
- Verify that Firefly Services API is added to your project
- Ensure your access token hasn't expired

### "Failed to generate image"

- Check your API quota in the Developer Console
- Verify your prompt doesn't violate Adobe's content policy
- Check the console logs for detailed error messages

### Rate Limiting

- The service includes a 1-second delay between panel generations
- For production, consider implementing a queue system
- Monitor your rate limits in the Developer Console

## Advanced Configuration

### Custom Style Presets

Modify the `generateComic` function in `lib/fireflyService.ts` to use different styles:

```typescript
stylePresets: ['comic', 'graphic_novel', 'anime', 'watercolor']
```

### Adjusting Panel Count

The service automatically creates 4-8 panels based on story length. Adjust in `createComicPanelDescriptions`:

```typescript
const numPanels = Math.min(12, Math.max(6, photoCount));
```

### Image Quality

Change the output resolution in `generateFireflyImage`:

```typescript
size: { width: 2048, height: 2048 }  // Higher quality
```

## Security Best Practices

1. **Never commit credentials**: Keep `.env.local` in `.gitignore`
2. **Use environment variables**: Never hardcode API keys
3. **Rotate credentials**: Regularly regenerate access tokens
4. **Monitor usage**: Set up alerts for unusual API activity
5. **Use OAuth for production**: Client credentials are more secure than access tokens

## Additional Resources

- [Adobe Firefly API Documentation](https://developer.adobe.com/firefly-services/docs/)
- [Firefly API Reference](https://developer.adobe.com/firefly-services/docs/firefly-api/)
- [Adobe Developer Console](https://developer.adobe.com/console)
- [Firefly API Playground](https://developer.adobe.com/firefly-services/docs/playground/)

## Support

For issues specific to Adobe Firefly API:
- [Adobe Developer Forums](https://community.adobe.com/t5/developer/ct-p/ct-developer)
- [Adobe Support](https://developer.adobe.com/support/)

For Comico application issues:
- Check the application logs
- Review the [project documentation](./README.md)
