# TASKS — bảng giao việc
(Quản lý duy trì. Trạng thái: TODO | DOING | REVIEW | DONE | BLOCKED. Ghi ngay sau mỗi bước.)
Nguồn sự thật: `docs/SPEC.md` (v1.0, Chủ dự án duyệt 2026-09-13). Hợp đồng TypeScript ở SPEC mục 5 — không đổi nếu không PHẢN BIỆN.
Lệnh test tổng: `npm run check` (tại `E:\DuAn\thu-nghiem`, PowerShell).

## Tiến độ
- M1: 2/6 · M2: 0/8 · M3: 0/4 · M4: 0/6
- Đang làm: T-1.3 ∥ T-1.4 (tho-sonnet ×2)
- Chờ Chủ dự án: (không)
- Sự cố mở: (không — SC-001 đã đóng 2026-09-13)

## Tồn đọng (S4 — không chặn)
- S4 · T-1.2 · mặc định `boxAlpha=1` (hộp nền đặc) sẽ che ảnh nền ở M4 — xem lại mặc định khi làm T-4.2.

## Thứ tự & song song
M1: 1.1 → 1.2 → (1.3 ∥ 1.4) → 1.5 → 1.END
M2: (2.1 ∥ 2.4 ∥ 2.5) → 2.2 → 2.3 → 2.6 → 2.7 → 2.END
M3: (3.1 ∥ 3.2) → 3.3 → 3.END
M4: (4.1 ∥ 4.3 ∥ 4.5) → 4.2 → 4.4 → 4.END

---
## M1 — Khung PWA + dựng hình nền bố cục Tháng

### T-1.1 — Khung dự án + bộ chạy test
- Mục tiêu: scaffold Vite 8 + Preact + TypeScript strict + vite-plugin-pwa; Vitest + Playwright chạy được; app hiện một trang "LichKhoa" trống.
- Phạm vi file (chỉ được sửa): `package.json`, `package-lock.json`, `tsconfig*.json`, `vite.config.ts`, `vitest.config.ts`, `playwright.config.ts`, `index.html`, `.gitignore`, `src/main.tsx`, `src/ui/App.tsx`, `src/vite-env.d.ts`, `public/icon-192.png`, `public/icon-512.png`, `tests/unit/smoke.test.ts`, `tests/e2e/smoke.spec.ts`.
- Giao diện / đầu vào có sẵn: SPEC mục 4 (stack, phiên bản), mục 5 (cây thư mục), mục 7 (chiến lược test), mục 9 (`VITE_BASE`).
- Yêu cầu:
  - Scripts npm: `dev`, `build` (`tsc --noEmit && vite build`), `preview` (cổng 4173 cố định), `test` (Vitest chạy 2 lần: `TZ=Asia/Ho_Chi_Minh` và `TZ=UTC`, dùng `cross-env` — chạy được trên PowerShell), `e2e` (`playwright test`), `check` (`tsc --noEmit && npm run test && npm run build && playwright test`).
  - `vite.config.ts`: `base: process.env.VITE_BASE ?? '/'`; PWA `generateSW`, manifest (name LichKhoa, display standalone, icons 192/512, theme màu tối). Nếu vite-plugin-pwa không tương thích Vite 8 → SW viết tay + PHẢN BIỆN/ghi chú trong báo cáo (rủi ro 5 SPEC). Tương tự Vitest 5 lỗi → ghim 4.x và báo.
  - `playwright.config.ts`: projects chromium + webkit, viewport 390×844, `webServer: npm run preview` (bản build), `reuseExistingServer` khi không CI.
  - Icon: PNG đơn giản tự sinh (không dùng tài sản app gốc).
  - `.gitignore`: `node_modules`, `dist`, `test-results`, `playwright-report`.
  - Chạy `npm install` và `npx playwright install chromium webkit`.
- Tiêu chí nghiệm thu:
  [ ] `npm run build` thành công; `dist/` có `manifest.webmanifest` và `sw.js`.
  [ ] `npm run test` chạy Vitest 2 lượt (2 TZ), `smoke.test.ts` pass cả hai.
  [ ] `npx playwright test tests/e2e/smoke.spec.ts` pass chromium + webkit: trang có `<link rel="manifest">`, `navigator.serviceWorker.ready` resolve.
  [ ] `npm run check` pass.
