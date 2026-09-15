# TASKS — bảng giao việc
(Quản lý duy trì. Trạng thái: TODO | DOING | REVIEW | DONE | BLOCKED. Ghi ngay sau mỗi bước.)
Nguồn sự thật: `docs/SPEC.md` (v1.5 — D-024 bố cục Tuần; v1.4 — D-018/D-020, Kiến trúc sư soát D-021; v1.0 Chủ dự án duyệt 2026-09-13; v1.1 Âm lịch D-006; v1.2 iPhone 13 Pro Max D-007; v1.3 T2–T6/nhắc trước/hạn to-do/nhiều ghi chú D-011). Hợp đồng TypeScript ở SPEC mục 5 — không đổi nếu không PHẢN BIỆN.
Lệnh test tổng: `npm run check` (tại `E:\DuAn\thu-nghiem`, PowerShell).

## Tiến độ
- M1: 8/8 ✔ tag `M1-ok` · M2: 15/15 ✔ tag `M2-ok` (D-012) + nối tiếp T-2.15, T-2.16 ✔ · M3: 5/5 ✔ tag `M3-ok` (D-015) · M4: 12/12 ✔ tag `M4-ok` (D-021 — DUYỆT M4 + nghiệm thu cuối, gộp)
- **M5 (SPEC v1.5, D-024) — Bố cục Tuần giống Inks: 4/4 ✔ tag `M5-ok`** (D-025 — Kiến trúc sư DUYỆT sau soát chéo Gemini). Deploy OK: Chủ dự án `git push` (6fec4b5..a173446) → Actions run 34919243300 success, trang 200, JS có `layout-week`. Tag `M5-ok` đã lên GitHub. Chờ Chủ dự án xem trên iPhone 2 ý: (1) chữ chip (~7–8 pt) đọc được không; (2) biểu tượng ◷ có hiện không. Sau đó → phiếu T-5.4 (tồn đọng D-025) nếu cần. Thứ tự 5.1 → 5.2 → 5.3 → 5.END → ảnh mẫu cho Chủ dự án → soát chéo Gemini `M5-soat` → Kiến trúc sư duyệt M5 → tag `M5-ok`. Xem mục "M5" cuối file. Làn Gemini: BẬT mức NHIỀU ở checkout chính (không chạy trong worktree — BAI-HOC); T-5.3 đủ điều kiện → tho-gemini.
- 2026-09-15: ĐỢT BẢO TRÌ D-023 XONG (B-001, B-002) — Quản lý phiên chính dọn rác Gemini ở checkout chính, `merge --ff-only` nhánh worktree → `main` 6fec4b5, `npm run check` pass (211×2 unit, 64 e2e, 6 skip có từ trước). Chủ dự án `git push` (e954b16..6fec4b5) → Actions run 34911429434 success, trang 200, CSS `.color-input` mới đã lên. Chờ Chủ dự án xem ô màu trên iPhone. Dự án trở lại trạng thái ĐÓNG (D-022).
- Trước đó (2026-09-15): ĐỢT BẢO TRÌ D-023 — B-001 (Gemini) → B-002 (sonnet). Xem mục "Bảo trì 2026-09-15" cuối file.
- 2026-09-15 phiên 2 (nền): làm trong worktree `.claude/worktrees/bao-tri-D-023`, nhánh `worktree-bao-tri-D-023` (từ `main` fd17357) — commit ở nhánh này, Chủ dự án gộp về `main` (`git merge --ff-only worktree-bao-tri-D-023`). Lượt Gemini `B-001` vòng 1 phiên trước chết khi dừng phiên (`DONE 255`, đầu ra rỗng, không đổi `src/`) → `huy B-001`, giao lại vòng 1 (không tính Lần thử, không tính lỗi làn). Lưu ý: `agy-run.sh huy` hoàn tác MỌI thay đổi chưa commit, kể cả sổ sách → commit sổ trước khi giao Gemini.
- 2026-09-15 phiên 2: B-001 ✔ DONE. Làn Gemini TẮT tới hết phiên này (agy ghi ra ngoài worktree — BAI-HOC 2026-09-15); phiên sau chạy ở checkout chính thì bật lại được. B-002 ✔ DONE. ĐỢT BẢO TRÌ D-023 XONG (2/2) — chờ Chủ dự án: gộp nhánh về `main`, xem ô màu trên iPhone sau deploy (`git push`).
- Trước đó: DỰ ÁN ĐÃ ĐÓNG 2026-09-14 (D-021 nghiệm thu, D-022 Chủ dự án chọn đóng; giữ "Chủ dự án tự `git push`"). Mở lại khi Chủ dự án yêu cầu: đọc SU-CO → TASKS (Tồn đọng S4) → DECISIONS D-021/D-022. Thử máy thật lần 3: T-4.10 ✔ "Ghi chú hiện đúng" → mọi hạng mục thử tay M4 đạt. Deploy lần đầu OK 2026-09-14: Chủ dự án `git push -u origin main` (3396ec7..fcf6bdc, không force) → Actions run 34867029741 build + deploy success → `https://thaihuy1012.github.io/LichKhoa/` 200, manifest scope `/LichKhoa/`. Nhánh `main` theo dõi `origin/main`; Quản lý không push được (`.claude/settings.json` deny) → mỗi lần cần deploy, Chủ dự án chạy `! git push`. Sau đó → Kiến trúc sư duyệt M4 → nghiệm thu cuối.
- Công cụ review bằng mắt: `scripts/mau-anh.cjs`, `scripts/chup.cjs`, `scripts/cat-anh.cjs` (xem `scripts/README-cong-cu.md`; cần `npm run build` trước).
- SPEC v1.3 (D-011): lặp T2–T6, nhắc trước qua .ics, hạn to-do, nhiều ghi chú → phiếu T-2.10/2.11/2.12.
- Nhắc Chủ dự án: tham khảo `F:\LICH_NEN` cho mọi phiếu còn lại — bảng đối chiếu UI ở `docs/tham-khao-LICH_NEN.md` §6.
- Chờ Chủ dự án: đặt thử ảnh mẫu 1284×2778 (đã gửi 2026-09-13) — có đè đồng hồ/widget/nút không? (không chặn; cần trước T-2.3)
- Chuyển phiên: T-2.8 đã commit — điểm dừng sạch. Phiên mới (`claude --agent quan-ly`): đọc SU-CO → TASKS, giao T-2.6 (nhớ tiêu chí Quản lý dựng ảnh mẫu 3 bố cục xem bằng mắt). Ảnh mẫu mới nhất đã gửi Chủ dự án: có âm lịch (lichkhoa-amlich-r1.png).
- Sự cố mở: (không — SC-001 đã đóng 2026-09-13)
- Làn Gemini: BẬT (D-009) — Pro `gemini-3.1-pro-high`, Flash `gemini-3.8-flash-high`. Dùng đầu tiên: soát chéo cuối M2.
- 2026-09-15: Chủ dự án bật làn Gemini **v2 mức NHIỀU** (kit v2.1, `tho-gemini`). `agy-run.sh kiem-tra` → SẴN SÀNG (agy 1.2.2; code `gemini-3.8-flash-high`, soat/doc `gemini-3.1-pro-high`, sinh `gemini-3.8-flash-low`). Dự án vẫn ĐÓNG (D-022) → hỏi Chủ dự án việc tiếp theo.

## Tồn đọng (S4 — không chặn)
- ~~S4 · T-1.2 · mặc định `boxAlpha=1` che ảnh nền~~ → đã sửa T-4.2 (0.35 khi chọn ảnh; D-021 xác nhận).
- ~~S4 · T-1.7 · normalizeState device thiếu safe*~~ → đã sửa T-2.14.
- ~~S4 · T-2.7 · `EventsTab.tsx` L93 durationMin ngầm 60~~ → đã sửa trong T-2.12.
- ~~S4 · T-2.12 · ô todo-due trống không nhãn~~ → đã sửa T-2.14.
- ~~S4 · T-2.14 · `App.tsx` "Đang tải…" cứng tiếng Việt~~ → đã sửa (`App.tsx:90` dùng i18n; D-021 xác nhận).
- ~~S4 · soát chéo M4 #5 · nhập JSON giữ ảnh nền cũ của máy~~ → Chủ dự án chọn giữ như hiện tại (2026-09-15, D-023) → đóng, không sửa.
- ~~S4 · T-4.6 · webkit Windows: `input[type=color]` hiện chữ "#00000(" cạnh span hex → mã màu hiện 2 lần~~ → đã sửa B-002 (2026-09-15).
- ~~S4 · D-015 · sau redirect kết nối thành công~~ → đã sửa T-4.2.
- ~~S4 · T-3.3 · nút `sync-connect` / `sync-now` kiểu nút phụ~~ → đã sửa T-4.2 (accent; D-021 xác nhận).
- ~~S4 · T-4.8 · nhãn ngày lặp / cột tiêu đề lệch / số âm lịch nhỏ~~ → Chủ dự án thử máy thật 2026-09-14: "dễ đọc, chữ và số âm lịch đã ổn" → đóng, không sửa.
- S4 · M5 (D-025) → phiếu T-5.4 sau khi Chủ dự án xem máy thật: (a) hour12 "11:00 - 1:00 PM" bỏ AM giờ đầu khi khác buổi; (b) `CHAR_W` 0.55 theo font (mono ≈ 0.6 có thể tràn chip); (c) `todoDueText` `week.ts:411` trùng `todoDueLabel`; (d) `layout-week.test.ts:117–124,142–147` chép hằng lề/cột; (e) cache Google cũ (timeMin −1) thiếu ngày đầu tuần tới lần đồng bộ kế; (f) nếu iOS không vẽ "◷" → bỏ `week.ts:388`.
- S4 · T-3.1 · `parseFragment` giải mã `error` 2 lần (`URLSearchParams` đã giải mã) và trả `{error}` không kiểm `state` — vô hại với mã lỗi ASCII của Google; sửa nếu có phiếu chạm oauth.ts.
- ~~S4 · T-2.5 · `eventToIcs` chưa gập dòng > 75 byte~~ → đã sửa T-2.15.

## Thứ tự & song song
M1: 1.1 → 1.2 → (1.3 ∥ 1.4) → 1.5 → 1.END → (1.6 ∥ 1.7) → ảnh mẫu 1284×2778 cho Chủ dự án thử (xong trước T-2.3) → tag M1-ok
M2: (2.1 ∥ 2.4 ∥ 2.5) → 2.2 → 2.3 → 2.8 → 2.6 → 2.7 → 2.10 → (2.11 ∥ 2.12) → 2.9 → (2.END ∥ 2.13)   (2.9 dùng chung styles/i18n với 2.12 → sau 2.12)
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
- Yêu cầu: `devices.ts` export `DEVICES: DeviceSpec[]` (iPhone 12→17 phổ biến, gồm 1179×2556, 1290×2796, 1170×2532, 1206×2622, 1320×2868), `detectDevice(screenW, screenH, dpr): DeviceSpec` (khớp preset gần nhất hoặc id 'auto'), `customDevice(w,h)`. `layoutMonth`: tiêu đề tháng, hàng thứ (theo `weekStart`), lưới ngày, tô hôm nay bằng `accentColor`, chấm sự kiện (`dot`) cho ngày có occurrence, hộp nền có `boxAlpha`; đặt khối theo `position`; mọi op trong `[safeTop·H, (1−safeBottom)·H]`. Nhãn thứ/tháng tạm thời hardcode VI (i18n làm ở M2), gom vào một chỗ trong `common.ts`. Ô hôm nay phải đọc được cả khi `accentColor === textColor` (mặc định đều `#ffffff`): nếu tô nền bằng accent thì số ngày dùng màu tương phản (vd. màu nền `bg.color`).
- Tiêu chí nghiệm thu:
  [ ] ≥ 28 op text ngày cho tháng 2/2026; có op `rect` hoặc `dot` tô hôm nay với `fill === accentColor`.
  [ ] Mọi op (kể cả `y + h` của rect) nằm trong vùng an toàn, với cả 3 `position` và 2 thiết bị (1179×2556, 1320×2868).
  [ ] Ngày có occurrence có op `dot`.
- Lệnh kiểm tra: `npx tsc --noEmit; npm run test`
- Nhật ký: 2026-09-13 lượt 1: DONE, kiem-thu PASS (21×2). Review chưa đạt: số ngày lệch tâm vòng hôm nay (baseline alphabetic), chấm sự kiện chìm trong vòng hôm nay, nhãn preset 1170×2532 sai "13 mini" → trả thợ (Lần thử 1/3). Lượt 2: sửa đủ 3 điểm + test mới → kiem-thu PASS (22×2, 2 e2e) → review đạt → commit.
- Model: sonnet · Lần thử: 1/3 · Trạng thái: DONE

### T-1.4 — paint + wallpaper (nền màu/gradient) + lưu trữ + store
- Mục tiêu: biến `DrawOp[]` thành PNG; lưu/đọc state IndexedDB; reducer trạng thái.
- Phạm vi file: `src/render/paint.ts`, `src/render/wallpaper.ts`, `src/storage/db.ts`, `src/ui/store.ts`, `tests/unit/store.test.ts`.
- Giao diện / đầu vào có sẵn: `src/core/model.ts`; `src/render/layout/month.ts` (T-1.3 — nếu chạy song song, import theo chữ ký SPEC `layoutMonth(d, c, dev)`); SPEC mục 5.
- Yêu cầu: `paint` hỗ trợ đủ 3 op (rect bo góc `r`, alpha; text theo font family sans/serif/mono hệ thống; dot). `renderWallpaper(state, bg, today)`: canvas đúng `device.width×height` (OffscreenCanvas nếu có, fallback `<canvas>`), nền solid/gradient (M1 bỏ qua `bg` ảnh — để M4), gọi `layoutMonth` (M1 chỉ bố cục tháng; `RenderData` tạm dựng từ state: occurrences rỗng, todos, note), trả Blob PNG; nếu URL có `?test=1` gán `window.__lastOps`. `db.ts`: `loadState/saveState/loadBg/saveBg` bằng idb-keyval. `store.ts`: `AppState` + `reducer(state, action)` thuần (action M1: `setDevice`, `setDesign(partial)`, `load(state)`), hàm `createStore` persist debounce 300 ms.
- Tiêu chí nghiệm thu:
  [ ] `store.test.ts`: reducer đổi device/design đúng, không mutate state cũ.
  [ ] `npx tsc --noEmit` sạch.
- Lệnh kiểm tra: `npx tsc --noEmit; npm run test`
- Nhật ký: 2026-09-13 lượt 1: DONE (14/14 × 2 TZ; tsc chỉ lỗi thiếu `./layout/month` của T-1.3). `DrawOp` khai trong `paint.ts` → Quản lý hợp nhất về `layout/common.ts` (D-005), tsc sạch → kiem-thu PASS → review đạt; Quản lý thêm guard `typeof OffscreenCanvas` trong `canvasToBlob` (1 dòng). kiem-thu lại PASS sau khi T-1.3 sửa → commit.
- Model: sonnet · Lần thử: 0/3 · Trạng thái: DONE

### T-1.5 — Màn Preview + Lưu ảnh
- Mục tiêu: UI dùng được: chọn thiết bị (preset / tự phát hiện / tùy chỉnh), xem ảnh preview, nút "Lưu ảnh".
- Phạm vi file: `src/ui/App.tsx`, `src/ui/screens/Preview.tsx`, `src/ui/styles.css`, `src/main.tsx`, `src/export/share.ts` (chỉ `savePng`).
- Giao diện / đầu vào có sẵn: `store.ts`, `db.ts`, `wallpaper.ts`, `devices.ts` (T-1.3/1.4); SPEC mục 5.
- Yêu cầu: App có thanh 5 tab (Preview, Sự kiện, Thiết kế, Đồng bộ, Hướng dẫn — 4 tab sau là placeholder); khởi động: `loadState()` hoặc `defaultState(detectDevice(...))`. Preview: `<select data-testid="device">` gồm preset + auto + tùy chỉnh (2 ô số), `<img data-testid="preview">` từ Blob (render lại debounce 150 ms khi state đổi, revoke URL cũ), nút `data-testid="save"` gọi `savePng(blob, 'lichkhoa-YYYY-MM-DD.png')` (Web Share files nếu `navigator.canShare` → fallback `<a download>`). Giao diện mobile-first 390 px.
- Tiêu chí nghiệm thu:
  [ ] Chạy `npm run build; npm run preview` và mở trình duyệt: chọn 1179×2556 → preview đổi.
  [ ] `npx tsc --noEmit` sạch, `npm run check` pass (không làm vỡ smoke).
- Lệnh kiểm tra: `npm run check`
- Nhật ký: 2026-09-13 lượt 1: DONE (check pass; script Playwright tạm xác nhận 1179×2556, không commit) → kiem-thu PASS. Review chưa đạt: ô tùy chỉnh nhận 0/quá lớn + lỗi render không bắt; revoke URL ngay sau click (hủy download WebKit); render cũ ghi đè ảnh mới → trả thợ (Lần thử 1/3). Lượt 2: sửa đủ 3 điểm → kiem-thu PASS (check + kiểm tay 0 / 1000×2000) → review đạt → commit.
- Model: sonnet · Lần thử: 1/3 · Trạng thái: DONE

### T-1.END — Kiểm thử tích hợp M1
- Mục tiêu: E2E luồng chính M1 theo SPEC mục 6.
- Phạm vi file: `tests/e2e/m1-render.spec.ts`; được sửa lỗi tích hợp nhỏ trong `src/**` nhưng phải khai báo từng file trong báo cáo.
- Tiêu chí nghiệm thu:
  [ ] chromium + webkit: mở app → chọn thiết bị 1179×2556 → `<img>` preview `naturalWidth=1179`, `naturalHeight=2556` → "Lưu ảnh" tạo download `.png` > 10 KB → reload vẫn giữ thiết bị (IndexedDB).
  [ ] Có `<link rel="manifest">`, `navigator.serviceWorker.ready` resolve (có thể giữ ở smoke.spec).
  [ ] `npm run check` pass toàn bộ.
- Lệnh kiểm tra: `npx playwright test tests/e2e/m1-render.spec.ts; npm run check`
- Nhật ký: 2026-09-13 lượt 1: DONE (10/10 × 5 lần lặp; check pass) nhưng né "flake" webkit bằng cách chờ preview trước khi chọn thiết bị. Quản lý: đó là bug app — `Preview.tsx` subscribe store trong useEffect (sau paint), dispatch sớm bị mất → trả thợ sửa src + test tái hiện (Lần thử 1/3). Lượt 2: tái hiện (code cũ 1/10 fail webkit) → sửa Preview.tsx 1 dòng → 20/20; check pass → kiem-thu PASS (repeat-each=5 0 fail; check 22×2 + 4 e2e) → review đạt → commit.
- Model: sonnet · Lần thử: 1/3 · Trạng thái: DONE

