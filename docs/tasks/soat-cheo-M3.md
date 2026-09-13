SOÁT CHÉO — chỉ đọc, không tạo/sửa file nào.

Đọc: docs/SPEC.md (v1.3 — §3 IN-5, §5 hợp đồng google/*, §6 M3, §8 rủi ro 1, §9), docs/bao-cao/M3.md, docs/bao-cao/M3.diff (diff M2-ok..HEAD). Được mở thêm file trong src/ hoặc tests/ để kiểm chứng (đặc biệt src/google/oauth.ts, src/google/calendar.ts, src/ui/sync.ts, src/ui/screens/Sync.tsx, src/ui/App.tsx, tests/e2e/m3-google.spec.ts).

Nhiệm vụ: tìm lỗi đội Claude có thể bỏ sót trong M3. Ưu tiên:
- Bảo mật OAuth implicit: state (sinh, lưu, so khớp, xóa 1 lần), CSRF/replay, token lộ (log, URL còn hash sau xử lý, history), redirect_uri khớp VITE_BASE/GitHub Pages, scope, không client secret.
- PWA iOS standalone: luồng redirect ra Google rồi quay về (storage bị tách, hash mất), prompt=none gia hạn.
- Google Calendar API: phân trang, timeMin/timeMax RFC3339, all-day end exclusive, sự kiện có giờ qua đêm / nhiều ngày, múi giờ, cancelled, màu, lỗi 401/403/429/5xx, lỗi mạng giữ cache.
- Tự đồng bộ: điều kiện 30 phút, chạy trùng (double sync), race khi state chưa nạp, ghi đè cache khi lỗi.
- Test "giả qua": assert lỏng, phụ thuộc ngày chạy, skip không chính đáng.

Khung trả lời (tiếng Việt, tối đa 10 vấn đề, sắp theo mức nặng):
### <số>. [S1|S2|S3|S4] <tiêu đề ngắn>
- Vị trí: <file>:<dòng>
- Tái hiện: <input cụ thể / bước> → <kết quả sai> (mong đợi: <…>)
- Vì sao sai: <1–2 câu, dẫn SPEC mục nào nếu có>
Không khen, không viết lại code, không đề xuất tính năng mới. Không chắc thì ghi "(nghi vấn)". Nếu không tìm được vấn đề S1–S3 nào, nói rõ.
