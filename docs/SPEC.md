# SPEC — LichKhoa (tái tạo tính năng "Ink: Lockscreen Calendar, Note" dưới dạng PWA)
(Kiến trúc sư điền ở Giai đoạn 0. Đây là nguồn sự thật; mọi thay đổi phạm vi phải qua Chủ dự án.)

Phiên bản SPEC: 1.8 — 2026-09-19 (v1.8, D-031: **Nhắc trên iPhone qua Phím tắt** — nút trong 3 form mở hộp chọn thời điểm → "Thêm báo thức" (app Đồng hồ) / "Thêm lời nhắc" (Reminders) / "Không báo thức"; IN-11, `AppState.alarmShortcutName`/`reminderShortcutName`, `export/reminder.ts`, milestone M7). Trước đó 1.7 — 2026-09-15 (v1.7, D-028: Việc cần làm — vuốt trái Xóa/Lưu trữ, nhấn giữ kéo sắp xếp, `Todo.archived`, milestone M6). Trước đó 1.6 — 2026-09-15 (v1.6, D-026: hình nền ẩn sự kiện trùng local/Google — giữ cái tạo sau; `createdAt`). Trước đó 1.5 — 2026-09-15 (v1.5, D-024: bố cục **Tuần** giống app Inks — IN-2, `Occurrence.endTime`, đồng bộ Google từ hôm nay − 7, milestone M5). Trước đó 1.4 — 2026-09-14 (v1.4, D-018: bố cục Tháng có danh sách sự kiện + to-do bên dưới `monthList`; tab Sự kiện hiện sự kiện Google chỉ xem). Trước đó 1.3 — 2026-09-13 (v1.0 + Âm lịch D-006 + thiết bị đích iPhone 13 Pro Max D-007 + lặp T2–T6, nhắc giờ qua .ics, hạn chót to-do, nhiều ghi chú D-011). Kiến trúc sư soát v1.3 ngày 2026-09-14 (D-012): chỉ chỉnh chữ §3 (thứ tự IN-10), §5 (cây thư mục, thêm `cmpTodo`/`buildOps`), §9 (trần dòng agenda); không đổi phạm vi. Duyệt M3 (D-015, 2026-09-14): chỉ chỉnh chữ §8 rủi ro 1. Nghiệm thu cuối (D-021, 2026-09-14): Kiến trúc sư soát v1.4 — chỉ chỉnh chữ §2 TH1, §3 IN-10 (D-020), §5 (background.ts, ui/sync.ts, pages.yml, ảnh nền D-017), §6 M4 (tiêu chí v1.4/D-020), §8 rủi ro 3, §9 hosting thực tế (D-019); không đổi phạm vi. App gốc đối chiếu: "Ink: Lockscreen Calendar, Note" (SilverAI JSC, App Store id6769250805, bản 1.2.14). Tính năng gốc đã tra cứu: hình nền màn hình khóa có lịch / agenda / to-do chồng lên ảnh cá nhân; đồng bộ Google Calendar và Apple Calendar; tạo sự kiện lặp có nhắc; tùy chỉnh ảnh, màu, độ mờ, ngôn ngữ; widget lịch và ghi chú; dữ liệu xử lý trên máy. Tên làm việc "LichKhoa" — không dùng tên, logo, ảnh, font của app gốc; chỉ tái tạo tính năng và luồng dùng.

## 1. Mục tiêu
Một PWA chạy trên Safari iPhone (cài lên Màn hình chính) cho phép Chủ dự án: (a) dựng ảnh hình nền màn hình khóa đúng kích thước pixel máy, có lịch tháng / agenda / to-do / ghi chú chồng lên ảnh nền tự chọn; (b) trộn sự kiện Google Calendar (chỉ đọc, OAuth thuần client, không backend) với sự kiện lặp và to-do nhập tại chỗ; (c) đặt làm hình nền khóa bằng ≤ 3 chạm mỗi ngày qua Shortcut. Dùng cá nhân, không đăng nhập, dữ liệu nằm trên máy.

## 2. Người dùng & tình huống dùng
- Một người dùng (Chủ dự án), **iPhone 13 Pro Max** (1284×2778 px, 428×926 pt, DPR 3, tai thỏ — v1.2, D-007), iOS 17+, Safari, dùng dạng PWA Màn hình chính; mọi UI và hình nền tối ưu cho máy này trước; máy dev Windows 10 (Chrome dùng để chỉnh thiết kế, không bắt buộc).
- TH1 hằng ngày: mở icon → app tự đồng bộ Google nếu token còn hạn → hiện hình nền hôm nay → chạm "Đặt hình nền" → Shortcut đặt hình nền khóa. (Token Google sống 1 giờ, không gia hạn ngầm — §8.1: mở app sau > 1 giờ thì thêm bước "Kết nối lại" ở tab Đồng bộ trước khi có sự kiện mới; cache cũ vẫn dùng được.)
- TH2: thêm/sửa sự kiện lặp, to-do, ghi chú; xuất .ics để Lịch iPhone nhắc giờ; (v1.8) ngay trong form bấm "Nhắc trên iPhone" → chọn thời điểm → tạo báo thức trong app Đồng hồ (kêu to, trong 24 h tới) hoặc lời nhắc trong Reminders (có ngày) qua Phím tắt tự cài.
- TH3 thi thoảng: đổi ảnh nền / bố cục / màu / vị trí; kết nối lại Google khi token hết hạn.
- TH4: sao lưu / khôi phục dữ liệu bằng file JSON.

