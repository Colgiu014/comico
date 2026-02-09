'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '@/lib/authContext';
import AuthModal from './AuthModal';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleAuthClick = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 w-full z-50 glass-dark border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="text-2xl sm:text-3xl font-bold text-white hover:text-pink-400 transition-colors duration-300">
              🎨 Comico
            </div>
          </Link>
          
          <div className="flex items-center gap-2 sm:gap-6">
            <Link
              href="/"
              className="hidden sm:inline text-white/70 hover:text-white transition-colors duration-300"
            >
              Home
            </Link>
            <Link
              href="/create"
              className="px-4 sm:px-6 py-2 text-sm sm:text-base rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300"
            >
              Create
            </Link>
            <Link
              href="/history"
              className="hidden sm:inline text-white/70 hover:text-white transition-colors duration-300"
            >
              History
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                    {user.displayName?.[0] || user.email?.[0] || 'U'}
                  </div>
                  <span className="hidden sm:inline text-sm">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.email}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAuthClick('login')}
                  className="text-white/70 hover:text-white transition-colors duration-300 text-sm sm:text-base"
                >
                  Login
                </button>
                <button
                  onClick={() => handleAuthClick('signup')}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm rounded-full border border-white/30 text-white hover:bg-white/10 transition-all duration-300"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.nav>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />
    </>
  );
}
