import type { AppState } from '../../../core/model';
import { t } from '../../../core/i18n';

/** Khung tạm cho phân đoạn Ghi chú (T-2.7). Nội dung thật (nhiều ghi chú + ghim) làm ở phiếu sau (D-011). */
export function NoteTab({ state }: { state: AppState }) {
  const lang = state.design.lang;
  return (
    <div class="note-tab">
      <p class="placeholder">{t('common.comingSoon', lang)}</p>
    </div>
  );
}