## 3. Phạm vi
- IN:
  1. Dựng PNG đúng kích thước pixel màn hình iPhone: preset (`devices.ts`, gồm 1284×2778 iPhone 12/13 Pro Max — mặc định khi không nhận ra máy, v1.2), tự phát hiện (`screen × devicePixelRatio`, mặc định), tùy chỉnh; vùng an toàn tránh đồng hồ (trên) và nút đèn pin/camera (dưới).
  2. Ba bố cục: **Tháng** (lưới 6×7, tô hôm nay, chấm sự kiện; v1.4 D-018: khi `monthList` bật — mặc định — dưới lưới có danh sách sự kiện từ hôm nay trong `agendaDays` ngày + to-do chưa xong, cắt theo chỗ trống kèm dòng "+N"; hình nền là ảnh tĩnh nên không cuộn), **Agenda** (N ngày tới, giờ + tên, màu lịch), **To-do** (checklist), **Tuần** (v1.5, D-024 — mẫu `docs/tham-khao/inks-tuan.PNG`: 7 cột của tuần chứa hôm nay theo `weekStart`; đầu cột thứ + ngày (+ ngày âm nhỏ khi `showLunar`); cột hôm nay tô nền nhạt; dưới mỗi ngày tối đa 4 chip bo góc màu pastel (màu sự kiện/lịch pha trắng, chữ tối; to-do pastel vàng): giờ bắt đầu–kết thúc + tên; > 4 mục → 3 chip + chip "+N"; to-do có hạn nằm dưới ngày hạn, quá hạn chưa xong dồn hôm nay, không hạn không hiện; dưới dải tuần là danh sách chi tiết hôm nay: vạch màu, tên đậm, "◷ giờ", cắt theo chỗ trống + "+N"). Lớp **Ghi chú** (văn bản tự do) bật/tắt trên mọi bố cục.
  3. Nền: ảnh từ Thư viện (cover-fit, tôn trọng EXIF), màu đơn, gradient; mờ (0–3) + tối (0–0.8); màu chữ / màu nhấn; 3 họ font hệ thống (sans/serif/mono); vị trí khối (trên/giữa/dưới trong vùng an toàn); cỡ chữ (scale); độ trong suốt hộp.
  4. Sự kiện cục bộ: CRUD; cả ngày hoặc có giờ; lặp ngày/**T2–T6**/tuần/tháng/năm + ngày kết thúc; to-do tick/bỏ tick; ghi chú. (v1.7, D-028) **Việc cần làm**: vuốt trái một việc → nút Lưu trữ + Xóa (Xóa ngay, thông báo "Hoàn tác" ~5 s); lưu trữ = ẩn khỏi danh sách và hình nền, xem ở phần "Đã lưu trữ" cuối danh sách (vuốt trái → Khôi phục / Xóa); nhấn giữ rồi kéo lên/xuống để đổi thứ tự, chỉ trong cùng nhóm hiển thị (IN-10). Sự kiện và Ghi chú không có cử chỉ này.
  5. Google Calendar chỉ đọc: OAuth implicit redirect tự viết (không SDK), chọn lịch, tải sự kiện trong [hôm nay − 7 … + 60 ngày] (v1.5: − 7 để đủ cả tuần của bố cục Tuần; trước là − 1), cache cục bộ dùng offline, tự đồng bộ khi mở app nếu token còn hạn và cache cũ hơn 30 phút. (v1.4, D-018) Tab Sự kiện hiện cả sự kiện Google (chấm + danh sách ngày, nhãn "Google"), chỉ xem, không sửa/xóa. (v1.6, D-026; D-027 mở rộng mọi nguồn) **Hình nền** (mọi bố cục) ẩn sự kiện trùng (local–Google, local–local, Google–Google): trùng = cùng ngày + cùng giờ bắt đầu (hoặc cùng là cả ngày) + cùng tên (NFC, bỏ khoảng trắng thừa, không phân biệt hoa thường); chỉ giữ cái có `createdAt` lớn nhất (thiếu = 0; bằng nhau → Google; cùng nguồn bằng nhau → mục thêm sau). Tab Sự kiện vẫn hiện đủ.
  6. Xuất: "Lưu ảnh" (Web Share files → fallback tải PNG); "Đặt hình nền" = sao chép PNG vào clipboard rồi mở `shortcuts://run-shortcut?name=<tên>&input=clipboard`; xuất sự kiện `.ics` (Lịch iPhone tự nhắc).
  7. PWA: manifest, service worker (offline app shell), cài Màn hình chính; dữ liệu trong IndexedDB; sao lưu / khôi phục JSON.
  8. Giao diện VI/EN; 12h/24h; tuần bắt đầu T2/CN.
  9. **Âm lịch** (v1.1, D-006): ngày âm nhỏ dưới mỗi ô bố cục Tháng + dòng "Âm lịch d/m [nhuận] <Can Chi năm>" cho hôm nay (Tháng) và nhãn ngày (Agenda); bật/tắt bằng `DesignConfig.showLunar` (mặc định bật). Thuật toán Hồ Ngọc Đức, múi giờ +7, port từ `F:/LICH_NEN/lich-nen.html` L434–513.
  10. (v1.3, D-011 — theo `F:/LICH_NEN`) **Lặp T2–T6** (`repeat: 'weekdays'`; .ics `FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR`; sự kiện tạo vào T7/CN bắt đầu từ T2 kế tiếp — cả app lẫn .ics). **Nhắc giờ** = trường "Nhắc trước" (`alarmMin`: 5/15/30/60/1440 phút) xuất thành `VALARM` trong .ics — Lịch iPhone nhắc; app KHÔNG tự gửi thông báo. **Hạn chót to-do** (`due`): việc chưa xong có hạn xếp trước theo hạn tăng dần, việc không hạn xếp sau theo `order` (lên/xuống tay, chỉ trong cùng nhóm hiển thị); nhãn "Quá hạn" / "Hôm nay" / "d/m" trong app và trên hình nền (quá hạn tô `accentColor`). **Nhiều ghi chú** (tiêu đề + nội dung) trong app; ghim đúng 1 ghi chú (ghim cái mới → bỏ ghim cái cũ; `normalizeState` cũng ép ≤ 1 ghim khi nhập JSON); hình nền hiện ghi chú ghim (tiêu đề + ≤ 4 dòng) khi `showNote`; (v1.4, D-020) ghim một ghi chú → `showNote` tự bật, bỏ ghim không tự tắt, công tắc vẫn tắt được; `noteText` cũ tự thành ghi chú ghim.
  11. (v1.8, D-031) **Nhắc trên iPhone qua Phím tắt** — vì thông báo của Lịch iPhone (VALARM, IN-10) chưa đủ gây chú ý. Web không có API tạo báo thức; cách duy nhất là deep link `shortcuts://run-shortcut?name=<tên>&input=text&text=<payload>` (cơ chế đã dùng ở IN-6) tới Phím tắt Chủ dự án tự cài theo §10.D.
      - **Nơi có nút**: 3 form — sửa/thêm sự kiện (Sheet `EventsTab`), thêm việc (hàng nhập `TodosTab`), thêm/sửa ghi chú (Sheet `NoteTab`) — mỗi form đúng một nút "Nhắc trên iPhone" (`data-testid="rem-open"`), vô hiệu khi form chưa hợp lệ (thiếu tiêu đề / nội dung việc / ghi chú trống).
      - **Hộp thoại `ReminderDialog`** (nổi trên form): ô `<input type="datetime-local" step="60">` (`rem-at`) mặc định theo `defaultReminderAt` — sự kiện: lần xảy ra kế tiếp sau bây giờ theo dữ liệu đang nhập (ngày/giờ/lặp/kết thúc, cả ngày → 08:00; không còn lần nào → ngày + giờ đang nhập); việc: ngày hạn lúc 08:00, không hạn → giờ tròn kế tiếp; ghi chú: giờ tròn kế tiếp. Không dùng `alarmMin`. Dòng trạng thái theo `reminderWindow`: thời điểm ≤ bây giờ → cả hai nút hành động vô hiệu; > bây giờ + 24 h → chỉ "Thêm báo thức" vô hiệu kèm gợi ý dùng Lời nhắc (báo thức Đồng hồ không có ngày, sẽ kêu sai ngày).
      - **Ba nút**: "Thêm báo thức" (`rem-alarm`) → mở Phím tắt `state.alarmShortcutName` (mặc định `ThemBaoThuc`); "Thêm lời nhắc" (`rem-reminder`) → Phím tắt `state.reminderShortcutName` (mặc định `ThemLoiNhac`); "Không báo thức" (`rem-none`, cũng là bấm nền mờ) → đóng hộp, không điều hướng, không đổi dữ liệu. Hai tên sửa được ở tab Xem trước cạnh "Tên Shortcut" (`shortcut-alarm-name`, `shortcut-reminder-name`), lưu trong `AppState`, `normalizeState` bù mặc định; JSON sao lưu vẫn `version: 1` (chỉ thêm 2 chuỗi cấp `AppState`; `LocalEvent`/`Todo`/`Note` không đổi).
      - **Hành động = lưu rồi mở Phím tắt**: gọi đúng hàm lưu của form (sự kiện add/update; việc `addTodo` + xóa ô nhập; ghi chú add/update) — rời app sang Phím tắt có thể làm iOS đóng PWA và mất dữ liệu đang nhập; lưu thất bại → không điều hướng. Sau đó đóng hộp + Sheet form, toast "Đã mở Phím tắt <tên>", `openShortcut(name, payload)`. App **không** lưu lịch sử báo thức/lời nhắc đã tạo, không sửa/xóa được từ app, không kiểm Phím tắt có tồn tại (thiếu → iOS tự báo).
      - **Payload** (hợp đồng với Phím tắt, `reminderText`): 2–3 dòng cách nhau bằng `\n`, không dòng trống cuối. Dòng 1 `YYYY-MM-DD HH:mm` (giờ địa phương, 24 h — chọn dạng số vì không phụ thuộc ngôn ngữ máy). Dòng 2 tên: tiêu đề sự kiện / nội dung việc / tiêu đề ghi chú (trống → dòng đầu nội dung); xuống dòng → khoảng trắng, trim, ≤ 100 ký tự, rỗng → `LichKhoa`. Dòng 3 (chỉ khi có): ghi chú — với ghi chú là nội dung, xuống dòng → " · ", ≤ 200 ký tự; sự kiện và việc không có dòng 3. Ví dụ: `2026-09-20 07:30\nHọp nhóm`. Phím tắt tách bằng "Split Text" (New Lines), lấy mục 1 → "Get Dates from Input" → Time/Alert; mục 2 → Label/Reminder; mục 3 → Notes (§10.D).
      - Hướng dẫn: `docs/HUONG-DAN.md` §E (2 Phím tắt từng bước + bật "Nhạy cảm thời gian" cho Reminders) và thẻ 7 trong tab Hướng dẫn (VI/EN).
