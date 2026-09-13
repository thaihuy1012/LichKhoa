# HƯỚNG DẪN DÙNG LichKhoa TRÊN IPHONE

Tài liệu này viết cho người không rành kỹ thuật. Làm đúng theo từng bước, không cần hiểu code.

## A. Cài đặt LichKhoa (PWA) vào Màn hình chính

1. Mở Safari trên iPhone, vào đúng địa chỉ (URL) của LichKhoa (do người quản lý đưa cho bạn).
2. Bấm nút **Chia sẻ** (Share — hình vuông có mũi tên đi lên) ở thanh dưới cùng Safari.
3. Cuộn xuống, chọn **"Thêm vào MH chính"** (Add to Home Screen).
4. Bấm **"Thêm"** (Add) ở góc trên.
5. Về Màn hình chính, mở app bằng đúng biểu tượng vừa thêm (không mở lại bằng Safari) — đây gọi là chế độ **standalone**.

## B. Tạo Google OAuth Client ID (để đồng bộ Google Calendar — không bắt buộc)

Nếu bạn không cần lịch Google, có thể bỏ qua phần này.

1. Vào https://console.cloud.google.com bằng máy tính hoặc điện thoại → bấm **tạo dự án mới** (New Project), đặt tên (ví dụ "LichKhoa").
2. Vào **APIs & Services → Library**, tìm **"Google Calendar API"** → bấm **Enable**.
3. Vào **Google Auth Platform → Branding**: điền tên ứng dụng + email hỗ trợ. Ở **Audience** chọn **External**, giữ trạng thái **Testing**. Ở **Test users**, thêm đúng địa chỉ Gmail bạn sẽ dùng để đăng nhập.
4. Vào **Clients → Create client → Web application**.
   - **Authorized JavaScript origins**: dán đúng gốc URL của LichKhoa (ví dụ `https://ten-cua-ban.netlify.app`), không có dấu `/` ở cuối.
   - **Authorized redirect URIs**: dán đúng URL đầy đủ mở app, có dấu `/` ở cuối (ví dụ `https://ten-cua-ban.netlify.app/`).
5. Sao chép **Client ID** (chuỗi kết thúc bằng `.apps.googleusercontent.com`).
6. Mở LichKhoa → tab **Đồng bộ** → dán Client ID vào ô → bấm **Kết nối**. Không cần "client secret".

**Lưu ý bảo mật**: Client ID chỉ lưu trên máy bạn (localStorage), không gửi lên đâu khác, không đưa vào code.

**Về đăng nhập trong app đã cài (standalone)**: theo thiết kế, Google sẽ mở màn đăng nhập trong một cửa sổ trình duyệt nhỏ rồi tự đưa bạn quay lại app. *Đang chờ xác nhận trên máy thật (xem mục "Bài thử trên iPhone" bên dưới).* Nếu sau khi đăng nhập app không quay lại được (bị kẹt ở cửa sổ trình duyệt, hoặc báo lỗi): hãy mở LichKhoa bằng **Safari thường** (lưu địa chỉ này làm Bookmark để lần sau vào nhanh) và dùng Google từ đó thay vì từ app đã cài. Lưu ý: dữ liệu lưu ở Safari và dữ liệu lưu ở app cài trên Màn hình chính là **hai nơi tách biệt** — hãy chọn một nơi và dùng xuyên suốt.

## C. Tạo Shortcut "Đặt hình nền" (làm một lần duy nhất)

1. Mở app **Shortcuts** (Phím tắt) có sẵn trên iPhone.
2. Bấm dấu **+** để tạo Shortcut mới.
3. Bấm **"Add Action"** (Thêm hành động), tìm và chọn **"Set Wallpaper"** (Đặt hình nền) — trên một số bản iOS mới, hành động này tên là **"Set Wallpaper Photo"** (Đặt ảnh hình nền).
4. Trong hành động đó:
   - **Image** (Ảnh): chọn **Shortcut Input**.
   - Chọn áp dụng cho **Lock Screen** (Màn hình khóa).
   - Tắt **"Show Preview"** (Hiện xem trước) để không phải bấm xác nhận mỗi lần.
5. Đặt tên Shortcut đúng bằng tên hiển thị trong LichKhoa (mặc định là **`DatHinhNen`** — xem/đổi ở tab Xem trước, ô "Tên Shortcut").
6. Lưu lại.

