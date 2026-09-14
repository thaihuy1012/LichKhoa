# CẬP NHẬT LÀN GEMINI V2 — việc cho Quản lý (làm một lần, rồi báo người dùng khởi động lại)

Mục tiêu: đưa Gemini thành thợ chính thức của pipeline qua subagent `tho-gemini`. Các file mới đã có sẵn trong repo (do người dùng chép vào): `.claude/agents/tho-gemini.md`, `docs/LAN-GEMINI.md` (v2), `AGENTS.md` (v2), `scripts/agy-run.sh` (v2), `docs/tasks/_MAU-CODE.md`, `docs/tasks/_MAU-SOAT-CHEO.md`. Việc còn lại: sửa hai file do bạn quản lý, sửa `.gitignore`, kiểm tra, commit. Không làm gì khác ngoài các bước dưới. Không đổi frontmatter của bất kỳ agent nào.

## 1. Sửa `.claude/agents/quan-ly.md`

a) Trong mục liệt kê các thợ/subagent, thêm một dòng (giữ đúng định dạng đang dùng):

```
- `tho-gemini` — người liên lạc (Claude Haiku) chạy Gemini qua Antigravity CLI (model theo docs/LAN-GEMINI.md mục 1: 3.8 Flash viết code, 3.1 Pro soát chéo). Nhận: phiếu code đủ điều kiện, sinh file, soát chéo, đọc rộng. Trả báo cáo đúng khung, không tự đánh giá. Kết quả vẫn qua `kiem-thu` → review → commit như mọi thợ. Quy tắc: docs/LAN-GEMINI.md.
```

b) Trong mục về giao việc, thêm khối sau (nguyên văn):

```
### Giao việc cho Gemini (làn Gemini v2 — chi tiết ở docs/LAN-GEMINI.md)
- Làn bật khi người dùng nói "Bật làn Gemini mức NHIỀU/VỪA". Chưa bật → không dùng tho-gemini. Mức mặc định khi bật: NHIỀU.
- Phiếu đủ điều kiện giao tho-gemini (làn code) khi có đủ 4 điều: (1) tiêu chí nghiệm thu rõ và lệnh kiểm thử chạy được (test có sẵn hoặc phiếu yêu cầu viết test); (2) danh sách file được tạo/sửa xác định trước, không quá 8 file; (3) không phải phiếu sự cố S1/S2, không phải phiếu đổi interface dùng chung hay đổi thiết kế; (4) không có thợ Claude nào đang sửa dở — cây git sạch.
- Mức NHIỀU: mọi phiếu đủ điều kiện giao tho-gemini trước; thợ Claude nhận phiếu không đủ điều kiện, phiếu sự cố, phiếu Gemini trả về quá vòng. Mức VỪA: chỉ module mới/cô lập, sinh file, soát chéo, đọc rộng.
- Khi giao, đưa tho-gemini đủ: làn, mã phiếu, nội dung phiếu nguyên văn, danh sách file được phép, lệnh kiểm thử, file cần đọc, vòng số mấy (vòng 2–3 kèm log test nguyên văn).
- Gemini và thợ Claude không ghi file cùng lúc: trong lúc tho-gemini chạy chỉ làm việc chỉ đọc (khao-sat, soạn phiếu kế tiếp).
- Vòng trả về: tho-gemini báo XONG → kiem-thu như thường. FAIL/REGRESSION → giao lại tho-gemini vòng 2 kèm log; FAIL nữa → vòng 3 (cuối). Hết 3 vòng vẫn FAIL → hoàn tác phần Gemini (git checkout -- . && git clean -fd -e docs/gemini-out -e docs/tasks -e docs/bao-cao -e .claude), giao phiếu cho tho-sonnet/tho-opus, ghi một dòng S4 vào docs/SU-CO.md. Không đưa lên Kiến trúc sư chỉ vì Gemini không làm được.
- tho-gemini báo trạng thái khác XONG (TRỐNG, LỖI, HẾT HẠN MỨC, CHƯA ĐĂNG NHẬP, QUÁ GIỜ, BỊ TỪ CHỐI): chuyển việc sang thợ Claude ngay. 2 lần liên tiếp → tắt làn tới hết phiên.
- Tự hạ NHIỀU → VỪA tới hết milestone hiện tại (milestone sau thử lại NHIỀU): 2 phiếu Gemini liên tiếp hết 3 vòng vẫn FAIL, hoặc 1 phiếu Gemini gây sự cố S2. Khi hạ mức hay tắt làn: ghi một dòng vào TASKS.md và nói với người dùng ở lần báo cáo gần nhất.
- Soát chéo cuối milestone (làn soat, tên M<n>-soat) bắt buộc khi làn bật; kết quả gửi Kiến trúc sư như gợi ý cần kiểm chứng.
- Không bao giờ giao Gemini: sửa sự cố S1/S2, sửa code thợ Claude đang dở, bất kỳ việc gì khi cầu dao tổng đang mở.
```

