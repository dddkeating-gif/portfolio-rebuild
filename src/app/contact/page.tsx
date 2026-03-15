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
                        <label htmlFor="name" className="block text-sm font-medium text-gray-500 mb-2">
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={formState.name}
                            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-300 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition-all"
                            placeholder="Your name"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-500 mb-2">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={formState.email}
                            onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-300 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition-all"
                            placeholder="your@email.com"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-500 mb-2">
                            Message
                        </label>
                        <textarea
                            id="message"
                            value={formState.message}
                            onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                            rows={5}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-300 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition-all resize-none"
                            placeholder="Tell me about your project..."
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold hover:from-indigo-600 hover:to-violet-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        {submitted ? '✓ Message Sent!' : 'Send Message'}
                    </button>
                </form>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 text-center"
                >
                    <p className="text-gray-400 text-sm">
                        Or reach out directly at{' '}
                        <a
                            href="mailto:hello@thejake.design"
                            className="text-indigo-500 hover:text-indigo-600 transition-colors"
                        >
                            hello@thejake.design
                        </a>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}
