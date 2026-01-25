/**
 * Comic Generator using OpenAI DALL-E 3
 * 
 * This service generates comic panels using OpenAI's DALL-E 3 model.
 * DALL-E 3 produces high-quality, detailed images perfect for comic creation.
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true,
});

export interface ComicPanel {
  panelNumber: number;
  description: string;
  imageUrl: string;
  status: 'generated' | 'processing' | 'error';
}

export interface ComicGenerationOptions {
  style?: 'comic' | 'manga' | 'graphic_novel' | 'cartoon' | 'watercolor';
  quality?: 'standard' | 'hd';
  size?: '1024x1024' | '1792x1024' | '1024x1792';
}

export interface GeneratedStory {
  title: string;
  narrative: string;
  panelCaptions: string[];
}

/**
 * Generate story content using GPT-4, optionally aware of uploaded photos
 */
export async function generateStoryContent(
  description: string,
  numPanels: number,
  photoDescriptions?: string[]
): Promise<GeneratedStory> {
  try {
    console.log(`\n📖 STORY GENERATION PHASE:`);
    console.log(`Input: "${description.substring(0, 100)}..."`);
    console.log(`Panels requested: ${numPanels}`);
    console.log(`Photo descriptions available: ${photoDescriptions ? photoDescriptions.length : 0}`);
    
    const photoContext = photoDescriptions && photoDescriptions.length > 0
      ? `\n\n🎯 CRITICAL INSTRUCTIONS FOR PHOTO USAGE:\nThe user has uploaded ${photoDescriptions.length} reference photo(s). These photos contain the MAIN CHARACTER(S) of your story. You MUST:\n1) Identify who/what is in these photos from the descriptions below\n2) Make them the PROTAGONISTS of your story - they are the stars\n3) Write the narrative and EVERY SINGLE caption featuring these characters\n4) Give them names if they don't have them, or use the names from the photos\n5) Describe their actions, dialogue, and emotions in your captions\n\nREFERENCE PHOTOS:\n${photoDescriptions.map((desc, idx) => `PHOTO ${idx + 1}:\n${desc}`).join('\n\n')}\n\nYour story MUST feature these characters prominently in every panel!`
      : '';
    
    console.log(`Photo context being used: ${photoContext ? 'YES' : 'NO'}`);

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a creative comic book writer. Create engaging, vivid narratives with dramatic dialogue and descriptions perfect for visual storytelling. Write captions as if they would appear in speech bubbles or narrative boxes in a real comic book. IMPORTANT: Write in the SAME LANGUAGE as the user\'s input story.',
        },
        {
          role: 'user',
          content: `Based on this user request, create a comic book story IN THE SAME LANGUAGE as the input:

"${description}"${photoContext}

Generate:
1. A compelling title (max 60 characters)
2. A full narrative story (200-400 words) with dramatic dialogue and vivid descriptions
3. Exactly ${numPanels} short, punchy captions (dialogue or narration) that will appear in speech bubbles on each panel - write them as natural comic book text without labels. EACH CAPTION MUST MENTION OR SHOW THE CHARACTER(S) FROM THE UPLOADED PHOTOS.

IMPORTANT: Write everything (title, narrative, and captions) in the SAME LANGUAGE as the input story above.

Format your response as JSON:
{
  "title": "Story Title",
  "narrative": "Full story text with dialogue...",
  "panelCaptions": ["First panel dialogue or narration", "Second panel dialogue or narration", "Third panel dialogue or narration", ...]
}

Example panelCaptions format for a parrot story:
["The green parrot awakens as dawn breaks over the jungle.", "I knew this day would change everything...", "Suddenly, the parrot spotted a mysterious figure!"]`,
        },
      ],
      temperature: 0.8,
      max_tokens: 1500,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No story content generated');
    }

    const storyData = JSON.parse(content) as GeneratedStory;
    
    // Validate the response
    if (!storyData.title || !storyData.narrative || !storyData.panelCaptions) {
      throw new Error('Invalid story format received');
    }
    
    // Log the generated captions to verify they include character references
    console.log(`\n📖 STORY CONTENT GENERATED:\nTitle: ${storyData.title}\n`);
    console.log('Panel Captions:');
    storyData.panelCaptions.forEach((caption, idx) => {
      console.log(`  Panel ${idx + 1}: ${caption}`);
    });
    
    return storyData;
  } catch (error: any) {
    console.error('Story generation error:', error);
    throw new Error(`Failed to generate story: ${error.message}`);
  }
}

/**
 * Analyze story and create comic panel descriptions
 */