- Lệnh kiểm tra: `npm run check`
- Model: sonnet · Lần thử: 0/3 · Trạng thái: DONE
- Nhật ký: 2026-09-13 lượt 1: BLOCKED, thợ không có shell → SC-001 (không tính vào Lần thử). 2026-09-13: SC-001 đóng, giao lại lượt 2 (môi trường: node v24.21.0, npm 11.2.0). Lượt 2: DONE (thêm devDep `@types/node`; vite-plugin-pwa 1.3 + Vitest 5 OK với Vite 8) → kiem-thu PASS (6/0) → review đạt → commit.

### T-1.2 — Model dữ liệu + trạng thái mặc định + monthGrid
- Mục tiêu: toàn bộ kiểu dữ liệu của SPEC mục 5 và toán lưới tháng.
- Phạm vi file: `src/core/model.ts`, `src/core/calendar.ts`, `tests/unit/calendar.test.ts`.
- Giao diện / đầu vào có sẵn: SPEC mục 5 (chữ ký `model.ts`, `monthGrid`), mục 9 (giá trị mặc định).
- Yêu cầu: `model.ts` export đúng các kiểu SPEC + `defaultDesign(): DesignConfig`, `defaultState(device: DeviceSpec): AppState` theo mặc định mục 9; hàm tiện ích `toISODate(d: Date): ISODate`, `parseISODate(s): {y,m0,d}` (giờ địa phương, không dùng `toISOString`). `monthGrid` luôn 6×7, ô ngoài tháng = null.
- Tiêu chí nghiệm thu:
  [ ] `monthGrid(2026,1,1)`: tháng 2/2026 bắt đầu T2 → ô [0][6] = '2026-02-01' (CN), ô cuối có giá trị = '2026-02-28'; luôn 6 hàng × 7 cột.
  [ ] `monthGrid(2026,2,0)`: tháng 3/2026 bắt đầu CN → [0][0] = '2026-03-01', '2026-03-31' đúng vị trí.
  [ ] Test `toISODate` không lệch ngày ở cả 2 TZ.
- Lệnh kiểm tra: `npx tsc --noEmit; npm run test`
- Model: sonnet · Lần thử: 0/3 · Trạng thái: DONE
- Nhật ký: 2026-09-13 lượt 1: Chủ dự án dừng thợ giữa chừng. Dở dang trên đĩa (chưa commit, chưa kiểm): `src/core/model.ts` (113 dòng), `src/core/calendar.ts` (37 dòng); chưa có `tests/unit/calendar.test.ts`. Chủ dự án chọn "làm tiếp" → lượt 2: thợ mới (tho-sonnet) giữ phần dở, soát lại theo SPEC, viết test. Lượt 2: DONE (model.ts, calendar.ts của lượt 1 giữ nguyên; thêm calendar.test.ts, 11/11 × 2 TZ) → kiem-thu PASS (tsc sạch, 11×2 unit, 2 e2e) → review đạt → commit.

### T-1.3 — Thiết bị + layoutMonth
- Mục tiêu: preset thiết bị, tự phát hiện, và bố cục Tháng dạng `DrawOp[]` thuần.
- Phạm vi file: `src/render/devices.ts`, `src/render/layout/month.ts`, `src/render/layout/common.ts` (helper: khối nội dung theo `position`, vùng an toàn, cỡ chữ theo `scale`), `tests/unit/layout-month.test.ts`.
- Giao diện / đầu vào có sẵn: `src/core/model.ts`, `src/core/calendar.ts` (T-1.2); SPEC mục 5 (`DrawOp`, `layoutMonth`, `DeviceSpec`).
- Yêu cầu: `devices.ts` export `DEVICES: DeviceSpec[]` (iPhone 12→17 phổ biến, gồm 1179×2556, 1290×2796, 1170×2532, 1206×2622, 1320×2868), `detectDevice(screenW, screenH, dpr): DeviceSpec` (khớp preset gần nhất hoặc id 'auto'), `customDevice(w,h)`. `layoutMonth`: tiêu đề tháng, hàng thứ (theo `weekStart`), lưới ngày, tô hôm nay bằng `accentColor`, chấm sự kiện (`dot`) cho ngày có occurrence, hộp nền có `boxAlpha`; đặt khối theo `position`; mọi op trong `[safeTop·H, (1−safeBottom)·H]`. Nhãn thứ/tháng tạm thời hardcode VI (i18n làm ở M2), gom vào một chỗ trong `common.ts`.
- Tiêu chí nghiệm thu:
  [ ] ≥ 28 op text ngày cho tháng 2/2026; có op `rect` hoặc `dot` tô hôm nay với `fill === accentColor`.
  [ ] Mọi op (kể cả `y + h` của rect) nằm trong vùng an toàn, với cả 3 `position` và 2 thiết bị (1179×2556, 1320×2868).
  [ ] Ngày có occurrence có op `dot`.
