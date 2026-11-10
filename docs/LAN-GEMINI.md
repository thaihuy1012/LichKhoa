# LÀN GEMINI (Gemini là thợ chính thức)

Gemini chạy qua Antigravity CLI (`agy`, gói Google AI Pro) và tham gia pipeline như một thợ. Nguyên tắc: **việc gì Gemini làm được thì giao Gemini; Claude chỉ làm việc Gemini không làm được** (tiết kiệm token Claude). Gemini nhận phiếu code thường, tự chạy test khi làm, cùng Kiến trúc sư lên ý tưởng ban đầu, và mọi việc giao Gemini đi qua subagent `tho-gemini` để Quản lý không phải tự viết prompt, chờ, đọc log. Quy tắc giao việc nằm ở `quan-ly.md` mục "Làn Gemini"; file này là tài liệu tham chiếu về làn, model, script và sự cố.

## 1. Model và việc

Mỗi làn một model, effort chọn theo làn (v5.2, 10/11/2026). Nguyên tắc: Flash (hạn mức dồi dào, ~300–500 lượt/5 giờ) làm mọi việc nhiều lượt gọi; Argon (hạn mức riêng ~50–150 lượt/5 giờ, thêm trần tuần; effort high trừ hạn mức nhanh hơn) chỉ cho việc **ít lượt gọi mà giá trị cao**. Các con số là ước tính do agent trong agy tự tra, không phải số chính thức của Google; một phiếu code agentic có thể tốn hàng chục lượt gọi.

| Làn | Model | Effort | Vì sao |
|---|---|---|---|
| `code` — viết code (vòng 1–3) | `gemini-3.8-flash` | high | Hạn mức gần như không phải lo → thợ chính cho mọi phiếu |
| `code … kho` — vòng 4 nâng bậc | `gemini-4-argon` | medium | Phiếu code agentic tốn lượt gọi nhiều nhất; medium vẫn hơn Flash high rõ rệt và để dành Argon cho soát chéo, ý tưởng |
| `code … vong5` — vòng 5 (tùy chọn) | `claude-sonnet-5-5` (qua agy) | medium | Trừ hạn mức Claude của gói Google AI Pro (~40–80 lượt/5 giờ), không đụng hạn mức Claude Code — đỡ cho thợ Claude trước khi tiêu token thật. Ngữ cảnh 200k, chạy headless nên không trao đổi qua lại được |
| `soat` — soát chéo | `gemini-4-argon` | high | 4 lượt/dự án, chốt chặn chất lượng; khác model viết code → cặp mắt độc lập, góc nhìn khác Claude |
| `doc` — đọc rộng | `gemini-3.8-flash` | high | Đọc nhiều file = nhiều lượt gọi; Flash ngữ cảnh 1M+, dư hạn mức, tóm tắt không cần suy luận sâu |
| `sinh` — sinh file | `gemini-3.8-flash` | low | Việc cơ học |
| `ytuong` — lên ý tưởng | `gemini-4-argon` | high | 1–2 lượt/dự án nhưng quyết định hướng đi cả dự án; cùng Kiến trúc sư (Fable 5.1 max), Fable quyết |

Không dùng: **Claude Opus 5.5 trong agy** (~10–25 lượt/5 giờ, một phiếu agentic dễ ăn hết cả cửa sổ). **GPT-OSS 120B** chỉ là dự phòng tay khi Flash cũng bị khóa (rất hiếm): tạm sửa `GEMINI_CODE=gpt-oss-120b; EFFORT_CODE=medium` (model này chỉ có mức Medium), chạy `kiem-tra`, xong việc thì trả lại.

