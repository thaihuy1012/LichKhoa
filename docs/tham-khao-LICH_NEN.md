# Tham khảo từ F:\LICH_NEN\ cho LichKhoa

## 1. Mô tả 3 file tham khảo

### a) lich-nen.html (1503 dòng)
- Công nghệ: HTML thuần + CSS + JavaScript (không framework, không PWA)
- Chức năng: Web app tạo hình nền màn hình khóa có lịch/to-do/ghi chú chồng ảnh
- Nổi bật: vẽ canvas 2D, bố cục 4 kiểu (Tháng/Agenda/To-do/Ghi chú), tùy chỉnh ảnh/màu/mờ/tối/font, CRUD sự kiện lặp, xuất .ics, localStorage + IndexedDB

### b) LichNen.js (539 dòng)
- Công nghệ: JavaScript Scriptable (iOS app)
- Chức năng: Lấy Lịch + Nhắc nhở iPhone → vẽ PNG + widget; tích hợp Phím tắt tự đổi hằng ngày
- Cần: config JSON + ảnh từ iCloud Drive › Scriptable

### c) huong-dan-giai-doan-2.md (121 dòng)
- Hướng dẫn cài Scriptable, Phím tắt, widget, đồng bộ dữ liệu iPhone

---

## 2. Bảng tái sử dụng code

