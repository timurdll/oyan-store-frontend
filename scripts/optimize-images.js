import { readdir, stat } from "fs/promises";
import { join, extname, resolve } from "path";
import sharp from "sharp";

const QUALITY = 80;
const MAX_WIDTH = {
  thumbnail: 400,
  medium: 800,
  large: 1200,
};

async function* getFiles(dir) {
  try {
    const dirents = await readdir(dir, { withFileTypes: true });
    for (const dirent of dirents) {
      const res = join(dir, dirent.name);
      if (dirent.isDirectory()) {
        yield* getFiles(res);
      } else {
        yield res;
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }
}

async function optimizeImage(filePath) {
  const ext = extname(filePath).toLowerCase();
  if (![".png", ".jpg", ".jpeg", ".webp"].includes(ext)) {
    return;
  }

  try {
    const stats = await stat(filePath);
    const fileSizeInMB = stats.size / (1024 * 1024);

    if (fileSizeInMB < 0.1) {
      // Skip files smaller than 100KB
      return;
    }

    const image = sharp(filePath);
    const metadata = await image.metadata();

    // Create WebP versions
    for (const [size, maxWidth] of Object.entries(MAX_WIDTH)) {
      if (metadata.width > maxWidth) {
        const optimizedPath = filePath.replace(/\.[^.]+$/, `-${size}.webp`);
        await image
          .resize(maxWidth, null, { fit: "inside" })
          .webp({ quality: QUALITY })
          .toFile(optimizedPath);
        console.log(`Created optimized version: ${optimizedPath}`);
      }
    }

    // Optimize original
    if (metadata.width > MAX_WIDTH.large) {
      const webpPath = filePath.replace(/\.[^.]+$/, ".webp");
      await image
        .resize(MAX_WIDTH.large, null, { fit: "inside" })
        .webp({ quality: QUALITY })
        .toFile(webpPath);
      console.log(`Created WebP version: ${webpPath}`);
    }
  } catch (error) {
    console.error(`Error processing image ${filePath}:`, error);
  }
}

async function main() {
  // Use resolve to handle paths with special characters
  const srcDir = resolve(process.cwd(), "src");
  console.log("Processing images in:", srcDir);

  for await (const file of getFiles(srcDir)) {
    try {
      await optimizeImage(file);
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }
}

main().catch(console.error);