c) Tìm mọi câu cũ nói Gemini "không sửa code lõi", "chỉ code cô lập", "tùy chọn", hoặc hướng dẫn Quản lý tự viết prompt/tự chạy `scripts/agy-run.sh` → thay bằng một câu: `Mọi việc giao Gemini đi qua tho-gemini theo mục "Giao việc cho Gemini"; Gemini không nhận phiếu sự cố S1/S2 và phiếu đổi thiết kế.`

## 2. Sửa `CLAUDE.md`

Thêm mục sau (thay mục Gemini cũ nếu có):

```
## Làn Gemini (v2)
- Gemini (Antigravity CLI `agy`; model theo làn trong docs/LAN-GEMINI.md mục 1 và scripts/gemini.env) là thợ chính thức; mọi việc giao Gemini đi qua subagent `tho-gemini`. Quy tắc: docs/LAN-GEMINI.md. Quy tắc Gemini phải theo: AGENTS.md.
- Gemini không commit, không sửa test cũ, không sửa file ngoài danh sách phiếu. Kết quả Gemini qua kiem-thu → review → commit như thợ Claude.
- Gemini và thợ Claude không ghi file cùng lúc. Thư mục docs/gemini-out là kết quả Gemini; docs/tasks là prompt.
```

## 3. `.gitignore`
Thêm ba dòng nếu chưa có: `docs/gemini-out/*.err`, `docs/gemini-out/*.status`, `docs/gemini-out/*.meta`.

## 4. Kiểm tra và commit
1. `bash -n scripts/agy-run.sh` phải im lặng (không lỗi cú pháp).
2. `bash scripts/agy-run.sh kiem-tra`: nếu ra `KẾT LUẬN: SẴN SÀNG` thì ghi nhận; nếu báo chưa cài agy hoặc có dòng `[X]`, chép nguyên văn cho người dùng, không tự sửa.
3. Commit đúng các file này, không add file code đang dở của thợ khác:
   `git add AGENTS.md CLAUDE.md .gitignore scripts/gemini.env docs/LAN-GEMINI.md docs/CAP-NHAT-GEMINI-V2.md docs/GEMINI-V2-CAC-BUOC.md docs/tasks/_MAU-CODE.md docs/tasks/_MAU-SOAT-CHEO.md scripts/agy-run.sh .claude/agents/tho-gemini.md .claude/agents/quan-ly.md && git commit -m "kit v2.1: lan Gemini v2, tho-gemini"`
4. Báo người dùng đúng câu: "Đã cập nhật xong. Gõ /exit, chạy lại `claude --agent quan-ly`, rồi gõ: Bật làn Gemini mức NHIỀU theo docs/LAN-GEMINI.md. Tiếp tục."

## 5. Nếu đã làm các mục 1–4 trước ngày 15/9/2026 (bản có ghi "Gemini 3.1 Pro High")
Chỉ làm ba việc: (a) trong `.claude/agents/quan-ly.md` và `CLAUDE.md`, thay mọi chỗ ghi "Gemini 3.1 Pro High" / "gemini-3.1-pro-high" bằng "Gemini (model theo docs/LAN-GEMINI.md mục 1)"; (b) chạy `bash scripts/agy-run.sh kiem-tra` và chép kết quả cho người dùng; (c) `git add scripts/agy-run.sh scripts/gemini.env docs/LAN-GEMINI.md docs/CAP-NHAT-GEMINI-V2.md CLAUDE.md .claude/agents/quan-ly.md && git commit -m "kit v2.1: model Gemini theo lan"`. Rồi báo người dùng khởi động lại như mục 4.
