# LÀN GEMINI — v2 (Gemini là thợ chính thức)

Gemini chạy qua Antigravity CLI (`agy`, gói Google AI Pro) và tham gia pipeline như một thợ. Khác v1: Gemini nhận **phiếu code thường** (không chỉ module cô lập), tự chạy test khi làm, và mọi việc giao Gemini đi qua subagent `tho-gemini` để Quản lý không phải tự viết prompt, chờ, đọc log.

## 1. Model và việc

Hai model Gemini, mỗi model một việc; mức suy nghĩ (effort) chọn theo làn:

| Làn | Model | Effort | Vì sao |
|---|---|---|---|
| `code` — viết code | `gemini-3.8-flash` | high | Model coding mới nhất của Google (9/2026), mạnh nhất về software engineering trong `agy`; nhanh |
| `soat` — soát chéo | `gemini-3.1-pro` | high | Model khác model viết code → cặp mắt độc lập; ngữ cảnh 1M; hạn mức riêng với Flash |
| `doc` — đọc rộng | `gemini-3.1-pro` | high | Ngữ cảnh 1M cho repo/log/tài liệu lớn |
| `sinh` — sinh file | `gemini-3.8-flash` | low | Việc cơ học, cần nhanh, ít tốn hạn mức |

- Đổi model/effort: sửa `scripts/gemini.env` (4 dòng, một dòng một làn). Tên phải có trong `agy models`.
- `agy models` có thể in slug kèm effort (`gemini-3.8-flash-high`) hoặc slug trần (`gemini-3.8-flash`); script tự dò dạng máy đang có — dạng kèm effort thì dùng nguyên slug, dạng trần thì thêm `--effort <mức>`. `kiem-tra` in ra dạng đã chọn cho từng làn.
- `model: haiku` trong `.claude/agents/tho-gemini.md` **không phải model Gemini**: đó là Claude Haiku chạy subagent liên lạc (viết prompt, gọi script, đợi, trả báo cáo) — subagent của Claude Code chỉ chạy được model Claude, và việc này không cần model mạnh. Model Gemini thật do script chọn theo bảng trên.

## 2. Bốn làn

| Làn | Mã script | Gemini được làm gì | Sau khi xong |
|---|---|---|---|
| ĐỌC RỘNG | `doc` | Đọc repo/log/tài liệu lớn, trả lời câu hỏi. Không sửa file. | Quản lý dùng câu trả lời |
| SOÁT CHÉO | `soat` | Đọc SPEC + diff milestone, liệt kê vấn đề S1–S4. Không sửa file. | Gửi Kiến trúc sư như gợi ý cần kiểm chứng |
| SINH FILE | `sinh` | Tạo file cơ học (fixture, dữ liệu mẫu, boilerplate, i18n...). | `kiem-thu` → review → commit |
| THỢ CODE | `code` | Làm phiếu code đủ điều kiện (mục 3), tự chạy test, tối đa 3 lần tự sửa. | `kiem-thu` → review → commit |

Làn `doc`/`soat`: script tự hoàn tác nếu Gemini lỡ sửa file. Làn `sinh`/`code`: script tự hoàn tác file **có theo dõi** mà Gemini sửa ngoài danh sách cho phép; file **mới** ngoài danh sách chỉ được liệt kê, Quản lý quyết định xóa hay giữ.

## 3. Phiếu đủ điều kiện giao Gemini (làn code) — cần đủ 4 điều

1. Có tiêu chí nghiệm thu rõ **và** lệnh kiểm thử chạy được (test có sẵn, hoặc phiếu yêu cầu viết test trước).
2. Danh sách file được tạo/sửa xác định trước, không quá 8 file (thư mục mới tính là 1).
3. Không phải phiếu sự cố S1/S2; không phải phiếu đổi interface dùng chung hay đổi thiết kế (loại này cần trao đổi qua lại, Gemini headless không hỏi được).
4. Không có thợ Claude nào đang sửa dở — cây git sạch (script tự kiểm tra và từ chối nếu chưa sạch).

## 4. Mức giao việc