### T-1.6 — Tối ưu cho iPhone 13 Pro Max (D-007)
- Mục tiêu: app và hình nền tối ưu cho máy duy nhất của Chủ dự án: iPhone 13 Pro Max (1284×2778 px, 428×926 pt, DPR 3, tai thỏ).
- Phạm vi file: `src/render/devices.ts`, `src/ui/App.tsx`, `src/ui/styles.css`, `src/ui/screens/Preview.tsx` (chỉ bố cục/khả dụng), `index.html`, `vite.config.ts` (manifest), `public/apple-touch-icon.png` (mới, 180×180, tự sinh), `playwright.config.ts`, `tests/e2e/iphone13pm.spec.ts` (mới), `tests/unit/devices.test.ts` (mới). Không sửa test đã khóa.
- Yêu cầu:
  - `DEVICES` thêm preset `iphone-1284x2778` "iPhone 12/13 Pro Max" (đặt đầu danh sách); `detectDevice(428, 926, 3)` → preset này (vì đã có preset). KHÔNG đổi logic `detectDevice` — test khóa `layout-month.test.ts` cần `'auto'` khi không khớp. Fallback đặt ở `App.tsx` `loadInitialState`: không có state lưu và `detectDevice` trả `'auto'` → dùng preset 1284×2778. Sửa nhãn 1179×2556 → "iPhone 14 Pro/15/16". Vùng an toàn giữ 0.30/0.14 (Kiến trúc sư đã tính: 278pt trên ≥ đồng hồ+widget ≈ 260pt; 130pt dưới ≥ nút ≈ 95pt).
  - `index.html` (đã có `viewport-fit=cover`, giữ nguyên): thêm `apple-touch-icon`, `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style` (black-translucent), `apple-mobile-web-app-title` "LichKhoa", `theme-color`.
  - CSS thiết kế cho 428×926: `env(safe-area-inset-top/bottom)` (tai thỏ + thanh home), tab bar cố định đáy phía trên thanh home; `select/input` `font-size ≥ 16px` (tránh Safari tự phóng to); vùng chạm ≥ 44px; `-webkit-text-size-adjust: 100%`; không có cuộn ngang; ảnh preview co vừa để thấy trọn ảnh + nút "Lưu ảnh" không cần cuộn (428×926).
  - `playwright.config.ts`: chromium viewport 428×926; webkit dùng `devices['iPhone 13 Pro Max']` (isMobile, hasTouch, DPR 3) với viewport 428×926. Test khóa (`smoke`, `m1-render`) phải vẫn pass nguyên văn.
- Tiêu chí nghiệm thu:
  [ ] `devices.test.ts`: `detectDevice(428,926,3).id === 'iphone-1284x2778'`, preset có width 1284/height 2778; các preset cũ vẫn khớp.
  [ ] `iphone13pm.spec.ts` (webkit mô phỏng 13 Pro Max): lần đầu mở (IndexedDB trống) → select = preset 1284×2778, preview naturalWidth 1284/naturalHeight 2778; nút "Lưu ảnh" và tab bar nằm trọn trong viewport không cần cuộn; `scrollWidth <= clientWidth`; `getComputedStyle(select).fontSize ≥ 16px`; mỗi nút tab cao ≥ 44px; `link[rel=apple-touch-icon]` tồn tại.
  [ ] `npm run check` pass (test cũ không bị sửa).
- Lệnh kiểm tra: `npm run check`
- Nhật ký: 2026-09-13 lượt 1: DONE (32×2 unit, 6 e2e; iphone13pm repeat-each=3 ổn định) → kiem-thu PASS → review đạt; Quản lý thêm `height: 100dvh` cho `.app` (Safari còn thanh công cụ), check lại pass → commit.
- Model: sonnet · Lần thử: 0/3 · Trạng thái: DONE

### T-1.7 — normalizeState: nạp state cũ an toàn (phán quyết M1, D-008)
- Mục tiêu: state trong IndexedDB (hoặc file sao lưu) thiếu trường mới / sai phiên bản không làm app hỏng hay kẹt "Đang tải…".
- Phạm vi file: `src/core/model.ts` (thêm hàm), `src/storage/db.ts` (`loadState`), `tests/unit/model.test.ts` (mới). Chạy song song T-1.6 (không đụng file chung).
- Giao diện: `normalizeState(raw: unknown): AppState | null` trong `model.ts` — trả `null` nếu `raw` không phải object, `version !== 1`, hoặc `device` thiếu `width`/`height` là số; ngược lại `{...defaultState(raw.device), ...raw, design: {...defaultDesign(), ...raw.design}, google: {...mặc định google, ...raw.google}}`. `loadState()` giữ chữ ký: try `get` → `normalizeState`, catch → `null` (lỗi IndexedDB không làm kẹt app).
- Tiêu chí nghiệm thu:
  [ ] `model.test.ts`: state thiếu `design.boxAlpha`/`google`/`shortcutName` → được bù mặc định, giữ nguyên giá trị có sẵn; `version: 2` → null; không phải object / `device` thiếu số → null; không mutate `raw`.
  [ ] `npm run check` pass (test khóa không đổi).
- Ghi chú hợp đồng: T-2.5 `importBackup` PHẢI gọi `normalizeState`; T-2.8 chỉ cần thêm `showLunar` vào `defaultDesign()` là state cũ tự có mặc định.
- Lệnh kiểm tra: `npm run check`
- Nhật ký: 2026-09-13 lượt 1: DONE (normalizeState + loadState try/catch; model.test 6 test; 28×2 unit, check pass) → kiem-thu PASS → review đạt → commit.
- Model: sonnet · Lần thử: 0/3 · Trạng thái: DONE

---
## M2 — Sự kiện, to-do, ghi chú; Agenda / To-do / Note; sao lưu; i18n

### T-2.1 — recurrence
- Phạm vi file: `src/core/recurrence.ts`, `tests/unit/recurrence.test.ts`.
- Tham khảo (chép/port được, xem docs/tham-khao-LICH_NEN.md): `F:/LICH_NEN/lich-nen.html` L545–559 `occursOn` (bỏ 'weekdays'; bọc thành `expandOccurrences` duyệt từng ngày trong [from,to]; đã đúng quy tắc ngày 31 / 29-02).
- Mục tiêu: `expandOccurrences(events, from, to)` theo SPEC mục 5.
- Tiêu chí: [ ] daily / weekly / monthly (ngày 31 bỏ qua tháng thiếu ngày) / yearly (29/02 chỉ năm nhuận) / `until` / không lặp; chặn đúng `[from, to]`; `Occurrence.id` duy nhất (`<eventId>@<date>`); pass cả 2 TZ.
- Lệnh kiểm tra: `npm run test`
- Nhật ký: 2026-09-13 lượt 1: DONE (port occursOn; 10 test; 42×2 unit) → kiem-thu PASS (61×2 unit, 6 e2e) → review đạt → commit.
- Model: sonnet · Lần thử: 0/3 · Trạng thái: DONE

### T-2.2 — groupAgenda + collectRenderData
- Phạm vi file: `src/core/calendar.ts` (thêm `groupAgenda`), `src/core/collect.ts`, `tests/unit/collect.test.ts`.
- Tham khảo (chép/port được, xem docs/tham-khao-LICH_NEN.md): `F:/LICH_NEN/lich-nen.html` L560–572 `cmpEvent`, `buildAgenda` (cả ngày trước, rồi giờ, rồi tiêu đề).
- Mục tiêu: nhóm theo ngày, sắp xếp cả ngày trước rồi theo giờ; `collectRenderData` trộn local (đã expand trong [today, today+max(agendaDays, 42)]) + `google.cache.events` + todos + note.
- Tiêu chí: [ ] agenda 7 ngày đúng thứ tự; ngày trống bị bỏ; [ ] cache Google null không lỗi; [ ] trộn 2 nguồn đúng.
- Lệnh kiểm tra: `npm run test`
- Nhật ký: 2026-09-13 lượt 1: DONE (groupAgenda trong calendar.ts; collect.ts expand từ ngày 1 tháng chứa today; 69×2 unit) → kiem-thu PASS (69×2, 6 e2e) → review đạt → commit.
- Model: sonnet · Lần thử: 0/3 · Trạng thái: DONE

### T-2.3 — layoutAgenda, layoutTodo, layoutNote
- Phạm vi file: `src/render/layout/agenda.ts`, `todo.ts`, `note.ts`, `common.ts` (thêm helper bọc dòng ước lượng độ rộng theo `size`), `tests/unit/layout.test.ts`.
- Tham khảo (chép/port được, xem docs/tham-khao-LICH_NEN.md): `F:/LICH_NEN/LichNen.js` L302–343 `drawAgenda`, L344–363 `drawTodo`, L364–377 `pinnedHeight/drawPinned`, L135 `estLines` (ước lượng bọc dòng), L133 `dayLabel`, L120 `fmtTime` — chỉ lấy logic, đầu ra phải là `DrawOp[]`.
- Mục tiêu: 3 bố cục cùng chữ ký `layoutMonth`; giờ theo `hour12`; to-do ≤ 12 dòng có ký hiệu tick (☐/☑ hoặc rect); note bọc dòng; mọi op trong vùng an toàn.
- Bổ sung (Quản lý 2026-09-13): phạm vi thêm `src/render/layout/month.ts` (chỉ để nhường chỗ cho ghi chú). Khi `showNote` bật, `common.ts` chia vùng an toàn: khối chính (month/agenda/todo) và dải ghi chú KHÔNG chồng nhau (ghi chú tối đa ~4 dòng, nằm dưới khối chính; `position` áp cho khối chính trong phần còn lại). Agenda: nhãn ngày "Hôm nay"/"Ngày mai"/"T2 14/9" và AM/PM qua `t(key, c.lang)` (`src/core/i18n.ts` có sẵn, thêm khóa nếu thiếu → khi đó phạm vi gồm `src/core/i18n/*.json`, giữ 2 file khớp); tối đa 12 dòng (SPEC §9), vượt → dòng "+N"; chấm màu theo `occurrence.color` (không có → accent). Gom tạo nhãn ngày vào MỘT helper trong `common.ts` (T-2.8 sẽ thêm ngày âm vào đó). Test đã khóa `layout-month.test.ts` phải pass nguyên văn.
- Tiêu chí: [ ] agenda 7 ngày đúng thứ tự thời gian, `hour12` sinh "AM"/"PM"; [ ] agenda > 12 dòng cắt + "+N"; [ ] to-do > 12 mục cắt còn 12 (+ dòng "+N"); [ ] note dài bọc thành nhiều op text; [ ] vùng an toàn cho cả 3 (3 position × 2 thiết bị gồm 1284×2778); [ ] mỗi bố cục + note (showNote=true): bbox khối chính và bbox dải note không giao nhau.
- Lệnh kiểm tra: `npx tsc --noEmit; npm run test`
- Nhật ký: 2026-09-13 lượt 1: DONE (common: mainArea/noteArea, dayLabel/fmtTime/wrapText; month dùng mainArea; agenda/todo/note mới; 79×2 unit) → kiem-thu PASS. Review chưa đạt: dòng agenda/todo giãn theo hộp cố định 82% (1–2 mục rải thưa), không có trạng thái rỗng, tiêu đề dài tràn mép → trả thợ (Lần thử 1/3). Lượt 2: hộp ôm nội dung + co chữ, trạng thái rỗng (khóa agenda.empty/todo.empty), `truncate` "…"; 85×2 unit → kiem-thu PASS (check: 85×2 + 6 e2e) → review đạt → commit.
- Model: sonnet · Lần thử: 1/3 · Trạng thái: DONE

### T-2.4 — i18n
- Phạm vi file: `src/core/i18n.ts`, `src/core/i18n/vi.json`, `src/core/i18n/en.json`, `tests/unit/i18n.test.ts`.
- Tham khảo (chép/port được, xem docs/tham-khao-LICH_NEN.md): `F:/LICH_NEN/lich-nen.html` L405–409 `WD_SHORT`, `WD_LONG`, `REPEAT_LABEL` (bỏ 'weekdays').
- Mục tiêu: `t(key, lang, vars)` thay `{var}`; khóa thiếu → trả key; tên thứ/tháng dùng `Intl` hoặc bảng trong json; khóa cho mọi chuỗi UI hiện có + dự kiến (tabs, Preview, Events, Design, Sync, Guide, lỗi).
- Tiêu chí: [ ] tập khóa vi = tập khóa en; [ ] thay biến đúng; [ ] khóa thiếu trả key.
- Lệnh kiểm tra: `npm run test`
- Nhật ký: 2026-09-13 lượt 1: DONE (t() + vi/en.json theo nhóm khóa; 56×2 unit) → kiem-thu PASS (61×2 unit, 6 e2e) → review đạt → commit.
- Model: sonnet · Lần thử: 0/3 · Trạng thái: DONE

