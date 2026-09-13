#!/usr/bin/env bash
# Gọi Antigravity CLI (agy) từ pipeline — xem docs/LAN-GEMINI.md
# Cách dùng: bash scripts/agy-run.sh <doc|soat|sinh|code> <file-prompt.md> [model-slug]
set -u
mode="${1:-}"; prompt_file="${2:-}"; model="${3:-}"
case "$mode" in doc|soat|sinh|code) ;; *) echo "Cách dùng: agy-run.sh <doc|soat|sinh|code> <file-prompt.md> [model-slug]"; exit 42;; esac
[ -f "$prompt_file" ] || { echo "Không thấy file prompt: $prompt_file"; exit 42; }
command -v agy >/dev/null 2>&1 || { echo "Chưa cài agy (Antigravity CLI) hoặc chưa có trong PATH"; exit 127; }

excl=(':!docs/gemini-out' ':!docs/tasks')
if [ -n "$(git status --porcelain --untracked-files=all -- . "${excl[@]}")" ]; then
  echo "Cây làm việc chưa sạch — commit hoặc chờ thợ xong rồi mới gọi Gemini."; exit 1
fi

mkdir -p docs/gemini-out
name=$(basename "$prompt_file" .md)
out="docs/gemini-out/$name.md"; err="docs/gemini-out/$name.err"
args=(-p "$(cat "$prompt_file")" --print-timeout 15m)
# agy headless không tự coi thư mục hiện tại là workspace → read_file bị từ chối; phải --add-dir (D-009)
args+=(--add-dir "$(pwd -W 2>/dev/null || pwd)")
# Thư mục ngoài repo cần đọc (vd. tài liệu tham khảo): AGY_ADD_DIRS="F:/LICH_NEN" — cách nhau bằng dấu cách, không chứa dấu cách
for d in ${AGY_ADD_DIRS:-}; do args+=(--add-dir "$d"); done
# Làn ghi: tự duyệt sửa file; lệnh shell vẫn bị từ chối (không dùng --dangerously-skip-permissions)
{ [ "$mode" = "sinh" ] || [ "$mode" = "code" ]; } && args+=(--mode accept-edits)
[ -n "$model" ] && args+=(--model "$model")

agy "${args[@]}" >"$out" 2>"$err"; code=$?
changed=$(git status --porcelain --untracked-files=all -- . "${excl[@]}")

if [ "$mode" = "doc" ] || [ "$mode" = "soat" ]; then
  if [ -n "$changed" ]; then
    git checkout -- . 2>/dev/null; git clean -fdq -e docs/gemini-out -e docs/tasks
    echo "CẢNH BÁO: Gemini đã sửa file trong làn chỉ đọc — đã hoàn tác toàn bộ."
    changed=""
  fi
fi

echo "agy exit=$code | làn=$mode | kết quả=$out"
if [ "$code" -ne 0 ]; then echo "LỖI — 5 dòng cuối $err:"; tail -n 5 "$err"; exit "$code"; fi
# agy có thể exit 0 mà không in gì (vd. quyền bị từ chối) → coi là lỗi
if [ ! -s "$out" ]; then echo "LỖI — kết quả rỗng. 5 dòng cuối $err:"; tail -n 5 "$err"; exit 3; fi
[ -n "$changed" ] && { echo "File thay đổi:"; echo "$changed"; }
echo "--- 15 dòng đầu kết quả:"; head -n 15 "$out"
