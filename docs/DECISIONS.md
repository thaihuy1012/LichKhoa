# DECISIONS — quyết định có tranh luận
(Mỗi mục ≤ 10 dòng. Ai đọc sau cũng hiểu vì sao, không cần hỏi lại.)

## D-001 — Quản lý không có shell: ủy quyền lệnh git (2026-09-13 · người quyết: Quản lý)
- Bối cảnh: phiên Quản lý không có công cụ Bash, không tự chạy `git diff` / `git commit` / `git tag` được.
- Phương án A: nhờ `kiem-thu` xuất diff ra file, rồi Quản lý đọc · B: Quản lý đọc thẳng các file trong phạm vi phiếu để review.
- Quyết định: review theo B, kèm `git diff --stat` do `kiem-thu` in trong báo cáo. Commit và tag giao `tho-haiku` bằng một phiếu vi mô (chỉ chạy lệnh git mà Quản lý đưa, không sửa file).
- Lý do: tốn ít token nhất mà vẫn giữ nguyên tắc mỗi phiếu DONE là một commit.
- Hệ quả: mỗi phiếu tốn thêm một lượt haiku ngắn. Có thể gom commit của các phiếu song song vào một lượt, mỗi phiếu vẫn là một commit riêng.

## D-003 — Thêm `PowerShell` vào tools của agent (2026-09-13 · người quyết: Chủ dự án)
- Bối cảnh: SC-001 — trên máy Windows này công cụ shell của Claude Code tên `PowerShell`, không có `Bash`; agent khai `tools: …Bash…` nên không có shell.
- Phương án: A thêm `PowerShell` vào `tools` · B Chủ dự án tự bật Git Bash · C Quản lý tự chạy mọi lệnh.
- Quyết định: A (giữ `Bash` để kit vẫn chạy trên máy có Bash). Lệnh trong phiếu viết theo cú pháp PowerShell (`;` thay `&&`).

## D-002 — Chủ dự án chốt phạm vi (2026-09-13 · người quyết: Chủ dự án)
- App gốc: Ink: Lockscreen Calendar, Note (SilverAI). Nền tảng: PWA. Mục đích: dùng cá nhân. Dịch vụ ngoài: đồng bộ Google Calendar.
- SPEC v1.0 được Chủ dự án duyệt ngày 2026-09-13.

## D-004 — Phiên bản thực tế của khung T-1.1 (2026-09-13 · người quyết: Quản lý)
- Bối cảnh: T-1.1 cài bản mới nhất; lệch nhỏ so với SPEC mục 4.
- Quyết định: chấp nhận Playwright 1.63.0 (SPEC ghi 1.62), TypeScript 7.0.2, thêm devDep `@types/node` (cho `process.env` trong config), `cross-env`. vite-plugin-pwa 1.3.0 + Vitest 5.0.0 chạy tốt với Vite 8.3.0 → không cần phương án dự phòng rủi ro 5. Phiên bản ghim chính xác (không `^`).

## D-005 — Nơi khai báo `DrawOp` (2026-09-13 · người quyết: Quản lý)
- Bối cảnh: T-1.3 và T-1.4 chạy song song, mỗi bên tự khai `DrawOp` (month.ts, paint.ts).
- Quyết định: khai một lần ở `src/render/layout/common.ts` (thuần, mọi layout dùng chung); `month.ts` và `paint.ts` chỉ re-export kiểu. Layout mới (agenda/todo/note) import từ `./common`. Quản lý tự sửa 3 chỗ (chỉ kiểu, không đổi logic).

## D-006 — Thêm Âm lịch vào phạm vi, SPEC v1.1 (2026-09-13 · người quyết: Chủ dự án)
- Bối cảnh: Chủ dự án đưa tài liệu tham khảo `F:\LICH_NEN` (web app + script Scriptable tự viết), yêu cầu "cái nào dùng được thì lấy dùng luôn". Khảo sát: `docs/tham-khao-LICH_NEN.md`.
- Hỏi Chủ dự án 4 tính năng ngoài SPEC (âm lịch, lặp T2–T6, VALARM trong .ics, nhập .ics) → chỉ chọn **Âm lịch**. Ba cái còn lại vẫn OUT.
- Quyết định: SPEC 1.1 thêm IN mục 9 + `DesignConfig.showLunar` (mặc định true) + `core/lunar.ts` (`solarToLunar`, `lunarYearName`), port thuật toán Hồ Ngọc Đức từ `lich-nen.html` L434–513. Phiếu mới T-2.8 (sau T-2.3, trước T-2.6). Sửa `model.ts`/`month.ts` (đã khóa ở M1) được phép trong T-2.8, phải khai báo; test M1 chỉ được sửa đúng chỗ `defaultDesign` thêm `showLunar`.
- Phần code tham khảo khác (occursOn, ics, layout, nhãn) ghi vào mục "Tham khảo" của từng phiếu M2/M4.

## D-007 — Thiết bị đích: iPhone 13 Pro Max (2026-09-13 · người quyết: Chủ dự án)
- Chủ dự án: "tôi sử dụng hoàn toàn trên điện thoại iPhone 13 Pro Max, hãy tối ưu trên giao diện này tốt nhất".
- Thông số: 1284×2778 px, 428×926 pt, DPR 3, tai thỏ (không Dynamic Island), iOS 17+.
- Quyết định (không đổi phạm vi IN/OUT, chỉ thu hẹp đích tối ưu): thêm preset 1284×2778 và dùng làm mặc định khi không nhận ra máy; UI thiết kế cho 428×926 (thay 390 px); PWA iOS (apple-touch-icon, meta standalone, `env(safe-area-inset-*)`, chữ ô nhập ≥ 16px, vùng chạm ≥ 44pt); E2E đổi viewport 428×926 và project webkit mô phỏng `devices['iPhone 13 Pro Max']`. Phiếu T-1.6 (thêm vào M1, trước khi gắn tag M1-ok).

