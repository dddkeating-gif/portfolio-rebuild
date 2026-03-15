'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    children?: ReactNode;
    accent?: boolean;
}

export default function SectionHeader({ title, subtitle, children, accent }: SectionHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="mb-12"
        >
            <h2 className={`text-4xl md:text-6xl font-bold tracking-tight ${accent
                    ? 'text-[#e65c4f]'
                    : 'bg-gradient-to-r from-[#326789] to-[#79a5c8] bg-clip-text text-transparent'
                }`}>
                {title}
            </h2>
            {subtitle && (
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-lg text-[#326789]/50 mt-4 max-w-2xl"
                >
                    {subtitle}
                </motion.p>
            )}
            {children}
        </motion.div>
    );
}
