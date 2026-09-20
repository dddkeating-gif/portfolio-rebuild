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
    const navigationCleanupRef = useRef<(() => void) | null>(null);

    const handleNavigation = useCallback((event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        event.preventDefault();
        setIsOpen(false);

        const target = document.getElementById(href.slice(1));
        if (!target) return;

        navigationCleanupRef.current?.();

        const getTargetScrollTop = () => {
            const scrollMarginTop = Number.parseFloat(window.getComputedStyle(target).scrollMarginTop) || 0;
            const targetTop = target.getBoundingClientRect().top + window.scrollY - scrollMarginTop;
            const maxScrollTop = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
            return Math.min(Math.max(0, targetTop), maxScrollTop);
        };

        const supportsScrollEnd = 'onscrollend' in window;
        let isSettled = !supportsScrollEnd || Math.abs(window.scrollY - getTargetScrollTop()) <= 2;

        const alignToCurrentTarget = () => {
            const targetScrollTop = getTargetScrollTop();
            if (Math.abs(window.scrollY - targetScrollTop) <= 2) {
                isSettled = true;
                return;
            }

            isSettled = false;
            window.scrollTo({ top: targetScrollTop, behavior: 'smooth' });
        };

        const handleScrollEnd = () => alignToCurrentTarget();
        const layoutObserver = new ResizeObserver(() => {
            if (isSettled) alignToCurrentTarget();
        });
        const cancelOnUserIntent = () => navigationCleanupRef.current?.();
        const cleanup = () => {
            window.removeEventListener('scrollend', handleScrollEnd);
            window.removeEventListener('wheel', cancelOnUserIntent);
            window.removeEventListener('touchstart', cancelOnUserIntent);
            window.removeEventListener('pointerdown', cancelOnUserIntent);
            window.removeEventListener('keydown', cancelOnUserIntent);
            window.removeEventListener('popstate', cancelOnUserIntent);
            layoutObserver.disconnect();
            if (navigationCleanupRef.current === cleanup) {
                navigationCleanupRef.current = null;
            }
        };

        if (supportsScrollEnd) {
            window.addEventListener('scrollend', handleScrollEnd);
        }
        window.addEventListener('wheel', cancelOnUserIntent, { passive: true });
        window.addEventListener('touchstart', cancelOnUserIntent, { passive: true });
        window.addEventListener('pointerdown', cancelOnUserIntent);
        window.addEventListener('keydown', cancelOnUserIntent);
        window.addEventListener('popstate', cancelOnUserIntent);
        for (const section of document.querySelectorAll<HTMLElement>('section[data-section]')) {
            layoutObserver.observe(section);
            if (section === target) break;
        }
        navigationCleanupRef.current = cleanup;

        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        if (window.location.hash !== href) {
            window.history.pushState(null, '', href);
        }
    }, []);

    useEffect(() => {
        const sectionEls = Array.from(document.querySelectorAll<HTMLElement>('section[data-section]'));

        // Scroll listener for navbar background + hero detection
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
            const aboutAnchor = document.getElementById('about');
            if (aboutAnchor) {
                const aboutTop = aboutAnchor.getBoundingClientRect().top;
                setInHero(aboutTop > 80);
            }

            if (window.scrollY < 100) {
                setActiveSection('hero');
                return;
            }

            if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
                setActiveSection(sectionEls.at(-1)?.dataset.section || 'hero');
                return;
            }

            const activationLine = Number.parseFloat(window.getComputedStyle(sectionEls[0]).scrollMarginTop) || 80;
            const currentSection = sectionEls.reduce((current, section) => (
                section.getBoundingClientRect().top <= activationLine + 1 ? section : current
            ), sectionEls[0]);
            setActiveSection(currentSection.dataset.section || 'hero');
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            navigationCleanupRef.current?.();
        };
    }, []);

    // Color scheme based on section (hero = dark bg, rest = light bg)
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
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-1">
                <div className="hidden md:flex items-center gap-1">
                    {NAV_LINKS.map((link) => {
                        const isActive = activeSection === link.href.replace('#', '');
                        return (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={(event) => handleNavigation(event, link.href)}
                                className={`nav-link px-4 py-2 rounded-full transition-all duration-300 ${
                                    isActive
                                        ? 'text-[#e65c4f]'
                                        : `${textMuted} hover:text-[#e65c4f] ${hoverBg}`
                                }`}
                            >
                                {link.label}
                            </a>
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
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        onClick={(event) => handleNavigation(event, link.href)}
                                        className={`nav-link block w-full text-left px-4 py-3 rounded-xl transition-all ${
                                            isActive
                                                ? 'bg-[#e65c4f]/10 text-[#e65c4f]'
                                                : 'text-[#326789]/50 hover:text-[#e65c4f] hover:bg-[#326789]/5'
                                        }`}
                                    >
                                        {link.label}
                                    </a>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