export function createPanelDescriptions(
  story: string,
  photoCount: number,
  requestedPanels?: number
): string[] {
  // Use requested number of panels or determine optimal number (4-8 based on story length and photos)
  let numPanels: number;
  
  if (requestedPanels) {
    numPanels = Math.max(4, Math.min(requestedPanels, 8)); // Clamp between 4-8
  } else {
    const storyLength = story.trim().length;
    if (storyLength < 200) {
      numPanels = 4;
    } else if (storyLength < 500) {
      numPanels = 6;
    } else {
      numPanels = 8;
    }
    // Adjust based on photo count
    numPanels = Math.max(numPanels, Math.min(photoCount, 8));
  }
  
  // Split story into meaningful segments
  const sentences = story.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const panels: string[] = [];
  
  if (sentences.length === 0) {
    // Fallback if no proper sentences
    for (let i = 0; i < numPanels; i++) {
      panels.push(`Panel ${i + 1}: ${story.substring(0, 100)}`);
    }
    return panels;
  }
  
  // Distribute sentences across panels
  const sentencesPerPanel = Math.max(1, Math.floor(sentences.length / numPanels));
  
  for (let i = 0; i < numPanels; i++) {
    const startIdx = i * sentencesPerPanel;
    const endIdx = Math.min(startIdx + sentencesPerPanel, sentences.length);
    const panelSentences = sentences.slice(startIdx, endIdx);
    
    if (panelSentences.length === 0 && i > 0) {
      // Reuse last segment if we run out
      panels.push(panels[panels.length - 1]);
      continue;
    }
    
    const panelText = panelSentences.join('. ').trim();
    panels.push(panelText || story.substring(0, 100));
  }
  
  return panels;
}

/**
 * Analyze uploaded photos using GPT-4O (Vision) to describe their content
 */
export async function analyzePhotos(photoUrls: string[]): Promise<string[]> {
  if (!photoUrls.length) {
    console.log('analyzePhotos: No URLs provided');
    return [];
  }
  
  try {
    const photoDescriptions: string[] = [];
    
    for (let idx = 0; idx < photoUrls.length; idx++) {
      const photoUrl = photoUrls[idx];
      if (!photoUrl) {
        console.log(`Skipping empty photo URL at index ${idx}`);
        continue;
      }
      
      try {
        console.log(`\n📷 Starting analysis of photo ${idx + 1}/${photoUrls.length}...`);
        console.log(`Photo URL type: ${photoUrl.startsWith('data:') ? 'data URL' : 'external URL'}`);
        
        const response = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `Analyze this photo and provide a detailed description for comic book generation. CRITICAL REQUIREMENTS:
1) Identify the MAIN CHARACTER or SUBJECT in the image - this is essential
2) Describe them vividly: appearance, color, distinctive features, clothing/accessories, expression, pose
3) Name or identify what they are (animal species, profession, character type, etc.)
4) Describe the setting/environment
5) Any action or activity they're engaged in

Your description will be used to ensure this character/subject appears consistently in generated comic panels. Be specific and vivid so the subject can be easily recreated in artwork.`,
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: photoUrl,
                  },
                },
              ],
            },
          ],
          max_tokens: 400,
        });
        
        const description = response.choices[0]?.message?.content;
        if (description && typeof description === 'string') {
          console.log(`✅ Photo ${idx + 1} analyzed successfully`);
          console.log(`Photo ${idx + 1} description: ${description.substring(0, 150)}...`);
          photoDescriptions.push(description);
        } else {
          console.warn(`❌ Photo ${idx + 1}: No description returned from GPT-4O`);
        }
      } catch (photoError: any) {
        console.error(`❌ Failed to analyze photo ${idx + 1}:`, photoError.message || photoError);
        if (photoError.response) {
          console.error('API Response error:', photoError.response.status, photoError.response.data);
        }
      }
    }
    
    console.log(`\n✅ Analysis complete. Got ${photoDescriptions.length} descriptions from ${photoUrls.length} photos`);
    return photoDescriptions;
  } catch (error: any) {
    console.error('❌ Photo analysis failed:', error.message || error);
    if (error.response) {
      console.error('API error details:', error.response.data);
    }
    return [];
  }
}

/**
 * Generate detailed DALL-E prompts for each panel
 */