- OUT (không làm trong bản này):
  - Đồng bộ Apple Calendar / Reminders (không có API web; cần backend CalDAV); nhập file .ics.
  - (v1.6, D-026) Bấm (đúp) vào sự kiện để mở Google Calendar — hình nền màn khóa là ảnh tĩnh, iOS không cho tương tác; Chủ dự án không muốn làm trong app.
  - Widget Màn hình chính iOS; thông báo đẩy / nhắc cục bộ do app gửi (PWA iOS không lập lịch nhắc offline được — nhắc giờ chỉ qua VALARM trong .ics (IN-10) hoặc qua Phím tắt (IN-11)); tự đổi hình nền hằng ngày mà không cần chạm.
  - (v1.8, D-031) Trong IN-11 vẫn OUT: báo thức **lặp theo thứ** (payload không mang thông tin lặp; mỗi lần bấm = 1 báo thức một lần — có thể mở sau nếu Chủ dự án cần); tự tạo hàng loạt cho mọi sự kiện/việc; sửa/xóa/đồng bộ ngược báo thức hoặc lời nhắc đã tạo; đặt cờ "Nhạy cảm thời gian" từ app (là cài đặt hệ thống của app Reminders, không đặt được qua Phím tắt); tự quay về LichKhoa sau khi Phím tắt chạy xong; app tự kiểm Phím tắt đã cài chưa.
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
  core/     model.ts (kiểu + normalizeState) · calendar.ts (monthGrid, groupAgenda) · recurrence.ts · lunar.ts (v1.1) · i18n.ts (+ i18n/vi.json, en.json) · collect.ts (collectRenderData, cmpTodo)
  render/   devices.ts · background.ts (M4: coverFit/fitDownscale/blurDownsampleRatio thuần · loadPhoto, drawBackground) · layout/common.ts (DrawOp, vùng an toàn, nhãn) · layout/{month,agenda,todo,note}.ts (→ DrawOp[]) · paint.ts (DrawOp[] → canvas) · wallpaper.ts (buildOps; nền, mờ, tối → Blob PNG)
  storage/  db.ts (idb-keyval: state + Blob ảnh) · backup.ts (JSON xuất/nhập, kiểm tra version)
  google/   oauth.ts (buildAuthUrl, parseFragment, token store) · calendar.ts (fetchCalendars, fetchEvents, normalize)
  export/   share.ts (savePng, copyPng, openShortcut, shortcutUrl — v1.8) · ics.ts (eventToIcs) · reminder.ts (v1.8: defaultReminderAt, reminderWindow, reminderText — thuần)
  ui/       App.tsx · store.ts (reducer, persist debounce 300 ms, flushPersist khi ẩn — B-006) · sync.ts (autoSyncIfNeeded, performSyncShared) · components/{Sheet,Toast,ReminderDialog (v1.8)}.tsx · screens/{Preview,Events,Design,Sync,Guide}.tsx · screens/events/{EventsTab,TodosTab,NoteTab,util}.tsx
