# SPEC — LichKhoa (tái tạo tính năng "Ink: Lockscreen Calendar, Note" dưới dạng PWA)
(Kiến trúc sư điền ở Giai đoạn 0. Đây là nguồn sự thật; mọi thay đổi phạm vi phải qua Chủ dự án.)

Phiên bản SPEC: 1.3 — 2026-09-13 (v1.0 + Âm lịch D-006 + thiết bị đích iPhone 13 Pro Max D-007 + lặp T2–T6, nhắc giờ qua .ics, hạn chót to-do, nhiều ghi chú D-011). App gốc đối chiếu: "Ink: Lockscreen Calendar, Note" (SilverAI JSC, App Store id6769250805, bản 1.2.14). Tính năng gốc đã tra cứu: hình nền màn hình khóa có lịch / agenda / to-do chồng lên ảnh cá nhân; đồng bộ Google Calendar và Apple Calendar; tạo sự kiện lặp có nhắc; tùy chỉnh ảnh, màu, độ mờ, ngôn ngữ; widget lịch và ghi chú; dữ liệu xử lý trên máy. Tên làm việc "LichKhoa" — không dùng tên, logo, ảnh, font của app gốc; chỉ tái tạo tính năng và luồng dùng.

## 1. Mục tiêu
Một PWA chạy trên Safari iPhone (cài lên Màn hình chính) cho phép Chủ dự án: (a) dựng ảnh hình nền màn hình khóa đúng kích thước pixel máy, có lịch tháng / agenda / to-do / ghi chú chồng lên ảnh nền tự chọn; (b) trộn sự kiện Google Calendar (chỉ đọc, OAuth thuần client, không backend) với sự kiện lặp và to-do nhập tại chỗ; (c) đặt làm hình nền khóa bằng ≤ 3 chạm mỗi ngày qua Shortcut. Dùng cá nhân, không đăng nhập, dữ liệu nằm trên máy.

## 2. Người dùng & tình huống dùng
- Một người dùng (Chủ dự án), **iPhone 13 Pro Max** (1284×2778 px, 428×926 pt, DPR 3, tai thỏ — v1.2, D-007), iOS 17+, Safari, dùng dạng PWA Màn hình chính; mọi UI và hình nền tối ưu cho máy này trước; máy dev Windows 10 (Chrome dùng để chỉnh thiết kế, không bắt buộc).
- TH1 hằng ngày: mở icon → app tự đồng bộ Google nếu token còn hạn → hiện hình nền hôm nay → chạm "Đặt hình nền" → Shortcut đặt hình nền khóa.
- TH2: thêm/sửa sự kiện lặp, to-do, ghi chú; xuất .ics để Lịch iPhone nhắc giờ.
- TH3 thi thoảng: đổi ảnh nền / bố cục / màu / vị trí; kết nối lại Google khi token hết hạn.
- TH4: sao lưu / khôi phục dữ liệu bằng file JSON.

