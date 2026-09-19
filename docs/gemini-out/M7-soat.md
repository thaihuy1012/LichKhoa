CRITICAL INSTRUCTION 1: Không sử dụng lệnh gọi `cat`, `grep`, `sed`, `ls` vào trong `run_command` nếu đã có các tool chuyên dụng. 
CRITICAL INSTRUCTION 2: Đã dùng các tool `run_command` (với PowerShell `Get-Content`, `Get-ChildItem`), `find_by_name`, `view_file` để tìm, đọc nội dung và phân tích kỹ lưỡng.

Dựa trên quá trình kiểm tra mã nguồn (soát chéo) theo yêu cầu tại `docs/tasks/M7-soat.md`, tôi đã phân tích tất cả tài liệu, tệp mã, cũng như các kịch bản test để đối chiếu với đặc tả. Dưới đây là BÁO CÁO CUỐI đúng khung chuẩn:

```markdown
# Soát chéo M7 — 19/09/2026
## Điểm số: 5/10 (mức độ sẵn sàng bàn giao)
## Lỗi phải sửa (mỗi mục: file:dòng · mô tả · vì sao nghiêm trọng)
- `src/ui/components/ReminderDialog.tsx`:43-46 · `openShortcut` được gọi ngay sau `onSave` (bản chất là `store.dispatch` lưu đồng bộ lên bộ nhớ), không chờ IndexedDB (do có debounce 300ms tại `store.ts`). · Vì sao nghiêm trọng: Lệnh điều hướng URL bằng `shortcuts://` khiến iOS đưa webview/PWA vào background lập tức, có khả năng huỷ bỏ tiến trình IndexedDB đang chờ ghi, dẫn đến việc mất hoàn toàn dữ liệu (Sự kiện/Việc/Ghi chú) người dùng vừa nhập.
- `docs/HUONG-DAN.md`:137-142 · Hướng dẫn Phím tắt Cách B (dành cho Lời nhắc) yêu cầu cấu hình dùng hành động `Get Item at Index 3` một cách vô điều kiện ngay trước khối `If`. · Vì sao nghiêm trọng: Khi tạo lời nhắc từ Sự kiện hoặc Việc (không có ghi chú), `reminderText` chỉ sinh ra 2 dòng. Ứng dụng Shortcuts trên iOS khi truy cập Index 3 của list 2 phần tử sẽ báo lỗi "Out of bounds" và văng (dừng chạy) ngay lập tức.
- `tests/e2e/m7-reminder.spec.ts`:107-111 · Tất cả 6 kịch bản đều dùng bypass điều hướng bằng `?test=1` (ghi URL vào `window.__lastNav`), và chỉ kiểm tra phần tử hiện lên trong DOM. · Vì sao nghiêm trọng: Test E2E đã hoàn toàn che giấu lỗi nguy hiểm nhất (nguy cơ mất dữ liệu khi điều hướng thực tế trên iOS), tạo ra ảo giác là tính năng đã lưu thành công.
## Nên sửa (không chặn)
- `src/export/reminder.ts`:44-46 · Với sự kiện "cả ngày" trong cùng ngày hôm nay nhưng người dùng mở dialog lúc đã qua 08:00 sáng, `defaultReminderAt` sẽ mặc định trả về mốc trong quá khứ (`todayT08:00`), khiến nút "Thêm báo thức" bị vô hiệu hoá. Nên đề xuất thời gian tương lai hợp lý hơn (ví dụ giờ tiếp theo).
- `docs/HUONG-DAN.md`:76-79 · Hướng dẫn tạo `ThemBaoThuc` gán trực tiếp Ngày/Giờ vào hành động `Create Alarm`. Tuy nhiên, ứng dụng Đồng hồ của iOS chỉ nhận vào Giờ, phớt lờ Ngày. Cần cảnh báo rõ ràng cho người dùng về việc không nên chọn báo thức quá 24h.
## Trả lời 6 câu hỏi (ngắn gọn, có bằng chứng)
1. **Sai đặc tả**: Không có sai lệch nghiêm trọng về đặc tả. Mã bám rất sát SPEC, `reminderText` (`reminder.ts:77-80`) cắt chuỗi và fallback `LichKhoa` chuẩn xác. `defaultReminderAt` đúng logic 3 khoảng thời gian quy định.
2. **Trường hợp biên chưa xử lý**: Xử lý `note` rỗng ở `reminder.ts:79` sinh ra text 2 dòng gây lỗi crash Phím tắt Cách B (cố lấy dòng 3). Trường hợp "Sự kiện cả ngày tạo lúc chiều tối" chưa mượt vì bị gán về `08:00` (đã qua). Các trường hợp emoji, dấu tiếng Việt đã được an toàn thông qua `encodeURIComponent` ở `share.ts:44`.
3. **Thứ tự lưu rồi mới điều hướng**: App có lưu trước khi gọi `openShortcut` (`EventsTab.tsx:142`, `TodosTab.tsx:135` lưu qua Redux/memory), nhưng DB thực tế có độ trễ 300ms (`store.ts` dòng 110, `schedulePersist`). Khả năng mất dữ liệu rất cao khi iOS đóng băng PWA lúc chuyển sang Phím tắt mà IndexedDB chưa kịp ghi.
4. **Test có lỗ hổng không**: Lỗ hổng rất lớn. File `tests/e2e/m7-reminder.spec.ts` do chặn việc gọi URL thật nên UI web chạy mượt mà không bị ngắt, không mô phỏng được rủi ro thất thoát dữ liệu. Các test đều an toàn với múi giờ và chưa phát hiện test bị hỏng theo thời gian một cách rõ ràng (các phép tính Date đủ linh hoạt).
5. **Hướng dẫn HUONG-DAN.md §E**: Sai sót cực lớn ở Cách B (`HUONG-DAN.md:137`), bước lấy "Item at Index 3" sẽ làm Phím tắt crash đối với Sự kiện/Việc vì payload lúc đó chỉ có 2 dòng. Ở mục 1 `ThemBaoThuc` (`HUONG-DAN.md:76`), truyền Date vào `Create Alarm` nhưng iOS Alarm sẽ tự động bỏ qua Date, có thể gây báo thức sai ngày nếu đặt vượt 24h.
6. **Rủi ro còn lại**:
   - (1) Mất dữ liệu vừa nhập do iOS đóng băng IndexedDB đang đợi debounce.
   - (2) Lỗi crash (văng) phím tắt `ThemLoiNhac` Cách B đối với Sự kiện và Todo.
   - (3) Rung báo thức sai ngày nếu người dùng chọn mốc `rem-at` ở ngày mốt vì Đồng hồ iOS không quan tâm đến ngày.
## 3 rủi ro lớn nhất trên iPhone thật
1. **Mất hoàn toàn dữ liệu**: iOS suspend WebKit/PWA ngay khi hệ thống mở link `shortcuts://` trước khi quá trình chờ lưu xuống DB (`saveState` 300ms) hoàn thành.
2. **Crash Phím tắt Lời Nhắc (Cách B)**: App Shortcuts báo lỗi "Index Out of Bounds" khi nhận được payload 2 dòng (Sự kiện/Việc) nhưng cố tình đọc dòng 3 trước điều kiện `If`.
3. **Báo thức kêu nhầm ngày**: Tính năng `Create Alarm` của iOS không lưu Ngày. Nếu chọn mốc `rem-at` quá 24h, nó sẽ đổ chuông nhầm ngay lập tức vào hôm nay hoặc ngày mai ở đúng mốc giờ đó.
```
