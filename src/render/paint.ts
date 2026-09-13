import type { DrawOp } from './layout/common';

export type { DrawOp };

const FONT_FAMILY: Record<'sans' | 'serif' | 'mono', string> = {
  sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  serif: 'Georgia, "Times New Roman", serif',
  mono: '"SF Mono", "Courier New", monospace',
};

function drawRect(ctx: CanvasRenderingContext2D, o: Extract<DrawOp, { op: 'rect' }>): void {
  ctx.save();
  if (o.alpha !== undefined) ctx.globalAlpha = o.alpha;
  ctx.fillStyle = o.fill;
  const r = o.r ?? 0;
  if (r > 0 && typeof ctx.roundRect === 'function') {
    ctx.beginPath();
    ctx.roundRect(o.x, o.y, o.w, o.h, r);
    ctx.fill();
  } else if (r > 0) {
    const rr = Math.min(r, o.w / 2, o.h / 2);
    ctx.beginPath();
    ctx.moveTo(o.x + rr, o.y);
    ctx.arcTo(o.x + o.w, o.y, o.x + o.w, o.y + o.h, rr);
    ctx.arcTo(o.x + o.w, o.y + o.h, o.x, o.y + o.h, rr);
    ctx.arcTo(o.x, o.y + o.h, o.x, o.y, rr);
    ctx.arcTo(o.x, o.y, o.x + o.w, o.y, rr);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.fillRect(o.x, o.y, o.w, o.h);
  }
  ctx.restore();
}

function drawText(ctx: CanvasRenderingContext2D, o: Extract<DrawOp, { op: 'text' }>): void {
  ctx.save();
  ctx.fillStyle = o.color;
  ctx.font = `${o.weight} ${o.size}px ${FONT_FAMILY[o.font]}`;
  ctx.textAlign = o.align;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(o.text, o.x, o.y);
  ctx.restore();
}

function drawDot(ctx: CanvasRenderingContext2D, o: Extract<DrawOp, { op: 'dot' }>): void {
  ctx.save();
  ctx.fillStyle = o.fill;
  ctx.beginPath();
  ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** Dịch danh sách DrawOp sang Canvas 2D. */
export function paint(ctx: CanvasRenderingContext2D, ops: DrawOp[]): void {
  for (const o of ops) {
    if (o.op === 'rect') drawRect(ctx, o);
    else if (o.op === 'text') drawText(ctx, o);
    else drawDot(ctx, o);
  }
}