## 3. Phạm vi
- IN:
  1. Dựng PNG đúng kích thước pixel màn hình iPhone: preset (`devices.ts`, gồm 1284×2778 iPhone 12/13 Pro Max — mặc định khi không nhận ra máy, v1.2), tự phát hiện (`screen × devicePixelRatio`, mặc định), tùy chỉnh; vùng an toàn tránh đồng hồ (trên) và nút đèn pin/camera (dưới).
  2. Ba bố cục: **Tháng** (lưới 6×7, tô hôm nay, chấm sự kiện), **Agenda** (N ngày tới, giờ + tên, màu lịch), **To-do** (checklist). Lớp **Ghi chú** (văn bản tự do) bật/tắt trên mọi bố cục.
  3. Nền: ảnh từ Thư viện (cover-fit, tôn trọng EXIF), màu đơn, gradient; mờ (0–3) + tối (0–0.8); màu chữ / màu nhấn; 3 họ font hệ thống (sans/serif/mono); vị trí khối (trên/giữa/dưới trong vùng an toàn); cỡ chữ (scale); độ trong suốt hộp.
  4. Sự kiện cục bộ: CRUD; cả ngày hoặc có giờ; lặp ngày/**T2–T6**/tuần/tháng/năm + ngày kết thúc; to-do tick/bỏ tick; ghi chú.
  10. (v1.3, D-011 — theo `F:/LICH_NEN`) **Lặp T2–T6** (`repeat: 'weekdays'`; .ics `FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR`). **Nhắc giờ** = trường "Nhắc trước" (`alarmMin`: 5/15/30/60/1440 phút) xuất thành `VALARM` trong .ics — Lịch iPhone nhắc; app KHÔNG tự gửi thông báo. **Hạn chót to-do** (`due`): việc chưa xong có hạn xếp trước theo hạn tăng dần, việc không hạn xếp sau theo `order` (lên/xuống tay); nhãn "Quá hạn" / "Hôm nay" / "d/m" trong app và trên hình nền (quá hạn tô `accentColor`). **Nhiều ghi chú** (tiêu đề + nội dung) trong app; ghim đúng 1 ghi chú (ghim cái mới → bỏ ghim cái cũ); hình nền hiện ghi chú ghim (tiêu đề + ≤ 4 dòng) khi `showNote`; `noteText` cũ tự thành ghi chú ghim.
  5. Google Calendar chỉ đọc: OAuth implicit redirect tự viết (không SDK), chọn lịch, tải sự kiện trong [hôm nay − 1 … + 60 ngày], cache cục bộ dùng offline, tự đồng bộ khi mở app nếu token còn hạn và cache cũ hơn 30 phút.
  6. Xuất: "Lưu ảnh" (Web Share files → fallback tải PNG); "Đặt hình nền" = sao chép PNG vào clipboard rồi mở `shortcuts://run-shortcut?name=<tên>&input=clipboard`; xuất sự kiện `.ics` (Lịch iPhone tự nhắc).
  7. PWA: manifest, service worker (offline app shell), cài Màn hình chính; dữ liệu trong IndexedDB; sao lưu / khôi phục JSON.
  8. Giao diện VI/EN; 12h/24h; tuần bắt đầu T2/CN.
  9. **Âm lịch** (v1.1, D-006): ngày âm nhỏ dưới mỗi ô bố cục Tháng + dòng "Âm lịch d/m [nhuận] <Can Chi năm>" cho hôm nay (Tháng) và nhãn ngày (Agenda); bật/tắt bằng `DesignConfig.showLunar` (mặc định bật). Thuật toán Hồ Ngọc Đức, múi giờ +7, port từ `F:/LICH_NEN/lich-nen.html` L434–513.
- OUT (không làm trong bản này):
  - Đồng bộ Apple Calendar / Reminders (không có API web; cần backend CalDAV); nhập file .ics.
  - Widget Màn hình chính iOS; thông báo đẩy / nhắc cục bộ do app gửi (PWA iOS không lập lịch nhắc offline được — nhắc giờ chỉ qua VALARM trong .ics, IN-10); tự đổi hình nền hằng ngày mà không cần chạm.
  - Ghi sự kiện ngược lên Google; tài khoản / đồng bộ đám mây; mọi backend.
  - Tối ưu riêng cho iPad, Android, desktop (Chrome desktop chạy được nhưng không nghiệm thu).
  - Thương hiệu / tài sản của app gốc; mua trong app; ngôn ngữ ngoài VI/EN.

## 4. Stack & lý do chọn
(Phiên bản kiểm tra bằng WebSearch ngày 2026-09-13; ghim đúng major khi scaffold.)
- **Node ≥ 22 LTS + npm** trên Windows/PowerShell.
- **Vite 8** + **TypeScript** (strict) — build nhanh, PWA plugin có sẵn.
- **Preact 10.29 + TSX** (`@preact/preset-vite`) — 3 KB, mô hình React quen thuộc → thợ ít lỗi; không router, một trang với 5 tab.
- **vite-plugin-pwa 1.3** — sinh manifest + service worker Workbox (`generateSW`); nếu không tương thích Vite 8 thì thay bằng SW viết tay ≈ 40 dòng (ghi DECISIONS.md).
- **idb-keyval 6.3** — lưu JSON trạng thái và Blob ảnh nền vào IndexedDB, không schema.
- **Canvas 2D** của trình duyệt — không thư viện vẽ. **Date + Intl** — không thư viện ngày giờ. **Không GIS SDK** — token client của Google dùng popup, không ổn trong PWA standalone iOS; dùng redirect implicit (`response_type=token`) vẫn được Google hỗ trợ cho ứng dụng phía client.
- Test: **Vitest 5** (unit, môi trường node, hàm thuần) và **Playwright 1.62** (E2E, projects chromium + webkit trên Windows; webkit ≈ Safari).
- Dependency runtime: `preact`, `idb-keyval` (2). Dev: `vite`, `typescript`, `@preact/preset-vite`, `vite-plugin-pwa`, `vitest`, `@playwright/test`.