public/     icon-192.png, icon-512.png (manifest do plugin sinh)
tests/      unit/*.test.ts · e2e/*.spec.ts · fixtures/google/*.json · fixtures/photo-4000x3000.jpg
scripts/    size.mjs · agy-run.sh (làn Gemini, D-009) · mau-anh-*.cjs / chup-*.cjs (ảnh mẫu có dữ liệu + chụp webkit để review bằng mắt — D-012)
docs/       HUONG-DAN.md (M4; §E Phím tắt nhắc — M7)
.github/    workflows/pages.yml (D-019: push `main` → build `VITE_BASE=/<repo>/` → deploy GitHub Pages)
```
- Module & trách nhiệm:
  - `core/*`: kiểu dữ liệu và toán lịch thuần (không DOM). `collectRenderData(state, today)` trộn sự kiện cục bộ (đã expand) + cache Google + todos + note thành `RenderData`.
  - `render/layout/*`: từ `RenderData + DesignConfig + DeviceSpec` sinh danh sách lệnh vẽ `DrawOp[]` (tọa độ pixel, đã nằm trong vùng an toàn) — thuần, test được không cần canvas. `paint.ts` chỉ dịch `DrawOp` sang Canvas 2D. `wallpaper.ts` điều phối và trả `Blob` PNG.
  - `storage/*`: đọc/ghi IndexedDB; sao lưu JSON `{version:1, state}` (Blob ảnh nền không nằm trong JSON).
  - `google/oauth.ts`: URL ủy quyền, parse `#fragment`, kiểm `state`, lưu `{accessToken, expiresAt}` vào localStorage, `getToken()` trả null nếu hết hạn. `google/calendar.ts`: gọi REST bằng `fetch` + Bearer, phân trang ≤ 2 trang/lịch, chuẩn hóa về `Occurrence` theo giờ địa phương, bỏ sự kiện `cancelled`; 401 → ném `AuthError`.
  - `export/share.ts`: `savePng` (share → download), `copyPng` (ClipboardItem), `openShortcut(name, text?)` (gán `location.href`; `?test=1` → ghi `window.__lastNav`), `shortcutUrl` thuần (không `text` → `&input=clipboard` như cũ; có `text` → `&input=text&text=<encodeURIComponent>`). `export/ics.ts`: VEVENT có RRULE, CRLF. `export/reminder.ts` (v1.8, thuần, Vitest): thời điểm mặc định, cửa sổ 24 h, payload cho Phím tắt — UI chỉ ghép: `ReminderDialog` → hàm lưu của form → `openShortcut(tên, reminderText(...))`.
  - `ui/*`: Preact; mọi thay đổi trạng thái qua reducer trong `store.ts`; màn Preview render lại khi state đổi (debounce 150 ms).
- Luồng dữ liệu:
  - UI → `dispatch(action)` → `AppState` (bộ nhớ) → `db.ts` (persist) → `collectRenderData` → `layout*` → `DrawOp[]` → `paint` → canvas → PNG Blob → `<img>` preview / `savePng` / `copyPng` → Shortcut.
  - Google: Sync → `buildAuthUrl` → `location.href = url` → Google → quay về `/#access_token=…&state=…` → `parseFragment` (kiểm state, xóa hash bằng `history.replaceState`) → token store → `fetchCalendars` / `fetchEvents` → `state.google.cache = {events, fetchedAt}` → persist → render.
  - Ảnh nền: `<input type=file accept=image/*>` → `createImageBitmap(file, {imageOrientation:'from-image'})` (fallback decode qua `<img>`) → thu nhỏ về ≤ 2× kích thước thiết bị (PNG nếu nguồn png/webp/gif, còn lại JPEG 0.9 — T-4.7) → lưu IndexedDB (`bg`, dạng `{buf: ArrayBuffer, type}` — D-017; `saveBg`/`loadBg` vẫn nhận/trả `Blob`) → `ImageBitmap.close()` sau khi vẽ → dùng khi render.
- Giao diện giữa các module (chữ ký TypeScript, là hợp đồng — thợ không đổi nếu không PHẢN BIỆN):
```ts
// core/model.ts
type ISODate = string;                       // 'YYYY-MM-DD' theo giờ địa phương
type Repeat = 'none'|'daily'|'weekdays' /* v1.3: T2–T6 */|'weekly'|'monthly'|'yearly';
interface LocalEvent { id: string; title: string; date: ISODate; time?: string /*'HH:mm'*/; durationMin?: number; repeat: Repeat; until?: ISODate; color?: string;
  alarmMin?: number /* v1.3: phút nhắc trước, 0/thiếu = không nhắc → VALARM trong .ics */;
  createdAt?: number /* v1.6 D-026: ms, đặt khi addEvent, giữ nguyên khi updateEvent; event cũ không có */ }
interface Todo { id: string; text: string; done: boolean; order: number; due?: ISODate /* v1.3 */; archived?: boolean /* v1.7 D-028: ẩn khỏi danh sách chính + RenderData */ }
interface Note { id: string; title: string; body: string; pinned: boolean; updated: number }   // v1.3 — tối đa 1 note pinned
interface Occurrence { id: string; sourceId: string; source: 'local'|'google'; title: string; date: ISODate; time?: string; allDay: boolean; color?: string;
  endTime?: string /* v1.5 D-024: 'HH:mm' giờ kết thúc, chỉ khi có `time`, kết thúc cùng ngày và sau `time`; local = time + durationMin, Google = end.dateTime */;
  createdAt?: number /* v1.6 D-026: ms; local = LocalEvent.createdAt, Google = Date.parse(created) */ }
interface DeviceSpec { id: string; label: string; width: number; height: number; safeTop: number; safeBottom: number } // safe* là tỉ lệ 0..1 của height
interface DesignConfig { layout: 'month'|'agenda'|'todo'|'week' /* v1.5 */; showNote: boolean /* hiện ghi chú ghim */; showLunar: boolean /* v1.1 */;   // v1.3: bỏ noteText → AppState.notes
  monthList: boolean /* v1.4 D-018: danh sách dưới lưới Tháng; normalizeState bù true */;
  bg: { kind: 'photo'|'solid'|'gradient'; color: string; color2?: string }; blur: 0|1|2|3; dim: number;
  textColor: string; accentColor: string; font: 'sans'|'serif'|'mono'; position: 'top'|'middle'|'bottom';
  scale: number; boxAlpha: number; agendaDays: number; weekStart: 0|1; hour12: boolean; lang: 'vi'|'en' }
