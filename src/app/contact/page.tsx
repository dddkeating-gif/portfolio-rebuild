'use client';

import { motion } from 'framer-motion';
import SectionHeader from '@/components/SectionHeader';
import { useState } from 'react';

export default function ContactPage() {
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In production, this would send to an API
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        setFormState({ name: '', email: '', message: '' });
    };

    return (
        <div className="max-w-3xl mx-auto px-6 py-12">
            <SectionHeader
                title="Contact"
                subtitle="Let's create something amazing together"
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-white/40 mb-2">
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={formState.name}
                            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                            placeholder="Your name"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-white/40 mb-2">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={formState.email}
                            onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                            placeholder="your@email.com"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-white/40 mb-2">
                            Message
                        </label>
                        <textarea
                            id="message"
                            value={formState.message}
                            onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                            rows={5}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all resize-none"
                            placeholder="Tell me about your project..."
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 shadow-[0_0_30px_rgba(0,212,170,0.2)] hover:shadow-[0_0_50px_rgba(0,212,170,0.3)]"
                    >
                        {submitted ? '✓ Message Sent!' : 'Send Message'}
                    </button>
                </form>

                {/* Direct links */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 text-center"
                >
                    <p className="text-white/30 text-sm">
                        Or reach out directly at{' '}
                        <a
                            href="mailto:hello@thejake.design"
                            className="text-cyan-400/70 hover:text-cyan-400 transition-colors"
                        >
                            hello@thejake.design
                        </a>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}