## 5. Kiến trúc
```
src/
  core/     model.ts · calendar.ts (monthGrid, groupAgenda) · recurrence.ts · i18n.ts (+ vi.json, en.json) · collect.ts (collectRenderData)
  render/   devices.ts · layout/{month,agenda,todo,note}.ts (→ DrawOp[]) · paint.ts (DrawOp[] → canvas) · wallpaper.ts (nền, mờ, tối, gọi layout+paint → Blob PNG)
  storage/  db.ts (idb-keyval: state + Blob ảnh) · backup.ts (JSON xuất/nhập, kiểm tra version)
  google/   oauth.ts (buildAuthUrl, parseFragment, token store) · calendar.ts (fetchCalendars, fetchEvents, normalize)
  export/   share.ts (savePng, copyPng, openShortcut) · ics.ts (eventToIcs)
  ui/       App.tsx · store.ts (AppState, reducer, persist debounce 300 ms) · screens/{Preview,Events,Design,Sync,Guide}.tsx
public/     icon-192.png, icon-512.png (manifest do plugin sinh)
tests/      unit/*.test.ts · e2e/*.spec.ts · fixtures/google/*.json · fixtures/photo-4000x3000.jpg
scripts/    size.mjs
docs/       HUONG-DAN.md (M4)
```
- Module & trách nhiệm:
  - `core/*`: kiểu dữ liệu và toán lịch thuần (không DOM). `collectRenderData(state, today)` trộn sự kiện cục bộ (đã expand) + cache Google + todos + note thành `RenderData`.
  - `render/layout/*`: từ `RenderData + DesignConfig + DeviceSpec` sinh danh sách lệnh vẽ `DrawOp[]` (tọa độ pixel, đã nằm trong vùng an toàn) — thuần, test được không cần canvas. `paint.ts` chỉ dịch `DrawOp` sang Canvas 2D. `wallpaper.ts` điều phối và trả `Blob` PNG.
  - `storage/*`: đọc/ghi IndexedDB; sao lưu JSON `{version:1, state}` (Blob ảnh nền không nằm trong JSON).
  - `google/oauth.ts`: URL ủy quyền, parse `#fragment`, kiểm `state`, lưu `{accessToken, expiresAt}` vào localStorage, `getToken()` trả null nếu hết hạn. `google/calendar.ts`: gọi REST bằng `fetch` + Bearer, phân trang ≤ 2 trang/lịch, chuẩn hóa về `Occurrence` theo giờ địa phương, bỏ sự kiện `cancelled`; 401 → ném `AuthError`.
  - `export/share.ts`: `savePng` (share → download), `copyPng` (ClipboardItem), `openShortcut` (gán `location.href`). `export/ics.ts`: VEVENT có RRULE, CRLF.
  - `ui/*`: Preact; mọi thay đổi trạng thái qua reducer trong `store.ts`; màn Preview render lại khi state đổi (debounce 150 ms).
- Luồng dữ liệu:
  - UI → `dispatch(action)` → `AppState` (bộ nhớ) → `db.ts` (persist) → `collectRenderData` → `layout*` → `DrawOp[]` → `paint` → canvas → PNG Blob → `<img>` preview / `savePng` / `copyPng` → Shortcut.
  - Google: Sync → `buildAuthUrl` → `location.href = url` → Google → quay về `/#access_token=…&state=…` → `parseFragment` (kiểm state, xóa hash bằng `history.replaceState`) → token store → `fetchCalendars` / `fetchEvents` → `state.google.cache = {events, fetchedAt}` → persist → render.
  - Ảnh nền: `<input type=file accept=image/*>` → `createImageBitmap(file, {imageOrientation:'from-image'})` (fallback decode qua `<img>`) → thu nhỏ về ≤ 2× kích thước thiết bị → Blob lưu IndexedDB (`bg`) → dùng khi render.
