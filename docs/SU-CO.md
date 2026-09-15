# SỰ CỐ — nhật ký lỗi nghiêm trọng (S1/S2)
(Chỉ Quản lý ghi. Đọc đầu mỗi phiên: sự cố chưa đóng xử lý trước mọi việc khác. Trạng thái: MỞ | ĐANG SỬA | CHỜ CHỦ DỰ ÁN | ĐÃ ĐÓNG.)

## Đang mở
- SC-002 (S2, CHỜ CHỦ DỰ ÁN thử máy thật) — iPhone: danh sách Việc không đổi được thứ tự (kéo lẫn nút ▲▼×) — xem dưới.

## SC-002 — iPhone: không đổi được thứ tự Việc, nút ▲▼× trong hàng không bấm được · Mức S2 · Trạng thái: CHỜ CHỦ DỰ ÁN (thử máy thật)
- Phát hiện: 2026-09-15 · bởi Chủ dự án (iPhone 13 Pro Max, PWA, bản `c9f7b82` = tag `M6-ok`) · sau M6.
- Triệu chứng: (1) nhấn giữ kéo → 2 hàng chồng nhau không nhìn thấy, thả tay thứ tự như cũ; (2) nút ▲ ▼ × trong hàng không hoạt động — "không thể thay đổi thứ tự việc". Vuốt trái, Xóa/Hoàn tác qua vuốt, Lưu trữ vẫn đạt.
- Tái hiện: tab Sự kiện › Việc, ≥ 3 việc → chạm ▲/▼/× hoặc nhấn giữ kéo. E2E hiện có dùng chuột nên pass → cần test chạm thật (CDP `Input.dispatchTouchEvent`).
- Nghi: hồi quy do bộ cử chỉ T-6.2/T-6.3 bọc cả hàng (`touchmove preventDefault` khi pending, `suppressClick`, `setPointerCapture`).
- Commit tốt cuối cùng cho nút ▲▼×: `3ef433a` (trước T-6.1/T-6.2; chưa kiểm trên máy thật). Không revert: M6 đã duyệt (tag `M6-ok`), revert mất > 1 phiếu DONE → sửa tiến.
- Đóng băng: `src/ui/screens/events/TodosTab.tsx` (chỉ sua-loi B-007 được sửa). Làn Gemini tạm dừng.
- Sửa lượt 1 (sonnet): ĐÃ SỬA một phần — nguyên nhân nút: timer nhấn giữ khởi cả khi target là nút → giữ ≥ 450 ms trên nút bị coi là kéo, click bị nuốt (có test CDP fail trước/pass sau, `docs/test-log/B-007-truoc.log`/`-sau.log`). Kéo: không tái hiện được bằng CDP; sửa bằng đổi `touch-action` giữa chuỗi chạm (Quản lý nghi không hiệu lực trên iOS). Chưa commit.
- Quản lý: lượt 1 chưa đủ (chạm nhanh + xê dịch > 4 px vẫn `preventDefault`; kéo vẫn dựa pointer event dễ bị `pointercancel`) → lượt 2 sua-loi **opus**: kéo cảm ứng bằng Touch Events, không chặn mặc định trên nút con. Không gọi làn soát Gemini (không có thiết bị để thêm bằng chứng; script làn Gemini có thể hoàn tác thay đổi chưa commit).
- Lượt 2 (opus): ĐÃ SỬA — nguyên nhân gốc: (1) transform kéo đặt trên `.todo-item-inner` bên trong `.todo-item-wrap {overflow:hidden}` → hàng kéo và hàng nhường chỗ bị cắt mất (mọi trình duyệt; `elementFromPoint` trả [B,C,A]); (2) kéo kết thúc bằng pointerup/pointercancel — iOS hủy chuỗi pointer → `onDragCancel`; (3) `touchmove` còn preventDefault khi chạm nút xê dịch > 4 px. Sửa: ngón tay chạy bằng Touch Events (chuột vẫn Pointer), transform lên wrap, không chặn mặc định trên nút; D-030 (`touchcancel` áp thứ tự xem trước). 5 test fail trước/pass sau (`docs/test-log/SC-002-truoc.log`, `-sau.log`).
- Kiểm chứng độc lập (kiem-thu): PASS — todo-touch + todo-gestures repeat-each=3 57/0 fail (21 skip webkit: không có CDP/`Touch`, mỗi test chạy thật ở chromium); T-6.END m6 6/6; `npm run check` 97 pass / 13 skip. Log `docs/test-log/SC-002-kiem.log`. Commit sửa: xem git log "SC-002".
- Còn lại: chỉ đóng khi Chủ dự án xác nhận trên iPhone (kéo C lên trên A; chạm nhanh/giữ nút ▲▼×; vuốt vẫn ổn). Không đạt → gói sự cố cho Kiến trúc sư (đã hết 2 lượt sua-loi).

