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

**Về đăng nhập trong app đã cài (standalone)**: Google mở màn đăng nhập ngay trong app rồi tự đưa bạn quay lại, hiện "Đã kết nối" + danh sách lịch (đã thử trên iPhone 13 Pro Max ngày 14/09/2026). Nếu trên máy khác app không quay lại được sau khi đăng nhập (bị kẹt ở cửa sổ trình duyệt, hoặc báo lỗi): hãy mở LichKhoa bằng **Safari thường** (lưu địa chỉ này làm Bookmark để lần sau vào nhanh) và dùng Google từ đó thay vì từ app đã cài. Lưu ý: dữ liệu lưu ở Safari và dữ liệu lưu ở app cài trên Màn hình chính là **hai nơi tách biệt** — hãy chọn một nơi và dùng xuyên suốt.

## C. Tạo Shortcut "Đặt hình nền" (làm một lần duy nhất)

1. Mở app **Shortcuts** (Phím tắt) có sẵn trên iPhone.
2. Bấm dấu **+** để tạo Shortcut mới.
3. Bấm **"Add Action"** (Thêm hành động), tìm và chọn **"Set Wallpaper"** (Đặt hình nền) — trên một số bản iOS mới, hành động này tên là **"Set Wallpaper Photo"** (Đặt ảnh hình nền).
4. Trong hành động đó:
   - **Image** (Ảnh): chọn **Shortcut Input** (Đầu vào phím tắt). Nếu không thấy mục này: bấm biểu tượng **(i)** / **Details** (Chi tiết) ở cuối màn hình soạn Shortcut → bật nhận đầu vào (**Receive … input**, chọn **Images** hoặc **Any**) rồi quay lại chọn Shortcut Input.
   - Chọn áp dụng cho **Lock Screen** (Màn hình khóa).
   - Tắt **"Show Preview"** (Hiện xem trước) để không phải bấm xác nhận mỗi lần.
5. Đặt tên Shortcut đúng bằng tên hiển thị trong LichKhoa (mặc định là **`DatHinhNen`** — xem/đổi ở tab Xem trước, ô "Tên Shortcut").
6. Lưu lại.

Ghi chú: chỉ dùng hành động **"Set Wallpaper"**, không cần và không dùng "Run Script"/Scriptable/iCloud — LichKhoa tự sao chép ảnh vào clipboard và mở Shortcut với `input=clipboard`.

**Nếu Shortcut báo lỗi** `The operation couldn't be completed. (com.apple.extensionKit.errorDomain error 2.)`: đây là lỗi của iOS (hành động "Set Wallpaper" hay lỗi xen kẽ, cứ một lần được một lần hỏng — Apple đã ghi nhận, không phải lỗi LichKhoa). Cách xử lý: quay lại LichKhoa và bấm **"Đặt hình nền"** thêm một lần nữa. Cập nhật iOS lên bản mới nhất có thể hết lỗi.

## D. HTTPS để thử trên iPhone (dành cho người quản lý dự án dựng bản chạy)

- **GitHub Pages** (chính, cần repo public): `https://<tên-người-dùng>.github.io/<tên-repo>/`.
- **Netlify Drop** (không cần tài khoản GitHub): kéo thả thư mục build vào https://app.netlify.com/drop → có ngay `https://<tên>.netlify.app`.
- **Thử nhanh trong mạng nội bộ**: dùng `cloudflared` tạo đường hầm tạm — không dùng để test Google (địa chỉ đổi mỗi lần chạy).

## E. Cài đặt 2 Phím tắt nhắc trên iPhone (Báo thức & Lời nhắc)

LichKhoa hỗ trợ mở nhanh Phím tắt trên iPhone để tạo **Báo thức** (trong app Đồng hồ — rung chuông lớn, dành cho sự kiện trong vòng 24 giờ tới) hoặc **Lời nhắc** (trong app Lời nhắc / Reminders — có thông báo ngày giờ, hỗ trợ ghi chú).

Để dùng được tính năng này, bạn cần tạo 2 Phím tắt trên iPhone theo hướng dẫn từng bước dưới đây (chỉ làm một lần duy nhất).

---

### 1. Phím tắt `ThemBaoThuc` (Tạo báo thức trong app Đồng hồ)

