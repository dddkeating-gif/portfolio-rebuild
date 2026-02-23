import GalleryGrid from '@/components/GalleryGrid';
import SectionHeader from '@/components/SectionHeader';
import portfolioData from '@/data/portfolio-data.json';

export const metadata = {
    title: 'Animation & Video — Jake Vallante',
    description: 'Animation and video portfolio by Jake Vallante',
};

export default function AnimationPage() {
    const section = portfolioData.sections.find((s) => s.slug === 'animation');
    if (!section) return null;

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <SectionHeader
                title="Animation & Video"
                subtitle={`${section.items.filter((i) => i.type === 'video-embed').length} videos`}
            />
            <GalleryGrid items={section.items} />
        </div>
    );
}