interface AppState { version: 1; events: LocalEvent[]; todos: Todo[]; notes: Note[] /* v1.3 */; design: DesignConfig; device: DeviceSpec;
  google: { clientId: string; calendarIds: string[]; cache: { events: Occurrence[]; fetchedAt: number } | null }; shortcutName: string;
  alarmShortcutName: string /* v1.8 D-031: mặc định 'ThemBaoThuc' */; reminderShortcutName: string /* v1.8: mặc định 'ThemLoiNhac' */ }
// v1.3: vẫn version 1 — normalizeState bù notes: [] và chuyển design.noteText (nếu có, khác rỗng) thành 1 Note pinned.
// v1.8: vẫn version 1 — normalizeState bù alarmShortcutName / reminderShortcutName (thiếu hoặc không phải chuỗi → mặc định). Store: action setAlarmShortcutName / setReminderShortcutName như setShortcutName.
interface RenderData { today: ISODate; occurrences: Occurrence[]; todos: Todo[] /* đã sắp: chưa xong có hạn ↑, chưa xong không hạn theo order, rồi đã xong */;
  note: string /* body ghi chú ghim, '' nếu không có */; noteTitle?: string /* v1.3 */ }
// core
expandOccurrences(events: LocalEvent[], from: ISODate, to: ISODate): Occurrence[]
monthGrid(year: number, month0: number, weekStart: 0|1): (ISODate|null)[][]          // luôn 6 hàng × 7 cột
groupAgenda(occ: Occurrence[], from: ISODate, days: number): { date: ISODate; items: Occurrence[] }[]
collectRenderData(state: AppState, today: ISODate): RenderData
cmpTodo(a: Todo, b: Todo): number        // core/collect.ts — thứ tự to-do duy nhất, dùng chung: hình nền, danh sách trong app, moveTodo
solarToLunar(iso: ISODate): { day: number; month: number; year: number; leap: boolean }   // v1.1, core/lunar.ts, múi giờ +7
lunarYearName(year: number): string                                                   // "Bính Ngọ"
t(key: string, lang: 'vi'|'en', vars?: Record<string,string|number>): string
// render
type DrawOp = { op:'rect'; x:number; y:number; w:number; h:number; r?:number; fill:string; alpha?:number }
            | { op:'text'; x:number; y:number; text:string; size:number; weight:400|600|700; color:string; align:'left'|'center'|'right'; font:'sans'|'serif'|'mono' }
            | { op:'dot'; x:number; y:number; r:number; fill:string }
layoutMonth(d: RenderData, c: DesignConfig, dev: DeviceSpec): DrawOp[]   // layoutAgenda, layoutTodo, layoutWeek (v1.5, render/layout/week.ts), layoutNote cùng chữ ký
paint(ctx: CanvasRenderingContext2D, ops: DrawOp[]): void
buildOps(state: AppState, today: ISODate): DrawOp[]                           // thuần: collect → layout theo design.layout + layoutNote; test/E2E dùng
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
savePng(blob: Blob, filename: string): Promise<'shared'|'downloaded'>; copyPng(blob: Blob): Promise<boolean>
shortcutUrl(name: string, text?: string): string   // v1.8: 'shortcuts://run-shortcut?name=<enc>&input=clipboard' | '…&input=text&text=<enc>'
openShortcut(name: string, text?: string): void      // v1.8: thêm tham số tùy chọn; gọi cũ openShortcut(name) giữ nguyên hành vi
eventToIcs(e: LocalEvent, now?: Date): string   // `now` chỉ để DTSTAMP xác định trong test
// export/reminder.ts (v1.8, thuần; mọi hàm nhận `now` — không đọc Date.now())
type LocalDateTime = string;   // 'YYYY-MM-DDTHH:mm' giờ địa phương — đúng giá trị của <input type="datetime-local">
type ReminderSource = { kind: 'event'; date: ISODate; time?: string; repeat: Repeat; until?: ISODate }
                    | { kind: 'todo'; due?: ISODate } | { kind: 'note' }
defaultReminderAt(src: ReminderSource, now: Date): LocalDateTime   // event: lần xảy ra kế tiếp > now qua expandOccurrences(today … today+400 ngày), cả ngày → 08:00, không có → date+time nhập; todo: due 08:00 | giờ tròn kế tiếp; note: giờ tròn kế tiếp
reminderWindow(at: LocalDateTime, now: Date): 'past'|'alarm-ok'|'reminder-only'   // at ≤ now → past; at − now ≤ 24 h → alarm-ok; còn lại reminder-only
reminderText(at: LocalDateTime, title: string, note?: string): string   // 'YYYY-MM-DD HH:mm\n<title ≤100>' + (note ? '\n<note ≤200>' : ''); title/note không chứa '\n'; title rỗng → 'LichKhoa'
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
  - [ ] (v1.4, D-018) Unit `layout-month-list.test.ts`: 20 sự kiện + 10 to-do → số dòng danh sách ≤ trần L, có "+N sự kiện" và "+N việc", (đã hiện + N) = tổng; to-do đã xong không hiện; mọi op trong `mainArea` với 1284×2778 và 1179×2556 × `showNote` × `showLunar` × `position`; `monthList=false` → op lưới không đổi. `model.test.ts`: state thiếu `monthList` → `true`. E2E `events.spec.ts`: state có `google.cache` → ô ngày có chấm, mục `ev-item-google` hiện tiêu đề + "Google", bấm không mở sheet; mục cục bộ vẫn mở sheet.
  - [ ] (D-020) Unit `store.test.ts`: `pinNote(id, true)` khi `showNote=false` → `showNote=true`; bỏ ghim không đổi `showNote`. E2E `notes.spec.ts`: ghim ghi chú → công tắc `note-show` bật và `__lastOps` chứa tiêu đề ghi chú.
  - [ ] Thử tay trên iPhone của Chủ dự án theo HUONG-DAN.md; kết quả ghi vào `docs/bao-cao/M4.md` (không chặn nghiệm thu bằng lệnh, nhưng là điều kiện để đóng dự án).

