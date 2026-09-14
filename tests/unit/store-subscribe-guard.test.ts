import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

function findSourceFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findSourceFiles(fullPath));
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
      files.push(fullPath);
    }
  }
  return files;
}

describe('Store subscribe guard', () => {
  const projectRoot = path.resolve(__dirname, '../..');
  const srcDir = path.resolve(projectRoot, 'src');

  it('chuỗi .subscribe( chỉ xuất hiện trong src/ui/store.ts và src/ui/useStoreState.ts', () => {
    const allFiles = findSourceFiles(srcDir);
    const violatingFiles: string[] = [];

    const allowedFiles = new Set([
      'src/ui/store.ts',
      'src/ui/useStoreState.ts',
    ]);

    for (const filePath of allFiles) {
      const relPath = path.relative(projectRoot, filePath).replace(/\\/g, '/');
      const content = fs.readFileSync(filePath, 'utf-8');
      if (content.includes('.subscribe(')) {
        if (!allowedFiles.has(relPath)) {
          violatingFiles.push(relPath);
        }
      }
    }

    expect(
      violatingFiles,
      `Phát hiện các file sau gọi trực tiếp .subscribe( thay vì dùng useStoreState: ${violatingFiles.join(', ')}`,
    ).toEqual([]);
  });

  it('src/ui/useStoreState.ts chứa useLayoutEffect và không chứa useEffect(', () => {
    const filePath = path.resolve(srcDir, 'ui/useStoreState.ts');
    const content = fs.readFileSync(filePath, 'utf-8');
    expect(content).toContain('useLayoutEffect');
    expect(content).not.toContain('useEffect(');
  });
});