## D-008 — Phán quyết duyệt M1: SỬA (2026-09-13 · người quyết: Kiến trúc sư)
- Mã f295576 đạt trọn tiêu chí M1 (Kiến trúc sư tự chạy `npm run check` exit 0 và xem ảnh mẫu 1179×2556 bằng mắt: dùng được). SỬA chỉ vì D-007 và nợ kỹ thuật điểm 7.3.
- Việc: T-1.6 (bổ sung: fallback 1284×2778 ở `App.tsx`, không đổi `detectDevice`; giữ vùng an toàn 0.30/0.14; sửa nhãn 1179×2556) ∥ T-1.7 mới `normalizeState` (hợp đồng cho T-2.5 và T-2.8). SPEC v1.2 ghi D-007 vào §2, §3, §7; chuyển tiêu chí `lunar.test.ts` từ M3 sang M2; T-2.8 thêm i18n vào phạm vi.
- Ảnh mẫu 1284×2778 gửi Chủ dự án đặt thử làm hình nền khóa, chỉ hỏi "có đè đồng hồ/widget/nút không" — không chặn M2, xong trước T-2.3.
- T-1.6 + T-1.7 DONE và `check` pass → Quản lý tự gắn `M1-ok`, không cần duyệt lại.

## D-009 — Bật làn Gemini (2026-09-13 · người quyết: Chủ dự án; kỹ thuật: Quản lý)
- Chủ dự án bật làn Gemini: Pro = `gemini-3.1-pro-high` (đọc rộng, soát chéo), Flash = `gemini-3.8-flash-high` (sinh file). agy 1.2.2; cả 2 slug thử `-p` trả "ok".
- Lỗi phát hiện khi thử: agy headless không coi cwd là workspace (dự án mặc định rỗng) → `read_file` bị tự từ chối, exit 0 mà kết quả rỗng.
- Sửa `scripts/agy-run.sh`: luôn `--add-dir <repo>`; làn `sinh`/`code` thêm `--mode accept-edits` (ghi file tự duyệt, shell vẫn bị từ chối — đã thử); kết quả rỗng → exit 3 (tính là 1 lần lỗi của làn).
- Không dùng `--dangerously-skip-permissions` (sẽ cho Gemini chạy shell, trái LAN-GEMINI.md) và không sửa `~/.gemini/antigravity-cli/settings.json` (cấu hình ngoài repo).
- Làn `code` chưa thử thật; phiếu `code` đầu tiên phải đi đủ cổng kiem-thu → review như thợ Claude.

## D-010 — Tách T-2.7, theo hướng UI của LICH_NEN (2026-09-13 · người quyết: Quản lý)
- Bối cảnh: Chủ dự án nhắc "tham khảo F:\LICH_NEN, cái nào dùng được thì lấy, tham khảo hướng đi". Gemini Pro đọc rộng → `docs/tham-khao-LICH_NEN.md` §6.
- Quyết định: T-2.7 cũ quá lớn cho một lượt thợ → T-2.7 (tab Sự kiện: 3 phân đoạn Sự kiện/Việc/Ghi chú, lịch nhỏ + sheet trượt như LICH_NEN) và T-2.9 (Preview: bố cục, cài đặt chung, sao lưu — SPEC giữ 5 tab, không có tab Cài đặt, nên đặt dưới nút "Lưu ảnh" cạnh chọn thiết bị).
- Chốt `data-testid` ngay trong phiếu để T-2.END dùng thống nhất. Tính năng LICH_NEN ngoài SPEC (lặp T2–T6, nhắc giờ, hạn to-do, nhiều ghi chú) KHÔNG thêm. → Đã được Chủ dự án thêm ngay sau đó, xem D-011.

## D-011 — SPEC v1.3: lặp T2–T6, nhắc giờ, hạn to-do, nhiều ghi chú (2026-09-13 · người quyết: Chủ dự án)
- Chủ dự án: "Thêm tính năng lặp thứ 2 đến thứ 6, nhắc giờ, hạn chót cho việc cần làm, nhiều ghi chú". Hỏi 3 điểm, Chủ dự án chọn cả 3 khuyến nghị (theo cách LICH_NEN):
  - Nhắc giờ = "Nhắc trước" → VALARM trong .ics, Lịch iPhone nhắc (không Web Push — cần máy chủ, OUT).
  - Nhiều ghi chú, ghim đúng 1 cái lên hình nền (tiêu đề + ≤ 4 dòng); `noteText` cũ → Note pinned.
  - To-do có hạn xếp trước theo hạn; không hạn theo `order`; nhãn "Quá hạn"/"Hôm nay"/"d/m".
- Hợp đồng (SPEC §5): `Repeat` + `weekdays`; `LocalEvent.alarmMin?`; `Todo.due?`; `Note`; `AppState.notes`; bỏ `DesignConfig.noteText`; `RenderData.noteTitle?` (giữ `note: string` để test layout khóa không phải sửa); vẫn `version: 1` nhờ `normalizeState`.
- Phiếu: T-2.10 (lõi) → T-2.11 (hình nền) ∥ T-2.12 (UI), trong M2. T-2.7 đang chạy được nhắn bỏ phần ghi chú đơn. Được sửa test khóa chỉ ở chỗ `noteText`/`setNote`, phải khai báo.

