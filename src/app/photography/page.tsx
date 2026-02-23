import GalleryGrid from '@/components/GalleryGrid';
import SectionHeader from '@/components/SectionHeader';
import portfolioData from '@/data/portfolio-data.json';

export const metadata = {
    title: 'Photography — Jake Vallante',
    description: 'Photography portfolio by Jake Vallante',
};

export default function PhotographyPage() {
    const section = portfolioData.sections.find((s) => s.slug === 'photography');
    if (!section) return null;

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <SectionHeader
                title={section.title}
                subtitle={`${section.items.filter((i) => i.type === 'image').length} photographs`}
            />
            <GalleryGrid items={section.items} columns={3} />
        </div>
    );
}