- Giao diện giữa các module (chữ ký TypeScript, là hợp đồng — thợ không đổi nếu không PHẢN BIỆN):
```ts
// core/model.ts
type ISODate = string;                       // 'YYYY-MM-DD' theo giờ địa phương
type Repeat = 'none'|'daily'|'weekdays' /* v1.3: T2–T6 */|'weekly'|'monthly'|'yearly';
interface LocalEvent { id: string; title: string; date: ISODate; time?: string /*'HH:mm'*/; durationMin?: number; repeat: Repeat; until?: ISODate; color?: string;
  alarmMin?: number /* v1.3: phút nhắc trước, 0/thiếu = không nhắc → VALARM trong .ics */ }
interface Todo { id: string; text: string; done: boolean; order: number; due?: ISODate /* v1.3 */ }
interface Note { id: string; title: string; body: string; pinned: boolean; updated: number }   // v1.3 — tối đa 1 note pinned
interface Occurrence { id: string; sourceId: string; source: 'local'|'google'; title: string; date: ISODate; time?: string; allDay: boolean; color?: string }
interface DeviceSpec { id: string; label: string; width: number; height: number; safeTop: number; safeBottom: number } // safe* là tỉ lệ 0..1 của height
interface DesignConfig { layout: 'month'|'agenda'|'todo'; showNote: boolean /* hiện ghi chú ghim */; showLunar: boolean /* v1.1 */;   // v1.3: bỏ noteText → AppState.notes
  bg: { kind: 'photo'|'solid'|'gradient'; color: string; color2?: string }; blur: 0|1|2|3; dim: number;
  textColor: string; accentColor: string; font: 'sans'|'serif'|'mono'; position: 'top'|'middle'|'bottom';
  scale: number; boxAlpha: number; agendaDays: number; weekStart: 0|1; hour12: boolean; lang: 'vi'|'en' }
interface AppState { version: 1; events: LocalEvent[]; todos: Todo[]; notes: Note[] /* v1.3 */; design: DesignConfig; device: DeviceSpec;
  google: { clientId: string; calendarIds: string[]; cache: { events: Occurrence[]; fetchedAt: number } | null }; shortcutName: string }
// v1.3: vẫn version 1 — normalizeState bù notes: [] và chuyển design.noteText (nếu có, khác rỗng) thành 1 Note pinned.
interface RenderData { today: ISODate; occurrences: Occurrence[]; todos: Todo[] /* đã sắp: chưa xong có hạn ↑, chưa xong không hạn theo order, rồi đã xong */;
  note: string /* body ghi chú ghim, '' nếu không có */; noteTitle?: string /* v1.3 */ }
// core
expandOccurrences(events: LocalEvent[], from: ISODate, to: ISODate): Occurrence[]
monthGrid(year: number, month0: number, weekStart: 0|1): (ISODate|null)[][]          // luôn 6 hàng × 7 cột
groupAgenda(occ: Occurrence[], from: ISODate, days: number): { date: ISODate; items: Occurrence[] }[]
collectRenderData(state: AppState, today: ISODate): RenderData
solarToLunar(iso: ISODate): { day: number; month: number; year: number; leap: boolean }   // v1.1, core/lunar.ts, múi giờ +7
lunarYearName(year: number): string                                                   // "Bính Ngọ"
t(key: string, lang: 'vi'|'en', vars?: Record<string,string|number>): string
// render
type DrawOp = { op:'rect'; x:number; y:number; w:number; h:number; r?:number; fill:string; alpha?:number }
            | { op:'text'; x:number; y:number; text:string; size:number; weight:400|600|700; color:string; align:'left'|'center'|'right'; font:'sans'|'serif'|'mono' }
            | { op:'dot'; x:number; y:number; r:number; fill:string }
layoutMonth(d: RenderData, c: DesignConfig, dev: DeviceSpec): DrawOp[]   // layoutAgenda, layoutTodo, layoutNote cùng chữ ký
paint(ctx: CanvasRenderingContext2D, ops: DrawOp[]): void
renderWallpaper(state: AppState, bg: Blob|null, today: ISODate): Promise<Blob>   // PNG đúng device.width × device.height
// storage
loadState(): Promise<AppState|null>; saveState(s: AppState): Promise<void>; loadBg(): Promise<Blob|null>; saveBg(b: Blob|null): Promise<void>
exportBackup(s: AppState): string; importBackup(json: string): AppState   // ném lỗi nếu version lạ
// google
buildAuthUrl(clientId: string, redirectUri: string, state: string, prompt?: 'select_account'|'none'): string
parseFragment(hash: string, expectedState: string): { accessToken: string; expiresIn: number } | { error: string } | null
fetchCalendars(token: string): Promise<{ id: string; summary: string; color: string }[]>
fetchEvents(token: string, calendarIds: string[], timeMin: ISODate, timeMax: ISODate): Promise<Occurrence[]>
// export
savePng(blob: Blob, filename: string): Promise<'shared'|'downloaded'>; copyPng(blob: Blob): Promise<boolean>; openShortcut(name: string): void
eventToIcs(e: LocalEvent): string
```
Quy ước: `core/*`, `render/layout/*`, `google/oauth.ts`, phần normalize của `google/calendar.ts`, `export/ics.ts`, `storage/backup.ts` là hàm thuần → Vitest. Phần chạm DOM/trình duyệt (`paint`, `wallpaper`, `share`, `db`, `ui`) → Playwright. Khi có `?test=1`, app gắn `window.__lastOps: DrawOp[]` sau mỗi lần render (chỉ để E2E kiểm vùng an toàn).

