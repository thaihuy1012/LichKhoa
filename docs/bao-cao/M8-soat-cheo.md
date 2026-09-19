I'm currently searching your system for the `AGENTS.md` and `docs/tasks/M8-soat.md` files so that I can read them and proceed with your instructions. I'll continue once I locate them.
KẾT QUẢ: XONG
SỐ VẤN ĐỀ: S1=0 S2=0 S3=0 S4=4

S4 — `src/ui/components/ReminderDialog.tsx`:dòng 41-45 — mở hộp thoại, đóng lại rồi mở tiếp sẽ thấy giờ cũ chớp 1 nhịp. — vì `useEffect` chạy sau render nên frame đầu tiên vẫn dùng state `at` cũ. — Gợi ý sửa: đổi `useEffect` thành `useLayoutEffect` hoặc truyền `key={open}`.
S4 — `src/core/i18n/vi.json`:dòng 146 — khóa `reminder.statusReminderOnly` vẫn còn dù nội dung đã sửa giống `statusOver24h`. — mã dư thừa, không còn được sử dụng trong logic `ReminderDialog`. — Gợi ý sửa: Xóa dòng chứa khóa `reminder.statusReminderOnly` ở cả 2 file `vi.json` và `en.json`.
S4 — `docs/HUONG-DAN.md`:dòng 31 (bản diff mới) — `Due Date is Today` — trên giao diện iOS 18 tiếng Anh, điều kiện lọc ngày thực tế trong Phím tắt là "is on" ("Due Date is on Today"). — tài liệu lệch giao diện thật của hệ điều hành. — Gợi ý sửa: Sửa thành `Due Date is on Today`.
S4 — `docs/bao-cao/M8.md`:mục Test tổng — không khai báo việc thêm `dayAlarmShortcutName` vào `defaultState` trong báo cáo. — vi phạm yêu cầu "ngoại lệ được phép: fixture/defaultState thêm 1 tên, phải khai báo" theo SPEC §6 M8. — Gợi ý sửa: Thêm câu "Khai báo ngoại lệ: đã thêm dayAlarmShortcutName vào defaultState" vào file báo cáo.