### M5 — Bố cục Tuần giống app Inks (v1.5, D-024; thêm sau nghiệm thu cuối)
Nội dung: `Occurrence.endTime` (local + Google), expand/đồng bộ đủ cả tuần chứa hôm nay, `layoutWeek` theo mẫu `docs/tham-khao/inks-tuan.PNG`, chọn bố cục "Tuần" trong app, ảnh mẫu 1284×2778 cho Chủ dự án xem.
- Tiêu chí nghiệm thu:
  - [ ] Unit: `endTime` đúng cho local (`durationMin`, qua nửa đêm → không có) và Google (`end.dateTime` cùng ngày); `collectRenderData` có sự kiện của ngày đầu tuần kể cả khi tuần bắt đầu ở tháng trước; `syncRange` = [today − 7, today + 60].
  - [ ] Unit `layout-week.test.ts`: 7 cột đúng thứ tự theo `weekStart` 0/1; ngày có 6 mục → 3 chip + "+6−3"; ngày 4 mục → 4 chip; to-do quá hạn nằm ở cột hôm nay, không hạn không có; danh sách hôm nay đủ mục hoặc có "+N"; `showLunar` true/false; mọi op trong `mainArea` với 1284×2778 và 1179×2556 × 3 `position` × `showNote`; bbox khối Tuần không giao dải ghi chú.
  - [ ] E2E luồng chính **T-5.END** (chromium + webkit): tạo sự kiện có giờ + to-do có hạn → chọn bố cục Tuần → preview 1284×2778 và `__lastOps` có chip của sự kiện dưới đúng cột, chip to-do, dòng danh sách hôm nay; reload vẫn giữ bố cục Tuần.
  - [ ] `npm run check` pass; ảnh mẫu Tuần 1284×2778 được Chủ dự án xem và chấp nhận (thử tay, không chặn nghiệm thu bằng lệnh).

### M6 — Cử chỉ danh sách Việc cần làm (v1.7, D-028)
Nội dung: `Todo.archived`; action `archiveTodo`, `restoreTodo`, `reorderTodo`; `collectRenderData` bỏ việc đã lưu trữ; tab Sự kiện › Việc: vuốt trái (Lưu trữ / Xóa + Hoàn tác), phần "Đã lưu trữ" (Khôi phục / Xóa), nhấn giữ kéo sắp xếp.
- Tiêu chí nghiệm thu:
  - [ ] Unit: reducer lưu trữ/khôi phục/khôi phục sau xóa/sắp xếp (trong nhóm; khác nhóm → không đổi); `moveTodo` bỏ qua việc đã lưu trữ; `collectRenderData` không có việc đã lưu trữ.
  - [ ] E2E luồng chính **T-6.END** (chromium + webkit): thêm 3 việc → vuốt trái Xóa → Hoàn tác thì việc trở lại; Lưu trữ → việc biến mất khỏi danh sách và `__lastOps` (bố cục Việc), hiện trong "Đã lưu trữ" → Khôi phục; nhấn giữ kéo việc thứ 3 lên đầu → thứ tự mới trong danh sách và trên hình nền; reload vẫn giữ.
  - [ ] `npm run check` pass; Chủ dự án thử vuốt/kéo trên iPhone (thử tay, không chặn nghiệm thu bằng lệnh).

### M7 — Nhắc trên iPhone qua Phím tắt: Báo thức (Đồng hồ) + Lời nhắc (Reminders) (v1.8, D-031)
Nội dung: `export/reminder.ts` + `shortcutUrl`/`openShortcut(name, text?)`; `AppState.alarmShortcutName`/`reminderShortcutName` + `normalizeState` + 2 action store + 2 ô nhập ở tab Xem trước; `ReminderDialog` gắn vào 3 form (sự kiện, việc, ghi chú) theo IN-11; i18n VI/EN; HUONG-DAN §E + thẻ Hướng dẫn 7; E2E kiểm URL sinh ra (máy dev không mở được `shortcuts://`).
- Tiêu chí nghiệm thu (kiểm được bằng lệnh):
  - [ ] Unit `reminder.test.ts` (pass cả 2 TZ): `reminderText('2026-09-20T07:30','Họp nhóm')` = `'2026-09-20 07:30\nHọp nhóm'`; ghi chú 2 dòng → đúng 3 dòng, dòng 2–3 không chứa `\n`; tiêu đề rỗng → `LichKhoa`; cắt 100/200 ký tự. `defaultReminderAt`: sự kiện lặp tuần bắt đầu 60 ngày trước có giờ → lần kế tiếp > now (đúng thứ); cả ngày → `T08:00`; `until` đã qua → ngày + giờ nhập; việc có hạn → `<due>T08:00`; việc không hạn / ghi chú: now 09:10 → `T10:00`, now 09:00 → `T10:00`, 23:10 → `00:00` hôm sau. `reminderWindow`: at = now → `past`; now + 1 phút → `alarm-ok`; now + 24 h → `alarm-ok`; now + 24 h 1 phút → `reminder-only`.
  - [ ] Unit `share-url.test.ts`: `shortcutUrl('ThemBaoThuc','2026-09-20 07:30\nHọp')` = `shortcuts://run-shortcut?name=ThemBaoThuc&input=text&text=2026-09-20%2007%3A30%0AH%E1%BB%8Dp`; không `text` → `…&input=clipboard` (không đổi). `model.test.ts`: state thiếu 2 tên → `ThemBaoThuc`/`ThemLoiNhac`; `backup.test.ts`: xuất → nhập giữ tên đã đổi; `store.test.ts`: 2 action đặt tên; `i18n.test.ts` vẫn pass (khóa mới có cả VI/EN).
  - [ ] E2E `m7-reminder.spec.ts` — **T-7.END** (chromium + webkit, `?test=1`, đọc `window.__lastNav`, giải mã `text=` để so payload; thời điểm tính từ `new Date()` trong test): (1) thêm sự kiện có giờ (ngày mai 07:30) → mở sửa → `rem-open` → `rem-at` = `<ngày mai>T07:30` → `rem-reminder` → `__lastNav` có `name=ThemLoiNhac&input=text&text=` và payload = `'<ngày mai> 07:30\n<tên>'`; Sheet đóng; danh sách vẫn đúng 1 sự kiện. (2) mở lại → `rem-none` → hộp đóng, `__lastNav` không đổi. (3) nhập việc "Mua sữa" (chưa bấm Thêm) → `rem-open` → đặt `rem-at` = now + 2 h → `rem-alarm` → việc xuất hiện trong danh sách, ô nhập rỗng, `__lastNav` có `name=ThemBaoThuc`, payload dòng 2 = `Mua sữa`. (4) `rem-at` = now + 3 ngày → `rem-alarm` disabled, `rem-reminder` enabled; `rem-at` = now − 1 h → cả hai disabled. (5) ghi chú mới tiêu đề + nội dung 2 dòng → `rem-reminder` → payload 3 dòng, ghi chú đã lưu. (6) tab Xem trước đổi `shortcut-alarm-name` = `Bao Thuc` → reload giữ → `__lastNav` chứa `name=Bao%20Thuc`.
  - [ ] Tài liệu: `docs/HUONG-DAN.md` có mục `## E.` với cả hai chuỗi `ThemBaoThuc` và `ThemLoiNhac`, các hành động "Create Alarm", "Add New Reminder", "Split Text", "Get Dates from Input", và bước bật "Nhạy cảm thời gian" (`Select-String -Path docs/HUONG-DAN.md -Pattern 'ThemBaoThuc|ThemLoiNhac|Create Alarm|Add New Reminder|Split Text'` ≥ 5 dòng); `vi.json`/`en.json` có `guide.reminderTitle`/`guide.reminderBody`.
  - [ ] `npm run check` pass; test khóa M1–M6 không sửa/skip (ngoại lệ phải khai báo: fixture/`defaultState` thêm 2 tên).
