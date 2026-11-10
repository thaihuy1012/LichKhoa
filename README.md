# AI Team Kit v5.3 — Kiến trúc sư · Quản lý · Thợ Gemini + Thợ Claude (cho Claude Code, Windows và macOS)

Bộ cấu hình để một phiên Claude Code vận hành như một đội nhiều người, mỗi người chạy trên model khác nhau, có cổng kiểm thử, quy trình sự cố chống bế tắc, và điểm dừng hỏi bạn. Nguyên tắc (từ v4): **việc gì Gemini làm được thì giao Gemini, Claude chỉ làm việc Gemini không làm được** — để tiết kiệm token Claude; Gemini còn cùng Kiến trúc sư lên ý tưởng ban đầu. Chép toàn bộ nội dung thư mục này vào thư mục gốc dự án là dùng được, không cần viết code, không cần bật gì thêm.

**Mới trong v5.3 (10/11/2026)** — chạy được trên macOS, Windows vẫn chạy như cũ:
- `scripts/agy-run.sh` chạy bằng bash 3.2 có sẵn của macOS (không cần cài bash mới) và công cụ BSD của macOS: bỏ mảng kết hợp, `mapfile`, `$BASHPID` (cần bash 4); thay `stat -c`, `date -d`, `find -quit`, `\b` (chỉ có ở bản GNU). Bản trước trên Mac dừng ngay khi chạy; nếu có chạy được thì đo hoạt động sai — Gemini đang làm vẫn bị coi là đứng im và bị ngắt.
- `.gitignore` bỏ qua `.DS_Store` / `._*` (Finder tự tạo) — nếu không, script tưởng cây làm việc chưa sạch và từ chối giao việc cho Gemini.
- Kiến trúc sư và Gemini thiết kế theo hệ điều hành thật của máy (Quản lý dò bằng `uname -s`) thay vì mặc định Windows.
- Mục 5 có hướng dẫn cho cả Windows và macOS.

**Mới trong v5.2 (10/11/2026)** — chỉnh mức gọi model theo hạn mức của Antigravity (gói Google AI Pro): Flash (hạn mức dồi dào) làm mọi việc nhiều lượt gọi, Argon (hạn mức riêng: cửa sổ 5 giờ + trần tuần) chỉ cho việc ít lượt gọi mà giá trị cao.
- Đọc rộng (`doc`): Argon high → **Gemini 3.8 Flash high** (đọc nhiều file là nhiều lượt gọi; Flash ngữ cảnh 1M+, dư hạn mức).
- Vòng 4 nâng bậc (`kho`): Argon high → **Argon medium** (phiếu code agentic tốn lượt gọi nhất). Ý tưởng và soát chéo giữ Argon high.
- **Vòng 5 tùy chọn** (mặc định bật để chạy thử): Claude Sonnet 5.5 chạy qua agy — trừ hạn mức Claude của gói Google, không tốn token Claude Code. Chuỗi phiếu khó: Flash ×3 → Argon medium ×1 → Sonnet qua agy ×1 → thợ Claude Code. Tắt bằng câu `Tắt vòng 5.`
- **Hạn mức do script tự xử lý**: Argon/Sonnet cạn lần đầu → nghỉ 5 giờ (soát chéo/ý tưởng tự chạy Flash high, vòng 4/5 tự bỏ); cạn lại ngay sau đó → coi như hết trần tuần, thử lại mỗi 24 giờ. Argon đã dùng ~70% trần tuần thì gõ `Ngừng dùng Argon cho vòng 4.` Xem trạng thái: `bash scripts/agy-run.sh han-muc`.
- **Sửa lỗi**: vòng 2–4 của phiếu Gemini từng bị script từ chối ("cây làm việc chưa sạch" — vì phần dở của vòng trước). Nay vòng sau chạy tiếp trên phần dở khi mọi file đang sửa nằm trong danh sách được phép của phiếu.
- `kiem-tra` thử từng dạng Argon đang dùng (high, medium) và Sonnet vòng 5; không dùng Claude Opus trong agy (~10–25 lượt/5 giờ).

Dự án đang chạy bản cũ: xem mục 5.D.

