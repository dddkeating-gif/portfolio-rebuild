/**
 * Bulk upload scraped assets to Vercel Blob storage.
 * 
 * Usage:
 *   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxx node scripts/upload-assets.mjs
 */

import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const ASSETS_DIR = path.join(PROJECT_ROOT, 'tmp-assets');
const PORTFOLIO_DATA_PATH = path.join(PROJECT_ROOT, 'src', 'data', 'portfolio-data.json');

const TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
if (!TOKEN) {
    console.error('❌ Missing BLOB_READ_WRITE_TOKEN environment variable');
    process.exit(1);
}

/**
 * Upload a single file to Vercel Blob.
 */
async function uploadFile(localPath, blobPath) {
    const fileBuffer = fs.readFileSync(localPath);
    const contentType = getContentType(localPath);

    const blob = await put(blobPath, fileBuffer, {
        access: 'public',
        token: TOKEN,
        contentType,
    });

    return blob.url;
}

/**
 * Determine content type from file extension.
 */
function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const types = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
        '.mp4': 'video/mp4',
        '.webm': 'video/webm',
        '.mov': 'video/quicktime',
    };
    return types[ext] || 'application/octet-stream';
}

/**
 * Recursively get all files in a directory.
 */
function getAllFiles(dir, baseDir = dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...getAllFiles(fullPath, baseDir));
        } else {
            files.push({
                localPath: fullPath,
                relativePath: path.relative(baseDir, fullPath).replace(/\\/g, '/'),
            });
        }
    }
    return files;
}

// ═══════════════════════════
//  MAIN
// ═══════════════════════════
async function main() {
    console.log('🚀 Starting Vercel Blob upload...\n');

    // Get all files to upload
    const files = getAllFiles(ASSETS_DIR);
    console.log(`📁 Found ${files.length} files to upload\n`);

    // Upload map: old local URL -> new blob URL
    const urlMap = new Map();
    let uploaded = 0;
    let failed = 0;

    for (const file of files) {
        const blobPath = `portfolio/${file.relativePath}`;
        try {
            process.stdout.write(`  ⬆️  [${uploaded + failed + 1}/${files.length}] ${file.relativePath}...`);
            const blobUrl = await uploadFile(file.localPath, blobPath);
            const localUrlKey = `/tmp-assets/${file.relativePath}`;
            urlMap.set(localUrlKey, blobUrl);
            uploaded++;
            console.log(` ✅`);
        } catch (err) {
            failed++;
            console.log(` ❌ ${err.message}`);
        }
    }

    console.log(`\n════════════════════════════════`);
    console.log(`📊 UPLOAD SUMMARY`);
    console.log(`════════════════════════════════`);
    console.log(`  ✅ Uploaded: ${uploaded}`);
    console.log(`  ❌ Failed: ${failed}`);
    console.log(`  📁 Total: ${files.length}\n`);

    // Update portfolio-data.json with new URLs
    console.log('📝 Updating portfolio-data.json with Vercel Blob URLs...');
    const portfolioData = JSON.parse(fs.readFileSync(PORTFOLIO_DATA_PATH, 'utf-8'));

    let replaced = 0;
    for (const section of portfolioData.sections) {
        for (const item of section.items) {
            if (item.url && urlMap.has(item.url)) {
                item.url = urlMap.get(item.url);
                replaced++;
            }
        }
    }

    fs.writeFileSync(PORTFOLIO_DATA_PATH, JSON.stringify(portfolioData, null, 2));
    console.log(`  ✅ Updated ${replaced} URLs in portfolio-data.json`);

    // Save URL map for reference
    const mapPath = path.join(PROJECT_ROOT, 'url-map.json');
    const mapObj = Object.fromEntries(urlMap);
    fs.writeFileSync(mapPath, JSON.stringify(mapObj, null, 2));
    console.log(`  📄 URL map saved to: ${mapPath}`);

    console.log('\n✨ Done! Your assets are now hosted on Vercel Blob.');
    console.log('   Restart the dev server to see the changes.');
}

main().catch(console.error);
