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