| Chuyên mục | Nguồn | Phiếu LichKhoa | Mức | Ghi chú |
|---|---|---|---|---|
| Âm lịch (Hồ Ngọc Đức) | HTML L434-513; JS L44-113 | — (NGOÀI SPEC, chờ Chủ dự án) | DÙNG THẲNG nếu được duyệt | Chỉ đổi JS → TS |
| monthGrid / daysInMonth | HTML L521-523, L276 | T-1.2 | DÙNG THẲNG | Lưới 6×7, ô ngoài = null |
| occursOn (bộ lọc lặp) | HTML L545-559 | T-2.1 | DÙNG THẲNG | daily/weekly/monthly/yearly + until |
| Utility ngày (ymd, addDays, pad2, fmtTime) | HTML L516-530; JS L116-125 | T-1.2 | DÙNG THẲNG | Định dạng ISODate & giờ |
| Vẽ hộp/vòng/chấm (rect, circle, hline) | JS L249-252 | T-1.4 (paint.ts) | THAM KHẢO | DrawContext (JS) → Canvas 2D; lấy ý tưởng arcTo, arc, fillRect |
| Bố cục tháng (drawMonth) | JS L263-300 | T-1.3 | THAM KHẢO | Logic ô hôm nay, chấm sự kiện; LichKhoa → DrawOp[] |
| Bố cục agenda / todo / note | JS L302-376 | T-2.3 | THAM KHẢO | Lọc ngày, giới hạn dòng, bọc text |
| Nhãn thứ/tháng (WD_SHORT, REPEAT_LABEL) | HTML L407-410; JS L46 | T-2.4 (i18n) | DÙNG THẲNG | Copy danh sách → JSON i18n |
| Mặc định cấu hình (DEFAULT_SETTINGS) | HTML L427-431 | T-1.2 | DÙNG THẲNG | Giá trị khởi động |
| Danh sách thiết bị iPhone | HTML L412-426 (không phải JS — JS L398-418 là bảng cỡ widget) | T-1.3 (đã xong, 5 preset) | THAM KHẢO | Có thể bổ sung preset nếu thiếu |
| Xuất .ics (VCALENDAR/VEVENT/RRULE) | HTML L584-614 | T-2.5 | DÙNG THẲNG | DTSTART, RRULE, CRLF, escape `,;\` |
| Nhập .ics (parseICS) | HTML L616-671 | — | KHÔNG | M2 OUT; M4 chỉ xuất |
| localStorage / IndexedDB | HTML L674-696 | T-1.4 | THAM KHẢO | HTML: localStorage; LichKhoa: IndexedDB + idb-keyval |

---

## 3. So sánh M1 hiện tại với LICH_NEN

| Khía cạnh | LICH_NEN | LichKhoa M1 | Ưu điểm LichKhoa | Rủi ro |
|---|---|---|---|---|
| Vẽ canvas | Trực tiếp → PNG | DrawOp[] → Canvas | Abstraction: layout thuần, test dễ, vùng an toàn rõ ràng | 1 lớp thêm; phải cẩn chuyển đổi |
| Lưu trữ | localStorage (6MB) | IndexedDB (idb-keyval) | Lớn hơn, tách state & Blob | External dep (rủi ro tương thích) |
| i18n | Hardcode Tiếng Việt | T-2.4: centralized `t()` | Hỗ trợ VI/EN từ đầu | Thêm file JSON i18n |
| Bố cục | Vẽ cứng | T-1.3-2.3 modular + chọn layout | Tái sử dụng, tùy chỉnh linh hoạt | Phải đúng SPEC DrawOp |
| Google Calendar | Không | T-3: OAuth + REST | Thêm sự kiện công khai | Rủi ro cookie tách PWA standalone |
| PWA | Không | T-1.1: vite-plugin-pwa | Offline, Add to Home Screen | Nếu plugin lỗi → viết SW tay |

**Kết luận**: Âm lịch & toán lịch LICH_NEN đúng → copy. Vẽ bố cục: LichKhoa design tốt hơn (abstraction), nhưng yêu cầu cẩn thận chuyển DrawContext → Canvas 2D.

---

## 4. Rủi ro bản quyền / bí mật

**Bản quyền**: ✓ An toàn
- App gốc (Ink, id 6769250805): LichKhoa tái tạo tính năng, không dùng tên/logo
- F:\LICH_NEN\: Giả định của Chủ dự án hoặc công khai
- Font hệ thống, thuật toán âm lịch: Công khai

**Bí mật**: ✓ Không tìm thấy
- API Key / Client Secret: không
- Token / Auth: không
- Email / điện thoại: không

---

## 5. Yêu cầu khác từ huong-dan-giai-doan-2.md

**Giai đoạn 2 "Cầu nối iOS"**: Cài Scriptable, Phím tắt, widget, tự động hóa → **KHÔNG vượt SPEC**
- SPEC m2/m4 OUT: "Widget Màn hình chính iOS, tự đổi hằng ngày mà không chạm"
- Giai đoạn 2 là **tùy chọn bonus** sau M4 xong
- (Quản lý đính chính 2026-09-13: SPEC KHÔNG có mục "Đưa dữ liệu iPhone vào web app"; dòng này của khảo sát là sai.)
- **Âm lịch KHÔNG có trong SPEC** — dùng thuật toán âm lịch = đổi phạm vi, phải hỏi Chủ dự án. Tương tự: lặp "T2–T6" (`weekdays`), nhắc giờ VALARM, nhiều ghi chú ghim, nhập .ics.

**Kết luận**: Tất cả hướng dẫn giai đoạn 2 đều nằm trong SPEC hoặc tùy chọn; không có yêu cầu bổ sung vượt phạm vi.

---

## 6. Giao diện (bổ sung 2026-09-13 — làn Gemini Pro đọc rộng, Quản lý kiểm số dòng phần T-2.7)
Kết quả thô: `docs/gemini-out/tham-khao-lich-nen-ui.md`. Chủ dự án: "cái nào dùng được thì lấy, tham khảo hướng đi".

| Phiếu | Nguồn `lich-nen.html` (trừ khi ghi khác) | Nội dung | Mức |
|---|---|---|---|
| T-2.7 | L144–162, L166–168, L706 | CSS sheet trượt, `.field`, toast | DÙNG THẲNG (CSS) |
| T-2.7 | L341–375, L797–859 | Sheet sự kiện + open/read/save/delete/.ics | THAM KHẢO (port Preact) ✔ đã kiểm |
| T-2.7 | L733–794 | Lịch tháng nhỏ trong app + danh sách ngày | THAM KHẢO ✔ |
| T-2.7 | L275–286, L862–892 | To-do: thêm, tick, sửa, xóa, nhóm "Đã xong" | THAM KHẢO ✔ |
| T-2.9 | L305–314, L971–990, L66–68 | Nhóm sao lưu/khôi phục/xóa + `.seg` | THAM KHẢO ✔ |
| T-4.1 | `LichNen.js` L253–257 | Toán cover-fit | DÙNG THẲNG |
| T-4.2 | L184–237, L213–215, L1396 | Control Thiết kế, swatches + input color | THAM KHẢO (chưa kiểm) |
| T-4.3 | L1334–1360 | Luồng xuất ảnh | THAM KHẢO (chưa kiểm) |
| T-4.4 | L320–325; `huong-dan-giai-doan-2.md` L61–68 | Trợ giúp + tạo Phím tắt (chỉ "Set Wallpaper") | THAM KHẢO (chưa kiểm) |

Hướng đi áp dụng: sheet trượt cho form (không rời màn hình); segmented thay `<select>` khi ≤ 4 lựa chọn; swatches + ô màu tự chọn; toast cho thông báo/lỗi; ẩn/hiện việc đã xong; lịch trong app có âm lịch + chấm màu.
Không dùng (OUT): widget/Scriptable, tự đổi hình nền không chạm, lặp T2–T6, VALARM, nhập .ics, `lichnen-config.json`, nhiều ghi chú/ghim, hạn to-do.
Cảnh báo Gemini: L666 cộng tháng tràn ngày 31 — nằm trong `parseICS` (nhập .ics, OUT) → không ảnh hưởng; `recurrence.ts` (T-2.1) đã có test ngày 31.

---

## Khuyến nghị tái sử dụng

1. **DÙNG THẲNG**: Âm lịch, monthGrid, lặp, utility, ICS xuất, danh sách thiết bị, mặc định
2. **THAM KHẢO**: Bố cục (chuyển DrawOp), vẽ hộp (DrawContext → Canvas 2D), lưu trữ
3. **KHÔNG DÙNG**: Scriptable script, widget (iOS), Google OAuth client (M3 khác)
4. **Rủi ro chính**: Sai thuật toán âm lịch → sai ngày; phải test DrawOp[] kỹ
