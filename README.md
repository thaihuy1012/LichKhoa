# AI Team Kit — Kiến trúc sư · Quản lý · Thợ (cho Claude Code)

Bộ cấu hình để một phiên Claude Code vận hành như một đội nhiều người, mỗi người chạy trên model khác nhau, có cổng kiểm thử, quy trình sự cố chống bế tắc, và điểm dừng hỏi bạn. Chép toàn bộ nội dung thư mục này vào thư mục gốc dự án là dùng được, không cần viết code thêm.

## 1. Đội hình

| Vai trò (tên agent) | Model | Effort | Khi nào được gọi |
|---|---|---|---|
| Kiến trúc sư `kien-truc-su` | Fable 5.1 | max | Chốt SPEC · duyệt cuối mỗi milestone (~25%) · trọng tài tranh luận · sự cố vượt tầm Quản lý · nghiệm thu cuối |
| Quản lý `quan-ly` (phiên chính) | Opus 5 | high | Luôn có mặt: chia task, chọn model, giao việc, review, mở/đóng sự cố, ghi sổ, hỏi bạn tại điểm dừng |
| Thợ `tho-sonnet` / `tho-haiku` / `tho-opus` | Sonnet 5 / Haiku 4.5 / Opus 5 | medium / – / high | Làm đúng một phiếu giao việc; được quyền phản biện |
| Kiểm thử `kiem-thu` | Sonnet 5, chỉ đọc | low | Chạy test của phiếu + test tổng; xếp loại PASS / FAIL / REGRESSION / LỖI MÔI TRƯỜNG; phát hiện sửa test |
| Sửa lỗi `sua-loi` | Sonnet 5 (sự cố S1/S2: Opus 5) | high | Chỉ khi có sự cố hoặc bug bạn báo: tái hiện bằng test thất bại → nguyên nhân gốc → sửa tối thiểu → chạy toàn bộ suite |
| Khảo sát `khao-sat` | Haiku 4.5, chỉ đọc | – | Đọc code, tra cứu, trả về tóm tắt ngắn |
| Gemini (ngoài đội, tùy chọn) | Gemini Pro/Flash qua Antigravity CLI `agy` | – | Đọc rộng, soát chéo, sinh file cơ học, code cô lập — xem `docs/LAN-GEMINI.md` |

```
Bạn ──ý tưởng / bug──▶ Quản lý (Opus, phiên chính)
                        │  hỏi/đáp bạn qua AskUserQuestion (chỉ phiên chính được hỏi)
                        ├─▶ Kiến trúc sư (Fable, max): SPEC · duyệt milestone · trọng tài · sự cố · nghiệm thu
                        ├─▶ Thợ (sonnet | haiku | opus): làm 1 phiếu → báo cáo / phản biện
                        ├─▶ Kiểm thử (sonnet, chỉ đọc): PASS / FAIL / REGRESSION / LỖI MÔI TRƯỜNG
                        ├─▶ Sửa lỗi (sonnet | opus): tái hiện → nguyên nhân gốc → sửa → toàn bộ suite
                        ├─▶ Khảo sát (haiku, chỉ đọc): tóm tắt
                        └─▶ [tùy chọn] Gemini qua scripts/agy-run.sh: đọc rộng / soát chéo / sinh file / code cô lập
```

Vì sao Quản lý là phiên chính chứ không phải Kiến trúc sư: phiên chính là nơi tốn token liên tục (mọi lượt điều phối đều đi qua nó). Đặt Opus ở đó và gọi Fable 5.1 như subagent theo từng "gói bàn giao" nhỏ, Fable chỉ tốn token đúng lúc cần suy nghĩ sâu, và mỗi lần vào việc với ngữ cảnh sạch.

## 2. Vòng đời một dự án

0. Khởi tạo — bạn gõ ý tưởng → Quản lý gọi Kiến trúc sư → tối đa 5 câu hỏi làm rõ → `docs/SPEC.md` → **ĐIỂM DỪNG 1: bạn duyệt SPEC**.
1. Lập kế hoạch — Quản lý chia 4 milestone → phiếu giao việc trong `docs/TASKS.md`, gắn model cho từng phiếu. Phiếu cuối mỗi milestone là `T-n.END` (kiểm thử tích hợp luồng chính).
2. Thực thi (tự động) — mỗi phiếu: Thợ làm → Kiểm thử chạy test của phiếu + test tổng → Quản lý review → commit local. Sai thì trả về đúng thợ đó sửa (tối đa 3 lần); quá 3 lần thì nâng bậc model; regression hoặc môi trường hỏng thì mở sự cố (mục 3).
3. Cuối mỗi milestone — Quản lý đóng gói `docs/bao-cao/M<n>.md` (+ soát chéo Gemini nếu bật) → Kiến trúc sư phán quyết DUYỆT / SỬA / DỪNG → DUYỆT thì `git tag M<n>-ok`.
4. Bàn giao — Kiến trúc sư nghiệm thu → **ĐIỂM DỪNG cuối: báo cáo cho bạn**.
5. Bảo trì — bạn báo bug sau bàn giao → phiếu `B-xxx` → `sua-loi` tái hiện bằng test thất bại rồi mới sửa → cổng kiểm thử → commit.

