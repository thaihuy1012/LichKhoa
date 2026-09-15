SOÁT CHÉO — làn soat — CHỈ ĐỌC, KHÔNG TẠO/SỬA BẤT KỲ FILE NÀO
# Soát chéo milestone M6

## Đọc
AGENTS.md, docs/SPEC.md, docs/bao-cao/M6.md, docs/bao-cao/M6.diff, docs/DECISIONS.md (D-025 đến D-028), src/ui/screens/events/TodosTab.tsx, src/ui/store.ts, src/core/collect.ts, tests/unit/store.test.ts, tests/unit/collect.test.ts

## Yêu cầu
Soát chéo M6 — cử chỉ danh sách Việc cần làm (SPEC v1.7, D-028) + phiếu bảo trì sau M5 (B-003..B-006, T-5.4) — để phát hiện vấn đề. Liệt kê tối đa 10 vấn đề, xếp theo mức S1–S4:
- S1: mất/hỏng dữ liệu, sai nghiệp vụ lõi, không tái hiện lại được
- S2: sai chức năng chính, regression, luồng khác
- S3: lỗi nhỏ trong phạm vi chức năng
- S4: chất lượng code/test yếu

Mỗi vấn đề ghi:
- Mức S{1-4}
- Vị trí: file:dòng
- Cách tái hiện (nếu là lỗi hành vi)
- Vì sao sai (giải thích ngắn)
- Gợi ý sửa một dòng

Trọng tâm soát (không bỏ sót):
1. Lệch SPEC/D-026..D-028: mục tiêu M6, tiêu chí done, reducer order/restore logic
2. Safari iOS: xung đột cuộn/vuốt/nhấn giữ, pointercancel, rò listener, trạng thái kẹt, click "ma", vùng chạm < 44 px
3. Reducer `reorderTodo`: xử lý order trùng / kéo tới đầu-cuối, check boundary
4. Reducer `restoreTodo`: lôgic phục hồi dữ liệu, kiểm tra xung đột
5. `dedupOccurrences`: xử lý biên (mảng rỗng, một phần tử, phần tử trùng)
6. `flushPersist`: đăng ký/hủy listener đúng cách, không rò tài nguyên
7. Test giả/yếu: coverage reducer/collect, test case biên
8. Báo cáo M6.md: câu nào mơ hồ, dữ liệu nào không khớp kết quả, tiêu chí nghiệm thu M6 đã cover hết không

Không khen code, không viết lại, chỉ nêu vấn đề + gợi ý sửa.

## BÁO CÁO CUỐI (in đúng khung này ở cuối)
KẾT QUẢ: XONG | KHÔNG XONG
SỐ VẤN ĐỀ: S1=.. S2=.. S3=.. S4=..
<nội dung từng vấn đề theo yêu cầu trên>
