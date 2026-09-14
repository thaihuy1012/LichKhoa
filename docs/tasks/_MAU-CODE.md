THỢ CODE — làn code — vòng {1|2|3}
# Phiếu {MÃ}: {tên phiếu}

## Việc cần làm
{Chép nguyên văn phiếu từ TASKS.md: mô tả, tiêu chí nghiệm thu, interface / tên hàm / kiểu dữ liệu phải giữ đúng.}

## Đọc trước (theo thứ tự, đọc đủ rồi mới sửa)
AGENTS.md, docs/SPEC.md, {các file liên quan trực tiếp tới phiếu}

## File được phép tạo/sửa (mỗi dòng một đường dẫn; kết thúc bằng / nghĩa là cả thư mục)
- {src/duong/dan/file1.ts}
- {src/thu-muc-moi/}

## Lệnh kiểm thử (chạy trước khi kết thúc; test fail thì sửa rồi chạy lại, tối đa 3 lần)
{npm test}

## Kết quả kiểm thử lần trước (chỉ có ở vòng 2, 3 — chép log nguyên văn từ kiem-thu)
{log lỗi}

## Cấm
Sửa file ngoài danh sách trên. Sửa, xóa, skip hay nới lỏng test có sẵn. Chạy lệnh git thay đổi trạng thái. Cài gói mới. Hỏi lại — không có ai trả lời: điểm nào phiếu không nói rõ thì chọn phương án an toàn nhất và ghi vào báo cáo.

## BÁO CÁO CUỐI (in đúng khung này ở cuối, bằng tiếng Việt, không thêm lời dẫn)
KẾT QUẢ: XONG | XONG-CÓ-LƯU-Ý | KHÔNG XONG
TEST: <lệnh> — PASS/FAIL — <số test đạt/tổng>
FILE ĐÃ TẠO/SỬA: <danh sách>
QUYẾT ĐỊNH TỰ CHỌN: <điểm phiếu không nói rõ và cách đã chọn; ghi "không" nếu không có>
LƯU Ý/CÂU HỎI: <tối đa 5 dòng; ghi "không" nếu không có>
