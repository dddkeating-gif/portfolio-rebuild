import Image from 'next/image';

const screenshots = [
  {
    src: '/images/unveil/ingredient-carousel.jpg',
    alt: 'Unveil ingredient carousel showing the purpose and health information for Polysorbate 80',
    width: 1285,
    height: 851,
    className: 'sm:col-span-2',
  },
  {
    src: '/images/unveil/scan-ingredients.jpg',
    alt: 'Unveil home screen with a Scan Ingredients button',
    width: 1440,
    height: 2632,
    className: '',
  },
  {
    src: '/images/unveil/analysis-results.jpg',
    alt: 'Unveil analysis results showing 14 ingredients and their individual ingredient cards',
    width: 1440,
    height: 2650,
    className: '',
  },
];

export default function UnveilScreenshots({ standalone = false }: { standalone?: boolean }) {
  return (
    <div className="mt-16">
      <h3 className={`mb-8 text-xl font-bold ${standalone ? 'text-white/80' : 'text-[#326789]/80'}`}>
        Unveil
      </h3>
      <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {screenshots.map(({ src, alt, width, height, className }, index) => (
          <Image
            key={src}
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading={standalone && index === 0 ? 'eager' : 'lazy'}
            className={`h-auto w-full rounded-2xl border border-[#326789]/8 shadow-sm ${className}`}
          />
        ))}
      </div>
    </div>
  );
}