- Hạn mức: Argon và Claude trong agy mỗi bên một hạn mức riêng (cửa sổ 5 giờ + trần tuần), tách khỏi Flash — cạn bên nào chỉ bên đó tạm khóa. Script tự xử lý (mục 11). Xem hạn mức thật: `/usage` trong `agy`.
- Đổi model/effort: sửa `scripts/gemini.env` (một dòng một làn). Ghi tên gốc (`gemini-4-argon`) và effort ở trường riêng — trong agy, effort là một thanh chọn riêng (low / medium / high); tên đã kèm hậu tố cũng được. Tên phải có trong `agy models`. `AGY_FORMAT=stream` cho phép đo hoạt động qua luồng JSON của agy (cần `node`); `kiem-tra` tự đổi sang `text` nếu máy không hỗ trợ.
- Menu `/model` trong agy (chữ "(current)", mức effort đang chọn) chỉ áp dụng cho phiên bạn gõ tay; pipeline chạy theo `gemini.env` cho từng làn, không cần đổi gì trên menu. Menu hiện tên hiển thị ("Gemini 4 Argon"); script dùng tên lệnh trong `agy models` — `kiem-tra` đối chiếu giúp.
- `agy models` có thể in slug kèm effort (`gemini-3.8-flash-high`) hoặc slug trần (`gemini-3.8-flash`); script tự dò dạng máy đang có — dạng kèm effort thì dùng nguyên slug, dạng trần thì thêm `--effort <mức>`. `kiem-tra` in ra dạng đã chọn cho từng làn.
- `model: haiku` trong `.claude/agents/tho-gemini.md` **không phải model Gemini**: đó là Claude Haiku chạy subagent liên lạc (viết prompt, gọi script, đợi, trả báo cáo) — subagent của Claude Code chỉ chạy được model Claude, và việc này không cần model mạnh. Model Gemini thật do script chọn theo bảng trên.

## 2. Năm làn

| Làn | Mã script | Gemini được làm gì | Sau khi xong |
|---|---|---|---|
| Ý TƯỞNG | `ytuong` | Vòng 1: viết bản ý tưởng độc lập từ ý tưởng gốc. Vòng 2: đọc bản và nhận xét của Kiến trúc sư, phản biện lại, đề xuất hợp nhất. Chỉ ghi `docs/y-tuong/`. | Kiến trúc sư viết bản hợp nhất, quyết |
| ĐỌC RỘNG | `doc` | Đọc repo/log/tài liệu lớn, trả lời câu hỏi (thay `khao-sat`). Không sửa file. | Quản lý dùng câu trả lời |
| SOÁT CHÉO | `soat` | Đọc SPEC + diff milestone, liệt kê vấn đề S1–S4; ý kiến thứ hai khi sự cố. Không sửa file. | Gửi Kiến trúc sư như gợi ý cần kiểm chứng |
| SINH FILE | `sinh` | Tạo file cơ học (fixture, dữ liệu mẫu, boilerplate, i18n...). | `kiem-thu` → review → commit |
| THỢ CODE | `code` | Làm mọi phiếu có lệnh kiểm tra + danh sách file (kể cả T-1.1, T-n.END, bug S3/S4), tự chạy test, tối đa 3 lần tự sửa. | `kiem-thu` → review → commit |

Làn `doc`/`soat`: script tự hoàn tác nếu Gemini lỡ sửa file. Làn `sinh`/`code`/`ytuong`: script tự hoàn tác file **có theo dõi** mà Gemini sửa ngoài danh sách cho phép; file **mới** ngoài danh sách chỉ được liệt kê, Quản lý quyết định xóa hay giữ.

## 3. Việc gì giao Gemini, việc gì Claude làm

Gemini làm: mọi phiếu có (1) lệnh kiểm tra chạy được (test/build/lint/script) và (2) danh sách file được tạo/sửa xác định trước — kể cả khung dự án T-1.1, kiểm thử tích hợp T-n.END, sinh file, bug S3/S4 bảo trì; khảo sát/đọc rộng; soát chéo; lên ý tưởng. Phiếu chưa đủ hai điều trên → Quản lý sửa phiếu cho đủ (chia nhỏ, thêm lệnh kiểm tra) rồi vẫn giao Gemini.