## 6. Milestone (theo thứ tự xây; mỗi cái ≈ 25%)
### M1 — Khung PWA + dựng hình nền bố cục Tháng (luồng chính chạy được)
Nội dung: scaffold Vite + Preact + TS; manifest + service worker; `devices.ts` (preset, tự phát hiện, tùy chỉnh); `model.ts`, `monthGrid`, `layoutMonth`, `paint`, `wallpaper` với nền màu đơn/gradient; màn Preview (chọn thiết bị, nút "Lưu ảnh"); `store.ts` + `db.ts` lưu design/device; scripts npm `dev / build / preview / test / e2e / check`; Playwright config (chromium + webkit, `webServer: npm run preview`).
- Tiêu chí nghiệm thu (kiểm tra được bằng lệnh hoặc thao tác):
  - [ ] `npm run build` thành công; `dist/` có `manifest.webmanifest` và `sw.js`.
  - [ ] `npx vitest run tests/unit/calendar.test.ts tests/unit/layout-month.test.ts` pass: `monthGrid(2026,1,1)` (tháng 2/2026, bắt đầu T2) và `monthGrid(2026,2,0)` đúng ngày đầu/cuối, luôn 6×7, ngoài tháng = null; `layoutMonth` trả ≥ 28 op text ngày, có op tô hôm nay bằng `accentColor`, mọi op nằm trong `[safeTop·H, (1−safeBottom)·H]`.
  - [ ] `npx playwright test tests/e2e/m1-render.spec.ts` pass trên chromium và webkit — **T-1.END**: mở app → chọn thiết bị 1179×2556 → `<img>` preview có `naturalWidth=1179`, `naturalHeight=2556` → nhấn "Lưu ảnh" tạo download `.png` > 10 KB → tải lại trang vẫn giữ thiết bị đã chọn (IndexedDB).
  - [ ] E2E: trên bản preview, `navigator.serviceWorker.ready` resolve và có `<link rel="manifest">`.
  - [ ] `npm run check` pass toàn bộ.

