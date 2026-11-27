import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SOURCE_DIR = path.resolve('originals-backup/images');
const DEST_DIR = path.resolve('public/images');
const MAX_DIMENSION = 2400;
const RESPONSIVE_WIDTHS = [640, 1024, 1600];

async function getFiles(dir) {
  const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
    })
  );
  return files.flat().filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
}

async function run() {
  const files = await getFiles(SOURCE_DIR);
  console.log(`Found ${files.length} images to optimize.`);

  let totalBeforeBytes = 0;
  let totalAfterBytes = 0;
  let totalWebpBytes = 0;
  const report = [];

  for (const file of files) {
    const relPath = path.relative(SOURCE_DIR, file);
    const destPath = path.join(DEST_DIR, relPath);
    const parsed = path.parse(destPath);
    const webpPath = path.join(parsed.dir, `${parsed.name}.webp`);

    await fs.promises.mkdir(parsed.dir, { recursive: true });

    const beforeStat = await fs.promises.stat(file);
    totalBeforeBytes += beforeStat.size;

    const img = sharp(file);
    const meta = await img.metadata();

    let resizeWidth = meta.width;
    let resizeHeight = meta.height;

    if (relPath.includes('logo')) {
      resizeWidth = 600;
      resizeHeight = null;
    } else if (meta.width > MAX_DIMENSION || meta.height > MAX_DIMENSION) {
      if (meta.width >= meta.height) {
        resizeWidth = MAX_DIMENSION;
        resizeHeight = null;
      } else {
        resizeWidth = null;
        resizeHeight = MAX_DIMENSION;
      }
    }

    // 1. Write optimized original format (JPEG at 80% or PNG optimized)
    let optimizedPipeline = sharp(file);
    if (resizeWidth || resizeHeight) {
      optimizedPipeline = optimizedPipeline.resize(resizeWidth, resizeHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    const ext = parsed.ext.toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg') {
      await optimizedPipeline
        .jpeg({ quality: 80, mozjpeg: true })
        .toFile(destPath);
    } else if (ext === '.png') {
      await optimizedPipeline
        .png({ quality: 80, compressionLevel: 9 })
        .toFile(destPath);
    }

    const afterStat = await fs.promises.stat(destPath);
    totalAfterBytes += afterStat.size;

    // 2. Generate full-resolution WebP
    let webpPipeline = sharp(file);
    if (resizeWidth || resizeHeight) {
      webpPipeline = webpPipeline.resize(resizeWidth, resizeHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }
    await webpPipeline
      .webp({ quality: 80, effort: 6 })
      .toFile(webpPath);

    const webpStat = await fs.promises.stat(webpPath);
    totalWebpBytes += webpStat.size;

    // 3. Generate responsive WebP variants for srcset (excluding small brand logos)
    if (!relPath.includes('logo')) {
      for (const rw of RESPONSIVE_WIDTHS) {
        const respWebpPath = path.join(parsed.dir, `${parsed.name}-${rw}w.webp`);
        await sharp(file)
          .resize(rw, null, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 80, effort: 4 })
          .toFile(respWebpPath);
      }
    }

    report.push({
      file: relPath,
      origWidth: meta.width,
      origHeight: meta.height,
      beforeKb: (beforeStat.size / 1024).toFixed(1),
      afterKb: (afterStat.size / 1024).toFixed(1),
      webpKb: (webpStat.size / 1024).toFixed(1),
      reduction: (((beforeStat.size - webpStat.size) / beforeStat.size) * 100).toFixed(1),
    });
  }

  console.log('=== OPTIMIZATION COMPLETE ===');
  console.log(`Original total size: ${(totalBeforeBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Optimized source (JPG/PNG) total size: ${(totalAfterBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`WebP total size: ${(totalWebpBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total savings (WebP vs Original): ${(((totalBeforeBytes - totalWebpBytes) / totalBeforeBytes) * 100).toFixed(1)}%`);

  await fs.promises.writeFile('scripts/optimization-report.json', JSON.stringify(report, null, 2));
}

run().catch(console.error);