**Mới trong v5.1 (21/10/2026)** — sửa lỗi effort của Quản lý: `effort: high` trong `.claude/agents/quan-ly.md` không có tác dụng khi agent chạy làm phiên chính bằng `--agent` (Claude Code chỉ lấy prompt, công cụ và model từ file agent), và Opus 5.5 mặc định chạy `medium`. Nay effort của phiên chính được đặt trong `.claude/settings.json` (`effortLevel` + `modelSettings` cho `claude-opus-5-5`) nên Quản lý chạy `high` ngay từ lúc mở. Cách kiểm tra: mục 6.

**Mới trong v5 (21/10/2026)** — chỉ đổi model, quy trình giữ nguyên:
- Gemini 4 Argon (effort high) thay Gemini 3.1 Pro ở các làn nặng suy nghĩ: lên ý tưởng cùng Fable 5.1, soát chéo, đọc rộng (v5.2: đọc rộng chuyển sang Flash).
- Phiếu code Gemini có thêm vòng 4 nâng bậc: 3 vòng Gemini 3.8 Flash không xong → 1 vòng Gemini 4 Argon làm tiếp từ phần dở → vẫn không xong mới sang thợ Claude.
- Quản lý chạy Claude Opus 5.5 (ghim `claude-opus-5-5`, effort high). Thợ Claude dùng alias `sonnet` / `haiku` / `opus`, tự trỏ về bản 5.5. Kiến trúc sư giữ Fable 5.1, effort max.
- Hạn mức Argon tính riêng theo tuần (ngoài hạn mức Flash): cạn giữa tuần thì Quản lý tự chuyển các làn Argon sang Flash tới tuần sau, không tắt làn (v5.2: thay bằng cơ chế nghỉ 5 giờ / 24 giờ do script tự làm).
- Mọi model Gemini nằm ở `scripts/gemini.env`; `kiem-tra` kiểm tra luôn slug Argon.

## 1. Đội hình

| Vai trò (tên agent) | Model | Effort | Khi nào được gọi |
|---|---|---|---|
| Kiến trúc sư `kien-truc-su` | Fable 5.1 | max | Lên ý tưởng cùng Gemini 4 Argon và quyết bản cuối · chốt SPEC · duyệt cuối mỗi milestone (~25%) · trọng tài · sự cố vượt tầm Quản lý · nghiệm thu cuối |
| Quản lý `quan-ly` (phiên chính) | Claude Opus 5.5 (ghim `claude-opus-5-5`) | high (đặt trong `.claude/settings.json`) | Luôn có mặt: chia task, chọn thợ, giao việc, review, mở/đóng sự cố, ghi sổ, hỏi bạn tại điểm dừng |
| Thợ Claude `tho-sonnet` / `tho-haiku` / `tho-opus` | Sonnet 5.5 / Haiku 5.5 / Opus 5.5 | medium / – / high | Chỉ nhận việc Gemini không làm được: phiếu Gemini bó tay (tiếp quản phần dở), phiếu cần trao đổi qua lại, mọi phiếu khi làn Gemini tắt |
| Thợ Gemini `tho-gemini` | Claude Haiku 5.5 làm người liên lạc → qua Antigravity CLI `agy`: Gemini 3.8 Flash (viết code, sinh file, đọc rộng) / Gemini 4 Argon (ý tưởng, soát chéo; vòng 4 nâng bậc của phiếu code) / Claude Sonnet 5.5 (vòng 5, tùy chọn) | low (liên lạc) / theo làn trong `scripts/gemini.env` (Flash high, sinh file low; Argon high, vòng 4 medium; Sonnet medium) | Mặc định cho mọi phiếu có lệnh kiểm tra + danh sách file, sinh file, khảo sát, soát chéo, lên ý tưởng — `docs/LAN-GEMINI.md` |
| Kiểm thử `kiem-thu` | Sonnet 5.5, chỉ đọc | low | Chạy test của phiếu + test tổng; xếp loại PASS / FAIL / REGRESSION / LỖI MÔI TRƯỜNG; phát hiện sửa test |
| Sửa lỗi `sua-loi` | Sonnet 5.5 (sự cố S1/S2: Opus 5.5) | high | Chỉ khi có sự cố hoặc bug bạn báo: tái hiện bằng test thất bại → nguyên nhân gốc → sửa tối thiểu → chạy toàn bộ suite |
| Khảo sát `khao-sat` | Haiku 5.5, chỉ đọc | – | Đọc code, tra cứu, trả về tóm tắt ngắn |

