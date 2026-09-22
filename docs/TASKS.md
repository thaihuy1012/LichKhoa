# TASKS — bảng giao việc
(Quản lý duy trì. Trạng thái: TODO | DOING | REVIEW | DONE | BLOCKED. Ghi ngay sau mỗi bước.)
Nguồn sự thật: `docs/SPEC.md` (v1.5 — D-024 bố cục Tuần; v1.4 — D-018/D-020, Kiến trúc sư soát D-021; v1.0 Chủ dự án duyệt 2026-09-13; v1.1 Âm lịch D-006; v1.2 iPhone 13 Pro Max D-007; v1.3 T2–T6/nhắc trước/hạn to-do/nhiều ghi chú D-011). Hợp đồng TypeScript ở SPEC mục 5 — không đổi nếu không PHẢN BIỆN.
Lệnh test tổng: `npm run check` (tại `E:\DuAn\thu-nghiem`, PowerShell).

## Tiến độ
- M1: 8/8 ✔ tag `M1-ok` · M2: 15/15 ✔ tag `M2-ok` (D-012) + nối tiếp T-2.15, T-2.16 ✔ · M3: 5/5 ✔ tag `M3-ok` (D-015) · M4: 12/12 ✔ tag `M4-ok` (D-021 — DUYỆT M4 + nghiệm thu cuối, gộp)
- **M5 (SPEC v1.5, D-024) — Bố cục Tuần giống Inks: 4/4 ✔ tag `M5-ok`** (D-025 — Kiến trúc sư DUYỆT sau soát chéo Gemini). Máy thật (Chủ dự án 2026-09-15): chữ chip đọc được ✔, "◷" hiện đúng ✔ → T-5.4 không cần gấp (chỉ còn S4 dọn code). Chủ dự án yêu cầu thêm (D-026, SPEC v1.6): bấm đúp mở Google Calendar → KHÔNG làm (OUT); sự kiện trùng local/Google → B-003 ✔ DONE (chờ Chủ dự án `git push`). Chủ dự án: "xử lý tồn đọng cho xong" → T-5.4 ✔, B-004 ✔ → **HẾT TỒN ĐỌNG**. Chủ dự án `git push` (a173446..bcb4c15) → Actions run 34922820757 success, trang 200. Sau đó Chủ dự án báo: 2 sự kiện trùng trong app vẫn hiện cả 2 → D-027 ẩn trùng mọi nguồn → B-005 ✔ DONE. Chủ dự án `git push` (bcb4c15..3ef433a) → Actions run 34923759379 success, trang 200. Dự án ĐÓNG lại (D-022).
- **M7 (SPEC v1.8, D-031) — Nhắc trên iPhone qua Phím tắt: 5/5 ✔ + T-7.2b, T-7.5 (soát chéo), T-7.6, T-7.7 · Kiến trúc sư DUYỆT M7 (2026-09-19) (+T-7.2b vá)** (T-7.1 … T-7.END) · Chủ dự án DUYỆT SPEC v1.8 ngày 2026-09-19 (cả hai nút Báo thức + Lời nhắc, hỏi giờ mỗi lần + "Không báo thức", ghi chú chọn giờ tại nút, Chủ dự án tự cài 2 Phím tắt). Dự án MỞ LẠI từ trạng thái ĐÓNG (D-022). Chủ dự án yêu cầu (2026-09-19) **ưu tiên giao Gemini để tiết kiệm token Claude** → quy định mới CLAUDE.md + LAN-GEMINI §4b/§5b (commit a7ddcc9); làn Gemini BẬT mức NHIỀU ngay khi phiếu hạ tầng T-G.1 (`song`/`gia-han`) xong và cây git sạch. T-7.1 ✔ (giao Claude vì làm trước khi có quy định mới). Deploy 2026-09-19: Chủ dự án `git push` (c318e19..e432dce) → Pages 200, bản JS `index-BOpr_rIT.js` có đủ `rem-open`/`ThemBaoThuc`/`ThemLoiNhac`. Chờ Chủ dự án cài 2 Phím tắt + thử tay A–F, B′ trên iPhone để đóng M7. · **M8 (SPEC v1.9, D-034) CHỜ**: Chủ dự án duyệt SPEC nhưng hoãn làm tới khi thử tay M7 xong. Deploy 2026-09-19 (đợt bảo trì sau thử tay): `git push` (e432dce..a4bca49) → Pages 200, bản `index-DOl9Sm8a.js` có định dạng ngày mới + CSS `color-scheme:dark`. Chờ Chủ dự án dọn Phím tắt và thử lại B/B′/C/E.
- **M6 (SPEC v1.7, D-028) — Cử chỉ danh sách Việc cần làm: 3/3 ✔** (T-6.1, T-6.2, T-6.END) + B-006 ✔ (Gemini). Soát chéo `M6-soat` xong (lượt 1 tho-gemini tự soát thay Gemini → bỏ, giao lại; lượt 2 Gemini Pro 10 điểm) → T-6.3 ✔ sửa lỗi thật → Kiến trúc sư DUYỆT (D-029) → tag `M6-ok`. Deploy OK: Chủ dự án `git push` (3ef433a..c9f7b82) → Actions run 34933678053 success, trang 200. Tag `M6-ok` đã lên GitHub. Chủ dự án thử iPhone: vuốt ✔, Xóa/Lưu trữ ✔, nhấn giữ kéo ✘ + nút ▲▼× không bấm được → SỰ CỐ SC-002 (S2) / B-007 ✔ (Chủ dự án xác nhận iPhone 3/3, SC-002 ĐÃ ĐÓNG) → B-008 ✔ bỏ nút ▲▼×. Deploy c318e19 OK (run 34947329366, trang 200). Chủ dự án xác nhận trên iPhone: "Tất cả đã ổn" (2026-09-15) → dự án ĐÓNG (D-022); mở lại khi Chủ dự án yêu cầu. Tồn đọng S4 còn: mục "S4 · M6 (D-029)". → rồi B-008 bỏ nút ▲▼×. Thứ tự 6.1 → 6.2 → 6.END → soát chéo `M6-soat` → Kiến trúc sư duyệt → tag `M6-ok`. Xem mục "M6" cuối file. Không phiếu nào đủ điều kiện Gemini (6.1 đổi hợp đồng; 6.2 cử chỉ cần cảm giác máy thật; 6.END sonnet). Deploy OK: Chủ dự án `git push` (6fec4b5..a173446) → Actions run 34919243300 success, trang 200, JS có `layout-week`. Tag `M5-ok` đã lên GitHub. Chờ Chủ dự án xem trên iPhone 2 ý: (1) chữ chip (~7–8 pt) đọc được không; (2) biểu tượng ◷ có hiện không. Sau đó → phiếu T-5.4 (tồn đọng D-025) nếu cần. Thứ tự 5.1 → 5.2 → 5.3 → 5.END → ảnh mẫu cho Chủ dự án → soát chéo Gemini `M5-soat` → Kiến trúc sư duyệt M5 → tag `M5-ok`. Xem mục "M5" cuối file. Làn Gemini: BẬT mức NHIỀU ở checkout chính (không chạy trong worktree — BAI-HOC); T-5.3 đủ điều kiện → tho-gemini.
- 2026-09-15: ĐỢT BẢO TRÌ D-023 XONG (B-001, B-002) — Quản lý phiên chính dọn rác Gemini ở checkout chính, `merge --ff-only` nhánh worktree → `main` 6fec4b5, `npm run check` pass (211×2 unit, 64 e2e, 6 skip có từ trước). Chủ dự án `git push` (e954b16..6fec4b5) → Actions run 34911429434 success, trang 200, CSS `.color-input` mới đã lên. Chờ Chủ dự án xem ô màu trên iPhone. Dự án trở lại trạng thái ĐÓNG (D-022).
- Trước đó (2026-09-15): ĐỢT BẢO TRÌ D-023 — B-001 (Gemini) → B-002 (sonnet). Xem mục "Bảo trì 2026-09-15" cuối file.
- 2026-09-15 phiên 2 (nền): làm trong worktree `.claude/worktrees/bao-tri-D-023`, nhánh `worktree-bao-tri-D-023` (từ `main` fd17357) — commit ở nhánh này, Chủ dự án gộp về `main` (`git merge --ff-only worktree-bao-tri-D-023`). Lượt Gemini `B-001` vòng 1 phiên trước chết khi dừng phiên (`DONE 255`, đầu ra rỗng, không đổi `src/`) → `huy B-001`, giao lại vòng 1 (không tính Lần thử, không tính lỗi làn). Lưu ý: `agy-run.sh huy` hoàn tác MỌI thay đổi chưa commit, kể cả sổ sách → commit sổ trước khi giao Gemini.
- 2026-09-15 phiên 2: B-001 ✔ DONE. Làn Gemini TẮT tới hết phiên này (agy ghi ra ngoài worktree — BAI-HOC 2026-09-15); phiên sau chạy ở checkout chính thì bật lại được. B-002 ✔ DONE. ĐỢT BẢO TRÌ D-023 XONG (2/2) — chờ Chủ dự án: gộp nhánh về `main`, xem ô màu trên iPhone sau deploy (`git push`).
- Trước đó: DỰ ÁN ĐÃ ĐÓNG 2026-09-14 (D-021 nghiệm thu, D-022 Chủ dự án chọn đóng; giữ "Chủ dự án tự `git push`"). Mở lại khi Chủ dự án yêu cầu: đọc SU-CO → TASKS (Tồn đọng S4) → DECISIONS D-021/D-022. Thử máy thật lần 3: T-4.10 ✔ "Ghi chú hiện đúng" → mọi hạng mục thử tay M4 đạt. Deploy lần đầu OK 2026-09-14: Chủ dự án `git push -u origin main` (3396ec7..fcf6bdc, không force) → Actions run 34867029741 build + deploy success → `https://thaihuy1012.github.io/LichKhoa/` 200, manifest scope `/LichKhoa/`. Nhánh `main` theo dõi `origin/main`; Quản lý không push được (`.claude/settings.json` deny) → mỗi lần cần deploy, Chủ dự án chạy `! git push`. Sau đó → Kiến trúc sư duyệt M4 → nghiệm thu cuối.
- Công cụ review bằng mắt: `scripts/mau-anh.cjs`, `scripts/chup.cjs`, `scripts/cat-anh.cjs` (xem `scripts/README-cong-cu.md`; cần `npm run build` trước).
- SPEC v1.3 (D-011): lặp T2–T6, nhắc trước qua .ics, hạn to-do, nhiều ghi chú → phiếu T-2.10/2.11/2.12.
- Nhắc Chủ dự án: tham khảo `F:\LICH_NEN` cho mọi phiếu còn lại — bảng đối chiếu UI ở `docs/tham-khao-LICH_NEN.md` §6.
- ~~Chờ Chủ dự án: đặt thử ảnh mẫu 1284×2778~~ → đã thử máy thật T-4.0 (D-018: hình nền không bị đè).
- Chuyển phiên: T-2.8 đã commit — điểm dừng sạch. Phiên mới (`claude --agent quan-ly`): đọc SU-CO → TASKS, giao T-2.6 (nhớ tiêu chí Quản lý dựng ảnh mẫu 3 bố cục xem bằng mắt). Ảnh mẫu mới nhất đã gửi Chủ dự án: có âm lịch (lichkhoa-amlich-r1.png).
- Sự cố mở: (không — SC-001 đã đóng 2026-09-13)
- Làn Gemini: BẬT (D-009) — Pro `gemini-3.1-pro-high`, Flash `gemini-3.8-flash-high`. Dùng đầu tiên: soát chéo cuối M2.
- 2026-09-15: Chủ dự án bật làn Gemini **v2 mức NHIỀU** (kit v2.1, `tho-gemini`). `agy-run.sh kiem-tra` → SẴN SÀNG (agy 1.2.2; code `gemini-3.8-flash-high`, soat/doc `gemini-3.1-pro-high`, sinh `gemini-3.8-flash-low`). Dự án vẫn ĐÓNG (D-022) → hỏi Chủ dự án việc tiếp theo.


## ĐIỂM DỪNG PHIÊN 2026-09-22 (đọc mục này đầu tiên ở phiên sau)

**Trạng thái**: KHÔNG sự cố mở (SC-005 đã đóng). Cây git sạch. M7, M8 (tag `M8-ok` 2026-09-22), M9 ĐÓNG. **Tồn đọng S4: HẾT.**
**Chưa deploy**: `main` đi trước `origin/main` gồm mã nguồn mới (B-015 store, B-016 gộp Hoàn tác, B-017 kéo tự cuộn/kẹp nhóm) + T-8.4 HUONG-DAN. Muốn lên iPhone: Quản lý chạy Cổng bảo mật (CLAUDE.md) trên đúng commit → Chủ dự án `git push`.
**Sau deploy nhờ Chủ dự án thử iPhone**: (1) xóa 2 việc liền → 1 Hoàn tác trả cả 2; (2) danh sách dài, nhấn giữ kéo xuống mép dưới → tự cuộn; (3) kéo việc có hạn sang nhóm không hạn → hàng dừng ở ranh giới, không bật về.
**Làn Gemini**: BẬT mức NHIỀU (lỗi làn 1 lần phiên này — T-8.4). Lệnh e2e trong prompt Gemini phải `npm run build &&` trước (BAI-HOC SC-005). **Nhánh phụ**: `backup-truoc-go-anh` — giữ tới khi Chủ dự án yên tâm.

