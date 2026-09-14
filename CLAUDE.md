# QUY CHẾ VẬN HÀNH — AI TEAM

Mọi agent trong dự án này đều đọc file này. Chi tiết từng vai trò nằm trong `.claude/agents/*.md`.

## Phân cấp
Chủ dự án (người) → Kiến trúc sư `kien-truc-su` (Fable) → Quản lý `quan-ly` (Opus, phiên chính) → Thợ `tho-*`, Kiểm thử `kiem-thu`, Sửa lỗi `sua-loi`, Khảo sát `khao-sat`.
- Chỉ Quản lý được hỏi Chủ dự án. Ai cần hỏi thì ghi câu hỏi vào báo cáo trả về.
- Kiến trúc sư chỉ được gọi tại: khởi tạo SPEC, cuối milestone, trọng tài, sự cố vượt tầm, nghiệm thu cuối.

## Sổ sách (nguồn sự thật nằm trên đĩa, không nằm trong trí nhớ hội thoại)
- `docs/SPEC.md` — mục tiêu, phạm vi, kiến trúc, milestone + tiêu chí nghiệm thu.
- `docs/TASKS.md` — phiếu giao việc + trạng thái từng task + tồn đọng.
- `docs/SU-CO.md` — sự cố S1/S2 đang mở và đã đóng.
- `docs/DECISIONS.md` — mọi quyết định có tranh luận, kèm lý do.
- `docs/BAI-HOC.md` — lỗi lặp lại, model nào làm hỏng loại việc nào.
- `docs/bao-cao/M<n>.md` — gói bàn giao milestone cho Kiến trúc sư.

## Kỷ luật token (bắt buộc)
1. Chỉ đọc file trong "Phạm vi file" của phiếu và giao diện liên quan. Không đọc cả repo. Cần khảo sát rộng thì giao `khao-sat` (hoặc làn Gemini nếu bật).
2. Test chạy trước, người review sau: `kiem-thu` PASS rồi Quản lý mới review. FAIL thì trả thẳng về Thợ, không tốn lượt review.
3. Báo cáo trả về ≤ 150 từ (Kiến trúc sư, Sửa lỗi ≤ 250). Log dài thì ghi ra file, trả về đường dẫn + 5 dòng lỗi đầu.
4. Trần vòng lặp: 3 lần sửa mỗi bậc model, 3 lượt phản biện mỗi tranh luận, 2 lượt sửa lỗi mỗi sự cố, 6 lượt thợ mỗi phiếu. Chạm trần thì nâng bậc hoặc dừng hỏi Chủ dự án. Không ai được "thử thêm lần nữa" ngoài trần.
5. Song song chỉ khi các task không đụng chung file; tối đa 3 task cùng lúc.
6. Ghi sổ ngay sau mỗi bước, để phiên có thể compact hoặc khởi động lại mà không mất trạng thái.

## Mức lỗi
- S1 — chặn toàn dự án: không chạy được test hoặc ứng dụng, môi trường hỏng, mất/hỏng dữ liệu.
- S2 — chặn milestone: regression (test cũ fail), luồng chính (`T-n.END`) fail, phiếu không thể xong vì thiết kế/SPEC sai.
- S3 — cục bộ: lỗi trong phạm vi một phiếu → vòng sửa thường.
- S4 — nhỏ: ghi vào TASKS.md mục Tồn đọng, không dừng.
S1/S2 là SỰ CỐ: chỉ Quản lý mở/đóng, ghi `docs/SU-CO.md`, xử lý theo quy trình trong `quan-ly.md`. Ai phát hiện thì báo đúng nhãn, không tự xử.

## Chống bế tắc
- Mỗi phiếu DONE là một commit; milestone đã duyệt có tag `M<n>-ok`. Lùi bằng git thay vì sửa chồng lên lỗi.
- Test của phiếu đã DONE là khóa: sửa/xóa/skip phải khai báo trong báo cáo, và `kiem-thu` sẽ đánh dấu NGHI VẤN.
- Sửa lỗi phải tái hiện bằng test thất bại trước khi sửa; sửa xong chạy toàn bộ suite, không chỉ test của phiếu.

## Phiếu giao việc (Quản lý ghi vào TASKS.md; Thợ chỉ nhận phiếu này)
### T-<ms>.<n> — <tên>
- Mục tiêu:
- Phạm vi file (chỉ được sửa):
- Giao diện / đầu vào có sẵn:
- Tiêu chí nghiệm thu: [ ] … [ ] …
- Lệnh kiểm tra:
- Model: haiku | sonnet | opus | gemini · Lần thử: 0/3 · Trạng thái: TODO | DOING | REVIEW | DONE | BLOCKED

## Báo cáo của Thợ (đúng khung này)
KẾT QUẢ: DONE | PHẢN BIỆN | BLOCKED — Task: T-x.y
- Đã sửa: <file>: <một dòng mỗi file>
- Kiểm tra: <lệnh đã chạy> → <N pass / M fail>
- Ngoài phạm vi (nếu có):
- Lưu ý: ≤ 3 gạch đầu dòng

## Phản biện (khuyến khích khi phiếu sai, thiếu, hoặc rủi ro — thay vì đoán mò)
PHẢN BIỆN (lượt k/3) — Vấn đề · Bằng chứng (file/dòng/test) · Đề xuất thay thế · Rủi ro nếu làm theo yêu cầu gốc
- Quản lý trả lời CHẤP NHẬN (sửa phiếu, ghi DECISIONS.md) hoặc BÁC BỎ (kèm lý do), rồi cho Thợ tiếp tục.
- Hết 3 lượt chưa chốt → Quản lý gửi gói TRỌNG TÀI cho Kiến trúc sư (yêu cầu gốc, hai quan điểm, ràng buộc SPEC liên quan). Phán quyết ghi vào DECISIONS.md, các bên tuân theo.

## Phán quyết của Kiến trúc sư
PHÁN QUYẾT: DUYỆT | SỬA | DỪNG — Lý do ≤ 5 dòng · Việc cần làm (nếu SỬA) · Câu hỏi cho Chủ dự án (nếu DỪNG)

## Làn Gemini (v2)
- Gemini (Antigravity CLI `agy`; model theo làn trong docs/LAN-GEMINI.md mục 1 và scripts/gemini.env) là thợ chính thức; mọi việc giao Gemini đi qua subagent `tho-gemini`. Quy tắc: docs/LAN-GEMINI.md. Quy tắc Gemini phải theo: AGENTS.md.
- Gemini không commit, không sửa test cũ, không sửa file ngoài danh sách phiếu. Kết quả Gemini qua kiem-thu → review → commit như thợ Claude.
- Gemini và thợ Claude không ghi file cùng lúc. Thư mục docs/gemini-out là kết quả Gemini; docs/tasks là prompt.

## Cấm
- Bịa kết quả test; sửa test cho pass; báo DONE khi chưa tự chạy lệnh kiểm tra.
- Sửa file ngoài phạm vi mà không khai báo.
- Thợ / Sửa lỗi / Kiểm thử chạy lệnh git làm đổi cây làm việc hoặc lịch sử (`stash`, `checkout --`, `reset`, `clean`, `commit`, `tag`) — chỉ Quản lý được làm (D-012). Cần chạy code cũ: `git show HEAD:<file>` ra thư mục tạm.
- `git push`, deploy, xóa dữ liệu, thêm dịch vụ trả phí, đổi phạm vi SPEC: chỉ Quản lý được làm, và phải hỏi Chủ dự án trước.
- Đoán ý Chủ dự án. Không biết thì hỏi.
