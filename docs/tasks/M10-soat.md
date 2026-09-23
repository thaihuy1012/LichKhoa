SOÁT CHÉO — làn soat — CHỈ ĐỌC, KHÔNG TẠO/SỬA BẤT KỲ FILE NÀO
# Soát chéo M10 — Cài bộ Phím tắt bằng link iCloud (SPEC v1.11, D-037)

## Đọc
docs/SPEC.md §6 M10 (dòng 167–169, 175–176, 185–189), §3 IN-14 (dòng 45, 186–188), §5 (dòng 163–164), §8.13 (dòng 134–151), §10.G (dòng 71–117); docs/HUONG-DAN.md §F (dòng 27–70), §G (dòng 71–124); git diff c461a39..HEAD (B-018, B-020, T-10.1–T-10.3, T-10.END): public/shortcut-links.json, src/export/install.ts, src/ui/screens/Guide.tsx, tests/unit/install.test.ts, tests/e2e/m10-install.spec.ts, docs/HUONG-DAN.md.

## Yêu cầu
Soát chéo liệt kê tối đa 10 vấn đề, xếp theo mức S1–S4. Mỗi vấn đề: mức · file:dòng · cách tái hiện · vì sao sai · gợi ý sửa.

Điểm soát cụ thể:

1. **Khớp SPEC**:
   - `shortcut-links.json` chỉ chứa 5 key (wallpaper, alarm, reminder, dayAlarm, morning); mỗi url phải khớp regex `https://www.icloud.com/shortcuts/[0-9a-f]{32}` hoặc rỗng `""`.
   - `parseShortcutLinks` không ném; url sai → `null`; hệ thống vẫn hoạt động với dòng `sc-nolink` (không lỗi vàng).
   - Nút "Tải" là `<a>` HTML thuần, không JS; `target="_blank" rel="noopener noreferrer"` để mở ở trình duyệt trong-app hoặc thẳng app Phím tắt.
   - Thẻ Hướng dẫn số 2 `guide-card-installShortcuts` hiện **ngay sau** thẻ cài Màn hình chính; thẻ cũ 2–8 → thẻ 3–9 (chỉ đổi i18n, key và testid giữ nguyên).
   - Dòng `sc-updated` khi có trường `updated` hợp lệ (YYYY-MM-DD); không hiện URL dạng chữ.
   - Cảnh báo lệch tên `sc-name-mismatch-<kind>` cho 4 kind có tên trong `AppState` (wallpaper, alarm, reminder, dayAlarm; không có cho morning).
   - Danh sách "Việc còn phải tự làm" 4 điểm cố định (tạo `BaoThuc`, Tự động hóa 00:05, Nhạy cảm thời gian, tên trùng).

2. **Xử lý lỗi & fetch**:
   - `Guide.tsx` fetch với `cache: 'no-cache'`; không precache trong SW (generateSW chỉ gom js/css/html).
   - Không tải được JSON (offline, 404, hỏng) → dòng `sc-links-error` + 5 hàng nolink; không ném lỗi, thẻ không trắng.
   - `fetch` bắt Lỗi gì? Timeout? Có `fallback` không? Lỗi hiển thị hàng Việt/Anh không?

3. **I18n & chữ**:
   - 5 key i18n: `guide.installShortcuts.name.<kind>`, `guide.installShortcuts.purpose.<kind>`, `guide.installShortcuts.loadBtn`, `guide.installShortcuts.noLink`, `guide.installShortcuts.error`, `guide.installShortcuts.updated`, `guide.installShortcuts.nameMismatch.<kind>` (4 kind), `guide.installShortcuts.manualSteps` (4 item).
   - Văn bản khóa trong code (tên Phím tắt mặc định, thứ tự kind) → có hằng số cũ không sửa?

4. **Bảo mật**:
   - `shortcut-links.json` không chứa link thật hay email Chủ dự án.
   - Không hiện URL dạng chữ → chỉ href trong nút.
   - Link phải là `https://www.icloud.com/shortcuts/<32 hex>` — không chấp nhận http, localhost, domain khác.

5. **Bố cục 428 pt (iPhone 13 Pro Max)**:
   - Nút `<a>` chiều cao ≥ 44 pt (vùng chạm iOS).
   - 5 hàng có số thứ tự, tên (mono), công dụng, nút/nolink → có bị ngắt dòng hay ẩn trên 428 pt không?
   - Thẻ 2 (cài Màn hình chính) là thẻ cũ 1 → có lùi hay bị đẩy không?

6. **A11y**:
   - Nút: `aria-label`, `role`, tiêu đề hợp lý?
   - Màu/tương phản khi nút disabled (url rỗng)?
   - Nút "nhấn giữ = sao chép link" — có tooltip không? Chỉ HTML `<a>` không thể bắt `long-press` → OK hay cần JS?

7. **Test Unit (install.test.ts)**:
   - Kịch bản (1) URL khớp regex.
   - (2) URL sai format (http, localhost, domain khác, hex < 32, hex > 32) → `null`.
   - (3) URL rỗng → giữ nguyên `null` hay `""`?
   - (4) Thứ tự kind (wallpaper · alarm · reminder · dayAlarm · morning).
   - (5) JSON thiếu key → `null` hay mặc định?
   - (6) `updated` field (ngày hợp lệ vs sai) → có lỗi không?

8. **Test E2E (m10-install.spec.ts)**:
   - Kịch bản (1) hiện 5 nút "Tải" khi link hợp lệ.
   - (2) hiện 5 dòng nolink khi url rỗng.
   - (3) hiện `sc-links-error` khi JSON 404.
   - (4) nút bấm được (href + target="_blank").
   - (5) thẻ số 2 ở đúng vị trí (sau thẻ cài Màn hình chính).
   - (6) cảnh báo lệch tên khi `state[SHORTCUT_STATE_KEY[kind]] !== SHORTCUT_DEFAULT_NAMES[kind]`.
   - (7) bố cục 428pt (không ngắt, nút không ẩn, vùng chạm đủ).
   - (8) i18n đúng (thay đổi ngôn ngữ vẫn hiện đầy đủ).
   - Test dùng dữ liệu mẫu bịa (không URL thật, không tên thật), chạy trên headless không?

9. **Tử tế**:
   - Cảnh báo lệch tên chỉ đọc state, không dispatch hay sửa → logic đúng?
   - Link cũ không ở `AppState` / JSON sao lưu (chỉ file tĩnh).
   - `ICLOUD_SHORTCUT_URL` regex hay string so sánh?
   - `SHORTCUT_STATE_KEY` & `SHORTCUT_DEFAULT_NAMES` định nghĩa rõ ở đâu?

10. **Có dữ liệu riêng lộ không?**
   - `public/shortcut-links.json` có link thật, tên Chủ dự án, email không?
   - Test fixture / mock URL phải là mẫu bịa.

## BÁO CÁO CUỐI
KẾT QUẢ: XONG | KHÔNG XONG
SỐ VẤN ĐỀ: S1=? S2=? S3=? S4=?
<liệt kê vấn đề nếu có>
