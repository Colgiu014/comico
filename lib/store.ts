'use client';

import { create } from 'zustand';
import {
  saveComic,
  uploadMultipleImages,
  getComic,
  updateComic,
} from './firebaseService';

interface ComicState {
  // Local state
  photos: File[];
  story: string;
  selectedPlan: string;
  generatedComic: string | null;
  loading: boolean;
  error: string | null;
  comicId: string | null;
  userId: string;
  // Actions
  addPhotos: (photos: File[]) => void;
  removePhoto: (index: number) => void;
  setStory: (story: string) => void;
  setPlan: (plan: string) => void;
  setGeneratedComic: (comic: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  // Firebase actions
  saveToFirebase: (userId: string) => Promise<string>;
  loadFromFirebase: (comicId: string) => Promise<void>;
  // Reset
  reset: () => void;
}

export const useComicStore = create<ComicState>((set, get) => ({
  // Initial state
  photos: [],
  story: '',
  selectedPlan: 'Pro Comic',
  generatedComic: null,
  loading: false,
  error: null,
  comicId: null,
  userId: typeof window !== 'undefined' ? (window.localStorage.getItem('comico_user_id') || (() => {
    const id = 'user-' + Math.random().toString(36).substr(2, 9);
    window.localStorage.setItem('comico_user_id', id);
    return id;
  })()) : 'user-anonymous',

  // Local actions
  addPhotos: (photos) =>
    set((state) => ({
      photos: [...state.photos, ...photos],
    })),

  removePhoto: (index) =>
    set((state) => ({
      photos: state.photos.filter((_, i) => i !== index),
    })),

  setStory: (story) => set({ story }),
  setPlan: (plan) => set({ selectedPlan: plan }),
  setGeneratedComic: (comic) => set({ generatedComic: comic }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Firebase actions
  saveToFirebase: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      const state = get();

      // Upload photos to Firebase Storage
      const photoUrls = await uploadMultipleImages(
        userId,
        state.photos,
        `temp-${Date.now()}`
      );

      // Save comic to Firestore
      const comicId = await saveComic(userId, {
        story: state.story,
        photos: photoUrls,
        selectedPlan: state.selectedPlan,
        status: 'draft',
        userId,
      });

      set({ comicId, loading: false });
      return comicId;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to save comic';
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  loadFromFirebase: async (comicId: string) => {
    try {
      set({ loading: true, error: null });
      const comic = await getComic(comicId);

      if (comic) {
        set({
          comicId,
          story: comic.story,
          photos: [], // Firebase returns URLs, not files
          selectedPlan: comic.selectedPlan,
          generatedComic: comic.generatedComicData || null,
          loading: false,
        });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to load comic';
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  reset: () =>
    set({
      photos: [],
      story: '',
      selectedPlan: 'Pro Comic',
      generatedComic: null,
      loading: false,
      error: null,
      comicId: null,
    }),
}));
