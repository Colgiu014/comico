'use client';

import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="border-t border-white/10 glass-dark py-12 px-4 sm:px-6"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-12">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent mb-4">
              🎨 Comico
            </h3>
            <p className="text-sm sm:text-base text-white/60">Transform your stories into beautiful comics</p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4 text-sm sm:text-base">Product</h4>
            <ul className="space-y-2 text-sm sm:text-base text-white/60">
              <li><a href="#" className="hover:text-white transition">Features</a></li>
              <li><a href="#" className="hover:text-white transition">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4 text-sm sm:text-base">Company</h4>
            <ul className="space-y-2 text-sm sm:text-base text-white/60">
              <li><a href="#" className="hover:text-white transition">About</a></li>
              <li><a href="#" className="hover:text-white transition">Blog</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4 text-sm sm:text-base">Legal</h4>
            <ul className="space-y-2 text-sm sm:text-base text-white/60">
              <li><a href="#" className="hover:text-white transition">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms</a></li>
              <li><a href="#" className="hover:text-white transition">Cookies</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="text-xs sm:text-sm text-white/60">© {currentYear} Comico. All rights reserved.</p>
          <div className="flex gap-6 text-xs sm:text-sm">
            <a href="#" className="text-white/60 hover:text-white transition">Twitter</a>
            <a href="#" className="text-white/60 hover:text-white transition">Instagram</a>
            <a href="#" className="text-white/60 hover:text-white transition">Discord</a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