- Lệnh kiểm tra: `npx tsc --noEmit; npm run test`
- Model: sonnet · Lần thử: 0/3 · Trạng thái: TODO

### T-1.4 — paint + wallpaper (nền màu/gradient) + lưu trữ + store
- Mục tiêu: biến `DrawOp[]` thành PNG; lưu/đọc state IndexedDB; reducer trạng thái.
- Phạm vi file: `src/render/paint.ts`, `src/render/wallpaper.ts`, `src/storage/db.ts`, `src/ui/store.ts`, `tests/unit/store.test.ts`.
- Giao diện / đầu vào có sẵn: `src/core/model.ts`; `src/render/layout/month.ts` (T-1.3 — nếu chạy song song, import theo chữ ký SPEC `layoutMonth(d, c, dev)`); SPEC mục 5.
- Yêu cầu: `paint` hỗ trợ đủ 3 op (rect bo góc `r`, alpha; text theo font family sans/serif/mono hệ thống; dot). `renderWallpaper(state, bg, today)`: canvas đúng `device.width×height` (OffscreenCanvas nếu có, fallback `<canvas>`), nền solid/gradient (M1 bỏ qua `bg` ảnh — để M4), gọi `layoutMonth` (M1 chỉ bố cục tháng; `RenderData` tạm dựng từ state: occurrences rỗng, todos, note), trả Blob PNG; nếu URL có `?test=1` gán `window.__lastOps`. `db.ts`: `loadState/saveState/loadBg/saveBg` bằng idb-keyval. `store.ts`: `AppState` + `reducer(state, action)` thuần (action M1: `setDevice`, `setDesign(partial)`, `load(state)`), hàm `createStore` persist debounce 300 ms.
- Tiêu chí nghiệm thu:
  [ ] `store.test.ts`: reducer đổi device/design đúng, không mutate state cũ.
  [ ] `npx tsc --noEmit` sạch.
- Lệnh kiểm tra: `npx tsc --noEmit; npm run test`
- Model: sonnet · Lần thử: 0/3 · Trạng thái: TODO

### T-1.5 — Màn Preview + Lưu ảnh
- Mục tiêu: UI dùng được: chọn thiết bị (preset / tự phát hiện / tùy chỉnh), xem ảnh preview, nút "Lưu ảnh".
- Phạm vi file: `src/ui/App.tsx`, `src/ui/screens/Preview.tsx`, `src/ui/styles.css`, `src/main.tsx`, `src/export/share.ts` (chỉ `savePng`).
- Giao diện / đầu vào có sẵn: `store.ts`, `db.ts`, `wallpaper.ts`, `devices.ts` (T-1.3/1.4); SPEC mục 5.
- Yêu cầu: App có thanh 5 tab (Preview, Sự kiện, Thiết kế, Đồng bộ, Hướng dẫn — 4 tab sau là placeholder); khởi động: `loadState()` hoặc `defaultState(detectDevice(...))`. Preview: `<select data-testid="device">` gồm preset + auto + tùy chỉnh (2 ô số), `<img data-testid="preview">` từ Blob (render lại debounce 150 ms khi state đổi, revoke URL cũ), nút `data-testid="save"` gọi `savePng(blob, 'lichkhoa-YYYY-MM-DD.png')` (Web Share files nếu `navigator.canShare` → fallback `<a download>`). Giao diện mobile-first 390 px.
- Tiêu chí nghiệm thu:
  [ ] Chạy `npm run build; npm run preview` và mở trình duyệt: chọn 1179×2556 → preview đổi.
  [ ] `npx tsc --noEmit` sạch, `npm run check` pass (không làm vỡ smoke).