1. Mở app **Shortcuts (Phím tắt)** trên iPhone.
2. Bấm dấu **+** ở góc trên cùng bên phải để tạo Phím tắt mới.
3. Chạm vào tên phím tắt ở đỉnh màn hình (mặc định là "New Shortcut" hoặc "Phím tắt mới") → chọn **Rename (Đổi tên)** → đặt ĐÚNG tên: **`ThemBaoThuc`** (viết hoa/thường chuẩn, không dấu cách).
4. Dữ liệu đầu vào: phím tắt nhận dữ liệu qua **Shortcut Input (Đầu vào phím tắt)**, không cần bật gì thêm.
5. Bấm **Add Action (Thêm hành động)** và thêm lần lượt các hành động theo đúng thứ tự sau:
   - **Hành động 1: Split Text (Tách văn bản)**
     - Chọn đầu vào là **Shortcut Input (Đầu vào phím tắt)**.
     - Tại mục **Separator (Dấu phân tách)** hoặc **By (Theo)**: chọn **New Lines (Dòng mới)** (đây là lựa chọn chuẩn có sẵn trong app Phím tắt). Nếu máy không hiện tùy chọn này thì mới chọn **Custom (Tùy chỉnh)** và gõ phím Return (Xuống dòng) vào ô phân tách làm phương án dự phòng.
   - **Hành động 2: Get Item from List (Lấy mục từ danh sách)**
     - Chọn danh sách đầu vào là kết quả từ **Split Text (Văn bản đã tách)** ở Hành động 1.
     - Tại mục **Get (Lấy)**: chọn **Item at Index (Mục tại chỉ mục)** và nhập số `1` (đây là Item 1 — dòng chứa ngày giờ dạng `d MMM yyyy HH:mm`, vd `23 Sep 2026 14:00`).
   - **Hành động 3: Get Dates from Input (Lấy ngày từ đầu vào)**
     - Chọn đầu vào là kết quả **Item from List (Mục từ danh sách)** vừa lấy ở Hành động 2 (Item 1). Hành động này sẽ nhận diện và chuyển văn bản thành ngày giờ hệ thống.
   - **Hành động 4: Get Item from List (Lấy mục từ danh sách)**
     - Thêm tiếp hành động lấy mục, chọn đầu vào là danh sách **Split Text (Văn bản đã tách)** ở Hành động 1.
     - Tại mục **Get (Lấy)**: chọn **Item at Index (Mục tại chỉ mục)** và nhập số `2` (đây là Item 2 — dòng chứa tiêu đề/tên báo thức).
   - **Hành động 5: Create Alarm (Tạo báo thức)**
     - Tại mục **Time (Thời gian)**: chọn biến ngày giờ từ kết quả **Dates (Ngày)** của Hành động 3.
     - Chạm vào mũi tên mở rộng (>) nếu có: tại ô **Label (Nhãn) / Name (Tên)**: chọn biến văn bản từ kết quả **Item from List (Mục từ danh sách)** thứ hai ở Hành động 4.
6. Bấm **Done (Xong)** ở góc trên bên phải để lưu phím tắt.

---

### 2. Phím tắt `ThemLoiNhac` (Tạo lời nhắc trong app Lời nhắc / Reminders)

1. Trong app **Shortcuts (Phím tắt)**, bấm dấu **+** để tạo thêm một Phím tắt mới.
2. Chạm vào tên phím tắt ở đỉnh màn hình → chọn **Rename (Đổi tên)** → đặt ĐÚNG tên: **`ThemLoiNhac`** (viết hoa/thường chuẩn, không dấu cách).
3. Dữ liệu đầu vào: phím tắt nhận dữ liệu qua **Shortcut Input (Đầu vào phím tắt)**, không cần bật gì thêm.

Bạn hãy chọn cài đặt theo một trong hai cách dưới đây:

#### Cách A (khuyến nghị, chạy được với mọi trường hợp)
Cách này đơn giản và ổn định nhất: lời nhắc có tiêu đề + ngày giờ báo, KHÔNG lấy Item 3 và KHÔNG gắn trường Notes. Hoạt động mượt mà cho cả sự kiện, việc cần làm lẫn ghi chú (không lo lỗi thiếu dòng).

