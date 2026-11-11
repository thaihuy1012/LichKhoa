import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

function removeCommentsPreservingOffsets(code: string): string {
  let result = '';
  let i = 0;
  while (i < code.length) {
    if (code[i] === "'" || code[i] === '"' || code[i] === '`') {
      const quote = code[i];
      result += quote;
      i++;
      while (i < code.length) {
        if (code[i] === '\\') {
          result += code[i] + (code[i + 1] ?? '');
          i += 2;
        } else if (code[i] === quote) {
          result += quote;
          i++;
          break;
        } else {
          result += code[i];
          i++;
        }
      }
    } else if (code[i] === '/' && code[i + 1] === '/') {
      result += '  ';
      i += 2;
      while (i < code.length && code[i] !== '\n') {
        result += ' ';
        i++;
      }
    } else if (code[i] === '/' && code[i + 1] === '*') {
      result += '  ';
      i += 2;
      while (i < code.length && !(code[i] === '*' && code[i + 1] === '/')) {
        result += code[i] === '\n' ? '\n' : ' ';
        i++;
      }
      result += '  ';
      i += 2;
    } else {
      result += code[i];
      i++;
    }
  }
  return result;
}

export function findWaitForFunctionPromiseViolations(code: string): { line: number; snippet: string }[] {
  const clean = removeCommentsPreservingOffsets(code);
  const violations: { line: number; snippet: string }[] = [];
  const regex = /\bwaitForFunction\s*\(/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(clean)) !== null) {
    const startIdx = match.index + match[0].length;
    let depth = 1;
    let i = startIdx;
    let firstArg = '';

    while (i < clean.length && depth > 0) {
      const char = clean[i];
      if (char === '(' || char === '{' || char === '[') depth++;
      else if (char === ')' || char === '}' || char === ']') depth--;

      if (depth === 1 && char === ',' && firstArg === '') {
        firstArg = clean.slice(startIdx, i);
      }
      i++;
    }
    if (firstArg === '') {
      firstArg = clean.slice(startIdx, Math.max(startIdx, i - 1));
    }

    if (/\bnew\s+Promise\b/.test(firstArg)) {
      const line = code.slice(0, match.index).split('\n').length;
      violations.push({
        line,
        snippet: code.slice(match.index, Math.min(code.length, match.index + 120)).trim(),
      });
    }
  }

  return violations;
}

describe('E2E waitForFunction guard', () => {
  const projectRoot = path.resolve(__dirname, '../..');
  const e2eDir = path.resolve(projectRoot, 'tests/e2e');

  it('không có file tests/e2e/*.ts nào dùng waitForFunction với hàm trả về new Promise', () => {
    const files = fs.readdirSync(e2eDir).filter((f) => f.endsWith('.ts'));
    const allViolations: string[] = [];

    for (const file of files) {
      const fullPath = path.join(e2eDir, file);
      const content = fs.readFileSync(fullPath, 'utf-8');
      const violations = findWaitForFunctionPromiseViolations(content);
      for (const v of violations) {
        allViolations.push(`${file}:${v.line}`);
      }
    }

    expect(
      allViolations,
      `Phát hiện waitForFunction truyền hàm trả về new Promise (Playwright không chờ Promise predicate): ${allViolations.join(', ')}`,
    ).toEqual([]);
  });
});
