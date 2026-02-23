'use client';

import { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';

const PARTICLE_COUNT = 2000;
const MOUSE_RADIUS = 150;
const RETURN_SPEED = 0.02;
const MOUSE_FORCE = 0.08;

export default function ParticleBackground() {
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const animationIdRef = useRef<number>(0);

    const onMouseMove = useCallback((e: MouseEvent) => {
        mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }, []);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 300;

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 1);
        container.appendChild(renderer.domElement);

        // Create particles
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(PARTICLE_COUNT * 3);
        const originalPositions = new Float32Array(PARTICLE_COUNT * 3);
        const velocities = new Float32Array(PARTICLE_COUNT * 3);
        const sizes = new Float32Array(PARTICLE_COUNT);
        const colors = new Float32Array(PARTICLE_COUNT * 3);

        // Color palette — subtle blues, purples, teals
        const palette = [
            new THREE.Color(0x4a9eff), // blue
            new THREE.Color(0x7b68ee), // medium slate blue
            new THREE.Color(0x00d4aa), // teal
            new THREE.Color(0x9966ff), // purple
            new THREE.Color(0x66ccff), // light blue
            new THREE.Color(0xffffff), // white
        ];

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3;
            const x = (Math.random() - 0.5) * width * 0.8;
            const y = (Math.random() - 0.5) * height * 0.8;
            const z = (Math.random() - 0.5) * 200;

            positions[i3] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;

            originalPositions[i3] = x;
            originalPositions[i3 + 1] = y;
            originalPositions[i3 + 2] = z;

            velocities[i3] = 0;
            velocities[i3 + 1] = 0;
            velocities[i3 + 2] = 0;

            sizes[i] = Math.random() * 3 + 0.5;

            const color = palette[Math.floor(Math.random() * palette.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Shader material for glowing particles
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uPixelRatio: { value: renderer.getPixelRatio() },
            },
            vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vOpacity;
        uniform float uTime;
        uniform float uPixelRatio;

        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float depth = -mvPosition.z / 300.0;
          vOpacity = mix(0.9, 0.15, clamp(depth, 0.0, 1.0));
          gl_PointSize = size * uPixelRatio * (200.0 / -mvPosition.z);
          gl_PointSize = max(gl_PointSize, 1.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
            fragmentShader: `
        varying vec3 vColor;
        varying float vOpacity;

        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          float alpha = smoothstep(0.5, 0.1, d) * vOpacity;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        // Animation loop
        let time = 0;
        const animate = () => {
            animationIdRef.current = requestAnimationFrame(animate);
            time += 0.005;
            material.uniforms.uTime.value = time;

            const posAttr = geometry.attributes.position as THREE.BufferAttribute;
            const posArray = posAttr.array as Float32Array;

            // Mouse position in world coordinates
            const mouseWorldX = mouseRef.current.x * width * 0.4;
            const mouseWorldY = mouseRef.current.y * height * 0.4;

            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const i3 = i * 3;

                // Distance to mouse
                const dx = posArray[i3] - mouseWorldX;
                const dy = posArray[i3 + 1] - mouseWorldY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < MOUSE_RADIUS) {
                    // Repulsion from mouse
                    const force = (1 - dist / MOUSE_RADIUS) * MOUSE_FORCE;
                    velocities[i3] += (dx / dist) * force * 30;
                    velocities[i3 + 1] += (dy / dist) * force * 30;
                }

                // Spring back to original position
                velocities[i3] += (originalPositions[i3] - posArray[i3]) * RETURN_SPEED;
                velocities[i3 + 1] += (originalPositions[i3 + 1] - posArray[i3 + 1]) * RETURN_SPEED;
                velocities[i3 + 2] += (originalPositions[i3 + 2] - posArray[i3 + 2]) * RETURN_SPEED;

                // Damping
                velocities[i3] *= 0.92;
                velocities[i3 + 1] *= 0.92;
                velocities[i3 + 2] *= 0.92;

                // Gentle floating drift
                velocities[i3] += Math.sin(time * 2 + i * 0.01) * 0.03;
                velocities[i3 + 1] += Math.cos(time * 1.5 + i * 0.01) * 0.03;

                // Update positions
                posArray[i3] += velocities[i3];
                posArray[i3 + 1] += velocities[i3 + 1];
                posArray[i3 + 2] += velocities[i3 + 2];
            }

            posAttr.needsUpdate = true;

            // Subtle rotation
            particles.rotation.z = Math.sin(time * 0.3) * 0.02;

            renderer.render(scene, camera);
        };

        animate();

        // Event listeners
        window.addEventListener('mousemove', onMouseMove);

        const handleResize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationIdRef.current);
            renderer.dispose();
            geometry.dispose();
            material.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, [onMouseMove]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-0"
            style={{ pointerEvents: 'none' }}
        />
    );
}