## D-015 — Duyệt M3 tại `6bf4d62`; OAuth trong PWA standalone iOS → thử máy thật sớm T-4.0 (2026-09-14 · người quyết: Kiến trúc sư)
- Bối cảnh: M3 đạt đủ tiêu chí SPEC §6 (KTS tự chạy `npm run check`: 183×2 unit, 39 e2e pass/1 skip, exit 0; `client_secret` trong `src/` rỗng; test M1–M2 chỉ đổi theo D-012/D-014, không skip ẩn).
- Điểm 0 (soát chéo #2): chọn (b) thử thật sớm, không chặn M4. Bằng chứng: iOS ≥ 12.2 mở URL ngoài scope trong trình duyệt trong-app và trả điều hướng về PWA khi URL quay lại nằm trong scope; `dist/manifest.webmanifest` có `scope:"/"`, `start_url:"/"`; `redirect_uri = origin+pathname` (Sync.tsx L125) nằm trong scope → thiết kế hợp lệ trên giấy; chỉ máy thật xác nhận được (hash giữ qua handoff? phiên Google trong-app có bền?). BÁC phần "iframe + prompt=none" của Gemini: Safari chặn cookie bên thứ ba → luôn `login_required`; SPEC §8 đã sửa. Phần "văng ra Safari" là hành vi trước iOS 12.2.
- T-4.0 (Quản lý lập phiếu; cần Chủ dự án): tạo Client ID (§10A) + kéo thả `dist` lên Netlify Drop (không push) → iPhone: Safari mở URL → Thêm vào MH chính → mở icon → Đồng bộ → dán Client ID → Kết nối. Quan sát: (A) Google mở trong-app (có nút Done) hay văng Safari; (B) quay về PWA + toast "Đã kết nối" + danh sách lịch, hay kẹt trong-app / báo `invalid_state`; (C) chọn lịch → Đồng bộ → agenda có sự kiện thật; (D) Chế độ máy bay → đóng app → mở icon → app mở, còn sự kiện (D-013); (E) sau > 1 giờ: "Kết nối lại" có phải đăng nhập lại không. Ghi kết quả vào `docs/bao-cao/M4.md`. Không chặn T-4.1/4.3/4.5; T-4.4 (Guide) và T-4.END chờ kết quả.
- Nếu (B) thất bại: không đổi mã — Guide hướng dẫn dùng LichKhoa trong Safari (bookmark) khi cần Google (storage tách biệt, chọn một ngữ cảnh). Nếu (D) thất bại → S2 tại T-4.END (SW). Nếu Google chặn implicit (`disallowed_useragent`/ngừng hỗ trợ) → ĐỔI SPEC, hỏi Chủ dự án (PKCE cần token endpoint + secret → backend).
- Điểm 1: không thêm kiểm tra webkit; `dist/sw.js` có `NavigationRoute(createHandlerBoundToURL("index.html"))` → (D) là phép thử quyết định. Điểm 2: chấp nhận localStorage (readonly, 1 giờ, không script ngoài) → giới hạn đã biết. Điểm 3: giữ chữ ký `fetchEvents`; +1 request/lượt là rẻ. Điểm 4: T-4.2. Điểm 5: gộp vào T-4.0.
- S4 mới (Tồn đọng): sau redirect kết nối thành công, `App.tsx` L72 chỉ tự đồng bộ khi cache > 30′ → nên ép đồng bộ ngay (truyền cache = null khi `authResult.ok`); làm ở phiếu M4 chạm `App.tsx`.

## D-021 — Duyệt M4 + nghiệm thu cuối tại `cf328e0` (bản deploy `fcf6bdc`): DUYỆT (2026-09-14 · người quyết: Kiến trúc sư)
- Bằng chứng: KTS tự chạy `npm run check` exit 0 (tsc sạch; Vitest 209 × 2 TZ; e2e 64 pass / 6 skip webkit có lý do — clipboard-write không cấp được + D-013); `node scripts/size.mjs` 37,42 KB < 150; `client_secret` trong `src/` rỗng; manifest bản deploy `scope`/`start_url` = `/LichKhoa/`; HUONG-DAN.md đủ A–D; thử máy thật 3 lượt (A–E, hình nền không bị đè, ghi chú ghim hiện) đạt. Test khóa M1–M3 chỉ đổi đúng chỗ đã khai: `layout-month.test.ts` `monthList:false` ×10 (D-018), `note-show` `.click()`→`.check()` ×2 (D-020), `sync.test.ts` mở rộng import — không xóa assertion nào.
- Mã kiểm chứng: `month.ts` (`GRID_RATIO` 0.62, `buildListRows` lọc `!done`, "+N" nằm trong trần L), `normalizeState` bù `monthList` qua `{...defaultDesign(), ...rawDesign}`, `EventsTab.tsx:60–62` trộn cache Google, `store.ts:116` ghim → `showNote`, `pages.yml` `contents: read`, `background.ts:111` `close()`, `oauth.ts:60` không giải mã 2 lần. Soát chéo #7 (skip webkit offline): BÁC — spec vẫn khẳng định `caches.match` trên webkit, chromium đi trọn luồng, máy thật bước (D) đạt.
- SPEC v1.4 (D-018) đúng ý Chủ dự án; KTS chỉ chỉnh chữ: §2 TH1 (token 1 giờ), §3 IN-10 (D-020), §5 (background.ts, ui/sync.ts, pages.yml, ảnh nền ArrayBuffer D-017), §6 M4 (tiêu chí v1.4/D-020), §8.3 (lỗi iOS Shortcut), §9 (hosting thực tế D-019). Không đổi phạm vi.
- Nghiệm thu cuối: M1–M4 đạt trọn SPEC §6 → dự án ĐÓNG ĐƯỢC; Quản lý gắn tag `M4-ok`. Tồn đọng S4 còn thật (ghi "giới hạn đã biết", không mở phiếu): nhập JSON giữ ảnh nền cũ (#5); `input[type=color]` webkit Windows hiện hex 2 lần (iPhone không bị); `parseFragment` trả `{error}` không kiểm `state` (vô hại — không có token nào được nhận khi sai state). 3 mục S4 đã sửa nhưng chưa gạch → Quản lý gạch: boxAlpha T-1.2 (T-4.2, 0.35 khi ảnh), "Đang tải…" T-2.14 (T-3.3, `App.tsx:90` dùng `t()`), nút sync accent T-3.3 (T-4.2).
- Băn khoăn M4.md §7: (2) `useStoreState` là phiếu bảo trì tùy chọn sau khi đóng, kèm unit test chặn `store.subscribe` ngoài hook (nguyên nhân gốc là mẫu `useEffect`+subscribe, đã lặp 2 lần); (3) chấp nhận Chủ dự án tự push — đúng CLAUDE.md; bỏ bản `E:/DuAn/lichkhoa-dist`; (4) đồng ý: lỗi iOS, không sửa mã; (6) gộp duyệt M4 + nghiệm thu cuối: DUYỆT cả hai.
- Hỏi Chủ dự án (không chặn duyệt): (a) đóng dự án ngay hay làm một đợt bảo trì nhỏ (`useStoreState` + nhập JSON xóa ảnh nền cũ); (b) giữ quy trình "Chủ dự án tự `git push` mỗi lần deploy" hay mở quyền push cho Quản lý trong `.claude/settings.json`.

## D-022 — Đóng dự án; giữ Chủ dự án tự push (2026-09-14 · người quyết: Chủ dự án)
- Sau D-021 (DUYỆT M4 + nghiệm thu cuối), hỏi 2 câu → Chủ dự án chọn: (a) **đóng dự án**, không làm đợt bảo trì (S4 còn lại + hook `useStoreState` để ngỏ); (b) **giữ Chủ dự án tự `git push`** — `.claude/settings.json` giữ `deny: Bash(git push *)`; Quản lý chuẩn bị commit/tag, Chủ dự án chạy `! git push` (+ `! git push origin --tags` khi có tag mới — tag `M*-ok` là tag thường, `--follow-tags` KHÔNG đẩy). 4 tag M1–M4-ok đã lên GitHub 2026-09-14.

## D-023 — Mở lại dự án cho một đợt bảo trì nhỏ, làn Gemini v2 NHIỀU (2026-09-15 · người quyết: Chủ dự án)
- Chủ dự án bật làn Gemini v2 mức NHIỀU (kit v2.1; `agy-run.sh kiem-tra` → SẴN SÀNG) và chọn "Bảo trì nhỏ": B-001 hook `useStoreState` + unit test chặn `store.subscribe` ngoài hook (D-021 băn khoăn 2), B-002 S4 ô màu webkit hiện hex 2 lần (T-4.6).
- S4 nhập JSON giữ ảnh nền cũ: Chủ dự án chọn **giữ như hiện tại** → đóng, không sửa.
- Giao việc: B-001 đủ 4 điều kiện Gemini (≤ 8 file, chữ ký hook cố định trong phiếu, không đổi `Store`, có lệnh `npm run check`) → `tho-gemini` làn code. B-002 tiêu chí chính kiểm bằng mắt → `tho-sonnet`.
- Xong đợt: không cần Kiến trúc sư duyệt (không đổi SPEC); chuẩn bị commit, Chủ dự án tự `git push` (D-022).

## D-024 — SPEC v1.5: bố cục Tuần giống app Inks (2026-09-15 · người quyết: Chủ dự án)
- Yêu cầu: "thêm bố cục tuần, dưới các ngày trong tuần hiển thị tối đa 4 việc hoặc sự kiện… tham khảo bố cục app Inks, làm giống y vậy". Ảnh mẫu: `docs/tham-khao/inks-tuan.PNG`.
- Mẫu Inks (Quản lý đọc ảnh): dải 7 cột theo tuần (Mon…Sun) ngay dưới đồng hồ; đầu cột = thứ viết tắt + số ngày, căn giữa; cột hôm nay có nền tô nhạt phủ cả đầu cột lẫn chip; dưới mỗi ngày là chip bo góc màu pastel, chữ tối nhỏ: dòng 1 giờ bắt đầu–kết thúc, dòng 2 tên; dưới dải tuần là danh sách chi tiết hôm nay: vạch màu dọc bên trái, tên in đậm, biểu tượng đồng hồ + giờ.
- Chủ dự án chốt 5 điểm (đều theo khuyến nghị):
  1. To-do: có hạn → dưới đúng ngày hạn; quá hạn chưa xong → dồn vào hôm nay (nhãn Quá hạn); không hạn → không hiện.
  2. > 4 mục một ngày → 3 chip + chip "+N".
  3. Có danh sách chi tiết hôm nay dưới dải tuần (như Inks), cắt theo chỗ trống + "+N".
  4. Màu chip = màu sự kiện/lịch pha trắng thành pastel, chữ tối; to-do một màu pastel vàng cố định.
  5. `showLunar` bật → số âm lịch nhỏ dưới số ngày dương ở đầu cột.
- Quản lý: tuần theo `weekStart` (tuần chứa hôm nay, như Inks). Không cần Kiến trúc sư (tiền lệ D-011, D-018: thêm tính năng trong khung kiến trúc sẵn có).

## D-025 — Duyệt M5 (HEAD sau soát chéo): DUYỆT (2026-09-15 · người quyết: Kiến trúc sư)
- Tiêu chí SPEC §6 M5 đạt (ảnh máy thật chờ Chủ dự án, không chặn). Kiến trúc sư tự chạy vitest 228/21 file; test khóa đổi đúng khai báo.
- Soát chéo Gemini: (1) cache Google cũ thiếu ngày đầu tuần → S4, không sửa (cache không có `timeMin`, tự hết sau lần đồng bộ kế); (2) trùng local+Google → bác (ngoài M5); (3) to-do không hạn → bác (D-024); (4) hour12 bỏ AM ở giờ đầu → hạ S4 (Inks cũng vậy, mặc định 24h); (5) VS-15 cho ◷/☐ → bác (không phải ký tự emoji); rủi ro thật là iOS thiếu glyph ◷ → xem máy thật, hỏng thì bỏ "◷ " (`week.ts:388`); (6) e2e chỉ kiểm x → bác (unit đã kiểm mainArea).
- Máy thật (Chủ dự án, sau deploy a173446): chữ chip đọc được, "◷" hiện đúng → T-5.4 chỉ còn dọn code S4, không gấp.
- Tồn đọng gộp phiếu **T-5.4** (sau khi Chủ dự án xem máy thật): hour12 chỉ cắt hậu tố khi cùng buổi + unit test hour12; `CHAR_W` 0.55 theo font (mono ≈ 0.6); `todoDueText` trùng `todoDueLabel`; `layout-week.test.ts:117–124,142–147` chép hằng lề/cột; cache cũ.

## D-020 — T-4.10 PHẢN BIỆN lượt 1: CHẤP NHẬN sửa 1 dòng test khóa `notes.spec.ts` (2026-09-14 · người quyết: Quản lý)
- Ghim → tự bật `showNote` (T-4.10, Chủ dự án xác nhận chưa bật công tắc "Hiện trên hình nền") làm test cũ `notes.spec.ts:10` fail: dòng 33 `note-show.click()` sau khi ghim giờ TẮT công tắc.
- Quyết định: đổi đúng dòng đó thành `.check()` (đảm bảo bật — idempotent), giữ nguyên mọi assertion và mục đích test. Khai báo trong báo cáo; kiem-thu kiểm diff test khóa chỉ có dòng này.
- Bổ sung (kiem-thu REGRESSION `m2-events.spec.ts:33`, T-2.END): cùng nguyên nhân — dòng 72 `note-show.click()` sau khi ghim. Quản lý phân loại: không phải lỗi sản phẩm (hành vi mới cố ý), không mở SC; cho đổi dòng 72 thành `.check()` như trên. `grep note-show tests/` chỉ còn 2 chỗ này.
- `vite.config.ts`: Chủ dự án từng sửa cứng `base: '/LichKhoa/'` (chưa commit) → Chủ dự án chọn trả về `process.env.VITE_BASE ?? '/'`; workflow build `/LichKhoa/` theo tên repo. Repo: `github.com/thaihuy1012/LichKhoa` → Pages `https://thaihuy1012.github.io/LichKhoa/`.

## D-019 — Nối repo với GitHub, deploy bằng workflow Pages (2026-09-14 · người quyết: Chủ dự án)
- Chủ dự án đồng ý "nối repo này với GitHub cho workflow tự deploy" (cho phép `git push`). Trước đó Chủ dự án tự tải bản build lên GitHub; bản build dùng `VITE_BASE=/` và chạy được.
- Việc còn thiếu (chờ Chủ dự án): URL/tên repo đang dùng. Nếu repo là `<user>.github.io` thì trang ở gốc → workflow phải build `VITE_BASE=/` (hiện đang `/<tên-repo>/`). Đổi URL thì phải sửa origin/redirect của Client ID Google.
- Máy chưa có `gh`; git dùng credential manager → lần push đầu Chủ dự án tự chạy (`! git push …`) để đăng nhập. Nhánh cục bộ `master` → đổi thành `main` (workflow chạy theo push `main`). Repo phải public (Pages miễn phí) → mã nguồn công khai; không có secret trong repo (SPEC M3). Settings → Pages → Source = GitHub Actions do Chủ dự án bật.

## D-018 — SPEC v1.4 sau thử máy thật T-4.0: Tháng + danh sách; tab Sự kiện hiện Google (2026-09-14 · người quyết: Chủ dự án)
- Bối cảnh: T-4.0 đạt A/B/D/E + hình nền không bị đè. Chủ dự án: bố cục Tháng "chỉ thấy ngày, không thấy sự kiện → vô ích", muốn danh sách sự kiện + to-do dưới lưới tháng, "nhiều quá thì thanh cuộn"; tab Sự kiện không hiện sự kiện Google (`EventsTab.tsx:59` chỉ expand `state.events`).
- Hỏi 2 điểm (hình nền là ảnh tĩnh → không cuộn được) → Chủ dự án chọn cả 2 khuyến nghị:
  - Bố cục Tháng có danh sách bên dưới: sự kiện từ hôm nay (Google + cục bộ, `agendaDays` ngày) + to-do chưa xong, cắt theo chỗ trống kèm dòng "+N … nữa"; công tắc bật/tắt `DesignConfig.monthList` (mặc định bật). Như `month-agenda` của LICH_NEN (`LichNen.js` L388–391, `drawAgenda` compact L302–342).
  - Tab Sự kiện hiện sự kiện Google (chấm + danh sách), chỉ xem, nhãn "Google", không mở sheet sửa.
- Lỗi Shortcut `com.apple.extensionKit.errorDomain error 2` (bấm lại thì được): lỗi iOS đã biết của "Set Wallpaper" (Apple Community thread 255761645, FB15159428) → không đổi mã; HUONG-DAN + thẻ Guide hướng dẫn bấm lại.
- Phiếu: T-4.8 (hình nền) ∥ T-4.9 (tab Sự kiện). Được sửa test khóa chỉ chỗ `defaultDesign`/fixture thêm `monthList`, phải khai báo.

## D-017 — Ảnh nền lưu IndexedDB dạng ArrayBuffer (2026-09-14 · người quyết: Quản lý, chấp nhận khai báo ngoài phạm vi của T-4.2)
- WebKit (Playwright) abort transaction khi structured-clone Blob vào IndexedDB → `saveBg` lưu `{buf: ArrayBuffer, type}`; `loadBg` đọc cả dạng mới lẫn Blob cũ. Chữ ký SPEC §5 (`Blob|null`) giữ nguyên. Safari cũ cũng từng lỗi Blob-in-IDB → an toàn hơn cho iPhone.

## D-016 — Chủ dự án dời thử máy thật T-4.0 về cuối M4 (2026-09-14 · người quyết: Chủ dự án)
- Hỏi theo D-015 (thử OAuth PWA iOS sớm) → Chủ dự án chọn "Để cuối M4". Ảnh mẫu đặt thử hình nền khóa: "Chưa thử" → gộp vào bài thử máy thật.
- Hệ quả: T-4.4 (Guide/HUONG-DAN) viết theo thiết kế hiện tại (PWA standalone) + nhánh dự phòng "dùng trong Safari" (D-015), đánh dấu phần OAuth "chờ xác nhận máy thật"; T-4.0 chạy sau T-4.4, trước T-4.END; kết quả T-4.0 có thể sinh phiếu sửa Guide. `dist` cho Netlify build lại ngay trước T-4.0 (bản `E:\DuAn\lichkhoa-dist` hiện tại là HEAD `095e2cc`, sẽ cũ).
- Rủi ro chấp nhận: nếu OAuth trong PWA không chạy thì phát hiện muộn; theo D-015 phương án dự phòng không đổi mã.

## D-013 — T-3.END: mock OAuth bằng trang HTML chuyển hướng; webkit bỏ bước offline+reload (2026-09-14 · người quyết: Quản lý)
- Webkit (Playwright, Windows) không cho `route.fulfill` trả 302 → mock `accounts.google.com` bằng trang HTML tự `location.replace('<app>/#access_token=…&state=<từ query>')` — tương đương 302 về mặt luồng app.
- `context.setOffline(true)` + `reload()` trên webkit → "WebKit encountered an internal error" (kiem-thu tái hiện độc lập: app thật lỗi; `data:` URL không lỗi; chromium không lỗi — `docs/test-log/webkit-offline.txt`). Chưa loại trừ được khả năng SW của app không phục vụ navigation trên WebKit → chấp nhận `test.skip(webkit)` riêng bước này ở T-3.END (chromium kiểm đủ), NHƯNG: T-4.END phải thử lại (cách khác: `serviceWorker` state + `caches.match('/index.html')` trong page trên webkit), và bài thử tay trên iPhone M4 phải có bước "bật Chế độ máy bay → mở icon → app mở, còn sự kiện Google đã cache".

## D-014 — Định dạng id occurrence Google (2026-09-14 · người quyết: Quản lý, PHẢN BIỆN T-3.4 lượt 1)
- Thợ: đổi id sang `<eventId>@<date>` vỡ 2 assertion cũ (`google-normalize.test.ts` L26, L45).
- Quyết định: CHẤP NHẬN có điều chỉnh — id = `google-<calendarId>-<eventId>@<date>` (duy nhất khi gộp nhiều lịch + tách sự kiện nhiều ngày; khớp quy ước `@<date>` của T-2.1). Cho sửa đúng 2 dòng assertion đó, khai báo; không sửa gì khác.
- Hệ quả: cache Google cũ trong IndexedDB mang id dạng cũ → lần đồng bộ kế ghi đè toàn bộ cache, không cần di trú.

## D-012 — Duyệt M2 tại `b438b60`; trả lời 6 điểm băn khoăn (2026-09-14 · người quyết: Kiến trúc sư)
- Bối cảnh: M2 đạt đủ tiêu chí SPEC v1.3 §6 (KTS tự chạy `npm run check`: 132×2 unit, 32 e2e, exit 0; test M1 không có dòng xóa). SPEC v1.3 do Quản lý viết được KTS soát: đúng ý D-011, chỉ chỉnh chữ §3/§5/§9.
- Trần agenda: 12 tính theo **dòng sự kiện**, tiêu đề ngày không tính (không trần theo chiều cao — mật độ phải ổn định giữa thiết bị/scale/ghi chú; đòn bẩy của người dùng là `agendaDays` và `scale`). Lý do: 7 ngày × 1 sự kiện hiện chỉ 5 + "+2" là quá ít; 20 dòng tối đa vẫn nằm trong vùng nhờ tự co. → T-2.15.
- `boxAlpha`/nền đen: giữ đến T-4.2 (khi có ảnh thật mới quyết mặc định; khuyến nghị 0.35 chỉ khi `bg.kind='photo'`). Ảnh mẫu cho Chủ dự án: Quản lý hỏi khi tiện, không chặn.
- Công cụ ảnh mẫu/chụp webkit phải nằm trong repo `scripts/` (đã ghi vào SPEC §5) → T-2.16.
- Thợ cấm mọi lệnh git đổi cây làm việc (`stash`/`checkout --`/`reset`/`clean`); chỉ Quản lý commit/tag. Song song vẫn theo quy tắc "không chung file".
- S4 mới KTS phát hiện (gộp T-2.15): `normalizeState` không kiểm `events/todos/notes` là mảng và không ép ≤ 1 ghi chú ghim (bất biến hiện chỉ do `NoteTab.save()` giữ); `eventToIcs` với `weekdays` mà DTSTART rơi T7/CN → Lịch iPhone có thể hiện thêm 1 lần (RFC 5545 để "undefined") → dời DTSTART tới T2 kế tiếp; gập dòng 75 octet (đóng S4 T-2.5). "Đang tải…" (App.tsx) làm trong T-3.3.

## D-026 — SPEC v1.6: ẩn sự kiện trùng local/Google trên hình nền; bỏ "bấm đúp mở Google Calendar" (2026-09-15 · người quyết: Chủ dự án)
- Chủ dự án yêu cầu 2 tính năng: (a) bấm đúp sự kiện trên màn hình → mở Google Calendar; (b) sự kiện nhập trong app trùng sự kiện Google → hiện sự kiện được tạo sau.
- (a) Quản lý giải thích hình nền màn khóa là ảnh tĩnh, iOS không cho bấm vào; đề xuất làm trong tab Sự kiện / ảnh xem trước → Chủ dự án chọn **không làm**. Ghi OUT.
- (b) Chủ dự án chốt (đều theo khuyến nghị): trùng = cùng ngày + cùng giờ bắt đầu + cùng tên (không phân biệt hoa thường, bỏ khoảng trắng thừa; cả ngày: cùng ngày + tên); sự kiện local cũ chưa có thời điểm tạo → coi là tạo trước (hiện Google); chỉ áp dụng trên hình nền — tab Sự kiện vẫn hiện cả hai để còn sửa/xóa bản trong app.
- Hợp đồng: `LocalEvent.createdAt?` (ms, đặt khi thêm, giữ khi sửa), `Occurrence.createdAt?` (local từ event, Google từ `created` của API); lọc trong `collectRenderData`. Thiếu `createdAt` = 0; bằng nhau → Google.
- Quy mô nhỏ, trong khung kiến trúc sẵn có → phiếu bảo trì **B-003** (sonnet, đổi hợp đồng nên không giao Gemini), không mở milestone mới, không cần Kiến trúc sư (tiền lệ D-018, D-023).

## D-027 — Ẩn sự kiện trùng mọi nguồn trên hình nền (2026-09-15 · người quyết: Chủ dự án)
- Chủ dự án: tạo 2 sự kiện trùng trong app thì màn khóa vẫn hiện cả 2. Nguyên nhân: B-003 chỉ lọc cặp local–Google — Quản lý tự quyết giữ local–local/Google–Google khi viết phiếu, không hỏi.
- Chủ dự án chọn "Ẩn trùng mọi nguồn": nhóm trùng (cùng khóa D-026) có ≥ 2 mục → giữ 1: `createdAt` lớn nhất (thiếu = 0); bằng nhau → ưu tiên Google; cùng nguồn và bằng nhau → mục đứng sau theo thứ tự đầu vào (local = thêm sau). Tab Sự kiện vẫn hiện đủ.
- Phiếu B-005 (sonnet — sửa test khóa B-003 "hai local trùng nhau → giữ cả hai", phải khai báo).

## D-028 — SPEC v1.7: vuốt trái Xóa/Lưu trữ + nhấn giữ kéo sắp xếp cho Việc cần làm (2026-09-15 · người quyết: Chủ dự án)
- Yêu cầu: "Ở tab sự kiện, vuốt sang trái hiện xóa hoặc lưu trữ; nhấn giữ để di chuyển lên xuống sắp xếp thứ tự".
- Chủ dự án chốt: chỉ danh sách **Việc cần làm** (không áp dụng Sự kiện, Ghi chú); Lưu trữ = ẩn khỏi danh sách và hình nền, còn trong phần "Đã lưu trữ" cuối danh sách để khôi phục / xóa hẳn; sự kiện luôn theo giờ (không kéo); Xóa = xóa ngay + thông báo "Hoàn tác" ~5 giây.
- Quản lý: kéo chỉ trong cùng nhóm hiển thị (IN-10: chưa xong có hạn theo hạn / chưa xong không hạn theo `order` / đã xong); giữ nguyên nút ▲▼ 🗑 hiện có (test khóa dùng) — bỏ sau nếu Chủ dự án muốn.
- Milestone M6 (T-6.1 lõi → T-6.2 UI cử chỉ → T-6.END). Không giao Gemini: T-6.1 đổi hợp đồng; T-6.2 cử chỉ chạm cần cảm giác trên máy thật.

## D-029 — Duyệt M6 + bảo trì sau M5 (B-003, T-5.4, B-004, B-005, B-006, T-6.3) tại `192b48b`: DUYỆT (2026-09-15 · người quyết: Kiến trúc sư)
- Kiến trúc sư tự chạy: tsc sạch; unit 252×2 TZ; build; e2e 88 pass / 6 skip. Tiêu chí SPEC §6 M6 có test thật; test khóa đổi đúng khai báo.
- Soát chéo Gemini (lượt 2): #1–#5 thật, đã sửa gốc ở T-6.3; #6 toast đè, #7 listener `createStore` không gỡ (store tạo 1 lần, `App.tsx:47`), #10 unit `createStore` → S4.
- S4 thêm: Hoàn tác xóa ngay sau khi thêm việc mới → 2 việc cùng `order` (hiển thị vẫn ổn); kéo không tự cuộn khi danh sách dài hơn màn; kéo sang nhóm khác hàng dịch rồi bật về.
- Chủ dự án thử trên iPhone (3 ý) rồi hỏi: bỏ nút ▲▼× cũ để hàng thoáng hơn? (phải đổi test khóa `m2-events`/`events`, khai báo).

## D-030 — SC-002: kéo cảm ứng bằng Touch Events; `touchcancel` giữa lúc kéo áp thứ tự đang xem trước (2026-09-15 · người quyết: Quản lý)
- Bối cảnh: sua-loi lượt 2 (opus) chuyển nhánh ngón tay sang Touch Events (chuột vẫn Pointer Events) vì WebKit iOS hủy luồng pointer giữa chừng. Cần chọn hành vi khi `touchcancel` (hệ thống cắt ngang: cuộc gọi, thông báo…) lúc đang kéo.
- Phương án: A trả về chỗ cũ · B áp thứ tự đang xem trước (hàng đã nổi, các hàng đã dịch chỗ).
- Quyết định: B — người dùng đã thấy vị trí thả; mất cả thao tác vì một lần cắt ngang của hệ thống tệ hơn; vẫn đổi lại được bằng kéo/▲▼. Nếu thiết bị thật cho thấy `touchcancel` xảy ra cả khi thao tác bình thường → xem lại.

## D-031 — SPEC v1.8: nhắc trên iPhone qua Phím tắt (Báo thức Đồng hồ + Lời nhắc Reminders), milestone M7 (2026-09-19 · người quyết: Chủ dự án; thiết kế: Kiến trúc sư)
- Bối cảnh: dự án đã đóng (D-022); Chủ dự án mở lại: trong form sửa sự kiện / thêm việc / thêm-sửa ghi chú muốn "thêm vào đồng hồ báo thức của iPhone" vì nhắc của Lịch iPhone (VALARM, IN-10) chưa đủ gây chú ý. Web không có API báo thức → deep link `shortcuts://run-shortcut?name=…&input=text&text=…` (Apple, "Run a shortcut using a URL scheme") tới Phím tắt tự cài, cùng cơ chế "Đặt hình nền".
- Chủ dự án chốt (Quản lý hỏi): cả hai cơ chế — Báo thức (app Đồng hồ: chỉ giờ, kêu trong 24 h tới) và Lời nhắc (Reminders: có ngày); hỏi thời điểm mỗi lần bấm, mặc định theo giờ sự kiện / hạn việc, phải có "Không báo thức"; không ép dùng `alarmMin`; ghi chú chọn giờ tại nút, không thêm trường model, không đụng sao lưu JSON; tự cài 2 Phím tắt theo hướng dẫn.
- Kiến trúc sư quyết: mỗi form một nút "Nhắc trên iPhone" mở `ReminderDialog` (datetime-local + "Thêm báo thức" / "Thêm lời nhắc" / "Không báo thức") thay vì hai nút trên form (hàng nhập việc không đủ chỗ); hành động = lưu form rồi mới mở Phím tắt (iOS có thể đóng PWA khi rời app); chặn báo thức khi thời điểm đã qua hoặc > 24 h (`reminderWindow`); payload 2–3 dòng `YYYY-MM-DD HH:mm` / tên / ghi chú — Phím tắt tách bằng Split Text + Get Dates from Input; tên Phím tắt lưu `AppState.alarmShortcutName` / `reminderShortcutName` (mặc định `ThemBaoThuc` / `ThemLoiNhac`, sửa ở tab Xem trước, `normalizeState` bù, JSON vẫn version 1); "Nhạy cảm thời gian" là cài đặt hệ thống của Reminders → hướng dẫn bật, không nằm trong payload.
- OUT (ghi §3): báo thức lặp theo thứ, tạo hàng loạt, sửa/xóa/đồng bộ ngược, tự quay về app, kiểm Phím tắt đã cài. Rủi ro §8.10: data detector đọc dòng 1 và Shortcuts giải mã `%0A` chỉ kiểm được trên máy thật → bài thử tay (F); hỏng thì sửa `reminderText` (1 hàm, 1 test).
- Phiếu đề xuất: T-7.1 lõi thuần + hợp đồng (sonnet) → T-7.2 `ReminderDialog` + 2 ô tên ở Xem trước + gắn EventsTab (sonnet) → T-7.3 gắn TodosTab + NoteTab (sonnet; đủ điều kiện Gemini làn code) ∥ T-7.4 HUONG-DAN §E + thẻ Hướng dẫn 7 VI/EN (sonnet) → T-7.END E2E `m7-reminder.spec.ts` (kiem-thu) → thử tay iPhone (Chủ dự án, `docs/bao-cao/M7.md`).

## D-032 — Cổng bảo mật trước deploy + xử lý phần đã push trước khi có quy định (2026-09-19)
- Bối cảnh: Chủ dự án yêu cầu "Before every deployment, perform a security audit and block deployment if any secrets, credentials, PII, confidential data, or sensitive information could be exposed" → ghi thành mục "Cổng bảo mật trước khi deploy" trong `CLAUDE.md` (commit d6c7bec). Chủ dự án hỏi tiếp: phần đã push trước đó xử lý thế nào.
- Kiểm toán hồi tố toàn bộ 143 commit (132 đã push), kho CÔNG KHAI: không có API key, token, private key, `client_secret`, Client ID, email hay số điện thoại trong nội dung file. Log: `docs/test-log/bao-mat-d6c7bec.log`.
- Phát hiện mức nhẹ: (a) email thật trong metadata 132 commit; (b) đường dẫn máy cá nhân trong 2 file tài liệu; (c) ảnh chụp màn hình chứa dữ liệu mẫu (Chủ dự án xác nhận là dữ liệu bịa).
- Quyết định của Chủ dự án (2026-09-19): (1) KHÔNG viết lại lịch sử / không force push — giữ nguyên tag M1-ok…M6-ok; từ nay commit bằng email ẩn `171107212+thaihuy1012@users.noreply.github.com` (đã đặt `git config` cho kho). (2) Kho GIỮ CÔNG KHAI (Pages tài khoản miễn phí cần công khai). (3) Ảnh test giữ nguyên.
- Quản lý tự quyết kèm theo: siết `.gitignore` (chặn `.env*`, `*.pem/*.p12/*.key`, `*credentials*.json`, `*service-account*.json`, `*client_secret*.json`, sao lưu JSON dữ liệu thật); thêm quy tắc "ảnh/log trong kho phải dùng dữ liệu mẫu bịa" vào `CLAUDE.md`; mở phiếu T-G.2 viết `scripts/kiem-bao-mat.sh` để cổng chạy được bằng một lệnh.
- Lý do không viết lại lịch sử: không có bí mật nào cần thu hồi; rewrite phá 6 tag milestone, đổi toàn bộ mã commit, cần force push, mà bản cũ vẫn còn trong cache GitHub một thời gian → rủi ro cao hơn lợi ích.
