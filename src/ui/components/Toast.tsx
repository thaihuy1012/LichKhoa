/** Thông báo nhỏ ở đáy màn hình (T-2.7, port lich-nen.html L166-168/L706). */
export function Toast({ message }: { message: string | null }) {
  return (
    <div class={message ? 'toast show' : 'toast'} data-testid="toast">
      {message ?? ''}
    </div>
  );
}