### M2 — Sự kiện, to-do, ghi chú cục bộ; bố cục Agenda / To-do / Note; sao lưu; i18n
Nội dung: màn Events (CRUD sự kiện lặp, to-do, ghi chú); `recurrence.ts`; `groupAgenda`; `layoutAgenda`, `layoutTodo`, `layoutNote`; `collectRenderData`; `ics.ts` + nút "Thêm vào Lịch iPhone" (tải `.ics`); `backup.ts` + nút xuất/nhập JSON; `i18n.ts` (vi/en) cho toàn UI hiện có; 12h/24h; weekStart.
- Tiêu chí nghiệm thu:
  - [ ] Unit `recurrence.test.ts`: daily / weekly / monthly (sự kiện ngày 31 bỏ qua tháng thiếu ngày) / yearly (29/02 chỉ năm nhuận) / `until` / không lặp; chặn đúng khoảng `[from, to]`. `ics.test.ts`: có VCALENDAR, VEVENT, DTSTART, RRULE đúng, xuống dòng CRLF. `layout.test.ts`: agenda 7 ngày đúng thứ tự thời gian, to-do ≤ 12 dòng có dấu tick, note bọc dòng. `i18n.test.ts`: tập khóa `vi` = tập khóa `en`.
  - [ ] E2E `m2-events.spec.ts` — **T-2.END**: thêm sự kiện lặp tuần → chuyển bố cục Agenda → hash PNG preview đổi → reload → sự kiện còn → xuất JSON → xóa dữ liệu → nhập JSON → sự kiện trở lại.
  - [ ] E2E: đổi ngôn ngữ `en` → nhãn tab đổi; bật 12h → agenda chứa "AM"/"PM".
  - [ ] (v1.1) `lunar.test.ts`: 17/02/2026 → 1/1 Bính Ngọ; 29/01/2025 → 1/1 Ất Tỵ; 10/02/2024 → 1/1 Giáp Thìn; 22/03/2023 → 1/2 nhuận; 25/07/2025 → 1/6 nhuận; pass cả 2 TZ. `showLunar=true` → `__lastOps` bố cục Tháng có op text ngày âm; `false` → không có.
  - [ ] (v1.3) `recurrence.test.ts`: `weekdays` chỉ T2–T6, tôn trọng `until`. `ics.test.ts`: `weekdays` → `RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR`; `alarmMin=15` → `BEGIN:VALARM … TRIGGER:-PT15M … END:VALARM`; không `alarmMin` → không VALARM. `collect.test.ts`: thứ tự to-do theo hạn/`order`; `note`/`noteTitle` lấy từ ghi chú ghim. `model.test.ts`: state có `design.noteText` → 1 Note pinned. `layout.test.ts`: to-do có nhãn hạn, quá hạn tô accent; note có dòng tiêu đề.
  - [ ] E2E T-2.END bổ sung: sự kiện lặp T2–T6 hiện đúng ngày; tải .ics có VALARM; 2 ghi chú, ghim cái thứ 2 → `__lastOps` chứa tiêu đề ghi chú thứ 2, không chứa ghi chú 1.
  - [ ] `npm run check` pass; test M1 không bị sửa/skip (kiem-thu xác nhận).

### M3 — Google Calendar (OAuth thuần client, chỉ đọc) + trộn dữ liệu
Nội dung: `oauth.ts` (redirect implicit, `state` ngẫu nhiên chống CSRF, token + `expiresAt` trong localStorage, xử lý `#error=`); `calendar.ts` (`calendarList`, `events?singleEvents=true&orderBy=startTime&timeMin&timeMax&maxResults=250`, ≤ 2 trang/lịch, normalize `start.date` / `start.dateTime`, màu lịch, bỏ `cancelled`); màn Sync (dán Client ID, Kết nối, chọn lịch, Đồng bộ ngay, hiện thời điểm đồng bộ, Ngắt kết nối); tự đồng bộ khi mở app (token còn hạn và cache > 30 phút); cache dùng offline; 401 → "Kết nối lại"; sự kiện Google hiện ở cả 3 bố cục.
- Tiêu chí nghiệm thu:
  - [ ] Unit `oauth.test.ts`: `buildAuthUrl` chứa `response_type=token`, `scope=…calendar.readonly`, `state`, `redirect_uri` đúng; `parseFragment` đúng state / sai state / có `error` / hash rỗng. `google-normalize.test.ts`: fixture all-day (`start.date`) → `allDay=true`, đúng ngày; `dateTime` có offset khác múi giờ máy → ngày/giờ địa phương đúng khi chạy với `TZ=Asia/Ho_Chi_Minh` và `TZ=UTC` (Vitest chạy 2 lần bằng biến môi trường trong script `test`); sự kiện `status=cancelled` bị bỏ; nhiều lịch gộp và sắp xếp.
  - [ ] E2E `m3-google.spec.ts` — **T-3.END**: `page.route` chặn `https://accounts.google.com/**` và trả 302 về `/#access_token=test&token_type=Bearer&expires_in=3600&state=<lấy từ query của request>`; mock `**/calendar/v3/**` bằng fixtures → dán clientId → Kết nối → danh sách lịch hiện → chọn 1 lịch → Đồng bộ → agenda hiện sự kiện fixture → `context.setOffline(true)` + reload → vẫn hiện từ cache → mock 401 → hiện "Kết nối lại".
  - [ ] Không có secret trong repo: `Select-String -Path src -Pattern client_secret -Recurse` trả rỗng.
  - [ ] `npm run check` pass; test M1–M2 không bị sửa/skip.

