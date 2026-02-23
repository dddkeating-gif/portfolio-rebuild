'use client';

import { motion } from 'framer-motion';
import SectionHeader from '@/components/SectionHeader';
import Image from 'next/image';
import portfolioData from '@/data/portfolio-data.json';

export default function AboutPage() {
    const section = portfolioData.sections.find((s) => s.slug === 'about');
    const profileImage = section?.items.find((i) => i.type === 'image');

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <SectionHeader title="About" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Profile image */}
                {profileImage && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="md:col-span-1"
                    >
                        <div className="rounded-2xl overflow-hidden border border-white/10 glow-cyan">
                            <Image
                                src={profileImage.url}
                                alt="Jake Vallante"
                                width={400}
                                height={400}
                                className="w-full h-auto object-cover"
                                unoptimized
                            />
                        </div>
                    </motion.div>
                )}

                {/* Bio */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className={profileImage ? 'md:col-span-2' : 'md:col-span-3'}
                >
                    <div className="glass rounded-2xl p-8 space-y-6">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
                            {portfolioData.owner.name}
                        </h2>
                        <p className="text-lg text-white/50 italic">
                            &ldquo;{portfolioData.owner.tagline}&rdquo;
                        </p>
                        <div className="space-y-4 text-white/60 leading-relaxed">
                            <p>
                                A versatile creative professional with expertise spanning graphic design,
                                animation, photography, and web development. With a keen eye for detail and
                                a passion for storytelling through visual media.
                            </p>
                            <p>
                                Experienced in bringing creative visions to life across multiple mediums —
                                from brand identity and motion graphics to immersive web experiences and
                                fine art photography.
                            </p>
                        </div>

                        {/* Skills */}
                        <div className="pt-4 border-t border-white/5">
                            <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">
                                Specialties
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    'Graphic Design',
                                    'Animation',
                                    'Motion Graphics',
                                    'Photography',
                                    'Web Development',
                                    'Brand Identity',
                                    'UI/UX',
                                    'Video Production',
                                ].map((skill) => (
                                    <span
                                        key={skill}
                                        className="text-xs px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400/80 border border-cyan-500/20"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