- Thử tay trên iPhone (Chủ dự án, ghi `docs/bao-cao/M7.md`; điều kiện đóng M7, không chặn nghiệm thu bằng lệnh): cài 2 Phím tắt theo §E; (A) sự kiện có giờ trong 24 h → "Thêm báo thức" → app Đồng hồ có báo thức đúng giờ, nhãn = tên sự kiện, kêu đúng lúc; (B) việc hạn 3 ngày → "Thêm lời nhắc" → Reminders có lời nhắc đúng ngày giờ, tên = nội dung việc; (C) ghi chú → lời nhắc có phần Notes; (D) "Không báo thức" không mở Phím tắt; (E) bật Nhạy cảm thời gian cho Reminders → lời nhắc vẫn kêu khi đang bật Tập trung; (F) nếu Phím tắt không đọc được dòng 1 (ngôn ngữ máy) hoặc không tách được dòng → ghi rõ để sửa `reminderText` (S3, một hàm + một test).

## 7. Chiến lược test
- Lệnh chạy test tổng: `npm run check` (PowerShell, tại `E:\DuAn\thu-nghiem`) = `tsc --noEmit && vitest run && playwright test`.
- Chuẩn bị một lần: `npm install`; `npx playwright install chromium webkit` (~400 MB).
- Unit (Vitest, môi trường node): chỉ hàm thuần; fixture trong `tests/fixtures`; không mock `Date` toàn cục — mọi hàm nhận `today`/`from` làm tham số; script `test` chạy Vitest hai lần với `TZ=Asia/Ho_Chi_Minh` và `TZ=UTC` (dùng `cross-env` hoặc `process.env.TZ` trong `vitest.config.ts`).
- E2E (Playwright): projects `chromium` (viewport 428×926) và `webkit` (`devices['iPhone 13 Pro Max']`, viewport 428×926 — v1.2), `webServer: npm run preview` (chạy trên bản build để service worker hoạt động), `page.route` cho Google, `?test=1` bật hook `window.__lastOps` và stub điều hướng `shortcuts://`.
- Không test pixel-snapshot (font khác giữa máy); so sánh cấu trúc `DrawOp` và "hash PNG thay đổi" thay vì "bằng ảnh mẫu".
- (v1.8) Deep link `shortcuts://` không mở được trên Windows/Playwright → mọi tiêu chí về Phím tắt kiểm URL trong `window.__lastNav` (stub của `openShortcut` khi `?test=1`), giải mã tham số `text=` để so payload; việc iOS có tạo báo thức/lời nhắc thật hay không chỉ kiểm bằng thử tay.
- Test của phiếu DONE là khóa (CLAUDE.md); mỗi milestone có đúng một E2E luồng chính `T-n.END`.

## 8. Rủi ro & cách giảm
1. OAuth redirect trong PWA standalone iOS (sửa D-015): iOS ≥ 12.2 mở URL ngoài scope trong trình duyệt trong-app và trả điều hướng về PWA khi URL quay lại nằm trong `scope` (manifest `scope`/`start_url` = `base`; `redirect_uri = origin + pathname`). Không kiểm được bằng Playwright → thử máy thật sớm (T-4.0). Token implicit sống 1 giờ và KHÔNG gia hạn ngầm được trên iOS (Safari chặn cookie bên thứ ba → iframe `prompt=none` luôn `login_required`) → hằng ngày người dùng bấm "Kết nối lại" (Google tự chuyển hướng nếu phiên trong-app còn); cache sự kiện dùng offline. Nếu standalone không nhận token: dùng app trong Safari (bookmark) — storage Safari và PWA tách biệt, phải chọn một ngữ cảnh dùng xuyên suốt.
2. Clipboard ảnh / Web Share files / `shortcuts://` khác nhau giữa trình duyệt → chuỗi fallback: share → tải; copy thất bại → hướng dẫn "Lưu ảnh" + Shortcut dùng "Get Latest Photos".
3. Shortcut "Set Wallpaper" yêu cầu iOS 17+ và hình nền hiện tại ở chế độ Ảnh (không Photo Shuffle) → nêu trong Guide. Không thể tự đổi hằng ngày không chạm → giới hạn đã biết. Lỗi iOS đã biết (D-018, máy thật 2026-09-14): thỉnh thoảng báo `com.apple.extensionKit.errorDomain error 2` → bấm "Đặt hình nền" lại là được; không sửa được bằng mã, Guide + HUONG-DAN hướng dẫn.
4. Safari xóa IndexedDB sau 7 ngày không dùng với web thường; PWA cài Màn hình chính không bị → khuyến nghị cài + sao lưu JSON.
5. Vitest 5 (mới 10 ngày) / vite-plugin-pwa 1.3 với Vite 8 có thể lệch → nếu lỗi: ghim Vitest 4.x hoặc SW viết tay; ghi DECISIONS.md, không đổi SPEC.
6. `ctx.filter` blur không đồng nhất trên Safari → blur bằng hạ/tăng mẫu canvas.
7. Google ở trạng thái Testing: màn "ứng dụng chưa xác minh", tối đa 100 test user → chấp nhận (dùng cá nhân).
8. iPhone đời mới không có preset → tự phát hiện `screen × DPR` là mặc định; tùy chỉnh tay khi cần.
9. Ảnh lớn gây tràn bộ nhớ canvas trên iOS → thu nhỏ ảnh về ≤ 2× kích thước thiết bị trước khi lưu.
10. (v1.8) Nhắc qua Phím tắt — giới hạn đã biết: (a) báo thức Đồng hồ chỉ có giờ, kêu vào lần tới trong 24 h → app chặn "Thêm báo thức" ngoài cửa sổ 24 h, việc xa hơn phải dùng Lời nhắc hoặc quay lại bấm sau; (b) app không theo dõi báo thức/lời nhắc đã tạo → bấm 2 lần = 2 mục, báo thức một lần sau khi kêu vẫn nằm (tắt) trong danh sách Đồng hồ, dọn tay; (c) tên Phím tắt sai → iOS báo "không tìm thấy", app không biết; (d) Phím tắt tách dòng 1 bằng data detector ("Get Dates from Input") → nếu máy thật không nhận dạng `YYYY-MM-DD HH:mm` thì đổi định dạng trong `reminderText` (1 hàm, 1 test); nếu Shortcuts không giải mã `%0A` thành xuống dòng thì đổi phân cách sang ` | ` (1 hằng + hướng dẫn "Split Text" Custom) — cả hai chỉ phát hiện được ở thử tay (F); (e) rời app sang Phím tắt có thể làm iOS đóng PWA → form được lưu trước khi điều hướng, `flushPersist` (B-006) ghi ngay khi app ẩn; (f) không tự quay về LichKhoa sau khi Phím tắt chạy (như "Đặt hình nền"); (g) "Nhạy cảm thời gian" là cài đặt hệ thống (Cài đặt → Thông báo → Lời nhắc) — hướng dẫn bật, không đặt được từ app.