```
Bạn ──ý tưởng / bug──▶ Quản lý (Opus 5.5, phiên chính)
                        │  hỏi/đáp bạn qua AskUserQuestion (chỉ phiên chính được hỏi)
                        ├─▶ Kiến trúc sư (Fable, max): SPEC · duyệt milestone · trọng tài · sự cố · nghiệm thu
                        ├─▶ Thợ Gemini (haiku liên lạc → agy: Flash làm, Argon nâng bậc / soát / ý tưởng, Sonnet vòng 5): mặc định cho mọi phiếu → báo cáo
                        ├─▶ Thợ Claude (sonnet | haiku | opus): việc Gemini không làm được → báo cáo / phản biện
                        ├─▶ Kiểm thử (sonnet, chỉ đọc): PASS / FAIL / REGRESSION / LỖI MÔI TRƯỜNG
                        ├─▶ Sửa lỗi (sonnet | opus): tái hiện → nguyên nhân gốc → sửa → toàn bộ suite
                        └─▶ Khảo sát (haiku, chỉ đọc): tóm tắt
```

Vì sao Quản lý là phiên chính chứ không phải Kiến trúc sư: phiên chính là nơi tốn token liên tục (mọi lượt điều phối đều đi qua nó). Đặt Opus ở đó và gọi Fable 5.1 như subagent theo từng "gói bàn giao" nhỏ, Fable chỉ tốn token đúng lúc cần suy nghĩ sâu, và mỗi lần vào việc với ngữ cảnh sạch.

Vì sao Gemini đi qua một subagent Haiku: subagent của Claude Code chỉ chạy được model Claude, còn Gemini chạy ngoài qua lệnh `agy`. `tho-gemini` là người liên lạc rẻ: viết prompt theo mẫu, chạy `agy` ở nền, đợi, trả báo cáo — Quản lý không tốn token Opus cho việc chờ. Model Gemini thật do `scripts/gemini.env` chọn.

## 2. Vòng đời một dự án

0. Khởi tạo — bạn gõ ý tưởng → Quản lý kiểm tra làn Gemini (`kiem-tra`, tự bật) → Gemini 4 Argon viết bản ý tưởng, Kiến trúc sư viết bản riêng rồi nhận xét bản Gemini, Gemini phản biện lại, Kiến trúc sư viết bản hợp nhất (`docs/y-tuong/`) → tối đa 5 câu hỏi làm rõ → `docs/SPEC.md` → **ĐIỂM DỪNG 1: bạn duyệt SPEC**.
1. Lập kế hoạch — Quản lý chia 4 milestone → phiếu giao việc trong `docs/TASKS.md`, viết phiếu sao cho Gemini làm được (lệnh kiểm tra + danh sách file). Phiếu cuối mỗi milestone là `T-n.END` (kiểm thử tích hợp luồng chính).
2. Thực thi (tự động) — mỗi phiếu: Gemini làm (Claude chỉ khi Gemini không làm được) → Kiểm thử chạy test của phiếu + test tổng → Quản lý review → commit local. Sai thì trả về đúng thợ đó sửa (Gemini tối đa 5 vòng qua agy, làm tiếp trên phần dở — 3 vòng Flash, vòng 4 Argon medium, vòng 5 Sonnet qua agy — rồi thợ Claude tiếp quản phần dở; Claude tối đa 3 lần rồi nâng bậc); regression hoặc môi trường hỏng thì mở sự cố (mục 3). Trong lúc Gemini chạy, script tự canh: đứng im 10 phút thì giao lại, hết giờ mà đang làm đúng hướng thì gia hạn tới trần, hết trần thì giữ kết quả dở.
3. Cuối mỗi milestone — Quản lý đóng gói `docs/bao-cao/M<n>.md` + soát chéo Gemini (bắt buộc khi làn bật) → Kiến trúc sư phán quyết DUYỆT / SỬA / DỪNG → DUYỆT thì `git tag M<n>-ok`.
4. Bàn giao — Kiến trúc sư nghiệm thu → **ĐIỂM DỪNG cuối: báo cáo cho bạn**.
5. Bảo trì — bạn báo bug sau bàn giao → phiếu `B-xxx` → `sua-loi` tái hiện bằng test thất bại rồi mới sửa → cổng kiểm thử → commit.

