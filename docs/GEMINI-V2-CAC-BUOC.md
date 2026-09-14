# Các bước bật làn Gemini v2 (làm theo thứ tự; bản này để chép cho AI khác nếu cần)

Bối cảnh: dự án ở `E:\DuAn\thu-nghiem` (Git Bash: `/e/DuAn/thu-nghiem`), đã chạy ai-team-kit v2 với `claude --agent quan-ly`.

A. Chép file (Windows)
1. Tải `ai-team-kit-gemini-v2.zip`, giải nén vào chỗ tạm (Desktop).
2. Chép TOÀN BỘ nội dung bên trong thư mục giải nén vào `E:\DuAn\thu-nghiem`. Khi hỏi ghi đè, chọn "Thay thế" cho mọi file trùng tên (`AGENTS.md`, `docs\LAN-GEMINI.md`, `docs\CAP-NHAT-GEMINI-V2.md`, `scripts\agy-run.sh`...).
3. Bật View → Hidden items, kiểm tra có `E:\DuAn\thu-nghiem\.claude\agents\tho-gemini.md`.

B. Antigravity CLI (bỏ qua bước 4–5 nếu đã cài)
4. Cài từ https://antigravity.google/cli . Đóng mọi cửa sổ Git Bash, mở lại.
5. Git Bash: `cd /e/DuAn/thu-nghiem` → `agy` → đăng nhập Google cá nhân có AI Pro → chấp nhận tin cậy thư mục nếu hỏi → gõ `/quit`.
6. Git Bash: `bash scripts/agy-run.sh kiem-tra` → phải thấy 4 dòng `[OK] làn ...` và `KẾT LUẬN: SẴN SÀNG`. Có dòng `[X]` → làm theo dòng đó, chạy lại. Nếu `[X]` nói không thấy model: mở `scripts\gemini.env` bằng Notepad, sửa tên model cho khớp `agy models`, lưu (giữ định dạng dòng), chạy lại.

C. Cập nhật Quản lý (đã làm bước 7 với bản trước ngày 15/9 → thay bằng: `Đọc docs/CAP-NHAT-GEMINI-V2.md mục 5 và thực hiện.`)
7. Trong phiên `claude --agent quan-ly` (đang chạy hoặc mở mới trong Git Bash tại thư mục dự án), gõ: `Đọc docs/CAP-NHAT-GEMINI-V2.md và thực hiện đầy đủ.`
8. Đợi Quản lý báo "Đã cập nhật xong". Gõ `/exit`.
9. Chạy lại `claude --agent quan-ly`, gõ: `Bật làn Gemini mức NHIỀU theo docs/LAN-GEMINI.md. Tiếp tục.`

D. Kiểm tra lần đầu
10. Khi thấy `tho-gemini` chạy lần đầu, mở `E:\DuAn\thu-nghiem\docs\gemini-out\` xem file `<mã phiếu>.md` có mục BÁO CÁO CUỐI đúng khung.
11. Muốn giảm việc giao Gemini: gõ `Chuyển làn Gemini về mức VỪA.` Muốn tắt: `Tắt làn Gemini.`