- **NHIỀU** (mặc định khi bật): mọi phiếu đủ điều kiện → `tho-gemini` trước. Thợ Claude nhận phiếu không đủ điều kiện, phiếu sự cố, và phiếu Gemini trả về quá vòng.
- **VỪA**: chỉ module mới/cô lập, sinh file, soát chéo, đọc rộng (như v1).
- **TẮT**: không dùng Gemini.

Tự hạ NHIỀU → VỪA (tới hết milestone hiện tại; milestone sau thử lại NHIỀU): 2 phiếu Gemini liên tiếp hết 3 vòng vẫn FAIL, hoặc 1 phiếu Gemini gây sự cố S2.
Tự TẮT tới hết phiên: script báo `HẾT HẠN MỨC` / `CHƯA ĐĂNG NHẬP` / `TRỐNG` / `LỖI` / `QUÁ GIỜ` 2 lần liên tiếp. Việc đang dở chuyển ngay sang thợ Claude, không chờ, không thử tiếp.
Khi hạ mức hay tắt: Quản lý ghi một dòng vào `TASKS.md` và nói cho người dùng ở lần báo cáo gần nhất.

## 5. Vòng đời một phiếu Gemini

1. Quản lý giao cho `tho-gemini`: làn, mã phiếu, nội dung phiếu, file được phép, lệnh test, file cần đọc, vòng số mấy.
2. `tho-gemini` viết `docs/tasks/<mã>.md` theo mẫu, chạy nền, đợi, tổng kết, trả báo cáo đúng khung.
3. Quản lý cho `kiem-thu` chạy như với thợ Claude.
4. FAIL/REGRESSION → giao lại `tho-gemini` **vòng 2** kèm log test nguyên văn (file `<mã>-v2.md`). FAIL nữa → **vòng 3** (cuối, `<mã>-v3.md`).
5. Hết 3 vòng vẫn FAIL → hoàn tác phần Gemini (`git checkout -- . && git clean -fd -e docs/gemini-out -e docs/tasks -e docs/bao-cao -e .claude`), giao phiếu cho `tho-sonnet`/`tho-opus`, ghi một dòng S4 vào `docs/SU-CO.md`. Không đưa lên Kiến trúc sư chỉ vì Gemini không làm được.
6. PASS → review → commit như mọi phiếu.

Gemini và thợ Claude **không ghi file cùng lúc**: trong lúc một lượt Gemini chạy, Quản lý chỉ làm việc chỉ đọc (khảo sát, soạn phiếu kế tiếp). Nếu Claude Code cho phép chạy subagent ở nền, chạy `tho-gemini` ở nền và soạn phiếu tiếp theo trong lúc chờ.

## 6. Cách gọi script (`tho-gemini` dùng; Quản lý chỉ cần biết để đọc báo cáo)

```
bash scripts/agy-run.sh kiem-tra                          # kiểm tra agy, đăng nhập, model, headless
bash scripts/agy-run.sh <doc|soat|sinh|code> docs/tasks/<tên>.md [model]   # chạy NỀN, trả về ngay
bash scripts/agy-run.sh cho <tên> [giây]                  # đợi tối đa N giây (mặc định 100), báo ĐANG CHẠY / XONG LƯỢT
bash scripts/agy-run.sh ket-qua <tên>                     # phân loại kết quả, liệt kê file đổi, hoàn tác ngoài phạm vi, in 40 dòng cuối báo cáo
bash scripts/agy-run.sh huy <tên>                         # hủy lượt đang chạy, hoàn tác toàn bộ
bash scripts/agy-run.sh trang-thai                        # liệt kê các lượt
```

- Mỗi lượt chạy nền có giới hạn cứng: code 30 phút, làn khác 15 phút → quá giờ tự bị giết, báo `QUÁ GIỜ`. Không có vòng lặp vô hạn.
- `ket-qua` in dòng đầu gồm trạng thái, làn, model và effort đã dùng. Phân loại: `XONG` · `TRỐNG` · `LỖI` · `HẾT HẠN MỨC` · `CHƯA ĐĂNG NHẬP` · `QUÁ GIỜ` · `ĐÃ HỦY`. Chỉ `XONG` mới đưa sang `kiem-thu`.
- Kết quả ở `docs/gemini-out/<tên>.md`; log ở `.err`; trạng thái ở `.status`. Quản lý và `tho-gemini` không đọc `.err` trừ khi `ket-qua` in ra.
- Gemini được chạy với `--dangerously-skip-permissions` (chế độ headless của agy sẽ treo ở mọi lời hỏi quyền nếu không có cờ này). An toàn dựa vào: cây git sạch trước khi chạy, hoàn tác ngoài phạm vi, giới hạn giờ, và quy tắc trong `AGENTS.md`. Đây là quy tắc, không phải rào chắn kỹ thuật — không dùng làn Gemini trên repo chứa bí mật hay dữ liệu thật.