Bấm **Add Action (Thêm hành động)** và lần lượt thêm các hành động theo thứ tự sau:
- **Hành động 1: Split Text (Tách văn bản)**
  - Chọn đầu vào là **Shortcut Input (Đầu vào phím tắt)**.
  - Tại mục **Separator (Dấu phân tách)** hoặc **By (Theo)**: chọn **New Lines (Dòng mới)** (nếu máy không hiện tùy chọn này, chọn **Custom (Tùy chỉnh)** rồi gõ phím Return/Xuống dòng làm phương án dự phòng).
- **Hành động 2: Get Item from List (Lấy mục từ danh sách)**
  - Đầu vào: danh sách từ **Split Text (Văn bản đã tách)** ở Hành động 1.
  - Chọn **Item at Index (Mục tại chỉ mục)** và nhập số `1` (Item 1: ngày giờ dạng `d MMM yyyy HH:mm`, vd `23 Sep 2026 14:00`).
- **Hành động 3: Get Dates from Input (Lấy ngày từ đầu vào)**
  - Đầu vào: kết quả của Hành động 2 (Item 1).
- **Hành động 4: Get Item from List (Lấy mục từ danh sách)**
  - Đầu vào: danh sách từ **Split Text (Văn bản đã tách)** ở Hành động 1.
  - Chọn **Item at Index (Mục tại chỉ mục)** và nhập số `2` (Item 2: tiêu đề lời nhắc).
- **Hành động 5: Add New Reminder (Thêm lời nhắc mới)**
  - Tại mục **Title (Tiêu đề)** / **Reminder**: chọn biến tiêu đề từ Hành động 4 (Item 2).
  - Tại mục **List (Danh sách)**: chọn danh sách mong muốn (mặc định là *Reminders* hoặc *Lời nhắc*).
  - Chạm vào mũi tên mở rộng (>):
    - Mặc định ô nhắc đang hiện **"No Alert" (Không báo)**. Chạm vào ô đó → chọn **"Alert" (Báo)** (tùy bản iOS, có thể hiện là **"Remind me at a time" (Nhắc tôi vào lúc)**).
    - Sau khi chọn xong, một ô mới **"At Time" (Vào lúc)** sẽ hiện ra → chạm vào ô này và chọn biến ngày giờ từ kết quả **Dates (Ngày)** của Hành động 3.
    - *Lưu ý*: KHÔNG lấy Item 3 và KHÔNG gắn trường Notes (Ghi chú).
- Bấm **Done (Xong)** ở góc trên bên phải để lưu lại.

> ⚠️ **CẢNH BÁO QUAN TRỌNG**: KHÔNG được gán biến ngày giờ trực tiếp vào ô **"No Alert"**. Nếu làm vậy, iOS sẽ hiểu nhầm đây là lời nhắc theo VỊ TRÍ và báo lỗi nguyên văn:
> **"No alert location was provided. Please provide a location for this reminder's alert."**
> Cách sửa: bắt buộc phải đổi ô đó sang **"Alert"** (hoặc **"Remind me at a time"**) trước, ô **"At Time"** mới xuất hiện để gán biến ngày giờ.
>
> **Phương án dự phòng trên iOS 18**: nếu máy có hành động mới **"Create Reminder"** (thay cho "Add New Reminder"), có thể dùng hành động này — nó có ô **"Due Date"** riêng để gán biến ngày giờ, không cần bước đổi "No Alert" → "Alert" như trên. Không bắt buộc, chỉ dùng nếu có sẵn.

#### Cách B (nếu muốn có cả nội dung ghi chú)
Đây là cách dài hơn, chỉ làm nếu bạn muốn nội dung ghi chú xuất hiện trong app Lời nhắc. Vì Sự kiện và Việc chỉ gửi 2 dòng (ngày giờ + tiêu đề), chỉ có Ghi chú mới gửi dòng 3 (nội dung), nên cần dùng lệnh điều kiện **If (Nếu)** để kiểm tra:

Bấm **Add Action (Thêm hành động)** và lần lượt thêm các hành động theo thứ tự sau:
- **Hành động 1: Split Text (Tách văn bản)**
  - Đầu vào là **Shortcut Input (Đầu vào phím tắt)**.
  - Tại mục **Separator (Dấu phân tách)** hoặc **By (Theo)**: chọn **New Lines (Dòng mới)** (dự phòng: **Custom (Tùy chỉnh)** và gõ Return).