## 9. Giả định (Kiến trúc sư tự quyết; Chủ dự án có thể bác)
- Tên làm việc "LichKhoa"; icon tự vẽ đơn giản; Chủ dự án có thể đổi tên sau.
- iPhone chạy iOS 17+; hình nền hiện tại ở chế độ Ảnh.
- Google scope chỉ `https://www.googleapis.com/auth/calendar.readonly`; Client ID dán trong UI, lưu localStorage, không commit vào repo.
- Hosting HTTPS (thực tế từ 2026-09-14, D-019): repo public `github.com/thaihuy1012/LichKhoa`, GitHub Pages `https://thaihuy1012.github.io/LichKhoa/`; workflow `.github/workflows/pages.yml` build `VITE_BASE=/LichKhoa/` khi push `main` (Vite `base` đọc `VITE_BASE`, mặc định `/`; manifest `scope`/`start_url` theo base). Netlify Drop dự phòng; cloudflared quick tunnel cho thử nhanh. `git push` do Chủ dự án tự chạy (`.claude/settings.json` chặn Quản lý push) — mỗi lần deploy = 1 lệnh push của Chủ dự án. Client ID Google đăng ký origin `https://thaihuy1012.github.io` và redirect `https://thaihuy1012.github.io/LichKhoa/`.
- Mặc định: ngôn ngữ VI, tuần bắt đầu T2, 24h, bố cục Tháng, agenda 7 ngày (tối đa 12 **dòng sự kiện**, tiêu đề ngày không tính — D-012, làm ở T-2.15; không để tiêu đề ngày mồ côi; vượt thì "+N"; hộp tự co nếu tràn vùng an toàn), to-do tối đa 12 dòng, vùng an toàn `safeTop=0.30`, `safeBottom=0.14`, tên Shortcut `DatHinhNen`. Mật độ chữ trên ảnh nền thật xem lại ở M4 (T-4.2) cùng mặc định `boxAlpha`.
- Khoảng đồng bộ Google cố định [hôm nay − 7, + 60 ngày] (v1.5; trước là − 1); sự kiện Google không chỉnh sửa được trong app.
- (v1.8) Nhắc qua Phím tắt: một nút "Nhắc trên iPhone" mỗi form mở hộp thoại có cả hai hành động (thay vì hai nút trên form — hàng nhập việc không đủ chỗ, và người dùng chọn cơ chế sau khi thấy thời điểm); giờ mặc định 08:00 cho việc có hạn và sự kiện cả ngày; giờ tròn kế tiếp cho việc không hạn và ghi chú; cửa sổ báo thức 24 h; tên Phím tắt mặc định `ThemBaoThuc`, `ThemLoiNhac` (không dấu, như `DatHinhNen`); danh sách Reminders đích do Chủ dự án chọn khi tạo Phím tắt; nhãn ≤ 100, ghi chú ≤ 200 ký tự; Snooze để mặc định của Phím tắt.
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
D. (v1.8) Tạo 2 Phím tắt nhắc (1 lần; chi tiết từng bước ở `docs/HUONG-DAN.md` §E, viết ở T-7.4). Cả hai nhận đầu vào văn bản (Details → Receive **Text** input), đầu tiên là "Split Text" (Shortcut Input, **New Lines**) rồi "Get Item from List" mục 1 → "Get Dates from Input" (→ biến Ngày giờ), mục 2 (→ biến Tên), mục 3 (→ biến Ghi chú, có thể trống).
   - `ThemBaoThuc`: "Create Alarm" (app Đồng hồ, iOS 17+): Time = biến Ngày giờ (chỉ dùng phần giờ), Label = biến Tên, Repeat = Never; tùy chọn "Show Notification" xác nhận.
   - `ThemLoiNhac`: "Add New Reminder": Reminder = biến Tên, List = danh sách tự chọn, Alert = Custom → biến Ngày giờ, Notes = biến Ghi chú.
   - Cài đặt → Thông báo → Lời nhắc: bật **Nhạy cảm thời gian** (và cho phép trong Tập trung) để lời nhắc vượt Tóm tắt thông báo/Tập trung. Đổi tên Phím tắt trong app ở tab Xem trước nếu muốn tên khác.
   - Dùng: trong form sự kiện / việc / ghi chú → "Nhắc trên iPhone" → chỉnh thời điểm → "Thêm báo thức" (trong 24 h) hoặc "Thêm lời nhắc" → iOS mở Phím tắt; lần đầu iOS hỏi quyền cho Phím tắt; xong quay lại app bằng tay.
