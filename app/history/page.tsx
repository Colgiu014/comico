"use client";

import { useEffect, useState } from "react";
import { getUserComics } from "@/lib/firebaseService";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";

export default function ComicHistoryPage() {
  const [comics, setComics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId] = useState(() => {
    // Get userId from localStorage or create a new one
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('comico_userId');
      if (stored) return stored;
      const newId = 'user-' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('comico_userId', newId);
      return newId;
    }
    return '';
  });

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getUserComics(userId)
      .then((data) => {
        console.log('Fetched comics:', data);
        setComics(data);
      })
      .catch((err) => {
        console.error('Error fetching comics:', err);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <main className="overflow-hidden">
      <Navbar />
      
      <div className="min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold text-white mb-4">📚 My Comic Collection</h1>
            <p className="text-white/60 text-lg">View and manage all your created comics</p>
          </motion.div>

          {loading ? (
            <div className="text-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="text-6xl mb-4 inline-block"
              >
                📖
              </motion.div>
              <p className="text-white/60 text-lg">Loading your comics...</p>
            </div>
          ) : comics.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-12 rounded-2xl text-center"
            >
              <div className="text-6xl mb-6">📝</div>
              <h3 className="text-2xl font-bold text-white mb-4">No Comics Yet</h3>
              <p className="text-white/60 mb-8">Start creating your first comic masterpiece!</p>
              <Link
                href="/create"
                className="inline-block py-4 px-8 rounded-xl font-bold text-lg bg-gradient-to-r from-indigo-500 to-pink-500 text-white hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Create Your First Comic →
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {comics.map((comic, index) => {
                // Parse the generatedComicData if it's a string
                let comicContent = null;
                let firstPanelImage = null;
                let comicTitle = comic.title || "Untitled Comic";
                
                try {
                  if (comic.generatedComicData) {
                    comicContent = typeof comic.generatedComicData === 'string'
                      ? JSON.parse(comic.generatedComicData)
                      : comic.generatedComicData;
                    
                    // Get first panel image
                    if (comicContent?.panels?.[0]?.imageUrl) {
                      firstPanelImage = comicContent.panels[0].imageUrl;
                    }
                  }
                } catch (e) {
                  console.error('Error parsing comic data:', e);
                }

                return (
                  <motion.div
                    key={comic.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card p-6 rounded-2xl flex flex-col gap-4 hover:scale-105 transition-transform duration-300"
                  >
                    <div className="aspect-[3/4] bg-white/10 rounded-xl overflow-hidden flex items-center justify-center border-2 border-white/20">
                      {firstPanelImage ? (
                        <img
                          src={firstPanelImage}
                          alt="cover"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23374151" width="400" height="400"/%3E%3Ctext fill="%23fff" font-size="24" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3E📚%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      ) : (
                        <div className="text-6xl">📚</div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-white mb-2 truncate" title={comicTitle}>
                        {comicTitle}
                      </h2>
                      
                      <div className="flex items-center gap-2 text-white/60 text-sm mb-3">
                        <span className="bg-white/10 px-2 py-1 rounded">
                          {comicContent?.panels?.length || 0} panels
                        </span>
                        <span className="bg-white/10 px-2 py-1 rounded">
                          {comic.status}
                        </span>
                      </div>
                      
                      <p className="text-white/60 text-sm mb-4">
                        {comic.selectedPlan || 'Pro Comic'}
                      </p>
                    </div>
                    
                    <Link
                      href={`/create?comicId=${comic.id}`}
                      className="py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-bold text-center hover:shadow-lg transition-all transform hover:scale-105"
                    >
                      View Comic →
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
