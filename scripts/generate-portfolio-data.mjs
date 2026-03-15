/**
 * Generate portfolio-data.json from raw-scrape-data.json
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const raw = JSON.parse(fs.readFileSync(path.join(ROOT, 'raw-scrape-data.json'), 'utf-8'));

const data = {
    owner: {
        name: 'Jake Vallante',
        tagline: 'A millennial that baby boomers like',
    },
    sections: raw
        .filter((s) => s.media)
        .map((s) => ({
            slug: s.slug,
            title: s.title,
            items: [
                ...s.media.images.map((i) => ({
                    type: 'image',
                    url: '/' + i.localPath.replace(/\\/g, '/'),
                    alt: i.alt || s.title,
                    filename: i.filename,
                })),
                ...(s.iframes || []).map((f, idx) => ({
                    type: 'video-embed',
                    url: f.src,
                    alt: `${s.title} Video ${idx + 1}`,
                })),
                ...s.media.videos.map((v) => ({
                    type: 'video',
                    url: '/' + v.localPath.replace(/\\/g, '/'),
                    alt: s.title,
                })),
            ],
            links: s.links || [],
            text: s.textContent || { headings: [], paragraphs: [] },
        })),
};

const outPath = path.join(ROOT, 'src', 'data', 'portfolio-data.json');
fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
console.log(`✅ Generated ${outPath}`);
console.log(`   Sections: ${data.sections.length}`);
data.sections.forEach((s) => {
    console.log(`   - ${s.title}: ${s.items.length} items`);
});
