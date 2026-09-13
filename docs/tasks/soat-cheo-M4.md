SOÁT CHÉO — chỉ đọc, không tạo/sửa file nào.

Đọc: docs/SPEC.md (v1.3 — §3 IN-3, IN-6, IN-7; §5; §6 M4; §8 rủi ro 2, 3, 6, 9; §10), docs/bao-cao/M4.md, docs/bao-cao/M4.diff (diff M3-ok..HEAD), docs/HUONG-DAN.md. Được mở thêm file trong src/ hoặc tests/ để kiểm chứng (đặc biệt src/render/background.ts, src/render/wallpaper.ts, src/export/share.ts, src/ui/screens/{Design,Preview,Guide,Sync}.tsx, src/storage/db.ts, src/ui/App.tsx, .github/workflows/pages.yml, scripts/size.mjs).

Nhiệm vụ: tìm lỗi đội Claude có thể bỏ sót trong M4. Ưu tiên:
- Ảnh nền: EXIF/hướng ảnh (createImageBitmap imageOrientation), fallback <img> trên Safari, rò bộ nhớ (ImageBitmap.close, revokeObjectURL), ảnh rất lớn trên iOS (giới hạn canvas ~16.7M pixel), cover-fit/blur/dim sai toán, ảnh PNG trong suốt.
- Clipboard + Shortcut trên Safari iOS: user activation (await trước clipboard.write), ClipboardItem với Promise, `shortcuts://run-shortcut?name=…&input=clipboard` encode, fallback khi lỗi.
- IndexedDB lưu ảnh (ArrayBuffer), backup JSON có/không kèm ảnh, xóa dữ liệu có xóa ảnh không.
- Service worker / offline / cập nhật phiên bản (bản cũ kẹt cache?), manifest scope/start_url với VITE_BASE GitHub Pages.
- Workflow GitHub Pages: đúng action, quyền, base path; size.mjs đếm đúng.
- HUONG-DAN.md: bước sai với iOS 17/18 thực tế (tên menu, "Set Wallpaper" action, Google Cloud Console), thiếu bước khiến người không chuyên kẹt.
- Test "giả qua": assert lỏng, skip không chính đáng.

Khung trả lời (tiếng Việt, tối đa 10 vấn đề, sắp theo mức nặng):
### <số>. [S1|S2|S3|S4] <tiêu đề ngắn>
- Vị trí: <file>:<dòng>
- Tái hiện: <input cụ thể / bước> → <kết quả sai> (mong đợi: <…>)
- Vì sao sai: <1–2 câu, dẫn SPEC mục nào nếu có>
Không khen, không viết lại code, không đề xuất tính năng mới. Không chắc thì ghi "(nghi vấn)". Nếu không tìm được vấn đề S1–S3 nào, nói rõ.
