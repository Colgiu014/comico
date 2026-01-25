'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-4 sm:px-6 overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 sm:w-96 sm:h-96 bg-indigo-500/20 rounded-full blur-3xl -z-10 animate-float"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-pink-500/20 rounded-full blur-3xl -z-10 animate-float" style={{ animationDelay: '1s' }}></div>
      
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8"
      >
        <motion.h1
          variants={item}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
        >
          Turn Your <span className="bg-gradient-to-r from-indigo-500 via-pink-500 to-cyan-500 bg-clip-text text-transparent">Stories</span> into <span className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-pink-500 bg-clip-text text-transparent">Comics</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/70 max-w-2xl mx-auto px-2"
        >
          Upload your photos, share your story, and let AI transform them into stunning, custom comic books
        </motion.p>

        <motion.div
          variants={item}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-6 sm:pt-8 px-2"
        >
          <Link
            href="/create"
            className="px-6 sm:px-8 py-3 sm:py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-bold text-base sm:text-lg hover:shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 inline-block glass-card w-full sm:w-auto text-center"
          >
            Get Started →
          </Link>
          
          <button className="px-6 sm:px-8 py-3 sm:py-4 rounded-2xl glass text-white font-bold text-base sm:text-lg hover:bg-white/20 transition-all duration-300 w-full sm:w-auto">
            Learn More
          </button>
        </motion.div>

        <motion.div
          variants={item}
          className="pt-8 sm:pt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto px-2"
        >
          {[
            { number: '1K+', label: 'Happy Creators' },
            { number: 'AI Powered', label: 'Technology' },
            { number: '100%', label: 'Customizable' },
          ].map((stat, i) => (
            <div
              key={i}
              className="glass-card p-4 sm:p-6 rounded-2xl text-center hover:bg-white/15 transition-all duration-300 group"
            >
              <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
                {stat.number}
              </div>
              <div className="text-white/60 text-xs sm:text-sm mt-2">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