- Lệnh kiểm tra: `npm run check`
- Model: sonnet · Lần thử: 0/3 · Trạng thái: TODO

### T-1.END — Kiểm thử tích hợp M1
- Mục tiêu: E2E luồng chính M1 theo SPEC mục 6.
- Phạm vi file: `tests/e2e/m1-render.spec.ts`; được sửa lỗi tích hợp nhỏ trong `src/**` nhưng phải khai báo từng file trong báo cáo.
- Tiêu chí nghiệm thu:
  [ ] chromium + webkit: mở app → chọn thiết bị 1179×2556 → `<img>` preview `naturalWidth=1179`, `naturalHeight=2556` → "Lưu ảnh" tạo download `.png` > 10 KB → reload vẫn giữ thiết bị (IndexedDB).
  [ ] Có `<link rel="manifest">`, `navigator.serviceWorker.ready` resolve (có thể giữ ở smoke.spec).
  [ ] `npm run check` pass toàn bộ.
- Lệnh kiểm tra: `npx playwright test tests/e2e/m1-render.spec.ts; npm run check`
- Model: sonnet · Lần thử: 0/3 · Trạng thái: TODO

---
## M2 — Sự kiện, to-do, ghi chú; Agenda / To-do / Note; sao lưu; i18n

### T-2.1 — recurrence
- Phạm vi file: `src/core/recurrence.ts`, `tests/unit/recurrence.test.ts`.
- Mục tiêu: `expandOccurrences(events, from, to)` theo SPEC mục 5.
- Tiêu chí: [ ] daily / weekly / monthly (ngày 31 bỏ qua tháng thiếu ngày) / yearly (29/02 chỉ năm nhuận) / `until` / không lặp; chặn đúng `[from, to]`; `Occurrence.id` duy nhất (`<eventId>@<date>`); pass cả 2 TZ.
- Lệnh kiểm tra: `npm run test`
- Model: sonnet · Lần thử: 0/3 · Trạng thái: TODO

### T-2.2 — groupAgenda + collectRenderData
- Phạm vi file: `src/core/calendar.ts` (thêm `groupAgenda`), `src/core/collect.ts`, `tests/unit/collect.test.ts`.
- Mục tiêu: nhóm theo ngày, sắp xếp cả ngày trước rồi theo giờ; `collectRenderData` trộn local (đã expand trong [today, today+max(agendaDays, 42)]) + `google.cache.events` + todos + note.
- Tiêu chí: [ ] agenda 7 ngày đúng thứ tự; ngày trống bị bỏ; [ ] cache Google null không lỗi; [ ] trộn 2 nguồn đúng.
- Lệnh kiểm tra: `npm run test`
- Model: sonnet · Lần thử: 0/3 · Trạng thái: TODO

### T-2.3 — layoutAgenda, layoutTodo, layoutNote
- Phạm vi file: `src/render/layout/agenda.ts`, `todo.ts`, `note.ts`, `common.ts` (thêm helper bọc dòng ước lượng độ rộng theo `size`), `tests/unit/layout.test.ts`.
- Mục tiêu: 3 bố cục cùng chữ ký `layoutMonth`; giờ theo `hour12`; to-do ≤ 12 dòng có ký hiệu tick (☐/☑ hoặc rect); note bọc dòng; mọi op trong vùng an toàn.
- Tiêu chí: [ ] agenda 7 ngày đúng thứ tự thời gian, `hour12` sinh "AM"/"PM"; [ ] to-do > 12 mục cắt còn 12 (+ dòng "+N"); [ ] note dài bọc thành nhiều op text; [ ] vùng an toàn cho cả 3.
- Lệnh kiểm tra: `npm run test`
- Model: sonnet · Lần thử: 0/3 · Trạng thái: TODO

### T-2.4 — i18n
- Phạm vi file: `src/core/i18n.ts`, `src/core/i18n/vi.json`, `src/core/i18n/en.json`, `tests/unit/i18n.test.ts`.
- Mục tiêu: `t(key, lang, vars)` thay `{var}`; khóa thiếu → trả key; tên thứ/tháng dùng `Intl` hoặc bảng trong json; khóa cho mọi chuỗi UI hiện có + dự kiến (tabs, Preview, Events, Design, Sync, Guide, lỗi).
- Tiêu chí: [ ] tập khóa vi = tập khóa en; [ ] thay biến đúng; [ ] khóa thiếu trả key.
- Lệnh kiểm tra: `npm run test`
- Model: sonnet · Lần thử: 0/3 · Trạng thái: TODO

