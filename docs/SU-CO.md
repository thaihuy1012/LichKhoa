# SỰ CỐ — nhật ký lỗi nghiêm trọng (S1/S2)
(Chỉ Quản lý ghi. Đọc đầu mỗi phiên: sự cố chưa đóng xử lý trước mọi việc khác. Trạng thái: MỞ | ĐANG SỬA | CHỜ CHỦ DỰ ÁN | ĐÃ ĐÓNG.)

## Đang mở
- **SC-005** (S2, ĐANG SỬA 2026-09-22) — B-016 gộp Hoàn tác: REGRESSION `m6-todo-gestures.spec.ts:172` 2 vòng liên tiếp

## Đã đóng gần đây
- **SC-004** (S2, ĐÃ ĐÓNG 2026-09-19) — hàng thêm việc tràn 428 pt (M9)
- **SC-003** (S2, ĐÃ ĐÓNG 2026-09-19) — Phím tắt Lời nhắc lỗi "No alert location was provided" → B, B', C KHÔNG ĐẠT trên iPhone thật (2026-09-19)

## SC-005 — B-016 gộp Hoàn tác gây REGRESSION test khóa M6 · Mức S2 · Trạng thái: ĐANG SỬA
- Phát hiện: 2026-09-22 · kiem-thu (vòng 1) và tho-gemini tự chạy (vòng 2). Luật: REGRESSION lần 2 → S2.
- Triệu chứng: `tests/e2e/m6-todo-gestures.spec.ts:172` `toHaveCount(3)` sau `toast-undo` → 4. Kịch bản: xóa X → thêm A,B,C → xóa A → Hoàn tác → X cũng trở lại. Vòng 2 (quy tắc "đúng 1 dispatch giữa 2 showToast", D-036 siết) vẫn sai — đếm `dispatchCountRef` bị đặt lại sai chỗ. Log: `docs/test-log/B-016.txt`.
- Tái hiện: áp `docs/tasks/B-016-v2.Events.tsx.txt` → `src/ui/screens/Events.tsx`, `docs/tasks/B-016-v2.spec.ts.txt` → `tests/e2e/b016-toast-undo.spec.ts`; `npx playwright test tests/e2e/b016-toast-undo.spec.ts tests/e2e/m6-todo-gestures.spec.ts`.
- Commit tốt cuối cùng: `cc187fd` (HEAD, chưa commit gì của B-016 → nhánh chính KHÔNG hỏng; đã trả cây về HEAD, bản v1/v2 cất ở `docs/tasks/`).
- Đóng băng: `src/ui/screens/Events.tsx`, `tests/e2e/b016-toast-undo.spec.ts` — chỉ sua-loi. B-017 chờ (cùng vùng UI Việc). Làn Gemini dừng tới khi đóng.
- Sửa lượt 1: `sua-loi` (opus) — làm B-016 theo phiếu + D-036 siết; tái hiện bằng test thất bại trước.

## SC-004 — Hàng thêm việc tràn ở 428 pt khi ô Giờ hiện · Mức S2 · Trạng thái: ĐÃ ĐÓNG
- Phát hiện: 2026-09-19 · Kiến trúc sư khi duyệt M9 (đo Playwright 428 pt): webkit nội dung 559/404 px, `todo-add` x 505–571 ngoài màn hình, `overflow-x: hidden` nên không cuộn tới; chromium 425/404, nút cắt 9 px. E2E không bắt vì Playwright tự cuộn khi click.
- Nguyên nhân (Kiến trúc sư): `src/ui/styles.css:777` `.addrow-todo-due-line .todo-due-hint` có `flex: 1` nhưng giữ `min-width: auto`.
- Commit tốt cuối cùng: 32ebe26 (trước M9; lỗi do T-9.3 86a3534 — thuộc milestone CHƯA duyệt). Không revert (mất cả T-9.3); sửa tại chỗ theo phán quyết SỬA.
- Đóng băng: `src/ui/styles.css`, `TodosTab.tsx`, `m9-todo-time.spec.ts` — chỉ phiếu T-9.4. Làn Gemini dừng tới khi đóng.
- ĐÓNG 2026-09-19: sua-loi (opus) lượt 1 ĐÃ SỬA — tái hiện bằng assert boundingBox (fail 571/437 > 428, `docs/test-log/SC-004-truoc.log`), thêm `min-width: 0`; kiem-thu độc lập PASS (m9 ×3 hai trình duyệt; check 104/14 skip; `SC-004-kiem.log`). Commit: xem git log "T-9.4".
- Sửa: T-9.4 giao `sua-loi` (opus) — tái hiện bằng assert boundingBox trước, rồi sửa; gộp 3 việc test + S4 TodosTab:80–91 theo phán quyết.