Trạng thái luôn nằm trên đĩa (`docs/*.md`, commit, tag), nên tắt máy rồi mở lại (`claude --agent quan-ly` hoặc `claude --continue`) vẫn tiếp tục đúng chỗ, kể cả đang dở một sự cố hay một lượt Gemini.

## 3. Chống bế tắc — xử lý lỗi nghiêm trọng

Ba lớp, lớp sau chỉ mở khi lớp trước chạm trần:

1. **Lỗi trong phạm vi phiếu (S3)** — vòng sửa 3 lần với đúng thợ đó → nâng bậc model (haiku → sonnet → opus; Gemini Flash → Gemini Argon → Sonnet qua agy → sonnet) → trọng tài. Không phiếu nào tiêu quá 6 lượt thợ Claude.
2. **Sự cố (S1/S2)** — regression, môi trường hỏng, luồng chính sập, thiết kế/SPEC sai: Quản lý ghi `docs/SU-CO.md`, đóng băng vùng lỗi, cô lập bằng git (mỗi phiếu là một commit, milestone đã duyệt có tag → revert một commit hoặc lùi về tag), rồi `sua-loi` phải tái hiện bằng test thất bại trước khi sửa, sửa xong chạy toàn bộ suite. Nguyên nhân ở SPEC/kiến trúc → Kiến trúc sư chế độ SỰ CỐ (sửa tại chỗ / lập lại phiếu / đổi SPEC / lùi).
3. **Cầu dao tổng** — 2 lượt `sua-loi` + 1 lượt Kiến trúc sư chưa đóng được · cùng sự cố mở lại lần 2 · 3 sự cố S1/S2 trong một milestone · hết hạn mức hoặc API lỗi 2 lần → hệ thống lưu trạng thái và **dừng hỏi bạn** kèm 2–3 lựa chọn. Không tồn tại vòng lặp vô hạn.

Chống lỗi "giả pass": kiểm thử độc lập (không sửa được file), test của phiếu đã DONE là khóa, sửa/skip test bị đánh dấu NGHI VẤN, báo DONE mà không chạy test là vi phạm. Làn Gemini có cầu dao riêng: lỗi 2 lần liên tiếp → tự tắt tới hết phiên; 2 phiếu liên tiếp không xong → tự hạ mức; mỗi lượt có trần giờ tuyệt đối (code 60 phút), hết trần thì giữ kết quả dở cho Claude tiếp quản chứ không vứt; Argon hay Sonnet qua agy hết hạn mức không làm tắt làn — script cho model đó nghỉ rồi tự thử lại.

Chi tiết quy trình: mục "Quy trình sự cố" và "Làn Gemini" trong `.claude/agents/quan-ly.md`; mức lỗi S1–S4 trong `CLAUDE.md`.

## 4. Khi nào hệ thống dừng lại hỏi bạn
Duyệt SPEC · Kiến trúc sư trả DỪNG · cầu dao tổng bật · đổi phạm vi SPEC · lùi git mất hơn một phiếu đã xong · thêm dịch vụ trả phí · xóa dữ liệu · push / deploy · bàn giao cuối. Ngoài các điểm này nó tự quyết, ghi vào `DECISIONS.md`, đi tiếp. Làn Gemini bật/tắt/hạ mức tự động, chỉ báo cho bạn một câu, không hỏi.

Phải chạy ở chế độ tương tác (terminal hoặc app), không dùng `claude -p`, vì chế độ không tương tác không hỏi được bạn. Quyền công cụ: gói Pro/Max mặc định là auto mode; nếu bị hỏi quyền quá nhiều, chạy `claude --agent quan-ly --permission-mode acceptEdits`.

## 5. Cài đặt & chạy

"Terminal" dưới đây là Git Bash trên Windows, ứng dụng Terminal trên macOS. macOS không cần cài bash mới: script chạy bằng bash có sẵn.