Ghi chú: chỉ dùng hành động **"Set Wallpaper"**, không cần và không dùng "Run Script"/Scriptable/iCloud — LichKhoa tự sao chép ảnh vào clipboard và mở Shortcut với `input=clipboard`.

## D. HTTPS để thử trên iPhone (dành cho người quản lý dự án dựng bản chạy)

- **GitHub Pages** (chính, cần repo public): `https://<tên-người-dùng>.github.io/<tên-repo>/`.
- **Netlify Drop** (không cần tài khoản GitHub): kéo thả thư mục build vào https://app.netlify.com/drop → có ngay `https://<tên>.netlify.app`.
- **Thử nhanh trong mạng nội bộ**: dùng `cloudflared` tạo đường hầm tạm — không dùng để test Google (địa chỉ đổi mỗi lần chạy).

---

## Quy trình dùng hằng ngày (≤ 3 chạm)

1. Mở LichKhoa từ biểu tượng trên Màn hình chính.
2. (Tuỳ chọn) Tab Đồng bộ → **"Đồng bộ ngay"** nếu muốn cập nhật lịch Google mới nhất.
3. Tab Xem trước → bấm **"Đặt hình nền"**. Ảnh được sao chép, Shortcut tự mở và đặt làm hình nền khóa. Lần đầu tiên, iOS sẽ hỏi cho phép Shortcut chạy — bấm **Cho phép**.

## Giới hạn đã biết

- Phiên đăng nhập Google chỉ sống **1 giờ** và **không tự gia hạn** được trên iPhone (Safari chặn cookie bên thứ ba) → mở app sau hơn 1 giờ kể từ lần kết nối trước thì cần bấm **"Kết nối lại"** (tab Đồng bộ) trước khi đồng bộ; sự kiện đã tải trước đó vẫn hiện bình thường.
- LichKhoa **không tự đổi hình nền** khi bạn không mở app và bấm nút — không có tính năng chạy nền tự động.
- Hành động "Set Wallpaper" cần **iOS 17 trở lên** và hình nền khóa hiện tại phải đang ở chế độ **Ảnh tĩnh** (không phải "Photo Shuffle").
- Nếu chỉ mở bằng Safari thường (chưa "Thêm vào MH chính"), Safari có thể tự xóa dữ liệu đã lưu sau **7 ngày không dùng**. Cài vào Màn hình chính để tránh mất dữ liệu; nên thỉnh thoảng **Xuất JSON** để sao lưu (tab Xem trước → cuộn xuống phần cài đặt).
- Muốn Lịch iPhone **nhắc giờ** một sự kiện: mở sự kiện đó trong LichKhoa → bấm **"Thêm vào Lịch iPhone"** → mở file `.ics` tải về. Phải làm cho **từng sự kiện**, không tự động hàng loạt.
- Sự kiện lấy từ Google Calendar chỉ để xem, **không sửa được** trong LichKhoa.

## Bài thử trên iPhone (làm khi có bản chạy thật — T-4.0)

1. Có URL HTTPS thật (GitHub Pages hoặc Netlify Drop).
2. Tạo Google Client ID (mục B) với đúng origin/redirect URI của URL đó.
3. Trên iPhone: Safari mở URL → "Thêm vào MH chính" → mở từ biểu tượng.
4. Tab Đồng bộ → dán Client ID → **Kết nối** → quan sát:
   - (A) Google mở trong cửa sổ trong-app (có nút Done) hay bị đẩy ra hẳn Safari?
   - (B) Sau khi đăng nhập, app có quay lại và hiện "Đã kết nối" + danh sách lịch không, hay bị kẹt/báo lỗi `invalid_state`?
   - (C) Chọn một lịch → **Đồng bộ ngay** → tab Xem trước/Sự kiện có hiện đúng sự kiện thật từ Google không?
5. Tab Xem trước → **"Đặt hình nền"** → Shortcut chạy xong, kiểm tra màn hình khóa: chữ có bị đồng hồ, widget, hay các nút che mất không?
6. Bật **Chế độ máy bay** → đóng hẳn app (vuốt lên xóa khỏi danh sách app đang chạy) → mở lại từ biểu tượng → app có mở được và vẫn còn sự kiện Google đã lưu trước đó không?
7. Chờ hơn 1 giờ, quay lại app → bấm **"Kết nối lại"** → có phải đăng nhập Google lại từ đầu (nhập mật khẩu) hay chỉ xác nhận nhanh?

Ghi kết quả các bước trên vào báo cáo milestone của người quản lý dự án.
