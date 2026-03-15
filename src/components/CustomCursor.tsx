'use client';

import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [cursorLabel, setCursorLabel] = useState('');
    const mouse = useRef({ x: 0, y: 0 });
    const dotPos = useRef({ x: 0, y: 0 });
    const ringPos = useRef({ x: 0, y: 0 });
    const rafRef = useRef<number>(0);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const interactive = target.closest('a, button, [data-cursor-label], [role="button"]');
            if (interactive) {
                setIsHovering(true);
                const label = interactive.getAttribute('data-cursor-label') || '';
                setCursorLabel(label);
            } else {
                setIsHovering(false);
                setCursorLabel('');
            }
        };

        const animate = () => {
            // Dot follows cursor tightly
            dotPos.current.x += (mouse.current.x - dotPos.current.x) * 0.35;
            dotPos.current.y += (mouse.current.y - dotPos.current.y) * 0.35;

            // Ring follows with more lag (elastic feel)
            ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.12;
            ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.12;

            if (dotRef.current) {
                dotRef.current.style.transform = `translate(${dotPos.current.x}px, ${dotPos.current.y}px) translate(-50%, -50%)`;
            }
            if (ringRef.current) {
                ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%)`;
            }

            rafRef.current = requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseover', handleMouseOver);
        rafRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseover', handleMouseOver);
            cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <>
            {/* Dot */}
            <div
                ref={dotRef}
                className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference hidden md:block"
                style={{
                    width: isHovering ? '8px' : '6px',
                    height: isHovering ? '8px' : '6px',
                    backgroundColor: '#fff',
                    borderRadius: '50%',
                    transition: 'width 0.3s, height 0.3s',
                }}
            />
            {/* Ring */}
            <div
                ref={ringRef}
                className="fixed top-0 left-0 z-[9998] pointer-events-none hidden md:block"
                style={{
                    width: isHovering && cursorLabel ? 'auto' : isHovering ? '50px' : '36px',
                    height: isHovering && cursorLabel ? 'auto' : isHovering ? '50px' : '36px',
                    border: cursorLabel ? 'none' : '1.5px solid rgba(50, 103, 137, 0.4)',
                    borderRadius: cursorLabel ? '9999px' : '50%',
                    backgroundColor: cursorLabel ? 'rgba(50, 103, 137, 0.9)' : 'transparent',
                    padding: cursorLabel ? '8px 20px' : '0',
                    transition: 'width 0.4s cubic-bezier(0.25,1,0.5,1), height 0.4s cubic-bezier(0.25,1,0.5,1), background-color 0.3s, border 0.3s, padding 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {cursorLabel && (
                    <span className="text-white text-xs font-medium whitespace-nowrap">
                        {cursorLabel}
                    </span>
                )}
            </div>
        </>
    );
}