Chỉ Claude làm (Gemini không làm được): điều phối, review, hỏi Chủ dự án (Quản lý) · quyết định kiến trúc/SPEC, phán quyết (Kiến trúc sư — Gemini chỉ góp ý) · cổng kiểm thử độc lập (`kiem-thu`) · sự cố S1/S2 (`sua-loi`, Gemini cho ý kiến thứ hai) · phiếu Gemini đã hết chuỗi vòng agy hoặc đứng im (thợ Claude tiếp quản, dùng phần Gemini đã làm) · phiếu cần trao đổi qua lại nhiều · mọi việc khi làn TẮT hoặc có sự cố MỞ.

## 4. Mức giao việc (trạng thái ghi ở dòng "Làn Gemini" trong `docs/TASKS.md`)

- **NHIỀU** (mặc định khi `kiem-tra` sẵn sàng): mọi phiếu đủ điều kiện (kể cả T-1.1, T-n.END) → `tho-gemini` trước. Thợ Claude nhận phiếu không đủ điều kiện, phiếu sự cố S1/S2, phiếu đã hết chuỗi vòng agy.
- **VỪA**: chỉ module/file mới cô lập, sinh file, soát chéo, đọc rộng.
- **TẮT (Chủ dự án)**: không dùng Gemini, Quản lý không tự bật lại. **TẮT (lỗi: …)**: tắt do lỗi, Quản lý tự thử lại `kiem-tra` ở phiên sau.
- Quản lý tự kiểm tra ở Giai đoạn 1 và ghi mức; Chủ dự án đổi mức bằng câu "Chuyển làn Gemini về NHIỀU / VỪA / TẮT".

Tự hạ NHIỀU → VỪA (tới hết milestone hiện tại; DUYỆT milestone thì trả về NHIỀU): 2 phiếu Gemini liên tiếp hết chuỗi vòng agy vẫn FAIL (hoặc QUÁ GIỜ sau gia hạn), hoặc 1 phiếu Gemini gây sự cố S2.
Tự TẮT tới hết phiên: script báo `TRỐNG` / `LỖI` / `HẾT HẠN MỨC` (Flash) / `CHƯA ĐĂNG NHẬP` / `ĐỨNG IM` / `BỊ TỪ CHỐI` 2 lần liên tiếp (`QUÁ GIỜ` sau gia hạn là phiếu thất bại; `MODEL NGHỈ` không tính). Việc đang dở chuyển ngay sang thợ Claude, không chờ, không thử tiếp.
Khi hạ mức hay tắt: Quản lý ghi `TASKS.md` và nói cho Chủ dự án một câu ở lần báo cáo gần nhất, không hỏi.

## 5. Vòng đời một phiếu Gemini

1. Quản lý giao cho `tho-gemini`: làn, mã phiếu, nội dung phiếu, file được phép, lệnh test, file cần đọc, vòng số mấy.
2. `tho-gemini` viết `docs/tasks/<mã>.md` theo mẫu, chạy nền, đợi, tổng kết, trả báo cáo đúng khung.
3. Trong lúc chạy, **script tự canh** (không ai canh tay):
   - Cứ 20 giây đo hoạt động: luồng JSON của agy dài ra, hoặc có file trong dự án được ghi.
   - Đứng im 10 phút → giết agy, giao lại cùng việc kèm ghi chú "làm tiếp phần dở", giữ nguyên file đã sửa. Tối đa 2 lần; lần thứ 3 → dừng, báo `ĐỨNG IM`.
   - Tới giới hạn giờ (code 30 phút; làn khác 15–20) mà còn hoạt động trong 10 phút gần nhất **và** đúng hướng (có sửa file, mọi file sửa đều trong danh sách cho phép) → tự gia hạn +15 phút, lặp lại tới trần (code 60, ý tưởng 40, làn khác 30 phút).
   - Hết trần → dừng, nhưng **giữ kết quả dở** (file trong phạm vi không hoàn tác) để thợ Claude tiếp quản. Làn chỉ đọc thì hoàn tác.
