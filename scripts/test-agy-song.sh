#!/usr/bin/env bash
# test-agy-song.sh — kiểm lệnh `song` và `gia-han` của agy-run.sh KHÔNG cần agy, KHÔNG gọi mạng.
# Tự tạo docs/gemini-out/<tên>.{status,meta,md,deadline} trong thư mục tạm riêng, dọn sạch sau khi chạy.
set -u
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPT="$HERE/agy-run.sh"

TMP=$(mktemp -d)
cleanup() { rm -rf "$TMP"; }
trap cleanup EXIT
# repo git rỗng để thay_doi() (git status) hoạt động — cần cho ca 6/7 (đổi cây làm việc)
git init -q "$TMP" >/dev/null 2>&1

OK=0
TOTAL=7

touch_secs_ago() {  # $1=file $2=giây trước
  local f=$1 s=$2 ts
  ts=$(( $(date +%s) - s ))
  touch -d "@$ts" "$f" 2>/dev/null || touch -t "$(date -d "@$ts" +%Y%m%d%H%M.%S 2>/dev/null)" "$f" 2>/dev/null
}

lam_sach_va_moi() {
  local name=$1
  mkdir -p "$TMP/docs/gemini-out"
  : > "$TMP/docs/gemini-out/$name.md"
  : > "$TMP/docs/gemini-out/$name.err"
}

ghi_meta() {
  local name=$1 mode=$2 gh=$3
  printf 'mode=%s\nmodel=test\neffort=\nprompt=docs/tasks/%s.md\nstart=%s\ngia_han=%s\n' "$mode" "$name" "$(date +%s)" "$gh" \
    > "$TMP/docs/gemini-out/$name.meta"
}

chay_song() { ( cd "$TMP" && bash "$SCRIPT" song "$1" ); }
chay_gia_han() { ( cd "$TMP" && bash "$SCRIPT" gia-han "$1" "${2:-15}" ); }

# Lưu ý: chạy trong $(...) nên phải tự bỏ trap EXIT kế thừa (không thì cleanup chạy sớm),
# và phải chuyển hướng stdout của tiến trình nền ra /dev/null (không thì $(...) treo chờ
# pipe đóng cho tới khi tiến trình nền kết thúc — lỗi kinh điển của command substitution).
pid_song() { trap - EXIT; sleep 300 >/dev/null 2>&1 & echo $!; }
pid_chet() { trap - EXIT; ( bash -c 'exit 0' >/dev/null 2>&1 ) & local p=$!; wait "$p" 2>/dev/null; echo "$p"; }

# ---------- 1: sống + đầu ra vừa đổi -> ĐANG LÀM ----------
n=t1_dang_lam
lam_sach_va_moi "$n"
pid=$(pid_song)
start=$(( $(date +%s) - 120 ))
echo "RUNNING $pid $start" > "$TMP/docs/gemini-out/$n.status"
echo "$(( start + 1800 ))" > "$TMP/docs/gemini-out/$n.deadline"
ghi_meta "$n" code 0
touch "$TMP/docs/gemini-out/$n.md"
out=$(chay_song "$n")
kill "$pid" 2>/dev/null
first=$(echo "$out" | head -n1)
if [ "$first" = "ĐANG LÀM" ]; then OK=$((OK+1)); echo "[OK] 1 ĐANG LÀM"; else echo "[X] 1 kỳ vọng ĐANG LÀM, được: $first"; fi

# ---------- 2: sống + không đổi > 600s -> ĐỨNG IM ----------
n=t2_dung_im
lam_sach_va_moi "$n"
pid=$(pid_song)
start=$(( $(date +%s) - 1200 ))
echo "RUNNING $pid $start" > "$TMP/docs/gemini-out/$n.status"
echo "$(( start + 1800 ))" > "$TMP/docs/gemini-out/$n.deadline"
ghi_meta "$n" code 0
touch -d "@$(( $(date +%s) - 700 ))" "$TMP/docs/gemini-out/$n.md" 2>/dev/null \
  || touch -t "$(date -d "@$(( $(date +%s) - 700 ))" +%Y%m%d%H%M.%S 2>/dev/null)" "$TMP/docs/gemini-out/$n.md" 2>/dev/null
touch -d "@$(( $(date +%s) - 700 ))" "$TMP/docs/gemini-out/$n.err" 2>/dev/null
out=$(chay_song "$n")
kill "$pid" 2>/dev/null
first=$(echo "$out" | head -n1)
if [ "$first" = "ĐỨNG IM" ]; then OK=$((OK+1)); echo "[OK] 2 ĐỨNG IM"; else echo "[X] 2 kỳ vọng ĐỨNG IM, được: $first"; fi

