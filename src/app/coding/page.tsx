'use client';

import { motion } from 'framer-motion';
import SectionHeader from '@/components/SectionHeader';
import portfolioData from '@/data/portfolio-data.json';
import Link from 'next/link';

const CODING_PROJECTS = [
    {
        title: 'Ordinals Game Site',
        url: 'https://ordinal.thejake.design/',
        description: 'Interactive web-based ordinals experience',
        tech: ['Web', 'Interactive'],
    },
    {
        title: 'Gemeos Game Site',
        url: 'https://gemeos.thejake.design/',
        description: 'Gemeos gaming experience',
        tech: ['Web', 'Game'],
    },
    {
        title: 'Pokemon Game Site',
        url: 'https://24.thejake.design/poke/',
        description: 'Pokemon-themed interactive game',
        tech: ['Web', 'Game'],
    },
];

export default function CodingPage() {
    const section = portfolioData.sections.find((s) => s.slug === 'coding');

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <SectionHeader
                title="Coding"
                subtitle="Interactive web projects & experiments"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {CODING_PROJECTS.map((project, i) => (
                    <motion.div
                        key={project.title}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
                        <Link
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block p-8 rounded-2xl glass hover:bg-white/8 transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,212,170,0.1)] hover:border-cyan-500/20 h-full"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <h3 className="text-xl font-semibold text-white group-hover:text-cyan-400 transition-colors">
                                    {project.title}
                                </h3>
                                <span className="text-white/30 group-hover:text-cyan-400 transition-colors text-lg">
                                    ↗
                                </span>
                            </div>
                            <p className="text-white/40 text-sm mb-6">{project.description}</p>
                            <div className="flex flex-wrap gap-2">
                                {project.tech.map((t) => (
                                    <span
                                        key={t}
                                        className="text-xs px-3 py-1 rounded-full bg-white/5 text-white/40 border border-white/5"
                                    >
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Show any coding images from scrape */}
            {section && section.items.filter((i) => i.type === 'image').length > 0 && (
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-white/80 mb-8">Project Screenshots</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {section.items
                            .filter((i) => i.type === 'image')
                            .map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="rounded-xl overflow-hidden border border-white/5"
                                >
                                    <img
                                        src={item.url}
                                        alt={item.alt}
                                        className="w-full h-auto"
                                        loading="lazy"
                                    />
                                </motion.div>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
}