- **Hành động 2: Get Item from List (Lấy mục từ danh sách)**
  - Đầu vào: danh sách từ **Split Text (Văn bản đã tách)** ở Hành động 1.
  - Chọn **Item at Index (Mục tại chỉ mục)** và nhập số `1` (Item 1: ngày giờ).
- **Hành động 3: Get Dates from Input (Lấy ngày từ đầu vào)**
  - Đầu vào: kết quả của Hành động 2 (Item 1).
- **Hành động 4: Get Item from List (Lấy mục từ danh sách)**
  - Đầu vào: danh sách từ **Split Text (Văn bản đã tách)** ở Hành động 1.
  - Chọn **Item at Index (Mục tại chỉ mục)** và nhập số `2` (Item 2: tiêu đề lời nhắc).
- **Hành động 5: Get Item from List (Lấy mục từ danh sách)**
  - Đầu vào: danh sách từ **Split Text (Văn bản đã tách)** ở Hành động 1.
  - Chọn **Item at Index (Mục tại chỉ mục)** và nhập số `3` (Item 3: ghi chú).
- **Hành động 6: If (Nếu)**
  - Chọn biến kiểm tra là kết quả từ Hành động 5 (**Item from List** — Item 3).
  - Điều kiện: chọn **has any value (có giá trị)**.
  - **Nhánh "Nếu có" (If)**: Thêm hành động **Add New Reminder (Thêm lời nhắc mới)**:
    - **Title (Tiêu đề)**: chọn biến từ Hành động 4 (Item 2).
    - **List (Danh sách)**: chọn danh sách mong muốn.
    - Chạm mũi tên mở rộng (>): chạm ô **"No Alert"** → chọn **"Alert"** (hoặc **"Remind me at a time"**) → ô **"At Time"** hiện ra, gán biến Ngày giờ từ Hành động 3; tại mục **Notes (Ghi chú)** gắn biến từ Hành động 5 (Item 3).
  - **Nhánh "Ngược lại" (Otherwise)**: Thêm hành động **Add New Reminder (Thêm lời nhắc mới)**:
    - **Title (Tiêu đề)**: chọn biến từ Hành động 4 (Item 2).
    - **List (Danh sách)**: chọn danh sách mong muốn.
    - Chạm mũi tên mở rộng (>): chạm ô **"No Alert"** → chọn **"Alert"** (hoặc **"Remind me at a time"**) → ô **"At Time"** hiện ra, gán biến Ngày giờ từ Hành động 3; để trống trường **Notes (Ghi chú)** (không gắn Notes).
  - Khối kết thúc bằng **End If (Kết thúc nếu)**.
- Bấm **Done (Xong)** ở góc trên bên phải để lưu lại.

> ⚠️ Xem cảnh báo quan trọng và phương án dự phòng iOS 18 (**"Create Reminder"** với ô **"Due Date"** riêng) ở cuối Cách A — áp dụng tương tự cho Cách B.

---

### Bật Nhạy cảm về thời gian

Để thông báo từ app Lời nhắc không bị bỏ lỡ:
1. Mở **Cài đặt (Settings)** trên iPhone.
2. Vào mục **Thông báo (Notifications)** → chọn **Lời nhắc (Reminders)**.
3. Bật mục **Thông báo nhạy cảm về thời gian (Time Sensitive Notifications)**.
4. *Ý nghĩa*: Khi bật tính năng này, thông báo lời nhắc sẽ luôn xuất hiện ngay lập tức và phát chuông báo trên màn hình khóa, ngay cả khi bạn đang bật chế độ Tập trung (Focus / Không làm phiền).

---

### Nếu không chạy

