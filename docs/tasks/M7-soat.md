# Soát chéo milestone M7 — "Nhắc trên iPhone qua Phím tắt"

## Đọc
AGENTS.md, docs/SPEC.md, docs/bao-cao/M7.md, src/export/reminder.ts, src/export/share.ts, src/ui/components/ReminderDialog.tsx, src/ui/screens/events/EventsTab.tsx, src/ui/screens/TodosTab.tsx, src/ui/screens/NoteTab.tsx, src/ui/screens/Preview.tsx, src/core/model.ts, src/ui/store.ts, tests/unit/reminder.test.ts, tests/unit/share-url.test.ts, tests/e2e/m7-reminder.spec.ts, docs/HUONG-DAN.md

## Yêu cầu

Bạn là người soát chéo độc lập. Nhiệm vụ: tìm lỗi và rủi ro trong phần mã vừa làm, KHÔNG sửa gì, chỉ viết báo cáo `docs/bao-cao/M7-soat-cheo.md`.

### Tài liệu chuẩn để đối chiếu
- `docs/SPEC.md`: §3 IN-11 (dòng 28–32) — đặc tả tính năng; §5 hợp đồng hàm (dòng 134–143); §6 mục `### M7` — tiêu chí nghiệm thu; §8 mục 10 — giới hạn đã biết.
- `docs/bao-cao/M7.md` — báo cáo của Quản lý (đọc để biết bối cảnh, nhưng đừng tin sẵn, hãy tự kiểm).

### Mã cần soát
- `src/export/reminder.ts` (lõi thuần: `defaultReminderAt`, `reminderWindow`, `reminderText`)
- `src/export/share.ts` (`shortcutUrl`, `openShortcut`)
- `src/ui/components/ReminderDialog.tsx`
- `src/ui/screens/events/EventsTab.tsx`, `TodosTab.tsx`, `NoteTab.tsx` (phần liên quan nút `rem-open` và hộp thoại)
- `src/ui/screens/Preview.tsx` (2 ô tên Phím tắt), `src/core/model.ts` + `src/ui/store.ts` (2 trường mới)
- `tests/unit/reminder.test.ts`, `tests/unit/share-url.test.ts`, `tests/e2e/m7-reminder.spec.ts`
- `docs/HUONG-DAN.md` mục `## E.` (hướng dẫn cài 2 Phím tắt)

### Hãy trả lời từng câu, mỗi câu kèm bằng chứng `file:dòng`

1. **Sai đặc tả**: có chỗ nào mã làm khác SPEC IN-11 / §5 không? (mặc định thời điểm cho sự kiện lặp / cả ngày / việc có hạn / việc không hạn / ghi chú; cửa sổ `past` / `alarm-ok` / `reminder-only`; định dạng payload; cắt 100/200 ký tự; tiêu đề rỗng → `LichKhoa`).

2. **Trường hợp biên chưa xử lý**: đổi múi giờ, giờ mùa hè, ngày 29/2, sự kiện qua nửa đêm, `until` đã qua, việc quá hạn, ghi chú rỗng, tiêu đề chỉ có khoảng trắng, chuỗi có ký tự đặc biệt cần mã hoá URL (`&`, `#`, `%`, emoji, dấu tiếng Việt), payload rất dài.

3. **Thứ tự lưu rồi mới điều hướng**: ở cả 3 form, dữ liệu có chắc chắn được lưu TRƯỚC khi `openShortcut` không? Nếu lưu thất bại thì có điều hướng nhầm không? Có khả năng mất dữ liệu khi iOS đóng PWA lúc chuyển sang Phím tắt không?

4. **Test có lỗ hổng không**: `tests/e2e/m7-reminder.spec.ts` và 2 file unit có chỗ nào kiểm hời hợt, kiểm sai ý, hoặc bỏ sót nhánh quan trọng? Có test nào sẽ hỏng theo thời gian (phụ thuộc ngày giờ chạy) không?

5. **Hướng dẫn `HUONG-DAN.md` §E**: đối chiếu với payload thật do `reminderText` sinh ra — hướng dẫn có khớp không? Còn bước nào sai, thiếu, hoặc sẽ làm người dùng cài hỏng không? (Chú ý: payload có 2 dòng với Sự kiện/Việc, 3 dòng với Ghi chú.)

6. **Rủi ro còn lại**: 3 rủi ro lớn nhất của tính năng này khi chạy trên iPhone thật, xếp theo mức nghiêm trọng.

## BÁO CÁO CUỐI (in đúng khung này, bằng tiếng Việt)

```
# Soát chéo M7 — <ngày>
## Điểm số: <0-10>/10 (mức độ sẵn sàng bàn giao)
## Lỗi phải sửa (mỗi mục: file:dòng · mô tả · vì sao nghiêm trọng)
## Nên sửa (không chặn)
## Trả lời 6 câu hỏi (ngắn gọn, có bằng chứng)
## 3 rủi ro lớn nhất trên iPhone thật
```

Quy tắc: chỉ nêu điều bạn kiểm chứng được bằng mã, kèm `file:dòng`. Không đoán. Nếu không kiểm được điều gì thì ghi rõ "không kiểm được".
