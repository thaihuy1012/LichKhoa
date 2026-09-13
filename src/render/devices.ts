import type { DeviceSpec } from '../core/model';

const SAFE_TOP = 0.3;
const SAFE_BOTTOM = 0.14;

/** Preset thiết bị iPhone 12→17 phổ biến (kích thước pixel vật lý). */
export const DEVICES: DeviceSpec[] = [
  { id: 'iphone-1284x2778', label: 'iPhone 12/13 Pro Max', width: 1284, height: 2778, safeTop: SAFE_TOP, safeBottom: SAFE_BOTTOM },
  { id: 'iphone-1170x2532', label: 'iPhone 12/13/14, 12/13 Pro', width: 1170, height: 2532, safeTop: SAFE_TOP, safeBottom: SAFE_BOTTOM },
  { id: 'iphone-1179x2556', label: 'iPhone 14 Pro/15/16', width: 1179, height: 2556, safeTop: SAFE_TOP, safeBottom: SAFE_BOTTOM },
  { id: 'iphone-1206x2622', label: 'iPhone 16 Pro', width: 1206, height: 2622, safeTop: SAFE_TOP, safeBottom: SAFE_BOTTOM },
  { id: 'iphone-1290x2796', label: 'iPhone 14/15/16 Pro Max', width: 1290, height: 2796, safeTop: SAFE_TOP, safeBottom: SAFE_BOTTOM },
  { id: 'iphone-1320x2868', label: 'iPhone 16/17 Pro Max', width: 1320, height: 2868, safeTop: SAFE_TOP, safeBottom: SAFE_BOTTOM },
];

/** Thiết bị tùy chỉnh theo kích thước pixel cho trước. */
export function customDevice(w: number, h: number): DeviceSpec {
  return {
    id: 'custom',
    label: `Tùy chỉnh ${w}×${h}`,
    width: w,
    height: h,
    safeTop: SAFE_TOP,
    safeBottom: SAFE_BOTTOM,
  };
}

/** Tự phát hiện thiết bị từ kích thước CSS màn hình và devicePixelRatio.
 * Khớp preset gần nhất (dung sai nhỏ do làm tròn); nếu không khớp trả thiết bị 'auto'
 * dựng từ kích thước pixel vật lý thực tế. */
export function detectDevice(screenW: number, screenH: number, dpr: number): DeviceSpec {
  const w = Math.round(screenW * dpr);
  const h = Math.round(screenH * dpr);
  const TOLERANCE = 4;

  let best: DeviceSpec | null = null;
  let bestDist = Infinity;
  for (const dev of DEVICES) {
    const dist = Math.abs(dev.width - w) + Math.abs(dev.height - h);
    if (dist < bestDist) {
      bestDist = dist;
      best = dev;
    }
  }
  if (best && bestDist <= TOLERANCE) {
    return best;
  }
  return {
    id: 'auto',
    label: `Tự phát hiện ${w}×${h}`,
    width: w,
    height: h,
    safeTop: SAFE_TOP,
    safeBottom: SAFE_BOTTOM,
  };
}