### T-2.5 — ics + backup
- Phạm vi file: `src/export/ics.ts`, `src/storage/backup.ts`, `tests/unit/ics.test.ts`, `tests/unit/backup.test.ts`.
- Mục tiêu: `eventToIcs` (VCALENDAR/VEVENT, DTSTART có giờ hoặc `VALUE=DATE`, RRULE FREQ + UNTIL, CRLF, escape `,;\`); `exportBackup/importBackup` `{version:1, state}`, version lạ → ném lỗi.
- Tiêu chí: [ ] ics có VCALENDAR, VEVENT, DTSTART, RRULE đúng, CRLF; [ ] backup vòng tròn giống hệt; version 2 → throw.
- Lệnh kiểm tra: `npm run test`
- Model: sonnet · Lần thử: 0/3 · Trạng thái: TODO

### T-2.6 — Nối dữ liệu vào render + store actions
- Phạm vi file: `src/render/wallpaper.ts`, `src/ui/store.ts`, `tests/unit/store.test.ts`.
- Mục tiêu: `renderWallpaper` dùng `collectRenderData` + chọn layout theo `design.layout` + `layoutNote` khi `showNote`; nhãn thứ/tháng qua i18n. Store thêm action: CRUD sự kiện, CRUD/tick/sắp xếp to-do, `setNote`, `replaceState` (nhập backup), `resetAll`.
- Tiêu chí: [ ] reducer test cho mọi action mới; [ ] test M1 vẫn pass.
- Lệnh kiểm tra: `npm run check`
- Model: sonnet · Lần thử: 0/3 · Trạng thái: TODO

### T-2.7 — Màn Sự kiện + cài đặt chung + i18n toàn UI
- Phạm vi file: `src/ui/screens/Events.tsx`, `src/ui/screens/Preview.tsx`, `src/ui/App.tsx`, `src/ui/styles.css`, `src/core/i18n/*.json` (thêm khóa, giữ 2 file khớp).
- Mục tiêu: form thêm/sửa/xóa sự kiện (tiêu đề, ngày, giờ hoặc cả ngày, lặp, until, màu); to-do (thêm, tick, xóa, lên/xuống); ghi chú + bật `showNote`; nút "Thêm vào Lịch iPhone" (tải `.ics`); chọn bố cục ở Preview; cài đặt ngôn ngữ, 12h/24h, tuần bắt đầu; nút Xuất/Nhập JSON, Xóa dữ liệu (confirm). Mọi nhãn qua `t()`. `data-testid` cho mọi control dùng trong E2E.
- Tiêu chí: [ ] `npm run check` pass; [ ] thao tác tay: thêm sự kiện → hiện trong Agenda.
- Lệnh kiểm tra: `npm run check`
- Model: sonnet · Lần thử: 0/3 · Trạng thái: TODO

### T-2.END — Kiểm thử tích hợp M2
- Phạm vi file: `tests/e2e/m2-events.spec.ts`, `tests/e2e/m2-i18n.spec.ts`; sửa tích hợp nhỏ `src/**` phải khai báo.
- Tiêu chí: [ ] thêm sự kiện lặp tuần → chuyển Agenda → hash PNG preview đổi → reload còn sự kiện → xuất JSON → xóa dữ liệu → nhập JSON → sự kiện trở lại; [ ] đổi `en` → nhãn tab đổi; bật 12h → agenda (qua `window.__lastOps`) chứa "AM"/"PM"; [ ] `npm run check` pass, test M1 không bị sửa/skip.
- Lệnh kiểm tra: `npm run check`
- Model: sonnet · Lần thử: 0/3 · Trạng thái: TODO

---
## M3 — Google Calendar (OAuth thuần client, chỉ đọc)

### T-3.1 — oauth
- Phạm vi file: `src/google/oauth.ts`, `tests/unit/oauth.test.ts`.
- Mục tiêu: `buildAuthUrl`, `parseFragment`, `newState()` (crypto ngẫu nhiên, lưu sessionStorage), token store localStorage `{accessToken, expiresAt}`, `getToken()` null khi hết hạn (nhận `now` tham số để test).
- Tiêu chí: [ ] URL có `response_type=token`, `scope=https://www.googleapis.com/auth/calendar.readonly`, `state`, `redirect_uri`, `prompt` tùy chọn; [ ] `parseFragment` đúng state / sai state / `error` / rỗng.
- Lệnh kiểm tra: `npm run test`
- Model: sonnet · Lần thử: 0/3 · Trạng thái: TODO

### T-3.2 — Google Calendar REST + normalize
- Phạm vi file: `src/google/calendar.ts`, `tests/unit/google-normalize.test.ts`, `tests/fixtures/google/*.json`.
- Mục tiêu: `fetchCalendars`, `fetchEvents` (fetch + Bearer, `singleEvents=true&orderBy=startTime&maxResults=250`, ≤ 2 trang/lịch), `normalize` thuần tách riêng; 401 → `AuthError`; bỏ `cancelled`; màu lịch.
- Tiêu chí: [ ] all-day → `allDay=true` đúng ngày; [ ] `dateTime` offset khác → ngày/giờ địa phương đúng ở cả 2 TZ; [ ] cancelled bị bỏ; [ ] nhiều lịch gộp + sắp xếp; [ ] fetch mock trả 401 → `AuthError`.
- Lệnh kiểm tra: `npm run test`
- Model: sonnet · Lần thử: 0/3 · Trạng thái: TODO

### T-3.3 — Màn Đồng bộ + tự đồng bộ
- Phạm vi file: `src/ui/screens/Sync.tsx`, `src/ui/App.tsx`, `src/ui/store.ts`, `src/ui/sync.ts` (điều phối), `src/core/i18n/*.json`, `tests/unit/store.test.ts`.
- Mục tiêu: dán Client ID, Kết nối (redirect), xử lý hash khi khởi động (xóa bằng `replaceState`), danh sách lịch + chọn, Đồng bộ ngay, thời điểm đồng bộ, Ngắt kết nối; tự đồng bộ khi mở nếu token còn hạn và cache > 30 phút; 401 → trạng thái "Kết nối lại"; lỗi mạng → giữ cache.
- Tiêu chí: [ ] `npm run check` pass; [ ] reducer test cho action google.
- Lệnh kiểm tra: `npm run check`
- Model: sonnet · Lần thử: 0/3 · Trạng thái: TODO

### T-3.END — Kiểm thử tích hợp M3
- Phạm vi file: `tests/e2e/m3-google.spec.ts`, `tests/fixtures/google/*.json`; sửa tích hợp nhỏ `src/**` phải khai báo.
- Tiêu chí: [ ] luồng mock OAuth + calendar như SPEC M3 (302 về `#access_token…&state=<từ query>` → chọn lịch → Đồng bộ → agenda có sự kiện fixture → offline + reload vẫn hiện → 401 → "Kết nối lại"); [ ] `Select-String -Path src -Pattern client_secret -Recurse` rỗng; [ ] `npm run check` pass, test M1–M2 không bị sửa/skip.
- Lệnh kiểm tra: `npm run check`
- Model: sonnet · Lần thử: 0/3 · Trạng thái: TODO

---
## M4 — Ảnh nền & tùy biến, một chạm Shortcut, hướng dẫn

### T-4.1 — Ảnh nền: nạp, EXIF, thu nhỏ, cover-fit, mờ, tối
- Phạm vi file: `src/render/background.ts` (mới: `loadPhoto(file, dev): Promise<Blob>`, `drawBackground(ctx, bg, design, dev)`), `src/render/wallpaper.ts`, `tests/unit/background.test.ts` (phần toán cover-fit thuần), `tests/fixtures/photo-4000x3000.jpg`.
- Mục tiêu: `createImageBitmap(file,{imageOrientation:'from-image'})` fallback `<img>`; thu nhỏ ≤ 2× thiết bị; cover-fit; blur bằng hạ/tăng mẫu (không `ctx.filter`); dim bằng rect đen alpha.
- Tiêu chí: [ ] test cover-fit (tỉ lệ ngang/dọc); [ ] `npm run check` pass.
- Lệnh kiểm tra: `npm run check`
- Model: sonnet · Lần thử: 0/3 · Trạng thái: TODO

### T-4.2 — Màn Thiết kế
- Phạm vi file: `src/ui/screens/Design.tsx`, `src/ui/App.tsx`, `src/ui/styles.css`, `src/core/i18n/*.json`, `src/render/layout/common.ts` (nếu cần áp font/scale/boxAlpha đồng nhất).
- Mục tiêu: chọn nền (ảnh/màu/gradient + chọn ảnh → `saveBg`), blur 0–3, dim 0–0.8, màu chữ/nhấn, font, vị trí, scale, boxAlpha, agendaDays; `data-testid` đầy đủ.
- Tiêu chí: [ ] `npm run check` pass; [ ] thao tác tay đổi từng tùy chọn → preview đổi.
- Lệnh kiểm tra: `npm run check`
- Model: sonnet · Lần thử: 0/3 · Trạng thái: TODO

### T-4.3 — Sao chép + Đặt hình nền một chạm
- Phạm vi file: `src/export/share.ts`, `src/ui/screens/Preview.tsx`, `src/core/i18n/*.json`.
- Mục tiêu: `copyPng` (ClipboardItem, trả false khi không hỗ trợ), `openShortcut(name)` → `shortcuts://run-shortcut?name=<enc>&input=clipboard` (khi `?test=1` ghi vào `window.__lastNav` thay vì điều hướng); nút "Sao chép", "Đặt hình nền" (copy → open), tên Shortcut cấu hình được; lỗi → thông báo + hướng dẫn thay thế.
- Tiêu chí: [ ] `npm run check` pass.
- Lệnh kiểm tra: `npm run check`
- Model: sonnet · Lần thử: 0/3 · Trạng thái: TODO

### T-4.4 — Màn Hướng dẫn + HUONG-DAN.md
- Phạm vi file: `src/ui/screens/Guide.tsx`, `src/core/i18n/*.json`, `docs/HUONG-DAN.md`.
- Mục tiêu: 4 phần (cài PWA, tạo Shortcut, Google OAuth Client ID, HTTPS/hosting) theo SPEC mục 10 + quy trình hằng ngày + giới hạn đã biết; VI (EN ngắn trong UI).
- Tiêu chí: [ ] HUONG-DAN.md có đủ 4 phần; [ ] `npm run check` pass.
- Lệnh kiểm tra: `npm run check`
- Model: sonnet · Lần thử: 0/3 · Trạng thái: TODO

### T-4.5 — size.mjs + workflow GitHub Pages
- Phạm vi file: `scripts/size.mjs`, `.github/workflows/pages.yml`, `package.json` (thêm script `size`).
- Mục tiêu: `size.mjs` gzip từng file `dist/**/*.js`, in tổng, exit 1 nếu ≥ 150 KB. Workflow build với `VITE_BASE=/${{ github.event.repository.name }}/` và deploy Pages (không push — chỉ tạo file).
- Tiêu chí: [ ] `npm run build; node scripts/size.mjs` in tổng và exit 0.
- Lệnh kiểm tra: `npm run build; node scripts/size.mjs`
- Model: haiku · Lần thử: 0/3 · Trạng thái: TODO

### T-4.END — Kiểm thử tích hợp M4
- Phạm vi file: `tests/e2e/m4-design.spec.ts`, `tests/e2e/m4-export.spec.ts`, `tests/e2e/m4-offline.spec.ts`; sửa tích hợp nhỏ `src/**` phải khai báo.
- Tiêu chí: [ ] tải ảnh fixture → preview đổi, kích thước bằng thiết bị; blur=2, dim=0.4, position=bottom, font=serif → hash PNG khác sau mỗi bước; `__lastOps` trong vùng an toàn; [ ] chromium + `clipboard-write`: "Sao chép" ghi `image/png`; "Đặt hình nền" → `__lastNav` bắt đầu `shortcuts://run-shortcut?name=`; [ ] offline reload vẫn mở app; [ ] size < 150 KB; [ ] `npm run check` pass chromium + webkit.
- Lệnh kiểm tra: `npm run check; node scripts/size.mjs`
- Model: sonnet · Lần thử: 0/3 · Trạng thái: TODO
