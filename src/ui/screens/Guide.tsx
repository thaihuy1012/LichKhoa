import { useEffect, useState } from 'preact/hooks';
import { t } from '../../core/i18n';
import type { Store } from '../store';
import { useStoreState } from '../useStoreState';
import {
  SHORTCUT_KINDS,
  SHORTCUT_DEFAULT_NAMES,
  parseShortcutLinks,
  shortcutNameMismatch,
  type ShortcutLinks,
} from '../../export/install';

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
 * Màn Hướng dẫn: 9 thẻ ngắn (không thay HUONG-DAN.md — chỉ tóm tắt trong app).
 * Nội dung đầy đủ + "Bài thử trên iPhone" nằm ở docs/HUONG-DAN.md (SPEC §10, D-015/D-016/D-037).
 */
export function Guide({ store, onGoToTab }: GuideProps) {
  const state = useStoreState(store);
  const lang = state.design.lang;

  const [linksData, setLinksData] = useState<{ links: ShortcutLinks; updated: string | null } | null>(null);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    let canceled = false;
    fetch(import.meta.env.BASE_URL + 'shortcut-links.json', { cache: 'no-cache' })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!canceled) {
          const parsed = parseShortcutLinks(data);
          setLinksData(parsed);
          setFetchError(false);
        }
      })
      .catch(() => {
        if (!canceled) {
          setLinksData({
            links: { wallpaper: null, alarm: null, reminder: null, dayAlarm: null, morning: null },
            updated: null,
          });
          setFetchError(true);
        }
      });
    return () => {
      canceled = true;
    };
  }, []);

  const otherCards: Card[] = [
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
      {/* Thẻ 1: Cài vào Màn hình chính */}
      <section
        class="settings-section"
        data-testid="guide-card-install"
        style={{ paddingBottom: 4 }}
      >
        <strong>{t('guide.installTitle', lang)}</strong>
        <p class="hint">{t('guide.installBody', lang)}</p>
      </section>

      {/* Thẻ 2: Cài nhanh bộ Phím tắt (T-10.2 / SPEC §3 IN-14) */}
      <section
        class="settings-section"
        data-testid="guide-card-installShortcuts"
        style={{ paddingBottom: 4 }}
      >
        <strong>{t('guide.installShortcutsTitle', lang)}</strong>
        <p class="hint">{t('guide.installShortcutsBody', lang)}</p>

        {fetchError && (
          <div class="sc-links-error" data-testid="sc-links-error">
            {t('guide.scLinksError', lang)}
          </div>
        )}

        {linksData?.updated && (
          <div class="sc-updated hint" data-testid="sc-updated">
            {t('guide.scUpdated', lang, { updated: linksData.updated })}
          </div>
        )}

        {linksData && (
          <div class="sc-rows">
            {SHORTCUT_KINDS.map((kind, idx) => {
              const url = linksData.links[kind];
              const mismatch = shortcutNameMismatch(state, kind);
              return (
                <div key={kind} class="sc-row" data-testid={`sc-row-${kind}`}>
                  <div class="sc-row-header">
                    <span class="sc-index">{idx + 1}. </span>
                    <span class="sc-name mono" data-testid={`sc-name-${kind}`}>
                      {SHORTCUT_DEFAULT_NAMES[kind]}
                    </span>
                  </div>
                  <p class="sc-purpose hint">{t(`sc-purpose-${kind}`, lang)}</p>
                  {url ? (
                    <a
                      class="btn sc-install-btn"
                      data-testid={`sc-install-${kind}`}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('guide.scInstall', lang)}
                    </a>
                  ) : (
                    <div class="sc-nolink hint" data-testid={`sc-nolink-${kind}`}>
                      {t('guide.scNoLink', lang)}
                    </div>
                  )}
                  {mismatch && (
                    <div class="sc-name-mismatch" data-testid={`sc-name-mismatch-${kind}`}>
                      {t('guide.scNameMismatch', lang, {
                        app: mismatch.app,
                        expected: mismatch.expected,
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div class="sc-manual">
          <div class="sc-manual-title">
            <strong>{t('guide.scManualTitle', lang)}</strong>
          </div>
          <ol class="sc-manual-steps" data-testid="sc-manual-steps">
            <li>{t('guide.scManualStep1', lang)}</li>
            <li>{t('guide.scManualStep2', lang)}</li>
            <li>{t('guide.scManualStep3', lang)}</li>
            <li>{t('guide.scManualStep4', lang)}</li>
          </ol>
        </div>
      </section>

      {/* Thẻ cũ 2–8 đánh số lại 3–9: data-testid giữ nguyên */}
      {otherCards.map((c) => (
        <section
          key={c.key}
          class="settings-section"
          data-testid={`guide-card-${c.key}`}
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
