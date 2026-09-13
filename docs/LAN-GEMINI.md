# LÀN GEMINI — Antigravity CLI (`agy`) — tùy chọn

**Trạng thái: BẬT (2026-09-13, D-009).** Model Pro: `gemini-3.1-pro-high` (đọc rộng, soát chéo, ý kiến thứ hai) · Model Flash: `gemini-3.8-flash-high` (sinh file cơ học). Làn code cô lập: mặc định Pro. Luôn truyền slug ở tham số thứ 3 của script.

Gemini không phải subagent của Claude Code. Nó chạy như công cụ ngoài, do Quản lý gọi qua `scripts/agy-run.sh`, dùng hạn mức gói Google AI Pro (tách biệt hạn mức Claude). Gemini đọc quy tắc ở `AGENTS.md` của dự án.

## Giao gì cho Gemini
| Làn | Chế độ script | Khi nào | Vì sao Gemini |
|---|---|---|---|
| Đọc rộng | `doc` (chỉ đọc) | khảo sát > 20 file, tài liệu/API dài, log > 2.000 dòng, "tìm mọi chỗ dùng X" | cửa sổ ngữ cảnh rất lớn; thay cho việc Claude đọc từng file |
| Soát chéo | `soat` (chỉ đọc) | cuối mỗi milestone trước khi Kiến trúc sư duyệt; ý kiến thứ hai khi `sua-loi` thất bại lượt 1 | họ model khác → bắt lỗi mù của Claude |
| Sinh file cơ học | `sinh` | dữ liệu mẫu, fixture, chuyển định dạng, tài liệu, chuỗi i18n | rẻ, không đụng code lõi |
| Code cô lập | `code` | module/file MỚI, giao diện đã cố định, phiếu đầy đủ, có test kèm | tiết kiệm hạn mức Claude; vẫn qua đúng cổng kiem-thu → review |

## Không giao cho Gemini
- Sửa file lõi đang có; sửa lỗi / sự cố; việc cần chạy lệnh shell (headless mặc định không cho chạy lệnh).
- Bất kỳ việc gì khi có sự cố S1/S2 đang mở.
- `agy` lỗi hoặc hết hạn mức 2 lần liên tiếp → tắt làn tới hết phiên, chuyển việc sang thợ Claude. Không chờ, không thử tiếp.

## Cách gọi
1. Quản lý viết prompt vào `docs/tasks/<tên>.md`: dòng đầu ghi làn (ĐỌC RỘNG / SOÁT CHÉO / SINH FILE / CODE CÔ LẬP); phiếu hoặc câu hỏi; khung báo cáo mong muốn; đường dẫn các file cần đọc (Gemini tự đọc file trong workspace, không cần dán nội dung); với làn sinh/code: danh sách file được phép tạo/sửa.
2. Chạy: `bash scripts/agy-run.sh <doc|soat|sinh|code> docs/tasks/<tên>.md [model-slug]`
   - Slug xem bằng `agy models`. Gợi ý: model Pro cho đọc rộng/soát chéo; model Flash cho sinh file.
   - Script từ chối chạy nếu cây git chưa sạch (commit hoặc chờ thợ xong trước). Làn `doc`/`soat` mà Gemini lỡ sửa file → script hoàn tác toàn bộ và cảnh báo.
3. Kết quả ở `docs/gemini-out/<tên>.md`; log ở `.err` cùng tên. Quản lý chỉ đọc file kết quả (và `git status` với làn sinh/code), không đọc log.
4. Làn `sinh`/`code`: sau đó `kiem-thu` → review → commit như thợ Claude.

## Soát chéo milestone (mẫu)
- Quản lý xuất diff: `git diff M<n-1>-ok..HEAD > docs/bao-cao/M<n>.diff` (milestone đầu: `git diff $(git rev-list --max-parents=0 HEAD)..HEAD > docs/bao-cao/M1.diff`).
- Prompt: "SOÁT CHÉO. Đọc docs/SPEC.md, docs/bao-cao/M<n>.md, docs/bao-cao/M<n>.diff. Liệt kê tối đa 10 vấn đề theo mức S1–S4, mỗi vấn đề: file:dòng, cách tái hiện, vì sao sai. Không khen, không viết lại code."
- Đổi tên kết quả thành `docs/bao-cao/M<n>-soat-cheo.md`, gửi kèm cho Kiến trúc sư như gợi ý cần kiểm chứng.

## Cài đặt (một lần)
1. Cài Antigravity CLI: https://antigravity.google/docs/cli/install/ — đăng nhập bằng tài khoản Google cá nhân có gói AI Pro (tài khoản Workspace không được tính; gói AI Plus không được hỗ trợ).
2. Chạy `agy` tương tác một lần để lưu đăng nhập; headless dùng lại đăng nhập này.
3. `agy models` xem slug; `agy -p "Trả lời đúng một từ: ok"` để thử.
4. Bị 429 dù có Pro: thoát, đăng nhập lại, thử lại — lỗi entitlement từng được báo cáo.
5. Windows: script chạy trong Git Bash (Claude Code dùng bash này); `agy` phải có trong PATH.
Tài liệu headless: https://antigravity.google/docs/cli/headless/ · Quyền trong headless: đọc/ghi file trong workspace được tự cho phép, lệnh shell mặc định bị từ chối mềm.
6. Thực tế agy 1.2.2 (D-009): cwd KHÔNG tự là workspace → `read_file` bị từ chối, exit 0 kết quả rỗng. `scripts/agy-run.sh` đã tự thêm `--add-dir <repo>` (mọi làn) và `--mode accept-edits` (làn sinh/code); kết quả rỗng → exit 3. Không dùng `--dangerously-skip-permissions`.
