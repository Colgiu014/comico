/**
 * Client-side comic generation - calls OpenAI directly from the client
 * This avoids the need for server-side API routes in static export
 */

import { generateComic, generateStoryContent, ComicGenerationOptions, analyzePhotos } from './comicGenerator';
import { updateComicServer } from './firebaseAdmin';
import { uploadPhotoToStorage } from './firebaseService';

export async function generateComicClient(params: {
  comicId: string;
  story: string;
  photos: File[] | string[];
  style?: string;
  userId: string;
  selectedPlan: string;
}) {
  const { comicId, story, photos, style, userId, selectedPlan } = params;

  console.log('Generating comic client-side...');
  console.log(`Processing ${photos.length} photo files...`);
  
  // Upload photos to Firebase Storage and get download URLs
  const photoUrls: string[] = [];
  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    console.log(`Photo ${i}: type=${typeof photo}, isFile=${photo instanceof File}, isString=${typeof photo === 'string'}`);
    
    if (typeof photo === 'string') {
      // Already a URL
      console.log(`Photo ${i} is already a URL, using as-is`);
      photoUrls.push(photo);
    } else if (photo instanceof File) {
      // Try to upload file to Firebase Storage
      let uploadedUrl: string | null = null;
      
      try {
        console.log(`Uploading photo ${i + 1}/${photos.length}: ${photo.name} (${photo.size} bytes)`);
        uploadedUrl = await uploadPhotoToStorage(photo, comicId, userId);
        console.log(`Photo ${i + 1} uploaded to Firebase: ${uploadedUrl.substring(0, 80)}...`);
        photoUrls.push(uploadedUrl);
      } catch (uploadError: any) {
        console.warn(`Firebase upload failed for photo ${i + 1}: ${uploadError.message}`);
        console.warn('Falling back to data URL conversion...');
        
        // Fallback: convert to data URL if Firebase upload fails
        try {
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error('FileReader failed'));
            reader.readAsDataURL(photo);
          });
          console.log(`Photo ${i + 1} converted to data URL (length: ${dataUrl.length})`);
          photoUrls.push(dataUrl);
        } catch (dataUrlError: any) {
          console.error(`Failed to convert photo ${i + 1} to data URL:`, dataUrlError.message);
        }
      }
    } else {
      console.warn(`Photo ${i} is neither File nor string, skipping`);
    }
  }
  
  console.log(`Successfully processed ${photoUrls.length} photos for generation`);
  if (photoUrls.length > 0) {
    console.log(`Photo URLs:`, photoUrls.map((url, idx) => `[${idx}]: ${url.substring(0, 80)}...`));
  } else {
    console.warn('No photos available for generation');
  }
  
  // Configure generation options
  const options: ComicGenerationOptions = {
    style: (style as any) || 'comic',
    quality: 'hd',
    size: '1024x1024',
  };

  // Extract requested number of panels
  const panelMatch = story.match(/(\d+)\s*panel[eious]*/i);
  let numPanels: number;
  
  if (panelMatch) {
    numPanels = Math.max(4, Math.min(parseInt(panelMatch[1]), 8));
    console.log(`User requested ${panelMatch[1]} panels, using ${numPanels}`);
  } else {
    numPanels = story.length < 200 ? 4 : story.length < 500 ? 6 : 8;
    console.log(`Auto-determined ${numPanels} panels based on story length`);
  }

  // Analyze uploaded photos first so we can include them in story generation
  let photoDescriptions: string[] = [];
  if (photoUrls.length > 0) {
    console.log('\n🖼️ PHOTO ANALYSIS PHASE:');
    console.log(`Starting analysis of ${photoUrls.length} photos`);
    console.log(`Photo URLs to analyze:`, photoUrls.map((url, idx) => {
      if (url.startsWith('data:')) {
        return `[${idx}]: data URL (${url.length} bytes)`;
      } else {
        return `[${idx}]: ${url.substring(0, 100)}...`;
      }
    }));
    
    try {
      photoDescriptions = await analyzePhotos(photoUrls);
      console.log(`✅ Photo analysis complete. Got ${photoDescriptions.length} descriptions`);
      if (photoDescriptions.length > 0) {
        photoDescriptions.forEach((desc, idx) => {
          console.log(`\n📸 PHOTO ${idx + 1} ANALYSIS:\n${desc}\n`);
        });
      } else {
        console.warn('⚠️ Photo analysis returned empty descriptions!');
      }
    } catch (error: any) {
      console.error('❌ Photo analysis failed:', error.message || error);
      console.error('Full error:', error);
    }
  } else {
    console.warn('⚠️ No valid photos to analyze - proceeding without photo context');
  }
  
  // Generate story content using GPT-4, aware of the uploaded photos
  console.log('Generating story narrative...');
  console.log(`Using ${photoDescriptions.length > 0 ? photoDescriptions.length + ' photo descriptions' : 'no photo context'} for story generation`);
  const generatedStory = await generateStoryContent(story, numPanels, photoDescriptions);
  console.log(`Story generated: "${generatedStory.title}"`);

  // Generate comic panels using DALL-E 3 based on GPT-4 generated captions
  const panels = await generateComic(
    generatedStory,
    photoUrls || [],
    options,
    numPanels
  );

  // Prepare comic data
  const comicData = {
    userId,
    title: generatedStory.title,
    story: JSON.stringify(generatedStory),
    photos: photoUrls || [],
    selectedPlan: selectedPlan || 'Pro Comic',
    generatedComicData: JSON.stringify({
      story: generatedStory,
      panels: panels.map((panel) => ({
        panelNumber: panel.panelNumber,
        description: panel.description,
        imageUrl: panel.imageUrl,
        status: panel.status,
      })),
      totalPages: Math.ceil(panels.length / 4),
      createdAt: new Date().toISOString(),
      generatedWith: 'OpenAI DALL-E 3',
      style: options.style,
    }),
    status: 'generated' as const,
  };

  return {
    ...comicData,
    id: comicId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