export function createDallePrompts(
  panelDescriptions: string[],
  style: string = 'comic',
  photoDescriptions: string[] = []
): string[] {
  const styleDescriptions: Record<string, string> = {
    comic: 'vibrant comic book style with bold lines, dynamic composition, saturated colors, and dramatic lighting',
    manga: 'Japanese manga style with expressive characters, speed lines, screen tones, and detailed backgrounds',
    graphic_novel: 'mature graphic novel style with realistic proportions, atmospheric lighting, detailed textures, and cinematic framing',
    cartoon: 'playful cartoon style with exaggerated features, bright colors, simple shapes, and energetic poses',
    watercolor: 'watercolor illustration style with soft edges, flowing colors, artistic brushstrokes, and gentle lighting',
  };
  
  const styleDesc = styleDescriptions[style] || styleDescriptions.comic;
  
  // Create detailed instruction for including photo subjects
  // Extract key subjects from photo descriptions for clearer reference
  let photoContext = '';
  if (photoDescriptions.length > 0) {
    const photoSummary = photoDescriptions
      .map(desc => {
        // Extract main subject and key details from analysis
        return desc.substring(0, 200); // Use first 200 chars of detailed analysis
      })
      .join(' | ');
    
    photoContext = `\n**CRITICAL - YOU MUST INCLUDE THE FOLLOWING SUBJECT(S) FROM UPLOADED PHOTOS IN THIS PANEL:**\n${photoSummary}\n\nThese are the main character(s)/subject(s) of the story. They MUST appear prominently and be clearly recognizable in this panel.`; 
  }
  
  return panelDescriptions.map((description, index) => {
    const isFirst = index === 0;
    const isLast = index === panelDescriptions.length - 1;
    
    let prompt = '';
    
    // CRITICAL: Explicitly tell DALL-E to NOT generate ANY text in the image
    const noTextInstruction = `EXTREMELY IMPORTANT - ABSOLUTELY NO TEXT OF ANY KIND IN THIS IMAGE:
- NO WORDS
- NO LETTERS
- NO NUMBERS
- NO SPEECH BUBBLES
- NO DIALOGUE BOXES
- NO NARRATIVE CAPTIONS
- NO SOUND EFFECTS
- NO LABELS
- NO TEXT IN ANY FORM WHATSOEVER
Generate ONLY pure visual artwork with no text elements.`;
    
    // Build stronger photo inclusion instruction
    const photoInstructions = photoDescriptions.length > 0 
      ? `\n\n⚠️ CRITICAL CHARACTER REQUIREMENT:\nYou MUST include the following character(s) from uploaded reference photos in this exact panel:\n${photoDescriptions.map((desc, i) => `- Reference Photo ${i + 1}: ${desc.substring(0, 250)}${desc.length > 250 ? '...' : ''}`).join('\n')}\n\nThese characters MUST be prominently visible, clearly recognizable, and in the foreground or central focus of the panel. This is non-negotiable.`
      : '';
    
    if (isFirst) {
      prompt = `Establishing shot - comic book style with bold lines, vibrant colors, dynamic composition. Opening scene: ${description}${photoInstructions}\n\n${noTextInstruction}\n\nHigh quality, detailed artwork. REMEMBER: Zero text of any kind.`;
    } else if (isLast) {
      prompt = `Final resolution panel - comic book style with bold lines, vibrant colors, dynamic composition. Climactic scene: ${description}${photoInstructions}\n\n${noTextInstruction}\n\nHigh quality, detailed artwork. REMEMBER: Zero text of any kind.`;
    } else {
      prompt = `Action panel - comic book style with bold lines, vibrant colors, dynamic composition. Story scene: ${description}${photoInstructions}\n\n${noTextInstruction}\n\nHigh quality, detailed artwork. REMEMBER: Zero text of any kind.`;
    }
    
    // Keep prompt under 4000 chars (DALL-E limit)
    return prompt.substring(0, 3900);
  });
}

/**
 * Generate a single panel using DALL-E 3
 */
export async function generatePanel(
  prompt: string,
  options: ComicGenerationOptions = {}
): Promise<string> {
  const {
    quality = 'hd',
    size = '1024x1024',
  } = options;
  
  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      quality,
      size,
      style: 'vivid', // 'vivid' for more artistic, 'natural' for more realistic
    });
    
    const imageUrl = response.data?.[0]?.url;
    
    if (!imageUrl) {
      throw new Error('No image URL returned from DALL-E');
    }
    
    return imageUrl;
  } catch (error: any) {
    console.error('DALL-E panel generation error:', error);
    
    // Check if it's a billing error
    if (error.code === 'billing_hard_limit_reached' || error.message?.includes('billing')) {
      throw new Error('OpenAI billing limit reached. Please add credits at https://platform.openai.com/account/billing');
    }
    
    throw new Error(`Failed to generate panel: ${error.message}`);
  }
}

/**
 * Generate a complete comic from story using OpenAI DALL-E 3
 */