## 7. Mẫu prompt

- `docs/tasks/_MAU-CODE.md` — làn `code` và `sinh`. Bắt buộc có mục "File được phép tạo/sửa" (script đọc mục này để hoàn tác ngoài phạm vi) và mục "Lệnh kiểm thử".
- `docs/tasks/_MAU-SOAT-CHEO.md` — làn `soat` và `doc`.
- Tên file prompt = mã phiếu (`T-2.3.md`, vòng sau `T-2.3-v2.md`) hoặc tên việc (`M2-soat.md`). Tên này thành tên lượt.

## 8. Soát chéo cuối milestone (bắt buộc khi làn bật)

- Quản lý xuất diff: `git diff M<n-1>-ok..HEAD > docs/bao-cao/M<n>.diff` (milestone đầu: `git diff $(git rev-list --max-parents=0 HEAD)..HEAD > docs/bao-cao/M1.diff`), commit file diff và báo cáo trước khi gọi.
- Giao `tho-gemini` làn `soat`, tên `M<n>-soat`, mẫu `_MAU-SOAT-CHEO.md`.
- Đổi tên kết quả thành `docs/bao-cao/M<n>-soat-cheo.md`, gửi Kiến trúc sư kèm báo cáo milestone như gợi ý cần kiểm chứng.

## 9. Cài đặt (một lần) và kiểm tra

1. Cài Antigravity CLI: https://antigravity.google/cli (Windows: cài xong mở Git Bash mới, gõ `agy --version`).
2. Trong Git Bash, `cd` vào thư mục dự án, chạy `agy` tương tác: đăng nhập tài khoản Google **cá nhân** có gói AI Pro (Workspace không tính), chấp nhận tin cậy thư mục nếu được hỏi, gõ `/quit`.
3. `bash scripts/agy-run.sh kiem-tra` — phải ra `KẾT LUẬN: SẴN SÀNG`. Nếu có dòng `[X]`, sửa theo hướng dẫn trên dòng đó rồi chạy lại.
4. Trong phiên `claude --agent quan-ly`: `Bật làn Gemini mức NHIỀU theo docs/LAN-GEMINI.md.`

## 10. Sự cố thường gặp

| Hiện tượng | Nguyên nhân | Xử lý |
|---|---|---|
| `TRỐNG` (agy chạy xong nhưng không in gì) | agy cũ (lỗi không in ra stdout khi không có terminal) hoặc thư mục chưa được tin cậy | Cài lại agy bản mới nhất; chạy `agy` tương tác trong thư mục dự án, `/quit`; `kiem-tra` lại |
| `CHƯA ĐĂNG NHẬP` | Phiên đăng nhập hết hạn | `agy` tương tác, đăng nhập lại, `/quit` |
| `HẾT HẠN MỨC` / 429 dù có Pro | Cửa sổ hạn mức, hoặc lỗi entitlement | Đợi; hoặc đăng xuất/đăng nhập lại. 2 lần liên tiếp → làn tự tắt, pipeline chạy tiếp không Gemini |
| `QUÁ GIỜ` | Phiếu quá to hoặc Gemini kẹt | Chia nhỏ phiếu, giao lại một lần; vẫn quá giờ → giao thợ Claude |
| Script báo "cây làm việc chưa sạch" | Thợ Claude đang sửa dở hoặc chưa commit | Đợi thợ xong và commit, rồi gọi lại |
| Script báo "đang có lượt khác chạy" | Lượt trước chưa xong hoặc chết giữa chừng | `cho <tên>` để đợi, hoặc `huy <tên>` |