## SC-003 — Phím tắt Lời nhắc lỗi "No alert location was provided" · Mức S2 · Trạng thái: ĐÃ ĐÓNG
- Phát hiện: 2026-09-19 · Chủ dự án thử tay M7 trên iPhone, iOS 18, ngôn ngữ máy Tiếng Anh · sau deploy e432dce.
- Triệu chứng: bấm "Thêm lời nhắc" → Phím tắt `ThemLoiNhac` chạy rồi báo lỗi "No alert location was provided. Please provide a location for this reminder's alert." → không tạo được lời nhắc. Xảy ra ở cả 3 nguồn: Việc (B), Sự kiện (B'), Ghi chú (C). Ảnh: `docs/hinh-anh-loi/IMG_2434.PNG`.
- Mục E cũng KHÔNG ĐẠT (lời nhắc không kêu khi bật Tập trung) — nhưng **phụ thuộc**: chưa tạo được lời nhắc nào thì chưa kết luận được, phải thử lại sau khi đóng SC-003.
- Mục A (báo thức) ĐẠT, D (không báo thức) ĐẠT → phần app và deep link chạy đúng; lỗi nằm ở **hướng dẫn cấu hình Phím tắt** (`docs/HUONG-DAN.md` mục E), không phải mã nguồn.
- Nghi nguyên nhân: hướng dẫn viết "Bật mục **Remind Me (Nhắc tôi)** hoặc **Due Date (Đến hạn vào)**" — mơ hồ. Trên iOS 18, hành động "Add New Reminder" khi bật Alert mặc định có thể là nhắc theo VỊ TRÍ; phải chọn rõ kiểu nhắc theo THỜI GIAN rồi mới gán biến ngày giờ.
- Commit tốt cuối cùng: `e432dce` (bản đang chạy) — không cần lùi, vì lỗi ở tài liệu.
- Đóng băng: `docs/HUONG-DAN.md` mục E (chỉ phiếu sửa SC-003 được sửa). Làn Gemini tạm dừng tới khi đóng sự cố (CLAUDE.md).
- Bước 1: tra cứu cách cấu hình đúng trên iOS 18 (giao `khao-sat` + WebSearch) → sửa hướng dẫn → Chủ dự án thử lại B, B', C, E.
- Sửa lượt 1 (B-009, sonnet): ĐÃ SỬA `docs/HUONG-DAN.md` mục E — thêm 3 bước "No Alert" → "Alert" / "Remind me at a time" → "At Time"; cảnh báo nguyên văn lỗi; phương án dự phòng iOS 18 "Create Reminder"; mục (e) trong "Nếu không chạy". Quản lý tự đọc lại đoạn sửa: đạt. `npm run check` 100 pass. Commit: xem git log "B-009".
- **CHỜ CHỦ DỰ ÁN xác nhận trên iPhone**: sửa đúng 1 ô trong Phím tắt `ThemLoiNhac` rồi thử lại B, B', C, E. Không cần deploy (chỉ sửa tài liệu).
- Lượt 2 (B-012): đổi định dạng dòng 1 sang `d MMM yyyy HH:mm`. Chủ dự án kiểm bằng Quick Look đặt sau `Get Item at Index 1`, chạy THẬT từ app: hiện `23 Sep 2026 08:00` → app gửi đúng, máy đã nạp bản mới. **Nhưng bấm Done xong VẪN lỗi "No alert location was provided"** → nguyên nhân KHÔNG phải định dạng ngày.
- Nghi mới (lượt 3): hành động `Add New Reminder` trên iOS 18 lỗi ở tham số cảnh báo (Apple đang thay bằng `Create Reminder`), hoặc ô Trigger nhận `Dates` là DANH SÁCH ngày thay vì một ngày đơn. Đã đề nghị Chủ dự án: (1) thay bằng hành động `Create Reminder` (có ô Due Date riêng); (2) nếu không có thì chèn `Get Item at Index 1` từ `Dates` rồi mới gán vào Trigger. ĐANG CHỜ kết quả.
- Lượt 3b (2026-09-19, phiên mới): Chủ dự án không dùng được màn `Select Variable` (rối). Ảnh `IMG_2444.PNG`: ô ngày sau `At Time` có vẻ trống; có HAI biến cùng tên "Item from List" (từ Dates và từ Split Text) → dễ gán nhầm. Đã gửi cách mới: thêm 2 hành động `Set Variable` đặt tên `GioNhac` (sau Get Item 1 from Dates) và `TieuDe` (sau Get Item 2 from Split Text), rồi gán vào hành động Add qua thanh biến trên bàn phím. CHỜ kết quả + ảnh chụp.
- ĐÓNG 2026-09-19: Chủ dự án xác nhận mục B ĐẠT (lời nhắc hiện trong Reminders, danh sách "Sẽ làm", đúng giờ). Nguyên nhân gốc: thẻ `Add New Reminder` (iOS 18) — ô **Trigger** (hiện dưới dạng `At Time …` khi mở rộng ›) gắn `Dates` = DANH SÁCH ngày, rồi sau khi Clear thì để trống (chữ xám "2:00 PM" là chữ mẫu) → iOS đòi vị trí. Sửa: 2 hành động `Set Variable` (`GioNhac` sau Get Item 1 from Dates, `TieuDe` sau Get Item 2 from Split Text), gán `TieuDe` vào tiêu đề và `GioNhac` vào ô giờ. Không đổi mã nguồn. Việc tiếp: B-014 viết lại HUONG-DAN mục E; Chủ dự án thử B′, C, E.
- Nếu cả hai hỏng → đổi hướng thiết kế: app tạo SỰ KIỆN LỊCH có cảnh báo thay cho Lời nhắc (cần Kiến trúc sư + Chủ dự án duyệt).

## SC-002 — iPhone: không đổi được thứ tự Việc, nút ▲▼× trong hàng không bấm được · Mức S2 · Trạng thái: ĐÃ ĐÓNG
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
- Máy thật (Chủ dự án, deploy f299bb5): nhấn giữ kéo đổi thứ tự ✔; nút ▲▼× chạm nhanh/giữ ✔; vuốt Xóa/Hoàn tác ✔ → ĐÃ ĐÓNG 2026-09-15. Commit sửa: f299bb5. Bài học → BAI-HOC.md (đã ghi). Mở băng TodosTab.tsx.

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