4. Quản lý cho `kiem-thu` chạy như với thợ Claude.
5. FAIL/REGRESSION → giao lại `tho-gemini` **vòng 2** kèm log test nguyên văn (file `<mã>-v2.md`), làm tiếp trên phần dở — không hoàn tác, không commit giữa các vòng; script cho vòng sau chạy khi mọi file đang sửa đều trong danh sách được phép của phiếu (có file ngoài danh sách → script từ chối và nêu tên file). FAIL nữa → **vòng 3** (`<mã>-v3.md`). FAIL nữa → **vòng 4** (`<mã>-v4.md`, nâng bậc: `bash scripts/agy-run.sh code docs/tasks/<mã>-v4.md kho` → Gemini 4 Argon medium làm tiếp). FAIL nữa → **vòng 5** (`<mã>-v5.md`, `… vong5` → Claude Sonnet 5.5 qua agy làm tiếp). Vòng 4 bị bỏ khi `Vòng 4 Argon: NGỪNG` hoặc Argon đang nghỉ; vòng 5 bị bỏ khi `Vòng 5 Sonnet qua agy: TẮT` hoặc Sonnet đang nghỉ (`han-muc` cho biết, không gọi agy).
6. Hết chuỗi vòng vẫn FAIL, hoặc `QUÁ GIỜ`/`ĐỨNG IM` → thợ Claude (`tho-sonnet`) tiếp quản từ phần Gemini đã làm; hoàn tác chỉ khi phần đó vô dụng (`git checkout -- . && git clean -fd -e docs/gemini-out -e docs/tasks -e docs/bao-cao -e docs/y-tuong -e .claude`). Ghi một dòng S4 vào `docs/SU-CO.md`. Không đưa lên Kiến trúc sư chỉ vì Gemini không làm được.
7. PASS → review → commit như mọi phiếu.

Gemini và thợ Claude **không ghi file cùng lúc**: trong lúc một lượt Gemini chạy, Quản lý chỉ làm việc chỉ đọc (soạn phiếu kế tiếp). Nếu Claude Code cho phép chạy subagent ở nền, chạy `tho-gemini` ở nền và soạn phiếu tiếp theo trong lúc chờ.

## 6. Cách gọi script (`tho-gemini` dùng; Quản lý chỉ cần biết để đọc báo cáo)

```
bash scripts/agy-run.sh kiem-tra                          # kiểm tra agy, đăng nhập, model, headless
bash scripts/agy-run.sh <code|sinh|soat|doc|ytuong> docs/tasks/<tên>.md [model|kho|vong5]   # chạy NỀN, trả về ngay (kho = vòng 4, model GEMINI_KHO; vong5 = vòng 5, model MODEL_VONG5)
bash scripts/agy-run.sh cho <tên> [giây]                  # đợi tối đa N giây (mặc định 100): đã bao lâu, giới hạn, hoạt động gần nhất, đã giao lại/gia hạn
bash scripts/agy-run.sh ket-qua <tên>                     # phân loại kết quả, file đổi, hoàn tác ngoài phạm vi, nhật ký lượt, 40 dòng cuối báo cáo
bash scripts/agy-run.sh gia-han <tên> [phút]              # nới giới hạn bằng tay (script đã tự gia hạn khi đang làm đúng hướng)
bash scripts/agy-run.sh huy <tên>                         # hủy lượt đang chạy, hoàn tác toàn bộ
bash scripts/agy-run.sh trang-thai                        # liệt kê các lượt
bash scripts/agy-run.sh han-muc [xoa]                     # Argon / Sonnet vòng 5 đang dùng được hay đang nghỉ tới mấy giờ; xoa = dùng lại ngay (mục 11)
```