**A. Nền (một lần cho máy)**
1. Node.js LTS: https://nodejs.org (macOS: bản .pkg, hoặc `brew install node`). Git — Windows: Git for Windows (có Git Bash) https://git-scm.com/download/win · macOS: gõ `git --version` trong Terminal, máy tự đề nghị cài Command Line Tools → Install.
2. Claude Code: https://docs.claude.com/en/docs/claude-code/overview — chạy `claude` một lần để đăng nhập, rồi `/exit`.
3. Chỉ Windows: nếu Claude Code báo không có Bash hoặc dùng PowerShell, đặt biến môi trường người dùng `CLAUDE_CODE_GIT_BASH_PATH` trỏ tới `bash.exe` trong thư mục `usr\bin` của Git (ví dụ `E:\Git\usr\bin\bash.exe`), đóng mọi terminal, mở lại.
4. Antigravity CLI (cho làn Gemini): https://antigravity.google/cli — mở cửa sổ Terminal mới, `agy --version` phải chạy. Không cài thì pipeline vẫn chạy đủ, chỉ không có Gemini.

**B. Dự án mới**
5. Tạo thư mục trống, chép toàn bộ nội dung kit vào, kể cả thư mục ẩn `.claude/` và file `.gitignore`. Windows: bật View → Hidden items để thấy. macOS: Finder ẩn file bắt đầu bằng dấu chấm (Cmd+Shift+. để hiện) — chắc nhất là chép bằng Terminal: `cp -R <thư mục ai-team-kit>/. <thư mục dự án>/`.
6. Terminal tại thư mục đó: `git init && git add -A && git commit -m "khoi tao ai-team-kit"`.
7. Nếu có agy: gõ `agy`, đăng nhập tài khoản Google cá nhân có gói AI Pro (Workspace không tính), chấp nhận tin cậy thư mục, gõ `/quit`. Rồi `bash scripts/agy-run.sh kiem-tra` → phải thấy `KẾT LUẬN: SẴN SÀNG`. Dòng `[X]` về `gemini-4-argon` nghĩa là máy bạn đặt tên slug Argon khác: `kiem-tra` in luôn tên có trên máy — mở `scripts/gemini.env` (Windows: Notepad; macOS: `nano scripts/gemini.env`, sửa xong Ctrl+O, Enter để lưu, Ctrl+X để thoát — đừng dùng TextEdit vì nó có thể đổi dấu nháy, làm hỏng file), thay `gemini-4-argon` bằng tên đó (các dòng KHO, SOAT, YTUONG), lưu, chạy lại `kiem-tra`. Dòng `[!] vòng 5` (tên Sonnet khác) làm tương tự với dòng `MODEL_VONG5`, hoặc bỏ qua — vòng 5 tự bỏ, làn vẫn chạy. `kiem-tra` báo đã ghi `AGY_FORMAT=…` (hoặc bạn đã sửa `gemini.env`) → commit lại: `git add -A && git commit -m "kiem-tra"` (Gemini chỉ chạy khi cây làm việc sạch).

**C. Chạy**
8. `claude --agent quan-ly` (mở từ Terminal trong thư mục dự án). Được hỏi tin cậy thư mục → chọn có. Góc dưới phải phải hiện `high · /effort`; nếu là `medium`, xem mục 6.
9. Gõ ý tưởng bằng tiếng Việt: app làm gì, ai dùng, chạy trên nền nào, thứ **không** cần làm ở bản đầu. Trả lời tối đa 5 câu hỏi của Kiến trúc sư, đọc tóm tắt SPEC, chọn Duyệt. Từ đây hệ thống tự chạy, kể cả làn Gemini.
10. Chỉ quay lại khi được hỏi hoặc khi nhận báo cáo bàn giao. Tắt máy giữa chừng: mở lại bước 8, gõ `tiếp tục`.

