#!/usr/bin/env bash
# agy-run.sh v2 — cầu nối AI Team Kit ↔ Antigravity CLI (agy). Quy tắc: docs/LAN-GEMINI.md
# Chạy từ thư mục gốc dự án, trong Git Bash.
#
#   bash scripts/agy-run.sh kiem-tra                                   kiểm tra agy / đăng nhập / model / headless
#   bash scripts/agy-run.sh <doc|soat|sinh|code> docs/tasks/<ten>.md [model]   chạy NỀN, trả về ngay
#   bash scripts/agy-run.sh cho <ten> [giây]                           đợi tối đa N giây (mặc định 100) rồi báo
#   bash scripts/agy-run.sh ket-qua <ten>                              tổng kết + hoàn tác file ngoài phạm vi
#   bash scripts/agy-run.sh huy <ten>                                  hủy lượt đang chạy, hoàn tác thay đổi
#   bash scripts/agy-run.sh trang-thai                                 liệt kê các lượt
#
# Model mặc định theo làn (đổi bằng file scripts/gemini.env, xem docs/LAN-GEMINI.md mục 1):
#   code (viết code)  : gemini-3.8-flash, effort high
#   soat (soát chéo)  : gemini-3.1-pro,   effort high
#   doc  (đọc rộng)   : gemini-3.1-pro,   effort high
#   sinh (sinh file)  : gemini-3.8-flash, effort low
# Slug có thể ghi kèm mức effort (gemini-3.8-flash-high) hoặc không (gemini-3.8-flash + --effort high);
# script tự dò dạng mà 'agy models' trên máy chấp nhận.
GEMINI_CODE="${GEMINI_CODE:-gemini-3.8-flash}";  EFFORT_CODE="${EFFORT_CODE:-high}"
GEMINI_SOAT="${GEMINI_SOAT:-gemini-3.1-pro}";    EFFORT_SOAT="${EFFORT_SOAT:-high}"
GEMINI_DOC="${GEMINI_DOC:-gemini-3.1-pro}";      EFFORT_DOC="${EFFORT_DOC:-high}"
GEMINI_SINH="${GEMINI_SINH:-gemini-3.8-flash}";  EFFORT_SINH="${EFFORT_SINH:-low}"
[ -f scripts/gemini.env ] && . scripts/gemini.env
set -u

OUT=docs/gemini-out
EXCL=(':!docs/gemini-out' ':!docs/tasks' ':!docs/bao-cao' ':!.claude')
CLEAN_EX=(-e docs/gemini-out -e docs/tasks -e docs/bao-cao -e .claude -e node_modules -e .env)
declare -A LIMIT=([doc]=15 [soat]=15 [sinh]=15 [code]=30)   # phút
declare -A MODEL_LANE=([code]=$GEMINI_CODE [soat]=$GEMINI_SOAT [doc]=$GEMINI_DOC [sinh]=$GEMINI_SINH)
declare -A EFFORT_LANE=([code]=$EFFORT_CODE [soat]=$EFFORT_SOAT [doc]=$EFFORT_DOC [sinh]=$EFFORT_SINH)

# In "slug|effort": slug đã kèm effort → effort rỗng; 'agy models' có dạng base-effort → dùng dạng đó; còn lại → base + --effort
resolve_model() {
  local m=$1 e=$2 list
  case "$m" in *-high|*-medium|*-low) echo "$m|"; return ;; esac
  list=${MODELS_CACHE:-$(agy models 2>/dev/null)}
  if echo "$list" | grep -qE "(^|[[:space:]])${m}-${e}([[:space:]]|\$)"; then echo "${m}-${e}|"; else echo "${m}|${e}"; fi
}

die() { local c=$1; shift; echo "$*"; exit "$c"; }
thay_doi() { git status --porcelain --untracked-files=all -- . "${EXCL[@]}" 2>/dev/null; }
hoan_tac_tat_ca() { git checkout -- . 2>/dev/null; git clean -fdq "${CLEAN_EX[@]}" 2>/dev/null; }

# Lượt RUNNING mà tiến trình đã chết → đánh dấu DONE 255
sua_status_chet() {
  local st=$1 state a b
  [ -f "$st" ] || return 0
  read -r state a b < "$st"
  if [ "$state" = "RUNNING" ] && ! kill -0 "$a" 2>/dev/null; then
    echo "DONE 255 $(( $(date +%s) - b ))" > "$st"
  fi
}


