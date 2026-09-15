## BÁO CÁO CUỐI (in đúng khung này ở cuối)
KẾT QUẢ: XONG
SỐ VẤN ĐỀ: S1=1 S2=4 S3=2 S4=3

**Vấn đề 1:**
- Mức S1
- Vị trí: `src/ui/screens/events/TodosTab.tsx:376`
- Cách tái hiện: Vuốt một mục và chọn "Lưu trữ". Nhấn "Hoàn tác" trên toast. Mục đó không được khôi phục trở lại danh sách.
- Vì sao sai: Callback hoàn tác gọi `restoreTodo`, nhưng reducer bỏ qua do id vẫn tồn tại trong mảng state (chỉ mang cờ `archived: true`). Việc lưu trữ không xóa thực thể khỏi state.
- Gợi ý sửa một dòng: Đổi callback thành `store.dispatch({ type: 'archiveTodo', id: todo.id, archived: false })`.

**Vấn đề 2:**
- Mức S2
- Vị trí: `src/ui/screens/events/TodosTab.tsx:168`
- Cách tái hiện: Vuốt mở menu của mục, thả tay. Chạm vào mục đó và vuốt tiếp. Phần tử giật lập tức về vị trí 0px rồi mới tiếp tục chạy theo ngón tay.
- Vì sao sai: Hook `useRowGesture` không nhận trạng thái `isOpen` nên luôn gán tọa độ khởi điểm là 0, bỏ qua độ lệch `-160px` khi hàng đang mở.
- Gợi ý sửa một dòng: Truyền `isOpen` vào hook và đổi logic tính `dx` thành `(isOpen ? -SWIPE_PANEL_PX : 0) + dxNow`.

**Vấn đề 3:**
- Mức S2
- Vị trí: `src/ui/screens/events/TodosTab.tsx:199`
- Cách tái hiện: Kéo thả hoặc vuốt một mục rồi thả tay (không sinh ra event click). Chạm tiếp vào mục đó sẽ bị mất tác dụng (phải chạm 2 lần mới nhận).
- Vì sao sai: Cờ `suppressClickRef` được bật nhưng luồng `onPointerUp` không chịu dọn cờ này, gây kẹt và tự động nuốt oan lần click hợp lệ tiếp theo.
- Gợi ý sửa một dòng: Thêm `setTimeout(() => { suppressClickRef.current = false; }, 0);` vào cuối hàm `endGesture`.

**Vấn đề 4:**
- Mức S2
- Vị trí: `src/ui/screens/events/TodosTab.tsx:120`
- Cách tái hiện: Vuốt ngang mục việc cần làm trên iOS Safari. Hành động thường đứt đoạn vì trình duyệt giành quyền cuộn lại hoặc vuốt ngược (back).
- Vì sao sai: Trình duyệt iOS chốt quyết định cuộn từ những pixel dịch chuyển đầu. Cử chỉ trong `touchmove` chờ dịch trên 16px (lúc `phaseRef` thành `swipe`) mới gọi `preventDefault()`, khi đó đã quá muộn.
- Gợi ý sửa một dòng: Thêm điều kiện kiểm tra hướng `Math.abs(dxNow) > Math.abs(dyNow)` ngay tại callback của `touchmove` và `preventDefault()` sớm nhất có thể.

**Vấn đề 5:**
- Mức S2
- Vị trí: `src/ui/store.ts:139` (và dòng 104)
- Cách tái hiện: Khôi phục dữ liệu JSON cũ có nhiều mục bị trùng giá trị `order`. Thử kéo thả hoặc bấm nút di chuyển lên xuống. Vị trí trên màn hình không đổi.
- Vì sao sai: `reorderTodo` và `moveTodo` gán lại nguyên mảng `order` cũ của nhóm. Nếu cũ trùng thì mới vẫn trùng, kết hợp với hàm sort khiến kết quả hiển thị không thay đổi.
- Gợi ý sửa một dòng: Buộc sinh mảng order tăng ngặt khi tính `orders`, ví dụ: `[t.id, group[0].order + i]`.

**Vấn đề 6:**
- Mức S3
- Vị trí: `src/ui/screens/events/TodosTab.tsx:383` (và dòng 374)
- Cách tái hiện: Xóa hoặc lưu trữ mục A, rồi thực hiện xóa tiếp mục B trong vòng 5 giây tiếp theo. Toast mới đè hẳn lên toast cũ, làm mất khả năng hoàn tác mục A.
- Vì sao sai: API hiện tại chỉ hiển thị duy nhất 1 toast và lập tức ghi đè, làm mất luôn con trỏ tới callback phục hồi của thao tác cũ.
- Gợi ý sửa một dòng: Cập nhật component Toast để hiển thị nhiều thông báo dạng queue, hoặc chỉ áp dụng hành động xóa thực sự sau khi toast biến mất (như Gmail).

**Vấn đề 7:**
- Mức S3
- Vị trí: `src/ui/store.ts:224`
- Cách tái hiện: Khởi tạo luồng ứng dụng hoặc gọi test tạo `createStore` nhiều lần. Số lượng listener rác trên document và window sẽ liên tục tăng dần.
- Vì sao sai: Hàm `createStore` gán các listener cho tác vụ `flushPersist` trên đối tượng toàn cục mà không trả về hàm gỡ (cleanup) hoặc dùng cơ chế dọn dẹp.
- Gợi ý sửa một dòng: Sửa `createStore` để trả về thêm hàm `destroy` nhằm dọn dẹp các event listener.

**Vấn đề 8:**
- Mức S4
- Vị trí: `docs/bao-cao/M6.md:31`
- Cách tái hiện: Đọc phần Băn khoăn số 2: "bộ nhận cử chỉ nằm trong component — chưa tách hook riêng" và so với mã thực tế.
- Vì sao sai: Mã nguồn `TodosTab.tsx` tại dòng 91 đã tách bộ xử lý chạm thành hook `useRowGesture` rất rõ ràng, nội dung trong báo cáo không còn khớp với bản HEAD hiện tại.
- Gợi ý sửa một dòng: Cập nhật sự thật hoặc xóa thẳng mục băn khoăn số 2 khỏi báo cáo `M6.md`.

**Vấn đề 9:**
- Mức S4
- Vị trí: `tests/unit/store.test.ts:179`
- Cách tái hiện: Kiểm tra các test của reducer đổi thứ tự, hoàn toàn không có case nào giả lập mảng đầu vào chứa `order` bị trùng (duplicate).
- Vì sao sai: Test yếu, bỏ sót trường hợp biên mảng dữ liệu bị suy thoái order do khôi phục JSON, dẫn đến việc không bắt được lỗi Issue 5.
- Gợi ý sửa một dòng: Bổ sung 1 test case `it('reorderTodo hoạt động đúng khi có order trùng lặp')` để cover đủ logic sửa order.

**Vấn đề 10:**
- Mức S4
- Vị trí: `tests/unit/store.test.ts`
- Cách tái hiện: Tìm logic test cho quá trình khởi tạo store, không tồn tại dòng code test nào.
- Vì sao sai: Các khối logic cốt lõi như `createStore`, `flushPersist` và debounce chống mất dữ liệu không hề có unit test bảo vệ (coverage rỗng).
- Gợi ý sửa một dòng: Tạo block `describe('createStore')` với mock `vi.useFakeTimers()` nhằm bọc và kiểm tra thời điểm gọi hàm lưu.