**D. Nâng cấp dự án đang chạy bản v5 / v5.1 / v5.2** (giữ nguyên code, sổ sách, lịch sử git)
11. Đợi lượt đang chạy xong (hoặc Quản lý báo chờ), gõ `/exit`.
12. Chép đè từ kit v5.3 vào thư mục dự án đúng 11 file: `scripts/agy-run.sh`, `scripts/gemini.env`, `.claude/agents/quan-ly.md`, `.claude/agents/tho-gemini.md`, `.claude/agents/kien-truc-su.md`, `CLAUDE.md`, `AGENTS.md`, `docs/LAN-GEMINI.md`, `docs/tasks/_MAU-CODE.md`, `docs/tasks/_MAU-Y-TUONG.md`, `README.md`. Không chép `docs/TASKS.md`, `docs/SPEC.md`, các sổ khác và `.gitignore` (`.gitignore` của dự án đã có thêm dòng theo stack).
13. Chỉ macOS: thêm hai dòng vào cuối `.gitignore` của dự án — trong Terminal: `printf '.DS_Store\n._*\n' >> .gitignore`.
14. Terminal trong thư mục dự án: `bash scripts/agy-run.sh kiem-tra` → `KẾT LUẬN: SẴN SÀNG` (máy chạy dạng text thì script tự ghi lại `AGY_FORMAT=text`).
15. `git add -A && git commit -m "nang cap ai-team-kit v5.3"`.
16. `claude --agent quan-ly`, gõ `tiếp tục`. Quản lý tự thêm hai dòng "Vòng 4 Argon" và "Vòng 5 Sonnet qua agy" vào `docs/TASKS.md` nếu chưa có.

## 6. Kiểm tra model và effort có chạy đúng không

Model và effort của mỗi vai trò đến từ hai chỗ khác nhau — biết chỗ nào để nhìn đúng chỗ:

| Vai trò | Model lấy từ | Effort lấy từ | Xem ở đâu |
|---|---|---|---|
| Quản lý (phiên chính, chạy bằng `--agent`) | `model:` trong `quan-ly.md` | `.claude/settings.json` (`modelSettings` → `claude-opus-5-5` → `high`; `effortLevel: high` cho mọi model khác). Dòng `effort:` trong `quan-ly.md` **không** áp dụng cho phiên chính | Thanh trạng thái góc dưới phải: `high · /effort`; hoặc `/status` (chỉ hiện phiên chính) |
| Kiến trúc sư, thợ, kiểm thử… (subagent) | `model:` trong file agent | `effort:` trong file agent (ghi đè mức của phiên chính; Kiến trúc sư = `max`) | `/tasks` trong lúc subagent đang chạy: dòng của nó ghi model và effort |

- Menu `/model` chỉ hiện model của phiên chính và **effort mặc định của từng model** (Opus 5.5 → medium, Fable 5.1 → high). Nó không đọc file agent và không hiện subagent. Bấm Esc để thoát; bấm Enter ở menu này sẽ ghi lựa chọn đang hiện làm mặc định cho máy bạn.
- Quản lý hiện `medium`: gõ `/effort high` rồi Enter (lưu `high` cho Opus 5.5 trên máy này), rồi kiểm tra `.claude/settings.json` còn khối `modelSettings` như trong kit không.
- `/tasks` hiện tất cả subagent cùng model với phiên chính: chạy `claude update` rồi thử lại (từng có lỗi routing vào tháng 4/2026).
- Claude Code báo lỗi về `effort: max`, hoặc `/tasks` hiện Kiến trúc sư ở `high` dù file ghi `max`: Fable trên tài khoản bạn không có mức `max` → đổi trong `.claude/agents/kien-truc-su.md` thành `xhigh`; `xhigh` cũng không có thì để `high` — đó là mức cao nhất Claude Code cho phép.
- Claude Code từ chối tên model `claude-opus-5-5` trong `.claude/agents/quan-ly.md`: đổi thành `opus` (alias trỏ về Opus mới nhất, hiện là 5.5); `effortLevel: high` trong `settings.json` vẫn giữ effort `high`.