Trạng thái luôn nằm trên đĩa (`docs/*.md`, commit, tag), nên tắt máy rồi mở lại (`claude --agent quan-ly` hoặc `claude --continue`) vẫn tiếp tục đúng chỗ, kể cả đang dở một sự cố.

## 3. Chống bế tắc — xử lý lỗi nghiêm trọng

Ba lớp, lớp sau chỉ mở khi lớp trước chạm trần:

1. **Lỗi trong phạm vi phiếu (S3)** — vòng sửa 3 lần với đúng thợ đó → nâng bậc model (haiku → sonnet → opus) → trọng tài. Không phiếu nào tiêu quá 6 lượt thợ.
2. **Sự cố (S1/S2)** — regression, môi trường hỏng, luồng chính sập, thiết kế/SPEC sai: Quản lý ghi `docs/SU-CO.md`, đóng băng vùng lỗi, cô lập bằng git (mỗi phiếu là một commit, milestone đã duyệt có tag → revert một commit hoặc lùi về tag), rồi `sua-loi` phải tái hiện bằng test thất bại trước khi sửa, sửa xong chạy toàn bộ suite. Nguyên nhân ở SPEC/kiến trúc → Kiến trúc sư chế độ SỰ CỐ (sửa tại chỗ / lập lại phiếu / đổi SPEC / lùi).
3. **Cầu dao tổng** — 2 lượt `sua-loi` + 1 lượt Kiến trúc sư chưa đóng được · cùng sự cố mở lại lần 2 · 3 sự cố S1/S2 trong một milestone · hết hạn mức hoặc API lỗi 2 lần → hệ thống lưu trạng thái và **dừng hỏi bạn** kèm 2–3 lựa chọn. Không tồn tại vòng lặp vô hạn.

Chống lỗi "giả pass": kiểm thử độc lập (không sửa được file), test của phiếu đã DONE là khóa, sửa/skip test bị đánh dấu NGHI VẤN, báo DONE mà không chạy test là vi phạm.

Chi tiết quy trình: mục "Quy trình sự cố" trong `.claude/agents/quan-ly.md`; mức lỗi S1–S4 trong `CLAUDE.md`.

## 4. Khi nào hệ thống dừng lại hỏi bạn
Duyệt SPEC · Kiến trúc sư trả DỪNG · cầu dao tổng bật · đổi phạm vi SPEC · lùi git mất hơn một phiếu đã xong · thêm dịch vụ trả phí · xóa dữ liệu · push / deploy · bàn giao cuối. Ngoài các điểm này nó tự quyết, ghi vào `DECISIONS.md`, đi tiếp.

Phải chạy ở chế độ tương tác (terminal hoặc app), không dùng `claude -p`, vì chế độ không tương tác không hỏi được bạn. Quyền công cụ: gói Pro/Max mặc định là auto mode; nếu bị hỏi quyền quá nhiều, chạy `claude --agent quan-ly --permission-mode acceptEdits`.

## 5. Cài đặt & chạy
1. Cài Claude Code: https://docs.claude.com/en/docs/claude-code/overview
2. Tạo thư mục dự án mới, chép toàn bộ nội dung kit vào (giữ nguyên thư mục ẩn `.claude/`).
3. Trong thư mục: `git init`
4. `claude --agent quan-ly`
5. Gõ ý tưởng. Càng cụ thể (người dùng, nền tảng, thứ không cần làm) càng ít câu hỏi.

## 6. Kiểm tra model có chạy đúng không
Khi một subagent đang chạy, gõ `/tasks`: dòng của subagent ghi rõ model đang dùng. Nếu tất cả đều hiện model của phiên chính, chạy `claude update` rồi thử lại (từng có lỗi routing vào tháng 4/2026).
Nếu Claude Code báo lỗi về `effort: max`, đổi trong `.claude/agents/kien-truc-su.md` thành `xhigh` hoặc `high`.

## 7. Làn Gemini (tùy chọn, cho tài khoản Google AI Pro)
Từ 18/6/2026 Gemini CLI không còn phục vụ tài khoản AI Pro/Ultra và tài khoản miễn phí; công cụ thay thế là Antigravity CLI (lệnh `agy`), gói AI Pro được hạn mức cao hơn ở đó. Giao gì, không giao gì, cách cài và script gọi: `docs/LAN-GEMINI.md`. Gemini đọc quy tắc ở `AGENTS.md` (Claude đọc `CLAUDE.md`). Mọi việc Gemini làm vẫn qua đúng cổng `kiem-thu` → review của Quản lý.

## 8. Nâng cấp sau khi đã quen
- `isolation: worktree` trong frontmatter của thợ khi muốn nhiều thợ chạy song song mà đụng chung file.
- Agent teams (nhiều phiên phối hợp) khi dự án lớn hơn một cửa sổ ngữ cảnh.
- `memory: project` cho Kiến trúc sư để tích lũy bài học qua nhiều dự án.

## 9. Nguồn
- Claude Code subagents (frontmatter, model, effort, tools, resume, depth): https://code.claude.com/docs/en/sub-agents
- Antigravity CLI headless: https://antigravity.google/docs/cli/headless/
- Thông báo chuyển Gemini CLI → Antigravity CLI: https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli
