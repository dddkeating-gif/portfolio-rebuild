'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
    const [inHero, setInHero] = useState(true);
    const observerRef = useRef<IntersectionObserver | null>(null);

    // Track which sections are visible and pick the best one
    const visibleSections = useRef<Map<string, number>>(new Map());

    const updateActiveSection = useCallback(() => {
        let bestSection = 'hero';
        let bestRatio = 0;
        visibleSections.current.forEach((ratio, id) => {
            if (ratio > bestRatio) {
                bestRatio = ratio;
                bestSection = id;
            }
        });
        // Fallback: if near top of page, force hero
        if (window.scrollY < 100) {
            bestSection = 'hero';
        }
        setActiveSection(bestSection);
    }, []);

    useEffect(() => {
        // Scroll listener for navbar background + hero detection
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
            const aboutEl = document.getElementById('about');
            if (aboutEl) {
                const aboutTop = aboutEl.getBoundingClientRect().top;
                setInHero(aboutTop > 80);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        // IntersectionObserver for active section tracking
        const sectionIds = NAV_LINKS.map(l => l.href.replace('#', ''));
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        visibleSections.current.set(entry.target.id, entry.intersectionRatio);
                    } else {
                        visibleSections.current.delete(entry.target.id);
                    }
                });
                updateActiveSection();
            },
            {
                rootMargin: '-72px 0px -30% 0px',
                threshold: [0, 0.1, 0.2, 0.3, 0.5],
            }
        );

        sectionIds.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observerRef.current?.observe(el);
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            observerRef.current?.disconnect();
        };
    }, [updateActiveSection]);

    const scrollTo = (href: string) => {
        const id = href.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setIsOpen(false);
    };

    // Color scheme based on section (hero = dark bg, rest = light bg)
    const textBase = scrolled && !inHero ? 'text-[#326789]' : 'text-[#79a5c8]';
    const textMuted = scrolled && !inHero ? 'text-[#326789]/50' : 'text-[#79a5c8]/60';
    const hoverBg = scrolled && !inHero ? 'hover:bg-[#326789]/5' : 'hover:bg-white/5';

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? inHero
                        ? 'backdrop-blur-xl bg-[#0d1821]/60 border-b border-white/5'
                        : 'backdrop-blur-xl bg-white/70 border-b border-[#326789]/8 shadow-sm'
                    : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-8">
                <button
                    onClick={() => scrollTo('#hero')}
                    className={`text-xl font-bold tracking-tight ${textBase} hover:text-[#e65c4f] transition-colors`}
                >
                    JV
                </button>

                <div className="hidden md:flex items-center gap-1">
                    {NAV_LINKS.map((link) => {
                        const isActive = activeSection === link.href.replace('#', '');
                        return (
                            <button
                                key={link.href}
                                onClick={() => scrollTo(link.href)}
                                className={`nav-link px-4 py-2 rounded-full transition-all duration-300 ${
                                    isActive
                                        ? 'text-[#e65c4f]'
                                        : `${textMuted} hover:text-[#e65c4f] ${hoverBg}`
                                }`}
                            >
                                {link.label}
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`md:hidden ml-auto ${textMuted} hover:text-[#e65c4f] p-2`}
                    aria-label="Toggle menu"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {isOpen ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
                    </svg>
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden overflow-hidden backdrop-blur-2xl bg-white/90 border-b border-[#326789]/8"
                    >
                        <div className="px-6 py-4 space-y-1">
                            {NAV_LINKS.map((link) => {
                                const isActive = activeSection === link.href.replace('#', '');
                                return (
                                    <button
                                        key={link.href}
                                        onClick={() => scrollTo(link.href)}
                                        className={`nav-link block w-full text-left px-4 py-3 rounded-xl transition-all ${
                                            isActive
                                                ? 'bg-[#e65c4f]/10 text-[#e65c4f]'
                                                : 'text-[#326789]/50 hover:text-[#e65c4f] hover:bg-[#326789]/5'
                                        }`}
                                    >
                                        {link.label}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
