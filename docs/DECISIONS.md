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