# ---------- 3: PID chết -> KHÔNG CHẠY ----------
n=t3_khong_chay
lam_sach_va_moi "$n"
pid=$(pid_chet)
start=$(( $(date +%s) - 300 ))
echo "RUNNING $pid $start" > "$TMP/docs/gemini-out/$n.status"
echo "$(( start + 1800 ))" > "$TMP/docs/gemini-out/$n.deadline"
ghi_meta "$n" code 0
out=$(chay_song "$n")
first=$(echo "$out" | head -n1)
if [ "$first" = "KHÔNG CHẠY" ]; then OK=$((OK+1)); echo "[OK] 3 KHÔNG CHẠY"; else echo "[X] 3 kỳ vọng KHÔNG CHẠY, được: $first"; fi

# ---------- 4: gia-han lần 1 nới đúng số phút ----------
n=t4_gia_han_1
lam_sach_va_moi "$n"
pid=$(pid_song)
start=$(( $(date +%s) - 60 ))
dl_cu=$(( start + 1800 ))
echo "RUNNING $pid $start" > "$TMP/docs/gemini-out/$n.status"
echo "$dl_cu" > "$TMP/docs/gemini-out/$n.deadline"
ghi_meta "$n" code 0
chay_gia_han "$n" 15 >/dev/null 2>&1
rc=$?
dl_moi=$(cat "$TMP/docs/gemini-out/$n.deadline" 2>/dev/null || echo 0)
kill "$pid" 2>/dev/null
if [ $rc -eq 0 ] && [ "$dl_moi" = "$(( dl_cu + 900 ))" ]; then OK=$((OK+1)); echo "[OK] 4 gia-han +15 phút"; else echo "[X] 4 gia-han sai: rc=$rc dl_cu=$dl_cu dl_moi=$dl_moi"; fi

# ---------- 5: gia-han lần 3 bị từ chối ----------
n=t5_gia_han_tu_choi
lam_sach_va_moi "$n"
pid=$(pid_song)
start=$(( $(date +%s) - 60 ))
echo "RUNNING $pid $start" > "$TMP/docs/gemini-out/$n.status"
echo "$(( start + 1800 ))" > "$TMP/docs/gemini-out/$n.deadline"
ghi_meta "$n" code 2
chay_gia_han "$n" 15 >/dev/null 2>&1
rc=$?
kill "$pid" 2>/dev/null
if [ $rc -ne 0 ]; then OK=$((OK+1)); echo "[OK] 5 gia-han lần 3 bị từ chối (mã $rc)"; else echo "[X] 5 kỳ vọng bị từ chối, mã=$rc"; fi

# ---------- 6: .md/.err cũ nhưng cây làm việc vừa đổi -> ĐANG LÀM ----------
n=t6_tree_moi
lam_sach_va_moi "$n"
pid=$(pid_song)
start=$(( $(date +%s) - 1200 ))
echo "RUNNING $pid $start" > "$TMP/docs/gemini-out/$n.status"
echo "$(( start + 1800 ))" > "$TMP/docs/gemini-out/$n.deadline"
ghi_meta "$n" code 0
touch_secs_ago "$TMP/docs/gemini-out/$n.md" 700
touch_secs_ago "$TMP/docs/gemini-out/$n.err" 700
echo "sua" > "$TMP/work.txt"
touch "$TMP/work.txt"
out=$(chay_song "$n")
kill "$pid" 2>/dev/null
rm -f "$TMP/work.txt"
first=$(echo "$out" | head -n1)
if [ "$first" = "ĐANG LÀM" ]; then OK=$((OK+1)); echo "[OK] 6 ĐANG LÀM (cây làm việc vừa đổi)"; else echo "[X] 6 kỳ vọng ĐANG LÀM, được: $first — $out"; fi

# ---------- 7: .md/.err cũ và cây làm việc cũng cũ -> ĐỨNG IM ----------
n=t7_tree_cu
lam_sach_va_moi "$n"
pid=$(pid_song)
start=$(( $(date +%s) - 1200 ))
echo "RUNNING $pid $start" > "$TMP/docs/gemini-out/$n.status"
echo "$(( start + 1800 ))" > "$TMP/docs/gemini-out/$n.deadline"
ghi_meta "$n" code 0
touch_secs_ago "$TMP/docs/gemini-out/$n.md" 700
touch_secs_ago "$TMP/docs/gemini-out/$n.err" 700
echo "sua" > "$TMP/work2.txt"
touch_secs_ago "$TMP/work2.txt" 700
out=$(chay_song "$n")
kill "$pid" 2>/dev/null
rm -f "$TMP/work2.txt"
first=$(echo "$out" | head -n1)
if [ "$first" = "ĐỨNG IM" ]; then OK=$((OK+1)); echo "[OK] 7 ĐỨNG IM (cây làm việc cũng cũ)"; else echo "[X] 7 kỳ vọng ĐỨNG IM, được: $first — $out"; fi

echo "OK $OK/$TOTAL"
[ "$OK" -eq "$TOTAL" ] && exit 0 || exit 1