## SC-001 — Không agent nào có công cụ shell · Mức S1 · Trạng thái: ĐÃ ĐÓNG
- Phát hiện: 2026-09-13 · bởi tho-sonnet (BLOCKED) + Quản lý tự kiểm · tại T-1.1 / M1
- Triệu chứng: tho-sonnet chỉ có Read/Edit/Write/Grep/Glob dù `.claude/agents/tho-sonnet.md` khai báo `Bash`; phiên Quản lý cũng không có Bash/PowerShell. Không chạy được `npm install`, `npm run check`, `git`.
- Nghi: trên Windows, công cụ Bash của Claude Code cần Git Bash (Git for Windows), hoặc công cụ shell mang tên khác (PowerShell) nên không khớp khai báo `tools: Bash`.
- Commit tốt cuối cùng: 952e46b · Commit nghi ngờ: không có (lỗi môi trường, không phải lỗi code)
- Đóng băng: toàn bộ phiếu (mọi phiếu đều cần chạy lệnh kiểm tra)
- Chẩn đoán: cần Chủ dự án bật công cụ shell cho Claude Code rồi khởi động lại phiên.
- 2026-09-13: Chủ dự án chọn tự bật shell (cài Git for Windows + Node 22 LTS nếu thiếu, mở lại Claude Code). Phiên sau: Quản lý giao `khao-sat` chạy `git --version; node -v; npm -v` để xác nhận shell hoạt động → nếu được thì đóng SC-001, giao lại T-1.1 (Lần thử vẫn 0/3). Nếu vẫn chưa có shell → hỏi Chủ dự án có muốn thêm `PowerShell` vào `tools` của các agent không.
- 2026-09-13 (phiên 2): Quản lý có công cụ `PowerShell` (git 2.54, node v24.21.0, npm 11.2.0 chạy được). `khao-sat` thử lại: chỉ có Read/Grep/Glob/WebSearch/WebFetch → KHÔNG CÓ SHELL. Nguyên nhân xác nhận: công cụ shell của phiên này tên `PowerShell`, không có `Bash`; các agent khai báo `tools: …Bash…` nên bị lọc mất. Đề xuất: thêm `PowerShell` vào `tools` của 7 agent (giữ `Bash`) → hỏi Chủ dự án.
- 2026-09-13 (phiên 2): Chủ dự án chọn "Thêm PowerShell". Quản lý thêm `PowerShell` vào `tools:` của 8 file `.claude/agents/*.md` (mỗi file 1 dòng, giữ `Bash`; gồm cả `quan-ly.md`). Thử lại ngay trong phiên: vẫn KHÔNG CÓ SHELL → cấu hình agent chỉ nạp lúc khởi động. Chờ Chủ dự án mở lại Claude Code.
- Phiên sau: giao `khao-sat` chạy `git --version; node -v; npm -v` → có shell thì đóng SC-001, commit sửa `.claude/agents` + docs (1 commit), giao lại T-1.1 (Lần thử 0/3). Vẫn không có → trọng tài/hỏi Chủ dự án (phương án: Git Bash qua `CLAUDE_CODE_GIT_BASH_PATH`, hoặc Quản lý tự chạy lệnh).
- 2026-09-13 (phiên 3): sau khi mở lại Claude Code, `khao-sat` có công cụ `Bash`: git 2.54.0.windows.1, node v24.21.0, npm 11.2.0 → ĐÃ ĐÓNG.
- Sửa: `.claude/agents/*.md` dòng `tools:` + `PowerShell` · Kiểm chứng: `khao-sat` chạy `git --version; node -v; npm -v` OK (phiên 3)
- Bài học → BAI-HOC.md: đã ghi (cấu hình agent chỉ nạp lúc khởi động; kiểm tra shell của subagent ngay đầu dự án).
