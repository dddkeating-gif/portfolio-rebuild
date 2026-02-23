'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    children?: ReactNode;
}

export default function SectionHeader({ title, subtitle, children }: SectionHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
        >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
                {title}
            </h1>
            {subtitle && (
                <p className="text-lg text-white/40 mt-4 max-w-2xl">{subtitle}</p>
            )}
            {children}
        </motion.div>
    );
}
