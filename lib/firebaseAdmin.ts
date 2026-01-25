/**
 * Server-side Firebase Admin SDK service
 * For use in API routes and server components only
 */

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  try {
    // Try to use service account if available
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      initializeApp({
        credential: cert(serviceAccount),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
      console.log('✅ Firebase Admin initialized with service account');
    } else {
      // For development: use application default credentials
      const { getAuth } = await import('firebase-admin/auth');
      initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
      console.log('✅ Firebase Admin initialized with application default credentials');
      console.log('   For production, set FIREBASE_SERVICE_ACCOUNT environment variable');
    }
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
    throw error;
  }
}

const adminDb = getFirestore();

export interface ComicData {
  id: string;
  userId: string;
  title?: string;
  story: string;
  photos: string[];
  selectedPlan: string;
  generatedComicData?: string;
  status: 'draft' | 'generating' | 'generated' | 'partial' | 'ordered';
  panels?: any[];
  createdAt: any;
  updatedAt: any;
}

/**
 * Update comic data in Firestore (server-side)
 */
export async function updateComicServer(
  comicId: string,
  data: Partial<ComicData>
): Promise<void> {
  try {
    // Skip if Firebase Admin isn't properly configured
    if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      console.warn('Firebase project ID not configured, skipping update');
      return;
    }
    
    const comicRef = adminDb.collection('comics').doc(comicId);
    
    await comicRef.update({
      ...data,
      updatedAt: new Date(),
    });
    
    console.log(`✅ Comic ${comicId} updated successfully`);
  } catch (error: any) {
    console.error(`Failed to update comic ${comicId}:`, error.message);
    // Don't throw - this is non-critical, the client will update Firebase
  }
}

/**
 * Get comic data from Firestore (server-side)
 */
export async function getComicServer(comicId: string): Promise<ComicData | null> {
  try {
    const comicRef = adminDb.collection('comics').doc(comicId);
    const doc = await comicRef.get();
    
    if (!doc.exists) {
      return null;
    }
    
    return { id: doc.id, ...doc.data() } as ComicData;
  } catch (error: any) {
    console.error(`Failed to get comic ${comicId}:`, error);
    return null;
  }
}

/**
 * Create a new comic document (server-side)
 */
export async function createComicServer(
  comicId: string,
  data: Omit<ComicData, 'id' | 'createdAt' | 'updatedAt'>
): Promise<void> {
  try {
    const comicRef = adminDb.collection('comics').doc(comicId);
    
    await comicRef.set({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    console.log(`Comic ${comicId} created successfully`);
  } catch (error: any) {
    console.error(`Failed to create comic ${comicId}:`, error);
    throw new Error(`Failed to create comic: ${error.message}`);
  }
}
