# BÀI HỌC — lỗi lặp lại & năng lực model
(Quản lý ghi khi: một task phải làm lại ≥ 2 lần; một model làm hỏng một loại việc; rút ra quy tắc mới. Đọc trước khi gắn model cho phiếu.)

- <ngày> · T-x.y · <model> · <chuyện gì xảy ra> → <quy tắc rút ra>
- 2026-09-13 · T-1.1 · (môi trường) · subagent không có shell vì `tools:` chỉ khai `Bash` mà phiên chỉ có `PowerShell`; sửa `tools` phải mở lại Claude Code mới hiệu lực (SC-001) → đầu dự án cho `khao-sat` chạy thử 1 lệnh shell trước khi giao phiếu; khai cả `Bash, PowerShell`.
- 2026-09-13 · T-1.END · sonnet · thợ gặp "flake" webkit, né trong test (chờ preview trước khi chọn) thay vì báo bug; thực ra là race subscribe-sau-paint trong `Preview.tsx` → quy tắc: E2E không được thêm chờ/né để qua; thấy hành vi lạ ở app thì phải tái hiện + báo, và Quản lý đọc kỹ mục "Lưu ý" có chữ flake/race.
