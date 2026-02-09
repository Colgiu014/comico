'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, Suspense, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FileUpload from '../components/FileUpload';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '@/lib/authContext';
import { useComicStore } from '@/lib/store';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getComic } from '@/lib/firebaseService';
import { generateComicClient } from '@/lib/comicGenerationClient';

/**
 * Comic Book Viewer Component - Displays panels like a real book
 */
function ComicBookViewer({ panels, captions }: { panels: any[]; captions: string[] }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const bookRef = useRef<HTMLDivElement>(null);

  const panelsPerPage = 2; // Show 2 panels (left and right) per page
  const totalPages = Math.ceil(panels.length / panelsPerPage);
  const currentPanels = panels.slice(
    currentPage * panelsPerPage,
    (currentPage + 1) * panelsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (diff > 50) {
      handleNextPage();
    } else if (diff < -50) {
      handlePrevPage();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') handleNextPage();
    if (e.key === 'ArrowLeft') handlePrevPage();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages]);

  return (
    <div
      ref={bookRef}
      className="w-full flex flex-col gap-4 sm:gap-6"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Book Spread */}
      <motion.div
        key={currentPage}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="relative bg-gradient-to-b from-amber-900/20 to-amber-900/10 p-3 sm:p-6 rounded-lg border border-amber-500/20 shadow-2xl"
      >
        {/* Book spine effect */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-900 to-amber-950 rounded-l-lg" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          {/* Left Page */}
          {currentPanels[0] && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              <div className="relative aspect-square bg-white/5 rounded-lg overflow-hidden border-2 border-gray-700 shadow-xl">
                {currentPanels[0].imageUrl ? (
                  <img
                    src={currentPanels[0].imageUrl}
                    alt={`Panel ${currentPanels[0].panelNumber}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23374151" width="400" height="400"/%3E%3Ctext fill="%23fff" font-size="20" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ELoading...%3C/text%3E%3C/svg%3E';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/40">
                    Panel {currentPanels[0].panelNumber}
                  </div>
                )}

                {/* Panel Number Badge */}
                <div className="absolute top-3 left-3 bg-black/80 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-yellow-500">
                  <p className="text-yellow-400 text-xs font-black tracking-wider">
                    PANEL {currentPanels[0].panelNumber}
                  </p>
                </div>
              </div>

              {/* Caption - Speech Bubble Overlay */}
              {captions[currentPanels[0].panelNumber - 1] && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 bg-white/95 backdrop-blur-sm p-2 sm:p-4 rounded-lg border-2 border-black shadow-lg"
                >
                  <p className="text-gray-900 text-xs sm:text-sm font-bold leading-tight sm:leading-relaxed">
                    {captions[currentPanels[0].panelNumber - 1]}
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Right Page */}
          {currentPanels[1] && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-square bg-white/5 rounded-lg overflow-hidden border-2 border-gray-700 shadow-xl">
                {currentPanels[1].imageUrl ? (
                  <img
                    src={currentPanels[1].imageUrl}
                    alt={`Panel ${currentPanels[1].panelNumber}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23374151" width="400" height="400"/%3E%3Ctext fill="%23fff" font-size="20" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ELoading...%3C/text%3E%3C/svg%3E';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/40">
                    Panel {currentPanels[1].panelNumber}
                  </div>
                )}

                {/* Panel Number Badge */}
                <div className="absolute top-3 left-3 bg-black/80 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-yellow-500">
                  <p className="text-yellow-400 text-xs font-black tracking-wider">
                    PANEL {currentPanels[1].panelNumber}
                  </p>
                </div>
              </div>

              {/* Caption - Speech Bubble Overlay */}
              {captions[currentPanels[1].panelNumber - 1] && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 bg-white/95 backdrop-blur-sm p-2 sm:p-4 rounded-lg border-2 border-black shadow-lg"
                >
                  <p className="text-gray-900 text-xs sm:text-sm font-bold leading-tight sm:leading-relaxed">
                    {captions[currentPanels[1].panelNumber - 1]}
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Empty right page placeholder if odd number of panels */}
          {!currentPanels[1] && currentPanels[0] && (
            <div className="relative opacity-30">
              <div className="aspect-square bg-gradient-to-br from-white/10 to-white/5 rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center">
                <p className="text-white/40 font-semibold">End of Story</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
        >
          <span>←</span> <span className="hidden sm:inline">Previous</span>
        </motion.button>

        {/* Page Indicator */}
        <div className="text-center">
          <p className="text-white font-bold text-sm sm:text-lg">
            Page {currentPage + 1} of {totalPages}
          </p>
          <p className="text-white/60 text-xs sm:text-sm">
            Panels {currentPage * panelsPerPage + 1}-
            {Math.min((currentPage + 1) * panelsPerPage, panels.length)} of {panels.length}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNextPage}
          disabled={currentPage === totalPages - 1}
          className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
        >
          <span className="hidden sm:inline">Next</span> <span>→</span>
        </motion.button>
      </div>

      {/* Swipe hint on mobile */}
      <div className="text-center text-white/40 text-xs sm:text-sm">
        💡 Use arrow keys, click buttons, or swipe to navigate
      </div>
    </div>
  );
}

function CreatePageContent() {
  const {
    photos,
    story,
    addPhotos,
    setStory,
    selectedPlan,
    setPlan,
    saveToFirebase,
    loading,
    error,
    comicId,
    setGeneratedComic,
    reset,
  } = useComicStore();
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedComic, setGeneratedComicLocal] = useState<string | null>(null);
  const [step, setStep] = useState<'upload' | 'story' | 'generate' | 'review'>('upload');
  const searchParams = useSearchParams();
  const viewComicId = searchParams.get('comicId');
  const [loadingComic, setLoadingComic] = useState(false);

  // Load existing comic if comicId is provided
  useEffect(() => {
    if (viewComicId) {
      setLoadingComic(true);
      getComic(viewComicId)
        .then((comic) => {
          if (comic) {
            console.log('Loaded comic from Firebase:', comic);
            // The comic object from Firebase already has the full structure
            // We need to stringify it for the review step to parse it
            const comicDataString = JSON.stringify(comic);
            setGeneratedComicLocal(comicDataString);
            setGeneratedComic(comicDataString);
            setStep('review');
          }
        })
        .catch((err) => {
          console.error('Error loading comic:', err);
          alert('Failed to load comic');
        })
        .finally(() => {
          setLoadingComic(false);
        });
    }
  }, [viewComicId, setGeneratedComic]);

  const handlePhotosAdded = (files: File[]) => {
    addPhotos(files);
  };

  const handleGenerateComic = async () => {
    if (photos.length === 0 || !story.trim()) {
      alert('Please add photos and write a story');
      return;
    }

    if (!user?.uid) {
      alert('You must be logged in to generate a comic');
      return;
    }

    setIsGenerating(true);
    setStep('generate');

    try {
      // Save to Firebase first
      const newComicId = await saveToFirebase(user.uid);
      
      // Generate comic using client-side OpenAI calls
      const comicData = await generateComicClient({
        comicId: newComicId,
        story,
        photos,
        userId: user.uid,
        selectedPlan,
      });
      
      console.log('Generated comic data:', comicData);
      
      // Store the full comic data
      setGeneratedComic(JSON.stringify(comicData));
      setGeneratedComicLocal(JSON.stringify(comicData));
      
      setStep('review');
    } catch (err) {
      console.error('Error generating comic:', err);
      alert('Error generating comic. Please try again.');
      setStep('story');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="overflow-hidden">
      <Navbar />
      
      <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Loading existing comic */}
          {loadingComic ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="text-6xl mb-4 inline-block"
              >
                📖
              </motion.div>
              <p className="text-white/60 text-lg">Loading your comic...</p>
            </motion.div>
          ) : (
            <>
          {/* Progress Indicator */}
          <div className="mb-8 sm:mb-12">
            <div className="flex justify-between items-center gap-1 sm:gap-0 mb-4 sm:mb-8">
              {['Upload', 'Story', 'Generate', 'Review'].map((s, i) => (
                <div key={i} className="flex flex-col items-center flex-1">
                  <motion.div
                    className={`w-8 sm:w-12 h-8 sm:h-12 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm mb-1 sm:mb-2 transition-all duration-300 ${
                      (step === 'upload' && i <= 0) ||
                      (step === 'story' && i <= 1) ||
                      (step === 'generate' && i <= 2) ||
                      (step === 'review' && i <= 3)
                        ? 'bg-gradient-to-r from-indigo-500 to-pink-500 text-white'
                        : 'glass text-white/60'
                    }`}
                  >
                    {i + 1}
                  </motion.div>
                  <p className="text-xs sm:text-sm text-white/60">{s}</p>
                </div>
              ))}
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-pink-500"
                initial={{ width: '0%' }}
                animate={{
                  width:
                    step === 'upload'
                      ? '25%'
                      : step === 'story'
                      ? '50%'
                      : step === 'generate'
                      ? '75%'
                      : '100%',
                }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </div>

          {/* Upload Step */}
          {step === 'upload' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-4">Upload Your Photos</h2>
                <p className="text-sm sm:text-lg text-white/60">
                  Add the photos that will be transformed into your comic book
                </p>
              </div>

              <FileUpload
                onFilesSelected={handlePhotosAdded}
                label="Add Photos"
                icon="📸"
                accept="image/*"
              />

              {photos.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card p-6 rounded-2xl"
                >
                  <h3 className="text-white font-bold mb-4 text-sm sm:text-base">Selected Photos ({photos.length})</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {photos.map((file, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="aspect-square bg-white/10 rounded-lg flex items-center justify-center text-white/60 overflow-hidden relative group"
                      >
                        <div className="text-center p-2">
                          <div className="text-xl sm:text-2xl mb-2">📷</div>
                          <p className="text-xs truncate">{file.name}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              <div className="flex gap-2 sm:gap-4">
                <button
                  onClick={() => setStep('story')}
                  disabled={photos.length === 0}
                  className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-bold text-sm sm:text-lg transition-all duration-300 ${
                    photos.length === 0
                      ? 'bg-white/10 text-white/50 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-500 to-pink-500 text-white hover:shadow-lg'
                  }`}
                >
                  Continue →
                </button>
              </div>
            </motion.div>
          )}

          {/* Story Step */}
          {step === 'story' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-4">Tell Your Story</h2>
                <p className="text-sm sm:text-lg text-white/60">
                  Write the narrative and descriptions that will bring your comic to life
                </p>
              </div>

              <div className="glass-card p-4 sm:p-8 rounded-2xl">
                <textarea
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder="Write your story here... Describe the scenes, characters, dialogue, and emotions. The more detail you provide, the better your comic will be!"
                  className="w-full h-48 sm:h-64 bg-white/10 border border-white/20 rounded-xl p-4 sm:p-6 text-sm sm:text-base text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                />
                <p className="text-white/60 text-xs sm:text-sm mt-4">
                  {story.length} characters • {story.split('\n').length} paragraphs
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="glass-card p-3 sm:p-4 rounded-xl text-center">
                  <div className="text-2xl sm:text-3xl mb-2">📸</div>
                  <p className="text-white text-xs sm:text-sm font-bold">{photos.length} Photos</p>
                </div>
                <div className="glass-card p-3 sm:p-4 rounded-xl text-center">
                  <div className="text-2xl sm:text-3xl mb-2">✍️</div>
                  <p className="text-white text-xs sm:text-sm font-bold">
                    {story.split('\n').filter(l => l.trim()).length} Paragraphs
                  </p>
                </div>
                <div className="glass-card p-3 sm:p-4 rounded-xl text-center">
                  <div className="text-2xl sm:text-3xl mb-2">📖</div>
                  <p className="text-white text-xs sm:text-sm font-bold">20-48 Pages</p>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card p-4 rounded-xl border border-red-500/50 bg-red-500/10"
                >
                  <p className="text-red-400 font-semibold">Error: {error}</p>
                </motion.div>
              )}

              <div className="flex gap-2 sm:gap-4 flex-col sm:flex-row">
                <button
                  onClick={() => setStep('upload')}
                  disabled={loading}
                  className="flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-bold text-sm sm:text-lg glass text-white hover:bg-white/20 transition-all duration-300 disabled:opacity-50"
                >
                  ← Back
                </button>
                <button
                  onClick={handleGenerateComic}
                  disabled={!story.trim() || loading}
                  className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-bold text-sm sm:text-lg transition-all duration-300 ${
                    !story.trim() || loading
                      ? 'bg-white/10 text-white/50 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-500 to-pink-500 text-white hover:shadow-lg'
                  }`}
                >
                  {loading ? 'Uploading & Generating...' : 'Continue →'}
                </button>
              </div>
            </motion.div>
          )}

          {/* Generate Step */}
          {step === 'generate' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-4">Generating Your Comic</h2>
                <p className="text-sm sm:text-lg text-white/60">
                  Our AI is creating your unique comic book masterpiece...
                </p>
              </div>

              <div className="glass-card p-8 sm:p-16 rounded-2xl">
                <div className="flex flex-col items-center justify-center space-y-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="text-4xl sm:text-6xl"
                  >
                    🎨
                  </motion.div>
                  
                  <div className="w-full space-y-4">
                    <div className="flex items-center gap-4">
                      <motion.div
                        className="w-2 h-2 rounded-full bg-indigo-500"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity }}
                      />
                      <p className="text-xs sm:text-base text-white/80">Analyzing photos...</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <motion.div
                        className="w-2 h-2 rounded-full bg-pink-500"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      />
                      <p className="text-xs sm:text-base text-white/80">Processing narrative...</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <motion.div
                        className="w-2 h-2 rounded-full bg-cyan-500"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      />
                      <p className="text-xs sm:text-base text-white/80">Creating panels...</p>
                    </div>
                  </div>

                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-indigo-500 via-pink-500 to-cyan-500"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                </div>
              </div>

              <p className="text-center text-xs sm:text-base text-white/60">
                This usually takes 2-3 minutes. Sit back and relax!
              </p>
            </motion.div>
          )}

          {/* Review Step */}
          {step === 'review' && generatedComic && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-4">Your Comic is Ready!</h2>
                <p className="text-sm sm:text-lg text-white/60">
                  Preview your generated comic and choose your print options
                </p>
              </div>

              {(() => {
                try {
                  const comicData = JSON.parse(generatedComic);
                  console.log('Comic data:', comicData);
                  
                  // Parse generatedComicData if it's a string
                  const comicContent = typeof comicData.generatedComicData === 'string' 
                    ? JSON.parse(comicData.generatedComicData)
                    : comicData.generatedComicData;
                  
                  console.log('Comic content:', comicContent);
                  
                  return (
                    <>
                      {/* Story Title */}
                      {comicData.title && (
                        <div className="glass-card p-4 sm:p-6 rounded-2xl text-center">
                          <h3 className="text-xl sm:text-3xl font-bold text-white">
                            {comicData.title}
                          </h3>
                        </div>
                      )}

                      {/* Comic Preview - Book Style */}
                      <div className="glass-card p-4 sm:p-8 rounded-2xl">
                        <div className="text-4xl sm:text-6xl mb-4 sm:mb-6 text-center animate-bounce">🎉</div>
                        <h3 className="text-lg sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">Comic Book Preview</h3>
                        
                        <ComicBookViewer panels={comicContent?.panels || []} captions={comicContent.story?.panelCaptions || []} />
                      </div>
                  </>
                );
              } catch (e) {
                console.error('Error parsing comic data:', e);
                return (
                  <div className="glass-card p-8 rounded-2xl">
                    <div className="bg-white/10 aspect-video rounded-xl flex items-center justify-center">
                      <p className="text-white/40">Error loading comic preview: {String(e)}</p>
                    </div>
                  </div>
                );
              }
            })()}

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {!viewComicId && (
                <button
                  onClick={() => {
                    setStep('story');
                    setGeneratedComic(null);
                  }}
                  className="flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-bold text-sm sm:text-lg glass text-white hover:bg-white/20 transition-all duration-300"
                >
                  ← Edit Story
                </button>
                )}
                <Link
                  href="/history"
                  className="flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-bold text-sm sm:text-lg glass text-white hover:bg-white/20 transition-all duration-300 text-center"
                >
                  View All Comics
                </Link>
                {!viewComicId && (
                <Link
                  href="/checkout"
                  className="flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-bold text-sm sm:text-lg bg-gradient-to-r from-indigo-500 to-pink-500 text-white hover:shadow-lg transition-all duration-300 text-center"
                >
                  Proceed to Checkout →
                </Link>
                )}
              </div>
            </motion.div>
          )}
          </>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default function CreatePage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white/60 text-lg">Loading...</div>
        </div>
      }>
        <CreatePageContent />
      </Suspense>
    </ProtectedRoute>
  );
}
