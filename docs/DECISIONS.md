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
