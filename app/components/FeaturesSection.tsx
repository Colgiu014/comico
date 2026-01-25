'use client';

import { motion } from 'framer-motion';

const features = [
  {
    icon: '📸',
    title: 'Upload Photos',
    description: 'Add your favorite photos to bring your story to life',
  },
  {
    icon: '✍️',
    title: 'Tell Your Story',
    description: 'Write descriptions and narratives for each scene',
  },
  {
    icon: '🤖',
    title: 'AI Generation',
    description: 'Watch as AI creates amazing comic panel layouts and artwork',
  },
  {
    icon: '🎨',
    title: 'Customize',
    description: 'Edit colors, styles, and layouts to match your vision',
  },
  {
    icon: '💳',
    title: 'Order Prints',
    description: 'Get your comic book printed and shipped to your door',
  },
  {
    icon: '📦',
    title: 'Fast Delivery',
    description: 'Professional quality prints delivered within 5-7 business days',
  },
];

export default function FeaturesSection() {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white mb-4">
            How It <span className="bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-xl text-white/60">Six simple steps to create your comic book</p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={item}
              className="glass-card p-8 rounded-3xl hover:bg-white/15 transition-all duration-300 hover:scale-105 group"
            >
              <div className="text-5xl mb-4 group-hover:animate-float">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-white/60">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
