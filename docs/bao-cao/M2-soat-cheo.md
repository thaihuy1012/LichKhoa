ĐỌC RỘNG / SOÁT CHÉO

Dưới đây là báo cáo soát chéo M2 (đã kiểm tra kỹ các ràng buộc UI, Date/Time, và State):

### 1. [S2] Lỗi thiếu trường khi khôi phục thiết bị cũ gây lỗi hình nền
- Vị trí: `src/core/model.ts`:137-145
- Tái hiện: Nhập file sao lưu bản cũ (mảng `device` chỉ có width, height). Ảnh nền sinh ra bị lỗi hoặc trống trơn.
- Vì sao sai: Hàm `normalizeState` ép kiểu thẳng `rawDevice` thành `DeviceSpec` mà không gộp giá trị mặc định để bù đắp các trường bị thiếu (`safeTop`, `safeBottom`). Khi render, biểu thức `dev.height * dev.safeTop` ra kết quả `NaN`, làm hỏng tọa độ Canvas. Vi phạm yêu cầu xử lý tương thích state cũ.

### 2. [S2] Mất dữ liệu thời lượng (durationMin) sự kiện qua đêm
- Vị trí: `src/ui/screens/events/EventsTab.tsx`:118 và `src/ui/screens/events/util.ts`:46
- Tái hiện: Lưu sự kiện có bắt đầu 23:00 và kết thúc 01:00 (hôm sau). Mở lại sự kiện sẽ thấy không còn thời lượng (hiển thị trống).
- Vì sao sai: Hàm `minutesBetween` trừ trực tiếp tổng phút. Khi giờ kết thúc nhỏ hơn giờ bắt đầu, kết quả ra số âm (vd: -1320). Điều kiện `mins > 0` lúc lưu chặn lại khiến `durationMin` biến thành `undefined`, đánh mất dữ liệu của người dùng.

### 3. [S2] Giao diện màn Preview bị sót i18n
- Vị trí: `src/ui/screens/Preview.tsx`:183-197, 217-219
- Tái hiện: Đổi ứng dụng sang tiếng Anh, các chữ "Thiết bị", "Tự phát hiện", "Tùy chỉnh", "Lưu ảnh" vẫn là tiếng Việt.
- Vì sao sai: Các nhãn này bị hardcode chữ cứng, không gọi qua hàm `t(key, lang)` dù các khóa (`preview.device`, `preview.save`...) đã tồn tại đầy đủ trong `en.json` và `vi.json`.

### 4. [S3] Hỏng logic sắp xếp Việc cần làm (moveTodo)
- Vị trí: `src/ui/store.ts`:56-69
- Tái hiện: Tạo việc A (có hạn) và việc B (không hạn). Nhấn chuyển B lên/xuống, vị trí hiển thị có thể không đổi nhưng tráo nhầm `order` với một việc đã hoàn thành nằm dưới.
- Vì sao sai: Giao diện đang hiển thị theo thuật toán `cmpTodo` (gom nhóm theo `done` và `due` trước rồi mới tới `order`). Nhưng reducer `moveTodo` lại bốc toàn bộ mảng ra sort chay theo `order` để hoán đổi, làm cho thao tác trên UI sửa sai sự kiện gốc mà không phản ánh đúng trực quan.
