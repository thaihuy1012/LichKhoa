/** Lưu ảnh PNG: dùng Web Share files nếu hỗ trợ, ngược lại tải file `<a download>`. */
export async function savePng(blob: Blob, filename: string): Promise<'shared' | 'downloaded'> {
  const file = new File([blob], filename, { type: 'image/png' });

  const nav = navigator as Navigator & { canShare?: (data?: ShareData) => boolean; share?: (data: ShareData) => Promise<void> };
  if (nav.canShare?.({ files: [file] })) {
    try {
      await nav.share!({ files: [file] });
      return 'shared';
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return 'shared';
      }
      // lỗi khác: rơi xuống tải file
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Hoãn revoke: thu hồi ngay có thể hủy tải trên WebKit/Safari.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return 'downloaded';
}

/** Sao chép PNG vào clipboard. PHẢI gọi ngay đầu một handler chạm (không sau `await`
 * nào khác) — Safari chỉ cho phép `clipboard.write` khi còn user activation. */
export async function copyPng(blob: Blob): Promise<boolean> {
  const nav = navigator as Navigator & {
    clipboard?: { write?: (items: ClipboardItem[]) => Promise<void> };
  };
  if (typeof ClipboardItem === 'undefined' || !nav.clipboard?.write) return false;
  try {
    await nav.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    return true;
  } catch {
    return false;
  }
}

declare global {
  interface Window {
    __lastNav?: string;
  }
}

/** Mở Shortcut `name` với `input=clipboard`. Khi `?test=1`, ghi URL vào
 * `window.__lastNav` thay vì điều hướng thật (Playwright không mở được `shortcuts://`). */
export function openShortcut(name: string): void {
  const url = `shortcuts://run-shortcut?name=${encodeURIComponent(name)}&input=clipboard`;
  if (typeof location !== 'undefined' && new URLSearchParams(location.search).get('test') === '1') {
    window.__lastNav = url;
    return;
  }
  location.href = url;
}
