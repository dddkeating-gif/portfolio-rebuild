'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
    { href: '#hero', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#graphic-design', label: 'Graphic Design' },
    { href: '#animation', label: 'Animation' },
    { href: '#photography', label: 'Photography' },
    { href: '#coding', label: 'Coding' },
    { href: '#contact', label: 'Contact' },
];

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            // Determine active section
            const sections = NAV_LINKS.map(l => l.href.replace('#', ''));
            for (let i = sections.length - 1; i >= 0; i--) {
                const el = document.getElementById(sections[i]);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= 120) {
                        setActiveSection(sections[i]);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (href: string) => {
        const id = href.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setIsOpen(false);
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? 'backdrop-blur-xl bg-white/70 border-b border-[#326789]/8 shadow-sm'
                    : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <button
                    onClick={() => scrollTo('#hero')}
                    className="text-xl font-bold tracking-tight text-[#326789] hover:text-[#e65c4f] transition-colors"
                >
                    JV
                </button>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-1">
                    {NAV_LINKS.map((link) => (
                        <button
                            key={link.href}
                            onClick={() => scrollTo(link.href)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeSection === link.href.replace('#', '')
                                    ? 'bg-[#326789]/10 text-[#326789]'
                                    : 'text-[#326789]/50 hover:text-[#326789] hover:bg-[#326789]/5'
                                }`}
                        >
                            {link.label}
                        </button>
                    ))}
                </div>

                {/* Mobile hamburger */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden text-[#326789]/60 hover:text-[#326789] p-2"
                    aria-label="Toggle menu"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {isOpen ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
                    </svg>
                </button>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden overflow-hidden backdrop-blur-2xl bg-white/90 border-b border-[#326789]/8"
                    >
                        <div className="px-6 py-4 space-y-1">
                            {NAV_LINKS.map((link) => (
                                <button
                                    key={link.href}
                                    onClick={() => scrollTo(link.href)}
                                    className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeSection === link.href.replace('#', '')
                                            ? 'bg-[#326789]/10 text-[#326789]'
                                            : 'text-[#326789]/50 hover:text-[#326789] hover:bg-[#326789]/5'
                                        }`}
                                >
                                    {link.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
