'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useComicStore } from '@/lib/store';
import Link from 'next/link';

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export default function CheckoutPage() {
  const { selectedPlan, photos, story, comicId } = useComicStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId] = useState('user-' + Math.random().toString(36).substr(2, 9)); // Mock user ID
  
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const plans: Record<string, { price: number; pages: number }> = {
    'Starter Comic': { price: 24.99, pages: 20 },
    'Pro Comic': { price: 49.99, pages: 32 },
    'Ultimate Comic': { price: 79.99, pages: 48 },
  };

  const currentPlan = plans[selectedPlan] || plans['Pro Comic'];

  const handleCheckout = async () => {
    if (!shippingAddress.firstName || !shippingAddress.email || !shippingAddress.street) {
      setError('Please fill in all shipping information');
      return;
    }

    if (!comicId) {
      setError('Please create a comic first');
      return;
    }

    setIsProcessing(true);
    setError(null);
    
    try {
      // Call payment API with Firebase integration
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          comicId,
          amount: currentPlan.price,
          plan: selectedPlan,
          shippingAddress,
        }),
      });

      if (!response.ok) throw new Error('Payment processing failed');
      
      setOrderComplete(true);
    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  if (orderComplete) {
    return (
      <main className="overflow-hidden">
        <Navbar />
        
        <div className="min-h-screen pt-32 pb-20 px-6 flex items-center">
          <div className="max-w-2xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-12 rounded-3xl text-center space-y-6"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6 }}
                className="text-7xl"
              >
                ✨
              </motion.div>
              
              <h2 className="text-4xl font-bold text-white">Order Confirmed!</h2>
              <p className="text-white/60 text-lg">
                Your comic book is now in production. We'll send you updates via email.
              </p>

              <div className="glass p-6 rounded-2xl my-8 text-left">
                <h3 className="text-white font-bold mb-4">Order Details</h3>
                <div className="space-y-3 text-white/80">
                  <div className="flex justify-between">
                    <span>Plan:</span>
                    <span className="font-bold">{selectedPlan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pages:</span>
                    <span className="font-bold">{currentPlan.pages}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-white/20">
                    <span>Total:</span>
                    <span className="font-bold text-lg">${currentPlan.price}</span>
                  </div>
                </div>
              </div>

              <p className="text-white/60">
                📦 Estimated delivery: 5-7 business days<br/>
                📧 Order confirmation sent to your email
              </p>

              <div className="flex gap-4 pt-6">
                <Link
                  href="/"
                  className="flex-1 py-4 px-6 rounded-xl font-bold text-lg glass text-white hover:bg-white/20 transition-all duration-300"
                >
                  Back to Home
                </Link>
                <Link
                  href="/create"
                  className="flex-1 py-4 px-6 rounded-xl font-bold text-lg bg-gradient-to-r from-indigo-500 to-pink-500 text-white hover:shadow-lg transition-all duration-300"
                >
                  Create Another
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        <Footer />
      </main>
    );
  }

  return (
    <main className="overflow-hidden">
      <Navbar />
      
      <div className="min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Checkout</h2>
            <p className="text-white/60 text-lg">
              Complete your order and start your comic book printing process
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact Information */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card p-4 rounded-xl border border-red-500/50 bg-red-500/10"
                >
                  <p className="text-red-400 font-semibold">Error: {error}</p>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8 rounded-2xl"
              >
                <h3 className="text-2xl font-bold text-white mb-6">Shipping Address</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={shippingAddress.firstName}
                      onChange={(e) => handleAddressChange('firstName', e.target.value)}
                      className="bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={shippingAddress.lastName}
                      onChange={(e) => handleAddressChange('lastName', e.target.value)}
                      className="bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={shippingAddress.email}
                    onChange={(e) => handleAddressChange('email', e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <input
                    type="text"
                    placeholder="Street Address"
                    value={shippingAddress.street}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="City"
                      value={shippingAddress.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      className="bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={shippingAddress.state}
                      onChange={(e) => handleAddressChange('state', e.target.value)}
                      className="bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    <input
                      type="text"
                      placeholder="ZIP Code"
                      value={shippingAddress.zipCode}
                      onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                      className="bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Payment Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-8 rounded-2xl"
              >
                <h3 className="text-2xl font-bold text-white mb-6">Payment Method</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Card Number"
                      className="bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    <input
                      type="text"
                      placeholder="Name on Card"
                      className="bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    <input
                      type="text"
                      placeholder="CVC"
                      className="bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Order Summary Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <div className="glass-card p-8 rounded-2xl sticky top-32">
                <h3 className="text-2xl font-bold text-white mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6 pb-6 border-b border-white/20">
                  <div className="flex justify-between text-white/80">
                    <span>Plan:</span>
                    <span className="font-bold">{selectedPlan}</span>
                  </div>
                  <div className="flex justify-between text-white/80">
                    <span>Pages:</span>
                    <span className="font-bold">{currentPlan.pages}</span>
                  </div>
                  <div className="flex justify-between text-white/80">
                    <span>Subtotal:</span>
                    <span className="font-bold">${currentPlan.price}</span>
                  </div>
                  <div className="flex justify-between text-white/80">
                    <span>Shipping:</span>
                    <span className="font-bold">FREE</span>
                  </div>
                </div>

                <div className="flex justify-between mb-8">
                  <span className="text-white font-bold text-lg">Total:</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
                    ${currentPlan.price}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                    isProcessing
                      ? 'bg-white/10 text-white/50 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-500 to-pink-500 text-white hover:shadow-lg'
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing Payment...
                    </div>
                  ) : (
                    `Complete Order - $${currentPlan.price}`
                  )}
                </button>

                <p className="text-white/60 text-xs text-center mt-6">
                  🔒 Your payment is secure and encrypted
                </p>
              </div>

              <div className="glass p-6 rounded-2xl">
                <h4 className="text-white font-bold mb-4">What's Next?</h4>
                <ol className="space-y-2 text-white/60 text-sm">
                  <li>✓ Payment processed</li>
                  <li>⏳ Comic in production (2-3 days)</li>
                  <li>📦 Shipped to you (2-4 days)</li>
                  <li>🎉 Enjoy your comic book!</li>
                </ol>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