- Giới hạn giờ ban đầu: code 30, ý tưởng 20, làn khác 15 phút; tự gia hạn +15 khi đang làm đúng hướng, tới trần (code 60, ý tưởng 40, khác 30). Đứng im 10 phút → giao lại, tối đa 2 lần. Không có vòng lặp vô hạn.
- `ket-qua` in dòng đầu gồm trạng thái, làn, model, effort, số lần giao lại và gia hạn; dòng "ĐÃ ĐỔI MODEL" nếu script đã chạy Flash thay Argon. Phân loại: `XONG` · `TRỐNG` · `LỖI` · `HẾT HẠN MỨC` · `MODEL NGHỈ` · `CHƯA ĐĂNG NHẬP` · `QUÁ GIỜ` · `ĐỨNG IM` · `ĐÃ HỦY`. Chỉ `XONG` mới đưa sang `kiem-thu`; `QUÁ GIỜ`/`ĐỨNG IM` kèm "GIỮ KẾT QUẢ DỞ" thì thợ Claude tiếp quản; `MODEL NGHỈ` thì bỏ vòng đó, đi tiếp chuỗi vòng.
- Kết quả ở `docs/gemini-out/<tên>.md`; luồng thô `.stream`; log `.err`; nhật ký lượt `.log`; trạng thái `.status`. Quản lý và `tho-gemini` chỉ đọc phần `ket-qua` in ra.
- Gemini được chạy với `--dangerously-skip-permissions` (chế độ headless của agy sẽ treo ở mọi lời hỏi quyền nếu không có cờ này). An toàn dựa vào: cây git sạch trước khi chạy, hoàn tác ngoài phạm vi, giới hạn giờ, và quy tắc trong `AGENTS.md`. Đây là quy tắc, không phải rào chắn kỹ thuật — không dùng làn Gemini trên repo chứa bí mật hay dữ liệu thật.

## 7. Mẫu prompt

- `docs/tasks/_MAU-CODE.md` — làn `code` và `sinh`. Bắt buộc có mục "File được phép tạo/sửa" (script đọc mục này để hoàn tác ngoài phạm vi) và mục "Lệnh kiểm thử".
- `docs/tasks/_MAU-SOAT-CHEO.md` — làn `soat` và `doc`.
- `docs/tasks/_MAU-Y-TUONG.md` — làn `ytuong` (vòng 1 viết bản ý tưởng, vòng 2 phản biện bản của Kiến trúc sư).
- Tên file prompt = mã phiếu (`T-2.3.md`, vòng sau `T-2.3-v2.md`) hoặc tên việc (`M2-soat.md`). Tên này thành tên lượt.

## 8. Soát chéo cuối milestone (bắt buộc khi làn bật)

- Quản lý xuất diff: `git diff M<n-1>-ok..HEAD > docs/bao-cao/M<n>.diff` (milestone đầu: `git diff $(git rev-list --max-parents=0 HEAD)..HEAD > docs/bao-cao/M1.diff`), commit file diff và báo cáo trước khi gọi.
- Giao `tho-gemini` làn `soat`, tên `M<n>-soat`, mẫu `_MAU-SOAT-CHEO.md`.
- Đổi tên kết quả thành `docs/bao-cao/M<n>-soat-cheo.md`, gửi Kiến trúc sư kèm báo cáo milestone như gợi ý cần kiểm chứng.

## 9. Cài đặt (một lần) và kiểm tra