### T-2.5 — ics + backup
- Phạm vi file: `src/export/ics.ts`, `src/storage/backup.ts`, `tests/unit/ics.test.ts`, `tests/unit/backup.test.ts`.
- Tham khảo (chép/port được, xem docs/tham-khao-LICH_NEN.md): `F:/LICH_NEN/lich-nen.html` L585–615 `icsEscape`, `icsForEvent` (map `time`+`durationMin` → DTSTART/DTEND; không có `time` → `VALUE=DATE`; bỏ VALARM/DESCRIPTION vì `LocalEvent` không có), L685 `validBackup` (ý tưởng).
- Ràng buộc (D-008): `importBackup` dùng `normalizeState` (T-1.7) để kiểm/bù state; version lạ → ném lỗi.
- Mục tiêu: `eventToIcs` (VCALENDAR/VEVENT, DTSTART có giờ hoặc `VALUE=DATE`, RRULE FREQ + UNTIL, CRLF, escape `,;\`); `exportBackup/importBackup` `{version:1, state}`, version lạ → ném lỗi.
- Tiêu chí: [ ] ics có VCALENDAR, VEVENT, DTSTART, RRULE đúng, CRLF; [ ] backup vòng tròn giống hệt; version 2 → throw.
- Lệnh kiểm tra: `npm run test`
- Nhật ký: 2026-09-13 lượt 1: DONE (eventToIcs(e, now?) + backup qua normalizeState; 61×2 unit) → kiem-thu PASS (61×2 unit, 6 e2e) → review đạt → commit.
- Model: sonnet · Lần thử: 0/3 · Trạng thái: DONE

### T-2.8 — Âm lịch (SPEC v1.1, D-006)
- Mục tiêu: `solarToLunar`, `lunarYearName` và hiển thị âm lịch trên bố cục Tháng + Agenda, bật/tắt bằng `showLunar`.
- Phạm vi file: `src/core/lunar.ts` (mới), `tests/unit/lunar.test.ts` (mới), `src/core/model.ts` (thêm `showLunar: boolean` vào `DesignConfig`, mặc định `true`), `src/render/layout/month.ts`, `src/render/layout/agenda.ts`, `src/render/layout/common.ts`, `tests/unit/layout-month.test.ts`, `tests/unit/layout.test.ts`, `tests/unit/calendar.test.ts` (CHỈ chỗ kiểm `defaultDesign` thêm `showLunar` — khai báo trong báo cáo), `src/core/i18n/vi.json`, `src/core/i18n/en.json` (khóa "Âm lịch"/"nhuận"; nhãn qua `t(key, c.lang)`). State cũ tự có `showLunar` nhờ `normalizeState` (T-1.7).
- Tham khảo (chép/port được, xem docs/tham-khao-LICH_NEN.md): `F:/LICH_NEN/lich-nen.html` L405–406 `CAN`, `CHI`; L434–513 thuật toán Hồ Ngọc Đức (`jdFromDate`…`solarToLunar`, `lunarYearName`, `lunarText`), múi giờ cố định +7 (không phụ thuộc TZ máy).
- Giao diện / đầu vào có sẵn: SPEC v1.1 mục 3 IN-9, mục 5 (`solarToLunar(iso)`, `lunarYearName(year)`); `layoutMonth` (T-1.3), `layoutAgenda` (T-2.3).
- Yêu cầu: `showLunar=true` → bố cục Tháng: số ngày âm nhỏ (vd. "1/1" ngày mùng 1, còn lại chỉ ngày) dưới số ngày dương mỗi ô, không đè chấm sự kiện/vòng hôm nay; một dòng "Âm lịch d/m [nhuận] <Can Chi>" cho hôm nay dưới tiêu đề tháng. Agenda: nhãn ngày kèm ngày âm. `false` → không có op âm lịch nào. Mọi op vẫn trong vùng an toàn.
- Tiêu chí nghiệm thu:
  [ ] `lunar.test.ts` (2 TZ): 2026-02-17 → 1/1 năm Bính Ngọ; 2025-01-29 → 1/1 Ất Tỵ; 2024-02-10 → 1/1 Giáp Thìn; 2023-03-22 → 1/2 nhuận; 2025-07-25 → 1/6 nhuận; 2026-02-16 → 29/12 năm Ất Tỵ (tháng Chạp thiếu, không có 30 Tết).
  [ ] Layout Tháng/Agenda: `showLunar` true có op text âm lịch, false không có; test vùng an toàn cũ vẫn pass không nới.
  [ ] `npm run check` pass.
- Lệnh kiểm tra: `npm run check`
- Nhật ký: 2026-09-13 lượt 1: DONE (lunar.ts tz=7; showLunar mặc định true; ô Tháng có ngày âm, chấm sự kiện dời góc trên-phải khi showLunar; Agenda nhãn kèm ÂL; calendar.test chỉ thêm 1 expect — đã khai; 96×2 unit, check pass) → kiem-thu PASS. Quản lý dựng ảnh 1284×2778 xem bằng mắt: vòng hôm nay tâm ở giữa hàng nhưng số dương bị đẩy lên → chữ bị cắt đôi → trả thợ (Lần thử 1/3). Lượt 2: vòng hôm nay tính lại tâm/bán kính bao cả số dương + âm (+1 test bbox; thợ báo 97×2 pass, check pass); Quản lý xem ảnh r1: đạt. kiem-thu lượt lại bị dừng, chạy lại theo yêu cầu Chủ dự án → PASS (97×2 unit, 6 e2e; test khóa chỉ thêm dòng) → commit.
- Model: sonnet · Lần thử: 1/3 · Trạng thái: DONE

### T-2.6 — Nối dữ liệu vào render + store actions
- Phạm vi file: `src/render/wallpaper.ts`, `src/ui/store.ts`, `tests/unit/store.test.ts`, `src/render/layout/common.ts` + `src/render/layout/month.ts` (CHỈ đổi nhãn tháng/thứ sang i18n — bổ sung 2026-09-13), `tests/unit/wallpaper.test.ts` (mới, nếu cần test phần chọn layout thuần).
- Mục tiêu: `renderWallpaper` dùng `collectRenderData` + chọn layout theo `design.layout` + `layoutNote` khi `showNote`; nhãn thứ/tháng qua i18n. Store thêm action: CRUD sự kiện, CRUD/tick/sắp xếp to-do, `setNote`, `replaceState` (nhập backup), `resetAll`.
- Giao diện / đầu vào có sẵn: `collectRenderData` (`src/core/collect.ts`, T-2.2); `layoutMonth/Agenda/Todo/Note` (`src/render/layout/*`, cùng chữ ký `(d, c, dev) => DrawOp[]`); `t(key, lang)` (`src/core/i18n.ts`, đã có khóa `month.0..11`, `weekday.short.0..6` ở cả vi/en); `normalizeState` (`model.ts`); SPEC mục 5.
- Yêu cầu bổ sung (Quản lý):
  - Tách hàm thuần `buildOps(state, today): DrawOp[]` (trong `wallpaper.ts`, export) = collect → layout chính theo `design.layout` → nối `layoutNote` khi `showNote`; `renderWallpaper` gọi nó; `window.__lastOps` = kết quả `buildOps`. Test `buildOps` không cần canvas.
  - Nhãn: bỏ `LABELS_VI` cứng, `weekdayLabels(weekStart, lang)` + tiêu đề tháng qua `t('month.<m0>', lang)`. Với `lang='vi'` đầu ra phải GIỐNG HỆT hiện tại (test khóa `layout-month.test.ts` pass nguyên văn); nếu khóa vi của month/weekday lệch chữ hiện tại (vd. "Tháng 2" vs "tháng 2", "CN") → PHẢN BIỆN, không tự sửa json.
  - Tên action (T-2.7 dùng đúng tên này): `addEvent(event)`, `updateEvent(event)`, `deleteEvent(id)`, `addTodo(text)` (tạo id, `done:false`), `toggleTodo(id)`, `updateTodo(id, text)`, `deleteTodo(id)`, `moveTodo(id, dir: -1|1)` (ở biên thì giữ nguyên), `setNote(text)`, `replaceState(state)` (qua `normalizeState`; null → giữ state cũ), `resetAll()` (về `defaultState(state.device)` — giữ thiết bị). Reducer thuần, không mutate; id sinh qua `crypto.randomUUID` hoặc tham số, test không phụ thuộc giá trị id cụ thể.
- Tiêu chí: [ ] reducer test cho mọi action mới (gồm không mutate, moveTodo ở biên, replaceState null); [ ] `buildOps` test: `layout` month/agenda/todo gọi đúng bố cục (vd. agenda có nhãn "Hôm nay"), `showNote` true thêm op ghi chú, `lang='en'` → tiêu đề tháng tiếng Anh; [ ] test M1 + test khóa vẫn pass nguyên văn; [ ] Quản lý dựng ảnh mẫu 1284×2778 cho 3 bố cục (month/agenda/todo, có + không note, có 0/2/15 mục) và xem bằng mắt trước khi DONE (test không bắt được lỗi thẩm mỹ — xem T-2.3 lượt 1).
- Lệnh kiểm tra: `npm run check`
- Nhật ký: 2026-09-13 lượt 1: DONE (buildOps thuần, 11 action, nhãn tháng/thứ qua t(); 108×2 unit) → kiem-thu PASS. Quản lý dựng 18 ảnh mẫu (scratchpad `mau-t26.cjs`): 3 bố cục ổn, nhưng (1) chấm sự kiện ô hôm nay vô hình khi showLunar (ngoài vòng, tô bg.color), (2) note.ts giãn dòng theo chiều cao dải → trả thợ, mở phạm vi `month.ts` (chấm), `note.ts`, thêm test vào `layout*.test.ts` (Lần thử 1/3). Lượt 2: chấm hôm nay đặt hẳn ngoài vòng fill accent; note khoảng dòng 1,4×size, hộp ôm nội dung; +3 test (111×2) → kiem-thu PASS (test khóa chỉ thêm dòng) → Quản lý xem lại ảnh: đạt → commit.
- Model: sonnet · Lần thử: 1/3 · Trạng thái: DONE

### T-2.7 — Màn Sự kiện: lịch + sự kiện, việc cần làm, ghi chú (tách 2026-09-13, D-010)
- Mục tiêu: tab "Sự kiện" dùng được hằng ngày trên iPhone 13 Pro Max (428×926): quản lý sự kiện, to-do, ghi chú; mọi thay đổi qua action có sẵn trong `store.ts` (T-2.6) → preview tự vẽ lại.
- Phạm vi file: `src/ui/screens/Events.tsx` (mới; được tách `src/ui/screens/events/*.tsx` nếu > ~250 dòng), `src/ui/components/Sheet.tsx` (mới), `src/ui/components/Toast.tsx` (mới), `src/ui/App.tsx` (gắn tab + `data-testid="tab-<id>"` cho 5 nút tab, nhãn tab qua `t()`), `src/ui/styles.css`, `src/core/i18n/vi.json`, `src/core/i18n/en.json` (thêm khóa, giữ 2 file khớp), `tests/e2e/events.spec.ts` (mới).
- Giao diện / đầu vào có sẵn: action `addEvent/updateEvent/deleteEvent/addTodo/toggleTodo/updateTodo/deleteTodo/moveTodo/setNote` + `setDesign({showNote})` (`src/ui/store.ts`); `eventToIcs` (`src/export/ics.ts`); `savePng`-kiểu tải file trong `src/export/share.ts` (chỉ dùng, không sửa — cần hàm tải Blob chung thì viết trong Events); `expandOccurrences` (`recurrence.ts`), `monthGrid` (`calendar.ts`), `solarToLunar` (`lunar.ts`), `t()` (`i18n.ts`); kiểu `LocalEvent`, `Todo` (`model.ts`).
- Tham khảo (chép/port được — đã kiểm số dòng, xem docs/tham-khao-LICH_NEN.md §6): `F:/LICH_NEN/lich-nen.html`
  - L144–162 CSS sheet trượt + `.field` (ô nhập 16px, `env(safe-area-inset-bottom)`); L166–168 + L706 toast; L341–375 HTML sheet sự kiện (Hủy · tiêu đề · Lưu; switch Cả ngày; Ngày; Bắt đầu/Kết thúc; Lặp; Lặp đến; Màu; nút .ics; Xóa).
  - L733–794 `renderCalendar/renderDayList`: lịch tháng nhỏ trong app (số dương + âm, chấm màu ≤ 3/ô, bấm ô → danh sách ngày đó, trạng thái rỗng "Chưa có sự kiện…").
  - L797–859 `openEventSheet/readEventForm/saveEvent/deleteEvent/exportEventICS`: mặc định 09:00–10:00, tiêu đề trống → "(Không tiêu đề)", ẩn giờ khi Cả ngày, ẩn "Lặp đến" khi không lặp, confirm khi xóa, toast sau lưu/xóa, lưu xong nhảy về ngày của sự kiện.
  - L275–286 + L862–892 to-do: ô "Việc mới…" + nút Thêm (Enter cũng thêm), hàng tick · tiêu đề (bấm để sửa) · × xóa, nhóm "Đã xong (n)" ẩn/hiện.
  - Bỏ (OUT theo SPEC/D-006): lặp `weekdays`, "Nhắc trước"/VALARM, ghi chú riêng của sự kiện, hạn (due) của to-do, nhiều ghi chú/ghim, `prompt()` (thay bằng sửa tại chỗ). Map: `start` → `time`; `end` → `durationMin = end − start` (end ≤ start hoặc trống → bỏ `durationMin`).
- Yêu cầu:
  - Events.tsx có 3 phân đoạn (segmented, `data-testid="seg-events|seg-todos|seg-note"`): **Sự kiện** · **Việc** · **Ghi chú**.
  - Sự kiện: lịch tháng (`cal-prev`, `cal-next`, ô `cal-cell-<ISO>`, theo `weekStart`, âm lịch khi `showLunar`, chấm theo occurrence của `expandOccurrences`), danh sách ngày đang chọn (`ev-item`), nút `add-event` mở Sheet; Sheet: `ev-title`, `ev-allday`, `ev-date`, `ev-start`, `ev-end`, `ev-repeat` (none/daily/weekly/monthly/yearly), `ev-until`, `ev-color-<i>` (bảng màu `EVENT_COLORS` lich-nen.html L411), `ev-save`, `ev-cancel`, `ev-delete` (chỉ khi sửa, confirm), `ev-ics` (tải `lichkhoa-<date>.ics` từ `eventToIcs`). Sự kiện lặp: bấm occurrence → sửa sự kiện gốc.
  - Việc: `todo-input`, `todo-add`, hàng `todo-item` gồm `todo-toggle`, `todo-edit` (sửa tại chỗ), `todo-up`, `todo-down`, `todo-del`; sắp theo `order`; nhóm đã xong ẩn/hiện (`todo-done-toggle`).
  - Ghi chú: ~~`note-text`, `note-show`~~ → (sửa 2026-09-13, D-011) CHỈ khung `seg-note` + placeholder "Sắp có"; ghi chú nhiều mục làm ở T-2.12. Không thêm weekdays/nhắc trước/hạn to-do (T-2.10–2.12), nhưng đừng khóa cứng bố cục sheet/hàng to-do.
  - Toast `data-testid="toast"`. Mọi nhãn qua `t()`; nhãn tab đổi theo `design.lang`. Vùng chạm ≥ 44px, ô nhập ≥ 16px, sheet chừa `env(safe-area-inset-bottom)`, không cuộn ngang ở 428px.
- Tiêu chí nghiệm thu:
  [ ] `events.spec.ts` (chromium + webkit): thêm sự kiện có giờ lặp tuần → xuất hiện trong danh sách ngày + chấm ở lịch; sửa tiêu đề → danh sách đổi; xóa (chấp nhận confirm) → mất; `ev-ics` tạo download `.ics` chứa `BEGIN:VEVENT`; thêm 2 việc → `todo-down` đổi thứ tự → `todo-toggle` → vào nhóm đã xong → reload vẫn còn (IndexedDB). ~~ghi chú~~ (hủy, D-011)
  [ ] Ở webkit 13 Pro Max (428×926): `scrollWidth <= clientWidth` trên tab Sự kiện và khi mở sheet; nút `ev-save` nằm trong viewport khi sheet mở.
  [ ] `npm run check` pass; test khóa (smoke, m1-render, iphone13pm, unit) không sửa.
  [ ] Quản lý xem ảnh chụp màn hình tab Sự kiện 428×926 (3 phân đoạn + sheet mở) trước khi DONE.
- Lệnh kiểm tra: `npm run check`
- Nhật ký: 2026-09-13 lượt 1: DONE (Events + events/{EventsTab,TodosTab,NoteTab,util}, Sheet, Toast; 10 e2e) → kiem-thu PASS (repeat-each=3 0 fail). Quản lý chụp webkit 13 Pro Max (scratchpad `chup-events.cjs`): select "Lặp lại" nền trắng chữ nhạt; `todo-toggle` vô hình; "Cả ngày" checkbox nhỏ giữa; nút/ô nhập font Times (thiếu `font: inherit`); `EVENT_COLORS[0]` xanh đậm chìm nền tối + sửa sự kiện màu ngoài bảng bị đổi màu → trả thợ (Lần thử 1/3). Lượt 2: sửa 5 điểm + assert màu trong events.spec → kiem-thu PASS (repeat-each=3 0 fail) → ảnh lại: đạt 4/5; hàng "Cả ngày" chưa nhãn trái–công tắc phải → chuyển nợ sang T-2.12 → commit.
- Model: sonnet · Lần thử: 1/3 · Trạng thái: DONE

### T-2.9 — Preview: chọn bố cục, cài đặt chung, sao lưu (tách từ T-2.7, D-010)
- Mục tiêu: trên tab Preview, dưới nút "Lưu ảnh": chọn bố cục; cài đặt ngôn ngữ / 12h / tuần bắt đầu / âm lịch; Xuất/Nhập JSON, Xóa dữ liệu.
- Phạm vi file: `src/ui/screens/Preview.tsx`, `src/ui/styles.css`, `src/core/i18n/vi.json`, `src/core/i18n/en.json`, `tests/e2e/settings.spec.ts` (mới). Sau T-2.7 (chung styles/i18n).
- Giao diện / đầu vào có sẵn: `setDesign`, `replaceState`, `resetAll` (`store.ts`); `exportBackup/importBackup` (`src/storage/backup.ts`); `Toast` (T-2.7); `t()`.
- Tham khảo: `F:/LICH_NEN/lich-nen.html` L305–314 nhóm cài đặt dạng hàng (nhãn + gợi ý): Sao lưu dữ liệu · Khôi phục từ file sao lưu (confirm "Thay toàn bộ dữ liệu hiện tại…") · Xóa toàn bộ dữ liệu (nút đỏ, confirm); JS L971–990 `backupData/restoreData/wipeData`; L66–68 `.seg` (segmented control) cho chọn bố cục. Bỏ: nhập .ics, mục Scriptable (L310, L315–317).
- Yêu cầu: `layout` segmented (`data-testid="layout-month|layout-agenda|layout-todo"`); `lang` (select vi/en), `hour12` (switch), `weekstart` (select T2/CN), `lunar` (switch `showLunar`); `export-json` (tải `lichkhoa-backup-YYYY-MM-DD.json`), `import-json` (input file `.json` → confirm → `replaceState`; file hỏng / version lạ → toast lỗi, state giữ nguyên), `wipe` (confirm → `resetAll`, giữ thiết bị). Nút "Lưu ảnh" vẫn thấy không cần cuộn ở 428×926 (test khóa iphone13pm).
- Tiêu chí nghiệm thu:
  [ ] `settings.spec.ts`: chọn `layout-agenda` → `__lastOps` có nhãn "Hôm nay"; đổi `lang` en → nhãn tab tiếng Anh; bật `hour12` → `__lastOps` agenda chứa "AM"/"PM"; tắt `lunar` → không op "Âm lịch"; xuất JSON → `wipe` → nhập lại → sự kiện, ghi chú (v1.3), hạn to-do trở lại; nhập file hỏng → toast lỗi, dữ liệu còn.
  [ ] `npm run check` pass, test khóa không sửa.
  [ ] Quản lý chụp webkit 428×926 tab Preview (cuộn xuống phần cài đặt) trước khi DONE.
- Lệnh kiểm tra: `npm run check`
- Nhật ký: 2026-09-14 lượt 1: DONE (Preview: bố cục/lang/hour12/weekstart/lunar/xuất-nhập/xóa + toast; 20 e2e). Quản lý chụp (scratchpad `chup-t29.cjs`): segmented Bố cục cả 3 nút đều xanh (không thấy nút đang chọn); nhãn "Định dạng giờ" mơ hồ → trả thợ (Lần thử 1/3). kiem-thu lượt 1 PASS (logic). Lượt 2: `.preview-screen button` → `.preview-core button` (nguyên nhân đè `.seg-active`), aria-selected, nhãn "Giờ 12h (AM/PM)", assert màu segment → kiem-thu PASS (repeat-each=3 42/42) → ảnh lại: đạt (lộ lỗi agenda tiêu đề mồ côi → T-2.13) → commit.
- Model: sonnet · Lần thử: 1/3 · Trạng thái: DONE

### T-2.10 — Mô hình v1.3: lặp T2–T6, nhắc trước, hạn to-do, nhiều ghi chú (lõi) — D-011
- Mục tiêu: hợp đồng SPEC v1.3 mục 5 cho phần lõi; mọi thứ khác (render, UI) dựa trên đây.
- Phạm vi file: `src/core/model.ts` (Repeat `weekdays`, `LocalEvent.alarmMin`, `Todo.due`, `Note`, `AppState.notes`, BỎ `DesignConfig.noteText` khỏi kiểu + `defaultDesign`, `defaultState.notes: []`, `normalizeState` bù `notes` + chuyển `design.noteText` khác rỗng → 1 Note pinned `{title:'', body:noteText}` và xóa `noteText` khỏi design), `src/core/recurrence.ts` (weekdays = getDay 1..5), `src/export/ics.ts` (BYDAY; VALARM `ACTION:DISPLAY`, `DESCRIPTION`, `TRIGGER:-PT<n>M` hoặc `-P1D` khi 1440), `src/core/collect.ts` (sắp to-do theo SPEC; `note`/`noteTitle` từ Note pinned), `src/ui/store.ts` (BỎ `setNote`; thêm `addNote(note)`, `updateNote(note)`, `deleteNote(id)`, `pinNote(id, pinned)` — ghim 1 thì bỏ ghim các cái khác, `updated = Date.now()` hoặc tham số; `addTodo` nhận `due?`; `setTodoDue(id, due|null)`), `src/core/i18n/vi.json` + `en.json` (khóa hiển thị trên hình nền: `todo.overdue` "Quá hạn"/"Overdue", `repeat.weekdays`; giữ 2 file khớp), `src/ui/screens/events/*` CHỈ để tsc sạch nếu T-2.7 lỡ dùng `setNote`/`noteText`.
- Test: `tests/unit/recurrence.test.ts`, `ics.test.ts`, `collect.test.ts`, `model.test.ts`, `store.test.ts`, `backup.test.ts` — THÊM test mới. Được SỬA test khóa CHỈ ở chỗ dùng `noteText`/`setNote` (store.test, collect.test, wallpaper.test, model.test) để chuyển sang `notes` — mỗi chỗ sửa khai báo trong báo cáo; mọi test khác nguyên văn.
- Tham khảo: `F:/LICH_NEN/lich-nen.html` L553 `weekdays` trong occursOn; L604 map RRULE (BYDAY); L610 dòng VALARM; L578–581 `taskSort` (có hạn trước, hạn tăng dần — ta thêm `order` cho việc không hạn); L920–926 `saveNote` (ghim 1 → bỏ ghim các cái khác).
- Tiêu chí nghiệm thu: [ ] đúng các dòng (v1.3) của SPEC M2 cho recurrence/ics/collect/model; [ ] backup vòng tròn giữ `notes`, `due`, `alarmMin`; [ ] reducer: `pinNote` đảm bảo ≤ 1 pinned, không mutate; [ ] `npm run check` pass.
- Lệnh kiểm tra: `npm run check`
- Nhật ký: 2026-09-14 lượt 1: DONE (122×2 unit; sửa test khóa đúng 3 chỗ noteText/setNote, đã khai) → kiem-thu PASS (mọi dòng `-` trong phạm vi được phép) → review đạt (ghi chú ghim chỉ có tiêu đề → chuyển yêu cầu sang T-2.11) → commit.
- Model: sonnet · Lần thử: 0/3 · Trạng thái: DONE

### T-2.11 — Hình nền v1.3: nhãn hạn to-do + tiêu đề ghi chú ghim
- Phạm vi file: `src/render/layout/todo.ts`, `src/render/layout/note.ts`, `src/render/layout/common.ts` (`noteHeight` tính thêm dòng tiêu đề; helper nhãn hạn dùng `t()`), `tests/unit/layout.test.ts` (chỉ thêm). Sau T-2.10; song song T-2.12 (không chung file).
- Tham khảo: `F:/LICH_NEN/lich-nen.html` L1273 nhãn hạn trên hình nền ("Quá hạn" / "Hôm nay" / "d/m"); L1132–1149 khối ghi chú ghim (tiêu đề đậm + ≤ 4 dòng).
- Yêu cầu: to-do chưa xong có `due` → nhãn canh phải cùng dòng (tiêu đề cắt "…" để chừa chỗ); quá hạn → nhãn màu `accentColor`, chữ đậm; note: `noteTitle` khác rỗng → dòng tiêu đề đậm trước ≤ 4 dòng nội dung; ghi chú ghim CHỈ có tiêu đề (`note === ''`, `noteTitle` có) vẫn phải vẽ (hiện `layoutNote` trả [] khi `!d.note`) — `noteHeight` cũng tính theo đó; khối chính và dải note vẫn không giao nhau; mọi op trong vùng an toàn (3 position × 2 thiết bị).
- Tiêu chí: [ ] test nhãn hạn 3 trường hợp + quá hạn tô accent; [ ] note có tiêu đề → op text đậm đứng trước nội dung; bbox không giao; [ ] `npm run check` pass (kiem-thu chạy); [ ] Quản lý dựng ảnh mẫu có dữ liệu (khuôn `mau-t26.cjs`) và xem trước khi DONE.
- Lệnh kiểm tra (thợ): `npx tsc --noEmit; npm run test` — KHÔNG chạy build/e2e vì T-2.12 chạy song song (tránh tranh `dist/` + cổng 4173); `npm run check` do kiem-thu chạy sau.
- Nhật ký: 2026-09-14 lượt 1: DONE (todoDueLabel, nhãn hạn canh phải, note tiêu đề + chỉ-tiêu-đề; +6 test, 128×2) → kiem-thu chung với T-2.12 PASS → ảnh mẫu v1.3 (scratchpad `mau-v13.cjs`): đạt → commit.
- Model: sonnet · Lần thử: 0/3 · Trạng thái: DONE

### T-2.12 — Màn Sự kiện v1.3: T2–T6, nhắc trước, hạn to-do, danh sách ghi chú
- Phạm vi file: `src/ui/screens/Events.tsx`, `src/ui/screens/events/*`, `src/ui/styles.css`, `src/core/i18n/vi.json`, `src/core/i18n/en.json`, `tests/e2e/events.spec.ts` (chỉ thêm test), `tests/e2e/notes.spec.ts` (mới). Sau T-2.7 + T-2.10; song song T-2.11.
- Tham khảo: `F:/LICH_NEN/lich-nen.html` L350–368 (option "Thứ hai đến thứ sáu", select "Nhắc trước" 0/5/15/30/60/1440 + gợi ý "Việc nhắc do Lịch iPhone thực hiện…"); L784–785 meta dưới sự kiện ("Hằng tuần, Nhắc trước 15 phút"); L275–279 ô ngày hạn cạnh ô việc mới; L876 + L133–134 nhãn hạn (quá hạn màu cảnh báo); L377–384 sheet ghi chú (Tiêu đề, Nội dung, switch "Ghim lên hình nền", Xóa); L895–932 danh sách ghi chú (ghim lên đầu, nhãn "Ghim", trạng thái rỗng, ghi chú trống → toast).
- Yêu cầu / `data-testid`: sheet sự kiện thêm option `weekdays` trong `ev-repeat` và `ev-alarm` (select); hàng sự kiện hiện meta lặp + nhắc. Nợ từ T-2.7: hàng "Cả ngày" phải là nhãn TRÁI – công tắc PHẢI trên cùng một hàng (hiện nhãn nằm giữa phía trên công tắc); áp cùng kiểu cho `nt-pin`, `note-show`. To-do: `todo-due` (ô ngày cạnh `todo-input`), nhãn hạn `todo-due-label` trên hàng (quá hạn class cảnh báo), sửa hạn tại chỗ; thứ tự hiển thị theo SPEC (có hạn trước). Ghi chú: danh sách `note-item` (ghim lên đầu, nhãn Ghim), `add-note` mở sheet `nt-title`, `nt-body`, `nt-pin`, `nt-save`, `nt-cancel`, `nt-delete` (confirm); switch `note-show` (`showNote`) ở đầu phân đoạn; gợi ý "Ghi chú ghim hiện ở cuối hình nền".
- Tiêu chí: [ ] `events.spec.ts` thêm: sự kiện `weekdays` → có chấm T2–T6, không có T7/CN của tuần đó; `ev-alarm`=15 → .ics tải về chứa `TRIGGER:-PT15M`; việc có hạn hôm qua hiện "Quá hạn" và đứng trên việc không hạn; [ ] `notes.spec.ts`: thêm 2 ghi chú, ghim cái 2 + bật `note-show` → `__lastOps` chứa tiêu đề ghi chú 2, không chứa ghi chú 1 → reload vẫn còn (nếu T-2.11 chưa xong, `__lastOps` có thể chưa có tiêu đề → assert nội dung ghi chú 2 thay vì tiêu đề, ghi chú trong báo cáo); [ ] 428×926 không cuộn ngang, `nt-save` trong viewport khi sheet mở; [ ] `npm run check` pass, test khóa không sửa; [ ] Quản lý xem ảnh chụp màn hình.
- Lệnh kiểm tra: `npm run check` (T-2.11 song song chỉ chạy unit — không tranh build/cổng)
- Nhật ký: 2026-09-14 lượt 1: DONE (weekdays, ev-alarm + gợi ý, meta; todo-due/nhãn hạn/sắp theo hạn; NoteTab danh sách + sheet + ghim; nợ "Cả ngày" + S4 durationMin đã sửa; 18 e2e) — thợ chép lại cmpTodo/todoDueLabel vào util.ts (ngoài phạm vi không import được) → Quản lý gộp: export `cmpTodo` ở collect.ts, util.ts dùng lại + re-export `todoDueLabel` → kiem-thu PASS (repeat-each=3 36/36) → chụp webkit (scratchpad `chup-v13.cjs`): đạt → commit 7a4a5d2.
- Model: sonnet · Lần thử: 0/3 · Trạng thái: DONE

### T-2.13 — Agenda: bỏ tiêu đề ngày mồ côi khi cắt 12 dòng
- Mục tiêu: khi agenda chạm trần 12 dòng, không được còn một tiêu đề ngày mà không có sự kiện nào bên dưới (ảnh T-2.9: "T6 18/9 · 8/8 ÂL" rồi "+1").
- Phạm vi file: `src/render/layout/agenda.ts`, `tests/unit/layout.test.ts` (chỉ THÊM test). Song song T-2.END (không chung file).
- Yêu cầu: tiêu đề ngày chỉ được vẽ nếu còn chỗ cho ít nhất 1 sự kiện của ngày đó; nếu không, dừng trước tiêu đề đó và "+N" đếm mọi sự kiện chưa hiện (kể cả của ngày bị bỏ tiêu đề). Tổng dòng vẫn ≤ 12 (SPEC §9).
- Tiêu chí: [ ] test: dữ liệu làm dòng thứ 11 là tiêu đề ngày → op cuối trước "+N" là một sự kiện, không phải tiêu đề; N đúng; [ ] test khóa (`layout.test.ts` cũ, `layout-month.test.ts`) pass nguyên văn; [ ] Quản lý xem lại ảnh agenda 15 mục.
- Lệnh kiểm tra (thợ): `npx tsc --noEmit; npm run test` (không build/e2e — T-2.END chạy song song).
- Nhật ký: 2026-09-14 lượt 1: DONE (buildWithBudget; +1 test, fail trên code cũ đã xác nhận; 129×2) — thợ dùng `git stash` khi T-2.END đang chạy (không mất gì, ghi BAI-HOC). Chờ T-2.END xong để kiem-thu + ảnh mẫu. → kiem-thu PASS (chung T-2.END) → ảnh agenda 15 mục: không còn tiêu đề mồ côi, "+8" đúng → commit.
- Model: sonnet · Lần thử: 0/3 · Trạng thái: DONE

### T-2.14 — Sửa 4 lỗi từ soát chéo M2 (Gemini, Quản lý đã kiểm chứng)
- Nguồn: `docs/bao-cao/M2-soat-cheo.md` (4 mục, Quản lý xác nhận có thật trong mã; hạ về S3).
- Phạm vi file: `src/core/model.ts` (normalizeState), `src/ui/store.ts` (moveTodo), `src/ui/screens/events/EventsTab.tsx`, `src/ui/screens/events/util.ts`, `src/ui/screens/events/TodosTab.tsx`, `src/ui/screens/Preview.tsx`, `src/core/i18n/vi.json`, `src/core/i18n/en.json`; test: `tests/unit/model.test.ts`, `tests/unit/store.test.ts`, `tests/e2e/m2-i18n.spec.ts`, `tests/e2e/events.spec.ts` (mọi test cũ chỉ THÊM, không sửa).
- Yêu cầu:
  1. `normalizeState`: `device` hợp lệ (width/height số) nhưng thiếu/sai `safeTop`/`safeBottom`/`id`/`label` → bù từ mặc định (preset trùng kích thước nếu có trong `DEVICES`, không thì 0.30/0.14, id `'custom'`); không NaN khi render. (Đóng S4 tồn đọng T-1.7.)
  2. Sự kiện qua đêm: Kết thúc < Bắt đầu → `durationMin = end − start + 1440`; bằng nhau/trống → không `durationMin`. Mở lại hiển thị đúng giờ kết thúc.
  3. Preview: mọi nhãn còn cứng ("Thiết bị", "Tự phát hiện", "Tùy chỉnh", "Lưu ảnh", alt ảnh, nhãn ô tùy chỉnh, thông báo lỗi…) qua `t()`; khóa đã có thì dùng lại, thiếu thì thêm (vi = en). Rà thêm `App.tsx`/`screens/**` bằng grep chữ có dấu tiếng Việt ngoài `t()` và báo lại chỗ nào còn (chỉ sửa trong phạm vi; ngoài phạm vi thì liệt kê).
  4. `moveTodo`: hoán đổi với việc KỀ BÊN theo đúng thứ tự hiển thị (`cmpTodo`), chỉ khi cùng nhóm (cùng `done`, cùng có/không `due`, nếu có `due` thì cùng ngày) — khác nhóm → không đổi. UI tắt (disabled) `todo-up`/`todo-down` khi thao tác sẽ không đổi gì. Kèm S4 tồn đọng T-2.12: ô `todo-due` trống có nhãn/gợi ý "Hạn" (aria-label + chữ nhỏ hoặc placeholder hiển thị được trên webkit).
- Tiêu chí: [ ] model.test: device thiếu safe* → có số hợp lệ; [ ] store.test: moveTodo trong nhóm đổi, khác nhóm không đổi, không mutate; [ ] events.spec: sự kiện 23:00–01:00 lưu → mở lại Kết thúc 01:00; bấm `todo-down` trên việc không hạn cuối nhóm → disabled; [ ] m2-i18n: `en` → nút lưu ảnh và nhãn thiết bị tiếng Anh; [ ] `npm run check` pass; [ ] Quản lý chụp webkit tab Việc + Preview (en).
- Lệnh kiểm tra: `npm run check`
- Nhật ký: 2026-09-14 lượt 1: DONE (4 test tái hiện fail trước khi sửa; 132×2 unit, 32 e2e) → kiem-thu PASS (repeat-each=3 66/66; test cũ chỉ thêm; M1 không đổi) → chụp webkit tab Việc + Preview en: đạt → commit.
- Model: sonnet · Lần thử: 0/3 · Trạng thái: DONE

### T-2.END — Kiểm thử tích hợp M2
- Phạm vi file: `tests/e2e/m2-events.spec.ts`, `tests/e2e/m2-i18n.spec.ts`; sửa tích hợp nhỏ `src/**` phải khai báo — TRỪ `src/render/layout/agenda.ts` (T-2.13 song song đang sửa). Dùng đúng `data-testid` đã chốt ở T-2.7/2.9/2.12 (xem các phiếu đó + `tests/e2e/{events,notes,settings}.spec.ts`).
- Tiêu chí: [ ] thêm sự kiện lặp tuần → chuyển Agenda → hash PNG preview đổi → reload còn sự kiện → xuất JSON → xóa dữ liệu → nhập JSON → sự kiện trở lại (kèm ghi chú ghim + hạn to-do + nhắc trước — v1.3); [ ] đổi `en` → nhãn tab đổi; bật 12h → agenda (qua `window.__lastOps`) chứa "AM"/"PM"; tắt âm lịch → `__lastOps` không còn op "Âm lịch"; [ ] (v1.3) sự kiện T2–T6 đúng ngày trên Agenda; bố cục To-do có "Quá hạn"; 2 ghi chú, ghim cái 2 → `__lastOps` có tiêu đề ghi chú 2, không có ghi chú 1; [ ] `npm run check` pass, test M1 không bị sửa/skip.
- Lệnh kiểm tra: `npm run check`
- Nhật ký: 2026-09-14 lượt 1: DONE (m2-events 2 test, m2-i18n 1 test; không sửa src) — test T2–T6 chỉ đếm 5 ngày → trả thợ siết (Lần thử 1/3). Lượt 2: so đúng tập tiêu đề ngày getDay 1..5 → kiem-thu PASS (129×2 unit, 26 e2e; repeat-each=3 18/18; test M1 không đổi từ M1-ok) → commit.
- Model: sonnet · Lần thử: 1/3 · Trạng thái: DONE

### T-2.15 — Nối tiếp duyệt M2 (D-012): trần agenda theo dòng sự kiện, normalizeState chặt hơn, ics weekdays + gập dòng
- Nguồn: phán quyết Kiến trúc sư duyệt M2 (D-012). Không chặn `M2-ok`; làm trước T-3.1.
- Phạm vi file: `src/render/layout/agenda.ts`, `src/core/model.ts`, `src/export/ics.ts`, `tests/unit/layout.test.ts`, `tests/unit/model.test.ts`, `tests/unit/ics.test.ts`. ĐƯỢC SỬA test khóa `layout.test.ts` ~L143 (test trần 12 dòng cũ) cho khớp quy tắc mới — khai báo trong báo cáo; mọi test khác chỉ THÊM.
- Yêu cầu:
  (a) Agenda: trần 12 = số **dòng sự kiện**; tiêu đề ngày KHÔNG tính vào trần (vẫn giữ quy tắc T-2.13: không có tiêu đề mồ côi; "+N" = sự kiện chưa hiện). Tổng dòng tối đa (tiêu đề + sự kiện + "+N") phải nằm trong vùng an toàn nhờ co chữ sẵn có — 3 position × 2 thiết bị (gồm 1284×2778), có và không `showNote`.
  (b) `normalizeState`: `events`/`todos`/`notes` không phải mảng → `[]`; phần tử không phải object bị bỏ; `notes` có > 1 `pinned` → chỉ giữ ghim cái `updated` lớn nhất. Không mutate `raw`.
  (c) `eventToIcs`: `repeat='weekdays'` mà `date` rơi T7/CN → DTSTART dời tới T2 kế tiếp (giữ giờ). Gập mọi dòng > 75 octet theo RFC 5545 §3.1 (CRLF + 1 dấu cách), KHÔNG cắt giữa chuỗi byte UTF-8 (tiêu đề tiếng Việt dài). Đóng S4 T-2.5.
- Tham khảo: `F:/LICH_NEN/lich-nen.html` L585–615 (`icsEscape`, `icsForEvent`) — cách gập dòng nếu có.
- Tiêu chí: [ ] layout.test: 7 ngày × 2 sự kiện → hiện 12 sự kiện + tiêu đề + "+2", mọi op trong vùng an toàn; [ ] model.test: `notes` 2 ghim → 1 ghim (updated mới nhất); `events: "x"` → `[]`; [ ] ics.test: weekdays ngày CN 2026-09-13 → `DTSTART…20260914`; tiêu đề 200 ký tự tiếng Việt → mọi dòng ≤ 75 octet, bỏ gập (xóa CRLF+space) ra lại đúng chuỗi UTF-8; [ ] `npm run check` pass (kiem-thu chạy); [ ] Quản lý xem ảnh agenda 15 mục.
- Lệnh kiểm tra (thợ): `npx tsc --noEmit; npm run test` (T-2.16 song song dùng build/cổng).
- Nhật ký: 2026-09-14 lượt 1: DONE (trần 12 dòng sự kiện; clampPinned + mảng; ics DTSTART weekdays + foldLine UTF-8; test khóa layout.test L113–144 sửa đúng khai báo; 139×2) → kiem-thu PASS (32 e2e) → ảnh agenda 15 mục bằng `scripts/mau-anh.cjs`: 12 sự kiện + "+3", co chữ khi có note, không chồng → commit.
- Model: sonnet · Lần thử: 0/3 · Trạng thái: DONE

### T-2.16 — Công cụ ảnh mẫu + chụp webkit vào `scripts/` (D-012)
- Nguồn: D-012 (công cụ review bằng mắt phải nằm trong repo). Bản nháp đang chạy tốt ở thư mục tạm của Quản lý: `C:/Users/HUY/AppData/Local/Temp/claude/E--DuAn-thu-nghiem/27403320-d85e-40f5-b985-ce5f41c1d16e/scratchpad/` — `mau-v13.cjs` (18 ảnh 1284×2778 + 3 tấm tổng hợp), `chup-v13.cjs` (tab Sự kiện, 6 ảnh), `chup-t29.cjs` + `chup-t214-en.cjs` (tab Preview, 3 ảnh), `crop.cjs` (cắt/phóng ảnh).
- Phạm vi file (chỉ tạo mới trong `scripts/`): `scripts/mau-anh.cjs`, `scripts/chup.cjs`, `scripts/cat-anh.cjs`, `scripts/README-cong-cu.md`. Không sửa `src/`, `tests/`, `package.json`. Giữ nguyên `scripts/mau-anh-1284.cjs`.
- Yêu cầu: chép từ bản nháp, sửa cho dùng lại được: đường dẫn repo lấy từ `path.resolve(__dirname, '..')` (không cứng `E:/DuAn/...`); cổng preview tham số `--port` (mặc định 4190–4199 khác 4173); `mau-anh.cjs <thư-mục-ra>` sinh 18 PNG + `tong-month|agenda|todo.png`; `chup.cjs <events|preview> <thư-mục-ra> [--lang en]`; `cat-anh.cjs <vào.png> <ra.png> x y w h [phóng]`. Dữ liệu mẫu (sự kiện có HÔM NAY, lặp T2–T6, nhắc trước, việc quá hạn/hôm nay/có hạn, 2 ghi chú 1 ghim) giữ như bản nháp, ngày tính theo hôm nay. Luôn tắt server preview khi xong/lỗi. README ≤ 30 dòng: khi nào dùng, lệnh, cần `npm run build` trước.
- Tiêu chí: [ ] `npm run build; node scripts/mau-anh.cjs <tmp>` → 21 PNG, mỗi ảnh mẫu đọc IHDR = 1284×2778; [ ] `node scripts/chup.cjs events <tmp>` → 6 PNG; `node scripts/chup.cjs preview <tmp> --lang en` → 3 PNG; [ ] không tiến trình `vite preview` nào còn sót (kiểm `Get-Process node` trước/sau hoặc cổng đã giải phóng); [ ] `git status` chỉ có file mới trong `scripts/`.
- Lệnh kiểm tra: như tiêu chí (thợ được chạy `npm run build` — T-2.15 song song không build).
- Nhật ký: 2026-09-14 PHẢN BIỆN 1: build fail do T-2.15 sửa dở `agenda.ts` → BÁC BỎ sửa src; thợ viết xong script + `node --check`, chờ T-2.15 xong mới chạy kiểm tra runtime. Bài học: phiếu song song mà một bên cần build thì bên kia làm dở sẽ phá build → lần sau xếp tuần tự, hoặc bên cần build chạy sau. Sau T-2.15: chạy runtime — 21 PNG IHDR 1284×2778, chup events 6 / preview en 3, cổng giải phóng → kiem-thu PASS (`node --check`) → commit.
- Model: haiku · Lần thử: 0/3 · Trạng thái: DONE

---
## M3 — Google Calendar (OAuth thuần client, chỉ đọc)

### T-3.1 — oauth
- Phạm vi file: `src/google/oauth.ts`, `tests/unit/oauth.test.ts`.
- Mục tiêu: `buildAuthUrl`, `parseFragment`, `newState()` (crypto ngẫu nhiên, lưu sessionStorage), token store localStorage `{accessToken, expiresAt}`, `getToken()` null khi hết hạn (nhận `now` tham số để test).
- Tiêu chí: [ ] URL có `response_type=token`, `scope=https://www.googleapis.com/auth/calendar.readonly`, `state`, `redirect_uri`, `prompt` tùy chọn; [ ] `parseFragment` đúng state / sai state / `error` / rỗng.
- Bổ sung (Quản lý 2026-09-14): Vitest chạy môi trường node (không có `localStorage`/`sessionStorage`) → hàm lưu/đọc token và state nhận tham số `storage: Pick<Storage,'getItem'|'setItem'|'removeItem'>` (mặc định `globalThis.localStorage`/`sessionStorage` khi có); test dùng Map giả. `parseFragment` giải mã `%xx`, chấp nhận hash có/không `#`; `expiresIn` là số; `expiresAt = now + expiresIn*1000 − 60 s` (trừ biên an toàn). Không log token. Hợp đồng chữ ký theo SPEC §5 (được thêm tham số tùy chọn ở cuối).
- Lệnh kiểm tra: `npx tsc --noEmit; npm run test` (song song T-3.2; không build/e2e)
- Nhật ký: 2026-09-14 lượt 1: DONE (buildAuthUrl, parseFragment, newState, save/get/clearToken có storage tùy chọn; 152×2) → kiem-thu PASS (159×2, 32 e2e) → review: đạt; Quản lý sửa 1 dòng comment chứa chữ `client_secret` (tiêu chí T-3.END đòi `Select-String … client_secret` rỗng) → commit. Ghi chú cho T-3.3 (localStorage cho state, xóa state sau dùng).
- Model: sonnet · Lần thử: 0/3 · Trạng thái: DONE

### T-3.2 — Google Calendar REST + normalize
- Phạm vi file: `src/google/calendar.ts`, `tests/unit/google-normalize.test.ts`, `tests/fixtures/google/*.json`.
- Mục tiêu: `fetchCalendars`, `fetchEvents` (fetch + Bearer, `singleEvents=true&orderBy=startTime&maxResults=250`, ≤ 2 trang/lịch), `normalize` thuần tách riêng; 401 → `AuthError`; bỏ `cancelled`; màu lịch.
- Tiêu chí: [ ] all-day → `allDay=true` đúng ngày; [ ] `dateTime` offset khác → ngày/giờ địa phương đúng ở cả 2 TZ; [ ] cancelled bị bỏ; [ ] nhiều lịch gộp + sắp xếp; [ ] fetch mock trả 401 → `AuthError`.
- Bổ sung (Quản lý 2026-09-14): sự kiện cả ngày nhiều ngày (`start.date`..`end.date` — `end` là NGÀY SAU, không tính) → 1 `Occurrence` mỗi ngày trong khoảng, `id = <eventId>@<date>` (cùng quy ước recurrence T-2.1), chặn trong `[timeMin, timeMax]`; sự kiện có giờ qua đêm → chỉ ngày bắt đầu. `fetch` nhận qua tham số tùy chọn (mặc định `globalThis.fetch`) để test không cần mạng; phân trang bằng `nextPageToken`, dừng ở trang 2; `timeMin/timeMax` gửi dạng RFC3339 theo giờ địa phương (ISODate → đầu ngày/cuối ngày có offset máy). Màu: `backgroundColor` của lịch. Lỗi mạng/5xx → ném lỗi thường (không phải `AuthError`). Fixture tự viết theo định dạng Calendar API v3 (không dùng dữ liệu thật).
- Lệnh kiểm tra: `npx tsc --noEmit; npm run test` (song song T-3.1; không build/e2e)
- Nhật ký: 2026-09-14 lượt 1: DONE (fetchCalendars/fetchEvents/normalize/AuthError; fixtures giả; 159×2) — [ĐÍNH CHÍNH 2026-09-14: Quản lý ghi nhầm "all-day nhiều ngày tách ngày"; thực tế CHƯA làm, không có test — soát chéo M3 phát hiện → T-3.4] — `fetchEvents` tự gọi calendarList để lấy màu (giữ chữ ký SPEC) → kiem-thu PASS (2 TZ, fixture không dữ liệu thật) → review múi giờ: đạt → commit.
- Model: sonnet · Lần thử: 0/3 · Trạng thái: DONE

### T-3.3 — Màn Đồng bộ + tự đồng bộ
- Phạm vi file: `src/ui/screens/Sync.tsx`, `src/ui/App.tsx`, `src/ui/store.ts`, `src/ui/sync.ts` (điều phối), `src/core/i18n/*.json`, `tests/unit/store.test.ts`.
- Mục tiêu: dán Client ID, Kết nối (redirect), xử lý hash khi khởi động (xóa bằng `replaceState`), danh sách lịch + chọn, Đồng bộ ngay, thời điểm đồng bộ, Ngắt kết nối; tự đồng bộ khi mở nếu token còn hạn và cache > 30 phút; 401 → trạng thái "Kết nối lại"; lỗi mạng → giữ cache.
- Tiêu chí: [ ] `npm run check` pass; [ ] reducer test cho action google.
- Bổ sung (Quản lý, review T-3.1): gọi `newState(localStorage)` (không dùng sessionStorage mặc định — PWA standalone iOS có thể mất sessionStorage qua redirect Google, SPEC §8 rủi ro 1); xóa `state` ngay sau khi `parseFragment` (dùng 1 lần, kể cả khi lỗi); `redirectUri` = `location.origin + location.pathname` (khớp `VITE_BASE`, có `/` cuối). 401 → `clearToken()` + trạng thái "Kết nối lại".
- Bổ sung (D-012): `App.tsx` "Đang tải…" qua `t()` (dùng `navigator.language` bắt đầu `vi` → vi, khác → en khi chưa có state); đóng S4 T-2.14. Quản lý chụp webkit tab Đồng bộ (3 trạng thái: chưa kết nối / đã kết nối có danh sách lịch / "Kết nối lại") trước khi DONE — mở rộng `scripts/chup.cjs` thêm tab `sync` nếu cần (phạm vi thêm `scripts/chup.cjs`).
- Nhật ký: 2026-09-14 lượt 1: DONE (Sync.tsx, sync.ts thuần, action google, "Đang tải…" i18n, chup sync; 166×2, 32 e2e). Review (trước kiem-thu): xử lý hash OAuth + tự đồng bộ nằm trong Sync.tsx → chỉ chạy khi mở tab Đồng bộ (redirect về tab Preview không nhận token; TH1 không tự đồng bộ); Sync.tsx chép hằng `google_oauth_state` → trả thợ: đưa lên App qua hàm điều phối trong sync.ts, export `consumeState` ở oauth.ts, thêm unit test (Lần thử 1/3). Phạm vi thêm: `src/google/oauth.ts` (chỉ thêm export), `tests/unit/oauth.test.ts`, `tests/unit/sync.test.ts`. Lượt 2: `consumeState`, `handleAuthRedirect` + `autoSyncIfNeeded` gọi 1 lần ở App (token/lỗi → mở tab Đồng bộ), Sync.tsx chỉ UI; +13 test (177×2) → kiem-thu PASS (toàn bộ e2e repeat-each=2 64/64) → chụp 3 trạng thái bằng `scripts/chup.cjs sync`: đạt → commit. Lưu ý cho T-3.END: webkit — service worker nuốt fetch trước `page.route` (chup.cjs phải `serviceWorkers:'block'`).
- Model: sonnet · Lần thử: 1/3 · Trạng thái: DONE

### T-3.4 — Sửa lỗi từ soát chéo M3 (Gemini; Quản lý đã kiểm chứng)
- Nguồn: `docs/bao-cao/M3-soat-cheo.md` mục 1, 3, 5, 6. (Mục 2 PWA iOS + mục 4 webkit skip → Kiến trúc sư quyết khi duyệt M3.)
- Phạm vi file: `src/google/calendar.ts`, `src/google/oauth.ts`, `src/ui/sync.ts`, `src/ui/App.tsx`, `src/ui/screens/Sync.tsx`; test: `tests/unit/google-normalize.test.ts`, `tests/unit/oauth.test.ts`, `tests/unit/store.test.ts` (hoặc `tests/unit/sync.test.ts`), `tests/e2e/m3-google.spec.ts` (chỉ THÊM test), `tests/fixtures/google/*.json` (thêm fixture mới, không sửa fixture cũ).
- Yêu cầu:
  1. `normalize`: sự kiện cả ngày `start.date`..`end.date` (end LOẠI TRỪ, theo Google) → 1 `Occurrence` mỗi ngày; `id = <eventId>@<date>` cho MỌI occurrence Google (cả có giờ) — thống nhất quy ước T-2.1 (`id` duy nhất khi gộp nhiều lịch: nếu 2 lịch có cùng eventId thì thêm tiền tố lịch — tự chọn, ghi rõ trong comment); vẫn chặn trong [timeMin, timeMax] của `fetchEvents`; thiếu `end.date` → 1 ngày.
  2. `parseFragment`: bỏ `decodeURIComponent` thừa (URLSearchParams đã giải mã) → `#error=invalid_request%25` không ném lỗi.
  3. Chống đồng bộ trùng: một cờ/promise dùng chung trong `sync.ts` — tự đồng bộ đang chạy thì "Đồng bộ ngay" chờ chung (hoặc nút `sync-now` disabled + nhãn "Đang đồng bộ…"); không gọi fetch 2 lần song song.
- Tiêu chí: [ ] unit: all-day 14→17 (end exclusive) → 3 occurrence 14,15,16, id `…@2026-09-14` …; all-day không end → 1; khoảng vượt timeMax bị chặn; [ ] unit: `parseFragment('#error=invalid_request%25&state=s','s')` không ném, trả `{error:'invalid_request%'}`; [ ] unit: gọi đồng bộ 2 lần liên tiếp khi lần 1 chưa xong → fetch giả chỉ bị gọi 1 lượt; [ ] e2e thêm (m3-google): fixture sự kiện cả ngày 3 ngày → agenda (`__lastOps`) có tiêu đề đó ở 3 ngày; [ ] `npm run check` pass; test cũ chỉ thêm (kể cả fixture cũ không đổi).
- Lệnh kiểm tra: `npm run check`; `npx playwright test tests/e2e/m3-google.spec.ts --repeat-each=3`
- Nhật ký: 2026-09-14 PHẢN BIỆN 1 (id mới vỡ 2 assertion cũ) → CHẤP NHẬN có điều chỉnh (D-014). Lượt 1: DONE (normalize tách all-day + id `google-<cal>-<ev>@<date>` + range; bỏ decode thừa; `performSyncShared`/`isSyncing`; 4 test mới đều fail trước; sửa thêm store.test L254 cùng lý do D-014 — đã khai) → kiem-thu PASS (183×2, 39 e2e/1 skip cũ; full repeat-each=2 78/0; m2-events webkit ×6 12/12 — flake thợ báo KHÔNG tái hiện; mỗi tiêu chí có test cụ thể) → commit.
- Model: sonnet · Lần thử: 0/3 · Trạng thái: DONE

### T-3.END — Kiểm thử tích hợp M3
- Phạm vi file: `tests/e2e/m3-google.spec.ts`, `tests/fixtures/google/*.json`; sửa tích hợp nhỏ `src/**` phải khai báo.
- Tiêu chí: [ ] luồng mock OAuth + calendar như SPEC M3 (302 về `#access_token…&state=<từ query>` → chọn lịch → Đồng bộ → agenda có sự kiện fixture → offline + reload vẫn hiện → 401 → "Kết nối lại"); [ ] `Select-String -Path src -Pattern client_secret -Recurse` rỗng; [ ] `npm run check` pass, test M1–M2 không bị sửa/skip.
- Bổ sung (Quản lý 2026-09-14): `data-testid` từ T-3.3: `sync-clientid`, `sync-connect`, `sync-reconnect`, `sync-status`, `sync-calendar-list`, `sync-cal-<id>`, `sync-now`, `sync-last`, `sync-disconnect`, `sync-reauth-msg`. Luồng redirect: sau khi quay về app ở tab bất kỳ, App tự xử lý hash và mở tab Đồng bộ (T-3.3 lượt 2) — test phải khẳng định điều này (mở ở tab Preview mặc định). Tự đồng bộ khi mở app (cache > 30′) cũng nên có 1 test (đặt `fetchedAt` cũ qua IndexedDB, reload → request calendar được gọi).
  - Vướng đã biết: webkit — service worker nuốt fetch trước `page.route` (`scripts/chup.cjs` phải `serviceWorkers:'block'`), nhưng bước "offline + reload vẫn hiện" CẦN service worker. Thử theo thứ tự: (1) `context.route` thay `page.route`; (2) tách: phần mock chạy với `serviceWorkers:'block'`, phần offline chạy trong context cho phép SW, seed IndexedDB bằng cache từ fixture rồi `setOffline(true)` + reload; (3) nếu webkit vẫn không làm được bước offline → chỉ chromium cho bước đó bằng `test.skip(browserName==='webkit', '<lý do>')` NGAY TRONG test mới (khai báo, không đụng test cũ) — Quản lý duyệt. Không sửa `vite.config.ts`/SW để lách.
- Lệnh kiểm tra: `npm run check`; `npx playwright test tests/e2e/m3-google.spec.ts --repeat-each=3`
- Nhật ký: 2026-09-14 lượt 1: DONE (m3-google.spec + fixture events-sync ngày động; mock OAuth bằng trang HTML chuyển hướng vì webkit không fulfill 302; `test.skip(webkit)` riêng bước offline+reload; không sửa src) → kiem-thu PASS (check 37 pass/1 skip; repeat-each=3 15/0/3 skip) + tái hiện độc lập lỗi webkit offline (D-013) → commit.
- Model: sonnet · Lần thử: 0/3 · Trạng thái: DONE

---
## M4 — Ảnh nền & tùy biến, một chạm Shortcut, hướng dẫn

### T-4.0 — Thử kết nối Google trên iPhone thật (D-015) — cần Chủ dự án
- Mục tiêu: xác nhận luồng OAuth redirect trong PWA standalone iOS + offline trên máy thật trước khi viết Guide (T-4.4) và T-4.END.
- Người làm: Chủ dự án (thao tác trên iPhone + tài khoản Google/Netlify) · Quản lý (build `dist`, hướng dẫn từng bước, ghi kết quả). Không push git.
- Các bước: (1) Quản lý `npm run build` (VITE_BASE mặc định `/`) → thư mục `dist`. (2) Chủ dự án kéo thả `dist` vào https://app.netlify.com/drop (đăng nhập tài khoản free để site không bị xóa sau 1 giờ) → nhận URL `https://<tên>.netlify.app`. (3) Tạo Client ID theo SPEC §10A với origin `https://<tên>.netlify.app` và redirect `https://<tên>.netlify.app/`. (4) iPhone: Safari mở URL → Chia sẻ → Thêm vào MH chính → mở icon → Đồng bộ → dán Client ID → Kết nối.
- Quan sát (D-015): (A) Google mở trong-app (có nút Xong/Done) hay văng sang Safari; (B) quay về PWA + "Đã kết nối" + danh sách lịch, hay kẹt trong-app / báo lỗi state; (C) chọn lịch → Đồng bộ → Agenda có sự kiện thật; (D) Chế độ máy bay → đóng hẳn app → mở icon → app mở, còn sự kiện; (E) sau > 1 giờ: "Kết nối lại" có phải đăng nhập lại không.
- Kết quả ghi vào `docs/bao-cao/M4.md` mục "Thử máy thật". (B) thất bại → không đổi mã, Guide hướng dẫn dùng trong Safari (D-015). (D) thất bại → S2 tại T-4.END. Google chặn implicit → đổi SPEC, hỏi Chủ dự án.
- Không chặn T-4.1/4.3/4.5; T-4.4 và T-4.END chờ kết quả.
- 2026-09-14: Chủ dự án chọn "Để cuối M4" (D-016) → chạy sau T-4.4, trước T-4.END; gộp thêm bước đặt ảnh hình nền khóa thật (có đè đồng hồ/widget/nút?). Build lại `dist` ngay trước khi thử.
- 2026-09-14: `dist` mới (HEAD `dfb8ab9`) ở `E:\DuAn\lichkhoa-dist`; đã gửi Chủ dự án hướng dẫn từng bước (theo `docs/HUONG-DAN.md` mục "Bài thử trên iPhone").
- 2026-09-14: build lại `E:\DuAn\lichkhoa-dist` @ `f4f6098` (gồm T-4.7). Nếu Chủ dự án đã kéo bản cũ lên Netlify: kéo bản mới vào cùng site (Deploys → kéo thả) — Client ID giữ nguyên vì cùng URL.
- 2026-09-14: Chủ dự án thử xong (host URL GitHub). A, B, D, E ✔; hình nền không bị đè ✔; C ✔ trên hình nền nhưng tab Sự kiện không hiện sự kiện Google; Shortcut thỉnh thoảng báo `extensionKit.errorDomain error 2` (bấm lại được); yêu cầu mới: danh sách sự kiện/to-do dưới lưới Tháng. Chi tiết `docs/bao-cao/M4.md` mục 4.
- Trạng thái: DONE

### T-4.1 — Ảnh nền: nạp, EXIF, thu nhỏ, cover-fit, mờ, tối
- Phạm vi file: `src/render/background.ts` (mới: `loadPhoto(file, dev): Promise<Blob>`, `drawBackground(ctx, bg, design, dev)`), `src/render/wallpaper.ts`, `tests/unit/background.test.ts` (phần toán cover-fit thuần), `tests/fixtures/photo-4000x3000.jpg`.
- Tham khảo (chép/port được, xem docs/tham-khao-LICH_NEN.md): `F:/LICH_NEN/LichNen.js` L253–262 `drawCover`, `drawBackground` (toán cover-fit).
- Mục tiêu: `createImageBitmap(file,{imageOrientation:'from-image'})` fallback `<img>`; thu nhỏ ≤ 2× thiết bị; cover-fit; blur bằng hạ/tăng mẫu (không `ctx.filter`); dim bằng rect đen alpha.
- Tiêu chí: [ ] test cover-fit (tỉ lệ ngang/dọc); [ ] `npm run check` pass (kiem-thu chạy).
- Bổ sung (Quản lý 2026-09-14): `renderWallpaper(state, bg, today)` dùng `bg` khi `design.bg.kind==='photo'` và `bg` khác null (null → rơi về màu `bg.color`); thứ tự vẽ: ảnh (cover-fit) → mờ → tối → `buildOps`/paint. Toán cover-fit + tính kích thước thu nhỏ (≤ 2× thiết bị, giữ tỉ lệ) + bán kính/tỉ lệ hạ mẫu cho blur 0–3 tách thành hàm THUẦN để unit test; phần canvas giữ mỏng. `loadPhoto` trả Blob JPEG/PNG đã thu nhỏ. Fixture `photo-4000x3000.jpg` tự sinh (Playwright/canvas, ảnh gradient + chữ "TOP" ở mép trên để e2e kiểm hướng), dung lượng ≤ 1,5 MB. Mỗi yêu cầu → test; liệt kê trong báo cáo.
- Lệnh kiểm tra (thợ): `npx tsc --noEmit; npm run test` — KHÔNG build/e2e (T-4.3 song song dùng build + cổng). Được chạy Playwright chỉ để sinh fixture (không `vite preview`).
- Nhật ký: 2026-09-14 lượt 1: DONE (coverFit/fitDownscale/blurDownsampleRatio thuần + loadPhoto/drawBackground; fixture 78 KB có "TOP") → kiem-thu PASS (không `ctx.filter`; wallpaper.ts:48 dùng ảnh) → Quản lý dựng 4 ảnh có ảnh nền (scratchpad `mau-anh-nen.cjs`): cover-fit đúng hướng, blur/dim đúng; hộp đen `boxAlpha=1` che ảnh → T-4.2 (D-012) → commit.
- Model: sonnet · Lần thử: 0/3 · Trạng thái: DONE

### T-4.2 — Màn Thiết kế
- Phạm vi file: `src/ui/screens/Design.tsx`, `src/ui/App.tsx`, `src/ui/styles.css`, `src/core/i18n/*.json`, `src/render/layout/common.ts` (nếu cần áp font/scale/boxAlpha đồng nhất).
- Tham khảo (chép/port được, xem docs/tham-khao-LICH_NEN.md §6): `F:/LICH_NEN/lich-nen.html` L410–411 bảng màu `ACCENTS`, `EVENT_COLORS`; L184–237 các control Thiết kế (ảnh/màu/mờ/tối/font/vị trí — thêm `blur`); L66–68 `.seg` cho vị trí/font; L213–215 ô màu nhanh (swatches) + `<input type="color">`; L1396 `buildSwatches`. Số dòng do Gemini dẫn — thợ tự kiểm lại.
- Mục tiêu: chọn nền (ảnh/màu/gradient + chọn ảnh → `saveBg`), blur 0–3, dim 0–0.8, màu chữ/nhấn, font, vị trí, scale, boxAlpha, agendaDays; `data-testid` đầy đủ.
- Tiêu chí: [ ] `npm run check` pass; [ ] thao tác tay đổi từng tùy chọn → preview đổi.
- Bổ sung (Quản lý 2026-09-14):
  - `data-testid` (T-4.END dùng): `bg-kind-photo|solid|gradient` (segmented), `bg-file` (input file `accept="image/*"`), `bg-color`, `bg-color2`, `blur` (segmented 0–3: `blur-0..3`), `dim` (range 0–0.8 bước 0.1), `text-color`, `accent-color` (swatches `accent-<i>` + input color), `font-sans|serif|mono`, `position-top|middle|bottom`, `scale` (range), `box-alpha` (range 0–1), `agenda-days` (select 3/5/7/14).
  - Ảnh: chọn file → `loadPhoto(file, device)` (T-4.1) → `saveBg(blob)` → `setDesign({bg:{kind:'photo',…}})`; Preview hiện chỉ `loadBg()` lúc mount → cần cơ chế báo Preview nạp lại ảnh (vd. số `bgRev` trong store — không lưu vào backup — hoặc sự kiện tùy chỉnh); ảnh lớn không làm treo UI (hiện "Đang xử lý ảnh…").
  - `boxAlpha` (D-012): khi chuyển sang `photo` lần đầu mà `boxAlpha === 1` → đặt 0.35; màu đơn/gradient giữ nguyên. Kiểm hộp nền trong `layout/common.ts` dùng `boxAlpha` nhất quán cho mọi bố cục + dải note.
  - Nợ gộp: (1) S4 D-015 — `App.tsx` sau redirect kết nối thành công ép đồng bộ ngay (bỏ điều kiện cache > 30′ khi `authResult.ok`); (2) S4 T-3.3 — nút `sync-connect`/`sync-now` kiểu nút chính (accent). Phạm vi thêm: `src/ui/screens/Sync.tsx` (chỉ class nút), `src/ui/sync.ts` (nếu cần cho (1)), `tests/unit/sync.test.ts` hoặc `store.test.ts` (chỉ thêm).
  - Tham khảo: số dòng LICH_NEN do Gemini dẫn — thợ tự kiểm (grep `id="bg-`/`ACCENTS`/`.seg`/`swatch`) trước khi chép.
  - Chụp: thêm tab `design` vào `scripts/chup.cjs` (phạm vi thêm) — 2 ảnh (đầu màn + cuộn cuối); Quản lý xem + dựng hình nền có ảnh trước khi DONE.
  - e2e mới `tests/e2e/design.spec.ts`: đổi blur/dim/position/font → hash PNG preview đổi mỗi bước; tải `tests/fixtures/photo-4000x3000.jpg` → preview 1284×2778, `boxAlpha` thành 0.35.
- Lệnh kiểm tra: `npm run check`; `npx playwright test tests/e2e/design.spec.ts --repeat-each=3`
- Nhật ký: 2026-09-14 lượt 1: chạm trần 100 lượt → nhắc 1 lần → DONE (Design.tsx, force sync D-015, nút sync accent, chup design; ngoài phạm vi đã khai: `db.ts` lưu ArrayBuffer — D-017) → kiem-thu PASS (full e2e ×2 92 pass/8 skip) → chụp: đạt chức năng, hộp 0.35 trên ảnh đẹp; 3 điểm giao diện (rãnh range vô hình, input color webkit bị cắt, swatch chọn không viền) → tách T-4.6 → commit.
- Model: sonnet · Lần thử: 0/3 · Trạng thái: DONE

### T-4.3 — Sao chép + Đặt hình nền một chạm
- Phạm vi file: `src/export/share.ts`, `src/ui/screens/Preview.tsx`, `src/core/i18n/*.json`.
- Tham khảo: `F:/LICH_NEN/lich-nen.html` L1334–1360 `buildExportBlob/saveWallpaper` (luồng lưu ảnh), toast (Toast.tsx của T-2.7) cho lỗi clipboard/Shortcut.
- Mục tiêu: `copyPng` (ClipboardItem, trả false khi không hỗ trợ), `openShortcut(name)` → `shortcuts://run-shortcut?name=<enc>&input=clipboard` (khi `?test=1` ghi vào `window.__lastNav` thay vì điều hướng); nút "Sao chép", "Đặt hình nền" (copy → open), tên Shortcut cấu hình được; lỗi → thông báo + hướng dẫn thay thế.
- Tiêu chí: [ ] `npm run check` pass.
- Bổ sung (Quản lý 2026-09-14): `shortcutName` đã có trong `AppState` (mặc định `DatHinhNen`, SPEC §9) — ô cấu hình `shortcut-name` + nút `copy` ("Sao chép"), `set-wallpaper` ("Đặt hình nền") trên Preview, cạnh "Lưu ảnh"; nút "Đặt hình nền" là nút chính (accent), vẫn thấy không cần cuộn ở 428×926 cùng "Lưu ảnh" (test khóa `iphone13pm`). `copyPng` phải gọi `navigator.clipboard.write` ĐỒNG BỘ trong sự kiện chạm (Safari yêu cầu user activation — truyền `ClipboardItem({'image/png': promiseBlob})` nếu blob chưa sẵn). copy thất bại → toast + hướng dẫn "Lưu ảnh rồi dùng Shortcut với Get Latest Photos" (SPEC §8 rủi ro 2), không mở Shortcut. e2e (spec mới `tests/e2e/share.spec.ts`): chromium + `clipboard-write` → copy ghi `image/png`; `?test=1` → `__lastNav` bắt đầu `shortcuts://run-shortcut?name=DatHinhNen&input=clipboard`; tên Shortcut có dấu cách/tiếng Việt được encode. Phạm vi thêm `tests/e2e/share.spec.ts`, `src/ui/styles.css`.
- Lệnh kiểm tra: `npm run check` (chỉ phiếu này được build/e2e trong đợt song song T-4.1 ∥ T-4.3 ∥ T-4.5)
- Nhật ký: 2026-09-14 lượt 1: DONE (copyPng giữ user-activation, openShortcut + `__lastNav`, nút copy/set-wallpaper + shortcut-name; ngoài phạm vi đã khai: `store.ts` thêm `setShortcutName`; share.spec 4 test, webkit skip vì không cấp clipboard-write) → kiem-thu PASS (repeat-each=3 15/0/9 skip) → commit. Chưa chụp UI Preview mới — gộp vào ảnh chụp T-4.2.
- Model: sonnet · Lần thử: 0/3 · Trạng thái: DONE

### T-4.4 — Màn Hướng dẫn + HUONG-DAN.md
- Phạm vi file: `src/ui/screens/Guide.tsx`, `src/core/i18n/*.json`, `docs/HUONG-DAN.md`.
- Tham khảo: `F:/LICH_NEN/lich-nen.html` L320–325 khối trợ giúp (đặt màn hình khóa qua Ảnh → Dùng làm hình nền, thêm vào MH chính, nhắc giờ qua .ics); `F:/LICH_NEN/huong-dan-giai-doan-2.md` L61–68 các bước tạo Phím tắt — CHỈ lấy action "Set Wallpaper"; bỏ mọi bước Scriptable/"Run Script"/iCloud (LichKhoa dùng `input=clipboard`, SPEC mục 10 C).
- Mục tiêu: 4 phần (cài PWA, tạo Shortcut, Google OAuth Client ID, HTTPS/hosting) theo SPEC mục 10 + quy trình hằng ngày + giới hạn đã biết; VI (EN ngắn trong UI).
- Tiêu chí: [ ] HUONG-DAN.md có đủ 4 phần; [ ] `npm run check` pass.
- Bổ sung (Quản lý 2026-09-14, D-015/D-016): phần Google OAuth viết theo luồng PWA standalone (redirect trong scope) + khung "Nếu kết nối trong app Màn hình chính không quay về được: mở LichKhoa trong Safari (bookmark) để dùng Google — dữ liệu hai nơi tách nhau" và ghi chú "(chờ xác nhận trên máy thật — T-4.0)". Thêm mục **"Bài thử trên iPhone"** (checklist cho T-4.0/M4): (1) Netlify Drop hoặc GitHub Pages → URL; (2) tạo Client ID với đúng origin/redirect của URL đó; (3) Thêm vào MH chính → mở icon; (4) Đồng bộ → Kết nối → quan sát A–E (D-015); (5) "Đặt hình nền" → Shortcut chạy → hình nền khóa; kiểm lịch có bị đồng hồ/widget/nút đè; (6) Chế độ máy bay → đóng hẳn app → mở icon → app mở, còn sự kiện. Quy trình hằng ngày ≤ 3 chạm (SPEC §1c). "Giới hạn đã biết": token 1 giờ không tự gia hạn (D-015), không tự đổi hình nền không chạm, Safari xóa dữ liệu web thường sau 7 ngày không dùng nếu không cài PWA (SPEC §8.4), `.ics` nhắc giờ phải thêm từng sự kiện. Màn Guide trong app: 4–6 thẻ ngắn (VI đầy đủ, EN rút gọn) + nút mở nhanh tab Đồng bộ/Thiết kế nếu tiện; `data-testid="guide"`.
- Lệnh kiểm tra (thợ): `npx tsc --noEmit; npm run test` — KHÔNG build/e2e (T-4.6 song song). kiem-thu chạy `npm run check` sau.
- Nhật ký: 2026-09-14 lượt 1: DONE (Guide.tsx 6 thẻ + nút mở tab; HUONG-DAN.md A–D + hằng ngày + giới hạn + bài thử iPhone) → Quản lý sửa 3 câu HUONG-DAN + chuỗi `guide.googleBody` (trỏ "mục A HUONG-DAN.md" sai mục, người dùng không có file) → kiem-thu PASS (chung T-4.6) → commit 008eefd.
- Model: sonnet · Lần thử: 0/3 · Trạng thái: DONE

### T-4.5 — size.mjs + workflow GitHub Pages
- Phạm vi file: `scripts/size.mjs`, `.github/workflows/pages.yml`, `package.json` (thêm script `size`).
- Mục tiêu: `size.mjs` gzip từng file `dist/**/*.js`, in tổng, exit 1 nếu ≥ 150 KB. Workflow build với `VITE_BASE=/${{ github.event.repository.name }}/` và deploy Pages (không push — chỉ tạo file).
- Tiêu chí: [ ] `npm run build; node scripts/size.mjs` in tổng và exit 0.
- Bổ sung (Quản lý 2026-09-14): `size.mjs [thư-mục]` (mặc định `dist`) — để thợ kiểm được trên bản sao. Workflow: `actions/checkout`, `actions/setup-node` (Node 22, cache npm), `npm ci`, `npm run build` với `VITE_BASE`, `actions/upload-pages-artifact` (path `dist`), `actions/deploy-pages`; `permissions: pages: write, id-token: write`; chỉ chạy `workflow_dispatch` + push nhánh `main` (repo đang ở `master` → workflow không tự chạy; ghi chú trong file). KHÔNG chạy e2e trong workflow.
- Lệnh kiểm tra (thợ): KHÔNG `npm run build` (T-4.3 song song đang build) — sao chép `dist` hiện có ra thư mục tạm rồi `node scripts/size.mjs <tạm>` → in tổng + exit 0; thử thêm 1 thư mục giả > 150 KB → exit 1. Kiểm cú pháp YAML bằng `node -e` đọc file (không cần thư viện) hoặc mắt thường. kiem-thu chạy `npm run build; node scripts/size.mjs` sau.
- Nhật ký: 2026-09-14 lượt 1: DONE (size.mjs [dir], pages.yml workflow_dispatch + push main, script `size`) → kiem-thu PASS (build + size 32,86 KB exit 0; package.json chỉ thêm 1 script) → commit.
- Model: haiku · Lần thử: 0/3 · Trạng thái: DONE

### T-4.6 — Hoàn thiện giao diện màn Thiết kế (review ảnh chụp T-4.2)
- Nguồn: Quản lý chụp webkit 13 Pro Max (`scripts/chup.cjs design`) sau T-4.2.
- Phạm vi file: `src/ui/styles.css`, `src/ui/screens/Design.tsx`, `tests/e2e/design.spec.ts` (chỉ THÊM test). Không đổi `data-testid` đã có.
- Yêu cầu: (1) mọi `input[type=range]` (dim, scale, box-alpha): rãnh nhìn thấy được (màu rãnh tương phản nền, ví dụ #3a3a44; phần đã chọn = accent), thumb ≥ 28px, kèm nhãn giá trị hiện tại cạnh tiêu đề (dim "0.4", scale "1.0×", box-alpha "35%"); (2) `input[type=color]` (bg-color, bg-color2, text-color, accent-color): hiển thị ô màu ≥ 44×44px + mã hex bên cạnh; trên trình duyệt không hỗ trợ color (webkit Windows hiện thành ô chữ) vẫn đọc được trọn mã hex, không bị cắt; (3) swatch màu nhấn đang chọn có vòng viền rõ (kể cả swatch trắng trên nền tối — viền accent/ngoài 2px), `aria-pressed`.
- Tiêu chí: [ ] e2e: range có `getComputedStyle` rãnh khác màu nền (hoặc pseudo-element kiểm được); nhãn giá trị đổi khi kéo `dim` → "0.4"; swatch đang chọn có `aria-pressed="true"`; [ ] 428×926 không cuộn ngang; [ ] `npm run check` pass; [ ] Quản lý chụp lại `chup.cjs design`.
- Lệnh kiểm tra: `npm run check` (thợ duy nhất được build/e2e trong đợt T-4.4 ∥ T-4.6)
- Nhật ký: 2026-09-14 lượt 1: DONE (rãnh range + nhãn giá trị, hex, swatch viền + aria-pressed) → kiem-thu PASS nhưng full ×2 có 1 fail webkit `design.spec.ts:26` (click tab-design timeout) → Quản lý chạy `design.spec --project webkit --repeat-each=10`: :26 10/10 pass, NHƯNG test mới :86 fail 1/10 (nhãn `dim-value` không đổi sau `fill`) → trả thợ tìm nguyên nhân gốc (Lần thử 1/3). Lượt 2: nguyên nhân gốc = `store.subscribe` trong `useEffect` (sau paint) → dispatch ngay sau mount bị mất (bug thật, lặp T-1.END); sửa `useLayoutEffect`. Quản lý rà mọi màn: Sync.tsx cùng lỗi → tự sửa (useLayoutEffect + đọc lại state). Thợ phát hiện test trước đó chạy trên dist cũ (BAI-HOC) → kiem-thu PASS (design webkit ×20 40/0; full ×2 96/0/8 skip) → commit.
- Model: sonnet · Lần thử: 1/3 · Trạng thái: DONE

### T-4.7 — Sửa lỗi từ soát chéo M4 (Gemini; Quản lý đã kiểm chứng)
- Nguồn: `docs/bao-cao/M4-soat-cheo.md` mục 1, 4, 6, 10 (CÓ THẬT). Bác: #2 (build `VITE_BASE=/lichkhoa/` → manifest `scope/start_url` = `/lichkhoa/`, plugin tự lấy base), #7 (skip webkit hợp lệ D-013), #9 (giữ ảnh khi đổi sang màu là cố ý — đổi lại được). #3 (ClipboardItem cần Promise?) → máy thật T-4.0 xác nhận. #5 → S4. #8 → Quản lý sửa HUONG-DAN.
- Phạm vi file: `.github/workflows/pages.yml`, `src/ui/screens/Preview.tsx` (luồng Xóa dữ liệu), `src/ui/store.ts` (nếu cần tín hiệu nạp lại ảnh), `src/render/background.ts`, `src/render/wallpaper.ts`; test: `tests/e2e/settings.spec.ts` hoặc `tests/e2e/design.spec.ts` (chỉ THÊM), `tests/unit/*.test.ts` (chỉ thêm, nếu có phần thuần).
- Yêu cầu: (1) pages.yml `permissions` thêm `contents: read` (giữ `pages: write`, `id-token: write`); (2) "Xóa dữ liệu" (`wipe`) ngoài `resetAll` còn `saveBg(null)` và Preview thôi dùng ảnh cũ ngay (không cần reload); (3) `loadPhoto`/`drawBackground`: `ImageBitmap.close()` sau khi dùng xong; nhánh fallback `<img>` thu hồi `URL.createObjectURL` (`revokeObjectURL`); (4) `renderWallpaper` với ảnh: tô `bg.color` (hoặc đen nếu thiếu) trước khi vẽ ảnh → PNG trong suốt không lộ nền rỗng.
- Tiêu chí: [ ] e2e: đặt ảnh nền → `wipe` (chấp nhận confirm) → IndexedDB `lichkhoa:bg` rỗng/null và preview không còn ảnh (hash giống nền màu mặc định); [ ] grep `close()` trong background.ts ở mọi nhánh dùng ImageBitmap; [ ] pages.yml có `contents: read`; [ ] `npm run check` pass; `npm run build` trước khi chạy Playwright riêng.
- Lệnh kiểm tra: `npm run check`
- Nhật ký: 2026-09-14 lượt 1: DONE (pages.yml contents:read; closeImage; paintBackground trước ảnh; wipe → saveBg(null) + bgRef null; test #4 settings.spec:171 và #10 design.spec:111 fail trước) nhưng `loadPhoto` đổi MỌI ảnh sang PNG (ảnh chụp 2568×5556 → PNG hàng chục MB, SPEC §8.9) → trả thợ: PNG chỉ khi nguồn png/webp/gif, còn lại JPEG 0.9 (Lần thử 1/3). Lượt 2: `outputTypeFor` + quality 0.9, unit + e2e → kiem-thu PASS (full ×2 116/12 skip/0 fail; size 36,40 KB) → commit.
- Model: sonnet · Lần thử: 1/3 · Trạng thái: DONE

### T-4.8 — Bố cục Tháng + danh sách sự kiện/to-do bên dưới (SPEC v1.4, D-018)
- Mục tiêu: bố cục Tháng khi `design.monthList` bật (mặc định) thu lưới lại, dưới lưới vẽ danh sách: sự kiện từ hôm nay (Google + cục bộ, `agendaDays` ngày) + to-do chưa xong. Hình nền là ảnh tĩnh → cắt theo chỗ trống kèm dòng "+N … nữa", không cuộn.
- Phạm vi file (chỉ được sửa): `src/core/model.ts` (thêm `DesignConfig.monthList`, mặc định `true`, `normalizeState` bù `true`), `src/render/layout/month.ts`, `src/render/layout/common.ts` (chỉ THÊM hàm dùng chung nếu cần, không đổi hàm cũ), `src/core/i18n/vi.json` + `en.json` (chỉ thêm khóa), `src/ui/screens/Preview.tsx` (chỉ thêm công tắc), test: `tests/unit/layout-month-list.test.ts` (mới), `tests/unit/model.test.ts` (chỉ THÊM). Test khóa (layout-month, layout, wallpaper…) chỉ được sửa đúng chỗ fixture/`defaultDesign` thêm `monthList` — phải khai báo.
- Giao diện có sẵn: `RenderData.occurrences` (đã sắp, gồm Google — `collect.ts`), `RenderData.todos` (đã sắp theo `cmpTodo`, lọc `!done`), `groupAgenda(occ, today, c.agendaDays)`, `common.ts`: `mainArea`, `blockStartY`, `fontSize`, `fmtTime`, `truncate`, `todoDueLabel`, `dayLabel`; ô tick to-do: dùng lại cách vẽ trong `layout/todo.ts`.
- Tham khảo: `F:/LICH_NEN/LichNen.js` L388–391 (bố cục `month-agenda` = drawMonth + drawAgenda compact), L302–342 `drawAgenda` (cắt theo `maxY`, dòng "+N sự kiện nữa", to-do tối đa + "+N việc nữa"), L263–300 `drawMonth` (rowH thu nhỏ khi compact). Thợ tự kiểm số dòng.
- Yêu cầu:
  1. `monthList=false` → vẽ y như hiện tại (không đổi op nào của lưới).
  2. `monthList=true` → lưới Tháng chiếm ~56% chiều cao `mainArea` (hằng số có tên, chỉnh được), danh sách dùng phần còn lại; MỘT hộp nền (`boxAlpha`) bao cả lưới + danh sách, hộp ôm nội dung (ít mục thì hộp ngắn lại); `position` top/middle/bottom áp cho cả khối.
  3. Dòng sự kiện: chấm màu (`occ.color ?? accentColor`) + nhãn ngày ngắn ("Hôm nay" / "Mai" / "T4 16/9"; EN "Today"/"Tomorrow"/"Wed 9/16") + giờ (`fmtTime`, cả ngày = `events.allDay`) + tiêu đề `truncate`. Dòng to-do: ô tick + chữ `truncate` + nhãn hạn bên phải (`todoDueLabel`, quá hạn tô `accentColor`).
  4. Số dòng tối đa L = số dòng vừa phần còn lại (cỡ chữ ≈ `dev.width*0.032*scale`, cao dòng ≈ 1.6× cỡ chữ). Cả hai có mục: sự kiện được tối đa ⌈L/2⌉ dòng, to-do phần còn lại; bên nào không dùng hết thì nhường bên kia. Dòng "+N" (khóa mới `month.moreEvents` "+{n} sự kiện nữa" / "+{n} more events", `month.moreTodos` "+{n} việc nữa" / "+{n} more to-dos") nằm TRONG trần L. Không có gì → 1 dòng `agenda.empty`.
  5. Công tắc `data-testid="month-list"` (checkbox) ở Preview, cạnh công tắc `showLunar` (Preview.tsx ~L342), khóa i18n `preview.monthList` "Danh sách dưới lịch tháng" / "List under month".
- Tiêu chí nghiệm thu:
  - [ ] Unit `layout-month-list.test.ts`: 20 sự kiện + 10 to-do → số dòng danh sách ≤ L, có cả "+N sự kiện" và "+N việc", (đã hiện + N) = tổng; 0 to-do → sự kiện dùng hết L; 0 sự kiện + 3 to-do → hiện 3 to-do; to-do quá hạn có nhãn màu accent; không mục nào → có text `agenda.empty`.
  - [ ] Unit: mọi op nằm trong `mainArea` với thiết bị 1284×2778 và 1179×2556 × `showNote` bật/tắt × `showLunar` bật/tắt × `position` top/middle/bottom; `monthList=false` → không có text sự kiện/to-do nào; cỡ chữ số ngày khi có danh sách ≥ `dev.width*0.028`.
  - [ ] Unit `model.test.ts`: state thiếu `monthList` → `normalizeState` cho `true`.
  - [ ] `npx tsc --noEmit; npm run test` pass; test khóa chỉ đổi chỗ đã khai báo.
  - [ ] Quản lý dựng ảnh mẫu 1284×2778 (`scripts/mau-anh.cjs`) có/không danh sách, xem bằng mắt trước khi DONE.
- Lệnh kiểm tra (thợ): `npx tsc --noEmit; npm run test` — KHÔNG build/e2e (T-4.9 song song dùng build). kiem-thu chạy `npm run check` sau.
- Nhật ký: 2026-09-14 lượt 1: DONE (model `monthList`; month.ts tách `drawGrid`/`buildListRows`/`drawList`, `GRID_RATIO=0.62` thay 0.56 vì showNote bật làm số ngày < 0.028·W; i18n 3 khóa; công tắc `month-list`; unit layout-month-list mới + model +1; test khóa `layout-month.test.ts` thêm `monthList:false` 10 chỗ — đã khai báo, trong phạm vi D-018) — tsc OK, unit 206×2 TZ → kiem-thu PASS chung T-4.9 (`docs/test-log/T-4.8-4.9.txt`: check 206×2 unit, e2e 62/6 skip/0 fail; events ×3 54/0; size 37,40 KB; test khóa đúng D-018) → Quản lý review + ảnh mẫu (scratchpad `mau-t48/tong-month.png`: bố cục/cắt dòng/"+N"/Quá hạn ổn) nhưng `buildListRows` lấy cả to-do ĐÃ XONG (`d.todos` gồm done) → trả thợ lọc `!done` + test (Lần thử 1/3). Lượt 2: `d.todos.filter(!done)` + 2 test (FAIL trước khi sửa) → kiem-thu PASS (`docs/test-log/T-4.8.txt`: 208×2 unit, e2e 62/6 skip/0 fail, size 37,39 KB) → commit.
- Model: sonnet · Lần thử: 1/3 · Trạng thái: DONE

### T-4.9 — Tab Sự kiện hiện sự kiện Google (chỉ xem) (SPEC v1.4, D-018)
- Mục tiêu: lịch nhỏ + danh sách ngày trong tab Sự kiện hiện cả sự kiện Google từ `state.google.cache` (chấm màu lịch + mục trong danh sách), chỉ xem.
- Phạm vi file (chỉ được sửa): `src/ui/screens/events/EventsTab.tsx`, `src/ui/styles.css` (chỉ thêm class nhãn), `src/core/collect.ts` (CHỈ thêm `export` cho `cmpOccurrence` nếu chưa export), `tests/e2e/events.spec.ts` (chỉ THÊM test). KHÔNG sửa i18n (nhãn "Google" là tên riêng, viết thẳng).
- Giao diện có sẵn: `EventsTab.tsx:59` `monthOcc = expandOccurrences(state.events, monthFrom, monthTo)`; `state.google.cache?.events: Occurrence[]` (`source: 'google'`, có `color`); `cmpOccurrence` trong `core/collect.ts`.
- Yêu cầu: (1) `monthOcc` = cục bộ đã expand + sự kiện cache Google có `date` trong [monthFrom, monthTo], sắp bằng `cmpOccurrence`; (2) chấm trên ô ngày tính cả Google (giữ trần 3 chấm); (3) mục Google trong danh sách ngày: phần tử KHÔNG bấm được (không phải `<button>`, không mở sheet), `data-testid="ev-item-google"`, thanh màu lịch + giờ/"Cả ngày" + tiêu đề + nhãn nhỏ "Google" (class mới trong styles.css); mục cục bộ giữ nguyên `ev-item` và vẫn mở sheet sửa; (4) không có cache → như cũ.
- Tiêu chí nghiệm thu:
  - [ ] e2e mới trong `events.spec.ts` (chromium + webkit): state có `google.cache` gồm 1 sự kiện hôm nay + 1 sự kiện cả ngày 3 ngày sau (nạp bằng cách các test hiện có đang dùng — thợ tự tìm, ví dụ nhập JSON sao lưu hoặc ghi IndexedDB trước khi tải trang) → ô hôm nay có `.cal-dot`; danh sách hôm nay có `ev-item-google` chứa tiêu đề + "Google"; bấm vào không mở sheet (`ev-cancel` không hiện); chọn ngày +3 → hiện sự kiện cả ngày; thêm 1 sự kiện cục bộ cùng ngày → cả hai cùng hiện, mục cục bộ vẫn mở sheet.
  - [ ] 428×926 không cuộn ngang.
  - [ ] `npx tsc --noEmit; npm run test; npm run build; npx playwright test tests/e2e/events.spec.ts` pass.
- Lệnh kiểm tra (thợ): như tiêu chí cuối (phiếu duy nhất được build/e2e trong đợt T-4.8 ∥ T-4.9).
- Nhật ký: 2026-09-14 lượt 1: DONE (collect.ts export `cmpOccurrence`; EventsTab gộp Google, `ev-item-google` div không bấm + nhãn; styles `.ev-item-google`/`.ev-tag-google`; events.spec +2 test, seed IDB kèm `device`) — thợ tự chạy: tsc OK, unit 198, build OK, events.spec 18 pass → kiem-thu PASS chung T-4.8 (`docs/test-log/T-4.8-4.9.txt`; events ×3 54/0) → Quản lý review diff: đúng phiếu → commit.
- Model: sonnet · Lần thử: 0/3 · Trạng thái: DONE

### T-4.10 — Ghim ghi chú thì tự hiện trên hình nền (thử máy thật lần 2)
- Nguồn: Chủ dự án 2026-09-14: "Bật ghim ghi chú nhưng trên hình nền không thấy". Quản lý xác minh: `store.ts:110` `pinNote` chỉ đổi `pinned`; hình nền còn cần `design.showNote` (mặc định `false`, công tắc `note-show` ở đầu tab Ghi chú — `NoteTab.tsx:69–80`); `layoutNote` trả `[]` khi `!showNote` (`note.ts:8`). Nút tên "Ghim lên hình nền" nhưng không đủ để lên hình nền → lỗi UX.
- Mục tiêu: ghim một ghi chú (`pinNote` với `pinned: true`, từ mọi đường: lưu sheet có bật `nt-pin`) → `design.showNote` tự thành `true`. Bỏ ghim không tự tắt `showNote`. Người dùng vẫn tắt được `note-show` sau đó.
- Phạm vi file (chỉ được sửa): `src/ui/store.ts` (reducer `pinNote`), `tests/unit/store.test.ts` (chỉ THÊM), `tests/e2e/notes.spec.ts` (chỉ THÊM).
- Tiêu chí nghiệm thu:
  - [ ] Unit: state `showNote=false` → `pinNote(id, true)` → `showNote=true`, note được ghim; `pinNote(id, false)` → `showNote` giữ nguyên; `showNote=true` sẵn → không đổi gì khác.
  - [ ] e2e (chromium + webkit): dữ liệu mới (showNote mặc định false) → tab Sự kiện → Ghi chú → thêm ghi chú có tiêu đề + nội dung, bật `nt-pin`, lưu → công tắc `note-show` đang bật và `window.__lastOps` (`?test=1`) chứa tiêu đề ghi chú. Test viết trước, phải FAIL trên code cũ.
  - [ ] `npm run check` pass; test cũ không sửa.
- Lệnh kiểm tra: `npx tsc --noEmit; npm run test; npm run build; npx playwright test tests/e2e/notes.spec.ts`
- Nhật ký: 2026-09-14 lượt 1: PHẢN BIỆN — test cũ `notes.spec.ts:33` `note-show.click()` sau khi ghim giờ tắt công tắc → CHẤP NHẬN `.check()` (D-020); Chủ dự án trả `vite.config.ts` về env → DONE (209 unit, notes 4/4) → kiem-thu REGRESSION `m2-events.spec.ts:72` cùng nguyên nhân (phiếu thiếu grep `note-show` — BAI-HOC) → D-020 bổ sung, trả thợ (Lần thử 1/3) → lượt 2 DONE → kiem-thu PASS (`docs/test-log/T-4.10.txt`: check 64/6 skip/0 fail; notes+m2-events ×3 24/0) → commit.
- Model: sonnet · Lần thử: 1/3 · Trạng thái: DONE

### T-4.END — Kiểm thử tích hợp M4
- Phạm vi file: `tests/e2e/m4-design.spec.ts`, `tests/e2e/m4-export.spec.ts`, `tests/e2e/m4-offline.spec.ts`; sửa tích hợp nhỏ `src/**` phải khai báo.
- Tiêu chí: [ ] tải ảnh fixture → preview đổi, kích thước bằng thiết bị; blur=2, dim=0.4, position=bottom, font=serif → hash PNG khác sau mỗi bước; `__lastOps` trong vùng an toàn; [ ] chromium + `clipboard-write`: "Sao chép" ghi `image/png`; "Đặt hình nền" → `__lastNav` bắt đầu `shortcuts://run-shortcut?name=`; [ ] offline reload vẫn mở app (webkit: xem D-013 — thử cách khác trước khi skip); [ ] size < 150 KB; [ ] `npm run check` pass chromium + webkit; [ ] bài thử tay iPhone (HUONG-DAN) có bước Chế độ máy bay → mở icon → app mở, còn sự kiện Google cache (D-013).
- Lệnh kiểm tra: `npm run check; node scripts/size.mjs`
- Bổ sung (Quản lý 2026-09-14): chạy phần TỰ ĐỘNG ngay (song song việc Chủ dự án thử iPhone T-4.0); duyệt M4 chờ cả hai. `data-testid` có sẵn: Design (`bg-kind-*`, `bg-file`, `blur-0..3`, `dim`, `font-*`, `position-*`, …), Preview (`copy`, `set-wallpaper`, `shortcut-name`, `save`, `preview`). Offline webkit (D-013): thử (1) sau `serviceWorker.ready`, trong page `await caches.match('/')`/`caches.match('index.html')` phải có; (2) `context.setOffline(true)` + `page.goto(url)` (không `reload`) — nếu vẫn "internal error" thì `test.skip(webkit)` riêng bước reload có lý do + giữ khẳng định (1) cho webkit. Luôn `npm run build` trước khi chạy Playwright riêng lẻ (BAI-HOC). Không trùng lặp test đã có ở `design.spec`/`share.spec` — `m4-*` là LUỒNG ĐẦU-CUỐI: ảnh → tùy chỉnh → xuất/sao chép/đặt hình nền → offline mở lại.
- Nhật ký: 2026-09-14 lượt 1: DONE (m4-design, m4-export, m4-offline; webkit `caches.match` pass, offline goto vẫn lỗi engine → skip D-013; không sửa src; size 36,27 KB) → kiem-thu PASS (m4 ×3 12/6 skip; full ×2 104/12 skip/0 fail; test M1–M3 không đổi từ M3-ok) → commit.
- Model: sonnet · Lần thử: 0/3 · Trạng thái: DONE

---
## Bảo trì 2026-09-15 (D-023) — làn Gemini v2 NHIỀU
Thứ tự: B-001 (Gemini) → B-002 (sonnet). Không song song (Gemini và thợ Claude không ghi cùng lúc).

### B-001 — Hook `useStoreState` thay mọi `store.subscribe` trong UI (D-021 băn khoăn 2)
- Mức: S4 (phòng ngừa). Nguyên nhân gốc đã lặp 2 lần (T-1.END Preview, T-4.6 Design): màn tự `useState(store.getState())` + subscribe trong `useEffect` (chạy sau paint) → dispatch ngay sau mount bị lọt. `Events.tsx:19–22` vẫn còn mẫu lỗi này.
- Mục tiêu: một hook duy nhất đăng ký store; màn hình không gọi `store.subscribe` trực tiếp; test chặn tái phạm.
- Phạm vi file (chỉ được sửa): `src/ui/useStoreState.ts` (mới), `src/ui/App.tsx`, `src/ui/screens/Preview.tsx`, `src/ui/screens/Events.tsx`, `src/ui/screens/Design.tsx`, `src/ui/screens/Sync.tsx`, `tests/unit/store-subscribe-guard.test.ts` (mới). KHÔNG sửa `src/ui/store.ts`, không sửa test cũ.
- Giao diện / đầu vào có sẵn: `Store` trong `src/ui/store.ts:142–146` (`getState`, `dispatch`, `subscribe` trả hàm hủy) — giữ nguyên.
- Yêu cầu:
  - `useStoreState.ts` export đúng chữ ký (overload): `useStoreState(store: Store): AppState` và `useStoreState(store: Store | null): AppState | null`. Cài đặt: `useState(() => store?.getState() ?? null)`; `useLayoutEffect` (KHÔNG `useEffect`) phụ thuộc `[store]`: nếu có store → `setState(store.getState())` (bắt dispatch lọt giữa render và đăng ký) rồi `return store.subscribe(setState)`. Comment ngắn giải thích vì sao useLayoutEffect + đọc lại.
  - `Preview.tsx`, `Events.tsx`, `Design.tsx`, `Sync.tsx`: bỏ cặp `useState(store.getState())` + effect subscribe, thay `const state = useStoreState(store);`. Bỏ import hook không còn dùng. Không đổi gì khác.
  - `App.tsx` (L52–57): thay effect đọc `lang` bằng `useStoreState(store)` (store có thể null) — giữ nguyên hành vi hiện tại khi store chưa nạp (dùng đúng giá trị mặc định `lang` đang có). Không đụng effect boot/redirect Google (L59+).
  - `store-subscribe-guard.test.ts` (Vitest, môi trường node, dùng `node:fs`/`node:path`): duyệt đệ quy mọi `.ts`/`.tsx` trong `src/`; khẳng định chuỗi `.subscribe(` chỉ xuất hiện trong `src/ui/store.ts` và `src/ui/useStoreState.ts`; thông báo lỗi nêu tên file vi phạm. Thêm 1 test khẳng định `src/ui/useStoreState.ts` chứa `useLayoutEffect` và không chứa `useEffect(`.
- Tiêu chí nghiệm thu:
  [ ] `grep -rn "\.subscribe(" src` chỉ ra `src/ui/store.ts` và `src/ui/useStoreState.ts`.
  [ ] `store-subscribe-guard.test.ts` pass cả 2 TZ; nếu tạm thêm `store.subscribe(` vào một màn thì test fail (thợ tự thử rồi hoàn tác, ghi trong báo cáo).
  [ ] `npx tsc --noEmit` sạch; `npm run check` pass toàn bộ (unit ×2 TZ + e2e chromium/webkit), không test cũ nào bị sửa/skip.
- Lệnh kiểm tra: `npm run check`
- Nhật ký: 2026-09-15 vòng 1 (phiên 1) chết khi dừng phiên → `huy`, giao lại. Vòng 1 (phiên 2, worktree): Gemini XONG 6 phút nhưng agy ghi 7 file vào checkout chính thay vì worktree → kiem-thu báo LỖI MÔI TRƯỜNG (không tính Lần thử) → Quản lý chép 7 file sang worktree, trả checkout chính về HEAD (BAI-HOC 2026-09-15). kiem-thu PASS (tsc; 211×2 unit; e2e 64 pass/6 skip, khớp mốc; guard 2/2 ×2 TZ; diff đúng phạm vi) → review đạt (App re-render theo mọi dispatch thay vì chỉ `lang` — chấp nhận, đúng phiếu) → commit.
- Model: gemini (làn code) · Lần thử: 0/3 · Trạng thái: DONE

### B-002 — webkit Windows: ô màu hiện mã hex lần 2 (S4 T-4.6)
- Mức: S4. Triệu chứng: màn Thiết kế trên Playwright webkit (Windows), `input[type=color]` tự in chữ kiểu "#00000(" bên cạnh `span.color-hex` → mã màu hiện 2 lần, chữ trong ô bị cắt. iPhone thật có ô màu nên không bị.
- Mục tiêu: trên webkit Windows ô màu chỉ hiện ô màu (hoặc ô trống có viền), không hiện chữ; mã hex chỉ hiện ở `span.color-hex`. Chromium và iPhone không đổi giao diện.
- Phạm vi file (chỉ được sửa): `src/ui/styles.css` (khối `.color-row` ~L977–990). Nếu CSS không đủ mà phải sửa markup → PHẢN BIỆN trước, không tự sửa `Design.tsx`.
- Giao diện / đầu vào có sẵn: `Design.tsx` L126–236 (4 cặp `input[type=color]` + `span.color-hex`, testid `bg-color-hex`, `bg-color2-hex`, `text-color-hex`, `accent-color-hex`); công cụ chụp webkit `scripts/chup.cjs` (cách dùng: `scripts/README-cong-cu.md`; cần `npm run build` trước).
- Tiêu chí nghiệm thu:
  [ ] Ảnh chụp webkit màn Thiết kế trước/sau (lưu `docs/test-log/B-002-truoc.png`, `B-002-sau.png`, trong `docs/test-log/` không tính vào phạm vi): trong ô màu không còn chữ; ô vẫn thấy màu hoặc viền, vùng chạm ≥ 44px.
  [ ] Ảnh chụp chromium màn Thiết kế sau sửa: ô màu vẫn hiện màu như trước.
  [ ] `npm run check` pass, không sửa test.
- Lệnh kiểm tra: `npm run check`
- Nhật ký: 2026-09-15 lượt 1: DONE (`.color-input`: `color: transparent; font-size: 0`, nền `none` → `rgba(255,255,255,0.12)`; ảnh `docs/test-log/B-002-truoc.png`, `-sau.png`, `-sau-chromium.png`) → kiem-thu PASS (211×2 unit; e2e 64/6 skip/0 fail; T-4.6 `design.spec.ts:79` pass 2 trình duyệt; chỉ styles.css +10/−1) → review ảnh đạt: webkit hết chữ trong ô (ô xám 44px), chromium vẫn hiện đúng màu. Ghi nhận: nền 0.12 lộ qua padding mặc định của `::-webkit-color-swatch-wrapper` → Chromium (có lẽ cả iPhone) có thêm viền mờ bo góc quanh ô màu — chấp nhận (thẩm mỹ, cùng tông nút); Chủ dự án xem trên máy thật, không thích thì đổi lại `background: none` (1 dòng) → commit.
- Model: sonnet (không đủ điều kiện Gemini: tiêu chí chính kiểm bằng mắt, không có lệnh test tự động) · Lần thử: 0/3 · Trạng thái: DONE

---
## M5 — Bố cục Tuần giống app Inks (SPEC v1.5, D-024)
Mẫu: `docs/tham-khao/inks-tuan.PNG`. Thứ tự: 5.1 → 5.2 → 5.3 → 5.END (tuần tự: 5.2 cần hợp đồng 5.1; 5.3 cần `buildOps` của 5.2; Gemini không ghi cùng lúc thợ Claude).

### T-5.1 — Lõi: `Occurrence.endTime` + dữ liệu đủ cả tuần
- Mục tiêu: sự kiện có giờ kết thúc (để chip hiện "06:00 - 06:40" như Inks); dữ liệu render và cache Google phủ đủ tuần chứa hôm nay; hợp đồng `layout: 'week'` có sẵn cho T-5.2/5.3.
- Phạm vi file (chỉ được sửa): `src/core/model.ts`, `src/core/recurrence.ts`, `src/google/calendar.ts` (chỉ `normalize`), `src/core/collect.ts`, `src/ui/sync.ts` (chỉ `syncRange`), `tests/unit/recurrence.test.ts`, `tests/unit/collect.test.ts`, `tests/unit/google-normalize.test.ts`, `tests/unit/store.test.ts` (CHỈ test `syncRange` L251–252 — khai báo).
- Giao diện / đầu vào có sẵn: SPEC v1.5 §5 (`Occurrence.endTime?`, `DesignConfig.layout` có `'week'`), §3 IN-5, §9.
- Yêu cầu:
  - `model.ts`: `Occurrence.endTime?: string` ('HH:mm'); `DesignConfig.layout: 'month'|'agenda'|'todo'|'week'`. Không đổi gì khác (`normalizeState` không kiểm layout — giữ).
  - `recurrence.ts` `expandOccurrences`: có `time` và `durationMin > 0` → `endTime = time + durationMin`; tổng ≥ 24:00 (qua nửa đêm) → không đặt `endTime`. Không có `durationMin` → không đặt.
  - `calendar.ts` `normalize`: sự kiện `start.dateTime` có `end.dateTime` → `endTime` giờ địa phương 'HH:mm' khi ngày địa phương của end = ngày của start và end > start; ngược lại không đặt. All-day không đặt.
  - `collect.ts`: expand sự kiện local từ `min(ngày 1 tháng chứa today, today − 6 ngày)` (so chuỗi ISODate) để tuần bắt đầu ở tháng trước vẫn có sự kiện; cập nhật comment. Phần còn lại giữ nguyên.
  - `sync.ts` `syncRange`: `[today − 7, today + 60]`; sửa comment; test L251–252 đổi đúng giá trị mong đợi (`'2026-03-03'`) + tên test.
  - Test khóa khác so `toEqual` nguyên `Occurrence` mà nay có thêm `endTime` → chỉ được thêm `endTime` vào giá trị mong đợi, khai báo từng dòng; thấy phải sửa nhiều hơn → PHẢN BIỆN.
- Tiêu chí nghiệm thu:
  [ ] recurrence: 09:00 + 40 → `endTime '09:40'`; 23:30 + 60 → không có `endTime`; không `durationMin` → không có; sự kiện lặp mọi occurrence cùng `endTime`.
  [ ] google-normalize: dateTime 06:00–06:40 cùng ngày → `endTime '06:40'` (cả 2 TZ — dựng chuỗi RFC3339 theo offset máy hoặc kiểm bằng `new Date` địa phương như test cũ); end sang ngày sau → không có; all-day → không có.
  [ ] collect: today `2026-09-01` (T3), sự kiện không lặp ngày `2026-08-31` → có trong `occurrences`; sự kiện ngày `2026-08-25` (ngoài tuần, trước đầu tháng > 6 ngày) → không có.
  [ ] `syncRange('2026-03-10')` → `{ timeMin: '2026-03-03', timeMax: '2026-05-09' }`.
  [ ] `npm run check` pass; test khóa chỉ đổi đúng chỗ đã khai.
- Lệnh kiểm tra: `npx tsc --noEmit; npm run test` rồi `npm run check`
- Nhật ký: 2026-09-15 lượt 1: DONE (endTime local/Google, collect từ min(đầu tháng, today−6), syncRange −7; test khóa đổi đúng 2 chỗ đã khai: google-normalize thêm `endTime` vào expected, store.test syncRange) → kiem-thu PASS (tsc sạch, unit 219×2, e2e 64/6 skip) → review đạt → commit.
- Model: sonnet (đổi hợp đồng dùng chung → không giao Gemini) · Lần thử: 0/3 · Trạng thái: DONE

### T-5.2 — `layoutWeek`: hình nền bố cục Tuần giống Inks
- Mục tiêu: `layoutWeek(d, c, dev): DrawOp[]` thuần, nhìn giống mẫu `docs/tham-khao/inks-tuan.PNG` (thợ mở ảnh bằng Read).
- Phạm vi file (chỉ được sửa): `src/render/layout/week.ts` (mới), `src/render/layout/common.ts` (chỉ THÊM helper, không đổi helper cũ), `src/render/wallpaper.ts` (`buildOps`: `'week'` → `layoutWeek`), `src/core/i18n/vi.json`, `src/core/i18n/en.json` (khóa mới nếu cần, 2 file khớp), `scripts/mau-anh.cjs` (thêm `'week'` + dữ liệu mẫu có sự kiện nhiều ngày trong tuần, có giờ kết thúc, to-do có hạn/quá hạn), `tests/unit/layout-week.test.ts` (mới).
- Giao diện / đầu vào có sẵn: T-5.1 (`endTime`, `layout: 'week'`); `common.ts`: `weekdayLabels`, `safeArea`, `blockStartY`, `fontSize`, `mainArea`, `noteArea`, `fmtTime`, `lunarCellLabel`, `truncate`, `wrapText`, `todoDueLabel`; cách vẽ hộp `boxAlpha`, lề, co chữ: xem `agenda.ts`, `month.ts`. SPEC v1.5 §3 IN-2 (mô tả Tuần).
- Yêu cầu:
  - Ngày: 7 ngày của tuần chứa `d.today` theo `c.weekStart` (1: T2…CN, 0: CN…T7) — helper `weekDates(today, weekStart): ISODate[]` trong common.ts.
  - Mục mỗi ngày theo thứ tự: sự kiện cả ngày → sự kiện có giờ (thứ tự `d.occurrences`) → to-do chưa xong `due === ngày`; riêng cột hôm nay: to-do chưa xong `due < today` (quá hạn) đứng trước to-do đúng hạn. To-do không `due` và to-do đã xong không hiện.
  - Khối (dải tuần + danh sách hôm nay) nằm trọn trong `mainArea(dev, c)`, đặt theo `position` (`blockStartY`); hộp nền `boxAlpha` như các bố cục khác (0 → không vẽ); lề ngang như agenda/month.
  - Dải tuần: 7 cột bằng nhau, khe nhỏ. Đầu cột căn giữa: thứ viết tắt (`weekdayLabels`) rồi số ngày dương (không số 0 đầu), `textColor`; hôm nay weight 700. `showLunar` → thêm số âm nhỏ (`lunarCellLabel`) dưới số dương; `false` → không op âm lịch nào.
  - Cột hôm nay: 1 rect bo góc `accentColor`, alpha ≈ 0.25, phủ từ đỉnh đầu cột tới đáy dải chip (như Inks).
  - Chip: rect bo góc gần rộng bằng cột; fill `pastel(màu)` = trộn màu với trắng ~55–65% (helper trong common.ts; không có màu → nền mặc định `#60a5fa`); to-do fill pastel vàng cố định (vd `#fde68a`). Chữ chip màu tối cố định (vd `#1c1c1e`), căn trái, 2 dòng: dòng 1 giờ `"HH:mm - HH:mm"` (hour12: `"6:00 - 6:40 AM"`; không vừa → chỉ giờ bắt đầu; không `endTime` → giờ bắt đầu; cả ngày → `t('events.allDay')`); to-do dòng 1 `"☐"` + (quá hạn: nhãn Quá hạn màu đỏ tối, vd `#b42318`); dòng 2 tên, `truncate` "…". Cỡ chữ chip ≥ 24 px ở 1284×2778, scale 1 (qua `fontSize`).
  - ≤ 4 mục → vẽ hết; > 4 → 3 chip + chip thứ 4 `"+N"` (N = tổng − 3), fill trung tính (vd `textColor` alpha thấp), chữ căn giữa. Chiều cao dải = đầu cột + số slot lớn nhất của tuần (tối thiểu 1) × chip; ngày trống không vẽ chip.
  - Danh sách hôm nay dưới dải (cách một khoảng rõ): mỗi mục = vạch màu dọc bên trái (rect hẹp bo góc, cùng màu pastel của chip), tên cỡ lớn (≥ 40 px ở 1284, weight 700, `textColor`, `truncate`), dòng 2 nhỏ hơn: sự kiện `"◷ "` + giờ như chip (cả ngày → `t('events.allDay')`); to-do: `todoDueLabel` (quá hạn tô `accentColor` — IN-10). Không đủ chỗ → cắt, dòng cuối `"+N"` (i18n). Hôm nay không có mục → một dòng trạng thái rỗng (khóa rỗng có sẵn nếu hợp).
  - Tràn `mainArea` (máy nhỏ / scale lớn / `showNote`): giữ dải tuần, co danh sách hôm nay (có thể chỉ còn "+N"); vẫn tràn → giảm số slot chip (giữ quy tắc "+N"). Không op nào ra ngoài `mainArea`.
  - Xem bằng mắt trước khi báo DONE: `npm run build` → `node scripts/mau-anh.cjs docs/test-log/T-5.2` → mở ảnh Tuần 1284×2778 bằng Read, đối chiếu mẫu Inks, chỉnh tới khi giống; báo cáo ghi đường dẫn ảnh.
- Tiêu chí nghiệm thu:
  [ ] `layout-week.test.ts` (2 TZ): 7 nhãn đầu cột đúng thứ tự cho `weekStart` 1 và 0; today `2026-09-01` weekStart 1 → cột đầu là 31/8.
  [ ] Ngày có 6 mục → đúng 3 chip mục + chip "+3"; ngày có 4 mục → 4 chip, không "+N".
  [ ] To-do quá hạn chưa xong nằm ở cột hôm nay; to-do không hạn / đã xong không có op nào; chip sự kiện có `endTime` chứa "09:00 - 09:40".
  [ ] Rect tô cột hôm nay có `fill === accentColor`, nằm đúng cột hôm nay.
  [ ] Danh sách hôm nay: 2 mục → có đủ 2 tên; 30 mục → có dòng "+N" và (số hiện + N) = 30.
  [ ] `showLunar` true có op âm lịch, false không có.
  [ ] Mọi op trong `mainArea` với 1284×2778 và 1179×2556 × 3 `position` × `showNote` × `showLunar`; `showNote` → bbox khối Tuần không giao bbox `layoutNote`.
  [ ] `npm run check` pass; ảnh `docs/test-log/T-5.2/…` 1284×2778 đã dựng (Quản lý xem bằng mắt khi review).
- Lệnh kiểm tra: `npx tsc --noEmit; npm run test` rồi `npm run check`
- Nhật ký: 2026-09-15 lượt 1: DONE (week.ts, common +weekDates/+pastel, i18n +week.todayEmpty/+week.more, mau-anh +week; 227×2 unit) → kiem-thu PASS. Review ảnh `docs/test-log/T-5.2/week-note0-2.png`: bố cục giống Inks, nhưng ở 1284×2778 chip LUÔN chỉ hiện giờ bắt đầu ("08:00") — chữ chip 24 px + "08:00 - 08:40" 13 ký tự > cột ~136 px → mất đặc trưng khoảng giờ của Inks → trả thợ (Lần thử 1/3). Lượt 2: dòng giờ cỡ riêng ~0.85× (≥ 20 px @1284), ước lượng 0.55×size, "HH:mm - HH:mm" → "HH:mm-HH:mm" → giờ bắt đầu; khe cột 0.008; +1 test → kiem-thu PASS (báo nhầm 219/20 file; Quản lý tự chạy: 228×2, 21 file) → review ảnh đạt (mọi chip có khoảng giờ, không tràn) → commit (ảnh mẫu giữ `docs/test-log/T-5.2/week-note0-2.png`, `week-note1-15.png`).
- Model: sonnet (tiêu chí chính "giống Inks" kiểm bằng mắt — như B-002, không giao Gemini) · Lần thử: 1/3 · Trạng thái: DONE

### T-5.3 — Chọn bố cục "Tuần" trong app
- Mục tiêu: người dùng chọn được bố cục Tuần ở màn Xem trước; lựa chọn được lưu.
- Phạm vi file (chỉ được sửa): `src/ui/screens/Preview.tsx` (mảng `LAYOUTS` L20–24: thêm `{ id: 'week', testid: 'layout-week', key: 'settings.layoutWeek' }` cuối mảng), `src/core/i18n/vi.json` (`"settings.layoutWeek": "Tuần"`), `src/core/i18n/en.json` (`"settings.layoutWeek": "Week"`), `tests/e2e/week.spec.ts` (mới).
- Giao diện / đầu vào có sẵn: T-5.1 (`layout: 'week'`), T-5.2 (`buildOps` vẽ Tuần); cách viết E2E và `?test=1` / `window.__lastOps`: xem `tests/e2e/settings.spec.ts` (test "Preview: chọn bố cục…").
- Tiêu chí nghiệm thu:
  [ ] `week.spec.ts` (chromium + webkit): mở `?test=1` → bấm `layout-week` → nút ở trạng thái chọn giống các nút bố cục khác; preview `naturalWidth` 1284 / `naturalHeight` 2778; `__lastOps` có đủ 7 nhãn thứ của tuần (VI mặc định, T2 đầu); reload → vẫn chọn Tuần.
  [ ] Ở 428×926: 4 nút bố cục nằm trên một hàng, không cuộn ngang (`scrollWidth <= clientWidth`), mỗi nút cao ≥ 44 px.
  [ ] `npm run check` pass, không test cũ nào bị sửa/skip; tập khóa vi = en.
- Lệnh kiểm tra: `npm run check`
- Nhật ký: 2026-09-15 vòng 1 (gemini-3.8-flash-high, 6 phút): XONG (LAYOUTS +week, 2 khóa i18n, `week.spec.ts` 2 test) → kiem-thu PASS (228×2 unit; e2e 68/6 skip = +4) → review diff đạt + ảnh chụp webkit tab Xem trước: 4 nút một hàng, "Việc cần làm" không xuống dòng → commit.
- Model: gemini (làn code — 4 file, tiêu chí đo bằng lệnh, không đổi hợp đồng) · Lần thử: 0/3 · Trạng thái: DONE

### T-5.END — Kiểm thử tích hợp M5
- Mục tiêu: E2E luồng chính M5 theo SPEC v1.5 §6 M5.
- Phạm vi file: `tests/e2e/m5-week.spec.ts` (mới); được sửa lỗi tích hợp nhỏ trong `src/**` nhưng phải khai báo từng file.
- Tiêu chí nghiệm thu:
  [ ] chromium + webkit (`?test=1`, IndexedDB trống): tab Sự kiện tạo sự kiện hôm nay 09:00 thời lượng 40 phút + sự kiện ngày khác trong tuần; tạo to-do có hạn hôm nay → chọn bố cục Tuần → preview 1284×2778; `__lastOps` có chip "09:00 - 09:40" nằm trong cột hôm nay (x trong khoảng rect tô hôm nay), chip sự kiện kia ở cột ngày đó, chip to-do, và tên sự kiện trong danh sách hôm nay (op text cỡ lớn hơn chip); reload vẫn Tuần.
  [ ] `npm run check` pass toàn bộ.
- Lệnh kiểm tra: `npx playwright test tests/e2e/m5-week.spec.ts; npm run check`
- Nhật ký: 2026-09-15 lượt 1: DONE (m5-week.spec.ts, không sửa src; repeat-each=3 6/6; check 70/6 skip). Review (trước kiem-thu để khỏi chạy 2 lần): test chép cứng hằng hình học week.ts (margin/gap/colW) → test khóa giòn → trả thợ suy cột từ op nhãn thứ trong `__lastOps` (Lần thử 1/3). Lượt 2: `columnCenters()` từ op nhãn thứ + `containsX()`; bỏ hằng hình học → kiem-thu PASS (repeat-each=3 6/6; unit 228×2/21 file; e2e 70/6 skip; src không đổi) → review đạt → commit.
- Model: sonnet · Lần thử: 1/3 · Trạng thái: DONE
