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
