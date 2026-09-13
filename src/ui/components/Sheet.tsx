import type { ComponentChildren } from 'preact';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  children: ComponentChildren;
}

/** Bảng trượt lên từ đáy màn hình, dùng chung cho các form (T-2.7, port lich-nen.html L144-163). */
export function Sheet({ open, onClose, children }: SheetProps) {
  if (!open) return null;
  return (
    <>
      <div class="backdrop show" onClick={onClose} />
      <div class="sheet show" role="dialog" aria-modal="true">
        {children}
      </div>
    </>
  );
}
