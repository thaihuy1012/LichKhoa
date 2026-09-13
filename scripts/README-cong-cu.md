# Công cụ ảnh mẫu và chụp

Công cụ hỗ trợ dựng ảnh mẫu và chụp màn hình cho review.

## Chuẩn bị

```sh
npm run build
```

## `mau-anh.cjs` — Dựng 18 ảnh + 3 tấm tổng hợp

Dựng ảnh mẫu từ state mẫu: 3 bố cục (month/agenda/todo) × 2 showNote (true/false) × 3 số mục (0/2/15).
Tạo 18 PNG + 3 tấm tổng hợp (tong-month/agenda/todo.png).

```sh
node scripts/mau-anh.cjs <thư-mục-ra> [--port 4190]
```

**Tham số**:
- `<thư-mục-ra>`: Thư mục lưu ảnh ra.
- `--port N` (tùy chọn): Cổng vite preview (mặc định 4190).

## `chup.cjs` — Chụp tab Sự kiện hoặc Preview

Chụp 6 ảnh tab Sự kiện hoặc 3 ảnh tab Preview trên webkit iPhone 13 Pro Max.

```sh
node scripts/chup.cjs events <thư-mục-ra> [--port 4191]
node scripts/chup.cjs preview <thư-mục-ra> [--lang en] [--port 4191]
```

**Tham số**:
- `<mode>`: `events` (tab Sự kiện, 6 ảnh) hoặc `preview` (tab Preview, 3 ảnh).
- `<thư-mục-ra>`: Thư mục lưu ảnh.
- `--lang en` (tùy chọn, chỉ preview): Ngôn ngữ tiếng Anh (mặc định vi).
- `--port N` (tùy chọn): Cổng vite preview (mặc định 4191).

## `cat-anh.cjs` — Cắt/phóng ảnh

Cắt vùng từ ảnh PNG và tùy chọn phóng to.

```sh
node scripts/cat-anh.cjs <vào.png> <ra.png> <x> <y> <w> <h> [phóng]
```

**Tham số**:
- `<vào.png>`: Ảnh nguồn.
- `<ra.png>`: Ảnh ra.
- `<x> <y> <w> <h>`: Vị trí (x, y) và kích thước (w, h) vùng cắt.
- `[phóng]` (tùy chọn): Hệ số phóng (mặc định 1).
