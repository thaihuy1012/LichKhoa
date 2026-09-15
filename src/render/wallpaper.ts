import type { AppState, ISODate } from '../core/model';
import { collectRenderData } from '../core/collect';
import { paint, type DrawOp } from './paint';
import { layoutMonth } from './layout/month';
import { layoutAgenda } from './layout/agenda';
import { layoutTodo } from './layout/todo';
import { layoutWeek } from './layout/week';
import { layoutNote } from './layout/note';
import { decodeImage, drawBackground, makeCanvas, canvasToBlob, closeImage } from './background';

declare global {
  interface Window {
    __lastOps?: DrawOp[];
  }
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
  else if (design.layout === 'week') ops = layoutWeek(data, design, device);
  else ops = layoutMonth(data, design, device);

  return [...ops, ...layoutNote(data, design, device)];
}

/** Vẽ hình nền theo state; trả về Blob PNG đúng kích thước thiết bị. Ảnh nền dùng khi design.bg.kind==='photo' và `bg` khác null; null → rơi về màu bg.color. */
export async function renderWallpaper(state: AppState, bg: Blob | null, today: string): Promise<Blob> {
  const { canvas, ctx } = makeCanvas(state.device.width, state.device.height);

  if (state.design.bg.kind === 'photo' && bg) {
    // Tô màu nền trước (T-4.7 #10): ảnh (đặc biệt PNG trong suốt) có thể để lộ canvas
    // rỗng nếu vẽ trực tiếp lên nền chưa tô — vùng trong suốt phải thấy màu/gradient nền.
    paintBackground(ctx, state);
    const img = await decodeImage(bg);
    drawBackground(ctx, img, state.design, state.device);
    closeImage(img);
  } else {
    paintBackground(ctx, state);
  }

  const ops = buildOps(state, today);
  paint(ctx, ops);

  if (typeof window !== 'undefined' && window.location.search.includes('test=1')) {
    window.__lastOps = ops;
  }

  return canvasToBlob(canvas);
}
