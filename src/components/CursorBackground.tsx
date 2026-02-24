'use client';

import { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    baseX: number;
    baseY: number;
    color: string;
    opacity: number;
}

const PARTICLE_COUNT = 120;
const CONNECTION_DIST = 150;
const MOUSE_RADIUS = 200;
const MOUSE_REPEL = 0.04;
const RETURN_SPEED = 0.008;
const DRIFT_SPEED = 0.3;

// Breeze palette for particles
const COLORS = [
    'rgba(121,165,200,', // #79a5c8
    'rgba(50,103,137,',  // #326789
    'rgba(148,180,210,', // blend
    'rgba(230,92,79,',   // #e65c4f (sparse)
];

export default function CursorBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouse = useRef({ x: -9999, y: -9999 });
    const particles = useRef<Particle[]>([]);
    const animId = useRef<number>(0);
    const dims = useRef({ w: 0, h: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d')!;

        /* ── Sizing ── */
        const resize = () => {
            dims.current.w = window.innerWidth;
            dims.current.h = window.innerHeight;
            canvas.width = dims.current.w * devicePixelRatio;
            canvas.height = dims.current.h * devicePixelRatio;
            canvas.style.width = `${dims.current.w}px`;
            canvas.style.height = `${dims.current.h}px`;
            ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
        };
        resize();

        /* ── Create particles ── */
        const initParticles = () => {
            const arr: Particle[] = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const x = Math.random() * dims.current.w;
                const y = Math.random() * dims.current.h;
                const isAccent = Math.random() < 0.06;
                arr.push({
                    x, y,
                    baseX: x,
                    baseY: y,
                    vx: (Math.random() - 0.5) * DRIFT_SPEED,
                    vy: (Math.random() - 0.5) * DRIFT_SPEED,
                    radius: Math.random() * 2 + 1,
                    color: isAccent ? COLORS[3] : COLORS[Math.floor(Math.random() * 3)],
                    opacity: Math.random() * 0.5 + 0.2,
                });
            }
            particles.current = arr;
        };
        initParticles();

        /* ── Mouse tracking ── */
        const onMouseMove = (e: MouseEvent) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;
        };
        const onMouseLeave = () => {
            mouse.current.x = -9999;
            mouse.current.y = -9999;
        };

        window.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseleave', onMouseLeave);
        window.addEventListener('resize', () => {
            resize();
            initParticles();
        });

        /* ── Animation loop ── */
        const draw = () => {
            const { w, h } = dims.current;
            const mx = mouse.current.x;
            const my = mouse.current.y;

            ctx.clearRect(0, 0, w, h);

            // Dark gradient background
            const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.7);
            grad.addColorStop(0, '#1a2a3a');
            grad.addColorStop(1, '#0d1821');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);

            const pts = particles.current;

            // Update positions
            for (const p of pts) {
                // Mouse repulsion
                const dx = p.x - mx;
                const dy = p.y - my;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < MOUSE_RADIUS && dist > 0) {
                    const force = (1 - dist / MOUSE_RADIUS) * MOUSE_REPEL;
                    p.vx += (dx / dist) * force * 50;
                    p.vy += (dy / dist) * force * 50;
                }

                // Return to base
                p.vx += (p.baseX - p.x) * RETURN_SPEED;
                p.vy += (p.baseY - p.y) * RETURN_SPEED;

                // Damping
                p.vx *= 0.95;
                p.vy *= 0.95;

                // Drift
                p.x += p.vx;
                p.y += p.vy;

                // Wrap
                if (p.x < -20) { p.x = w + 20; p.baseX = p.x; }
                if (p.x > w + 20) { p.x = -20; p.baseX = p.x; }
                if (p.y < -20) { p.y = h + 20; p.baseY = p.y; }
                if (p.y > h + 20) { p.y = -20; p.baseY = p.y; }
            }

            // Draw connections (particle-to-particle)
            for (let i = 0; i < pts.length; i++) {
                for (let j = i + 1; j < pts.length; j++) {
                    const dx = pts[i].x - pts[j].x;
                    const dy = pts[i].y - pts[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < CONNECTION_DIST) {
                        const alpha = (1 - dist / CONNECTION_DIST) * 0.12;
                        ctx.beginPath();
                        ctx.moveTo(pts[i].x, pts[i].y);
                        ctx.lineTo(pts[j].x, pts[j].y);
                        ctx.strokeStyle = `rgba(121,165,200,${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            // Draw connections to cursor
            for (const p of pts) {
                const dx = p.x - mx;
                const dy = p.y - my;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < MOUSE_RADIUS) {
                    const alpha = (1 - dist / MOUSE_RADIUS) * 0.35;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mx, my);
                    ctx.strokeStyle = `rgba(230,92,79,${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }

            // Draw particles
            for (const p of pts) {
                // Glow
                const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 4);
                glow.addColorStop(0, `${p.color}${p.opacity * 0.3})`);
                glow.addColorStop(1, `${p.color}0)`);
                ctx.fillStyle = glow;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
                ctx.fill();

                // Core dot
                ctx.fillStyle = `${p.color}${p.opacity})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
            }

            // Cursor glow
            if (mx > 0 && my > 0) {
                const cursorGlow = ctx.createRadialGradient(mx, my, 0, mx, my, 80);
                cursorGlow.addColorStop(0, 'rgba(230,92,79,0.06)');
                cursorGlow.addColorStop(0.5, 'rgba(121,165,200,0.03)');
                cursorGlow.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = cursorGlow;
                ctx.beginPath();
                ctx.arc(mx, my, 80, 0, Math.PI * 2);
                ctx.fill();
            }

            animId.current = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            cancelAnimationFrame(animId.current);
            window.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseleave', onMouseLeave);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0"
            style={{ pointerEvents: 'none' }}
        />
    );
}
