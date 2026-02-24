'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const sections = [
  { href: '/graphic-design', label: 'Graphic Design', icon: '✦' },
  { href: '/animation', label: 'Animation & Video', icon: '▶' },
  { href: '/photography', label: 'Photography', icon: '◉' },
  { href: '/coding', label: 'Coding', icon: '⟨/⟩' },
];

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center max-w-4xl"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-7xl md:text-9xl font-bold tracking-tighter">
            <span className="bg-gradient-to-r from-gray-900 via-indigo-700 to-indigo-500 bg-clip-text text-transparent">
              Jake
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-gray-900 bg-clip-text text-transparent">
              Vallante
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-xl md:text-2xl text-gray-400 font-light tracking-wide mb-16"
        >
          A millennial that baby boomers like
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {sections.map((section, i) => (
            <motion.div
              key={section.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.1, duration: 0.5 }}
            >
              <Link
                href={section.href}
                className="group relative block p-6 rounded-2xl glass hover:bg-white/90 transition-all duration-500 hover:shadow-[0_8px_30px_rgba(99,102,241,0.1)] hover:border-indigo-200 card-hover"
              >
                <div className="text-3xl mb-3 opacity-40 group-hover:opacity-80 transition-opacity">
                  {section.icon}
                </div>
                <div className="text-sm font-medium text-gray-500 group-hover:text-gray-900 transition-colors">
                  {section.label}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="text-gray-300 text-sm tracking-widest uppercase"
        >
          ↓ Explore
        </motion.div>
      </motion.div>
    </div>
  );
}
