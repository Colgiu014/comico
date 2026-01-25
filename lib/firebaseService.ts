'use client';

import {
  collection,
  doc,
  setDoc,
  getDoc,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  Timestamp,
  orderBy,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage } from './firebase';

export interface ComicData {
  id: string;
  userId: string;
  title?: string;
  story: string;
  photos: string[]; // URLs
  selectedPlan: string;
  generatedComicData?: string;
  status: 'draft' | 'generating' | 'generated' | 'ordered';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface OrderData {
  id: string;
  userId: string;
  comicId: string;
  plan: string;
  amount: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentStatus: 'pending' | 'completed' | 'failed';
  stripePaymentId?: string;
  createdAt: Timestamp;
  estimatedDelivery: Timestamp;
}

// COMICS FUNCTIONS
export async function saveComic(userId: string, comicData: Omit<ComicData, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    if (!db) throw new Error('Firebase not initialized');
    
    const comicId = doc(collection(db, 'comics')).id;
    const now = Timestamp.now();

    const comic: ComicData = {
      ...comicData,
      id: comicId,
      userId,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(doc(db, 'comics', comicId), comic);
    return comicId;
  } catch (error) {
    console.error('Error saving comic:', error);
    throw error;
  }
}

export async function getComic(comicId: string) {
  try {
    if (!db) throw new Error('Firebase not initialized');
    
    const docSnap = await getDoc(doc(db, 'comics', comicId));
    if (docSnap.exists()) {
      return docSnap.data() as ComicData;
    }
    return null;
  } catch (error) {
    console.error('Error getting comic:', error);
    throw error;
  }
}

export async function getUserComics(userId: string) {
  try {
    if (!db) throw new Error('Firebase not initialized');
    
    const q = query(
      collection(db, 'comics'), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as ComicData);
  } catch (error) {
    console.error('Error getting user comics:', error);
    throw error;
  }
}

export async function updateComic(comicId: string, updates: Partial<ComicData>) {
  try {
    if (!db) throw new Error('Firebase not initialized');
    
    await updateDoc(doc(db, 'comics', comicId), {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating comic:', error);
    throw error;
  }
}

export async function deleteComic(comicId: string) {
  try {
    if (!db) throw new Error('Firebase not initialized');
    
    await deleteDoc(doc(db, 'comics', comicId));
  } catch (error) {
    console.error('Error deleting comic:', error);
    throw error;
  }
}

// ORDERS FUNCTIONS
export async function createOrder(userId: string, orderData: Omit<OrderData, 'id' | 'createdAt' | 'estimatedDelivery'>) {
  try {
    if (!db) throw new Error('Firebase not initialized');
    
    const orderId = doc(collection(db, 'orders')).id;
    const now = Timestamp.now();
    // Estimate delivery in 7 days
    const estimatedDelivery = new Timestamp(now.seconds + 7 * 24 * 60 * 60, 0);

    const order: OrderData = {
      ...orderData,
      id: orderId,
      userId,
      createdAt: now,
      estimatedDelivery,
    };

    await setDoc(doc(db, 'orders', orderId), order);
    return orderId;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export async function getOrder(orderId: string) {
  try {
    if (!db) throw new Error('Firebase not initialized');
    
    const docSnap = await getDoc(doc(db, 'orders', orderId));
    if (docSnap.exists()) {
      return docSnap.data() as OrderData;
    }
    return null;
  } catch (error) {
    console.error('Error getting order:', error);
    throw error;
  }
}

export async function getUserOrders(userId: string) {
  try {
    if (!db) throw new Error('Firebase not initialized');
    
    const q = query(collection(db, 'orders'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as OrderData);
  } catch (error) {
    console.error('Error getting user orders:', error);
    throw error;
  }
}

export async function updateOrder(orderId: string, updates: Partial<OrderData>) {
  try {
    if (!db) throw new Error('Firebase not initialized');
    
    await updateDoc(doc(db, 'orders', orderId), updates);
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
}

// STORAGE FUNCTIONS
export async function uploadImage(userId: string, file: File, comicId: string): Promise<string> {
  try {
    if (!storage) throw new Error('Firebase storage not initialized');
    
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `comics/${userId}/${comicId}/${fileName}`;
    const fileRef = ref(storage, filePath);

    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    return url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

export async function uploadMultipleImages(
  userId: string,
  files: File[],
  comicId: string
): Promise<string[]> {
  try {
    if (!storage) throw new Error('Firebase storage not initialized');
    
    const uploadPromises = files.map(file => uploadImage(userId, file, comicId));
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('Error uploading images:', error);
    throw error;
  }
}

export async function deleteImage(imageUrl: string) {
  try {
    if (!storage) throw new Error('Firebase storage not initialized');
    
    const fileRef = ref(storage, imageUrl);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}

export async function deleteComicImages(comicId: string, imageUrls: string[]) {
  try {
    if (!storage) throw new Error('Firebase storage not initialized');
    
    const deletePromises = imageUrls.map(url => deleteImage(url));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error deleting comic images:', error);
    throw error;
  }
}
/**
 * Upload a user photo to Firebase Storage for comic generation
 */
export async function uploadPhotoToStorage(
  file: File,
  comicId: string,
  userId: string
): Promise<string> {
  try {
    if (!storage) {
      throw new Error('Firebase storage not initialized');
    }

    // Generate a unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    const extension = file.name.split('.').pop() || 'jpg';
    const filename = `photo-${timestamp}-${random}.${extension}`;

    // Create storage path: comics/{userId}/{comicId}/{filename}
    const storageRef = ref(storage, `comics/${userId}/${comicId}/${filename}`);

    // Upload the file
    console.log(`Uploading to Firebase Storage: comics/${userId}/${comicId}/${filename}`);
    await uploadBytes(storageRef, file);

    // Get the download URL
    const downloadUrl = await getDownloadURL(storageRef);
    console.log('Download URL obtained:', downloadUrl.substring(0, 80) + '...');

    return downloadUrl;
  } catch (error) {
    console.error('Error uploading photo to storage:', error);
    throw error;
  }
}