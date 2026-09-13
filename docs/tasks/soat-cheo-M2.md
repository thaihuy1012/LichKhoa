SOÁT CHÉO — chỉ đọc, không tạo/sửa file nào.

Đọc: docs/SPEC.md (v1.3 — đặc biệt §3 IN-10, §5 hợp đồng, §6 M2, §9 mặc định), docs/bao-cao/M2.md, docs/bao-cao/M2.diff (diff M1-ok..HEAD, 6.300 dòng). Được mở thêm file mã nguồn trong src/ hoặc tests/ để kiểm chứng.

Nhiệm vụ: tìm lỗi mà đội Claude có thể đã bỏ sót trong M2. Ưu tiên:
- Sai so với hợp đồng SPEC §5 / tiêu chí §6 M2 (kể cả phần v1.3: weekdays, alarmMin → VALARM, Todo.due + thứ tự, Note ghim 1, normalizeState chuyển noteText).
- Lỗi ngày/giờ/múi giờ (toISOString, Date UTC, ISODate so sánh chuỗi), lỗi lặp (ngày 31, 29/02, until, weekdays), .ics sai chuẩn RFC 5545 mà Lịch iPhone không đọc được.
- Mất/hỏng dữ liệu: backup/import, replaceState, resetAll, persist, normalizeState với state cũ/thiếu trường.
- Reducer mutate state; sự kiện lặp sửa/xóa sai sự kiện gốc; ghim nhiều hơn 1 ghi chú.
- Test "giả qua": assert quá lỏng, test không thể fail, test phụ thuộc ngày chạy.
- UI: vùng chạm < 44px, ô nhập < 16px, nhãn không qua t(), khóa vi/en lệch.

Khung trả lời (tiếng Việt, tối đa 10 vấn đề, sắp theo mức nặng):
### <số>. [S1|S2|S3|S4] <tiêu đề ngắn>
- Vị trí: <file>:<dòng>
- Tái hiện: <input cụ thể / lệnh / bước> → <kết quả sai> (mong đợi: <…>)
- Vì sao sai: <1–2 câu, dẫn SPEC mục nào nếu có>
Không khen, không viết lại code, không đề xuất tính năng mới. Không chắc thì ghi "(nghi vấn)". Nếu không tìm được vấn đề S1–S3 nào, nói rõ.
