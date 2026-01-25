'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full z-50 glass-dark border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="text-3xl font-bold bg-gradient-to-r from-indigo-500 via-pink-500 to-cyan-500 bg-clip-text text-transparent animate-pulse-glow">
            🎨 Comico
          </div>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-white/70 hover:text-white transition-colors duration-300"
          >
            Home
          </Link>
          <Link
            href="/create"
            className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 transform hover:scale-105"
          >
            Create Comic
          </Link>
          <Link
            href="/history"
            className="text-white/70 hover:text-white transition-colors duration-300"
          >
            History
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
