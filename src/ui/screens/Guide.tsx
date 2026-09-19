import { t } from '../../core/i18n';
import type { Store } from '../store';

export interface GuideProps {
  store: Store;
  /** Chuyển sang tab khác (App.tsx quản lý tab hiện tại). Tùy chọn — không có thì ẩn nút. */
  onGoToTab?: (tab: 'sync' | 'design') => void;
}

interface Card {
  key: string;
  title: string;
  body: string;
}

/**
 * Màn Hướng dẫn: 7 thẻ ngắn (không thay HUONG-DAN.md — chỉ tóm tắt trong app).
 * Nội dung đầy đủ + "Bài thử trên iPhone" nằm ở docs/HUONG-DAN.md (SPEC §10, D-015/D-016).
 */
export function Guide({ store, onGoToTab }: GuideProps) {
  const lang = store.getState().design.lang;

  const cards: Card[] = [
    { key: 'install', title: t('guide.installTitle', lang), body: t('guide.installBody', lang) },
    { key: 'google', title: t('guide.googleTitle', lang), body: t('guide.googleBody', lang) },
    { key: 'shortcut', title: t('guide.shortcutTitle', lang), body: t('guide.shortcutBody', lang) },
    { key: 'daily', title: t('guide.dailyTitle', lang), body: t('guide.dailyBody', lang) },
    { key: 'fallback', title: t('guide.fallbackTitle', lang), body: t('guide.fallbackBody', lang) },
    { key: 'limits', title: t('guide.limitsTitle', lang), body: t('guide.limitsBody', lang) },
    { key: 'reminder', title: t('guide.reminderTitle', lang), body: t('guide.reminderBody', lang) },
    { key: 'dayAlarm', title: t('guide.dayAlarmTitle', lang), body: t('guide.dayAlarmBody', lang) },
  ];

  return (
    <div class="preview-screen" data-testid="guide">
      {cards.map((c) => (
        <section
          key={c.key}
          class="settings-section"
          data-testid={`guide-card-${c.key}`}
          // Chưa có class thẻ/card riêng trong styles.css (T-4.6 song song đang sửa file này) —
          // dùng .settings-section (đã có border-top + gap) làm khối, thêm inline padding tối thiểu.
          style={{ paddingBottom: 4 }}
        >
          <strong>{c.title}</strong>
          <p class="hint">{c.body}</p>
        </section>
      ))}

      {onGoToTab && (
        <div class="row-actions">
          <button type="button" class="btn" data-testid="guide-goto-sync" onClick={() => onGoToTab('sync')}>
            {t('guide.goToSync', lang)}
          </button>
          <button type="button" class="btn" data-testid="guide-goto-design" onClick={() => onGoToTab('design')}>
            {t('guide.goToDesign', lang)}
          </button>
        </div>
      )}
    </div>
  );
}
