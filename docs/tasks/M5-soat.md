# Soát chéo milestone M5 — bố cục Tuần giống app Inks

SOÁT CHÉO — làn soat | CHỈ ĐỌC, KHÔNG TẠO/SỬA BẤT KỲ FILE NÀO

## Đọc

- SPEC.md (§3 IN-2 bố cục Tuần, §5 kiến trúc, §6 M5 tiêu chí)
- DECISIONS.md (D-023 bảo trì, D-024 bố cục Tuần 5 điểm Chủ dự án chốt, D-011/D-018 tiền lệ)
- docs/bao-cao/M5.md (báo cáo, 5 điểm Quản lý còn băn khoăn)
- docs/bao-cao/M5.diff (git diff M4-ok..HEAD -- src/tests/scripts)
- src/render/layout/week.ts (415 dòng, layoutWeek + helper)
- src/render/layout/common.ts (DrawOp, weekDates, pastel — helper mới cho week)
- src/core/collect.ts (collectRenderData, expand khoảng đồng bộ [today−7, +60])
- src/core/model.ts (Occurrence.endTime)
- docs/tham-khao/inks-tuan.PNG (ảnh mẫu Inks)
- docs/test-log/T-5.2/week-note0-2.png, week-note1-15.png (ảnh kết quả)
- tests/unit/layout-week.test.ts (231 dòng unit test)
- tests/e2e/m5-week.spec.ts (163 dòng, luồng chính T-5.END)

## Yêu cầu

Soát chéo milestone M5 (bố cục Tuần) — liệt kê tối đa 10 vấn đề, xếp theo mức S1–S4:
- S1: mất dữ liệu / sai nghiệp vụ lõi (to-do quá hạn/không hạn, weekStart, endTime, sync range)
- S2: sai chức năng so với SPEC/D-024 / regression (SPEC v1.5 bắt buộc 5 điểm Chủ dự án; D-024 mô tả chi tiết)
- S3: lỗi nhỏ cục bộ
- S4: chất lượng, test yếu

**Trọng tâm:**
1. **SPEC/D-024 tuân thủ**: 5 điểm Chủ dự án chốt — to-do qua hạn dồn hôm nay, > 4 mục → 3 + "+N", danh sách hôm nay dưới dải, chip pastel, âm lịch nhỏ ở đầu cột (khi showLunar)
2. **Lỗi logic/biên**:
   - Tuần qua tháng/năm: weekDates([today−7, +60], weekStart) có vấn đề?
   - Hai TZ: nếu Tz khác múi máy → ngày/giờ đúng không?
   - `endTime`: local (`time + durationMin`) qua nửa đêm → không có `endTime`? Google (`end.dateTime` cùng ngày)?
   - Google offset: ví dụ end.dateTime="2026-09-15T23:30:00+07:00" (Hà Nội) → ngày địa phương đúng?
   - Sync range: `[today−7, +60]` đủ để expand ngày đầu tuần chứa hôm nay?
   - Occurrences trùng: local + Google gộp có chinh phục được duplicates?
   - Tràn mainArea: 1284×2778, 1179×2556, scale lớn, showNote bật → chip/danh sách có vệt ghi chú?
3. **So sánh mẫu Inks** (docs/tham-khao/inks-tuan.PNG):
   - Dải tuần nằm ở đâu trên canvas (top, left, width, height)?
   - Chip bo góc + màu pastel đúng không (màu sự kiện/lịch pha trắng, to-do vàng cố định)?
   - Danh sách hôm nay: icon "◷" + giờ, vạch màu, tên đậm — hiện đúng chỗ / font / cỡ chữ?
   - Ngày có 6 mục → 3 chip + "+3" hay "+6−3"?
4. **Báng hoăn M5.md §7**: 5 điểm Quản lý — xác nhận hay phát hiện thêm?
5. **Test giả/yếu**: `layout-week.test.ts` + `m5-week.spec.ts` có verify được điều cần test, hay chỉ kiểm assertion cứng?

Mỗi vấn đề ghi: **mức** (S1/S2/S3/S4) — **file:dòng** — **cách tái hiện** (nếu là test, nêu input/expected output) — **vì sao sai** — **gợi ý sửa một dòng** (không viết code).

## BÁO CÁO CUỐI (in đúng khung này ở cuối, bằng tiếng Việt)

KẾT QUẢ: XONG | KHÔNG XONG
SỐ VẤN ĐỀ: S1=.. S2=.. S3=.. S4=..

<nội dung theo yêu cầu trên — tối đa 10 vấn đề>