## 7. Làn Gemini (tự bật)
- Quản lý tự chạy `kiem-tra` ngay đầu dự án và ghi mức vào dòng "Làn Gemini" trong `docs/TASKS.md`: `NHIỀU` (mặc định khi sẵn sàng — Gemini trước cho mọi phiếu, Claude chỉ làm việc Gemini không làm được), `VỪA` (chỉ module mới, sinh file, soát chéo, đọc rộng, ý tưởng), `TẮT`.
- Đổi mức bất cứ lúc nào bằng cách gõ trong phiên: `Chuyển làn Gemini về VỪA.` / `Tắt làn Gemini.` / `Chuyển làn Gemini về NHIỀU.`
- Model theo làn ở `scripts/gemini.env`: viết code và đọc rộng `gemini-3.8-flash` high · sinh file `gemini-3.8-flash` low · ý tưởng và soát chéo `gemini-4-argon` high · vòng 4 nâng bậc (`kho`) `gemini-4-argon` medium · vòng 5 (`vong5`) `claude-sonnet-5-5` medium qua agy. Ghi tên gốc + effort riêng (effort là thanh chọn riêng trong agy); menu `/model` trong agy chỉ áp dụng khi bạn gõ tay, pipeline chạy theo file này. Tên model đổi → sửa file (Windows: Notepad; macOS: `nano`) cho khớp `agy models`; `kiem-tra` báo `[X]` kèm dòng cần sửa. Không dùng Claude Opus trong agy; GPT-OSS 120B chỉ là dự phòng tay (`docs/LAN-GEMINI.md` mục 1).
- Hạn mức Argon và Sonnet qua agy (riêng với Flash) do script tự xử lý: cạn lần đầu → nghỉ 5 giờ, soát chéo/ý tưởng tự chạy Flash high, vòng 4/5 tự bỏ; cạn lại ngay sau đó → coi như hết trần tuần, thử lại mỗi 24 giờ. Quản lý báo bạn một câu, không tắt làn. Xem: `bash scripts/agy-run.sh han-muc`; hạn mức thật: `/usage` trong `agy`.
- Câu bạn gõ trong phiên: `Ngừng dùng Argon cho vòng 4.` (khi `/usage` cho thấy Argon đã dùng ~70% trần tuần; tự bật lại sau 7 ngày) · `Dùng lại Argon cho vòng 4.` · `Tắt vòng 5.` / `Bật vòng 5.` · `Argon đã có hạn mức lại.` Thứ tự giữ Argon khi eo hẹp: soát chéo > ý tưởng > vòng 4. Vòng 5 đang chạy thử: sau 5 phiếu tới vòng 5, Quản lý báo bạn tỉ lệ PASS để quyết giữ hay tắt.
- Canh tiến độ tự động: cứ 20 giây đo hoạt động; đứng im 10 phút → giao lại (giữ phần đã làm, tối đa 2 lần); tới giới hạn giờ mà đang làm đúng hướng → gia hạn +15 phút tới trần; hết trần → giữ kết quả dở cho thợ Claude tiếp quản. Bạn không cần canh.
- Kết quả Gemini ở `docs/gemini-out/<mã phiếu>.md`; prompt ở `docs/tasks/`; các bản ý tưởng ở `docs/y-tuong/`. Mọi thứ Gemini làm vẫn qua `kiem-thu` → review → commit. Chi tiết, sự cố thường gặp: `docs/LAN-GEMINI.md`.

## 8. Nâng cấp sau khi đã quen
- `isolation: worktree` trong frontmatter của thợ khi muốn nhiều thợ chạy song song mà đụng chung file.
- Agent teams (nhiều phiên phối hợp) khi dự án lớn hơn một cửa sổ ngữ cảnh.
- `memory: project` cho Kiến trúc sư để tích lũy bài học qua nhiều dự án.

## 9. Nguồn
- Claude Code subagents (frontmatter, model, effort, tools, resume, depth): https://code.claude.com/docs/en/sub-agents
- Claude Code effort (mặc định theo model, `effortLevel`, `modelSettings`, `/effort`): https://code.claude.com/docs/en/model-config — tham chiếu settings: https://code.claude.com/docs/en/settings-reference
- Antigravity CLI: https://antigravity.google/docs/cli — headless: https://antigravity.google/docs/cli/headless/
- Thông báo chuyển Gemini CLI → Antigravity CLI: https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli
- Gemini 4 Argon trong Antigravity cho AI Pro (hạn mức tuần riêng): https://9to5google.com/?p=733502 — điểm chuẩn: https://www.online-tech-tips.com/gemini-4-argon-plans-benchmarks-antigravity-rollout/
