### 1. [S1] Workflow GitHub Pages thiếu quyền checkout
- Vị trí: `.github/workflows/pages.yml`:18
- Tái hiện: Đẩy code lên nhánh `main` → Action báo lỗi ở bước Checkout (mong đợi: Checkout thành công)
- Vì sao sai: Khai báo `permissions` đè quyền mặc định. Thiếu `contents: read` khiến `actions/checkout` không thể lấy code.

### 2. [S2] Manifest thiếu start_url và scope
- Vị trí: `vite.config.ts`:12
- Tái hiện: Cài PWA từ GitHub Pages → Đồng bộ Google bị kẹt, văng Safari (mong đợi: Quay lại PWA)
- Vì sao sai: VitePWA không tự nối `VITE_BASE`. SPEC §8(1) bắt buộc `scope`/`start_url` bằng `base` để PWA iOS nhận đúng luồng OAuth.

### 3. [S2] ClipboardItem trên iOS thiếu Promise
- Vị trí: `src/export/share.ts`:38
- Tái hiện: Bấm "Đặt hình nền" trên iPhone → App hiện toast lỗi (mong đợi: Đã sao chép)
- Vì sao sai: Safari iOS bắt buộc tham số `data` của `ClipboardItem` phải là Promise (phải dùng `Promise.resolve(blob)`).

### 4. [S2] Xóa dữ liệu không dọn ảnh nền IndexedDB
- Vị trí: `src/ui/screens/Preview.tsx`:140
- Tái hiện: Bấm Xóa dữ liệu → Chọn nền Ảnh → Ảnh cũ lại hiện ra (mong đợi: App trống như mới)
- Vì sao sai: `resetAll` chỉ đặt lại state chữ, không gọi `saveBg(null)` dể xóa Blob lưu ở `BG_KEY`.

### 5. [S2] Nhập backup JSON giữ lại ảnh nền cũ
- Vị trí: `src/ui/screens/Preview.tsx`:131
- Tái hiện: Nhập JSON của máy khác → App dùng thiết kế mới nhưng giữ ảnh cũ (mong đợi: Bỏ ảnh cũ)
- Vì sao sai: Hàm nhập thay `AppState` nhưng không gọi `saveBg(null)` dọn file ảnh không thuộc về JSON đó.

### 6. [S2] Rò rỉ bộ nhớ ImageBitmap trên iOS
- Vị trí: `src/render/background.ts`:104
- Tái hiện: Chọn nhiều ảnh lớn liên tiếp → Safari crash (mong đợi: Không tràn RAM)
- Vì sao sai: Không gọi `img.close()` để giải phóng GPU sau khi `ctx.drawImage` (SPEC ưu tiên rò bộ nhớ).

### 7. [S2] Test giả qua: Bắt lỗi để skip
- Vị trí: `tests/e2e/m4-offline.spec.ts`:36
- Tái hiện: Mạng lỗi thật khi test webkit → Test báo SKIP (mong đợi: Báo FAIL)
- Vì sao sai: Cố tình bắt `navError` rồi nhét vào `test.skip`, dùng skip để giấu lỗi điều hướng thay vì assert.

### 8. [S3] Hướng dẫn thiếu bước bật "Shortcut Input"
- Vị trí: `docs/HUONG-DAN.md`:36
- Tái hiện: Người dùng tạo Phím tắt → Không tìm thấy "Shortcut Input" (mong đợi: Chọn được)
- Vì sao sai: iOS 17 mặc định Shortcut không nhận input. Thiếu bước bật "Receive Any input" (hoặc Show in Share Sheet) khiến người dùng kẹt.

### 9. [S3] Đổi sang nền Màu không giải phóng Ảnh
- Vị trí: `src/ui/screens/Design.tsx`:63
- Tái hiện: Đổi từ Ảnh sang Màu đơn → DB không giảm (mong đợi: Dọn ảnh cũ)
- Vì sao sai: `setBgKind` không gọi `saveBg(null)` khi thoát chế độ `photo`.

### 10. [S4] Ảnh PNG trong suốt hiển thị sai nền
- Vị trí: `src/render/wallpaper.ts`:51
- Tái hiện: Chọn PNG trong suốt, dim 0.5 → Phần trong suốt thành đen mờ (mong đợi: Nền sau ảnh có màu/trắng)
- Vì sao sai: Điều kiện `if...else` bỏ qua `paintBackground` khi là `photo`, khiến canvas rỗng trước khi vẽ.
