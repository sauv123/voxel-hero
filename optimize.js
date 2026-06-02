import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            await processDir(fullPath);
        } else if (/\.(png|jpg|jpeg|PNG)$/i.test(fullPath)) {
            const ext = path.extname(fullPath);
            const newPath = fullPath.substring(0, fullPath.lastIndexOf(ext)) + '.webp';
            try {
                await sharp(fullPath).webp({ quality: 80 }).toFile(newPath);
                console.log(`Converted: ${newPath}`);
                fs.unlinkSync(fullPath); // remove old file
            } catch (err) {
                console.error(`Failed to process ${fullPath}:`, err);
            }
        }
    }
}

async function run() {
    await processDir('public');
    await processDir('src/assets');
}

run();
