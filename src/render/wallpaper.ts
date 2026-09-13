import type { AppState, ISODate } from '../core/model';
import { collectRenderData } from '../core/collect';
import { paint, type DrawOp } from './paint';
import { layoutMonth } from './layout/month';
import { layoutAgenda } from './layout/agenda';
import { layoutTodo } from './layout/todo';
import { layoutNote } from './layout/note';

declare global {
  interface Window {
    __lastOps?: DrawOp[];
  }
}

function makeCanvas(w: number, h: number): { canvas: OffscreenCanvas | HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  if (typeof OffscreenCanvas !== 'undefined') {
    const canvas = new OffscreenCanvas(w, h);
    const ctx = canvas.getContext('2d') as unknown as CanvasRenderingContext2D;
    return { canvas, ctx };
  }
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  return { canvas, ctx };
}

function canvasToBlob(canvas: OffscreenCanvas | HTMLCanvasElement): Promise<Blob> {
  if (typeof OffscreenCanvas !== 'undefined' && canvas instanceof OffscreenCanvas) {
    return canvas.convertToBlob({ type: 'image/png' });
  }
  return new Promise((resolve, reject) => {
    (canvas as HTMLCanvasElement).toBlob((b) => {
      if (b) resolve(b);
      else reject(new Error('toBlob thất bại'));
    }, 'image/png');
  });
}

function paintBackground(ctx: CanvasRenderingContext2D, state: AppState): void {
  const { bg } = state.design;
  const w = state.device.width;
  const h = state.device.height;
  if (bg.kind === 'gradient' && bg.color2) {
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, bg.color);
    grad.addColorStop(1, bg.color2);
    ctx.fillStyle = grad;
  } else {
    ctx.fillStyle = bg.color;
  }
  ctx.fillRect(0, 0, w, h);
}

/** Gom dữ liệu + dựng danh sách lệnh vẽ theo bố cục đã chọn (`design.layout`) + dải ghi chú. Hàm thuần, không cần canvas. */
export function buildOps(state: AppState, today: ISODate): DrawOp[] {
  const data = collectRenderData(state, today);
  const { design, device } = state;

  let ops: DrawOp[];
  if (design.layout === 'agenda') ops = layoutAgenda(data, design, device);
  else if (design.layout === 'todo') ops = layoutTodo(data, design, device);
  else ops = layoutMonth(data, design, device);

  return [...ops, ...layoutNote(data, design, device)];
}

/** Vẽ hình nền theo state; trả về Blob PNG đúng kích thước thiết bị. M1: bỏ qua ảnh nền (bg tham số), chỉ dùng state.design.bg solid/gradient. */
export async function renderWallpaper(state: AppState, _bg: Blob | null, today: string): Promise<Blob> {
  const { canvas, ctx } = makeCanvas(state.device.width, state.device.height);

  paintBackground(ctx, state);

  const ops = buildOps(state, today);
  paint(ctx, ops);

  if (typeof window !== 'undefined' && window.location.search.includes('test=1')) {
    window.__lastOps = ops;
  }

  return canvasToBlob(canvas);
}
