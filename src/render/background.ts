import type { DesignConfig, DeviceSpec } from '../core/model';

export interface CoverFit {
  dw: number;
  dh: number;
  dx: number;
  dy: number;
}

type CanvasLike = OffscreenCanvas | HTMLCanvasElement;

/** Toán "cover-fit": khớp ảnh iw×ih vào khung W×H sao cho phủ kín, giữ tỉ lệ (có thể tràn mép, được canh giữa). */
export function coverFit(iw: number, ih: number, W: number, H: number): CoverFit {
  if (!iw || !ih) return { dw: W, dh: H, dx: 0, dy: 0 };
  const s = Math.max(W / iw, H / ih);
  const dw = iw * s;
  const dh = ih * s;
  return { dw, dh, dx: (W - dw) / 2, dy: (H - dh) / 2 };
}

/** Kích thước ảnh sau khi thu nhỏ, không vượt quá `maxScale`× kích thước thiết bị (giữ nguyên tỉ lệ ảnh gốc). */
export function fitDownscale(
  iw: number,
  ih: number,
  devW: number,
  devH: number,
  maxScale = 2,
): { w: number; h: number } {
  const maxW = devW * maxScale;
  const maxH = devH * maxScale;
  if (iw <= maxW && ih <= maxH) return { w: Math.round(iw), h: Math.round(ih) };
  const scale = Math.min(maxW / iw, maxH / ih);
  return { w: Math.max(1, Math.round(iw * scale)), h: Math.max(1, Math.round(ih * scale)) };
}

/** Tỉ lệ hạ mẫu dùng để giả lập mờ (0..3) khi phóng ảnh nhỏ lên lại — thay cho `ctx.filter` (rủi ro 6 SPEC). */
export function blurDownsampleRatio(blur: 0 | 1 | 2 | 3): number {
  const table: Record<0 | 1 | 2 | 3, number> = { 0: 1, 1: 0.5, 2: 0.25, 3: 0.125 };
  return table[blur];
}

function makeCanvas(w: number, h: number): { canvas: CanvasLike; ctx: CanvasRenderingContext2D } {
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

function canvasToBlob(canvas: CanvasLike, type = 'image/png'): Promise<Blob> {
  if (typeof OffscreenCanvas !== 'undefined' && canvas instanceof OffscreenCanvas) {
    return canvas.convertToBlob({ type });
  }
  return new Promise((resolve, reject) => {
    (canvas as HTMLCanvasElement).toBlob((b) => {
      if (b) resolve(b);
      else reject(new Error('toBlob thất bại'));
    }, type);
  });
}

/** Giải mã ảnh, ưu tiên `createImageBitmap` (tôn trọng EXIF orientation), fallback qua thẻ `<img>`. */
async function decodeImage(file: Blob): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap !== 'undefined') {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' });
    } catch {
      // rơi xuống fallback dưới đây
    }
  }
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('decode ảnh thất bại'));
    };
    img.src = url;
  });
}

function sourceSize(img: ImageBitmap | HTMLImageElement): { w: number; h: number } {
  return 'naturalWidth' in img
    ? { w: img.naturalWidth, h: img.naturalHeight }
    : { w: img.width, h: img.height };
}

/** Nạp ảnh từ Thư viện: đọc EXIF orientation, thu nhỏ ≤ 2× kích thước thiết bị, trả Blob JPEG để lưu IndexedDB. */
export async function loadPhoto(file: Blob, dev: DeviceSpec): Promise<Blob> {
  const img = await decodeImage(file);
  const { w: iw, h: ih } = sourceSize(img);
  const { w, h } = fitDownscale(iw, ih, dev.width, dev.height, 2);
  const { canvas, ctx } = makeCanvas(w, h);
  ctx.drawImage(img as CanvasImageSource, 0, 0, w, h);
  return canvasToBlob(canvas, 'image/jpeg');
}

/** Vẽ ảnh nền (cover-fit) + mờ (hạ/tăng mẫu canvas, KHÔNG `ctx.filter`) + tối lên `ctx` kích thước thiết bị. */
export function drawBackground(
  ctx: CanvasRenderingContext2D,
  bg: ImageBitmap | HTMLImageElement,
  design: DesignConfig,
  dev: DeviceSpec,
): void {
  const W = dev.width;
  const H = dev.height;
  const { w: iw, h: ih } = sourceSize(bg);
  const fit = coverFit(iw, ih, W, H);
  const ratio = blurDownsampleRatio(design.blur);

  if (ratio < 1) {
    const smallW = Math.max(1, Math.round(W * ratio));
    const smallH = Math.max(1, Math.round(H * ratio));
    const { canvas: small, ctx: sctx } = makeCanvas(smallW, smallH);
    sctx.imageSmoothingEnabled = true;
    sctx.drawImage(
      bg as CanvasImageSource,
      fit.dx * ratio,
      fit.dy * ratio,
      fit.dw * ratio,
      fit.dh * ratio,
    );
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(small as CanvasImageSource, 0, 0, smallW, smallH, 0, 0, W, H);
  } else {
    ctx.drawImage(bg as CanvasImageSource, fit.dx, fit.dy, fit.dw, fit.dh);
  }

  const dim = Math.max(0, Math.min(1, design.dim));
  if (dim > 0) {
    ctx.save();
    ctx.globalAlpha = dim;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
}

export { decodeImage, makeCanvas, canvasToBlob };
