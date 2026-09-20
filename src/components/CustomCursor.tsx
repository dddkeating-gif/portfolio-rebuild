'use client';

import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
    const dotRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const mouse = useRef({ x: 0, y: 0 });
    const dotPos = useRef({ x: 0, y: 0 });
    const rafRef = useRef<number>(0);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            setIsHovering(Boolean(target.closest('a, button, [role="button"]')));
        };

        const animate = () => {
            // Dot follows cursor tightly
            dotPos.current.x += (mouse.current.x - dotPos.current.x) * 0.35;
            dotPos.current.y += (mouse.current.y - dotPos.current.y) * 0.35;

            if (dotRef.current) {
                dotRef.current.style.transform = `translate(${dotPos.current.x}px, ${dotPos.current.y}px) translate(-50%, -50%)`;
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
    );
}
