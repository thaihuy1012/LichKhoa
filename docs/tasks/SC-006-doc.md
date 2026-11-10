ĐỌC RỘNG — làn doc — CHỈ ĐỌC, KHÔNG TẠO/SỬA BẤT KỲ FILE NÀO, KHÔNG CHẠY npm/playwright
# SC-006: vì sao 4 test e2e cũ fail sau khi chuyển dự án từ Windows sang macOS?

## Bối cảnh (đã kiểm chứng, không cần kiểm lại)
- Trước đây `npm run check` xanh trên Windows. Nay chạy trên macOS arm64, Node v26.13.0, `npm ci` lại; @playwright/test 1.63.0, trình duyệt chromium-1243 và webkit-2359 (WebKit 26.6) vừa tải. Playwright chạy `vite preview` cổng 4173 phục vụ `dist/` (đã build lại trước khi test).
- Unit test 337 × 2 múi giờ PASS. E2E 130 pass / 4 fail / 14 skip.
- Cả 4 test fail y hệt trên mã HEAD chưa sửa → do môi trường, KHÔNG do thay đổi mới. Mã sản phẩm giống bản đang chạy tốt trên iPhone thật.
- 4 test (repeat-each=3):
  1. `tests/e2e/notes.spec.ts:10` — chỉ chromium, 3/3 fail: `getByTestId('note-item')` count 0 (cần 2) ngay sau 2 lần `nt-save`. webkit PASS.
  2. `tests/e2e/m10-install.spec.ts:68` — chỉ webkit, 3/3 fail: `page.waitForEvent` (popup) hết 30 s.
  3. `tests/e2e/m6-todo-gestures.spec.ts:89` — chỉ webkit, 3/3 fail: thứ tự `todo-edit` sai ở dòng ~203 (sau kéo sắp xếp / reload).
  4. `tests/e2e/todo-touch.spec.ts:374` — chromium, chập chờn 1/3 (touchcancel khi kéo).

## Đọc
AGENTS.md; playwright.config.ts; docs/test-log/B-022-check.log và docs/test-log/B-022-rerun.log (đọc phần lỗi, không cần đọc hết); mọi `test-results/*/error-context.md` (ảnh chụp cây DOM lúc fail — RẤT quan trọng); 4 file spec trên; mã app liên quan: src/ui/screens/events/NoteTab.tsx (test 1), src/ui/screens/Guide.tsx (test 2), các file xử lý kéo/vuốt danh sách Việc mà spec 3/4 gọi tới (tự tìm từ data-testid trong spec, tối đa 6 file src). Chỉ đọc thêm file khác nếu thật cần.

## Yêu cầu
Với TỪNG test trong 4 test, trả lời theo khung:
- Test: <file:dòng> · <trình duyệt>
- Nguyên nhân khả dĩ nhất: <1–3 câu> · Bằng chứng: <file:dòng hoặc trích ≤ 2 dòng từ error-context/log>
- Phân loại: (A) test phụ thuộc môi trường/timing — app đúng | (B) lỗi thật của app trên trình duyệt mới (có thể ảnh hưởng iPhone/Safari) | (C) chưa đủ bằng chứng
- Đề xuất sửa: <file:dòng — một câu mô tả thay đổi>; nếu (A) thì sửa test thế nào mà KHÔNG làm yếu điều test kiểm (không tăng timeout bừa, không skip)
- Cách xác nhận: <lệnh playwright cụ thể, ví dụ `npx playwright test tests/e2e/notes.spec.ts:10 --project=chromium --repeat-each=5`>
- Độ tin: cao | vừa | thấp
Sau đó 1 đoạn ≤ 5 dòng: các test có chung một nguyên nhân gốc không (ví dụ khác biệt macOS: phím tắt Meta/Control, IndexedDB, popup chặn, touch events, font/kích thước khung)?
Không viết lại code, không khen, không đề xuất ngoài 4 test này.

## BÁO CÁO CUỐI (in đúng khung này ở cuối, bằng tiếng Việt)
KẾT QUẢ: XONG | KHÔNG XONG
SỐ TEST ĐÃ CHẨN ĐOÁN: ../4 · A=.. B=.. C=..
<4 khối theo khung trên + đoạn nguyên nhân chung>
