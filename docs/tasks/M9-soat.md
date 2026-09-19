SOÁT CHÉO — làn soat — CHỈ ĐỌC, KHÔNG TẠO/SỬA BẤT KỲ FILE NÀO
# Soát chéo M9 — Việc có giờ hạn + sửa hạn (SPEC v1.10, D-035)

## Đọc
docs/SPEC.md §6 M9 (dòng 245–259), docs/bao-cao/M9.md, git diff 32ebe26..1b53059 -- src tests.

## Yêu cầu
Soát chéo liệt kê tối đa 10 vấn đề, xếp theo mức S1–S4. Mỗi vấn đề: mức · file:dòng · cách tái hiện · vì sao sai · gợi ý sửa.

Điểm soát cụ thể:
1. **Khớp SPEC**: 
   - `dueTime` tùy chọn chỉ khi có `due`; không đổi kiểu `due` (ISODate).
   - `cmpTodo` cùng ngày → có `dueTime` trước, `dueTime` ↑, rồi `order`.
   - `sameTodoGroup` thêm điều kiện cùng `dueTime`.
   - Action `setTodoDue { due, dueTime? }`: `{ due: null }` xóa cả hai; `{ due: '...' }` xóa giờ giữ ngày; `{ due: '...', dueTime: '14:00' }` đặt cả hai.
   - `todoDueLabel(due, today, lang, dueTime?, hour12?)` — "Quá hạn" **không kèm giờ** (chỉ nhìn ngày).
   - `defaultReminderAt` việc = `due` + (`dueTime` ?? `08:00`).
   - 3 bố cục hiển thị giờ; `color-scheme: dark`; i18n mới; xóa khóa thừa `reminder.statusReminderOnly`.

2. **`cmpTodo`/`sameTodoGroup`/`setTodoDue` biên**:
   - `due: ''` (chuỗi rỗng) coi như không có hạn.
   - `dueTime: '07:30'` hợp lệ (HH:mm); `'7:30'` / không đúng format → bỏ trường khi import.
   - `setTodoDue` không có `due` mà có `dueTime` → không lưu giờ (bỏ trường).

3. **Nhãn Quá hạn**:
   - `todoDueLabel('2026-10-04', today='2026-10-05', 'vi', '14:00')` → text `'Quá hạn'`, không có giờ `14:00`.

4. **UI TodosTab**:
   - `todo-due-time` ô giờ chỉ hiện khi `todo-due` có giá trị.
   - Sửa hạn: `todo-due-edit`, `todo-due-time-edit`, `todo-due-done`.
   - Xóa ngày (`todo-due-edit = ''`) → mất `dueTime` (nhãn → `+ Hạn`).
   - Vùng chạm, nền tối của ô giờ.
   - `ReminderDialog`: wrapper tách + mount mới mỗi lần mở (không `useEffect([open])`), hộp nhắc lấy `dueTime` từ hàng nhập.

5. **Test E2E** (7 kịch bản):
   - Kịch bản (1) `todo-due-time` hiện/ẩn đúng.
   - (2) thứ tự 3 việc (khác giờ cùng ngày).
   - (3) sửa giờ → thứ tự thay đổi.
   - (4) xóa ngày → việc xuống nhóm không hạn.
   - (5) bố cục To-do + Tuần hiển thị giờ.
   - (6) hộp nhắc lấy `dueTime` từ ô nhập (mount mới lần đầu).
   - (7) reload + đổi ngôn ngữ giữ `dueTime`.

Vấn đề liên quan (báo cáo M9):
- T-9.END viết bằng Haiku (không qua Gemini) — test kiểm thật không (đặc biệt kịch bản 6 dùng `toHaveValue` tự đợi).
- S4-#1 (`ReminderDialog` mount mới) — có sót lần nào không.
- `cmpTodo` thay hành vi `due: ''` — test khóa vẫn pass.

## BÁO CÁO CUỐI
KẾT QUẢ: XONG | KHÔNG XONG
SỐ VẤN ĐỀ: S1=? S2=? S3=? S4=?
<liệt kê vấn đề nếu có>
