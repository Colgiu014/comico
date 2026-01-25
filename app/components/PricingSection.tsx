'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const plans = [
  {
    name: 'Starter Comic',
    price: 24.99,
    pages: 20,
    features: ['Up to 10 photos', 'Custom storyline', 'Basic art style', 'Digital preview'],
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Pro Comic',
    price: 49.99,
    pages: 32,
    features: [
      'Up to 20 photos',
      'Full customization',
      'Premium art styles',
      'Digital preview',
      'Free shipping',
      'Printed hardcover',
    ],
    highlighted: true,
    color: 'from-indigo-500 to-pink-500',
  },
  {
    name: 'Ultimate Comic',
    price: 79.99,
    pages: 48,
    features: [
      'Unlimited photos',
      'Full creative control',
      'Exclusive art styles',
      'Digital preview',
      'Free shipping',
      'Premium hardcover',
      'Extra copies (2x)',
    ],
    color: 'from-pink-500 to-orange-500',
  },
];

export default function PricingSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white mb-4">
            Simple <span className="bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">Pricing</span>
          </h2>
          <p className="text-xl text-white/60">Choose your perfect comic book package</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className={`rounded-3xl p-8 transition-all duration-300 ${
                plan.highlighted
                  ? `glass-card border-2 border-pink-500/50 scale-105 hover:scale-110`
                  : 'glass-card hover:bg-white/15'
              }`}
            >
              {plan.highlighted && (
                <div className="bg-gradient-to-r from-pink-500 to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-bold inline-block mb-4">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-white/60 mb-6">{plan.pages} page comic book</p>
              
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">${plan.price}</span>
                <span className="text-white/60 ml-2">one-time</span>
              </div>

              <button className={`w-full py-3 px-6 rounded-xl font-bold text-white mb-8 transition-all duration-300 hover:scale-105 ${
                plan.highlighted
                  ? `bg-gradient-to-r ${plan.color} hover:shadow-lg`
                  : `glass hover:bg-white/20`
              }`}>
                Get Started
              </button>

              <ul className="space-y-4">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-3 text-white/80">
                    <span className="text-pink-500 font-bold">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
