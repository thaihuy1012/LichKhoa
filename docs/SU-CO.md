# SỰ CỐ — nhật ký lỗi nghiêm trọng (S1/S2)
(Chỉ Quản lý ghi. Đọc đầu mỗi phiên: sự cố chưa đóng xử lý trước mọi việc khác. Trạng thái: MỞ | ĐANG SỬA | CHỜ CHỦ DỰ ÁN | ĐÃ ĐÓNG.)

## Đang mở
- (không có)

## SC-001 — <tiêu đề> · Mức S1|S2 · Trạng thái: MỞ
- Phát hiện: <ngày> · bởi <kiem-thu / Kiến trúc sư / Chủ dự án> · tại T-x.y / M<n>
- Triệu chứng: <lệnh tái hiện + 3 dòng lỗi đầu>
- Commit tốt cuối cùng: <hash hoặc tag> · Commit nghi ngờ: <hash>
- Đóng băng: <phiếu tạm dừng>
- Chẩn đoán (sua-loi lượt 1/2): <nguyên nhân gốc + bằng chứng>
- Sửa: commit <hash> · Kiểm chứng: test tổng <N pass>
- Bài học → BAI-HOC.md: <1 dòng>
