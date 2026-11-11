THỢ CODE — làn code — vòng 1
# Phiếu B-025: HUONG-DAN: bỏ lời bảo đảm sai "Apple xóa danh sách khi chia sẻ" + đồng bộ sau B-022 (S3, D-041)

## Việc cần làm
### B-025 — HUONG-DAN: bỏ lời bảo đảm sai "Apple xóa danh sách khi chia sẻ" + đồng bộ sau B-022 (S3, D-041)
- Mục tiêu: hướng dẫn nói đúng: tên danh sách mặc định NẰM TRONG link iCloud công khai → Phím tắt chỉ trỏ tới `BaoThuc` hoặc danh sách tên chung; các dòng còn giả định trước thử tay khớp SPEC §8.13(d)(f) sau B-022.
- Phạm vi file: `docs/HUONG-DAN.md` (chỉ dòng ~279, 298, 333, 369, 402, 405, 407 và câu liền kề cần cho mạch văn).
- Giao diện có sẵn: D-041 (docs/DECISIONS.md) mục (2); SPEC §8.13(d)(f), §10.G.2; tên thẻ thật trong app: "Cài nhanh bộ Phím tắt"; trên iOS 27 tự động hóa nằm TRONG Phím tắt (chia sẻ kèm link, phải tắt bản `_cu` và bật bản mới); link mở thẳng app Phím tắt (không phải trình duyệt trong-app).
- Tiêu chí nghiệm thu:
  - [ ] `grep -c -E 'xóa sạch|tự động xóa giá trị|sẽ được Apple xóa' docs/HUONG-DAN.md` = 0
  - [ ] :279 dùng đúng tên thẻ "Cài nhanh bộ Phím tắt"
  - [ ] :369/:405/:407 không còn "Tự động hóa không chia sẻ được" / "mở ở trình duyệt trong-app"
  - [ ] §E không đổi (git diff không chạm khối §E)
  - [ ] không thêm tên thật/email/danh sách riêng của Chủ dự án

## Đọc trước (theo thứ tự, đọc đủ rồi mới sửa)
AGENTS.md, docs/HUONG-DAN.md (các dòng trên + mục §F, §G), docs/DECISIONS.md mục D-041 (và D-040 nếu cần), docs/SPEC.md §8.13 và §10.G.2

## File được phép tạo/sửa (mỗi dòng một đường dẫn; kết thúc bằng / nghĩa là cả thư mục)
- docs/HUONG-DAN.md

## Lệnh kiểm thử (chạy trước khi kết thúc; test fail thì sửa rồi chạy lại, tối đa 3 lần)
test "$(grep -c -E 'xóa sạch|tự động xóa giá trị|sẽ được Apple xóa' docs/HUONG-DAN.md)" = 0 && ! grep -nE 'Tự động hóa không chia sẻ được|trình duyệt trong-app' docs/HUONG-DAN.md && npm run check

## Cấm
Sửa file ngoài danh sách trên. Sửa, xóa, skip hay nới lỏng test có sẵn. Chạy lệnh git thay đổi trạng thái. Cài gói mới. Hỏi lại — không có ai trả lời: điểm nào phiếu không nói rõ thì chọn phương án an toàn nhất và ghi vào báo cáo.
Lưu ý thêm: không commit; viết tiếng Việt cùng giọng văn hiện có; chỉ sửa đúng những câu sai, không viết lại cả mục; không thêm tên thật, email hay danh sách riêng của Chủ dự án.

## BÁO CÁO CUỐI (in đúng khung này ở cuối, bằng tiếng Việt, không thêm lời dẫn)
KẾT QUẢ: XONG | XONG-CÓ-LƯU-Ý | KHÔNG XONG
TEST: <lệnh> — PASS/FAIL — <số test đạt/tổng>
FILE ĐÃ TẠO/SỬA: <danh sách>
QUYẾT ĐỊNH TỰ CHỌN: <điểm phiếu không nói rõ và cách đã chọn; ghi "không" nếu không có>
LƯU Ý/CÂU HỎI: <tối đa 5 dòng; ghi "không" nếu không có>