## Tồn đọng (S4 — không chặn) — HẾT (2026-09-22)
- ~~(2026-09-21, góp ý Chủ dự án, NGOÀI SPEC) Việc đã tạo không mở được "Nhắc trên iPhone" (nút chỉ ở hàng thêm việc). Chủ dự án chọn TẠM DÙNG CÁCH THỦ CÔNG — không sửa app. Nếu sau này muốn: đổi phạm vi SPEC → Kiến trúc sư, milestone nhỏ (nút trong bộ sửa hạn).~~ → Chủ dự án 2026-09-22 xác nhận giữ thủ công → ĐÓNG.
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
- ~~S4 · M5 (D-025): (a)–(d) → ~~phiếu T-5.4~~ ✔ DONE 3b16a76; (e) cache Google cũ thiếu ngày đầu tuần → đóng, không sửa (D-025: cache không có timeMin, tự hết sau 1 lần đồng bộ); (f) "◷" → Chủ dự án xác nhận iOS hiện đúng → đóng.~~
- ~~S4 · T-6.2 · `createStore` ghi IndexedDB debounce 300 ms → thao tác rồi thoát app ngay (< 0,3 s) có thể mất thay đổi cuối; đề xuất flush khi `pagehide`/`visibilitychange=hidden` (store.ts) ~~ → đã sửa B-006 (Gemini).
- ~~S4 · M6 (D-029) (a) toast đè mất Hoàn tác lần trước (#6); (b) listener `createStore` không gỡ (#7); (c) chưa có unit `createStore` (#10); (d) Hoàn tác xóa ngay sau khi thêm việc mới → 2 việc cùng `order`; (e) kéo không tự cuộn khi danh sách dài; (f) kéo sang nhóm khác hàng dịch rồi bật về.~~ → đã sửa B-015 (b,c,d), B-016 (a), B-017 (e,f) 2026-09-22.
- ~~S4 · T-8.END · `ReminderDialog` giữ state `at` của lần mở trước; `useEffect([open])` đặt lại mặc định SAU lần vẽ đầu → mở hộp có thể thoáng hiện giờ cũ (test phải dùng `setRemAt` chờ ổn định). Sửa gợi ý: đặt lại bằng `useLayoutEffect` hoặc `key` theo lần mở.~~ (trùng mục dưới, đã sửa T-9.3)
- ~~S4 · T-9.4 (Kiến trúc sư) · `sameTodoGroup` (store.ts:13–14) coi `due: ''` là có hạn, `cmpTodo` (collect.ts:71) coi không — chỉ với JSON nhập tay.~~ → đã sửa B-015.
- ~~S4 · T-8.END · ReminderDialog giữ `at` cũ~~ → đã sửa T-9.3 (wrapper + Inner).
- ~~S4 · T-3.1 · `parseFragment`: giải mã 2 lần đã sửa ở T-3.4 (`oauth.ts:60`); còn trả `{error}` không kiểm `state` → B-004 ✔ DONE (Gemini).~~
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

---
## Bảo trì 2026-09-15 (2) — SPEC v1.6 (D-026)

### B-003 — Hình nền ẩn sự kiện trùng local/Google, giữ cái tạo sau
- Mức: tính năng nhỏ (Chủ dự án yêu cầu). Triệu chứng hiện tại: sự kiện nhập trong app trùng sự kiện Google → hình nền hiện 2 lần.
- Mục tiêu: trên hình nền (mọi bố cục, qua `collectRenderData`) mỗi cặp trùng chỉ còn 1 sự kiện — cái tạo sau. Tab Sự kiện KHÔNG đổi (vẫn hiện cả hai).
- Phạm vi file (chỉ được sửa): `src/core/model.ts` (`LocalEvent.createdAt?`, `Occurrence.createdAt?`), `src/core/recurrence.ts` (chép `createdAt` sang occurrence), `src/google/calendar.ts` (`RawGoogleEvent.created?`; `normalize` → `createdAt = Date.parse(created)` nếu hợp lệ), `src/core/collect.ts` (lọc trùng), `src/ui/store.ts` (CHỈ `updateEvent`: giữ `createdAt` của event cũ nếu có), `src/ui/screens/events/EventsTab.tsx` (CHỈ chỗ tạo event MỚI: gán `createdAt: Date.now()`), `tests/unit/collect.test.ts`, `tests/unit/google-normalize.test.ts`, `tests/unit/recurrence.test.ts`, `tests/unit/store.test.ts` (chỉ THÊM test), `tests/e2e/dedup.spec.ts` (mới).
- Giao diện / đầu vào có sẵn: SPEC v1.6 §3 IN-5 (quy tắc trùng), §5 (`createdAt`); DECISIONS D-026. `addEvent` trong reducer KHÔNG đổi (để test khóa `toEqual` không vỡ) — UI tự gán `createdAt`. Cách seed `google.cache` trong E2E: xem `tests/e2e/events.spec.ts` (T-4.9).
- Yêu cầu:
  - Khóa trùng: `date` + (`allDay` ? `'*'` : `time`) + tên chuẩn hóa (`normalize('NFC')`, trim, gộp khoảng trắng, `toLowerCase()`).
  - Trong `collectRenderData`, nhóm theo khóa; nhóm có cả `local` lẫn `google` → giữ đúng 1 occurrence có `createdAt` lớn nhất (thiếu = 0; bằng nhau → ưu tiên `google`). Nhóm chỉ một nguồn → giữ nguyên (không gộp local–local hay google–google). Thứ tự kết quả vẫn theo `cmpOccurrence`.
  - `createdAt` chỉ xuất hiện trên object khi có giá trị (spread có điều kiện) — để test khóa so `toEqual` không vỡ. Test khóa nào vẫn vỡ → PHẢN BIỆN, không tự sửa.
- Tiêu chí nghiệm thu:
  [ ] collect: local "Họp nhóm" 09:00 (createdAt 2000) + Google "họp  nhóm " 09:00 cùng ngày (createdAt 1000) → chỉ còn local; đảo thời điểm → chỉ còn Google; local không có createdAt → Google; bằng nhau → Google; khác giờ hoặc khác tên → giữ cả hai; hai local trùng nhau → giữ cả hai; cả ngày cùng tên → lọc.
  [ ] google-normalize: `created` hợp lệ → `createdAt` = `Date.parse`; thiếu/không hợp lệ → không có trường.
  [ ] recurrence: event có `createdAt` → mọi occurrence có cùng `createdAt`; không có → không có trường.
  [ ] store: `updateEvent` với event mới không có `createdAt` → giữ `createdAt` cũ; event cũ không có → không thêm.
  [ ] E2E `dedup.spec.ts` (chromium + webkit, `?test=1`): seed state có `google.cache` 1 sự kiện hôm nay "Họp nhóm" 09:00 + tạo sự kiện local cùng tên/giờ qua tab Sự kiện → `__lastOps` (bố cục Agenda) chỉ có 1 op text "Họp nhóm"; tab Sự kiện ngày hôm nay vẫn có 2 mục (một mục `ev-item-google`).
  [ ] `npm run check` pass; test khóa không bị sửa.
- Lệnh kiểm tra: `npx tsc --noEmit; npm run test` rồi `npm run check`
- Nhật ký: 2026-09-15 lượt 1: DONE (dedupOccurrences trong collect.ts; createdAt local/Google; updateEvent giữ createdAt; EventsTab gán khi tạo mới; test chỉ thêm) → kiem-thu PASS (unit 241×2/21 file; e2e 72/6 skip; dedup.spec repeat-each=3 6/6) → review diff đạt → commit.
- Model: sonnet (đổi hợp đồng dùng chung → không giao Gemini) · Lần thử: 0/3 · Trạng thái: DONE

### T-5.4 — Dọn tồn đọng bố cục Tuần (D-025 a–d)
- Mục tiêu: sửa 4 điểm S4 Kiến trúc sư nêu khi duyệt M5; hình nền 24h ở 1284×2778 không đổi giao diện.
- Phạm vi file (chỉ được sửa): `src/render/layout/week.ts`, `src/render/layout/common.ts` (chỉ nếu cần thêm helper; không đổi hành vi helper cũ), `tests/unit/layout-week.test.ts` (test khóa T-5.2 — CHỈ được sửa đúng L117–124, L142–147 theo mục (d) và THÊM test; khai báo từng chỗ).
- Yêu cầu:
  - (a) hour12: khoảng giờ vắt qua trưa ghi đủ 2 hậu tố "11:00 AM - 1:00 PM"; cùng buổi giữ "9:00 - 11:00 AM" (như Inks). Chuỗi rút gọn khi không vừa chip vẫn theo thứ tự hiện có (có cách → không cách → chỉ giờ bắt đầu).
  - (b) Hệ số ước lượng độ rộng chữ (`CHAR_W` 0.55) theo `c.font`: mono ≈ 0.62, sans/serif giữ 0.55 — để font mono không tràn chip.
  - (c) Bỏ `todoDueText` (`week.ts` ~L411) — dùng `todoDueLabel` của `common.ts`, kết quả nhãn không đổi.
  - (d) `layout-week.test.ts` L117–124, L142–147 đang chép hằng lề/cột của week.ts → suy từ `DrawOp` (vd tâm cột = `x` của op nhãn thứ, như `tests/e2e/m5-week.spec.ts` `columnCenters`), giữ nguyên mục đích kiểm.
- Tiêu chí nghiệm thu:
  [ ] Test mới: hour12 `09:00–11:00` → chip chứa "9:00 - 11:00 AM"; `11:00–13:00` (máy rộng/scale nhỏ để vừa) → chứa "11:00 AM" và "1:00 PM"; 24h không đổi ("09:00 - 09:40").
  [ ] Test mới: `font: 'mono'` 1284×2778 → mọi op text chip có ước lượng `0.62×size×len` ≤ bề rộng trong chip.
  [ ] `grep -n "todoDueText" src` rỗng; nhãn to-do trên Tuần giống trước (test cũ vẫn pass).
  [ ] `grep -nE "0\.05|0\.008" tests/unit/layout-week.test.ts` rỗng; test (d) vẫn kiểm đúng điều cũ.
  [ ] `npm run check` pass; ngoài L117–124, L142–147 không dòng test cũ nào đổi.
- Lệnh kiểm tra: `npx tsc --noEmit; npm run test` rồi `npm run check`
- Nhật ký: 2026-09-15 lượt 1: DONE (hour12 2 hậu tố khi khác buổi; `charW(font)` mono 0.62; common +`truncateByFactor`, `truncate` gọi lại hệ số 0.5; bỏ `todoDueText`; test khóa đổi đúng 2 vùng (d) + bỏ 1 assertion so hằng `chipTimeSize` — đã khai; +2 test) → kiem-thu PASS (unit 243×2/21 file; e2e 72/6 skip; 2 grep rỗng) → review đạt (chấp nhận test còn nhận diện chip bằng `r === 10`/alpha chip "+N" — hằng hiếm đổi) → commit.
- Model: sonnet (sửa test khóa → không giao Gemini) · Lần thử: 0/3 · Trạng thái: DONE

### B-004 — `parseFragment`: nhánh lỗi phải kiểm `state` (S4 T-3.1)
- Mục tiêu: `#error=…` chỉ được nhận khi `state` khớp (chống chèn lỗi giả vào URL); giữ nguyên mọi hành vi khác.
- Phạm vi file (chỉ được sửa): `src/google/oauth.ts` (chỉ hàm `parseFragment`, ~L51–73), `tests/unit/oauth.test.ts` (chỉ THÊM test, không sửa test cũ).
- Giao diện: chữ ký `parseFragment(hash, expectedState)` giữ nguyên (SPEC §5).
- Yêu cầu: có `error` → trả `{ error }` khi `state === expectedState`; `state` thiếu hoặc khác → `null`. Không `decodeURIComponent` thêm (URLSearchParams đã giải mã).
- Tiêu chí nghiệm thu:
  [ ] Test mới: `#error=access_denied&state=x` với expected `abc` → `null`; `#error=access_denied` (không state) → `null`; test cũ `oauth.test.ts:77–80`, `:92–95` và `store.test.ts:344–352` pass nguyên văn.
  [ ] `npm run check` pass; `git diff -- tests/` chỉ có dòng thêm.
- Lệnh kiểm tra: `npm run check`
- Nhật ký: 2026-09-15 vòng 1 (gemini-3.8-flash-high, 4 phút): XONG (kiểm `state` ở nhánh lỗi; +1 test 2 trường hợp) → kiem-thu PASS (unit 244×2/21 file; e2e 72/6 skip; test chỉ thêm) → review diff đạt → commit.
- Model: gemini (làn code — 2 file, chữ ký giữ nguyên, lệnh kiểm rõ) · Lần thử: 0/3 · Trạng thái: DONE

### B-005 — Hình nền ẩn sự kiện trùng mọi nguồn (D-027)
- Mức: S3 (hành vi chưa đúng ý Chủ dự án). Triệu chứng: tạo 2 sự kiện trùng (cùng ngày, giờ, tên) trong tab Sự kiện → màn khóa hiện cả 2.
- Mục tiêu: `dedupOccurrences` lọc mọi nhóm trùng có ≥ 2 mục, không chỉ nhóm có cả local lẫn Google.
- Phạm vi file (chỉ được sửa): `src/core/collect.ts` (chỉ `dedupOccurrences` + comment), `tests/unit/collect.test.ts` (test khóa B-003: CHỈ được đổi case "hai local trùng → giữ cả hai" thành kỳ vọng mới; THÊM test; khai báo).
- Giao diện: chữ ký `dedupOccurrences(occs)` và khóa trùng (D-026) giữ nguyên.
- Yêu cầu: nhóm ≥ 2 mục → giữ đúng 1: `createdAt` lớn nhất (thiếu = 0); bằng nhau → ưu tiên `google`; cùng nguồn và bằng nhau → mục đứng SAU trong mảng đầu vào (local đứng sau = thêm sau, vì `expandOccurrences` sắp ổn định theo thứ tự `state.events`). Nhóm 1 mục giữ nguyên.
- Tiêu chí nghiệm thu:
  [ ] 2 local trùng, không `createdAt` → còn 1, là mục đứng sau; 2 local có `createdAt` 1000/2000 → còn mục 2000 (dù đứng trước).
  [ ] 2 Google trùng (2 lịch) → còn 1 (createdAt lớn hơn).
  [ ] Mọi case local–Google của B-003 vẫn đúng; khác giờ/khác tên vẫn giữ cả hai.
  [ ] `collectRenderData`: 2 LocalEvent trùng trong `state.events` → `occurrences` còn 1 cho ngày đó; sự kiện lặp trùng nhau → mỗi ngày còn 1.
  [ ] `npm run check` pass; ngoài case đã khai, test cũ không đổi; `tests/e2e/dedup.spec.ts` pass.
- Lệnh kiểm tra: `npx tsc --noEmit; npm run test` rồi `npm run check`
- Nhật ký: 2026-09-15 lượt 1: DONE (dedupOccurrences lọc mọi nhóm ≥ 2; đổi 1 case khóa B-003 đã khai; +2 test) → review: thiếu test tiêu chí "sự kiện lặp trùng" → trả thợ (Lần thử 1/3). Lượt 2: +1 test lặp daily 7 ngày → kiem-thu PASS (unit 247×2/21 file; e2e 72/6 skip; dedup.spec 2 trình duyệt) → commit.
- Model: sonnet (sửa test khóa → không giao Gemini) · Lần thử: 1/3 · Trạng thái: DONE

---
## M6 — Cử chỉ danh sách Việc cần làm (SPEC v1.7, D-028)
Thứ tự: 6.1 → 6.2 → 6.END (tuần tự; 6.2 cần action của 6.1).

### T-6.1 — Lõi: `Todo.archived` + action lưu trữ / khôi phục / sắp xếp
- Mục tiêu: hợp đồng dữ liệu và reducer cho cử chỉ ở T-6.2; hình nền bỏ việc đã lưu trữ.
- Phạm vi file (chỉ được sửa): `src/core/model.ts` (`Todo.archived?: boolean`), `src/ui/store.ts` (action mới + `moveTodo` bỏ qua việc lưu trữ), `src/core/collect.ts` (lọc `archived`), `tests/unit/store.test.ts`, `tests/unit/collect.test.ts` (chỉ THÊM test).
- Giao diện / đầu vào có sẵn: SPEC v1.7 §3 IN-4, §5 `Todo`; `cmpTodo` (`collect.ts`) — nhóm hiển thị: chưa xong có hạn (theo `due`) / chưa xong không hạn (theo `order`) / đã xong (theo `order`); `moveTodo` hiện có (`store.ts`) đổi chỗ trong cùng nhóm.
- Yêu cầu:
  - Action `archiveTodo { id; archived: boolean }` → đặt/bỏ `archived` (bỏ = xóa trường, không để `false`).
  - Action `restoreTodo { todo: Todo }` → chèn lại việc đã xóa (giữ `id`, `order`, mọi trường); `id` đã tồn tại → không đổi state.
  - Action `reorderTodo { id; targetId }` → đưa `id` vào vị trí của `targetId` trong danh sách hiển thị (kéo xuống → sau target, kéo lên → trước target), tính lại `order` các việc trong nhóm để thứ tự `cmpTodo` đúng như vậy. Chỉ hợp lệ khi hai việc cùng nhóm hiển thị, cùng chưa lưu trữ, và (nhóm có hạn) cùng `due`; ngược lại → không đổi state. Không mutate state cũ.
  - `moveTodo` và `reorderTodo` bỏ qua việc `archived` (không đổi chỗ với việc đã lưu trữ).
  - `collectRenderData`: `todos` không có việc `archived` (mọi bố cục hình nền tự hết).
- Tiêu chí nghiệm thu:
  [ ] store: archive → có `archived: true`; bỏ archive → không còn trường; restore sau `deleteTodo` → state giống trước khi xóa (`toEqual`); restore id đã có → state không đổi (cùng tham chiếu hoặc `toEqual`).
  [ ] store: 3 việc không hạn A,B,C (order 0,1,2) → `reorderTodo(C, A)` → thứ tự hiển thị C,A,B; `reorderTodo(A, C)` từ A,B,C → B,C,A; khác nhóm (một việc có hạn) → không đổi; `moveTodo` với hàng xóm đã lưu trữ → nhảy qua việc lưu trữ.
  [ ] collect: việc `archived` không có trong `RenderData.todos`.
  [ ] `npm run check` pass; test cũ không đổi.
- Lệnh kiểm tra: `npx tsc --noEmit; npm run test` rồi `npm run check`
- Nhật ký: 2026-09-15 lượt 1: DONE (`archived`; `archiveTodo`/`restoreTodo`/`reorderTodo`; `sameTodoGroup` loại việc lưu trữ; `moveTodo` lọc lưu trữ; collect lọc; +4 test) → kiem-thu PASS (unit 251×2/21 file; e2e 72/6 skip; test chỉ thêm) → review đạt → commit.
- Model: sonnet (đổi hợp đồng dùng chung) · Lần thử: 0/3 · Trạng thái: DONE

### T-6.2 — UI: vuốt trái Lưu trữ / Xóa + Hoàn tác, phần "Đã lưu trữ", nhấn giữ kéo sắp xếp
- Mục tiêu: cử chỉ kiểu iOS cho danh sách Việc cần làm (tab Sự kiện › Việc).
- Phạm vi file (chỉ được sửa): `src/ui/screens/events/TodosTab.tsx`, `src/ui/screens/Events.tsx` (chỉ: truyền `showToast` cho TodosTab và cho toast nhận nút hành động), `src/ui/styles.css`, `src/core/i18n/vi.json`, `src/core/i18n/en.json`, `tests/e2e/todo-gestures.spec.ts` (mới).
- Giao diện / đầu vào có sẵn: T-6.1 (`archiveTodo`, `restoreTodo`, `reorderTodo`); testid hiện có `todo-item`, `todo-toggle`, `todo-edit`, `todo-up`, `todo-down`, `todo-del` — GIỮ NGUYÊN (test khóa dùng); `showToast` ở `Events.tsx:27`.
- Yêu cầu:
  - Vuốt trái (pointer events; ngang > 16 px và |dx| > |dy|; hàng `touch-action: pan-y`) → hàng trượt, lộ 2 nút bên phải: "Lưu trữ" (`todo-swipe-archive`) và "Xóa" (`todo-swipe-delete`, đỏ), mỗi nút ≥ 44 px; thả quá ~40% → mở hẳn, ít hơn → đóng; vuốt phải / chạm chỗ khác / mở hàng khác → đóng; mỗi lúc chỉ 1 hàng mở. Vuốt không kích hoạt tick / sửa.
  - Xóa → `deleteTodo` + toast "Đã xóa" có nút "Hoàn tác" (`toast-undo`) ~5 s → `restoreTodo`. Lưu trữ → `archiveTodo` + toast "Đã lưu trữ" + Hoàn tác (bỏ lưu trữ).
  - Cuối danh sách: nút `todo-archived-toggle` "Đã lưu trữ (N)" (ẩn khi N = 0), mặc định thu gọn; mở ra liệt kê `todo-archived-item` (chữ mờ); vuốt trái → "Khôi phục" (`todo-swipe-restore`) và "Xóa" (xóa hẳn + Hoàn tác).
  - Nhấn giữ ~450 ms không di chuyển (> 8 px → hủy) → chế độ kéo: hàng nổi lên (bóng, scale nhẹ) đi theo ngón tay theo chiều dọc, các hàng khác dịch chỗ; thả → `reorderTodo(id, targetId)`; thả sang nhóm khác → trở về chỗ cũ. Khi đang kéo trang không cuộn. Nhấn giữ không mở sửa / không tick; hàng `-webkit-user-select: none; -webkit-touch-callout: none`.
  - Hỗ trợ cả chuột (pointer) để test được trên chromium/webkit desktop.
- Tiêu chí nghiệm thu:
  [ ] `todo-gestures.spec.ts` (chromium + webkit): vuốt trái (chuột/pointer) → hiện 2 nút; Xóa → việc biến mất, bấm `toast-undo` → trở lại đúng vị trí; Lưu trữ → biến mất khỏi danh sách và khỏi `__lastOps` (bố cục Việc), `todo-archived-toggle` "(1)" → mở → vuốt → Khôi phục → trở lại danh sách.
  [ ] Nhấn giữ việc C (3 việc không hạn A,B,C) ~600 ms, kéo lên trên A, thả → danh sách C,A,B; `__lastOps` bố cục Việc cùng thứ tự; reload giữ nguyên.
  [ ] Chạm thường vào chữ vẫn mở sửa; tick vẫn tick (test khóa `m2-events`, `events` pass nguyên văn).
  [ ] `npm run check` pass; tập khóa vi = en; test cũ không đổi.
- Lệnh kiểm tra: `npx playwright test tests/e2e/todo-gestures.spec.ts --repeat-each=3; npm run check`
- Nhật ký: 2026-09-15 lượt 1: DONE (bộ cử chỉ pointer, phần Đã lưu trữ, toast có nút; NGOÀI phạm vi `src/ui/components/Toast.tsx` +nút `toast-undo` — chấp nhận) → kiem-thu FAIL: flake webkit `todo-gestures.spec.ts:119` (1/12, reload mất thứ tự). Review thêm: iOS — `touch-action: pan-y` + preventDefault trên pointer không chặn cuộn khi kéo → cần `touchmove` `{passive:false}` → trả thợ (Lần thử 1/3). Lượt 2: nguyên nhân flake = test reload trước persist debounce 300 ms (test nay poll IndexedDB); `touchmove {passive:false}` khi swipe/drag; pointercancel dọn cờ → kiem-thu PASS (repeat-each=5 20/20; e2e 76/6 skip). Review ảnh webkit: nút đỏ ghi "Xóa sự kiện" (khóa i18n của màn Sự kiện, xuống 2 dòng); vệt cong ở mép phải mỗi hàng khi đóng → trả thợ (Lần thử 2/3). Lượt 3: khóa `events.todoDelete` "Xóa"/"Delete", nút `nowrap`; panel `visibility: hidden` khi đóng + bo góc `.todo-item-inner` khớp → ảnh webkit đạt → kiem-thu PASS (repeat-each=3 12/12; unit 251×2; e2e 76/6 skip) → commit.
- Model: sonnet · Lần thử: 2/3 · Trạng thái: DONE

### T-6.END — Kiểm thử tích hợp M6
- Mục tiêu: E2E luồng chính M6 theo SPEC v1.7 §6 M6.
- Phạm vi file: `tests/e2e/m6-todo-gestures.spec.ts` (mới); được sửa lỗi tích hợp nhỏ trong `src/**` nhưng phải khai báo từng file.
- Tiêu chí nghiệm thu:
  [ ] chromium + webkit (`?test=1`, IndexedDB trống): thêm 3 việc qua UI → vuốt Xóa → Hoàn tác; Lưu trữ 1 việc → không có trên hình nền ở cả bố cục Việc và Tuần/Tháng-danh-sách (nếu việc có hạn hôm nay) → Khôi phục; nhấn giữ kéo việc thứ 3 lên đầu → thứ tự mới trong danh sách và `__lastOps`; xuất JSON có trường `archived` khi đang lưu trữ; reload giữ mọi thứ.
  [ ] `npm run check` pass toàn bộ.
- Lệnh kiểm tra: `npx playwright test tests/e2e/m6-todo-gestures.spec.ts --repeat-each=3; npm run check`
- Nhật ký: 2026-09-15 lượt 1: DONE (1 luồng chính; không sửa src) → kiem-thu PASS (repeat-each=3 6/6; unit 251×2; e2e 78/6 skip; chờ IndexedDB trước reload) → review đạt → commit.
- Model: sonnet · Lần thử: 0/3 · Trạng thái: DONE

### B-006 — Ghi ngay dữ liệu chờ khi app bị ẩn/đóng (S4 T-6.2)
- Mức: S4. Triệu chứng: `createStore` (`src/ui/store.ts:202–227`) ghi IndexedDB sau debounce 300 ms → thao tác rồi vuốt tắt app ngay có thể mất thay đổi cuối.
- Mục tiêu: khi trang bị ẩn/đóng, thay đổi đang chờ được ghi ngay.
- Phạm vi file (chỉ được sửa): `src/ui/store.ts` (chỉ `createStore`), `tests/e2e/persist-flush.spec.ts` (mới).
- Giao diện: kiểu `Store` (`getState`, `dispatch`, `subscribe`) và chữ ký `createStore(initialState)` GIỮ NGUYÊN.
- Yêu cầu: trong `createStore`, nếu có `window`/`document` (không có trong unit test node → bỏ qua): nghe `pagehide` và `visibilitychange` (khi `document.visibilityState === 'hidden'`) → nếu đang có `timer` chờ thì `clearTimeout` và gọi `saveState(state)` ngay. Không có thay đổi chờ → không ghi. Không đổi `PERSIST_DEBOUNCE_MS`.
- Tiêu chí nghiệm thu:
  [ ] `persist-flush.spec.ts` (chromium + webkit, `?test=1`): thêm một việc qua UI rồi NGAY LẬP TỨC (< 300 ms) `page.evaluate(() => window.dispatchEvent(new Event('pagehide')))` → đọc IndexedDB (`keyval-store`, key `lichkhoa:state`, cách đọc như `tests/e2e/todo-gestures.spec.ts`) trong vòng 150 ms có việc mới; thêm test tương tự với `visibilitychange` (giả `document.visibilityState = 'hidden'` bằng `Object.defineProperty`).
  [ ] `npm run check` pass; test cũ không đổi; unit test store (node) vẫn pass.
- Lệnh kiểm tra: `npm run check`
- Nhật ký: 2026-09-15 vòng 1 (gemini-3.8-flash-high, 6 phút): XONG (`flushPersist` trên `pagehide` + `visibilitychange=hidden`; `persist-flush.spec.ts` 2 test) → kiem-thu PASS (repeat-each=5 20/20; unit 251×2; e2e 82/6 skip) → review diff đạt → commit.
- Model: gemini (làn code — 2 file, chữ ký giữ nguyên, lệnh kiểm rõ) · Lần thử: 0/3 · Trạng thái: DONE

### T-6.3 — Sửa theo soát chéo M6 (Gemini Pro, `docs/bao-cao/M6-soat-cheo.md`, Quản lý đã kiểm chứng)
- Mục tiêu: sửa các lỗi thật soát chéo tìm ra trước khi Kiến trúc sư duyệt M6.
- Phạm vi file (chỉ được sửa): `src/ui/screens/events/TodosTab.tsx`, `src/ui/store.ts` (chỉ `reorderTodo`, `moveTodo`), `tests/unit/store.test.ts` (chỉ THÊM), `tests/e2e/todo-gestures.spec.ts` (test khóa T-6.2 — chỉ THÊM test).
- Yêu cầu:
  - (#1) Hoàn tác sau Lưu trữ phải bỏ lưu trữ (`archiveTodo … archived: false`), không dùng `restoreTodo` (TodosTab.tsx ~L376).
  - (#2) Vuốt tiếp một hàng đang mở: vị trí bắt đầu = −độ rộng panel (không giật về 0).
  - (#3) `suppressClickRef` tự dọn sau cử chỉ kể cả khi không có `click` theo sau (vd `setTimeout(…, 0)` cuối `endGesture`), không nuốt lần chạm hợp lệ kế tiếp.
  - (#4) Trong listener `touchmove`: khi còn `pending` mà |dx| > |dy| và |dx| > vài px → `preventDefault()` sớm (không đợi qua ngưỡng 16 px).
  - (#5) `reorderTodo` và `moveTodo`: gán `order` mới tăng ngặt trong nhóm (không tái dùng giá trị trùng) để dữ liệu cũ có `order` trùng vẫn đổi được thứ tự.
- Tiêu chí nghiệm thu:
  [ ] E2E thêm: Lưu trữ → bấm `toast-undo` → việc trở lại danh sách chính, "Đã lưu trữ" biến mất; vuốt hàng đang mở sang trái tiếp không làm hàng nhảy (vị trí x của `todo-item` không > vị trí mở + vài px ở bước di chuyển đầu); sau một lần kéo sắp xếp, một lần chạm vào chữ ngay sau đó mở sửa (không bị nuốt).
  [ ] Unit thêm: 3 việc không hạn cùng `order: 0` → `reorderTodo(C, A)` cho C,A,B; `moveTodo(B, -1)` đổi được chỗ.
  [ ] `npx playwright test tests/e2e/todo-gestures.spec.ts --repeat-each=3` + `npm run check` pass; test cũ không đổi.
- Lệnh kiểm tra: `npx playwright test tests/e2e/todo-gestures.spec.ts --repeat-each=3; npm run check`
- Nhật ký: 2026-09-15 lượt 1: DONE (#1–#5; +1 unit, +3 e2e) → kiem-thu PASS (repeat-each=3 30/30; unit 252×2; e2e 88/6 skip; test chỉ thêm) → review đạt (kiem-thu đọc sót unit test #5 — Quản lý xác nhận có) → commit.
- Model: sonnet (tiếp tục thợ T-6.2 — nắm code cử chỉ) · Lần thử: 0/3 · Trạng thái: DONE
- Để lại S4 (không sửa): #6 toast đè mất Hoàn tác lần trước; #7 listener `createStore` không gỡ (store tạo 1 lần/phiên); #10 unit test `createStore` (E2E `persist-flush` đã phủ).

---
## Bảo trì sau M6 (Chủ dự án thử iPhone 2026-09-15)
Chủ dự án thử D-029: (1) vuốt trái ✔; (3) Xóa/Hoàn tác, Lưu trữ khỏi hình nền ✔; (2) nhấn giữ kéo ✘ → B-007. Chủ dự án: "nếu sửa được nhấn giữ đổi thứ tự thì bỏ các nút ▲ ▼ × cũ" → B-008 SAU KHI Chủ dự án xác nhận B-007 trên iPhone.

### B-007 — iPhone: nhấn giữ kéo đổi thứ tự Việc không hoạt động
- Mức: S3 (một tính năng hỏng, có đường vòng ▲▼, không mất dữ liệu). Người báo: Chủ dự án, iPhone 13 Pro Max, PWA, bản `c9f7b82`.
- Triệu chứng (nguyên văn): "Nhấn giữ rồi kéo để đổi thứ tự không được. Khi kéo 1 việc lên trên hay xuống dưới thì 2 việc chồng lên nhau và không nhìn thấy. Thả tay thì hiện lại có thể nhìn thấy và thứ tự như cũ không thay đổi."
- Cách tái hiện: tab Sự kiện › Việc, ≥ 3 việc không hạn → nhấn giữ ~0,5 s một việc → kéo dọc qua việc bên cạnh → thả.
- Bối cảnh: E2E hiện có (`todo-gestures.spec.ts`, `m6-todo-gestures.spec.ts`) kéo bằng CHUỘT nên pass; chưa có test chạm thật. Nghi (chưa kiểm chứng): trên cảm ứng, chuỗi pointer bị `pointercancel`/mất capture (hàng re-render, `touch-action: pan-y`) → `onDragCancel` thay vì `onDragEnd`; hàng khác không dịch chỗ nên hàng kéo đè lên hàng kia.
- Phạm vi file (được sửa): `src/ui/screens/events/TodosTab.tsx`, `src/ui/styles.css`, `tests/e2e/todo-touch.spec.ts` (mới); `tests/e2e/todo-gestures.spec.ts` (test khóa — chỉ THÊM). Cần sửa ngoài → báo CẦN MỞ RỘNG PHẠM VI.
- Yêu cầu:
  - Tái hiện TRƯỚC bằng test thất bại dùng chạm THẬT: chromium + CDP `Input.dispatchTouchEvent` (touchStart → giữ ~600 ms → nhiều touchMove dọc → touchEnd) — sinh pointer `pointerType: 'touch'` và hành vi mặc định của trình duyệt (cuộn theo `touch-action`, `pointercancel`) giống thiết bị hơn chuột. Có thể thêm biến thể webkit nếu làm được.
  - Sửa nguyên nhân gốc. Khi kéo: hàng kéo nổi trên cùng (z-index, nền đặc, bóng) đi theo ngón tay, các hàng khác dịch chỗ nhường khoảng trống (thấy trước vị trí thả); thả → thứ tự mới. Không để trang cuộn; không để hai hàng chồng mất chữ.
  - Có thể đổi cách nhận cử chỉ kéo (vd dùng Touch Events cho nhánh cảm ứng) nếu Pointer Events không tin cậy trên iOS — ghi lý do trong comment.
  - Vuốt trái, chạm thường, tick, sửa, Hoàn tác vẫn như cũ.
- Tiêu chí nghiệm thu:
  [ ] `todo-touch.spec.ts` (chromium CDP touch): FAIL trên code cũ (thợ ghi log thất bại vào `docs/test-log/B-007-truoc.log`), PASS sau sửa: kéo việc C lên trên A → C,A,B trong danh sách và `__lastOps`; trong lúc kéo (giữa chừng) hàng C có z-index/transform nổi và hàng A đã dịch xuống (kiểm bằng boundingBox không chồng nhau).
  [ ] Toàn bộ `todo-gestures.spec.ts`, `m6-todo-gestures.spec.ts` pass nguyên văn; `npm run check` pass.
- Lệnh kiểm tra: `npx playwright test tests/e2e/todo-touch.spec.ts --repeat-each=3; npm run check`
- Bổ sung (Chủ dự án): nút ▲▼× trong hàng cũng không bấm được trên iPhone → hồi quy, nâng S2 → sự cố SC-002 (docs/SU-CO.md); thêm tiêu chí: chạm CDP vào `todo-up/down/del/toggle/edit` có tác dụng.
- Nhật ký: lượt 1 sua-loi sonnet (nút: timer nhấn giữ trên nút) → lượt 2 sua-loi opus (overflow cắt hàng kéo; kéo cảm ứng bằng Touch Events; không chặn mặc định trên nút) → kiem-thu PASS (57/0 fail; m6 6/6; check 97/13 skip) → commit. Chờ Chủ dự án thử iPhone.
- Model: sua-loi (sonnet → opus) · Lần thử: 2 lượt sự cố · Trạng thái: DONE (Chủ dự án xác nhận iPhone 3/3)

### B-008 — Bỏ nút ▲ ▼ × trên hàng Việc cần làm (Chủ dự án yêu cầu sau khi kéo chạy được)
- Mục tiêu: hàng việc thoáng hơn ở 428 px: đổi thứ tự bằng nhấn giữ kéo, xóa bằng vuốt trái (đã có, Chủ dự án xác nhận chạy trên iPhone).
- Phạm vi file (chỉ được sửa): `src/ui/screens/events/TodosTab.tsx` (bỏ 3 nút `todo-up`, `todo-down`, `todo-del` ở hàng việc chính; giữ `todo-toggle`, `todo-edit`, `+ Hạn`/`todo-due-label`), `src/ui/styles.css` (bố cục hàng sau khi bỏ nút), `src/core/i18n/vi.json`/`en.json` (chỉ bỏ khóa không còn dùng, 2 file khớp), và test khóa dùng 3 nút: `tests/e2e/events.spec.ts` (L104, L241–242), `tests/e2e/todo-touch.spec.ts` (các test chạm nút ▲▼×: L134–180, L396–399).
- Test khóa: được đổi ĐÚNG các chỗ trên, giữ mục đích: đổi thứ tự → dùng nhấn giữ kéo (hàm có sẵn trong `todo-gestures.spec.ts`/`todo-touch.spec.ts`); xóa → vuốt trái + `todo-swipe-delete`; test "chạm nút trong hàng có tác dụng dù xê dịch nhẹ" → áp cho `todo-toggle`, `todo-edit`, `todo-due-label`; test "giữ nút hơi lâu không bị coi là kéo" → áp cho `todo-toggle`/`todo-due-label`. `events.spec.ts:241–242` (nút ▲/▼ disabled ở biên nhóm) → bỏ assert đó, thay bằng: kéo việc có hạn sang nhóm không hạn thì thứ tự không đổi. Khai báo từng chỗ.
- `moveTodo` trong store GIỮ nguyên (không dùng ở UI nữa, unit test vẫn phủ).
- Tiêu chí nghiệm thu:
  [ ] `grep -rn "todo-up\|todo-down\|todo-del" src` rỗng; hàng việc không còn 3 nút.
  [ ] Ảnh chụp webkit iPhone 13 Pro Max tab Sự kiện › Việc (3 việc, 1 có hạn) trước/sau: `docs/test-log/B-008-truoc.png`, `B-008-sau.png`; chữ việc dài hơn trước khi bị cắt "…", không xuống dòng lộn xộn, vùng chạm tick/+Hạn ≥ 44 px.
  [ ] Mọi test pass: `npx playwright test tests/e2e/todo-touch.spec.ts tests/e2e/todo-gestures.spec.ts tests/e2e/events.spec.ts --repeat-each=3` + `npm run check`; ngoài chỗ đã khai, test cũ không đổi.
- Lệnh kiểm tra: `npx playwright test tests/e2e/todo-touch.spec.ts tests/e2e/todo-gestures.spec.ts tests/e2e/events.spec.ts --repeat-each=3; npm run check`
- Nhật ký: 2026-09-15 lượt 1: DONE (bỏ 3 nút + import thừa; CSS/i18n không cần đổi; test khóa đổi đúng chỗ đã khai: events.spec L104 kéo thay ▼, L222–243 "kéo khác nhóm không đổi"; todo-touch chạm/giữ áp cho toggle/edit/due-label) → kiem-thu PASS (111/0 fail ×3; unit 252×2; e2e 97/13 skip; grep rỗng) → review ảnh B-008-sau.png đạt → commit.
- Model: sonnet (sửa test khóa → không giao Gemini) · Lần thử: 0/3 · Trạng thái: DONE

---

## M7 — Nhắc trên iPhone qua Phím tắt (SPEC v1.8, D-031)
Đọc trước khi làm: `docs/SPEC.md` §3 IN-11 (L28–32), §5 hợp đồng (L62–63, L75, L134–14x), §6 M7 (L203–212), §8.10 rủi ro. Tiêu chí nghiệm thu milestone nằm ở §6 M7 — phiếu dưới đây chỉ chia việc, không thay thế SPEC.
Chung cho mọi phiếu M7: không sửa/skip test khóa M1–M6 (ngoại lệ duy nhất được phép: thêm 2 trường tên Phím tắt vào fixture/`defaultState`, phải khai báo trong báo cáo). Máy dev không mở được `shortcuts://` → kiểm bằng `window.__lastNav`.

### T-7.1 — Lõi thuần: reminder.ts + shortcutUrl/openShortcut + 2 tên Phím tắt trong state
- Mục tiêu: dựng toàn bộ phần thuần (không UI) của IN-11 theo hợp đồng §5, có unit test phủ đủ.
- Phạm vi file (chỉ được sửa): `src/export/reminder.ts` (mới), `src/export/share.ts`, `src/core/model.ts`, `src/ui/store.ts`, `tests/unit/reminder.test.ts` (mới), `tests/unit/share-url.test.ts` (mới), `tests/unit/model.test.ts`, `tests/unit/store.test.ts`, `tests/unit/backup.test.ts`, `tests/fixtures/**`.
- Giao diện / đầu vào có sẵn: chữ ký hàm ở SPEC §5 L134–14x (`shortcutUrl`, `openShortcut(name, text?)`, `defaultReminderAt`, `reminderWindow`, `reminderText`). Mọi hàm trong `reminder.ts` nhận `now` làm tham số, KHÔNG đọc `Date.now()`. `openShortcut(name)` (1 tham số) phải giữ nguyên hành vi cũ (`input=clipboard`) — IN-6 đang dùng.
- Tiêu chí nghiệm thu:
  [ ] Đủ 2 ô dấu đầu dòng unit ở SPEC §6 M7 (`reminder.test.ts`, `share-url.test.ts`, `model.test.ts`, `backup.test.ts`, `store.test.ts`) — chép đúng từng trường hợp trong SPEC, không tự bịa giá trị khác.
  [ ] `AppState.alarmShortcutName`/`reminderShortcutName` mặc định `ThemBaoThuc`/`ThemLoiNhac`; `normalizeState` bù khi thiếu/rỗng/không phải chuỗi; JSON sao lưu vẫn `version: 1`.
  [ ] `?test=1` → `openShortcut` ghi `window.__lastNav` thay vì điều hướng thật (không đổi hành vi ngoài test).
  [ ] `npm run check` pass; unit pass ở cả 2 múi giờ (script `test` đã chạy 2 lần).
- Lệnh kiểm tra: `npm run check`
- Model: sonnet · Lần thử: 0/3 · Trạng thái: DONE

### T-7.2 — ReminderDialog + gắn vào form Sự kiện + 2 ô tên ở tab Xem trước
- Mục tiêu: hộp thoại chọn thời điểm dùng chung theo IN-11 (SPEC L30, L32), dùng thật ở Sheet sửa/thêm sự kiện.
- Phạm vi file (chỉ được sửa): `src/ui/components/ReminderDialog.tsx` (mới), `src/ui/screens/events/EventsTab.tsx`, `src/ui/screens/Preview.tsx`, `src/i18n/vi.json`, `src/i18n/en.json`, `src/styles.css` (hoặc file CSS tương đương đang dùng).
- Giao diện / đầu vào có sẵn: `export/reminder.ts` từ T-7.1 (đã DONE); `Sheet`/`Toast` có sẵn; testid bắt buộc: `rem-open`, `rem-at`, `rem-alarm`, `rem-reminder`, `rem-none`, `shortcut-alarm-name`, `shortcut-reminder-name`.
- Tiêu chí nghiệm thu:
  [ ] Đúng SPEC L30: `<input type="datetime-local" step="60">` mặc định = `defaultReminderAt`; dòng trạng thái theo `reminderWindow`; đã qua → vô hiệu cả `rem-alarm` + `rem-reminder`; > 24 h → chỉ `rem-alarm` vô hiệu, kèm chữ gợi ý dùng Lời nhắc.
  [ ] Đúng SPEC L32: bấm `rem-alarm`/`rem-reminder` → LƯU form trước (add/update sự kiện) rồi `openShortcut(tên, reminderText(...))`, đóng hộp + Sheet, toast "Đã mở Phím tắt <tên>"; lưu thất bại → không điều hướng. `rem-none` → chỉ đóng hộp, không điều hướng, không lưu thêm gì ngoài hành vi form cũ.
  [ ] `rem-open` vô hiệu khi form chưa hợp lệ (thiếu tiêu đề).
  [ ] Tab Xem trước có 2 ô nhập tên Phím tắt, lưu qua action T-7.1, reload giữ nguyên.
  [ ] Mọi chữ mới qua `t()`, có đủ khóa ở cả `vi.json` và `en.json`; vùng chạm nút ≥ 44 px (iPhone 13 Pro Max).
  [ ] `npm run check` pass.
- Lệnh kiểm tra: `npm run check`
- Model: gemini (làn code, quy định §4b: đủ điều kiện → Gemini trước) · Lần thử: 0/3 · Vòng Gemini: 1/3 · Trạng thái: DONE (Gemini làm phần .tsx; i18n+CSS bù bằng T-7.2b do phiếu ghi sai đường dẫn)

### T-7.3 — Gắn ReminderDialog vào form Việc và form Ghi chú
- Mục tiêu: nút "Nhắc trên iPhone" hoạt động ở hàng nhập Việc và Sheet Ghi chú.
- Phạm vi file (chỉ được sửa): `src/ui/screens/events/TodosTab.tsx`, `src/ui/screens/events/NoteTab.tsx`, `src/core/i18n/vi.json`, `src/core/i18n/en.json`.
- Giao diện / đầu vào có sẵn: `ReminderDialog` từ T-7.2 (dùng lại, KHÔNG viết bản thứ hai); `defaultReminderAt`/`reminderText` xử lý sẵn ba loại (sự kiện / việc / ghi chú).
- Tiêu chí nghiệm thu:
  [ ] Việc: `rem-open` vô hiệu khi ô nhập rỗng; chọn thời điểm → bấm gửi → `addTodo` chạy trước (việc xuất hiện trong danh sách, ô nhập rỗng) rồi mới mở Phím tắt; mặc định thời điểm = hạn lúc 08:00, không hạn → giờ tròn kế tiếp.
  [ ] Ghi chú: `rem-open` vô hiệu khi ghi chú trống; gửi → add/update ghi chú trước rồi mở Phím tắt; payload 3 dòng (thời điểm / tiêu đề ≤ 100 / nội dung ≤ 200, không chứa xuống dòng).
  [ ] Không đụng cử chỉ vuốt / nhấn giữ kéo của M6: `npx playwright test tests/e2e/todo-touch.spec.ts tests/e2e/todo-gestures.spec.ts` pass như cũ.
  [ ] `npm run check` pass.
- Lệnh kiểm tra: `npx playwright test tests/e2e/todo-touch.spec.ts tests/e2e/todo-gestures.spec.ts; npm run check`
- Model: gemini (làn code, §4b) · Lần thử: 0/3 · Vòng Gemini: 1/3 · Trạng thái: DONE (Gemini vòng 1, PASS ngay)

### T-7.4 — Hướng dẫn cài 2 Phím tắt (docs + màn Guide)
- Mục tiêu: Chủ dự án tự cài được 2 Phím tắt mà không cần hỏi lại.
- Phạm vi file (chỉ được sửa): `docs/HUONG-DAN.md`, `src/ui/screens/Guide.tsx`, `src/i18n/vi.json`, `src/i18n/en.json`.
- Giao diện / đầu vào có sẵn: tên mặc định `ThemBaoThuc` / `ThemLoiNhac`; payload = 2–3 dòng ngăn bằng xuống dòng, dòng 1 `YYYY-MM-DD HH:mm`; chuỗi hành động Phím tắt: Split Text (Custom = xuống dòng) → Get Dates from Input → Create Alarm / Add New Reminder.
- Tiêu chí nghiệm thu:
  [ ] `docs/HUONG-DAN.md` có mục `## E.`: từng bước tạo 2 Phím tắt (đặt đúng tên, thứ tự hành động, chỗ dễ sai), cách bật "Nhạy cảm thời gian" (Cài đặt → Thông báo → Lời nhắc), và phần "Nếu không chạy" ứng với SPEC §8.10(c)(d).
  [ ] `Select-String -Path docs/HUONG-DAN.md -Pattern 'ThemBaoThuc|ThemLoiNhac|Create Alarm|Add New Reminder|Split Text'` ≥ 5 dòng.
  [ ] Màn Guide có thẻ Hướng dẫn 7 dùng khóa `guide.reminderTitle` / `guide.reminderBody`, có cả `vi.json` và `en.json`.
  [ ] `npm run check` pass.
- Lệnh kiểm tra: `npm run check`
- Model: gemini (làn code) · Lần thử: 0/3 · Vòng Gemini: 2/3 (vòng 1 sót 3 lỗi hướng dẫn, Quản lý review bắt được) · Trạng thái: DONE

### T-7.END — Kiểm thử tích hợp M7
- Mục tiêu: E2E luồng chính M7 theo đúng 6 kịch bản ở SPEC §6 M7 (ô dấu đầu dòng E2E).
- Phạm vi file (chỉ được sửa): `tests/e2e/m7-reminder.spec.ts` (mới). Lỗi phát hiện ở file nguồn → báo cáo, KHÔNG tự sửa ngoài phạm vi.
- Giao diện / đầu vào có sẵn: `?test=1` + `window.__lastNav`; projects chromium + webkit; thời điểm tính từ `new Date()` trong test, không cắm cứng ngày.
- Tiêu chí nghiệm thu:
  [ ] Đủ 6 kịch bản (1)–(6) trong SPEC §6 M7, pass trên cả chromium và webkit; payload so sánh sau khi giải mã tham số `text=`.
  [ ] `npm run check` pass; không sửa file nguồn, không sửa test cũ.
- Lệnh kiểm tra: `npx playwright test tests/e2e/m7-reminder.spec.ts; npm run check`
- Model: gemini (làn code, §4b) · Lần thử: 0/3 · Vòng Gemini: 1/3 · Trạng thái: DONE (Gemini vòng 1, Quản lý tự chạy lại: 2 passed chromium+webkit)

### Sau T-7.END
- Kiến trúc sư DUYỆT M7 (`docs/bao-cao/M7.md`) → tag `M7-ok` → Chủ dự án `git push` (Quản lý không push được) → Chủ dự án cài 2 Phím tắt theo HUONG-DAN §E và thử tay A–F trên iPhone.
- Làn Gemini: **ĐÃ BẬT mức NHIỀU** từ 2026-09-19 (Chủ dự án yêu cầu ưu tiên Gemini để tiết kiệm token Claude). Phiếu Gemini đã làm: T-7.2, T-7.3, T-7.4 (2 vòng), T-7.END, M7-soat. Soát chéo cuối M7 đã chạy (Gemini Pro, `docs/bao-cao/M7-soat-cheo.md`).

---

## Hạ tầng làn Gemini (2026-09-19, Chủ dự án yêu cầu)

### T-G.1 — `agy-run.sh`: lệnh `song` (kiểm Gemini có đang làm) + `gia-han` (nới hạn giờ)
- Mục tiêu: làm cho quy định `docs/LAN-GEMINI.md` §5b chạy được thật — phân biệt "đang làm" với "treo", và nới hạn giờ thay vì cắt ngang lượt đang chạy tốt.
- Phạm vi file (chỉ được sửa): `scripts/agy-run.sh`, `scripts/test-agy-song.sh` (mới).
- Giao diện / đầu vào có sẵn: `docs/LAN-GEMINI.md` §5b + mục 6 (đặc tả đã chốt); `_worker`, `chay`, `cho`, `ket_qua`, `huy`, `sua_status_chet`, `kill_tree`, `thay_doi`, `LIMIT[...]` trong chính script.
- Tiêu chí nghiệm thu:
  [ ] `bash scripts/agy-run.sh song <tên>` in **đúng một** kết luận ở dòng đầu: `ĐANG LÀM` | `ĐỨNG IM` | `KHÔNG CHẠY`, rồi ≤ 5 dòng bằng chứng (PID sống/chết, giây kể từ lần cuối `<tên>.md`/`.err` đổi, số file cây làm việc đã đổi, phút đã chạy / hạn hiện tại / số lần đã gia hạn). `ĐANG LÀM` = tiến trình sống **và** (đầu ra dài thêm **hoặc** cây làm việc đổi) trong 10 phút qua (ngưỡng đặt tên hằng `IM_LANG=600`).
  [ ] `bash scripts/agy-run.sh gia-han <tên> [phút]` (mặc định 15) nới hạn của lượt ĐANG chạy, in hạn mới + số lần đã gia hạn; **từ chối** khi: lượt không chạy, đã gia hạn 2 lần, hoặc vượt trần tổng (làn code 60 phút, làn khác 45 phút) — thoát mã ≠ 0 kèm lý do.
  [ ] Hạn giờ thành **deadline mềm**: `_worker` canh mốc đọc từ file `<tên>.deadline` (epoch, ghi khi chạy, cập nhật khi `gia-han`) và tự `kill_tree` khi quá mốc; `--print-timeout` truyền cho `agy` đặt theo **trần tối đa** của làn để `agy` không tự cắt trước deadline mềm. Quá deadline vẫn phải cho ra `QUÁ GIỜ` như cũ.
  [ ] `cho` in thêm, ở dòng `ĐANG CHẠY`, phần `— còn <n> phút tới hạn` và nhắc `song` khi đã chạy ≥ 10 phút.
  [ ] `huy`, `ket-qua`, `trang-thai`, `kiem-tra` và mọi hành vi cũ không đổi; `sua_status_chet` vẫn dọn được lượt chết.
  [ ] `scripts/test-agy-song.sh` (chạy được, không cần `agy`, không gọi mạng): giả lập bằng cách tự tạo `docs/gemini-out/<tên>.{status,meta,md,deadline}` trong thư mục tạm → kiểm 5 tình huống: tiến trình sống + đầu ra vừa đổi → `ĐANG LÀM`; sống + không đổi > 600 s → `ĐỨNG IM`; PID chết → `KHÔNG CHẠY`; `gia-han` lần 1 nới đúng số phút; `gia-han` lần 3 bị từ chối (mã ≠ 0). In `OK <n>/5` và thoát 0 khi đủ.
  [ ] `bash -n scripts/agy-run.sh` sạch; `bash scripts/test-agy-song.sh` → `OK 5/5`; không đụng `src/`, `tests/`, `docs/` (thợ khác đang làm ở đó).
- Lệnh kiểm tra: `bash -n scripts/agy-run.sh; bash scripts/test-agy-song.sh`
- Model: sonnet — KHÔNG giao Gemini, lý do cụ thể: (1) đây là chính script chạy Gemini, Gemini tự sửa hạ tầng chạy mình thì hỏng là mất luôn đường chạy lại; (2) lúc giao, cây git chưa sạch (T-7.1 đang chạy) nên script từ chối nhận lượt Gemini. · Lần thử: 1/3 · Trạng thái: DONE

### T-G.2 — `scripts/kiem-bao-mat.sh`: cổng bảo mật trước deploy chạy được bằng lệnh
- Mục tiêu: biến "Cổng bảo mật trước khi deploy" trong `CLAUDE.md` thành một lệnh chạy được, để không lần push nào bỏ sót.
- Phạm vi file (chỉ được sửa): `scripts/kiem-bao-mat.sh` (mới), `scripts/test-kiem-bao-mat.sh` (mới).
- Giao diện / đầu vào có sẵn: `CLAUDE.md` mục "Cổng bảo mật trước khi deploy" (5 nhóm kiểm + ngoại lệ đã chốt) — là đặc tả, làm đúng theo đó.
- Tiêu chí nghiệm thu:
  [ ] `bash scripts/kiem-bao-mat.sh` soát cả 5 nhóm trên cây làm việc + `git diff origin/main..HEAD` (không có `origin/main` → soát từ commit đầu), in dòng cuối `BẢO MẬT: SẠCH` (mã 0) hoặc `BẢO MẬT: CHẶN — <n> phát hiện` (mã ≠ 0) kèm danh sách `file:dòng · loại phát hiện · trích 1 dòng đã che bớt`.
  [ ] Không báo nhầm ngoại lệ đã chốt: Google OAuth **Client ID** phía client (chuỗi `*.apps.googleusercontent.com`) → KHÔNG chặn; `client_secret` → chặn.
  [ ] Ghi log đầy đủ ra `docs/test-log/bao-mat-<commit ngắn>.log`, in đường dẫn ở dòng cuối.
  [ ] Có `--ci` để chạy im lặng (chỉ in dòng kết luận) và `--all` để soát cả file đã bị `.gitignore` bỏ qua (cảnh báo riêng, không chặn).
  [ ] `scripts/test-kiem-bao-mat.sh` (không cần mạng, tự dọn): ít nhất 6 ca — client_secret → CHẶN; PRIVATE KEY → CHẶN; `.env` có nội dung → CHẶN; Client ID googleusercontent → SẠCH; email/số điện thoại thật trong fixture → CHẶN; kho sạch → SẠCH (mã 0). In `OK <n>/6`.
  [ ] `bash -n` sạch cả 2 file; `bash scripts/test-kiem-bao-mat.sh` → `OK 6/6`; chạy `bash scripts/kiem-bao-mat.sh` trên kho hiện tại phải ra `BẢO MẬT: SẠCH` (nếu không sạch → dừng, báo Quản lý, KHÔNG tự xóa gì).
- Lệnh kiểm tra: `bash -n scripts/kiem-bao-mat.sh; bash -n scripts/test-kiem-bao-mat.sh; bash scripts/test-kiem-bao-mat.sh; bash scripts/kiem-bao-mat.sh`
- Model: gemini (làn code — đủ điều kiện §4b: tiêu chí rõ, có test chạy được, 2 file, không đụng thiết kế) · Lần thử: 0/3 · Vòng Gemini: 0/3 · Trạng thái: TODO — chờ T-7.2 xong (Gemini chỉ chạy một lượt mỗi lần, cây phải sạch)

### T-7.2b — Bổ sung i18n + CSS cho ReminderDialog (vá hậu quả phiếu T-7.2 ghi sai đường dẫn)
- Mục tiêu: hộp thoại nhắc hiện đúng chữ VI/EN và có kiểu dáng dùng được trên iPhone; hoàn tất T-7.2.
- Phạm vi file (chỉ được sửa): `src/core/i18n/vi.json`, `src/core/i18n/en.json`, `src/ui/styles.css`. (Đường dẫn đã xác minh bằng `git ls-files` — BAI-HOC 2026-09-19.)
- Giao diện / đầu vào có sẵn: `src/ui/components/ReminderDialog.tsx`, `src/ui/screens/events/EventsTab.tsx`, `src/ui/screens/Preview.tsx` (đã có, KHÔNG sửa) — đọc để lấy đúng khóa và tên class đang dùng.
- Tiêu chí nghiệm thu:
  [ ] 12 khóa có đủ ở CẢ `vi.json` và `en.json`: `reminder.open`, `reminder.title`, `reminder.at`, `reminder.alarm`, `reminder.reminder`, `reminder.none`, `reminder.openedToast`, `reminder.statusPast`, `reminder.statusAlarmOk`, `reminder.statusReminderOnly`, `preview.shortcutAlarmName`, `preview.shortcutReminderName`.
  [ ] 4 class có trong `src/ui/styles.css`: `rem-backdrop`, `rem-dialog`, `rem-actions`, `rem-none-btn`; hộp thoại nổi trên Sheet (z-index cao hơn), nền mờ, bo góc, rộng tối đa 92vw, nằm trong vùng an toàn iPhone; mỗi nút cao ≥ 44 px; nút vô hiệu thấy rõ là vô hiệu (mờ + `cursor:not-allowed`).
  [ ] `grep -o "t('[a-zA-Z.]*'" src/ui/components/ReminderDialog.tsx src/ui/screens/Preview.tsx src/ui/screens/events/EventsTab.tsx` → mọi khóa đều có trong cả 2 file json (tự kiểm, ghi kết quả vào báo cáo).
  [ ] `npm run check` pass.
- Lệnh kiểm tra: `npm run check`
- Model: sonnet — không giao Gemini, lý do: cây git đang có thay đổi chưa commit của T-7.2, làn Gemini đòi cây sạch (điều kiện 4). · Lần thử: 0/3 · Trạng thái: DONE

### T-7.5 — Ghi dữ liệu xuống đĩa TRƯỚC khi rời app sang Phím tắt (soát chéo M7 #1)
- Mục tiêu: đóng nguy cơ mất dữ liệu khi bấm "Thêm báo thức"/"Thêm lời nhắc" — iOS có thể đóng PWA ngay khi chuyển sang app Phím tắt, trong khi `createStore` còn đang chờ debounce 300 ms.
- Bằng chứng: `src/ui/store.ts:230-244` — `dispatch` chỉ gọi `schedulePersist()` (chờ 300 ms); `flushPersist()` là hàm NỘI BỘ, không nằm trong object trả về (`store.ts:259-270`) nên UI không gọi được; nó chỉ chạy qua `pagehide`/`visibilitychange` và `void saveState(state)` không được chờ. `src/ui/components/ReminderDialog.tsx:47-58` gọi `openShortcut` ngay sau `onSave()`.
- Phạm vi file (chỉ được sửa, đã xác minh bằng `git ls-files`): `src/ui/store.ts`, `src/ui/components/ReminderDialog.tsx`, `tests/unit/store.test.ts`, `tests/e2e/m7-reminder.spec.ts`.
- Giao diện / đầu vào có sẵn: `saveState` (đã dùng trong store), `PERSIST_DEBOUNCE_MS = 300`, `window.__lastNav` khi `?test=1`.
- Tiêu chí nghiệm thu:
  [ ] `createStore` trả thêm `flush(): Promise<void>` — hủy timer đang chờ (nếu có) và **await** `saveState(state)`; gọi khi không có gì chờ cũng an toàn (vẫn ghi trạng thái hiện tại hoặc trả về ngay, tự chọn và ghi rõ trong báo cáo). `pagehide`/`visibilitychange` vẫn hoạt động như cũ.
  [ ] `ReminderDialog.handleAction`: sau khi `onSave()` thành công → **await `flush()`** → rồi mới `openShortcut(...)`. Lưu thất bại thì vẫn không điều hướng (giữ hành vi cũ). Thứ tự bắt buộc: lưu → ghi đĩa → điều hướng.
  [ ] Unit `store.test.ts`: dispatch rồi gọi `flush()` → `saveState` đã được gọi TRƯỚC khi hết 300 ms (dùng fake timers hoặc spy, không dùng `sleep` thật).
  [ ] E2E `m7-reminder.spec.ts`: thêm kiểm chứng — sau khi bấm `rem-alarm` ở kịch bản 3, đọc IndexedDB NGAY (không chờ 300 ms) và thấy việc "Mua sữa" đã nằm trong trạng thái đã lưu. Giữ nguyên 6 kịch bản cũ, không sửa ý nghĩa của chúng.
  [ ] `npm run check` pass; không sửa/skip test khóa nào khác.
- Lệnh kiểm tra: `npm run check`
- Model: sonnet — KHÔNG giao Gemini, lý do cụ thể: đây là đường ghi dữ liệu xuống đĩa, hỏng thì mất dữ liệu người dùng (mức S1 theo CLAUDE.md), và phải sửa đồng thời hợp đồng `createStore` dùng chung toàn app — thuộc loại "đổi interface dùng chung" bị loại theo LAN-GEMINI mục 3 điều kiện 3. · Lần thử: 0/3 (1 phản biện CHẤP NHẬN, D-033) · Trạng thái: DONE

### T-7.6 — Nút "Đặt hình nền" cũng ghi dữ liệu xuống đĩa trước khi rời app (Chủ dự án yêu cầu)
- Mục tiêu: đóng nốt cùng loại rủi ro mất dữ liệu ở nút "Đặt hình nền" (IN-6), giống T-7.5 đã làm cho nút nhắc.
- Bằng chứng: `src/ui/screens/Preview.tsx:221-230` — `onSetWallpaper` gọi `openShortcut(state.shortcutName)` ngay sau `copyPng`, không `flush()`; thay đổi thiết kế/ảnh nền vừa chỉnh còn nằm trong debounce 300 ms của `createStore`.
- Phạm vi file (chỉ được sửa, đã xác minh): `src/ui/screens/Preview.tsx`, `tests/e2e/share.spec.ts`.
- Giao diện có sẵn: `store.flush(): Promise<void>` (T-7.5, `store.ts`).
- Tiêu chí nghiệm thu:
  [ ] `onSetWallpaper`: sau khi `copyPng` thành công → `await store.flush()` → rồi `openShortcut(...)`. `copyPng` thất bại → giữ nguyên hành vi cũ (báo lỗi, không điều hướng, không cần flush).
  [ ] `flush()` ném lỗi không được chặn việc mở Phím tắt (cùng cách xử lý như `ReminderDialog`: nuốt lỗi, vẫn điều hướng) — trạng thái trong RAM vẫn đúng và `pagehide` còn một lần ghi nữa.
  [ ] **Rủi ro phải kiểm**: chèn `await` giữa thao tác chạm và `location.href` có thể làm Safari/iOS coi là mất "user activation" và chặn mở `shortcuts://`. Kiểm `tests/e2e/share.spec.ts` vẫn pass trên cả chromium và webkit; nếu thấy dấu hiệu bị chặn → PHẢN BIỆN, đừng tự đổi thiết kế.
  [ ] `tests/e2e/share.spec.ts`: thêm kiểm chứng sau khi bấm "Đặt hình nền", đọc IndexedDB NGAY thấy trạng thái đã lưu (dùng lại cách `readSavedState` trong `tests/e2e/m7-reminder.spec.ts`). Giữ nguyên các ca cũ.
  [ ] `npm run check` pass.
- Lệnh kiểm tra: `npx playwright test tests/e2e/share.spec.ts; npm run check`
- Model: sonnet — KHÔNG giao Gemini, lý do: Kiến trúc sư đang chạy duyệt M7 và có thể ghi `docs/SPEC.md` bất cứ lúc nào → không đảm bảo được "cây git sạch" mà làn Gemini đòi (điều kiện 4), giao Gemini lúc này có nguy cơ script hoàn tác mất phần Kiến trúc sư vừa sửa. · Lần thử: 0/3 · Trạng thái: DONE

### T-7.7 — `reminderText` cắt chuỗi làm vỡ emoji → không mở được Phím tắt (Kiến trúc sư duyệt M7)
- Mục tiêu: tiêu đề/ghi chú có emoji (hoặc ký tự ngoài BMP) ở đúng biên 100/200 ký tự không làm hỏng việc mở Phím tắt.
- Bằng chứng (Kiến trúc sư tự thử bằng node): `src/export/reminder.ts:84-86` cắt bằng `s.slice(0, max)` theo đơn vị UTF-16 → emoji ở biên bị cắt còn nửa cặp (surrogate lẻ) → `encodeURIComponent` trong `shortcutUrl` ném `URIError` → app đã hiện toast "Đã mở Phím tắt" nhưng thực tế KHÔNG mở được, người dùng tưởng đã đặt báo thức.
- Phạm vi file (chỉ được sửa, đã xác minh): `src/export/reminder.ts`, `tests/unit/reminder.test.ts`.
- Tiêu chí nghiệm thu:
  [ ] Cắt theo ký tự hiển thị, không theo đơn vị UTF-16: dùng `Array.from(s).slice(0, max).join('')` (hoặc cách tương đương an toàn với cặp thay thế).
  [ ] Unit mới: tiêu đề gồm emoji lặp sao cho biên rơi vào GIỮA một emoji → `reminderText(...)` trả chuỗi mà `encodeURIComponent` KHÔNG ném lỗi, và chuỗi không chứa ký tự thay thế lẻ. Làm tương tự cho ghi chú ở biên 200.
  [ ] Các ca cắt 100/200 đã có vẫn pass (không đổi ý nghĩa test cũ).
  [ ] `npm run check` pass.
- Lệnh kiểm tra: `npm run check`
- Model: sonnet — không giao Gemini: phiếu nhỏ, cần chắc tay về UTF-16/cặp thay thế, và đang chạy song song với T-7.6 nên cây git không sạch. · Lần thử: 0/3 · Trạng thái: DONE

---

## M8 — Báo thức đúng ngày qua Lời nhắc + Tự động hóa (SPEC v1.9, D-034) — XONG (tag `M8-ok` 2026-09-22) (bắt đầu 2026-09-19, M7 đã đóng; Chủ dự án chọn M8 trước B-011)
**Điều kiện bắt đầu (Chủ dự án chốt 2026-09-19): chỉ soạn phiếu chi tiết và giao thợ SAU KHI Chủ dự án thử tay M7 (A–F, B′) trên iPhone xong và M7 đã đóng.** Lý do: M8 xây trên đúng cơ chế Phím tắt của M7 — nền hỏng thì xây tiếp là phí.

Chủ dự án đã duyệt SPEC v1.9 và chốt: lời nhắc trong danh sách `BaoThuc` **được đánh dấu hoàn thành** ngay khi sinh báo thức (chống tạo trùng; đánh đổi: hôm đó chỉ báo thức kêu, lời nhắc không báo nữa) — khớp giả định Kiến trúc sư, không phải sửa SPEC.

Phiếu dự kiến (Kiến trúc sư đề xuất; soạn chi tiết khi khởi động M8 — nhớ xác minh đường dẫn bằng `git ls-files` trước khi giao, BAI-HOC 2026-09-19):
- **T-8.1** — lõi thuần `dayAlarmWindow` (`past|today|too-early|ok`, KHÔNG sửa `reminderWindow`) + `AppState.dayAlarmShortcutName` (`ThemBaoThucNgay`) + action + `tests/unit/dayalarm.test.ts` · gemini
- **T-8.2** — nút `rem-dayalarm` (đặt GIỮA 2 nút cũ) + chú thích tĩnh dưới mỗi nút + dòng trạng thái 5 trạng thái + ô `shortcut-dayalarm-name` ở Preview + i18n + CSS (8 file; đường dẫn đúng: `src/core/i18n/*.json`, `src/ui/styles.css`) · gemini
- **T-8.3** — `docs/HUONG-DAN.md` §E.3 (Phím tắt `ThemBaoThucNgay` + `TaoBaoThucSang` + Tự động hóa 00:05) + thẻ Hướng dẫn · gemini · ∥ T-8.2
- **T-8.END** — `tests/e2e/m8-dayalarm.spec.ts`, dùng `page.clock.setFixedTime` · gemini, Quản lý tự chạy lại
- Thử tay iPhone G1–G5 (sau khi xong A–F của M7).

Lưu ý thiết kế đã chốt (SPEC v1.9 §5, §8.11): payload KHÔNG đổi (`reminderText` giữ nguyên) — danh sách đích do Phím tắt thứ ba ghim, thêm dòng vào payload sẽ phá "Cách B" của mục E. Phím tắt `TaoBaoThucSang` tách khỏi Automation để bấm thử tay được ngay.

### T-8.1 — Lõi `dayAlarmWindow` + `AppState.dayAlarmShortcutName` + action
- Mục tiêu: phần thuần + trạng thái của IN-12 (SPEC §3 IN-12, §6 M8).
- Phạm vi file (chỉ được sửa, đã xác minh `git ls-files`): `src/export/reminder.ts`, `src/core/model.ts`, `src/ui/store.ts`, `tests/unit/dayalarm.test.ts` (mới). KHÔNG sửa test cũ.
- Giao diện / đầu vào có sẵn: `reminder.ts` có `LocalDateTime` (`YYYY-MM-DDTHH:mm` giờ máy), `reminderWindow(at, now)` — đọc để lấy cách parse `at`, KHÔNG sửa. `model.ts`: `AppState.alarmShortcutName`/`reminderShortcutName` (L91–92), `defaultState` (~L136), `normalizeState` (~L193–213) — lặp đúng mẫu. `store.ts`: action `setReminderShortcutName` (~L210) — lặp đúng mẫu (kiểu action + case). Sao lưu: `src/storage/backup.ts` (`exportBackup`/`importBackup`, đi qua `normalizeState`) — KHÔNG sửa.
- Yêu cầu:
  - `reminder.ts`: `export const DAY_ALARM_MIN_TIME = '00:30'`; `export type DayAlarmWindow = 'past' | 'today' | 'too-early' | 'ok'`; `export function dayAlarmWindow(at: LocalDateTime, now: Date): DayAlarmWindow` — thứ tự: `at` ≤ now → `past`; ngày của `at` = ngày của `now` (giờ máy) → `today`; giờ trong ngày của `at` < `DAY_ALARM_MIN_TIME` → `too-early`; còn lại `ok`. Không chặn theo 24 h.
  - `model.ts`: `dayAlarmShortcutName: string` (mặc định `'ThemBaoThucNgay'`), `normalizeState` bù mặc định khi thiếu / rỗng / không phải chuỗi.
  - `store.ts`: action `{ type: 'setDayAlarmShortcutName'; name: string }`.
- Tiêu chí nghiệm thu:
  [ ] `dayalarm.test.ts` với `now = new Date(2026, 9, 5, 10, 0)`: `at`=`2026-10-05T10:00` → past; `2026-10-05T23:59` → today; `2026-10-06T00:29` → too-early; `2026-10-06T00:30` → ok; `2026-10-06T09:00` → ok; `2026-10-08T07:00` → ok; `now = new Date(2026, 9, 5, 23, 50)` + `2026-10-06T00:40` → ok.
  [ ] `normalizeState`: thiếu / `42` / `''` → `ThemBaoThucNgay`; `'Hen Bao Thuc'` → giữ. `exportBackup` → `importBackup` giữ tên đã đổi. Reducer `setDayAlarmShortcutName` đặt tên mới, state cũ không đổi.
  [ ] `reminderWindow`, `reminderText` không đổi một dòng; test cũ pass nguyên vẹn.
- Lệnh kiểm tra: `npx vitest run tests/unit/dayalarm.test.ts` ; `npm run check`.
- Model: gemini (làn code — 4 file, tiêu chí rõ, test chạy được) · Lần thử: 0/3 · Vòng Gemini: 1/3 · Trạng thái: DONE
- Nhật ký: 2026-09-19 vòng 1 (gemini-3.8-flash-high, 7 phút): XONG → kiem-thu PASS (dayalarm 7/7 ×2 TZ; check 100/14 skip; hàm cũ không đổi) → review đạt → commit.

### T-8.2 — Nút `rem-dayalarm` + chú thích + dòng trạng thái + ô tên Phím tắt thứ ba
- Mục tiêu: UI của IN-12 (SPEC §3 IN-12 gạch 1 và 4).
- Phạm vi file (chỉ được sửa, đã xác minh): `src/ui/components/ReminderDialog.tsx`, `src/ui/screens/events/EventsTab.tsx`, `src/ui/screens/events/TodosTab.tsx`, `src/ui/screens/events/NoteTab.tsx`, `src/ui/screens/Preview.tsx`, `src/core/i18n/vi.json`, `src/core/i18n/en.json`, `src/ui/styles.css`.
- Giao diện / đầu vào có sẵn: T-8.1 (`dayAlarmWindow`, `state.dayAlarmShortcutName`, action `setDayAlarmShortcutName`). `ReminderDialog` hiện có `handleAction(kind)` (lưu form → `await flush()` → đóng → toast → `openShortcut`) — dùng lại, chỉ thêm kind thứ ba chọn `dayAlarmShortcutName`.
- Yêu cầu: (1) prop BẮT BUỘC `dayAlarmShortcutName` của `ReminderDialog`; 3 form mỗi form thêm đúng 1 dòng truyền `state.dayAlarmShortcutName`. (2) Thứ tự nút: `rem-alarm` · `rem-dayalarm` · `rem-reminder` · không báo thức. `rem-dayalarm` bật chỉ khi `dayAlarmWindow` = `ok`; 2 nút cũ giữ quy tắc `reminderWindow`. (3) Dưới mỗi nút hành động 1 dòng chú thích tĩnh `rem-hint-alarm` / `rem-hint-dayalarm` / `rem-hint-reminder` (VI: "Đồng hồ, kêu to · chỉ trong 24 giờ tới" / "Kêu to vào ngày xa hơn · cần Tự động hóa (§E.3)" / "Thông báo nhẹ · mọi ngày"; EN tương đương, ≤ 45 ký tự). (4) `rem-status` một câu, ưu tiên: past → "Thời điểm này đã qua…"; today → "Hôm nay: dùng Thêm báo thức (kêu to) hoặc Thêm lời nhắc."; too-early → "Báo thức đúng ngày cần giờ từ 00:30 (Tự động hóa chạy 00:05)."; alarm-ok → "Trong 24 giờ tới: cả ba cách đều được."; còn lại → "Quá 24 giờ: dùng Báo thức đúng ngày (kêu to) hoặc Thêm lời nhắc.". Nhãn nút VI "Báo thức đúng ngày", EN "Alarm on that day". (5) Preview: ô `shortcut-dayalarm-name` thứ ba, lặp đúng mẫu ô `reminderShortcutName` (~L40, L62, L298). (6) Mọi chữ qua `t()`, đủ VI + EN; vùng chạm ≥ 44 px; chữ đọc được trên nền tối ở 428 pt.
- Tiêu chí nghiệm thu: [ ] các yêu cầu (1)–(6) · [ ] `m7-reminder.spec.ts` pass nguyên vẹn · [ ] `npm run check` pass.
- Lệnh kiểm tra: `npx playwright test tests/e2e/m7-reminder.spec.ts` ; `npm run check`.
- Model: gemini (8 file) · Lần thử: 0/3 · Vòng Gemini: 1/3 · Trạng thái: DONE
- Nhật ký: 2026-09-19 vòng 1 (gemini-3.8-flash-high, 8 phút): XONG → kiem-thu PASS (m7-reminder 2/2; check 100/14 skip; prop bắt buộc, 3 form 1 dòng, i18n đủ) → review đạt (thứ tự trạng thái khớp SPEC) → commit. S4: khóa `reminder.statusReminderOnly` còn trong json nhưng không dùng nữa.

### T-8.3 — `docs/HUONG-DAN.md` §E.3 + thẻ Hướng dẫn
- Phạm vi file: `docs/HUONG-DAN.md` (thêm §E.3 sau §E.2 và phần "Bật Nhạy cảm…"/"Nếu không chạy" của E; thêm 4 rủi ro §8.11(a)–(d) vào "Giới hạn đã biết"), `src/ui/screens/Guide.tsx`, `src/core/i18n/vi.json`, `src/core/i18n/en.json` (`guide.dayAlarmTitle`, `guide.dayAlarmBody`).
- Nội dung §E.3 theo SPEC §3 IN-12 gạch "Phía iPhone" + §10.E: tạo danh sách Reminders `BaoThuc`; `ThemBaoThucNgay` = Duplicate `ThemLoiNhac` (bản đã sửa B-014, dùng `GioNhac`/`TieuDe`) chỉ đổi danh sách thành `BaoThuc`; `TaoBaoThucSang` (Find Reminders: List is BaoThuc, Due Date is Today, Is Completed is No, sort Due Date → Repeat with Each → If Due Date is after Current Date → Create Alarm (Time = Due Date, Label = Title) → Edit Reminder: Is Completed = Yes → End If → End Repeat); Tự động hóa "Time of Day" 00:05 Daily, Run Immediately, tắt Notify When Run → Run Shortcut `TaoBaoThucSang`. Mục "Thử ngay" (G1) và "Nếu không chạy" (G5: thêm Edit Reminder Set Due Date = GioNhac). Văn phong song ngữ như E.2; ưu tiên `Set Variable` đặt tên, không dùng Select Variable.
- Tiêu chí nghiệm thu: [ ] `Select-String` 10 mẫu trong SPEC §6 M8 ≥ 9 dòng · [ ] có "Thử ngay" và "Nếu không chạy" · [ ] 4 rủi ro (a)–(d) · [ ] `guide.dayAlarmTitle`/`Body` đủ VI/EN, hiện trong tab Hướng dẫn · [ ] `npm run check` pass.
- Lệnh kiểm tra: `grep -c -E "ThemBaoThucNgay|TaoBaoThucSang|BaoThuc|Find Reminders|Repeat with Each|Create Alarm|Edit Reminder|Run Immediately|Notify When Run|00:05" docs/HUONG-DAN.md` ; `npm run check`.
- Model: gemini → sonnet · Lần thử: 0/3 · Vòng Gemini: 1/3 · Trạng thái: DONE
- Nhật ký: 2026-09-19 vòng 1 Gemini TRỐNG (3 phút, không sửa file — lỗi làn lần 1) → chuyển tho-sonnet ngay (quy tắc trạng thái khác XONG) → DONE → kiem-thu PASS (grep 29; check 290 unit / 100 e2e / 14 skip; E.2 không đụng) → review nội dung E.3 đạt → commit.

### T-8.END — E2E `tests/e2e/m8-dayalarm.spec.ts`
- Phạm vi file: `tests/e2e/m8-dayalarm.spec.ts` (mới). Không sửa src.
- Tiêu chí nghiệm thu: đúng 7 kịch bản SPEC §6 M8 (E2E T-8.END), chromium + webkit, `page.clock.setFixedTime(new Date('2026-10-05T10:00:00'))`; `npx playwright test tests/e2e/m8-dayalarm.spec.ts --repeat-each=3` pass; `npm run check` pass; `node scripts/size.mjs` JS gzip < 150 KB.
- Model: gemini · Lần thử: 0/3 · Vòng Gemini: 3/3 · Trạng thái: DONE
- Nhật ký: 2026-09-19 vòng 1 FAIL 2 kịch bản (Gemini tự báo) → vòng 2 (chờ-fill-xác nhận) Gemini báo PASS nhưng kiem-thu FAIL webkit 3/6 (giá trị `at` cũ bị effect ghi đè; đọc `__lastNav` cũ) → vòng 3: helper `setRemAt` (toPass) + poll `__lastNav` → kiem-thu PASS (repeat-each=5: 5 chromium + 5 webkit; check 102/14 skip; size 39.7 KB gzip) → commit. Cây phải sạch cho agy → Quản lý cất bản test dở vào `docs/tasks/T-8.END-v*.spec.ts.txt` giữa các vòng.

### T-8.4 — Sửa `docs/HUONG-DAN.md` §E.3 theo giao diện iPhone thật (sau G1–G4)
- Mục tiêu: hướng dẫn §E.3 khớp đúng những gì Chủ dự án đã làm được trên iPhone (iOS 18, máy tiếng Anh) — G1–G4 ĐẠT 2026-09-21/22.
- Phạm vi file (chỉ được sửa): `docs/HUONG-DAN.md` — CHỈ từ dòng `#### Bước 3 — Phím tắt \`TaoBaoThucSang\`` tới hết đoạn "Nếu không chạy" của §E.3 (trước `---` / `## Quy trình dùng hằng ngày`), cộng gạch rủi ro **(b)** trong "Giới hạn đã biết". Không sửa chỗ khác (E.1, E.2, Bước 1–2 giữ nguyên).
- Sự thật máy thật (bắt buộc dùng đúng chữ):
  1. Find Reminders: bộ lọc `List is BaoThuc`; `Due Date` chọn toán tử **`is today`**; mục **`Is Not Completed`** (một mục, KHÔNG phải "Is Completed is No"); Sort by Due Date.
  2. Hành động tạo báo thức hiện là **"Create an Alarm for <Due Date> called <Repeat Item>"**: ô thời gian gán `Repeat Item › Due Date`; ô "called" chạm vào, xóa chữ "Alarm" có sẵn, chọn `Repeat Item` (Title là thuộc tính mặc định nên token vẫn hiện chữ "Repeat Item" — đúng, không phải lỗi).
  3. Đánh dấu hoàn thành: hành động **"Set <Detail> of <Reminder>"** → "Set **Is Completed** of **Repeat Item** to **Yes**". Cảnh báo: mặc định là **No** — phải chạm đổi thành Yes (bẫy). Bỏ tên "Edit Reminder".
  4. Muốn đặt hành động vào TRONG khối Repeat/If: thêm hành động rồi **nhấn giữ – kéo – thả** vào giữa `If` và `Otherwise`/`End If` (thụt vào trong).
  5. Bước 4 (iOS 17/18, không còn "Create Personal Automation"): Automation › **+** › **Time of Day** › 00:05, **Daily** › **Run Immediately** › tắt **Notify When Run** › **Next** › chọn thẳng phím tắt `TaoBaoThucSang` (không cần thêm "Run Shortcut").
  6. Thêm lưu ý ở Bước 2 hoặc "Nếu không chạy": **không bấm ▶ chạy thử `ThemBaoThucNgay`** — sẽ báo lỗi "No title was provided" vì chạy tay không có đầu vào; chỉ chạy nó từ nút trong LichKhoa. (Được phép sửa thêm đúng 1 dòng này ở cuối Bước 2.)
  7. Gạch "(G5 …)" cuối "Nếu không chạy" về Edit Reminder/Set Due Date: đổi chữ "Edit Reminder" thành hành động "Set <Detail> of <Reminder>" (Detail = Due Date).
- Tiêu chí nghiệm thu:
  [ ] Bước 3 viết lại theo 1–4; giữ văn phong song ngữ Anh (Việt), giữ đoạn "Thử ngay".
  [ ] Bước 4 viết lại theo 5.
  [ ] Có lưu ý 6; gạch 7 đã đổi.
  [ ] Rủi ro (b) đổi "`Is Completed is No`" → "`Is Not Completed`" và "Edit Reminder: Set Is Completed = Yes" → "Set Is Completed of Repeat Item to Yes".
  [ ] Không dữ liệu thật của Chủ dự án.
- Lệnh kiểm tra: `grep -n "Is Completed is No\|Edit Reminder\|Create Personal Automation\|Due Date is Today" docs/HUONG-DAN.md` → rỗng · `grep -c "Is Not Completed\|is today\|Create an Alarm for\|to \*\*Yes\*\*\|No title was provided" docs/HUONG-DAN.md` ≥ 5 · `git diff --stat` chỉ `docs/HUONG-DAN.md` · `npm run check` pass.
- Model: gemini → sonnet · Lần thử: 0/3 · Vòng Gemini: 1/3 · Trạng thái: DONE
- Nhật ký: 2026-09-22 vòng 1 Gemini LỖI (không sửa file; lỗi làn lần 1 phiên này) → chuyển tho-sonnet ngay → DONE → kiem-thu PASS (grep cấm rỗng; grep mẫu 5; diff chỉ HUONG-DAN đúng vùng; check 104/14 skip; `docs/test-log/T-8.4.txt`) → review đạt → commit. **M8 ĐÓNG — tag `M8-ok`.**

---

## Bảo trì 2026-09-19 — Chủ dự án thử tay M7 trên iPhone (iOS 18, máy tiếng Anh)
Kết quả: A ĐẠT · B/B′/C KHÔNG ĐẠT (SC-003) · D ĐẠT · E chưa kết luận được (phụ thuộc B). Kèm 4 lỗi giao diện tab Việc. Ảnh: `docs/hinh-anh-loi/`.

### B-009 — Sửa hướng dẫn Phím tắt: bước bật nhắc theo THỜI GIAN (đóng SC-003)
- Mục tiêu: Chủ dự án cài lại `ThemLoiNhac` theo hướng dẫn và tạo được lời nhắc, hết lỗi "No alert location was provided".
- Nguyên nhân (tra cứu, mức chắc chắn TRUNG BÌNH — Apple Community + Automators + Matthew Cassinelli): trong "Add New Reminder", nếu gán thẳng biến ngày giờ mà không bật kiểu nhắc, iOS hiểu là nhắc theo VỊ TRÍ. Phải: chạm ô **"No Alert"** → chọn **"Alert"** (hoặc "Remind me at a time") → hiện ô **"At Time"** → gán biến ngày giờ vào ô đó.
- Phạm vi file (chỉ được sửa, đã xác minh): `docs/HUONG-DAN.md`.
- Tiêu chí nghiệm thu:
  [ ] Mục E (cả Cách A và Cách B của `ThemLoiNhac`, và phần `ThemBaoThucNgay` nếu có) mô tả rõ 3 bước: chạm **"No Alert"** → chọn **"Alert" / "Remind me at a time"** → gán biến vào ô **"At Time"**. Kèm tên tiếng Anh chính xác vì máy Chủ dự án đang để tiếng Anh.
  [ ] Cảnh báo riêng: KHÔNG gán biến ngày giờ trực tiếp vào ô "No Alert" — đó chính là nguyên nhân lỗi, kèm nguyên văn thông báo lỗi để người đọc nhận ra.
  [ ] Ghi chú iOS 18: có hành động mới **"Create Reminder"** tách riêng "All-Day"/"Due Date"; nếu máy hiện hành động này thì dùng nó cũng được — nêu như phương án dự phòng, không bắt buộc.
  [ ] Mục "Nếu không chạy" thêm gạch đầu dòng cho đúng thông báo lỗi "No alert location was provided" → chỉ thẳng sang bước sửa ở trên.
  [ ] `Select-String -Path docs/HUONG-DAN.md -Pattern 'No Alert|At Time|Remind me at a time'` ≥ 3 dòng.
- Lệnh kiểm tra: `npm run check` (phải vẫn pass; đây là sửa tài liệu)
- Model: sonnet — không giao Gemini: đang có sự cố S2 mở, CLAUDE.md cấm gọi làn Gemini khi sự cố mở. · Lần thử: 0/3 · Trạng thái: DONE

### B-010 — Tab Việc: nhãn lệch, ô ngày giờ trắng-trên-trắng, không rõ chỗ sửa việc
- Mục tiêu: sửa 3 lỗi giao diện Chủ dự án báo (mục 1, 2, 4), trên iPhone 13 Pro Max nền tối.
- Bằng chứng: `docs/hinh-anh-loi/IMG_2432.PNG` (nhãn "Hạn" lệch lên so với ô nhập, hàng nhập chật), `IMG_2433.PNG` (ô `rem-at` trong hộp thoại: nền sáng + chữ xám nhạt → gần như không đọc được).
- Phạm vi file (chỉ được sửa, đã xác minh): `src/ui/styles.css`, `src/ui/screens/events/TodosTab.tsx`, `src/core/i18n/vi.json`, `src/core/i18n/en.json`, `tests/e2e/todo-gestures.spec.ts`.
- Tiêu chí nghiệm thu:
  [ ] **Lỗi 2 (nặng nhất)**: mọi `input[type=date]` và `input[type=datetime-local]` trong app đọc được trên nền tối — đặt `color-scheme: dark` (hoặc màu nền/chữ tường minh) cho các ô này, gồm ô `rem-at` trong `ReminderDialog` và ô `todo-due`. Chữ phải tương phản rõ với nền ô.
  [ ] **Lỗi 1**: hàng nhập việc (`Việc mới… / Hạn / Thêm`) — nhãn "Hạn" thẳng hàng với ô nhập (cùng đường giữa), không tràn/chật ở bề ngang 428 pt.
  [ ] **Lỗi 4**: mỗi việc trong danh sách có chỗ SỬA rõ ràng — chạm vào chữ việc mở sửa (hoặc nút sửa riêng), và có dấu hiệu nhìn thấy được rằng chạm được (không chỉ dựa vào cử chỉ ẩn). Không phá cử chỉ M6: `npx playwright test tests/e2e/todo-touch.spec.ts tests/e2e/todo-gestures.spec.ts` vẫn pass.
  [ ] Vùng chạm ≥ 44 px; chữ mới qua `t()` có đủ ở cả `vi.json` và `en.json`.
  [ ] `npm run check` pass.
- Lệnh kiểm tra: `npx playwright test tests/e2e/todo-touch.spec.ts tests/e2e/todo-gestures.spec.ts; npm run check`
- Model: sonnet — không giao Gemini (sự cố S2 đang mở). · Lần thử: 0/3 · Trạng thái: DONE

### B-011 — Việc có GIỜ + sửa được sau khi tạo (Chủ dự án chọn) — CHỜ KIẾN TRÚC SƯ
Chủ dự án chốt 2026-09-19: muốn việc có hạn **ngày + giờ** và sửa lại được sau khi tạo. Đổi `Todo.due` (hiện là ISODate, chỉ ngày) → đụng model, sắp xếp, hình nền, sao lưu JSON, nhãn "Quá hạn/Hôm nay", và `defaultReminderAt` cho việc. **Đổi phạm vi SPEC → phải qua Kiến trúc sư**, gọi sau khi đóng SC-003.

### B-012 — Đổi định dạng dòng 1 của payload sang `d MMM yyyy HH:mm` (đóng SC-003)
- Mục tiêu: iOS đọc được ngày giờ trong payload → lời nhắc tạo được, hết lỗi "No alert location was provided".
- Bằng chứng máy thật (Chủ dự án, iPhone iOS 18, máy tiếng Anh, 2026-09-19): menu kiểu Alert chỉ có `Alert`/`No Alert` (không có loại theo vị trí) → kiểu nhắc đã đúng; lỗi thật là `Get dates from` trả RỖNG vì không nhận dạng được `2026-09-23 14:00`. Thử bằng hành động Text + Quick Look: **`23 Sep 2026 14:00` → hiện đúng "23 Sep 2026 at 14:00"**. Đây là rủi ro SPEC §8.10(d) đã dự liệu ("đổi định dạng trong `reminderText`, 1 hàm, 1 test").
- Phạm vi file (chỉ được sửa, đã xác minh): `src/export/reminder.ts`, `tests/unit/reminder.test.ts`, `tests/e2e/m7-reminder.spec.ts`, `docs/SPEC.md`, `docs/HUONG-DAN.md`.
- Tiêu chí nghiệm thu:
  [ ] Dòng 1 payload đổi từ `YYYY-MM-DD HH:mm` sang **`d MMM yyyy HH:mm`** với tháng viết tắt TIẾNG ANH cố định (`Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec`) — tự sinh trong mã, KHÔNG dùng `toLocaleDateString` (kết quả phụ thuộc máy chạy, sẽ lệch giữa máy dev và iPhone). Ngày không đệm số 0 (`3 Sep 2026`), giờ 24 h có đệm (`08:05`).
  [ ] Dòng 2, dòng 3 và mọi hành vi khác của `reminderText` giữ nguyên (thay `\n`, cắt 100/200 theo ký tự hiển thị).
  [ ] Unit: cập nhật các ca kỳ vọng định dạng cũ; THÊM ca cho ngày 1 chữ số, tháng đầu/cuối năm (Jan, Dec), giờ có đệm 0. Pass ở cả 2 múi giờ.
  [ ] E2E `m7-reminder.spec.ts`: các chỗ so payload sinh chuỗi mong đợi theo định dạng mới, vẫn tính từ `new Date()` (không cắm cứng ngày).
  [ ] `docs/SPEC.md`: sửa MỌI chỗ ghi định dạng dòng 1 (§3 IN-11, §5 hợp đồng `reminderText`, §6 M7 tiêu chí unit/E2E, §8.10(d)) sang định dạng mới, kèm một câu nêu lý do (máy thật không nhận dạng được dạng cũ, 2026-09-19). Không đổi gì khác trong SPEC.
  [ ] `docs/HUONG-DAN.md`: sửa các ví dụ payload sang định dạng mới; mục "Nếu không chạy" (c) nói rõ dạng mới là `23 Sep 2026 14:00`.
  [ ] `npm run check` pass.
- Lệnh kiểm tra: `npm run check`
- Model: sonnet — không giao Gemini (sự cố S2 đang mở). · Lần thử: 0/3 · Trạng thái: DONE (định dạng đúng — Chủ dự án xác nhận Quick Look hiện `23 Sep 2026 08:00`; nhưng SC-003 CHƯA đóng: hành động Add New Reminder của iOS 18 vẫn đòi location)

### B-013 — Tab Việc lượt 2: hàng nhập vẫn lệch, nút Sửa khó thấy (Chủ dự án báo 2026-09-19, sau B-010)
- Mục tiêu: nhìn là biết sửa việc ở đâu; hàng nhập gọn gàng. Chủ dự án nói nguyên văn: "Ô việc mới và ô hạn vẫn bị lệch nhìn mất thẩm mỹ. Việc đã tạo khó sửa lại. Nút sửa hiện ra sau khi vuốt sang trái, nằm cạnh nút xóa/lưu trữ, nhưng màu tối nhìn không rõ. Có hình cây bút để sửa nhưng nhìn nhỏ xíu, nhìn không rõ."
- Bối cảnh: B-010 đã thêm icon ✎ vào chữ việc nhưng quá nhỏ; nút "Sửa" trong dải vuốt trái có màu quá tối so với nền.
- Phạm vi file (chỉ được sửa, đã xác minh): `src/ui/styles.css`, `src/ui/screens/events/TodosTab.tsx`, `src/core/i18n/vi.json`, `src/core/i18n/en.json`.
- Tiêu chí nghiệm thu:
  [ ] **Hàng nhập việc**: "Việc mới…", nhãn "Hạn" + ô hạn, nút "Thêm" nằm cân đối ở bề ngang 428 pt — các ô cùng chiều cao, cùng đường giữa, khoảng cách đều; không còn cảm giác lệch. Nếu chật thì cho xuống 2 dòng gọn gàng thay vì nhồi 1 dòng.
  [ ] **Nút Sửa trong dải vuốt trái**: nền tương phản rõ trên nền tối (không dùng màu tối trên tối), chữ/biểu tượng đọc được, vùng chạm ≥ 44 px, phân biệt rõ với nút Xóa (đỏ) và Lưu trữ.
  [ ] **Icon ✎ trên chữ việc**: to hơn hẳn, đủ tương phản (hoặc thay bằng cách gợi ý rõ hơn). Nhìn lướt phải thấy được là "chạm vào đây sửa được".
  [ ] Không phá cử chỉ M6: `npx playwright test tests/e2e/todo-touch.spec.ts tests/e2e/todo-gestures.spec.ts` pass.
  [ ] Chụp webkit 428×926 trước/sau (tab Việc có ≥ 3 việc, 1 việc đang mở dải vuốt trái) để Quản lý xem bằng mắt; ghi đường dẫn ảnh vào báo cáo (ảnh để trong thư mục tạm, KHÔNG commit vào kho).
  [ ] `npm run check` pass.
- Lệnh kiểm tra: `npx playwright test tests/e2e/todo-touch.spec.ts tests/e2e/todo-gestures.spec.ts; npm run check`
- Model: sonnet — không giao Gemini (sự cố SC-003 còn mở). · Lần thử: 0/3 · Trạng thái: DONE

### B-014 — Viết lại `docs/HUONG-DAN.md` mục E.2 (`ThemLoiNhac`) khớp iOS 18 thật (sau SC-003)
- Mục tiêu: hướng dẫn tạo Phím tắt `ThemLoiNhac` đúng giao diện Chủ dự án đã làm thành công (SC-003 ĐÃ ĐÓNG).
- Phạm vi file (chỉ được sửa): `docs/HUONG-DAN.md` — CHỈ từ dòng `#### Cách A` (mục E.2) tới hết đoạn `### Nếu không chạy` (trước `## Quy trình dùng hằng ngày`). Không sửa chỗ khác.
- Giao diện / đầu vào có sẵn (sự thật đã kiểm trên iPhone iOS 18, máy tiếng Anh):
  - Thứ tự hành động đúng của Cách A: (1) `Split [Shortcut Input] by [New Lines]`; (2) `Get [Item at Index] [1] from [Split Text]`; (3) `Get dates from [Item from List]`; (4) `Get [Item at Index] [1] from [Dates]`; (5) `Set variable [GioNhac] to [Item from List]` — thả ngay dưới (4); (6) `Get [Item at Index] [2] from [Split Text]`; (7) `Set variable [TieuDe] to [Item from List]` — thả ngay dưới (6); (8) `Add [TieuDe] to [<danh sách>] with [Alert] [At Time] [GioNhac]`.
  - Thêm `Set Variable`: gõ "Set Variable" vào ô **Search Actions** ở đáy, kéo thả vào đúng chỗ, chạm **Variable Name** gõ tên.
  - Gán biến vào ô: chạm ô → hiện danh sách (TieuDe, GioNhac, Split Text, Dates, Item from List, Shortcut Input, Ask Each Time, Select Variable…) hoặc hàng nút trên bàn phím → chạm đúng TÊN biến. KHÔNG hướng dẫn dùng `Select Variable` (rối, và có 2 biến cùng tên "Item from List").
  - Ô `Alert` chỉ là công tắc Alert / No Alert → chọn **Alert**. Phần giờ nằm sau chữ `At Time`; nếu thẻ thu gọn thì chạm nút mũi tên tròn **›** để mở rộng (khi mở rộng dòng này hiện là **Trigger**). Chữ xám "2:00 PM" là chữ MẪU = ô đang trống → phải chạm vào và chọn **GioNhac**. Nếu ô đang ghi `Dates` (cả danh sách) → bấm vào, chọn **Clear Variable**, rồi chọn **GioNhac**. Bảng Type Date/Time/Name: giữ **Date**, không chọn Time.
  - Hình dạng đúng cuối cùng: `Add TieuDe to Sẽ làm with Alert At Time GioNhac` (tên danh sách tùy người dùng).
- Tiêu chí nghiệm thu:
  [ ] Cách A viết lại theo 8 hành động trên, giữ song ngữ Anh (Việt) như văn phong hiện có; có dòng "Hình dạng đúng cuối cùng".
  [ ] Cách B: dùng cùng `GioNhac`/`TieuDe` (+ `Set variable GhiChu` cho Item 3) và cách gán ô giờ như Cách A; bỏ mọi chỗ "chạm ô No Alert → chọn Alert / Remind me at a time".
  [ ] Bỏ khối ⚠️ cũ ("gán vào ô No Alert" + phương án "Create Reminder / Due Date"); thay bằng cảnh báo mới: lỗi "No alert location was provided…" nghĩa là ô giờ sau `At Time` đang TRỐNG (chữ xám) hoặc đang gắn `Dates` → sửa theo cách trên.
  [ ] Mục "Nếu không chạy" (e) viết lại cùng nội dung; (d) giữ; mục "Mức độ chắc chắn" bỏ nhắc `Create Reminder`.
  [ ] Không có dữ liệu thật của Chủ dự án (không ảnh, không tên việc thật).
- Lệnh kiểm tra: `grep -c "GioNhac" docs/HUONG-DAN.md` ≥ 4 · `grep -n "Create Reminder\|Remind me at a time\|Due Date" docs/HUONG-DAN.md` rỗng · `git diff --stat` chỉ `docs/HUONG-DAN.md` · `npm run check` pass.
- Model: gemini (làn code — đủ điều kiện: 1 file, tiêu chí rõ, lệnh kiểm tra chạy được, không đổi thiết kế) · Lần thử: 0/3 · Vòng Gemini: 1/3 · Trạng thái: DONE
- Nhật ký: 2026-09-19 vòng 1 (gemini-3.8-flash-high, 6 phút): XONG → kiem-thu PASS (GioNhac ×9; grep cấm rỗng; diff chỉ HUONG-DAN trong phạm vi; check 100/14 skip) → review đạt (8 hành động, Set Variable, Trigger/chữ xám, cảnh báo mới) → commit.

## M9 — Việc có giờ hạn + sửa hạn sau khi tạo (SPEC v1.10, D-035) — XONG (tag `M9-ok`; chờ thử tay H1–H4 sau deploy)
Chủ dự án duyệt 2026-09-19: làm ngay (không chờ G1–G5 của M8); "Quá hạn" theo NGÀY; deploy M8 + M9 gộp một lần. Nguồn chuẩn: SPEC §6 M9 (dòng 245–259) — phiếu dưới chỉ trỏ tới đó, không chép lại. Tuần tự 9.1 → 9.2 → 9.3 → 9.END. Test khóa M1–M8 không sửa/skip.

### T-9.1 — Lõi `Todo.dueTime` + state + `cmpTodo` + `defaultReminderAt`
- Phạm vi file: `src/core/model.ts`, `src/core/collect.ts`, `src/ui/store.ts`, `src/export/reminder.ts`, `tests/unit/todo-time.test.ts` (mới).
- Yêu cầu + tiêu chí: SPEC §6 M9 "Nội dung" (phần model/collect/store/reminder) và gạch tiêu chí 1 (unit `todo-time.test.ts`).
- Lệnh kiểm tra: `npx vitest run tests/unit/todo-time.test.ts` ; `npm run check`.
- Model: gemini · Lần thử: 0/3 · Vòng Gemini: 1/3 · Trạng thái: DONE
- Nhật ký: 2026-09-19 vòng 1 (8 phút) XONG → kiem-thu PASS (todo-time 7/7 ×2 TZ, đủ mọi ca SPEC; check 102/14 skip) → review đạt → commit.

### T-9.2 — `todoDueLabel` có giờ + 3 bố cục
- Phạm vi file: `src/render/layout/common.ts`, `src/render/layout/month.ts`, `src/render/layout/week.ts`, `src/render/layout/todo.ts`, `tests/unit/layout-todo-time.test.ts` (mới).
- Yêu cầu + tiêu chí: SPEC §6 M9 "Nội dung" (nhãn, 3 bố cục, chip Tuần `☐ 14:00`) và gạch tiêu chí 2.
- Lệnh kiểm tra: `npx vitest run tests/unit/layout-todo-time.test.ts` ; `npm run check`.
- Model: gemini · Lần thử: 0/3 · Vòng Gemini: 1/3 · Trạng thái: DONE
- Nhật ký: 2026-09-19 vòng 1 (3 phút) XONG nhưng báo cáo Gemini cụt → kiem-thu kiểm kỹ PASS (11/11 ×2 TZ, đủ ca SPEC; check 102/14 skip; test khóa không đụng) → review diff đạt → commit.

### T-9.3 — UI tab Việc (ô giờ, bộ sửa hạn) + i18n + 2 S4 M8
- Phạm vi file: `src/ui/screens/events/TodosTab.tsx`, `src/ui/components/ReminderDialog.tsx`, `src/core/i18n/vi.json`, `src/core/i18n/en.json`, `src/ui/styles.css`.
- Yêu cầu + tiêu chí: SPEC §6 M9 "Nội dung" (TodosTab, i18n, `color-scheme: dark`, S4-#1 wrapper + Inner, S4-#2 xóa khóa) và gạch tiêu chí 4 (test khóa pass nguyên vẹn). Vùng chạm ≥ 44 px, bề ngang 428 pt.
- Lệnh kiểm tra: `npx playwright test tests/e2e/todo-touch.spec.ts tests/e2e/todo-gestures.spec.ts tests/e2e/m7-reminder.spec.ts tests/e2e/m8-dayalarm.spec.ts` ; `npm run check`.
- Model: gemini · Lần thử: 0/3 · Vòng Gemini: 1/3 · Trạng thái: DONE
- Nhật ký: 2026-09-19 vòng 1 (8 phút) XONG, báo cáo Gemini cụt → kiem-thu kiểm kỹ PASS (lệnh phiếu 23/7 skip/0 fail; check 308×2 unit, 102/14 skip; đủ testid, wrapper+Inner, khóa thừa đã xóa) → review diff đạt (giao diện kiểm bằng mắt ở T-9.END + thử tay H1–H2) → commit.

### T-9.END — E2E `tests/e2e/m9-todo-time.spec.ts`
- Phạm vi file: `tests/e2e/m9-todo-time.spec.ts` (mới); không sửa src.
- Tiêu chí: SPEC §6 M9 gạch tiêu chí 3 (7 kịch bản) + gạch 5 (size, check). Bài học T-8.END: đọc `__lastNav`/`__lastOps` phải chờ giá trị MỚI (poll), không đọc ngay sau bấm.
- Lệnh kiểm tra: `npx playwright test tests/e2e/m9-todo-time.spec.ts --repeat-each=5` (cả chromium + webkit) ; `npm run check` ; `npm run build && node scripts/size.mjs`.
- Model: gemini · Lần thử: 0/3 · Vòng Gemini: 1/3 · Trạng thái: DONE
- Nhật ký: 2026-09-19 — PHÁT HIỆN: không có `docs/tasks/T-9.END.md` / `gemini-out` → người liên lạc `tho-gemini` (Haiku) TỰ viết test, không chạy Gemini (vi phạm làn, như M6-soat lượt 1). Quản lý vẫn nhận vì cổng chất lượng độc lập đạt: kiem-thu PASS (repeat-each=5: 5 chromium + 5 webkit; check 104/14 skip; size 46,1 KB; (6) đọc rem-at thường) + Quản lý tự đọc assert (IndexedDB poll, `__lastOps` poll, thứ tự). Ghi BAI-HOC → commit.

### T-9.4 — Sửa SC-004 (hàng thêm việc tràn 428 pt) + làm chặt E2E M9 (Kiến trúc sư: SỬA M9)
- Phạm vi file: `src/ui/styles.css`, `src/ui/screens/events/TodosTab.tsx`, `tests/e2e/m9-todo-time.spec.ts`.
- Việc: (1) `styles.css:777` thêm `min-width: 0` vào `.addrow-todo-due-line .todo-due-hint`; (2) `TodosTab.tsx:80–91` bọc `todo-due-time-edit` trong `{Boolean(editDue) && …}`; (3) E2E: (1) sau khi `todo-due-time` hiện, `todo-add` boundingBox `x + width ≤ 428` và `.addrow-todo-due-line` `scrollWidth ≤ clientWidth`; (5) `window.__lastOps = undefined` trước khi bấm `layout-todo` và `layout-week`; (6) dòng 305/322 → `expect(await page.getByTestId('rem-at').inputValue()).toBe(…)`; (7) assert nhãn Họp `6/10 09:00`, Nộp báo cáo `6/10 14:00`, Đọc `+ Hạn`.
- Tiêu chí: assert (1) FAIL trước khi sửa CSS (ghi log), PASS sau; `m9-todo-time.spec.ts --repeat-each=3` pass 2 trình duyệt; `npm run check` pass; test khóa nguyên vẹn.
- Model: sua-loi (opus — sự cố S2) · Lần thử: 1/3 · Trạng thái: DONE
- Nhật ký: 2026-09-19 lượt 1 ĐÃ SỬA → kiem-thu PASS → commit; SC-004 đóng; M9 đạt theo phán quyết (Kiến trúc sư: "đạt thì gắn M9-ok, không cần gọi lại").
- S4 (Kiến trúc sư): `sameTodoGroup` (store.ts:13–14) coi `due: ''` là có hạn, `cmpTodo` (collect.ts:71) coi không — chỉ với JSON nhập tay.


## Bảo trì 2026-09-22 — Dọn hết tồn đọng S4 (Chủ dự án: "xử lý hết tồn đọng")
Mục "Nhắc trên iPhone cho việc cũ": Chủ dự án chọn giữ thủ công → đóng. Còn: M6 (a)–(f) + `sameTodoGroup`. Tuần tự B-015 → B-016 → B-017 (B-016, B-017 cùng vùng UI Việc; Gemini và Claude không ghi cùng lúc). Test khóa M1–M9 không sửa/skip. Gemini: KHÔNG chạy `npm run check` (lượt T-8.4 treo ở lệnh này) — chỉ chạy vitest; kiem-thu chạy test tổng.

### B-015 — Store: `sameTodoGroup` với `due: ''`, Hoàn tác xóa trùng `order`, gỡ listener, unit `createStore`
- Mục tiêu: đóng S4 T-9.4 và M6 (b), (c), (d).
- Phạm vi file (chỉ được sửa): `src/ui/store.ts`, `tests/unit/store-create.test.ts` (mới). KHÔNG sửa `tests/unit/store.test.ts` hay test cũ nào.
- Giao diện có sẵn: `sameTodoGroup` (store.ts:8–21) dùng `a.due != null`; `cmpTodo` (`src/core/collect.ts:~71`, KHÔNG sửa) coi `due` rỗng `''` là không hạn. `addTodo` (~L85) order = max+1. `restoreTodo` (~L144–147) chèn lại todo với `order` cũ. `createStore` (~L246–302) đăng ký `pagehide` (window) và `visibilitychange` (document, hàm ẩn danh) không gỡ; trả `{ getState, dispatch, subscribe, flush }`.
- Yêu cầu:
  1. `sameTodoGroup`: coi `due` là có hạn chỉ khi `!= null && !== ''` (khớp `cmpTodo`).
  2. `restoreTodo`: nếu đã có việc khác (chưa lưu trữ hay đã lưu trữ đều tính) mang cùng `order` với việc khôi phục → mọi việc có `order >= order khôi phục` tăng 1, rồi chèn việc khôi phục với `order` cũ (giữ đúng chỗ cũ). Không trùng thì như hiện tại.
  3. `createStore` trả thêm `destroy(): void` — gỡ cả 2 listener (đặt tên hàm cho listener `visibilitychange`), hủy timer debounce đang chờ, xóa hết subscriber. Thêm `destroy` vào kiểu `Store`. Không đổi hành vi khác.
- Tiêu chí nghiệm thu (`tests/unit/store-create.test.ts`):
  [ ] `sameTodoGroup`: `{due:''}` và `{due: undefined}` cùng nhóm; `{due:''}` và `{due:'2026-10-05'}` khác nhóm.
  [ ] add A → delete A → add B → restoreTodo A: hai việc có `order` khác nhau; thứ tự hiển thị (`cmpTodo`) là A rồi B.
  [ ] restore khi không trùng `order`: todo giữ nguyên `order`, các việc khác không đổi.
  [ ] `createStore`: `subscribe` nhận state sau `dispatch`; hàm hủy trả về từ `subscribe` làm listener ngừng nhận.
  [ ] `destroy()`: sau đó `dispatch` không gọi subscriber; phát `visibilitychange` (hidden) / `pagehide` không gọi `saveState` (mock `../../src/storage/db`); timer đang chờ bị hủy.
  [ ] Toàn bộ test cũ pass nguyên vẹn.
- Lệnh kiểm tra: `npx vitest run tests/unit/store-create.test.ts tests/unit/store.test.ts` ; test tổng `npm run check` (kiem-thu chạy).
- Model: gemini (làn code — 2 file, tiêu chí rõ, test chạy được) · Lần thử: 0/3 · Vòng Gemini: 1/3 · Trạng thái: DONE
- Nhật ký: 2026-09-22 vòng 1 (gemini-3.8-flash-high, 9 phút) XONG → kiem-thu PASS (43/43; check 314 unit / 104 e2e / 14 skip; test đối chiếu từng tiêu chí) → review đạt (`sameTodoGroup` giờ khớp `cmpTodo` cả phần dueTime) → commit.

### B-016 — Toast: thao tác mới không làm mất Hoàn tác của thao tác trước
- Mục tiêu: đóng S4 M6 (a) (soát chéo M6 #6). Quyết định D-036: gộp Hoàn tác.
- Phạm vi file: `src/ui/screens/Events.tsx`, `tests/e2e/b016-toast-undo.spec.ts` (mới).
- Giao diện có sẵn: `showToast(msg, action?)` trong Events.tsx (~L29–40) ghi đè `toastAction`; nút `toast-undo` gọi `toastAction.onClick()`. TodosTab gọi `showToast` khi xóa (`restoreTodo`) / lưu trữ (`archiveTodo archived:false`) — KHÔNG sửa TodosTab.
- Yêu cầu: giữ danh sách hành động Hoàn tác đang chờ (ref). `showToast` có action trong lúc toast có action cũ còn hiện → nối thêm; bấm `toast-undo` chạy MỌI hành động đang chờ theo thứ tự ngược (mới nhất trước) rồi xóa danh sách. Toast hết giờ (5 s tính từ lần gọi cuối) hoặc `showToast` không có action → xóa danh sách. Chữ toast = thông điệp mới nhất. **Siết (D-036, sau vòng 1):** chỉ nối thêm khi từ lần `showToast` có action trước tới lần này, store nhận đúng 1 `dispatch` (cài bằng so tham chiếu state — KHÔNG `store.subscribe`, xem SC-005); nhiều hơn → bỏ danh sách cũ, chỉ giữ action mới. Bản thân hành động Hoàn tác dispatch cũng không được làm lệch đếm (danh sách đã xóa sau khi bấm).
- Tiêu chí nghiệm thu: [ ] e2e (chromium + webkit): thêm 3 việc, xóa việc 1 rồi xóa việc 2 liên tiếp (trong 5 s) → bấm `toast-undo` → cả 2 việc trở lại đúng thứ tự · [ ] xóa 1 việc → bấm Hoàn tác → trở lại (hành vi cũ giữ) · [ ] lưu trữ + xóa liên tiếp → Hoàn tác khôi phục cả hai · [ ] `m6-todo-gestures.spec.ts`, `todo-gestures.spec.ts` pass nguyên vẹn · [ ] `npm run check` pass.
- Lệnh kiểm tra: `npx playwright test tests/e2e/b016-toast-undo.spec.ts tests/e2e/m6-todo-gestures.spec.ts tests/e2e/todo-gestures.spec.ts` ; `npm run check` (kiem-thu).
- Model: gemini → sua-loi (opus, SC-005) · Lần thử: 2/3 · Vòng Gemini: 2/3 · Trạng thái: DONE
- Nhật ký: 2026-09-22 vòng 1 XONG → kiem-thu REGRESSION `m6-todo-gestures.spec.ts:172` (Hoàn tác khôi phục cả việc xóa trước đó dù đã thêm A,B,C xen giữa → 4 hàng thay vì 3; log `docs/test-log/B-016.txt`) → nguyên nhân do quy tắc gộp của Quản lý quá rộng → siết D-036 → vòng 2 (lần sửa regression duy nhất) → vẫn REGRESSION (+ test mới fail; đếm dispatch đặt lại sai chỗ) → mở SC-005 (S2), bản v2 cất `docs/tasks/B-016-v2.*`. → sua-loi (opus) ĐÃ SỬA (so tham chiếu state) → kiem-thu PASS (66/0; check 314/112/14 skip) → review đạt → commit. SC-005 ĐÓNG.

### B-017 — Kéo đổi thứ tự Việc: tự cuộn ở mép màn hình + không kéo ra khỏi nhóm
- Mục tiêu: đóng S4 M6 (e), (f).
- Phạm vi file: `src/ui/screens/events/TodosTab.tsx`, `tests/e2e/b017-drag.spec.ts` (mới); `src/ui/styles.css` nếu thật cần (khai báo).
- Giao diện có sẵn: `useRowGesture` / `onDragMove` (~L430–460) tính `finalIndex` từ `dy/rowHeight`, dịch hàng bằng `transform`; reducer `reorderTodo` từ chối khác nhóm (`sameTodoGroup`) → hàng bật về. Nhánh ngón tay dùng Touch Events, chuột dùng Pointer Events (D-030) — giữ nguyên.
- Yêu cầu: (1) Kẹp `finalIndex` (và độ dịch hiển thị) trong phạm vi nhóm của hàng đang kéo (cùng `sameTodoGroup` từ `src/ui/store.ts`) → không bao giờ xem trước vị trí khác nhóm. (2) Tự cuộn: khi ngón/chuột cách mép trên/dưới vùng cuộn < 60 px trong lúc kéo → cuộn đều (requestAnimationFrame, tốc độ tăng theo độ sát mép, tối đa ~12 px/khung), cập nhật `finalIndex` theo độ cuộn; dừng khi thả/hủy. Không ảnh hưởng vuốt trái và cuộn thường.
- Tiêu chí nghiệm thu: [ ] e2e: 2 nhóm (có hạn / không hạn), kéo hàng nhóm A quá ranh giới → thả → thứ tự không đổi và không hàng nào của nhóm B bị dịch trong lúc kéo · [ ] e2e: danh sách dài hơn viewport 428×926, kéo hàng đầu xuống mép dưới giữ ~1 s → vùng cuộn `scrollTop` tăng, thả → hàng về vị trí dưới cùng đã xem trước · [ ] `m6-todo-gestures`, `todo-touch`, `todo-gestures` pass nguyên vẹn · [ ] `npm run check` pass · [ ] Chủ dự án thử trên iPhone sau deploy.
- Lệnh kiểm tra: `npx playwright test tests/e2e/b017-drag.spec.ts tests/e2e/m6-todo-gestures.spec.ts tests/e2e/todo-touch.spec.ts tests/e2e/todo-gestures.spec.ts` ; `npm run check`.
- Model: sonnet (lý do không giao Gemini: cử chỉ cảm ứng + rAF cần cân chỉnh theo máy thật, vùng từng gây SC-002) · Lần thử: 0/3 · Trạng thái: DONE (chờ Chủ dự án thử iPhone sau deploy)
- Nhật ký: 2026-09-22 lượt 1 DONE (phát hiện: phải kẹp cả độ dịch hiển thị, nếu không transform nới `scrollHeight` → tự cuộn không hội tụ) → kiem-thu PASS (4 file ×3: 75 pass / 21 skip CDP; check 116 / 14 skip; test đo boundingBox/scrollTop thật) → review đạt → commit.