### M4 — Ảnh nền & tùy biến, đặt hình nền một chạm, hướng dẫn, hoàn thiện iPhone
Nội dung: ảnh nền từ Thư viện (EXIF, cover-fit, thu nhỏ), mờ bằng hạ/tăng mẫu (không dựa `ctx.filter`), tối; màu chữ/nhấn, font, vị trí, scale, boxAlpha; `copyPng` + `openShortcut` với tên Shortcut cấu hình được; màn Guide (cài PWA, tạo Shortcut, tạo OAuth Client ID, quy trình hằng ngày); thông báo lỗi rõ ràng (share/clipboard không hỗ trợ → hướng dẫn thay thế); `docs/HUONG-DAN.md`; `scripts/size.mjs`; chạy toàn luồng trên webkit.
- Tiêu chí nghiệm thu:
  - [ ] E2E `m4-design.spec.ts` — **T-4.END**: tải `fixtures/photo-4000x3000.jpg` → preview đổi, kích thước vẫn bằng thiết bị; lần lượt đổi `blur=2`, `dim=0.4`, `position=bottom`, `font=serif` → hash PNG khác sau mỗi bước; `window.__lastOps` mọi op vẫn trong vùng an toàn.
  - [ ] E2E (chromium, cấp quyền `clipboard-write`): "Sao chép" ghi mục `image/png` vào clipboard; "Đặt hình nền" gọi điều hướng tới URL bắt đầu bằng `shortcuts://run-shortcut?name=` (bắt bằng stub `location.assign`/`href` khi `?test=1`).
  - [ ] Offline: sau lần tải đầu, `context.setOffline(true)` → reload vẫn mở được app (service worker).
  - [ ] `npm run build` rồi `node scripts/size.mjs`: tổng JS gzip < 150 KB.
  - [ ] `npm run check` pass trên chromium + webkit; `docs/HUONG-DAN.md` có đủ 4 phần (cài PWA, Shortcut, Google OAuth, HTTPS/hosting).
  - [ ] Thử tay trên iPhone của Chủ dự án theo HUONG-DAN.md; kết quả ghi vào `docs/bao-cao/M4.md` (không chặn nghiệm thu bằng lệnh, nhưng là điều kiện để đóng dự án).

## 7. Chiến lược test
- Lệnh chạy test tổng: `npm run check` (PowerShell, tại `E:\DuAn\thu-nghiem`) = `tsc --noEmit && vitest run && playwright test`.
- Chuẩn bị một lần: `npm install`; `npx playwright install chromium webkit` (~400 MB).
- Unit (Vitest, môi trường node): chỉ hàm thuần; fixture trong `tests/fixtures`; không mock `Date` toàn cục — mọi hàm nhận `today`/`from` làm tham số; script `test` chạy Vitest hai lần với `TZ=Asia/Ho_Chi_Minh` và `TZ=UTC` (dùng `cross-env` hoặc `process.env.TZ` trong `vitest.config.ts`).
- E2E (Playwright): projects `chromium` (viewport 428×926) và `webkit` (`devices['iPhone 13 Pro Max']`, viewport 428×926 — v1.2), `webServer: npm run preview` (chạy trên bản build để service worker hoạt động), `page.route` cho Google, `?test=1` bật hook `window.__lastOps` và stub điều hướng `shortcuts://`.
- Không test pixel-snapshot (font khác giữa máy); so sánh cấu trúc `DrawOp` và "hash PNG thay đổi" thay vì "bằng ảnh mẫu".
- Test của phiếu DONE là khóa (CLAUDE.md); mỗi milestone có đúng một E2E luồng chính `T-n.END`.

## 8. Rủi ro & cách giảm
1. OAuth redirect trong PWA standalone iOS (Google mở trong sheet trong-app, cookie tách) → cache sự kiện dùng offline; token 1 giờ, gia hạn bằng `prompt=none`; Guide hướng dẫn kết nối trong tab Safari nếu standalone trục trặc.
2. Clipboard ảnh / Web Share files / `shortcuts://` khác nhau giữa trình duyệt → chuỗi fallback: share → tải; copy thất bại → hướng dẫn "Lưu ảnh" + Shortcut dùng "Get Latest Photos".
3. Shortcut "Set Wallpaper" yêu cầu iOS 17+ và hình nền hiện tại ở chế độ Ảnh (không Photo Shuffle) → nêu trong Guide. Không thể tự đổi hằng ngày không chạm → giới hạn đã biết.
4. Safari xóa IndexedDB sau 7 ngày không dùng với web thường; PWA cài Màn hình chính không bị → khuyến nghị cài + sao lưu JSON.
5. Vitest 5 (mới 10 ngày) / vite-plugin-pwa 1.3 với Vite 8 có thể lệch → nếu lỗi: ghim Vitest 4.x hoặc SW viết tay; ghi DECISIONS.md, không đổi SPEC.
6. `ctx.filter` blur không đồng nhất trên Safari → blur bằng hạ/tăng mẫu canvas.
7. Google ở trạng thái Testing: màn "ứng dụng chưa xác minh", tối đa 100 test user → chấp nhận (dùng cá nhân).
8. iPhone đời mới không có preset → tự phát hiện `screen × DPR` là mặc định; tùy chỉnh tay khi cần.
9. Ảnh lớn gây tràn bộ nhớ canvas trên iOS → thu nhỏ ảnh về ≤ 2× kích thước thiết bị trước khi lưu.