export async function generateComic(
  storyOrGeneratedStory: string | GeneratedStory,
  photos: string[] = [],
  options: ComicGenerationOptions = {},
  numPanels?: number
): Promise<ComicPanel[]> {
  const { style = 'comic' } = options;
  
  // Check if we received a GeneratedStory object or a plain string
  const isGeneratedStory = typeof storyOrGeneratedStory === 'object' && 'panelCaptions' in storyOrGeneratedStory;
  
  // Validate inputs
  if (!storyOrGeneratedStory) {
    throw new Error('Story cannot be empty');
  }
  
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }
  
  console.log(`Generating comic with ${photos.length} reference photos`);
  console.log(`Using ${isGeneratedStory ? 'GPT-generated' : 'manual'} panel descriptions`);
  console.log(`Requested panels: ${numPanels || 'auto'}`);
  
  // Analyze uploaded photos to understand their content
  let photoDescriptions: string[] = [];
  if (photos.length > 0) {
    console.log(`Analyzing ${photos.length} uploaded photos...`);
    try {
      photoDescriptions = await analyzePhotos(photos);
      console.log(`Successfully analyzed photos. Got ${photoDescriptions.length} descriptions`);
      if (photoDescriptions.length > 0) {
        console.log('Photo descriptions:', photoDescriptions.map((d, i) => `[Photo ${i+1}]: ${d.substring(0, 100)}...`));
      } else {
        console.warn('Photo analysis returned empty descriptions!');
      }
    } catch (analysisError: any) {
      console.error('Error analyzing photos:', analysisError.message || analysisError);
      console.warn('Will proceed without photo context in DALLE prompts');
    }
  }
  
  // Use panel captions from GPT-4 if available, otherwise create from story text
  const panelDescriptions = isGeneratedStory 
    ? storyOrGeneratedStory.panelCaptions 
    : createPanelDescriptions(storyOrGeneratedStory, photos.length, numPanels);
  console.log(`Creating ${panelDescriptions.length} panels`);
  console.log('Panel descriptions:', panelDescriptions);
  
  // Generate DALL-E prompts based on the descriptions, including photo context
  const dallePrompts = createDallePrompts(panelDescriptions, style, photoDescriptions);
  
  // Log the DALLE prompts to verify they include photo context
  console.log(`\n🎨 DALLE PROMPT GENERATION:\nCreated ${dallePrompts.length} prompts with ${photoDescriptions.length > 0 ? photoDescriptions.length + ' photo references' : 'no photo context'}`);
  if (photoDescriptions.length > 0) {
    console.log('Photo descriptions being passed to DALLE:');
    photoDescriptions.forEach((desc, idx) => {
      console.log(`  Photo ${idx + 1}: ${desc.substring(0, 100)}...`);
    });
  }
  
  // Generate each panel
  const panels: ComicPanel[] = [];
  
  for (let i = 0; i < dallePrompts.length; i++) {
    try {
      console.log(`Generating panel ${i + 1}/${dallePrompts.length}...`);
      
      const imageUrl = await generatePanel(dallePrompts[i], options);
      
      panels.push({
        panelNumber: i + 1,
        description: panelDescriptions[i],
        imageUrl,
        status: 'generated',
      });
      
      // Add small delay to avoid rate limiting (DALL-E allows ~50 requests/min)
      if (i < dallePrompts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    } catch (error: any) {
      console.error(`Failed to generate panel ${i + 1}:`, error);
      
      panels.push({
        panelNumber: i + 1,
        description: panelDescriptions[i],
        imageUrl: '',
        status: 'error',
      });
      
      // Continue generating other panels even if one fails
    }
  }
  
  return panels;
}

/**
 * Regenerate a specific panel with a different prompt or style
 */
export async function regeneratePanel(
  panelNumber: number,
  description: string,
  options: ComicGenerationOptions = {}
): Promise<ComicPanel> {
  const { style = 'comic' } = options;
  const prompt = createDallePrompts([description], style)[0];
  
  try {
    const imageUrl = await generatePanel(prompt, options);
    
    return {
      panelNumber,
      description,
      imageUrl,
      status: 'generated',
    };
  } catch (error: any) {
    return {
      panelNumber,
      description,
      imageUrl: '',
      status: 'error',
    };
  }
}

/**
 * Generate a variation of an existing image (using DALL-E edit if needed)
 */
export async function createVariation(
  imageUrl: string,
  modifications: string
): Promise<string> {
  // Note: DALL-E 3 doesn't support variations directly
  // This would require DALL-E 2 or a different approach
  // For now, we'll generate a new image with the modification in the prompt
  
  const prompt = `${modifications}. High quality, detailed artwork, comic book style.`;
  return generatePanel(prompt);
}
