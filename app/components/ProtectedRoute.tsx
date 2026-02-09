'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setShowAuthPrompt(true);
      // Redirect to home page after a brief moment
      const timeout = setTimeout(() => {
        router.push('/');
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center max-w-md mx-4">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Authentication Required
            </h1>
            <p className="text-gray-600 mb-6">
              You need to be logged in to access this page.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to home page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
