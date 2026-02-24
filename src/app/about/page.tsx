'use client';

import { motion } from 'framer-motion';
import SectionHeader from '@/components/SectionHeader';
import Image from 'next/image';
import portfolioData from '@/data/portfolio-data.json';

const SELECTED_CLIENTS = [
    'Harvard Medical School',
    'American Council for International Studies',
    'Wentworth Institute of Technology',
    'ToolsGroup',
    'Teradiode',
    'Nedap',
    'Compass Group',
    'Morrison Living',
    'Unidine',
    'Strategic Dining Services',
    'CCL Hospitality Group',
];

const SKILLSET = [
    'Content management',
    'Organization structuring',
    'Artificial intelligence',
    'Writing',
    'Marketing automation',
    'CRM systems and lead lifecycle optimization',
    'Sales enablement and pitch development',
    'Thought leadership and executive branding',
    'Campaign performance tracking and reporting',
    'Brand strategy and visual identity systems',
    'UX design and user experience testing',
    'Web design and CMS management',
    'Creative direction',
    'Paid media campaign management',
    'Industrial design',
    'Product design',
    'Graphic design',
    'SEO (Search Engine Optimization)',
    'SEM (Search Engine Marketing)',
    'Data analytics',
    'Event organization',
    'Animation',
    'Video editing',
    'Video directing',
    'Cross-functional team collaboration',
    'Editorial planning and content strategy',
    'B2B marketing and demand generation',
    'Internal communications and culture marketing',
];

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
                        <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-lg">
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
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-indigo-600 bg-clip-text text-transparent">
                            {portfolioData.owner.name}
                        </h2>

                        <div className="space-y-4 text-gray-600 leading-relaxed">
                            <p>
                                I&apos;m a marketer, designer, and photographer based out of Boston. With more than 18 years of branding and marketing experience, I&apos;ve led initiatives across nearly every discipline—augmenting creative vision with strategic execution.
                            </p>
                            <p>
                                I strive to craft elegant solutions to complex problems. For every company there is always an opportunity to design a meaningful experience that will change people&apos;s lives for the better. The experiences I work to create are the kind that take people on a journey to tell the story of a brand. This type of experiential branding reaches out and grabs you because it&apos;s strategically on target yet unexpected at the same time.
                            </p>
                            <p>
                                I recently exhibited work at the Metropolitan Museum of Art in New York and my presentations are featured in Harvard Medical School post-doctorate programs.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Selected Clients */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mt-16"
            >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Selected Clients</h3>
                <div className="glass rounded-2xl p-8">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {SELECTED_CLIENTS.map((client) => (
                            <div
                                key={client}
                                className="text-gray-600 text-sm py-2 px-4 rounded-lg bg-white/50 border border-gray-100"
                            >
                                {client}
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Skillset */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mt-12"
            >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Skillset</h3>
                <div className="glass rounded-2xl p-8">
                    <div className="flex flex-wrap gap-2">
                        {SKILLSET.map((skill) => (
                            <span
                                key={skill}
                                className="text-xs px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
