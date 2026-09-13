Dưới đây là kết quả ĐỌC RỘNG và đối chiếu chi tiết theo SPEC và TASKS của LichKhoa:

## A. Bảng theo phiếu
| Phiếu | Nguồn (file:Lx–Ly) | Nội dung | Mức (DÙNG THẲNG / THAM KHẢO) | Cần đổi khi port (Preact, `t()` i18n, `data-testid`, reducer action có sẵn) |
|---|---|---|---|---|
| T-2.7 | lich-nen.html:341-375 | Form sự kiện (trường, lặp, màu, until) | THAM KHẢO | Chuyển JSX; nhãn dùng `t()`; gán `data-testid`; xử lý form gọi action `addEvent` / `updateEvent` / `deleteEvent`. |
| T-2.7 | lich-nen.html:275-286 | Danh sách to-do (thêm/tick/xóa) | THAM KHẢO | Chuyển JSX; nối `addTodo`, `toggleTodo`, `deleteTodo`; thêm nút "Lên/xuống" gọi `moveTodo` (do cũ chưa có). |
| T-2.7 | lich-nen.html:379-384 | Form ghi chú | THAM KHẢO | Chuyển JSX; gọi `setNote`; đổi switch thành logic checkbox Preact. |
| T-2.7 | lich-nen.html:311-313 | Xuất/nhập JSON + xóa dữ liệu | THAM KHẢO | Chuyển UI; gán `exportBackup/importBackup`; gọi `replaceState` / `resetAll` (nhớ bọc confirm). |
| T-2.7 | lich-nen.html:144-162 | CSS form mobile (Sheet trượt, Field) | THAM KHẢO | Đưa vào `styles.css`; đổi `class` thành `className`. |
| T-2.7 | lich-nen.html:373 | Nút tải .ics | THAM KHẢO | Gọi `eventToIcs` của M2 để tải file; gán `data-testid`. |
| T-2.END | (Không có) | E2E testing | KHÔNG | App cũ không có E2E. |
| T-3.3 | lich-nen.html:388-392 | Màn Đồng bộ | KHÔNG | App cũ dán text Scriptable, LichKhoa dùng OAuth Google. (UI không khớp). |
| T-4.1 | LichNen.js:253-257 | Toán học ảnh nền (cover-fit) | DÙNG THẲNG | Bê nguyên logic tính `scale`, `dw`, `dh` nhưng áp cho `CanvasRenderingContext2D` và `Blob`. |
| T-4.2 | lich-nen.html:184-237 | Control Thiết kế (ảnh/màu/dim/font/tọa độ) | THAM KHẢO | Chuyển JSX tab Thiết kế; thêm control `blur`; nối `dispatch({type: 'setDesign', partial})`. |
| T-4.3 | lich-nen.html:250 | Nút "Lưu hình nền" | THAM KHẢO | Đổi tên/icon; nhấn vào gọi `copyPng` sau đó gọi `openShortcut` của M4. |
| T-4.4 | lich-nen.html:324 | Cài đặt lên Màn hình chính | DÙNG THẲNG | Đúng cho LichKhoa: "Mở Safari → Chia sẻ → Thêm vào MH chính". |
| T-4.4 | huong-dan-giai-doan-2.md:61-68 | Hướng dẫn Shortcuts (Phím tắt) | THAM KHẢO | **Đúng cho LichKhoa:** thao tác thêm action "Set Wallpaper". **Chỉ đúng cho Scriptable (BỎ QUA):** action "Run Script" (LichKhoa dùng `input=clipboard`). |

## B. Hướng đi đáng theo
- **UX Form trượt lên (Sheet):** Tiết kiệm không gian mobile, tập trung điền sự kiện/ghi chú không rời màn hình chính (lich-nen.html:144-150) · Áp vào T-2.7.
- **Tùy chỉnh phân đoạn (Segmented Control):** Dùng CSS `.seg` thay vì `<select>` cho Chọn Layout, Vị trí, Căn lề để thao tác nhanh một chạm (lich-nen.html:66-68) · Áp vào T-4.2.
- **Chọn màu linh hoạt:** UI bảng màu gồm các ô chọn nhanh (`swatches`) đi kèm một ô `<input type="color">` để tự phối (lich-nen.html:213-215) · Áp vào T-4.2.
- **Báo lỗi qua Toast:** Khối thông báo nổi ở đáy màn hình tự tắt (lich-nen.html:166-168) · Dùng để thông báo lỗi clipboard/shortcut (T-4.3).
- **Ẩn/hiện việc đã xong:** Toggle ẩn việc đã tick giúp dọn dẹp không gian (lich-nen.html:282-285) · Áp vào T-2.7.

## C. Không dùng / vượt phạm vi
- Widget Scriptable cho iOS màn hình chính/khóa.
- Tính năng chạy nền tự động lấy sự kiện + đổi hình nền mỗi sáng không chạm.
- Lặp sự kiện T2–T6 (`weekdays`).
- Nhắc giờ qua chuẩn `VALARM` trong .ics (việc này để ứng dụng Lịch của Apple tự làm khi import).
- Nhập/parse file `.ics` (M2 quy định chỉ xuất .ics).
- Cấu hình file `lichnen-config.json` qua iCloud Drive.

## D. Cảnh báo
- **Bug Lặp hằng tháng:** Tại `lich-nen.html:666` đoạn tính ngày dừng `until = ymd(new Date(d.getFullYear(), d.getMonth() + n, d.getDate()))`. Nếu ngày tạo là 31, cộng tháng bằng hàm Date JS có thể bị tràn sang tháng sau (ví dụ 31/04 tự nảy thành 01/05), làm ngày lặp bị lệch. Khi làm T-2.7 cần chặn lặp tháng vào cuối tháng/viết test kỹ.
- **Thông tin nhạy cảm:** Toàn bộ code tĩnh và xử lý client-side. Không tìm thấy token, email hay secret key nào. Bố cục Google OAuth M3 cần chú ý không rò rỉ token.
