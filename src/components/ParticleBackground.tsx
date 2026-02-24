'use client';

import { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';

const PARTICLE_COUNT = 1400;
const MOUSE_RADIUS = 160;
const RETURN_SPEED = 0.018;
const MOUSE_FORCE = 0.07;

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

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 300;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        // Breeze light background
        renderer.setClearColor(0xe9eef4, 1);
        container.appendChild(renderer.domElement);

        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(PARTICLE_COUNT * 3);
        const originalPositions = new Float32Array(PARTICLE_COUNT * 3);
        const velocities = new Float32Array(PARTICLE_COUNT * 3);
        const sizes = new Float32Array(PARTICLE_COUNT);
        const colors = new Float32Array(PARTICLE_COUNT * 3);

        // Breeze palette particles
        const palette = [
            new THREE.Color(0x326789), // dark teal
            new THREE.Color(0x79a5c8), // mid blue
            new THREE.Color(0x4a7fa5), // blend
            new THREE.Color(0x5b8db5), // blend
            new THREE.Color(0xe65c4f), // coral accent (sparse)
            new THREE.Color(0x92b8d6), // light teal
        ];

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * width * 0.85;
            positions[i3 + 1] = (Math.random() - 0.5) * height * 0.85;
            positions[i3 + 2] = (Math.random() - 0.5) * 200;

            originalPositions[i3] = positions[i3];
            originalPositions[i3 + 1] = positions[i3 + 1];
            originalPositions[i3 + 2] = positions[i3 + 2];

            velocities[i3] = velocities[i3 + 1] = velocities[i3 + 2] = 0;
            sizes[i] = Math.random() * 3 + 0.5;

            // Coral particles are rare (~8%)
            const colorIdx = Math.random() < 0.08 ? 4 : Math.floor(Math.random() * 4);
            const color = palette[colorIdx];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

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
        uniform float uPixelRatio;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float depth = -mvPosition.z / 300.0;
          vOpacity = mix(0.5, 0.08, clamp(depth, 0.0, 1.0));
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
            blending: THREE.NormalBlending,
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        let time = 0;
        const animate = () => {
            animationIdRef.current = requestAnimationFrame(animate);
            time += 0.005;
            material.uniforms.uTime.value = time;

            const posAttr = geometry.attributes.position as THREE.BufferAttribute;
            const posArray = posAttr.array as Float32Array;
            const mx = mouseRef.current.x * width * 0.4;
            const my = mouseRef.current.y * height * 0.4;

            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const i3 = i * 3;
                const dx = posArray[i3] - mx;
                const dy = posArray[i3 + 1] - my;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < MOUSE_RADIUS) {
                    const force = (1 - dist / MOUSE_RADIUS) * MOUSE_FORCE;
                    velocities[i3] += (dx / dist) * force * 30;
                    velocities[i3 + 1] += (dy / dist) * force * 30;
                }

                velocities[i3] += (originalPositions[i3] - posArray[i3]) * RETURN_SPEED;
                velocities[i3 + 1] += (originalPositions[i3 + 1] - posArray[i3 + 1]) * RETURN_SPEED;
                velocities[i3 + 2] += (originalPositions[i3 + 2] - posArray[i3 + 2]) * RETURN_SPEED;
                velocities[i3] *= 0.92;
                velocities[i3 + 1] *= 0.92;
                velocities[i3 + 2] *= 0.92;
                velocities[i3] += Math.sin(time * 2 + i * 0.01) * 0.025;
                velocities[i3 + 1] += Math.cos(time * 1.5 + i * 0.01) * 0.025;
                posArray[i3] += velocities[i3];
                posArray[i3 + 1] += velocities[i3 + 1];
                posArray[i3 + 2] += velocities[i3 + 2];
            }

            posAttr.needsUpdate = true;
            particles.rotation.z = Math.sin(time * 0.3) * 0.015;
            renderer.render(scene, camera);
        };
        animate();

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
            if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
        };
    }, [onMouseMove]);

    return <div ref={containerRef} className="fixed inset-0 z-0" style={{ pointerEvents: 'none' }} />;
}