Nếu khi bấm "Thêm báo thức" hoặc "Thêm lời nhắc" từ LichKhoa mà iPhone không hoạt động như ý:
- **(a) iOS báo không tìm thấy Phím tắt**: Tên phím tắt đặt bị sai lệch. Hãy kiểm tra lại tên của 2 phím tắt trong app Shortcuts trên máy bạn để đảm bảo đúng chữ hoa chữ thường là `ThemBaoThuc` và `ThemLoiNhac`. Nếu muốn đặt tên khác (ví dụ "Báo thức" hay "Lời nhắc"), bạn chỉ cần vào tab **Xem trước** của LichKhoa, cuộn xuống phần cài đặt và sửa lại 2 ô "Tên Phím tắt báo thức" và "Tên Phím tắt lời nhắc" cho khớp đúng 100% với tên trên iPhone.
- **(b) Phím tắt không tách được dòng**: Mở phím tắt trong app Shortcuts, kiểm tra lại hành động **Split Text (Tách văn bản)**. Đảm bảo đã chọn phân tách theo **New Lines (Dòng mới)** (nếu máy không có lựa chọn này thì mới chuyển sang chọn **Custom (Tùy chỉnh)** và gõ phím Return/Xuống dòng vào ô).
- **(c) Ngày giờ bị hiểu sai**: Hành động **Get Dates from Input (Lấy ngày từ đầu vào)** nhận diện dòng 1 ở dạng `d MMM yyyy HH:mm` (đúng là dạng như `23 Sep 2026 14:00`, tháng viết tắt tiếng Anh). Nếu "Get dates from Input" trả về rỗng hoặc iOS hiểu sai ngày giờ, hãy báo lại cho đội phát triển để điều chỉnh định dạng chuỗi dòng 1 cho phù hợp với máy của bạn.
- **(d) Lời nhắc tạo từ Sự kiện hoặc Việc báo lỗi**: Nhiều khả năng do phím tắt đang cố lấy dòng 3 không tồn tại (vì Sự kiện và Việc chỉ gửi 2 dòng gồm ngày giờ và tiêu đề, không có ghi chú). Hãy chuyển sang cài đặt theo **Cách A** (không lấy Item 3 và không gắn trường Notes) để phím tắt hoạt động ổn định cho mọi trường hợp.
- **(e) Báo lỗi "No alert location was provided. Please provide a location for this reminder's alert."**: Bạn đang gán biến ngày giờ trực tiếp vào ô **"No Alert"** của hành động Add New Reminder/Create Reminder. Sửa theo bước ở Cách A/Cách B: chạm ô **"No Alert"** → chọn **"Alert"** (hoặc **"Remind me at a time"**) → ô **"At Time"** hiện ra mới gán biến ngày giờ vào đó.
- **Mức độ chắc chắn về các hành động trên iOS 17+**: Các hành động `Split Text (Tách văn bản)`, `Get Item from List (Lấy mục từ danh sách)`, `Get Dates from Input (Lấy ngày từ đầu vào)`, `Create Alarm (Tạo báo thức)`, và `Add New Reminder (Thêm lời nhắc mới)` là các hành động tiêu chuẩn có thật và đã ổn định trên iOS 17+. Tùy vào phiên bản ngôn ngữ máy của bạn (tiếng Việt hoặc tiếng Anh), nhãn của các trường cấu hình con (ví dụ *Label*, *Name*, *Remind Me*, *Due Date*) có thể được Apple dịch hơi khác một chút, bạn hãy chọn trường tương ứng theo ngữ cảnh mô tả ở trên.

---

## Quy trình dùng hằng ngày (≤ 3 chạm)

1. Mở LichKhoa từ biểu tượng trên Màn hình chính.
2. (Tuỳ chọn) Tab Đồng bộ → **"Đồng bộ ngay"** nếu muốn cập nhật lịch Google mới nhất.
3. Tab Xem trước → bấm **"Đặt hình nền"**. Ảnh được sao chép, Shortcut tự mở và đặt làm hình nền khóa. Lần đầu tiên, iOS sẽ hỏi cho phép Shortcut chạy — bấm **Cho phép**.

## Giới hạn đã biết

- Phiên đăng nhập Google chỉ sống **1 giờ** và **không tự gia hạn** được trên iPhone (Safari chặn cookie bên thứ ba) → mở app sau hơn 1 giờ kể từ lần kết nối trước thì cần bấm **"Kết nối lại"** (tab Đồng bộ) trước khi đồng bộ — thường kết nối được ngay, không phải nhập lại mật khẩu Google; sự kiện đã tải trước đó vẫn hiện bình thường (cả khi không có mạng).
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
