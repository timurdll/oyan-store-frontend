import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, "../src/assets/images");
const targetDir = path.join(__dirname, "../src/assets/images");

// Функция для конвертации одного изображения
async function convertToWebP(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .webp({
        quality: 90, // Высокое качество
        lossless: false, // Используем lossy сжатие для лучшего соотношения размер/качество
        effort: 6, // Максимальное усилие сжатия (0-6)
        preset: "photo", // Оптимизировано для фотографий
        alphaQuality: 100, // Максимальное качество для прозрачности
      })
      .toFile(outputPath);

    console.log(
      `✅ Converted: ${path.basename(inputPath)} -> ${path.basename(
        outputPath
      )}`
    );
  } catch (error) {
    console.error(`❌ Error converting ${inputPath}:`, error);
  }
}

// Функция для получения всех PNG файлов
function getPNGFiles(dir) {
  const files = fs.readdirSync(dir);
  return files.filter(
    (file) =>
      file.endsWith(".png") && // Берем все PNG файлы
      !file.endsWith(".webp") // Исключаем только WebP файлы
  );
}

// Основная функция
async function main() {
  console.log("🚀 Starting PNG to WebP conversion...");

  const pngFiles = getPNGFiles(sourceDir);
  console.log(`📁 Found ${pngFiles.length} PNG files to convert`);

  for (const file of pngFiles) {
    const inputPath = path.join(sourceDir, file);
    const outputPath = path.join(targetDir, file.replace(".png", ".webp"));

    // Проверяем, существует ли уже WebP версия
    if (!fs.existsSync(outputPath)) {
      await convertToWebP(inputPath, outputPath);
    } else {
      console.log(`⏭️ Skipping ${file} - WebP version already exists`);
    }
  }

  console.log("✨ Conversion completed!");
}

main().catch(console.error);
