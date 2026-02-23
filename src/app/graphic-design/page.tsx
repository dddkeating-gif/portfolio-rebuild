import GalleryGrid from '@/components/GalleryGrid';
import SectionHeader from '@/components/SectionHeader';
import portfolioData from '@/data/portfolio-data.json';

export const metadata = {
    title: 'Graphic Design — Jake Vallante',
    description: 'Graphic design portfolio by Jake Vallante',
};

export default function GraphicDesignPage() {
    const section = portfolioData.sections.find((s) => s.slug === 'graphic-design');
    if (!section) return null;

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <SectionHeader
                title={section.title}
                subtitle={`${section.items.filter((i) => i.type === 'image').length} works`}
            />
            <GalleryGrid items={section.items} columns={3} />
        </div>
    );
}
