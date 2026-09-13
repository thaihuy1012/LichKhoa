ĐỌC RỘNG — không tạo/sửa file nào, chỉ trả lời.

Bối cảnh: dự án LichKhoa (PWA Preact + TypeScript, tạo hình nền màn hình khóa có lịch/to-do/ghi chú cho iPhone 13 Pro Max 428×926 pt). Chủ dự án có một bản tự viết trước đây ở F:/LICH_NEN và muốn "cái nào dùng được thì lấy dùng, tham khảo hướng đi của nó". Phần lõi (âm lịch, monthGrid, lặp occursOn, xuất .ics, bố cục vẽ) ĐÃ đối chiếu xong trong docs/tham-khao-LICH_NEN.md — KHÔNG lặp lại phần đó.

Đọc:
- F:/LICH_NEN/lich-nen.html (toàn bộ: HTML, CSS, JS)
- F:/LICH_NEN/LichNen.js
- F:/LICH_NEN/huong-dan-giai-doan-2.md
- docs/SPEC.md (phạm vi IN/OUT, mục 3, 5, 10)
- docs/TASKS.md (các phiếu còn TODO: T-2.7, T-2.END, T-3.3, T-4.1, T-4.2, T-4.3, T-4.4)
- docs/tham-khao-LICH_NEN.md (đã có — đừng lặp)
- src/ui/screens/Preview.tsx, src/ui/App.tsx, src/ui/styles.css, src/ui/store.ts (UI hiện tại, để biết cái gì đã có)

Câu hỏi: với MỖI phiếu còn TODO ở trên, phần nào của F:/LICH_NEN dùng lại được?

Trả lời đúng khung sau, tiếng Việt, tối đa 120 dòng:

## A. Bảng theo phiếu
| Phiếu | Nguồn (file:Lx–Ly) | Nội dung | Mức (DÙNG THẲNG / THAM KHẢO) | Cần đổi khi port (Preact, `t()` i18n, `data-testid`, reducer action có sẵn) |
Chỉ ghi dòng có giá trị thật. Số dòng phải chính xác (kiểm lại bằng cách đọc file). Với T-2.7: form sự kiện (trường, kiểm hợp lệ, màu), danh sách to-do (thêm/tick/xóa/lên xuống), ghi chú, xuất/nhập JSON + xóa dữ liệu (confirm), nút tải .ics, CSS form mobile. Với T-4.2: control thiết kế (ảnh/màu/gradient, blur, dim, font, vị trí, scale, bảng màu). Với T-4.3/T-4.4: nội dung hướng dẫn Phím tắt (Shortcuts), cài lên màn hình chính, quy trình hằng ngày — nêu rõ bước nào đúng cho cách LichKhoa làm (copy ảnh → `shortcuts://run-shortcut?name=…&input=clipboard`) và bước nào chỉ đúng cho Scriptable (không dùng).

## B. Hướng đi đáng theo (≤ 8 gạch)
Quyết định UX/kiến trúc trong LICH_NEN đáng áp dụng cho LichKhoa (vd. thứ tự màn hình, luồng thao tác hằng ngày, mặc định hợp lý, cách báo lỗi). Mỗi gạch: ý tưởng · nguồn file:dòng · áp vào phiếu nào.

## C. Không dùng / vượt phạm vi (≤ 6 gạch)
Tính năng trong LICH_NEN mà SPEC ghi OUT hoặc chưa có (vd. lặp T2–T6, VALARM, nhập .ics, widget, Scriptable) — chỉ liệt kê, KHÔNG đề xuất thêm vào.

## D. Cảnh báo
Lỗi/bug bạn thấy trong code LICH_NEN mà nếu chép nguyên sẽ mang theo (file:dòng, vì sao sai). Thông tin nhạy cảm (khóa, token, email) nếu có — chỉ nêu vị trí, không chép.
