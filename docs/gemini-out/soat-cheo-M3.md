### 1. [S1] Không tách sự kiện cả ngày nhiều ngày, sai quy ước ID
- Vị trí: `src/google/calendar.ts`:90
- Tái hiện: Đồng bộ sự kiện cả ngày từ 14/09 đến 16/09 → Chỉ hiện trên agenda ở ngày 14/09 (mong đợi: hiện đủ cả 3 ngày).
- Vì sao sai: Hàm `normalize` chỉ dùng `ev.start.date` tạo 1 `Occurrence`, bỏ qua `ev.end.date`. Hàm thiếu vòng lặp sinh sự kiện cho từng ngày trong khoảng và `id` bị gán tĩnh, thiếu hậu tố `@<date>` theo yêu cầu (Báo cáo M3, Bổ sung T-3.2).

### 2. [S2] PWA iOS Standalone mất token, thiếu `prompt=none`
- Vị trí: `src/ui/screens/Sync.tsx`:126
- Tái hiện: Mở PWA từ Màn hình chính iOS, nhấn "Kết nối" → App văng ra Safari ngoài. Khi đăng nhập xong, PWA gốc vẫn không có token (mong đợi: kết nối thành công và dùng được trong PWA).
- Vì sao sai: Gán `window.location.href` khiến iOS mở trình duyệt ngoài, làm token bị lưu ở storage Safari thường, tách biệt hoàn toàn với storage của PWA. Thiếu cơ chế dùng iframe ngầm + `prompt=none` để lấy token gia hạn như SPEC §8 rủi ro 1 đề cập.

### 3. [S3] Test E2E bỏ lọt lỗi sự kiện nhiều ngày, assert lỏng
- Vị trí: `tests/e2e/m3-google.spec.ts`:34
- Tái hiện: Chạy test E2E → Test báo qua dù hàm `normalize` đang lỗi nghiêm trọng.
- Vì sao sai: Fixture gán `start.date` là hôm nay, `end.date` là ngày mai, tạo ra sự kiện dài đúng 1 ngày (do Google quy ước `end` exclusive). Khẳng định `expect.stringContaining` ở L146 quá lỏng, không đếm số lượng hay vị trí hiển thị sự kiện trên layout.

### 4. [S3] Skip test offline WebKit che giấu rủi ro PWA
- Vị trí: `tests/e2e/m3-google.spec.ts`:219
- Tái hiện: Chạy test trên môi trường webkit → Bước test offline bị skip vô điều kiện.
- Vì sao sai: Bỏ qua bài kiểm tra service worker quan trọng nhất trên iOS. Thợ lạm dụng `test.skip` thay vì tìm giải pháp kiểm định khác (như `caches.match` Quản lý nhắc ở D-013), che giấu nguy cơ PWA lỗi khi mất mạng thực tế.

### 5. [S3] App crash do giải mã lỗi URL hai lần
- Vị trí: `src/google/oauth.ts`:60
- Tái hiện: Google trả về hash `#error=invalid_request%25` → App sập trắng trang do `URIError`.
- Vì sao sai: `URLSearchParams.get()` đã tự động URL-decode chuỗi. Việc gọi thêm `decodeURIComponent()` là thừa, sẽ ném exception không được bắt nếu mã lỗi chứa ký tự `%` đứng trước tổ hợp không hợp lệ.

### 6. [S4] Race condition giữa tự đồng bộ và đồng bộ tay
- Vị trí: `src/ui/App.tsx`:72
- Tái hiện: Mở app, vào ngay tab Đồng bộ bấm "Đồng bộ ngay" khi app đang tự đồng bộ ngầm ở nền → Gửi request API 2 lần song song.
- Vì sao sai: Không có biến khóa (lock) trạng thái toàn cục để chặn UI khi `autoSyncIfNeeded` đang chạy, dẫn đến trùng lặp request và có nguy cơ ghi đè lộn xộn vào store.
