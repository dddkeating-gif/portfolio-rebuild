'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface GalleryItem {
    type: string;
    url: string;
    alt: string;
    filename?: string;
}

interface GalleryGridProps {
    items: GalleryItem[];
    columns?: number;
}

export default function GalleryGrid({ items, columns = 3 }: GalleryGridProps) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const imageItems = items.filter((item) => item.type === 'image');
    const embedItems = items.filter((item) => item.type === 'video-embed');

    return (
        <>
            {/* Image gallery */}
            {imageItems.length > 0 && (
                <div
                    className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
                    style={{ columnCount: columns }}
                >
                    {imageItems.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.5, delay: (index % 6) * 0.08 }}
                            className="break-inside-avoid cursor-pointer group"
                            onClick={() => setLightboxIndex(index)}
                        >
                            <div className="relative overflow-hidden rounded-xl bg-white/5 border border-white/5 transition-all duration-500 group-hover:border-cyan-500/30 group-hover:shadow-[0_0_30px_rgba(0,212,170,0.1)]">
                                <Image
                                    src={item.url}
                                    alt={item.alt}
                                    width={800}
                                    height={600}
                                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                                    loading="lazy"
                                    unoptimized
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Video embeds */}
            {embedItems.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    {embedItems.map((item, index) => (
                        <motion.div
                            key={`embed-${index}`}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5"
                        >
                            <div className="aspect-video">
                                <iframe
                                    src={item.url}
                                    className="w-full h-full"
                                    allow="autoplay; fullscreen"
                                    allowFullScreen
                                    loading="lazy"
                                />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                                <p className="text-sm text-white/70">{item.alt}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
                        onClick={() => setLightboxIndex(null)}
                    >
                        <button
                            className="absolute top-6 right-6 text-white/60 hover:text-white text-3xl z-[101]"
                            onClick={() => setLightboxIndex(null)}
                        >
                            ✕
                        </button>

                        {/* Prev/Next */}
                        {lightboxIndex > 0 && (
                            <button
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-4xl z-[101] p-2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setLightboxIndex(lightboxIndex - 1);
                                }}
                            >
                                ‹
                            </button>
                        )}
                        {lightboxIndex < imageItems.length - 1 && (
                            <button
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-4xl z-[101] p-2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setLightboxIndex(lightboxIndex + 1);
                                }}
                            >
                                ›
                            </button>
                        )}

                        <motion.div
                            key={lightboxIndex}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="max-w-[90vw] max-h-[90vh] relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={imageItems[lightboxIndex].url}
                                alt={imageItems[lightboxIndex].alt}
                                width={1600}
                                height={1200}
                                className="max-w-full max-h-[85vh] object-contain rounded-lg"
                                unoptimized
                            />
                            <p className="text-center text-white/50 text-sm mt-3">
                                {lightboxIndex + 1} / {imageItems.length}
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
