/**
 * Client-side comic generation - calls Next.js API routes
 */

import { uploadPhotoToStorage } from './firebaseService';

interface PhotoAnalysis {
  description: string;
}

interface StoryData {
  title: string;
  panels: Array<{
    panelNumber: number;
    description: string;
    dialogue: string;
    mood: string;
    composition: string;
  }>;
}

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
      try {
        console.log(`Uploading photo ${i + 1}/${photos.length}: ${photo.name} (${photo.size} bytes)`);
        const uploadedUrl = await uploadPhotoToStorage(photo, comicId, userId);
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

  // Analyze photos using API route
  const photoAnalyses: PhotoAnalysis[] = [];
  if (photoUrls.length > 0) {
    console.log('🖼️ Analyzing photos...');
    for (let i = 0; i < photoUrls.length; i++) {
      try {
        console.log(`Analyzing photo ${i + 1}/${photoUrls.length}...`);
        const response = await fetch('/api/analyze-photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: photoUrls[i] }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        photoAnalyses.push({ description: data.description });
        console.log(`✅ Photo ${i + 1} analyzed`);
      } catch (error: any) {
        console.error(`❌ Failed to analyze photo ${i + 1}:`, error.message);
        photoAnalyses.push({ description: 'A scene from the story' });
      }
    }
  }

  // Generate story using API route
  console.log('📖 Generating story...');
  const storyResponse = await fetch('/api/generate-story', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ story, photoAnalyses }),
  });

  if (!storyResponse.ok) {
    const error = await storyResponse.json();
    throw new Error(error.error || 'Failed to generate story');
  }

  const generatedStory: StoryData = await storyResponse.json();
  console.log(`✅ Story generated: "${generatedStory.title}"`);

  // Create comic panels (using photos directly since we're not generating images)
  const panels = generatedStory.panels.map((panel, index) => ({
    panelNumber: panel.panelNumber,
    description: panel.description,
    dialogue: panel.dialogue,
    imageUrl: photoUrls[index] || photoUrls[0], // Use corresponding photo or first photo as fallback
    status: 'completed',
  }));

  // Prepare comic data
  const comicData = {
    userId,
    title: generatedStory.title,
    story: JSON.stringify(generatedStory),
    photos: photoUrls,
    selectedPlan: selectedPlan || 'Pro Comic',
    generatedComicData: JSON.stringify({
      story: generatedStory,
      panels,
      totalPages: Math.ceil(panels.length / 2),
      createdAt: new Date().toISOString(),
      generatedWith: 'OpenAI GPT-4',
      style: style || 'photo-comic',
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