## 9. Giả định (Kiến trúc sư tự quyết; Chủ dự án có thể bác)
- Tên làm việc "LichKhoa"; icon tự vẽ đơn giản; Chủ dự án có thể đổi tên sau.
- iPhone chạy iOS 17+; hình nền hiện tại ở chế độ Ảnh.
- Google scope chỉ `https://www.googleapis.com/auth/calendar.readonly`; Client ID dán trong UI, lưu localStorage, không commit vào repo.
- Hosting HTTPS: GitHub Pages là phương án chính (Vite `base` đọc từ biến `VITE_BASE`, mặc định `/`); Netlify Drop dự phòng; cloudflared quick tunnel cho thử nhanh. Deploy/push chỉ do Quản lý sau khi Chủ dự án đồng ý.
- Mặc định: ngôn ngữ VI, tuần bắt đầu T2, 24h, bố cục Tháng, agenda 7 ngày (tối đa 12 dòng), to-do tối đa 12 dòng, vùng an toàn `safeTop=0.30`, `safeBottom=0.14`, tên Shortcut `DatHinhNen`.
- Khoảng đồng bộ Google cố định [hôm nay − 1, + 60 ngày]; sự kiện Google không chỉnh sửa được trong app.
- Không tối ưu iPad/Android/desktop; không hỗ trợ nhiều người dùng.

## 10. Việc Chủ dự án tự làm & cách thử trên iPhone
A. Tạo Google OAuth Client ID (≈ 10 phút, miễn phí, không cần thẻ):
1. https://console.cloud.google.com → tạo project (vd. "LichKhoa").
2. APIs & Services → Library → "Google Calendar API" → Enable.
3. Google Auth Platform → Branding: tên app + email hỗ trợ; Audience: External, giữ trạng thái Testing; Test users: thêm Gmail của bạn.
4. Clients → Create client → Web application. Authorized JavaScript origins: `http://localhost:5173` và `https://<host>`. Authorized redirect URIs: `http://localhost:5173/` và `https://<host>/<đường-dẫn>/` (đúng URL mở app, có dấu `/` cuối).
5. Sao chép Client ID (`….apps.googleusercontent.com`) → trong app: tab Đồng bộ → dán → Kết nối. Không cần client secret.
B. HTTPS để thử trên iPhone (service worker, Web Share, Clipboard chỉ chạy trên HTTPS):
- Chính, miễn phí, URL ổn định: **GitHub Pages** — repo GitHub public; Quản lý thêm workflow build `dist` (push chỉ sau khi bạn đồng ý) → `https://<user>.github.io/<repo>/`, build với `VITE_BASE=/<repo>/`.
- Không cần push: **Netlify Drop** — `npm run build` rồi kéo thả thư mục `dist` vào https://app.netlify.com/drop (tài khoản free) → `https://<tên>.netlify.app`.
- Thử nhanh trong LAN: `npm run dev -- --host` + `cloudflared tunnel --url http://localhost:5173` (tải `cloudflared.exe`, không cần tài khoản) → URL `https://*.trycloudflare.com` tạm; không dùng cho OAuth vì đổi mỗi lần.
- Trên iPhone: Safari mở URL → Chia sẻ → "Thêm vào MH chính" → mở từ icon (chế độ standalone).
C. Tạo Shortcut "DatHinhNen" (1 lần): Shortcuts → + → thêm action "Set Wallpaper" (Đặt hình nền): Image = Shortcut Input, chọn Lock Screen, tắt "Show Preview" → đặt tên trùng tên trong app (mặc định `DatHinhNen`). Hằng ngày: mở app → "Đặt hình nền" (app sao chép PNG vào clipboard và mở Shortcut với `input=clipboard`); lần đầu iOS hỏi quyền cho Shortcut.
