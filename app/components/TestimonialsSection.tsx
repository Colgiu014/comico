'use client';

import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Comic Fan & Creator',
    avatar: '👩‍🎨',
    content: 'I never thought I could create a professional comic book. Comico made it incredibly easy and fun!',
    rating: 5,
  },
  {
    name: 'Marcus Chen',
    role: 'Children\'s Author',
    avatar: '👨‍💼',
    content: 'The AI turned my story into stunning visuals. My kids love their personalized comic book!',
    rating: 5,
  },
  {
    name: 'Elena Rodriguez',
    role: 'Illustrator',
    avatar: '👩‍🎓',
    content: 'Best way to bring family photos to life. The whole process was smooth and the quality is amazing.',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
    <section className="py-20 px-6 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white mb-4">
            Loved by <span className="bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">Creators</span>
          </h2>
          <p className="text-xl text-white/60">See what people love about Comico</p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              variants={item}
              className="glass-card p-8 rounded-2xl hover:bg-white/15 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl">{testimonial.avatar}</div>
                <div>
                  <h3 className="text-white font-bold">{testimonial.name}</h3>
                  <p className="text-white/60 text-sm">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, j) => (
                  <span key={j} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>

              <p className="text-white/80 italic">{testimonial.content}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
