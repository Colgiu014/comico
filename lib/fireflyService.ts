/**
 * Adobe Firefly API Integration Service
 * 
 * This service integrates with Adobe Firefly API for AI-powered comic generation.
 * You'll need to obtain API credentials from Adobe Developer Console:
 * https://developer.adobe.com/firefly-services/
 */

import axios from 'axios';

// Adobe Firefly API Configuration
const FIREFLY_API_BASE = 'https://firefly-api.adobe.io';
const FIREFLY_CLIENT_ID = process.env.ADOBE_CLIENT_ID || '';
const FIREFLY_CLIENT_SECRET = process.env.ADOBE_CLIENT_SECRET || '';
const FIREFLY_ACCESS_TOKEN = process.env.ADOBE_ACCESS_TOKEN || '';

interface FireflyGenerateRequest {
  prompt: string;
  contentClass?: 'photo' | 'art';
  size?: { width: number; height: number };
  stylePresets?: string[];
  negativePrompt?: string;
}

interface FireflyGenerateResponse {
  size: { width: number; height: number };
  outputs: Array<{
    seed: number;
    image: {
      url: string;
    };
  }>;
}

interface ComicPanel {
  description: string;
  imageUrl: string;
  status: 'generated' | 'processing' | 'error';
}

/**
 * Get Adobe OAuth access token
 */
async function getAccessToken(): Promise<string> {
  // If access token is provided in env, use it
  if (FIREFLY_ACCESS_TOKEN) {
    return FIREFLY_ACCESS_TOKEN;
  }

  // Otherwise, get it via OAuth (requires client credentials)
  if (!FIREFLY_CLIENT_ID || !FIREFLY_CLIENT_SECRET) {
    throw new Error('Adobe Firefly API credentials not configured');
  }

  try {
    const response = await axios.post(
      'https://ims-na1.adobelogin.com/ims/token/v3',
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: FIREFLY_CLIENT_ID,
        client_secret: FIREFLY_CLIENT_SECRET,
        scope: 'openid,AdobeID,firefly_api,ff_apis',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error('Failed to get Adobe access token:', error);
    throw new Error('Failed to authenticate with Adobe Firefly API');
  }
}

/**
 * Generate an image using Adobe Firefly
 */
export async function generateFireflyImage(
  request: FireflyGenerateRequest
): Promise<string> {
  const accessToken = await getAccessToken();

  try {
    const response = await axios.post<FireflyGenerateResponse>(
      `${FIREFLY_API_BASE}/v2/images/generate`,
      {
        prompt: request.prompt,
        contentClass: request.contentClass || 'art',
        size: request.size || { width: 1024, height: 1024 },
        ...(request.stylePresets && { style: { presets: request.stylePresets } }),
        ...(request.negativePrompt && { negativePrompt: request.negativePrompt }),
        n: 1, // Number of images to generate
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-api-key': FIREFLY_CLIENT_ID,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.data.outputs && response.data.outputs.length > 0) {
      return response.data.outputs[0].image.url;
    }

    throw new Error('No image generated');
  } catch (error: any) {
    console.error('Firefly image generation error:', error.response?.data || error.message);
    throw new Error(`Failed to generate image: ${error.response?.data?.message || error.message}`);
  }
}

/**
 * Analyze story and photos to create comic panel descriptions
 */
export function createComicPanelDescriptions(
  story: string,
  photoCount: number
): string[] {
  // Split the story into panels (typically 4-8 panels for a comic)
  const numPanels = Math.min(8, Math.max(4, photoCount));
  
  // Create panel descriptions based on story arc
  const panels: string[] = [];
  
  // This is a simplified version - in production you'd use an LLM to analyze the story
  const storyParts = story.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const panelsPerPart = Math.ceil(numPanels / Math.max(1, storyParts.length));
  
  for (let i = 0; i < numPanels; i++) {
    const partIndex = Math.min(Math.floor(i / panelsPerPart), storyParts.length - 1);
    const part = storyParts[partIndex] || story;
    
    // Create a descriptive prompt for Firefly
    let panelPrompt = '';
    if (i === 0) {
      panelPrompt = `Comic book style illustration: ${part.trim()}. Opening scene with dramatic lighting, vibrant colors, detailed art style.`;
    } else if (i === numPanels - 1) {
      panelPrompt = `Comic book style illustration: ${part.trim()}. Final panel with resolution, satisfying composition, heroic angle.`;
    } else {
      panelPrompt = `Comic book style illustration: ${part.trim()}. Dynamic action scene with motion lines, expressive characters.`;
    }
    
    panels.push(panelPrompt);
  }
  
  return panels;
}

/**
 * Generate a complete comic from story and photos using Adobe Firefly
 */
export async function generateComic(
  story: string,
  photos: string[], // URLs or base64 encoded images
  stylePreset?: string
): Promise<ComicPanel[]> {
  // Create panel descriptions from the story
  const panelDescriptions = createComicPanelDescriptions(story, photos.length);
  
  // Generate each panel using Firefly
  const panels: ComicPanel[] = [];
  
  for (let i = 0; i < panelDescriptions.length; i++) {
    try {
      console.log(`Generating panel ${i + 1}/${panelDescriptions.length}...`);
      
      // Generate image for this panel
      const imageUrl = await generateFireflyImage({
        prompt: panelDescriptions[i],
        contentClass: 'art',
        size: { width: 1024, height: 1024 },
        stylePresets: stylePreset ? [stylePreset] : ['comic', 'graphic_novel'],
        negativePrompt: 'blurry, low quality, distorted, watermark, text',
      });
      
      panels.push({
        description: panelDescriptions[i],
        imageUrl,
        status: 'generated',
      });
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Failed to generate panel ${i + 1}:`, error);
      panels.push({
        description: panelDescriptions[i],
        imageUrl: '',
        status: 'error',
      });
    }
  }
  
  return panels;
}

/**
 * Upscale an image using Adobe Firefly (if available)
 */
export async function upscaleImage(imageUrl: string): Promise<string> {
  const accessToken = await getAccessToken();
  
  try {
    const response = await axios.post(
      `${FIREFLY_API_BASE}/v2/images/upscale`,
      {
        image: {
          url: imageUrl,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-api-key': FIREFLY_CLIENT_ID,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    
    return response.data.image.url;
  } catch (error: any) {
    console.error('Firefly upscale error:', error.response?.data || error.message);
    // Return original if upscale fails
    return imageUrl;
  }
}

/**
 * Apply style transfer to match photo references
 */
export async function applyStyleTransfer(
  sourceImageUrl: string,
  styleImageUrl: string
): Promise<string> {
  const accessToken = await getAccessToken();
  
  try {
    // Use Firefly's image-to-image generation with style reference
    const response = await axios.post(
      `${FIREFLY_API_BASE}/v2/images/generate`,
      {
        image: {
          source: {
            url: sourceImageUrl,
          },
        },
        style: {
          imageReference: {
            source: {
              url: styleImageUrl,
            },
          },
        },
        contentClass: 'art',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-api-key': FIREFLY_CLIENT_ID,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    
    return response.data.outputs[0].image.url;
  } catch (error: any) {
    console.error('Style transfer error:', error.response?.data || error.message);
    return sourceImageUrl;
  }
}