1. Cài Antigravity CLI: https://antigravity.google/cli. Cài xong mở cửa sổ terminal mới (Windows: Git Bash; macOS: Terminal), gõ `agy --version`. Script chạy được trên cả hai: Git Bash của Windows và bash có sẵn của macOS (bản 3.2 — không cần cài bash mới).
2. Trong terminal, `cd` vào thư mục dự án, chạy `agy` tương tác: đăng nhập tài khoản Google **cá nhân** có gói AI Pro (Workspace không tính), chấp nhận tin cậy thư mục nếu được hỏi, gõ `/quit`.
3. `bash scripts/agy-run.sh kiem-tra` — phải ra `KẾT LUẬN: SẴN SÀNG`. Nếu có dòng `[X]`, sửa theo hướng dẫn trên dòng đó rồi chạy lại.
4. Không cần gõ lệnh bật: Quản lý tự chạy `kiem-tra` ngay đầu Giai đoạn 0 (trước khi lên ý tưởng) và ghi mức NHIỀU vào TASKS.md. Cài agy sau khi dự án đã chạy → gõ trong phiên: `Chuyển làn Gemini về NHIỀU.` (Quản lý sẽ `kiem-tra` rồi bật).

## 10. Sự cố thường gặp

| Hiện tượng | Nguyên nhân | Xử lý |
|---|---|---|
| `TRỐNG` (agy chạy xong nhưng không in gì) | agy cũ (lỗi không in ra stdout khi không có terminal) hoặc thư mục chưa được tin cậy | Cài lại agy bản mới nhất; chạy `agy` tương tác trong thư mục dự án, `/quit`; `kiem-tra` lại |
| `CHƯA ĐĂNG NHẬP` | Phiên đăng nhập hết hạn | `agy` tương tác, đăng nhập lại, `/quit` |
| `HẾT HẠN MỨC` / 429 ở làn Flash dù có Pro | Cửa sổ hạn mức, hoặc lỗi entitlement | Đợi; hoặc đăng xuất/đăng nhập lại. 2 lần liên tiếp → làn tự tắt, pipeline chạy tiếp không Gemini |
| `MODEL NGHỈ` ở vòng 4/5, hoặc báo cáo có "ĐÃ ĐỔI MODEL" | Argon / Sonnet qua agy hết hạn mức (hoặc không trả lời) — script đã cho model đó nghỉ | Không cần làm gì: script tự chạy Flash thay ở soát chéo/ý tưởng, bỏ vòng 4/5, tự thử lại khi hết nghỉ (mục 11). Xem: `bash scripts/agy-run.sh han-muc`; `/usage` trong agy cho thấy đã có lại → `… han-muc xoa` |
| `kiem-tra` báo `[X] Argon dạng '… --effort medium' không chạy được trong khi dạng khác chạy được` | Máy bạn không nhận effort riêng cho Argon ở dạng đó | Gõ `agy models`, chép đúng tên kèm hậu tố (vd. `gemini-4-argon-medium`) vào `GEMINI_KHO` trong `scripts/gemini.env`; không có thì đổi `EFFORT_KHO=high` |
| `kiem-tra` báo `[!] vòng 5: không thấy 'claude-sonnet-5-5'` | Tên Sonnet trên máy khác | Chép tên trong `agy models` vào `MODEL_VONG5`, hoặc gõ trong phiên "Tắt vòng 5." (không bắt buộc: vòng 5 tự bỏ qua) |
| Vòng 2–5 bị từ chối: "có file ngoài danh sách được phép: …" | Vòng trước sửa file ngoài phiếu | Hoàn tác các file đó (`git checkout -- <file>`, file mới thì xóa) hoặc thêm vào danh sách của phiếu, rồi giao lại |
| `QUÁ GIỜ` (sau khi đã gia hạn tới trần) | Phiếu quá to | Thợ Claude tiếp quản phần dở; lần sau chia phiếu nhỏ hơn |
| `ĐỨNG IM` (giao lại 2 lần vẫn im) | Luồng agy rớt, mạng, hoặc Gemini kẹt | Thợ Claude tiếp quản phần dở; 2 lần liên tiếp → làn tự tắt, chạy `kiem-tra` ở phiên sau |
| Script báo "cây làm việc chưa sạch" | Thợ Claude đang sửa dở hoặc chưa commit | Đợi thợ xong và commit, rồi gọi lại |
| Script báo "đang có lượt khác chạy" | Lượt trước chưa xong hoặc chết giữa chừng | `cho <tên>` để đợi, hoặc `huy <tên>` |

