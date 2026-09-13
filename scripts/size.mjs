#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';

const distDir = process.argv[2] || 'dist';
const resolvedDist = path.resolve(distDir);

// Check if directory exists
if (!fs.existsSync(resolvedDist)) {
  console.error(`Error: Directory not found: ${resolvedDist}`);
  process.exit(1);
}

// Recursively find all .js files
function findJsFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findJsFiles(fullPath));
    } else if (entry.name.endsWith('.js')) {
      files.push(fullPath);
    }
  }
  return files;
}

// Get gzipped size of a file
async function getGzipSize(filePath) {
  return new Promise((resolve, reject) => {
    const tempPath = filePath + '.gz';
    const source = createReadStream(filePath);
    const gzip = createGzip();
    const dest = createWriteStream(tempPath);

    pipeline(source, gzip, dest)
      .then(() => {
        const stats = fs.statSync(tempPath);
        const size = stats.size;
        fs.unlinkSync(tempPath);
        resolve(size);
      })
      .catch(reject);
  });
}

// Main function
async function main() {
  try {
    const jsFiles = findJsFiles(resolvedDist).sort();

    if (jsFiles.length === 0) {
      console.warn('Warning: No .js files found in', resolvedDist);
      process.exit(0);
    }

    let totalSize = 0;

    console.log('File sizes (gzip):');
    for (const file of jsFiles) {
      const size = await getGzipSize(file);
      const relPath = path.relative(resolvedDist, file);
      const sizeKb = (size / 1024).toFixed(2);
      console.log(`  ${relPath}: ${sizeKb} KB`);
      totalSize += size;
    }

    const totalKb = (totalSize / 1024).toFixed(2);
    console.log(`\nTotal: ${totalKb} KB`);

    // Exit with code 1 if >= 150 KB
    if (totalSize >= 150 * 1024) {
      console.error(`Error: Total size (${totalKb} KB) exceeds 150 KB limit`);
      process.exit(1);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
