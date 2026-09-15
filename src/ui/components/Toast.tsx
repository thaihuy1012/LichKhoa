/** Thông báo nhỏ ở đáy màn hình (T-2.7, port lich-nen.html L166-168/L706).
 * T-6.2: thêm nút hành động tùy chọn (vd. "Hoàn tác"). */
export function Toast({
  message,
  actionLabel,
  onAction,
}: {
  message: string | null;
  actionLabel?: string | null;
  onAction?: () => void;
}) {
  return (
    <div class={message ? 'toast show' : 'toast'} data-testid="toast">
      <span class="toast-msg">{message ?? ''}</span>
      {message && actionLabel && (
        <button type="button" class="toast-action" data-testid="toast-undo" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