## 11. Hạn mức Argon và Sonnet qua agy — script tự xử lý

Argon (model của vòng 4, cũng dùng cho soát chéo và ý tưởng) và Sonnet vòng 5 mỗi model có hạn mức riêng: cửa sổ 5 giờ + trần tuần, tách khỏi Flash. Script nhận ra khi model trả lỗi hạn mức (429 / RESOURCE_EXHAUSTED / quota), hoặc lỗi / trả rỗng trong 3 phút đầu mà không có báo cáo cuối, rồi cho model đó **nghỉ**. Trạng thái nghỉ nằm ở `docs/gemini-out/_han-muc.meta` (git bỏ qua).

| Tình huống | Script làm gì |
|---|---|
| Cạn lần đầu (thường là hết cửa sổ 5 giờ) | Nghỉ 5 giờ rồi tự thử lại ở lượt kế |
| Cạn lại ngay sau khi hết nghỉ | Coi như hết trần tuần: nghỉ 24 giờ, cứ 24 giờ thử lại một lần (không biết chính xác giờ làm mới trần tuần, mỗi lần thử hỏng chỉ mất vài giây) |
| Model trả lời được (kể cả `kiem-tra`) | Xóa trạng thái nghỉ, dùng lại bình thường |
| Lượt `soat` / `ytuong` (và mọi làn bạn cấu hình dùng Argon) gặp Argon nghỉ hoặc cạn giữa lượt | Chạy (lại) ngay bằng `GEMINI_CODE` effort `EFFORT_CODE` (Flash high), trong cùng lượt; `ket-qua` in "ĐÃ ĐỔI MODEL"; log lỗi của Argon để riêng ở `<tên>.manh.err` |
| Vòng 4 (`kho`) / vòng 5 (`vong5`) gặp model nghỉ | Không chạy, in `MODEL NGHỈ: …` (mã thoát 4). Cạn giữa lượt → `ket-qua` trả `MODEL NGHỈ`, giữ phần dở. Quản lý bỏ vòng đó, đi tiếp chuỗi — không chạy vòng 4 bằng Flash (Flash đã hỏng 3 vòng) |
| Lỗi đăng nhập | Không phải lỗi hạn mức: không nghỉ, không đổi model — xử lý như `CHƯA ĐĂNG NHẬP` |

Phần bạn tự quyết (gõ trong phiên Claude Code):
- Argon đã dùng khoảng **70% trần tuần** (xem `/usage` trong agy) → `Ngừng dùng Argon cho vòng 4.` — phiếu nào Flash làm 3 vòng không xong sẽ sang thẳng vòng 5 (nếu bật) rồi thợ Claude; Argon chỉ còn cho soát chéo và ý tưởng. `Dùng lại Argon cho vòng 4.` để bật lại (Quản lý tự bật lại sau 7 ngày).
- Thứ tự giữ Argon khi eo hẹp: **soát chéo > ý tưởng > vòng 4**.
- Vòng 5: `Tắt vòng 5.` / `Bật vòng 5.` Đang chạy thử: Quản lý ghi kết quả từng phiếu tới vòng 5 vào `docs/BAI-HOC.md` và báo bạn sau 5 phiếu để quyết giữ hay tắt.
- Thấy trong `/usage` hạn mức đã có lại trước giờ hết nghỉ → `Argon đã có hạn mức lại.` (Quản lý chạy `bash scripts/agy-run.sh han-muc xoa`).

Đổi thời gian nghỉ (hiếm khi cần; sửa file, không gõ trong phiên): thêm dòng `HM_NGHI_NGAN_GIO=5` và/hoặc `HM_NGHI_DAI_GIO=24` (giờ) vào `scripts/gemini.env`.
