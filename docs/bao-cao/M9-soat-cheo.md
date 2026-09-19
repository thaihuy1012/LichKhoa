BÁO CÁO CUỐI
KẾT QUẢ: XONG
SỐ VẤN ĐỀ: S1=0 S2=0 S3=1 S4=1
- S3 · tests/e2e/m9-todo-time.spec.ts:305 · Chạy kịch bản 6 (kiểm tra hộp nhắc mount mới). · Hàm `toHaveValue` của Playwright tự động đợi (retry) nên test có thể pass kể cả khi component bị lỗi cập nhật chậm, không kiểm chứng chặt chẽ được điều kiện "ngay lần đọc đầu" (không toPass) như Báo cáo M9 băn khoăn. · Sửa thành `expect(await remAtInput1.inputValue()).toBe('2026-10-07T06:45')` để đánh giá trạng thái tức thời ở ngay lần render đầu.
- S4 · src/ui/screens/events/TodosTab.tsx:83 · Chạm vào nhãn hạn của việc để mở form sửa, xóa trắng ô nhập ngày hạn. · Ô nhập giờ `todo-due-time-edit` vẫn hiển thị dù ngày hạn đã rỗng (vi phạm nguyên tắc "chỉ hiện khi có ngày" của ô giờ). · Bọc thẻ `<input type="time" data-testid="todo-due-time-edit" ... />` bên trong điều kiện `{Boolean(editDue) && ...}`.
