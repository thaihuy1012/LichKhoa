SOÁT CHÉO — làn soat · M8-soat — CHỈ ĐỌC, KHÔNG TẠO/SỬA BẤT KỲ FILE NÀO
# Soát chéo milestone M8 — Báo thức đúng ngày (SPEC v1.9, D-034)

## Đọc
- SPEC.md: IN-12 dòng 35–40 (tóm tắt), §6 M8 dòng 225–233 (spec lõi), §8.11 dòng ~256 (giới hạn đã biết)
- docs/bao-cao/M8.md (phiếu đã xong, test tổng, sự cố, điểm báng khoăn)
- diff `git diff cbbeaa6~1..HEAD -- src tests docs/HUONG-DAN.md` (code, test, tài liệu)
- AGENTS.md, CLAUDE.md (quy tắc)

## Yêu cầu
Liệt kê vấn đề S1–S4 (tối đa 10), xếp theo mức, mỗi vấn đề: **mức — file:dòng — cách tái hiện (hoặc bằng chứng code) — vì sao sai — gợi ý sửa một dòng**.

Đặc biệt soát:
1. **Đúng/sai so với SPEC**:
   - `dayAlarmWindow` logic 4 trạng thái: `past` / `today` / `too-early` / `ok`
   - `DAY_ALARM_MIN_TIME` = 00:30 (giờ phút), không là millisecond?
   - Nút `rem-dayalarm` bật chỉ khi `dayAlarmWindow = ok`; hai nút cũ giữ `reminderWindow`
   - Payload: `reminderText(at, title, note)` không đổi; không mang tên danh sách
   - `normalizeState`: thiếu/số/rỗng → `ThemBaoThucNgay`, có chuỗi → giữ
   - i18n: 3 dòng hint + 5 trạng thái trong `rem-status` (VI/EN)
   - Prop `dayAlarmShortcutName` của `ReminderDialog` **bắt buộc** (kiểm 3 form mỗi form 1 dòng truyền)

2. **Logic `rem-status` (5 trạng thái)**:
   - `past` → "Thời điểm này đã qua…"
   - `today` → "Hôm nay: dùng Thêm báo thức (kêu to) hoặc Thêm lời nhắc."
   - `too-early` → "Báo thức đúng ngày cần giờ từ 00:30 (Tự động hóa chạy 00:05)."
   - `alarm-ok` → "Trong 24 giờ tới: cả ba cách đều được."
   - còn lại → "Quá 24 giờ: dùng Báo thức đúng ngày (kêu to) hoặc Thêm lời nhắc."
   - Kiểm: test E2E kịch bản (2)–(4) áp dụng đặc thù từng trạng thái, không generic

3. **Test kiểm thật hay bề mặp**:
   - Unit `dayalarm.test.ts`: mốc giờ (2026-10-05, 2026-10-06, …) có chính xác; TZ là gì; `now` cố định hay dùng `new Date()`?
   - E2E `m8-dayalarm.spec.ts`: `page.clock.setFixedTime` có đặt trước mở app (mục §M8 tiêu chí (1))? Kiểm bản sao payload, cách tách "Item 3" ghi chú
   - Kịch bản (5) "nhập việc chưa bấm Thêm" → vẫn gửi danh sách qua shortcut chứ?

4. **HUONG-DAN §E.3 iOS 18**:
   - Danh sách `BaoThuc` tạo bằng tay hay import từ Phím tắt (mục nào)?
   - "Find Reminders" + "Is Completed is No" → lọc chỉ các lời nhắc chưa thực hiện (đúng?); đó có phải "Due Date is Today" hay "Due Date is on Today"? (Khác trên iOS 18)
   - "Create Alarm" nhận biến "Due Date" làm "Time" (không cần format Date → Time?); chạy trên iOS 18 có cần bước "Set Due Date = biến Ngày giờ" như §8.11(f) ghi?
   - "Edit Reminder → Set Is Completed" có thực hiện được in-place hay phải quay về trước "End Repeat"?
   - Thẻ Hướng dẫn 7–8: tiêu đề, nội dung khớp i18n không?

5. **Sự cố / điểm báng khoăn trong báo cáo**:
   - S4 `ReminderDialog` giữ state `at` giữa lần mở (có so sánh trước/sau fix không?)
   - S4 khóa i18n `reminder.statusReminderOnly` không dùng (còn trong json hay đã xóa?)
   - Fixture / `defaultState`: thêm tên danh sách nào; đã khai báo trong báo cáo không?

Không khen, không viết lại code, không nêu phong cách trừ khi ảnh hưởng đúng/sai. 

## BÁO CÁO CUỐI (in đúng khung này ở cuối, bằng tiếng Việt)
KẾT QUẢ: XONG | KHÔNG XONG
SỐ VẤN ĐỀ: S1=.. S2=.. S3=.. S4=..
[Danh sách vấn đề]