# Giết một tiến trình và toàn bộ con cháu (Linux: ps -o; Git Bash/MSYS: ps -e có cột PPID)
kill_tree() {
  local root=$1 table pid ppid
  table=$(ps -e -o pid=,ppid= 2>/dev/null) || table=$(ps -e 2>/dev/null | awk 'NR > 1 && $1 ~ /^[0-9]+$/ { print $1, $2 }')
  local -a todo=("$root") all=()
  while [ ${#todo[@]} -gt 0 ]; do
    pid=${todo[0]}; todo=("${todo[@]:1}"); all+=("$pid")
    while read -r c pp; do [ "$pp" = "$pid" ] && todo+=("$c"); done <<< "$table"
  done
  local i
  for (( i=${#all[@]}-1; i>=0; i-- )); do kill "${all[$i]}" 2>/dev/null; done
  sleep 1
  for (( i=${#all[@]}-1; i>=0; i-- )); do kill -9 "${all[$i]}" 2>/dev/null; done
}

# ---------- tiến trình nền (script tự gọi lại chính nó) ----------
_worker() {
  local name=$1 mode=$2 model=$3 limit=$4 effort=${5:-}
  local out="$OUT/$name.md" err="$OUT/$name.err" st="$OUT/$name.status" start child code
  start=$(date +%s)
  echo "RUNNING $BASHPID $start" > "$st"
  local prompt="Đọc AGENTS.md rồi đọc docs/tasks/$name.md và thực hiện đúng nội dung trong đó. Kết thúc bằng mục BÁO CÁO CUỐI theo khung trong file đó."
  local args=(-p "$prompt" --dangerously-skip-permissions --print-timeout "${limit}m" --model "$model")
  [ -n "$effort" ] && args+=(--effort "$effort")
  if command -v timeout >/dev/null 2>&1; then
    timeout -k 30 "$((limit + 2))m" agy "${args[@]}" >"$out" 2>"$err" &
  else
    agy "${args[@]}" >"$out" 2>"$err" &
  fi
  child=$!
  trap 'kill_tree "$child"; echo "DONE 130 $(( $(date +%s) - start ))" > "$st"; exit 130' TERM INT
  wait "$child"; code=$?
  echo "DONE $code $(( $(date +%s) - start ))" > "$st"
}

# ---------- chạy nền ----------
chay() {
  local mode=$1 pf=$2 model=${3:-}
  [ -d .claude ] || die 42 "Chạy script từ thư mục gốc dự án (nơi có .claude/)."
  [ -f "$pf" ] || die 42 "Không thấy file prompt: $pf"
  command -v agy >/dev/null 2>&1 || die 127 "Chưa cài agy (Antigravity CLI) hoặc chưa có trong PATH."
  git rev-parse --is-inside-work-tree >/dev/null 2>&1 || die 42 "Thư mục này không phải kho git."
  mkdir -p "$OUT"
  local f
  for f in "$OUT"/*.status; do [ -f "$f" ] && sua_status_chet "$f"; done
  f=$(grep -ls '^RUNNING' "$OUT"/*.status 2>/dev/null | head -n 1)
  [ -n "$f" ] && die 1 "Đang có lượt khác chạy: $(basename "$f" .status) — đợi (cho) hoặc hủy (huy) trước."
  [ -n "$(thay_doi)" ] && die 1 "Cây làm việc chưa sạch — commit hoặc chờ thợ xong rồi mới gọi Gemini."

  local name; name=$(basename "$pf" .md)
  local effort=${EFFORT_LANE[$mode]} r
  [ -z "$model" ] && model=${MODEL_LANE[$mode]}
  r=$(resolve_model "$model" "$effort"); model=${r%%|*}; effort=${r#*|}
  local limit=${LIMIT[$mode]}
  printf 'mode=%s\nmodel=%s\neffort=%s\nprompt=%s\nstart=%s\n' "$mode" "$model" "$effort" "$pf" "$(date +%s)" > "$OUT/$name.meta"
  rm -f "$OUT/$name.md" "$OUT/$name.err"
  echo "RUNNING 0 $(date +%s)" > "$OUT/$name.status"
  if command -v nohup >/dev/null 2>&1; then
    nohup bash "$0" _worker "$name" "$mode" "$model" "$limit" "$effort" >/dev/null 2>&1 &
  else
    bash "$0" _worker "$name" "$mode" "$model" "$limit" "$effort" >/dev/null 2>&1 &
  fi
  sleep 2
  echo "ĐÃ CHẠY NỀN: $name | làn=$mode | model=$model${effort:+ --effort $effort} | giới hạn=${limit} phút"
  echo "Đợi bằng: bash scripts/agy-run.sh cho $name"
}

# ---------- đợi ----------
cho() {
  local name=$1 wait=${2:-100} st="$OUT/$1.status" state a b t0 now limit
  [ -f "$st" ] || die 42 "Không có lượt tên $name."
  limit=$(sed -n 's/^mode=//p' "$OUT/$name.meta" 2>/dev/null); limit=${LIMIT[${limit:-code}]:-30}
  t0=$(date +%s)
  while :; do
    sua_status_chet "$st"
    read -r state a b < "$st"
    case $state in
      RUNNING)
        now=$(date +%s)
        if (( now - t0 >= wait )); then
          echo "ĐANG CHẠY: $name — đã $(( (now - b) / 60 )) phút (giới hạn ${limit}). Gọi lại: bash scripts/agy-run.sh cho $name"
          exit 3
        fi
        sleep 15 ;;
      DONE)
        echo "XONG LƯỢT: $name sau $(( b / 60 )) phút (mã $a). Tổng kết: bash scripts/agy-run.sh ket-qua $name"
        exit 0 ;;
      *) die 42 "Trạng thái lạ trong $st: $state" ;;
    esac
  done
}

# ---------- danh sách file được phép trong prompt ----------
file_duoc_phep() {
  awk '
    /^## / { inlist = 0 }
    inlist && /^- / { sub(/^- +/, ""); gsub(/`/, ""); gsub(/^[ \t]+|[ \t]+$/, ""); if ($0 != "") print }
    tolower($0) ~ /^## .*file được phép/ { inlist = 1 }
  ' "$1"
}
duoc_phep() {  # $1=path  $2..=entries
  local p=$1 e; shift
  for e in "$@"; do
    case "$e" in
      */) [[ "$p" == "$e"* ]] && return 0 ;;
      *)  [ "$p" = "$e" ] && return 0 ;;
    esac
  done
  return 1
}

# ---------- tổng kết ----------
ket_qua() {
  local name=$1 st="$OUT/$1.status" out="$OUT/$1.md" err="$OUT/$1.err" state code secs mode model pf cls
  [ -f "$st" ] || die 42 "Không có lượt tên $name."
  sua_status_chet "$st"
  read -r state code secs < "$st"
  [ "$state" = "RUNNING" ] && die 3 "Lượt $name vẫn đang chạy — dùng: bash scripts/agy-run.sh cho $name"
  mode=$(sed -n 's/^mode=//p' "$OUT/$name.meta"); model=$(sed -n 's/^model=//p' "$OUT/$name.meta"); pf=$(sed -n 's/^prompt=//p' "$OUT/$name.meta")
  touch "$out" "$err"

  if [ "$code" = 124 ] || [ "$code" = 137 ]; then cls="QUÁ GIỜ"
  elif grep -qiE 'authentication required|not authenticated|unauthenticated|sign in|login required' "$err"; then cls="CHƯA ĐĂNG NHẬP"
  elif grep -qiE '\b429\b|RESOURCE_EXHAUSTED|quota|rate limit' "$err"; then cls="HẾT HẠN MỨC"
  elif [ "$code" = 130 ]; then cls="ĐÃ HỦY"
  elif [ "$code" != 0 ]; then cls="LỖI"
  elif [ ! -s "$out" ]; then cls="TRỐNG"
  else cls="XONG"; fi

  local changed reverted="" untracked_out="" line status path
  changed=$(thay_doi)
  case $mode in
    doc|soat)
      if [ -n "$changed" ]; then
        hoan_tac_tat_ca
        reverted="TOÀN BỘ (làn chỉ đọc mà Gemini đã sửa file — đã hoàn tác)"; changed=""
      fi ;;
    sinh|code)
      if [ -n "$changed" ] && [ -f "$pf" ]; then
        local -a allowed=()
        mapfile -t allowed < <(file_duoc_phep "$pf")
        if [ ${#allowed[@]} -gt 0 ]; then
          while IFS= read -r line; do
            [ -z "$line" ] && continue
            status=${line:0:2}; path=${line:3}
            duoc_phep "$path" "${allowed[@]}" && continue
            if [ "$status" = "??" ]; then untracked_out+="$path"$'\n'
            else git checkout -- "$path" 2>/dev/null && reverted+="$path"$'\n'; fi
          done <<< "$changed"
          changed=$(thay_doi)
        fi
      fi ;;
  esac

  local effort; effort=$(sed -n 's/^effort=//p' "$OUT/$name.meta")
  echo "KẾT QUẢ: $cls | lượt=$name | làn=$mode | model=$model${effort:+ --effort $effort} | mã=$code | $(( secs / 60 )) phút"
  [ "$cls" = "XONG" ] && grep -m1 -E '^KẾT QUẢ:' "$out" | sed 's/^/Gemini tự báo — /'
  echo "FILE THAY ĐỔI:"; if [ -n "$changed" ]; then echo "$changed"; else echo "(không)"; fi
  [ -n "$reverted" ] && { echo "ĐÃ HOÀN TÁC (ngoài phạm vi cho phép):"; echo "$reverted"; }
  [ -n "$untracked_out" ] && { echo "FILE MỚI NGOÀI PHẠM VI (chưa xóa — Quản lý quyết):"; echo "$untracked_out"; }
  case $cls in
    XONG|TRỐNG) echo "--- 40 dòng cuối báo cáo ($out):"; tail -n 40 "$out" ;;
    *) echo "--- 10 dòng cuối log lỗi ($err):"; tail -n 10 "$err" ;;
  esac
  [ "$cls" = "TRỐNG" ] && echo "GỢI Ý: agy không in gì ra stdout — agy quá cũ (lỗi stdout khi chạy không có terminal) hoặc chưa tin cậy thư mục. Cài lại agy bản mới nhất, chạy agy tương tác trong thư mục dự án một lần rồi /quit."
  [ "$cls" = "XONG" ] && exit 0 || exit 1
}

# ---------- hủy ----------
huy() {
  local name=$1 st="$OUT/$1.status" state a b
  [ -f "$st" ] || die 42 "Không có lượt tên $name."
  read -r state a b < "$st"
  if [ "$state" = "RUNNING" ]; then
    kill_tree "$a"
    command -v taskkill >/dev/null 2>&1 && taskkill //F //IM agy.exe >/dev/null 2>&1
    sleep 1
    echo "DONE 130 $(( $(date +%s) - b ))" > "$st"
  fi
  hoan_tac_tat_ca
  echo "ĐÃ HỦY: $name — mọi thay đổi trong cây làm việc đã hoàn tác."
}

# ---------- kiểm tra cài đặt ----------
kiem_tra() {
  local ok=0 v
  [ -d .claude ] || { echo "[X] Hãy chạy từ thư mục gốc dự án (nơi có .claude/)."; exit 42; }
  git rev-parse --is-inside-work-tree >/dev/null 2>&1 && echo "[OK] kho git" || { echo "[X] chưa git init"; ok=1; }
  command -v timeout >/dev/null 2>&1 && echo "[OK] có lệnh timeout" || echo "[!] thiếu lệnh timeout — sẽ chạy không giới hạn giờ cứng"
  command -v nohup >/dev/null 2>&1 && echo "[OK] có lệnh nohup" || echo "[!] thiếu nohup — vẫn chạy nền được"
  if ! command -v agy >/dev/null 2>&1; then echo "[X] chưa có agy trong PATH — cài từ https://antigravity.google/cli rồi mở lại Git Bash"; exit 127; fi
  v=$(agy --version 2>/dev/null | head -n 1); echo "[OK] agy: ${v:-?}"
  mkdir -p "$OUT"
  local models lane base r slug eff
  models=$(agy models 2>/dev/null); MODELS_CACHE=$models
  [ -z "$models" ] && { echo "[X] 'agy models' không trả về gì — chưa đăng nhập? chạy 'agy' tương tác, đăng nhập, /quit"; ok=1; }
  for lane in code soat doc sinh; do
    base=${MODEL_LANE[$lane]}
    if echo "$models" | grep -q "$base"; then
      r=$(resolve_model "$base" "${EFFORT_LANE[$lane]}"); slug=${r%%|*}; eff=${r#*|}
      echo "[OK] làn $lane → $slug${eff:+ --effort $eff}"
    else
      echo "[X] làn $lane: không thấy '$base' trong 'agy models' — sửa trong scripts/gemini.env (xem docs/LAN-GEMINI.md mục 1)"; ok=1
    fi
  done
  r=$(resolve_model "${MODEL_LANE[code]}" "${EFFORT_LANE[code]}"); slug=${r%%|*}; eff=${r#*|}
  local -a targs=(--model "$slug"); [ -n "$eff" ] && targs+=(--effort "$eff")
  echo "... thử headless (tối đa 3 phút)"
  local t="$OUT/_kiem-tra.md"
  if command -v timeout >/dev/null 2>&1; then
    timeout -k 10 3m agy -p "Trả lời đúng một từ: ok" --dangerously-skip-permissions --print-timeout 2m "${targs[@]}" >"$t" 2>"$t.err"
  else
    agy -p "Trả lời đúng một từ: ok" --dangerously-skip-permissions --print-timeout 2m "${targs[@]}" >"$t" 2>"$t.err"
  fi
  local c=$?
  if grep -qi 'ok' "$t"; then echo "[OK] headless trả lời được: $(head -c 80 "$t" | tr -d '\r\n')"
  elif grep -qiE 'authentication required|not authenticated|unauthenticated|sign in' "$t.err"; then echo "[X] chưa đăng nhập — chạy 'agy' tương tác trong thư mục này, đăng nhập Google, /quit"; ok=1
  elif grep -qiE '\b429\b|RESOURCE_EXHAUSTED|quota|rate limit' "$t.err"; then echo "[X] hết hạn mức / 429 — đợi cửa sổ hạn mức mới, hoặc đăng xuất/đăng nhập lại"; ok=1
  elif [ ! -s "$t" ]; then echo "[X] headless in ra TRỐNG (mã $c) — agy cũ hoặc thư mục chưa được tin cậy: cài lại agy mới nhất, chạy 'agy' tương tác ở đây một lần rồi /quit"; ok=1
  else echo "[?] headless trả về khác thường (mã $c): $(head -c 120 "$t" | tr -d '\r\n')"; fi
  [ $ok -eq 0 ] && echo "KẾT LUẬN: SẴN SÀNG — gõ trong phiên quan-ly: Bật làn Gemini mức NHIỀU theo docs/LAN-GEMINI.md" || echo "KẾT LUẬN: CHƯA SẴN SÀNG — sửa các dòng [X] ở trên"
  exit $ok
}

trang_thai() {
  local f
  for f in "$OUT"/*.status; do [ -f "$f" ] || { echo "(chưa có lượt nào)"; return; }; sua_status_chet "$f"; echo "$(basename "$f" .status): $(cat "$f")"; done
}

case "${1:-}" in
  doc|soat|sinh|code) [ -n "${2:-}" ] || die 42 "Cách dùng: agy-run.sh <doc|soat|sinh|code> docs/tasks/<ten>.md [model]"; chay "$1" "$2" "${3:-}" ;;
  cho)        [ -n "${2:-}" ] || die 42 "Cách dùng: agy-run.sh cho <ten> [giây]"; cho "$2" "${3:-100}" ;;
  ket-qua)    [ -n "${2:-}" ] || die 42 "Cách dùng: agy-run.sh ket-qua <ten>"; ket_qua "$2" ;;
  huy)        [ -n "${2:-}" ] || die 42 "Cách dùng: agy-run.sh huy <ten>"; huy "$2" ;;
  kiem-tra)   kiem_tra ;;
  trang-thai) trang_thai ;;
  _worker)    _worker "$2" "$3" "$4" "$5" "${6:-}" ;;
  *) sed -n '2,10p' "$0"; exit 42 ;;
esac
