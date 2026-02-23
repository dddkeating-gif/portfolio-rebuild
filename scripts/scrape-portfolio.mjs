/**
 * Portfolio Scraper for thejake.design
 * Uses Playwright to scrape all media and text from the Adobe Portfolio site.
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const ASSETS_DIR = path.join(PROJECT_ROOT, 'tmp-assets');

const BASE_URL = 'https://thejake.design';
const PAGES = [
    { slug: 'home', url: BASE_URL, title: 'Home' },
    { slug: 'about', url: `${BASE_URL}/about`, title: 'About' },
    { slug: 'graphic-design', url: `${BASE_URL}/graphic-design-1`, title: 'Graphic Design' },
    { slug: 'animation', url: `${BASE_URL}/animation`, title: 'Animation & Video' },
    { slug: 'photography', url: `${BASE_URL}/portfolio-photography`, title: 'Photography' },
    { slug: 'coding', url: `${BASE_URL}/coding`, title: 'Coding' },
    { slug: 'contact', url: `${BASE_URL}/contact`, title: 'Contact' },
];

/**
 * Download a file from a URL to a local path.
 */
function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const dir = path.dirname(dest);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const protocol = url.startsWith('https') ? https : http;
        const request = protocol.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
            // Follow redirects
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                downloadFile(response.headers.location, dest).then(resolve).catch(reject);
                return;
            }
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${url}: status ${response.statusCode}`));
                return;
            }
            const file = fs.createWriteStream(dest);
            response.pipe(file);
            file.on('finish', () => { file.close(); resolve(dest); });
            file.on('error', (err) => { fs.unlink(dest, () => { }); reject(err); });
        });
        request.on('error', reject);
        request.setTimeout(30000, () => { request.destroy(); reject(new Error(`Timeout downloading ${url}`)); });
    });
}

/**
 * Extract file extension from a URL.
 */
function getExtFromUrl(url) {
    try {
        const pathname = new URL(url).pathname;
        const ext = path.extname(pathname);
        if (ext && ext.length <= 5) return ext;
        // Guess from query params
        if (url.includes('type=mp4')) return '.mp4';
        if (url.includes('type=webm')) return '.webm';
        return '.jpg'; // default for images
    } catch {
        return '.jpg';
    }
}

/**
 * Auto-scroll to trigger lazy loading.
 */
async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 400;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 200);
        });
    });
    // Wait a bit for lazy images to finish loading
    await page.waitForTimeout(2000);
    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
}

/**
 * Extract media and text from a page.
 */
async function scrapePage(page, pageInfo) {
    console.log(`\n📄 Scraping: ${pageInfo.title} (${pageInfo.url})`);
    await page.goto(pageInfo.url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    // Auto-scroll to trigger lazy loading
    await autoScroll(page);
    await page.waitForTimeout(2000);

    // Extract images
    const images = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        return imgs
            .map((img) => ({
                src: img.src || img.dataset.src || '',
                alt: img.alt || '',
                width: img.naturalWidth || img.width || 0,
                height: img.naturalHeight || img.height || 0,
            }))
            .filter((img) => img.src && !img.src.startsWith('data:') && img.src.includes('cdn.myportfolio.com'));
    });

    // Extract videos (direct <video> elements)
    const videos = await page.evaluate(() => {
        const vids = Array.from(document.querySelectorAll('video'));
        const results = [];
        for (const vid of vids) {
            const sources = Array.from(vid.querySelectorAll('source'));
            if (sources.length > 0) {
                for (const src of sources) {
                    if (src.src) results.push({ src: src.src, type: src.type || '' });
                }
            } else if (vid.src) {
                results.push({ src: vid.src, type: vid.type || '' });
            }
        }
        return results.filter((v) => v.src && !v.src.startsWith('data:'));
    });

    // Extract video iframes (Adobe CCV player)
    const iframes = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('iframe'))
            .map((iframe) => ({ src: iframe.src || '' }))
            .filter((f) => f.src && f.src.includes('adobe.io'));
    });

    // Extract text content
    const textContent = await page.evaluate(() => {
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4'))
            .map((h) => ({ tag: h.tagName.toLowerCase(), text: h.textContent.trim() }))
            .filter((h) => h.text);
        const paragraphs = Array.from(document.querySelectorAll('.page-content p, .page-content .text-block, [data-testid] p'))
            .map((p) => p.textContent.trim())
            .filter((t) => t);
        return { headings, paragraphs };
    });

    // Extract links (for coding page projects)
    const links = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.page-content a, [data-testid] a'))
            .map((a) => ({ href: a.href, text: a.textContent.trim() }))
            .filter((l) => l.href && l.text && !l.href.includes('thejake.design'));
    });

    console.log(`  📸 Images: ${images.length}`);
    console.log(`  🎬 Videos: ${videos.length}`);
    console.log(`  🖼️  Iframes: ${iframes.length}`);
    console.log(`  📝 Headings: ${textContent.headings.length}`);

    return {
        ...pageInfo,
        images,
        videos,
        iframes,
        textContent,
        links,
    };
}

/**
 * Download all media for a section.
 */
async function downloadSectionMedia(sectionData) {
    const sectionDir = path.join(ASSETS_DIR, sectionData.slug);
    if (!fs.existsSync(sectionDir)) fs.mkdirSync(sectionDir, { recursive: true });

    const downloadedImages = [];
    const downloadedVideos = [];

    // Deduplicate images by URL
    const uniqueImages = [...new Map(sectionData.images.map((img) => [img.src, img])).values()];

    for (let i = 0; i < uniqueImages.length; i++) {
        const img = uniqueImages[i];
        const ext = getExtFromUrl(img.src);
        const filename = `img-${String(i + 1).padStart(3, '0')}${ext}`;
        const dest = path.join(sectionDir, filename);

        try {
            console.log(`  ⬇️  Downloading image ${i + 1}/${uniqueImages.length}: ${filename}`);
            await downloadFile(img.src, dest);
            downloadedImages.push({
                localPath: path.relative(PROJECT_ROOT, dest).replace(/\\/g, '/'),
                originalUrl: img.src,
                alt: img.alt,
                filename,
            });
        } catch (err) {
            console.warn(`  ⚠️  Failed to download image: ${img.src} — ${err.message}`);
        }
    }

    // Download direct MP4 videos
    const uniqueVideos = [...new Map(sectionData.videos.map((v) => [v.src, v])).values()];
    for (let i = 0; i < uniqueVideos.length; i++) {
        const vid = uniqueVideos[i];
        const ext = getExtFromUrl(vid.src);
        const filename = `vid-${String(i + 1).padStart(3, '0')}${ext}`;
        const dest = path.join(sectionDir, filename);

        try {
            console.log(`  ⬇️  Downloading video ${i + 1}/${uniqueVideos.length}: ${filename}`);
            await downloadFile(vid.src, dest);
            downloadedVideos.push({
                localPath: path.relative(PROJECT_ROOT, dest).replace(/\\/g, '/'),
                originalUrl: vid.src,
                type: vid.type,
                filename,
            });
        } catch (err) {
            console.warn(`  ⚠️  Failed to download video: ${vid.src} — ${err.message}`);
        }
    }

    return { downloadedImages, downloadedVideos };
}

// ═══════════════════════════════
//  MAIN
// ═══════════════════════════════
async function main() {
    console.log('🚀 Starting portfolio scrape...\n');

    // Clean up previous run
    if (fs.existsSync(ASSETS_DIR)) {
        fs.rmSync(ASSETS_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(ASSETS_DIR, { recursive: true });

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });

    const page = await context.newPage();
    const allData = [];

    for (const pageInfo of PAGES) {
        try {
            const scraped = await scrapePage(page, pageInfo);
            const { downloadedImages, downloadedVideos } = await downloadSectionMedia(scraped);

            allData.push({
                slug: scraped.slug,
                title: scraped.title,
                url: scraped.url,
                textContent: scraped.textContent,
                links: scraped.links,
                iframes: scraped.iframes,
                media: {
                    images: downloadedImages,
                    videos: downloadedVideos,
                },
                stats: {
                    totalImagesFound: scraped.images.length,
                    totalVideosFound: scraped.videos.length,
                    totalIframesFound: scraped.iframes.length,
                    imagesDownloaded: downloadedImages.length,
                    videosDownloaded: downloadedVideos.length,
                },
            });
        } catch (err) {
            console.error(`❌ Error scraping ${pageInfo.title}: ${err.message}`);
            allData.push({
                slug: pageInfo.slug,
                title: pageInfo.title,
                url: pageInfo.url,
                error: err.message,
                media: { images: [], videos: [] },
            });
        }
    }

    await browser.close();

    // Write raw scrape data
    const outputPath = path.join(PROJECT_ROOT, 'raw-scrape-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(allData, null, 2));

    // Print summary
    console.log('\n════════════════════════════════');
    console.log('📊 SCRAPE SUMMARY');
    console.log('════════════════════════════════');
    for (const section of allData) {
        if (section.error) {
            console.log(`  ❌ ${section.title}: ERROR — ${section.error}`);
        } else {
            console.log(`  ✅ ${section.title}: ${section.stats.imagesDownloaded} images, ${section.stats.videosDownloaded} videos`);
        }
    }
    console.log(`\n📁 Assets saved to: ${ASSETS_DIR}`);
    console.log(`📄 Manifest saved to: ${outputPath}`);
    console.log('\n✨ Done!');
}

main().catch(console.error);
