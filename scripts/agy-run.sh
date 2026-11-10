#!/usr/bin/env bash
# agy-run.sh — cầu nối AI Team Kit ↔ Antigravity CLI (agy). Quy tắc: docs/LAN-GEMINI.md
# Chạy từ thư mục gốc dự án: Git Bash (Windows) hoặc Terminal (macOS/Linux). Viết cho bash 3.2 trở lên (bash mặc định của macOS) và công cụ GNU lẫn BSD.
#
#   bash scripts/agy-run.sh kiem-tra                                   kiểm tra agy / đăng nhập / model / headless
#   bash scripts/agy-run.sh <code|sinh|soat|doc|ytuong> docs/tasks/<ten>.md [model|kho|vong5]   chạy NỀN, trả về ngay (kho = vòng 4, model GEMINI_KHO; vong5 = vòng 5, model MODEL_VONG5)
#   bash scripts/agy-run.sh cho <ten> [giây]                           đợi tối đa N giây (mặc định 100), báo trạng thái + hoạt động
#   bash scripts/agy-run.sh ket-qua <ten>                              tổng kết + hoàn tác file ngoài phạm vi
#   bash scripts/agy-run.sh gia-han <ten> [phút]                       nới giới hạn giờ bằng tay (script tự gia hạn khi đang làm đúng hướng)
#   bash scripts/agy-run.sh huy <ten>                                  hủy lượt đang chạy, hoàn tác thay đổi
#   bash scripts/agy-run.sh trang-thai                                 liệt kê các lượt
#   bash scripts/agy-run.sh han-muc [xoa]                              Argon / Sonnet vòng 5 đang dùng được hay đang nghỉ; xoa = dùng lại ngay
#
# Tự động trong lúc chạy (không cần ai canh):
#   - cứ AGY_TICK_SEC giây đo hoạt động (luồng JSON của agy dài ra, hoặc có file trong dự án được ghi)
#   - đứng im ≥ AGY_IDLE_SEC (10 phút): giết agy, giao lại cùng việc (giữ phần đã làm), tối đa AGY_MAX_RESTART lần
#   - tới giới hạn giờ: còn hoạt động trong 10 phút gần nhất và đang đúng hướng (chỉ sửa file được phép) → gia hạn +AGY_EXT_MIN phút,
#     tới trần tuyệt đối; hết trần → dừng nhưng GIỮ kết quả dở cho thợ Claude tiếp quản
#   - Argon / Sonnet vòng 5 hết hạn mức hoặc không trả lời → cho model đó NGHỈ (lần đầu 5 giờ; cạn lại ngay sau đó → 24 giờ, coi như hết trần tuần);
#     lượt soat/ytuong đang dùng Argon tự chạy lại bằng GEMINI_CODE; vòng 4 / vòng 5 trả MODEL NGHỈ để Quản lý bỏ vòng đó
#   - vòng sau của cùng phiếu (<mã>-v2 … -v5) được chạy tiếp trên phần dở nếu mọi file đang sửa đều trong danh sách được phép
#
# Model mặc định theo làn (đổi bằng file scripts/gemini.env, xem docs/LAN-GEMINI.md mục 1):
GEMINI_CODE="${GEMINI_CODE:-gemini-3.8-flash}";    EFFORT_CODE="${EFFORT_CODE:-high}"
GEMINI_KHO="${GEMINI_KHO:-gemini-4-argon}";        EFFORT_KHO="${EFFORT_KHO:-medium}"    # vòng 4 nâng bậc của phiếu code
GEMINI_SOAT="${GEMINI_SOAT:-gemini-4-argon}";      EFFORT_SOAT="${EFFORT_SOAT:-high}"
GEMINI_DOC="${GEMINI_DOC:-gemini-3.8-flash}";      EFFORT_DOC="${EFFORT_DOC:-high}"
GEMINI_SINH="${GEMINI_SINH:-gemini-3.8-flash}";    EFFORT_SINH="${EFFORT_SINH:-low}"
GEMINI_YTUONG="${GEMINI_YTUONG:-gemini-4-argon}";  EFFORT_YTUONG="${EFFORT_YTUONG:-high}"
MODEL_VONG5="${MODEL_VONG5:-claude-sonnet-5-5}";   EFFORT_VONG5="${EFFORT_VONG5:-medium}"  # vòng 5: Claude Sonnet qua agy
AGY_FORMAT="${AGY_FORMAT:-stream}"        # stream (đo được hoạt động) | text (dự phòng)
[ -f scripts/gemini.env ] && . scripts/gemini.env
set -u

AGY_TICK_SEC=${AGY_TICK_SEC:-20}
AGY_IDLE_SEC=${AGY_IDLE_SEC:-600}
AGY_MIN_SEC=${AGY_MIN_SEC:-60}            # số giây trong "một phút" (chỉ đổi khi thử nghiệm)
AGY_EXT_MIN=${AGY_EXT_MIN:-15}
AGY_MAX_RESTART=${AGY_MAX_RESTART:-2}
HM_NGHI_NGAN_GIO=${HM_NGHI_NGAN_GIO:-5}   # Argon / Sonnet vòng 5 cạn lần đầu → nghỉ 5 giờ (cửa sổ hạn mức 5 giờ)
HM_NGHI_DAI_GIO=${HM_NGHI_DAI_GIO:-24}    # cạn lại ngay sau khi hết nghỉ → coi như hết trần tuần, thử lại mỗi 24 giờ
HM_NHANH_SEC=${HM_NHANH_SEC:-180}         # lỗi trong 3 phút đầu mà không có báo cáo → coi là model không trả lời
HM_GIO_SEC=${HM_GIO_SEC:-3600}            # số giây trong "một giờ" (chỉ đổi khi thử nghiệm)

OUT=docs/gemini-out
HM_FILE="$OUT/_han-muc.meta"              # trạng thái nghỉ của Argon / Sonnet vòng 5 (.gitignore đã bỏ qua *.meta)
RE_AUTH='authentication required|not authenticated|unauthenticated|sign in|login required'
RE_QUOTA='(^|[^0-9])429([^0-9]|$)|RESOURCE_EXHAUSTED|quota|rate limit'
LYDO=""
DS=()
EXCL=(':!docs/gemini-out' ':!docs/tasks' ':!docs/bao-cao' ':!docs/y-tuong' ':!.claude')
CLEAN_EX=(-e docs/gemini-out -e docs/tasks -e docs/bao-cao -e docs/y-tuong -e .claude -e node_modules -e .env)
# Theo làn (hàm thay cho mảng kết hợp: bash 3.2 của macOS không có declare -A)
gioi_han()   { case "$1" in code) echo 30 ;; ytuong) echo 20 ;; *) echo 15 ;; esac; }   # phút, có thể gia hạn (doc/soat/sinh: 15)
tran()       { case "$1" in code) echo 60 ;; ytuong) echo 40 ;; *) echo 30 ;; esac; }   # trần tuyệt đối (doc/soat/sinh: 30)
model_lan()  { case "$1" in code) echo "$GEMINI_CODE" ;; soat) echo "$GEMINI_SOAT" ;; doc) echo "$GEMINI_DOC" ;; sinh) echo "$GEMINI_SINH" ;; ytuong) echo "$GEMINI_YTUONG" ;; esac; }
effort_lan() { case "$1" in code) echo "$EFFORT_CODE" ;; soat) echo "$EFFORT_SOAT" ;; doc) echo "$EFFORT_DOC" ;; sinh) echo "$EFFORT_SINH" ;; ytuong) echo "$EFFORT_YTUONG" ;; esac; }

die() { local c=$1; shift; echo "$*"; exit "$c"; }
thay_doi() { git status --porcelain --untracked-files=all -- . "${EXCL[@]}" 2>/dev/null; }
hoan_tac_tat_ca() { git checkout -- . 2>/dev/null; git clean -fdq "${CLEAN_EX[@]}" 2>/dev/null; }
lan_chi_doc() { [ "$1" = doc ] || [ "$1" = soat ]; }
meta_get() { sed -n "s/^$2=//p" "$OUT/$1.meta" 2>/dev/null | tail -n 1; }
log_ghi() { printf '%s  %s\n' "$(date '+%H:%M:%S')" "$2" >> "$OUT/$1.log"; }

# In "slug|effort": slug đã kèm effort → effort rỗng; 'agy models' có dạng base-effort → dùng dạng đó; còn lại → base + --effort
resolve_model() {
  local m=$1 e=$2 list
  case "$m" in *-high|*-medium|*-low) echo "$m|"; return ;; esac
  list=${MODELS_CACHE:-$(agy models 2>/dev/null)}
  if echo "$list" | grep -qE "(^|[[:space:]])${m}-${e}([[:space:]]|\$)"; then echo "${m}-${e}|"; else echo "${m}|${e}"; fi
}

# ---------- hạn mức riêng: Argon (model của vòng 4) và Sonnet vòng 5 ----------
goc() { local s=$1; s=${s%-high}; s=${s%-medium}; s=${s%-low}; echo "$s"; }   # bỏ hậu tố effort khỏi tên model
nhom_model() {  # manh = model vòng 4 (GEMINI_KHO, hiện là Argon) · vong5 = model vòng 5 · thuong = còn lại (Flash: không theo dõi)
  local g; g=$(goc "$1")
  if [ -n "$g" ] && [ "$g" = "$(goc "$GEMINI_KHO")" ]; then echo manh
  elif [ -n "$g" ] && [ "$g" = "$(goc "$MODEL_VONG5")" ]; then echo vong5
  else echo thuong; fi
}
hm_get() { sed -n "s/^$1=//p" "$HM_FILE" 2>/dev/null | tail -n 1; }
hm_set() {
  mkdir -p "$OUT"
  { grep -v "^$1=" "$HM_FILE" 2>/dev/null; printf '%s=%s\n' "$1" "$2"; } > "$HM_FILE.tmp" && mv -f "$HM_FILE.tmp" "$HM_FILE"
}
hm_nghi_toi() {  # $1=nhóm → epoch hết nghỉ (0 = không nghỉ)
  local luc lan gio
  luc=$(hm_get "${1}_LUC"); lan=$(hm_get "${1}_LAN"); lan=${lan:-0}
  if [ -z "$luc" ] || [ "$lan" -le 0 ]; then echo 0; return; fi
  if [ "$lan" -ge 2 ]; then gio=$HM_NGHI_DAI_GIO; else gio=$HM_NGHI_NGAN_GIO; fi
  echo $(( luc + gio * HM_GIO_SEC ))
}
hm_dang_nghi() { [ "$(hm_nghi_toi "$1")" -gt "$(date +%s)" ]; }
hm_can() {  # $1=nhóm $2=lý do — ghi một lần cạn. Đang nghỉ: cùng một lần cạn. Cạn lại ngay sau khi hết nghỉ: +1 (2 trở lên = trần tuần)
  local now lan het; now=$(date +%s); lan=$(hm_get "${1}_LAN"); lan=${lan:-0}; het=$(hm_nghi_toi "$1")
  if [ "$het" -gt "$now" ]; then hm_set "${1}_LYDO" "$2"; return 0; fi
  if [ "$lan" -gt 0 ] && [ $(( now - het )) -gt $(( HM_NGHI_NGAN_GIO * HM_GIO_SEC )) ]; then lan=0; fi   # lâu rồi mới cạn lại → tính lại từ đầu
  hm_set "${1}_LAN" $(( lan + 1 )); hm_set "${1}_LUC" "$now"; hm_set "${1}_LYDO" "$2"
}
hm_ok() { local lan; lan=$(hm_get "${1}_LAN"); [ "${lan:-0}" != 0 ] && hm_set "${1}_LAN" 0; return 0; }
gio_hien() { date -d "@$1" '+%H:%M %d/%m' 2>/dev/null || date -r "$1" '+%H:%M %d/%m' 2>/dev/null || echo "?"; }   # GNU: -d @epoch · macOS/BSD: -r epoch
an_toan() { LC_ALL=C tr -cd '\40-\176'; }   # chỉ giữ ký tự ASCII in được (lý do lỗi ghi vào file trạng thái; tránh lỗi "illegal byte sequence" của tr/sed trên macOS)
kich_thuoc() { local f; for f in "$@"; do [ -f "$f" ] && wc -c < "$f"; done 2>/dev/null | tr -d ' \t' | tr '\n' ' '; }   # thay stat -c %s (GNU) — macOS không có
hm_mo_ta() {  # trạng thái nghỉ của một nhóm, một dòng
  local t lan; t=$(hm_nghi_toi "$1"); lan=$(hm_get "${1}_LAN"); lan=${lan:-0}
  if [ "$t" -gt "$(date +%s)" ]; then
    if [ "$lan" -ge 2 ]; then echo "NGHỈ tới $(gio_hien "$t") ($(hm_get "${1}_LYDO"); cạn $lan lần liên tiếp → coi như hết trần tuần, thử lại mỗi $HM_NGHI_DAI_GIO giờ)"
    else echo "NGHỈ tới $(gio_hien "$t") ($(hm_get "${1}_LYDO"); thường là hết cửa sổ $HM_NGHI_NGAN_GIO giờ)"; fi
  else echo "SẴN SÀNG"; fi
}

# Lượt RUNNING mà tiến trình đã chết → đánh dấu DONE 255
sua_status_chet() {
  local st=$1 state a b
  [ -f "$st" ] || return 0
  read -r state a b < "$st"
  if [ "$state" = "RUNNING" ] && ! kill -0 "$a" 2>/dev/null; then
    echo "DONE 255 $(( $(date +%s) - b ))" > "$st"
  fi
}

# Giết một tiến trình và toàn bộ con cháu (Linux/macOS: ps -o; Git Bash/MSYS: ps -e có cột PPID)
kill_tree() {
  local root=$1 table pid c pp i=0
  table=$(ps -e -o pid=,ppid= 2>/dev/null) || table=$(ps -e 2>/dev/null | awk 'NR > 1 && $1 ~ /^[0-9]+$/ { print $1, $2 }')
  local -a all=("$root")
  while [ "$i" -lt "${#all[@]}" ]; do   # duyệt theo chỉ số, không cắt mảng (an toàn với set -u trên bash 3.2)
    pid=${all[$i]}; i=$(( i + 1 ))
    while read -r c pp; do [ "$pp" = "$pid" ] && all+=("$c"); done <<< "$table"
  done
  for (( i=${#all[@]}-1; i>=0; i-- )); do kill "${all[$i]}" 2>/dev/null; done
  sleep 1
  for (( i=${#all[@]}-1; i>=0; i-- )); do kill -9 "${all[$i]}" 2>/dev/null; done
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
# Đọc mục "File được phép" của prompt $1 vào mảng DS (thay mapfile — bash 3.2 của macOS không có)
doc_ds() { local l; DS=(); while IFS= read -r l; do DS+=("$l"); done < <(file_duoc_phep "$1"); }
# In các file (trong danh sách porcelain $2) nằm ngoài mục "File được phép" của prompt $1; trả 1 nếu prompt không có danh sách
ngoai_pham_vi() {
  doc_ds "$1"
  [ ${#DS[@]} -gt 0 ] || return 1
  local line
  while IFS= read -r line; do
    [ -z "$line" ] && continue
    duoc_phep "${line:3}" "${DS[@]}" || echo "${line:3}"
  done <<< "$2"
  return 0
}
# Đúng hướng? làn chỉ đọc: có hoạt động là đủ. Làn ghi: có sửa file, và mọi file sửa đều trong danh sách (nếu có danh sách)
dung_huong() {
  local mode=$1 pf=$2 changed line path
  lan_chi_doc "$mode" && return 0
  changed=$(thay_doi); [ -n "$changed" ] || return 1
  [ -f "$pf" ] || return 0
  doc_ds "$pf"
  [ ${#DS[@]} -gt 0 ] || return 0
  while IFS= read -r line; do
    [ -z "$line" ] && continue
    path=${line:3}
    duoc_phep "$path" "${DS[@]}" || return 1
  done <<< "$changed"
  return 0
}

# Tách kết quả cuối từ luồng stream-json (cần node). In STATUS=...; trả 1 nếu không tách được
tach_ket_qua() {  # $1=stream $2=out
  command -v node >/dev/null 2>&1 || return 1
  [ -s "$1" ] || return 1
  node -e '
    const fs = require("fs");
    const lines = fs.readFileSync(process.argv[1], "utf8").split(/\r?\n/).filter(Boolean);
    let res = null;
    for (const l of lines) { try { const o = JSON.parse(l); if (o && o.type === "result") res = o; } catch (e) {} }
    if (!res) process.exit(2);
    let r = res.response ?? res.result ?? res.text ?? "";
    if (r && typeof r === "object") r = r.text ?? r.content ?? JSON.stringify(r);
    fs.writeFileSync(process.argv[2], String(r ?? ""));
    console.log("STATUS=" + (res.status ?? ""));
  ' "$1" "$2" 2>/dev/null
}

# Phân loại một lượt đã xong: $1=tên $2=mã thoát → XONG | TRỐNG | LỖI | HẾT HẠN MỨC | CHƯA ĐĂNG NHẬP | QUÁ GIỜ | ĐỨNG IM | ĐÃ HỦY | MODEL NGHỈ
phan_loai() {
  local name=$1 code=$2 out="$OUT/$1.md" err="$OUT/$1.err" s
  touch "$out" "$err"; s=$(meta_get "$name" STATUS)
  if [ "$(meta_get "$name" model_nghi)" = 1 ]; then echo "MODEL NGHỈ"
  elif [ "$code" = 124 ]; then echo "QUÁ GIỜ"
  elif [ "$code" = 125 ]; then echo "ĐỨNG IM"
  elif [ "$code" = 0 ] && grep -aq '^KẾT QUẢ:' "$out" && { [ -z "$s" ] || [ "$s" = "?" ] || [ "$s" = SUCCESS ]; }; then echo "XONG"   # chạy xong, có báo cáo cuối → không xét cảnh báo trong log
  elif grep -aqiE "$RE_AUTH" "$err"; then echo "CHƯA ĐĂNG NHẬP"
  elif grep -aqiE "$RE_QUOTA" "$err"; then echo "HẾT HẠN MỨC"
  elif [ "$code" = 130 ]; then echo "ĐÃ HỦY"
  elif [ "$code" != 0 ]; then echo "LỖI"
  elif [ -n "$s" ] && [ "$s" != "?" ] && [ "$s" != "SUCCESS" ]; then echo "LỖI"
  elif [ ! -s "$out" ]; then echo "TRỐNG"
  else echo "XONG"; fi
}
# Model có hạn mức riêng không dùng được? (hết hạn mức, hoặc lỗi/trống trong vài phút đầu mà không có báo cáo). $1=tên $2=mã $3=giây đã chạy; đặt LYDO
khong_dung_duoc() {
  local out="$OUT/$1.md" err="$OUT/$1.err" bao_cao=0
  case "$2" in 124|125|130) return 1 ;; esac
  touch "$out" "$err"
  grep -aqiE "$RE_AUTH" "$err" && return 1
  grep -aq '^KẾT QUẢ:' "$out" && bao_cao=1
  [ "$bao_cao" = 1 ] && [ "$2" = 0 ] && return 1
  if grep -aqiE "$RE_QUOTA" "$err"; then LYDO="hết hạn mức"; return 0; fi
  if [ "$3" -lt "$HM_NHANH_SEC" ] && [ "$bao_cao" = 0 ]; then
    if grep -aqiE "$RE_QUOTA" "$out"; then LYDO="hết hạn mức"; return 0; fi
    if [ "$2" != 0 ] || [ ! -s "$out" ]; then LYDO="không trả lời: $(head -c 100 "$err" | an_toan)"; return 0; fi
  fi
  return 1
}

# ---------- tiến trình nền (script tự gọi lại chính nó) ----------
_worker() {
  local name=$1 mode=$2 model=$3 limit=$4 effort=${5:-}
  local out="$OUT/$name.md" stream="$OUT/$name.stream" err="$OUT/$name.err" st="$OUT/$name.status"
  local lim="$OUT/$name.limit" hb="$OUT/$name.heartbeat" marker="$OUT/$name.marker" pf
  pf=$(meta_get "$name" prompt)
  local start now elapsed idle cap child code restarts=0 ext=0 last_act last_sizes="" sizes t_launch=0
  local vong_rieng tiep_vong du_phong du_phong_eff nhom
  vong_rieng=$(meta_get "$name" vong_rieng); tiep_vong=$(meta_get "$name" tiep_vong)
  du_phong=$(meta_get "$name" du_phong); du_phong_eff=$(meta_get "$name" du_phong_effort)
  start=$(date +%s); cap=$(tran "$mode")
  echo "RUNNING $$ $start" > "$st"; echo "$limit" > "$lim"; echo "$start" > "$hb"   # tiến trình nền là một bash riêng → $$ là PID của nó

  launch() {  # $1 = "" | tiep
    local prompt="Đọc AGENTS.md rồi đọc docs/tasks/$name.md và thực hiện đúng nội dung trong đó. Kết thúc bằng mục BÁO CÁO CUỐI theo khung trong file đó."
    if [ "${1:-}" = tiep ]; then
      prompt+=" LƯU Ý: lượt trước của bạn bị ngắt giữa chừng. Các file sau đã được sửa dở trong cây làm việc: $(thay_doi | awk '{print $2}' | tr '\n' ' '). Đọc lại chúng, kiểm tra, làm tiếp cho xong; không làm lại từ đầu."
    elif [ "$tiep_vong" = 1 ]; then
      prompt+=" LƯU Ý: đây là vòng tiếp theo của cùng phiếu. Các file sau đang chứa phần đã làm ở vòng trước (chưa commit): $(thay_doi | awk '{print $2}' | tr '\n' ' '). Đọc lại chúng, sửa tiếp theo mục \"Kết quả kiểm thử lần trước\" trong phiếu; không làm lại từ đầu."
    fi
    local -a args=(-p "$prompt" --dangerously-skip-permissions --print-timeout "$((cap + 5))m" --model "$model")
    [ -n "$effort" ] && args+=(--effort "$effort")
    if [ "$AGY_FORMAT" = stream ]; then
      args+=(--output-format stream-json)
      agy "${args[@]}" >>"$stream" 2>>"$err" &
    else
      agy "${args[@]}" >>"$out" 2>>"$err" &
    fi
    child=$!
    touch "$marker"; last_act=$(date +%s); last_sizes=""; t_launch=$last_act
    log_ghi "$name" "KHỞI CHẠY lần $((restarts + 1)) (model $model${effort:+ --effort $effort}, giới hạn $(cat "$lim") phút, trần $cap)"
  }
  trap 'kill_tree "$child"; echo "DONE 130 $(( $(date +%s) - start ))" > "$st"; exit 130' TERM INT
  launch

  while :; do
    while :; do
      sleep "$AGY_TICK_SEC"
      if ! kill -0 "$child" 2>/dev/null; then wait "$child" 2>/dev/null; code=$?; break; fi
      now=$(date +%s)
      sizes=$(kich_thuoc "$stream" "$out" "$err")
      if [ "$sizes" != "$last_sizes" ]; then last_sizes=$sizes; last_act=$now; fi
      if [ -n "$(find . \( -path ./.git -o -path ./node_modules -o -path ./docs/gemini-out \) -prune -o -type f ! -name .DS_Store -newer "$marker" -print 2>/dev/null | head -n 1)" ]; then
        touch "$marker"; last_act=$now
      fi
      echo "$last_act" > "$hb"
      elapsed=$(( now - start )); idle=$(( now - last_act )); limit=$(cat "$lim")
      if [ "$idle" -ge "$AGY_IDLE_SEC" ]; then
        if [ "$restarts" -lt "$AGY_MAX_RESTART" ]; then
          kill_tree "$child"; restarts=$(( restarts + 1 ))
          log_ghi "$name" "ĐỨNG IM $(( AGY_IDLE_SEC / 60 )) phút → GIAO LẠI (lần $restarts), giữ phần đã làm"
          printf 'restarts=%s\n' "$restarts" >> "$OUT/$name.meta"
          launch tiep; continue
        fi
        kill_tree "$child"; code=125
        log_ghi "$name" "ĐỨNG IM lần thứ $(( restarts + 1 )) → dừng hẳn"; break
      fi
      if [ "$elapsed" -ge $(( limit * AGY_MIN_SEC )) ]; then
        if [ "$idle" -lt "$AGY_IDLE_SEC" ] && dung_huong "$mode" "$pf"; then
          if [ $(( limit + AGY_EXT_MIN )) -le "$cap" ]; then
            limit=$(( limit + AGY_EXT_MIN )); echo "$limit" > "$lim"; ext=$(( ext + 1 ))
            log_ghi "$name" "GIA HẠN +$AGY_EXT_MIN phút (lần $ext) → $limit phút: còn hoạt động và đúng hướng"
            printf 'gia_han=%s\n' "$ext" >> "$OUT/$name.meta"; continue
          fi
          kill_tree "$child"; code=124
          log_ghi "$name" "HẾT TRẦN $cap phút → dừng, GIỮ kết quả dở cho thợ Claude tiếp quản"; break
        fi
        kill_tree "$child"; code=124
        log_ghi "$name" "HẾT GIỜ $limit phút, không còn hoạt động hoặc lệch hướng → dừng"; break
      fi
    done

    if [ "$AGY_FORMAT" = stream ]; then
      local status_line
      if status_line=$(tach_ket_qua "$stream" "$out"); then
        printf '%s\n' "$status_line" >> "$OUT/$name.meta"
      else
        if [ -s "$stream" ]; then echo "(không có kết quả cuối — lượt bị dừng giữa chừng hoặc luồng rớt; luồng thô ở $stream)" > "$out"; else : > "$out"; fi
        printf 'STATUS=?\n' >> "$OUT/$name.meta"
      fi
    fi

    # Argon / Sonnet vòng 5 hết hạn mức hoặc không trả lời → cho nghỉ; lượt không phải vòng 4/5 chạy lại ngay bằng model dự phòng (Flash)
    nhom=$(nhom_model "$model")
    [ "$nhom" = thuong ] && break
    if khong_dung_duoc "$name" "$code" $(( $(date +%s) - t_launch )); then
      hm_can "$nhom" "$LYDO"
      log_ghi "$name" "$model: $LYDO → cho nghỉ tới $(gio_hien "$(hm_nghi_toi "$nhom")")"
      if [ "$vong_rieng" != 1 ] && [ -n "$du_phong" ]; then
        { echo "=== $model — $LYDO"; cat "$out" "$err" 2>/dev/null; } >> "$OUT/$name.$nhom.err"
        : > "$out"; : > "$err"; [ "$AGY_FORMAT" = stream ] && : > "$stream"
        printf 'doi_model=%s → %s (%s; %s nghỉ tới %s)\nmodel=%s\neffort=%s\n' "$model" "$du_phong" "$LYDO" "$(goc "$model")" \
          "$(gio_hien "$(hm_nghi_toi "$nhom")")" "$du_phong" "$du_phong_eff" >> "$OUT/$name.meta"
        log_ghi "$name" "CHẠY LẠI bằng $du_phong${du_phong_eff:+ --effort $du_phong_eff}"
        model=$du_phong; effort=$du_phong_eff; du_phong=""
        if [ -n "$(thay_doi)" ]; then launch tiep; else launch; fi
        continue
      fi
      printf 'model_nghi=1\n' >> "$OUT/$name.meta"
    else
      case "$(phan_loai "$name" "$code")" in "CHƯA ĐĂNG NHẬP"|"ĐÃ HỦY") ;; *) hm_ok "$nhom" ;; esac
    fi
    break
  done

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

  local name; name=$(basename "$pf" .md)
  local changed ngoai tiep_vong=0; changed=$(thay_doi)
  if [ -n "$changed" ]; then
    # Vòng sau của cùng phiếu (<mã>-v2 … -v5, làn ghi): chạy tiếp trên phần dở, với điều kiện mọi file đang sửa đều trong danh sách được phép
    if { [ "$mode" = code ] || [ "$mode" = sinh ]; } && [[ "$name" =~ -v[2-9]$ ]]; then
      ngoai=$(ngoai_pham_vi "$pf" "$changed") || die 1 "Vòng sau nhưng phiếu $pf không có mục \"File được phép tạo/sửa\" — không chạy tiếp trên cây làm việc chưa sạch."
      [ -n "$ngoai" ] && die 1 "Vòng sau nhưng cây làm việc có file ngoài danh sách được phép: $(echo "$ngoai" | tr '\n' ' ')— hoàn tác các file đó (git checkout -- <file>) hoặc thêm vào phiếu, rồi gọi lại."
      tiep_vong=1
    else
      die 1 "Cây làm việc chưa sạch — commit hoặc chờ thợ xong rồi mới gọi Gemini."
    fi
  fi

  local effort r vong_rieng=0 ghi_chu="" doi=""; effort=$(effort_lan "$mode")
  case "$model" in
    kho)   model=$GEMINI_KHO;  effort=$EFFORT_KHO;  vong_rieng=1 ;;   # vòng 4 nâng bậc: model mạnh hơn, cùng phiếu
    vong5) model=$MODEL_VONG5; effort=$EFFORT_VONG5; vong_rieng=1 ;;  # vòng 5: Claude Sonnet qua agy, cùng phiếu
  esac
  [ -z "$model" ] && model=$(model_lan "$mode")
  MODELS_CACHE=$(agy models 2>/dev/null)
  # Model có hạn mức riêng đang nghỉ → vòng 4/5: bỏ (MODEL NGHỈ); làn khác: chạy bằng GEMINI_CODE
  local nhom du_phong="" du_phong_eff=""; nhom=$(nhom_model "$model")
  if [ "$nhom" != thuong ] && [ "$(nhom_model "$GEMINI_CODE")" = thuong ]; then
    r=$(resolve_model "$GEMINI_CODE" "$EFFORT_CODE"); du_phong=${r%%|*}; du_phong_eff=${r#*|}
  fi
  if [ "$nhom" != thuong ] && hm_dang_nghi "$nhom"; then
    [ "$vong_rieng" = 1 ] && die 4 "MODEL NGHỈ: $(goc "$model") $(hm_mo_ta "$nhom") — bỏ vòng này, Quản lý chuyển bước kế (quan-ly.md mục \"Làn Gemini\"). Hạn mức đã có lại: bash scripts/agy-run.sh han-muc xoa"
    if [ -n "$du_phong" ]; then
      doi="$(goc "$model") → $du_phong ($(goc "$model") đang nghỉ tới $(gio_hien "$(hm_nghi_toi "$nhom")"))"
      ghi_chu=" — $(goc "$model") đang nghỉ, chạy bằng model dự phòng"
      model=$GEMINI_CODE; effort=$EFFORT_CODE; du_phong=""
    fi
  fi
  r=$(resolve_model "$model" "$effort"); model=${r%%|*}; effort=${r#*|}
  local limit; limit=$(gioi_han "$mode")
  printf 'mode=%s\nmodel=%s\neffort=%s\nprompt=%s\nstart=%s\nformat=%s\nvong_rieng=%s\ntiep_vong=%s\ndu_phong=%s\ndu_phong_effort=%s\n' \
    "$mode" "$model" "$effort" "$pf" "$(date +%s)" "$AGY_FORMAT" "$vong_rieng" "$tiep_vong" "$du_phong" "$du_phong_eff" > "$OUT/$name.meta"
  [ -n "$doi" ] && printf 'doi_model=%s\n' "$doi" >> "$OUT/$name.meta"
  rm -f "$OUT/$name.md" "$OUT/$name.err" "$OUT/$name.stream" "$OUT/$name.log" "$OUT/$name.heartbeat" "$OUT/$name.limit" "$OUT/$name.marker" "$OUT/$name".*.err
  echo "RUNNING 0 $(date +%s)" > "$OUT/$name.status"
  if command -v nohup >/dev/null 2>&1; then
    nohup bash "$0" _worker "$name" "$mode" "$model" "$limit" "$effort" >/dev/null 2>&1 &
  else
    bash "$0" _worker "$name" "$mode" "$model" "$limit" "$effort" >/dev/null 2>&1 &
  fi
  sleep 2
  echo "ĐÃ CHẠY NỀN: $name | làn=$mode | model=$model${effort:+ --effort $effort} | giới hạn=${limit} phút (tự gia hạn tới trần $(tran "$mode"))$ghi_chu"
  [ "$tiep_vong" = 1 ] && echo "VÒNG SAU: chạy tiếp trên phần dở của vòng trước (mọi file đang sửa đều trong danh sách được phép)"
  echo "Đợi bằng: bash scripts/agy-run.sh cho $name"
}

# ---------- đợi ----------
cho() {
  local name=$1 wait=${2:-100} st="$OUT/$1.status" state a b t0 now limit cap hb idle mode
  [ -f "$st" ] || die 42 "Không có lượt tên $name."
  mode=$(meta_get "$name" mode); cap=$(tran "${mode:-code}")
  t0=$(date +%s)
  while :; do
    sua_status_chet "$st"
    read -r state a b < "$st"
    case $state in
      RUNNING)
        now=$(date +%s)
        if (( now - t0 >= wait )); then
          limit=$(cat "$OUT/$name.limit" 2>/dev/null || echo "?"); hb=$(cat "$OUT/$name.heartbeat" 2>/dev/null || echo "$b"); idle=$(( now - hb ))
          echo "ĐANG CHẠY: $name — đã $(( (now - b) / 60 )) phút / giới hạn $limit (trần $cap) — hoạt động gần nhất: $(( idle / 60 )) phút trước → $([ "$idle" -lt "$AGY_IDLE_SEC" ] && echo ĐANG LÀM || echo "ĐỨNG IM, script sẽ giao lại/dừng") — giao lại: $(R=$(meta_get "$name" restarts); echo "${R:-0}")"
          [ -f "$OUT/$name.log" ] && tail -n 2 "$OUT/$name.log"
          echo "Gọi lại: bash scripts/agy-run.sh cho $name"
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

# ---------- tổng kết ----------
ket_qua() {
  local name=$1 st="$OUT/$1.status" out="$OUT/$1.md" err="$OUT/$1.err" state code secs mode model pf cls agystatus
  [ -f "$st" ] || die 42 "Không có lượt tên $name."
  sua_status_chet "$st"
  read -r state code secs < "$st"
  [ "$state" = "RUNNING" ] && die 3 "Lượt $name vẫn đang chạy — dùng: bash scripts/agy-run.sh cho $name"
  mode=$(meta_get "$name" mode); model=$(meta_get "$name" model); pf=$(meta_get "$name" prompt); agystatus=$(meta_get "$name" STATUS)
  touch "$out" "$err"
  cls=$(phan_loai "$name" "$code")

  local changed reverted="" untracked_out="" line status path giu_do=""
  changed=$(thay_doi)
  if lan_chi_doc "$mode"; then
    if [ -n "$changed" ]; then hoan_tac_tat_ca; reverted="TOÀN BỘ (làn chỉ đọc mà Gemini đã sửa file — đã hoàn tác)"; changed=""; fi
  else
    if [ -n "$changed" ] && [ -f "$pf" ]; then
      doc_ds "$pf"
      if [ ${#DS[@]} -gt 0 ]; then
        while IFS= read -r line; do
          [ -z "$line" ] && continue
          status=${line:0:2}; path=${line:3}
          duoc_phep "$path" "${DS[@]}" && continue
          if [ "$status" = "??" ]; then untracked_out+="$path"$'\n'
          else git checkout -- "$path" 2>/dev/null && reverted+="$path"$'\n'; fi
        done <<< "$changed"
        changed=$(thay_doi)
      fi
    fi
    case $cls in QUÁ\ GIỜ|ĐỨNG\ IM|LỖI|TRỐNG|HẾT\ HẠN\ MỨC|MODEL\ NGHỈ) [ -n "$changed" ] && giu_do="GIỮ KẾT QUẢ DỞ: các file trên chưa hoàn tác — vòng kế tiếp hoặc thợ Claude làm tiếp (phần dở vô dụng thì hoàn tác bằng lệnh trong quan-ly.md)";; esac
  fi

  local effort R doi; effort=$(meta_get "$name" effort); R=$(meta_get "$name" restarts); R=${R:-0}; doi=$(meta_get "$name" doi_model)
  echo "KẾT QUẢ: $cls | lượt=$name | làn=$mode | model=$model${effort:+ --effort $effort} | mã=$code${agystatus:+ | agy=$agystatus} | $(( secs / 60 )) phút | giao lại: ${R:-$(meta_get "$name" restarts)} | gia hạn: $(G=$(meta_get "$name" gia_han); echo "${G:-0}")"
  [ -n "$doi" ] && echo "ĐÃ ĐỔI MODEL: $doi"
  [ "$cls" = "MODEL NGHỈ" ] && echo "MODEL NGHỈ: $(goc "$model") hết hạn mức hoặc không trả lời ở lượt này (hiện: $(hm_mo_ta "$(nhom_model "$model")")) — bỏ vòng này, Quản lý chuyển bước kế (quan-ly.md mục \"Làn Gemini\")"
  [ "$cls" = "XONG" ] && grep -a -m1 -E '^KẾT QUẢ:' "$out" | LC_ALL=C sed 's/^/Gemini tự báo — /'   # -a, LC_ALL=C: không vấp byte lạ trong output (grep/sed của macOS)
  echo "FILE THAY ĐỔI:"; if [ -n "$changed" ]; then echo "$changed"; else echo "(không)"; fi
  [ -n "$reverted" ] && { echo "ĐÃ HOÀN TÁC (ngoài phạm vi cho phép):"; echo "$reverted"; }
  [ -n "$untracked_out" ] && { echo "FILE MỚI NGOÀI PHẠM VI (chưa xóa — Quản lý quyết):"; echo "$untracked_out"; }
  [ -n "$giu_do" ] && echo "$giu_do"
  [ -f "$OUT/$name.log" ] && { echo "NHẬT KÝ LƯỢT:"; cat "$OUT/$name.log"; }
  case $cls in
    XONG|TRỐNG) echo "--- 40 dòng cuối báo cáo ($out):"; tail -n 40 "$out" ;;
    *) [ -s "$err" ] && { echo "--- 10 dòng cuối log lỗi ($err):"; tail -n 10 "$err"; }; [ -s "$out" ] && { echo "--- 15 dòng cuối phản hồi ($out):"; tail -n 15 "$out"; } ;;
  esac
  [ "$cls" = "TRỐNG" ] && echo "GỢI Ý: agy không trả kết quả — agy quá cũ, thư mục chưa được tin cậy, hoặc luồng bị rớt. Chạy 'bash scripts/agy-run.sh kiem-tra'."
  [ "$cls" = "XONG" ] && exit 0 || exit 1
}

# ---------- gia hạn bằng tay ----------
gia_han() {
  local name=$1 them=${2:-15} st="$OUT/$1.status" state a b limit cap mode
  [ -f "$st" ] || die 42 "Không có lượt tên $name."
  read -r state a b < "$st"; [ "$state" = "RUNNING" ] || die 1 "Lượt $name không còn chạy."
  mode=$(meta_get "$name" mode); cap=$(tran "${mode:-code}"); limit=$(cat "$OUT/$name.limit")
  [ $(( limit + them )) -le "$cap" ] || them=$(( cap - limit ))
  [ "$them" -gt 0 ] || die 1 "Đã ở trần $cap phút, không gia hạn thêm được."
  echo $(( limit + them )) > "$OUT/$name.limit"
  log_ghi "$name" "GIA HẠN BẰNG TAY +$them phút → $(( limit + them )) phút"
  echo "ĐÃ GIA HẠN: $name → $(( limit + them )) phút (trần $cap)"
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
    log_ghi "$name" "HỦY bằng tay"
  fi
  hoan_tac_tat_ca
  echo "ĐÃ HỦY: $name — mọi thay đổi trong cây làm việc đã hoàn tác."
}

# ---------- kiểm tra cài đặt ----------
thu_mot_cau() {  # $1=slug $2=effort $3=tiền tố file kết quả $4=giây tối đa → 0 nếu model trả lời được
  local -a a=(--model "$1"); [ -n "$2" ] && a+=(--effort "$2")
  ( agy -p "Trả lời đúng một từ: ok" --dangerously-skip-permissions --print-timeout 2m "${a[@]}" >"$3.md" 2>"$3.err" ) & local p=$!
  local i=0; while kill -0 $p 2>/dev/null && [ $i -lt "$4" ]; do sleep 1; i=$((i+1)); done; kill -0 $p 2>/dev/null && kill_tree $p
  grep -qi 'ok' "$3.md" 2>/dev/null
}

kiem_tra() {
  local ok=0 v
  [ -d .claude ] || { echo "[X] Hãy chạy từ thư mục gốc dự án (nơi có .claude/)."; exit 42; }
  git rev-parse --is-inside-work-tree >/dev/null 2>&1 && echo "[OK] kho git" || { echo "[X] chưa git init"; ok=1; }
  command -v nohup >/dev/null 2>&1 && echo "[OK] có lệnh nohup" || echo "[!] thiếu nohup — vẫn chạy nền được"
  command -v node >/dev/null 2>&1 && echo "[OK] có node (tách kết quả luồng JSON)" || { echo "[!] thiếu node — dùng chế độ text, đo hoạt động chỉ bằng file thay đổi"; AGY_FORMAT=text; }
  if ! command -v agy >/dev/null 2>&1; then echo "[X] chưa có agy trong PATH — cài từ https://antigravity.google/cli rồi mở lại cửa sổ terminal (Git Bash / Terminal)"; exit 127; fi
  v=$(agy --version 2>/dev/null | head -n 1); echo "[OK] agy: ${v:-?}"
  mkdir -p "$OUT"
  local models lane base r slug eff
  models=$(agy models 2>/dev/null); MODELS_CACHE=$models
  [ -z "$models" ] && { echo "[X] 'agy models' không trả về gì — chưa đăng nhập? chạy 'agy' tương tác, đăng nhập, /quit"; ok=1; }
  co_model() { echo "$models" | grep -qE "(^|[[:space:]])$1(-(high|medium|low))?([[:space:]]|\$)"; }  # khớp nguyên slug, không khớp chuỗi con
  goi_y() {  # slug trên máy có cùng từ khóa (argon/flash/sonnet/opus/pro) với model đang thiếu
    local kw="" k; for k in argon flash sonnet opus pro; do echo "$1" | grep -qi "$k" && { kw=$k; break; }; done; [ -n "$kw" ] || return 0
    local g; g=$(echo "$models" | grep -i "$kw" | awk '{print $1}' | tr '\n' ' ')
    [ -n "$g" ] && echo " — trên máy này có: $g(chép đúng tên vào scripts/gemini.env)"
  }
  for lane in code soat doc sinh ytuong; do
    base=$(model_lan "$lane")
    if co_model "$base"; then
      r=$(resolve_model "$base" "$(effort_lan "$lane")"); slug=${r%%|*}; eff=${r#*|}
      echo "[OK] làn $lane → $slug${eff:+ --effort $eff}"
    else
      echo "[X] làn $lane: không thấy '$base' trong 'agy models' — sửa dòng tương ứng trong scripts/gemini.env$(goi_y "$base")"; ok=1
    fi
  done
  base=$GEMINI_KHO
  if co_model "$base"; then
    r=$(resolve_model "$base" "$EFFORT_KHO"); slug=${r%%|*}; eff=${r#*|}
    echo "[OK] nâng bậc code (kho) → $slug${eff:+ --effort $eff}"
  else
    echo "[X] nâng bậc code (kho): không thấy '$base' trong 'agy models' — sửa GEMINI_KHO trong scripts/gemini.env$(goi_y "$base")"; ok=1
  fi
  base=$MODEL_VONG5   # vòng 5 là tùy chọn: thiếu tên chỉ cảnh báo, làn vẫn SẴN SÀNG
  if co_model "$base"; then
    r=$(resolve_model "$base" "$EFFORT_VONG5"); slug=${r%%|*}; eff=${r#*|}
    echo "[OK] vòng 5 (vong5, Claude qua agy) → $slug${eff:+ --effort $eff}"
  else
    echo "[!] vòng 5: không thấy '$base' trong 'agy models' — vòng 5 sẽ tự bỏ qua; muốn dùng thì sửa MODEL_VONG5 trong scripts/gemini.env$(goi_y "$base")"
  fi
  r=$(resolve_model "$GEMINI_CODE" "$EFFORT_CODE"); slug=${r%%|*}; eff=${r#*|}
  local -a targs=(--model "$slug"); [ -n "$eff" ] && targs+=(--effort "$eff")
  local combo_code="$slug${eff:+ --effort $eff}"
  local t="$OUT/_kiem-tra" fmt_ok=""
  rm -f "$t".*
  if [ "$AGY_FORMAT" = stream ]; then
    echo "... thử headless dạng stream-json (tối đa 3 phút)"
    ( agy -p "Trả lời đúng một từ: ok" --dangerously-skip-permissions --print-timeout 2m --output-format stream-json "${targs[@]}" >"$t.stream" 2>"$t.err" ) & local p=$!
    local i=0; while kill -0 $p 2>/dev/null && [ $i -lt 180 ]; do sleep 1; i=$((i+1)); done; kill -0 $p 2>/dev/null && kill_tree $p
    if tach_ket_qua "$t.stream" "$t.md" >/dev/null && grep -qi 'ok' "$t.md"; then fmt_ok=stream; echo "[OK] headless stream-json trả lời được: $(head -c 80 "$t.md" | an_toan)"
    else echo "[!] stream-json không cho kết quả tách được — thử dạng text"; fi
  fi
  if [ -z "$fmt_ok" ]; then
    echo "... thử headless dạng text (tối đa 3 phút)"
    ( agy -p "Trả lời đúng một từ: ok" --dangerously-skip-permissions --print-timeout 2m "${targs[@]}" >"$t.md" 2>"$t.err" ) & local p2=$!
    local j=0; while kill -0 $p2 2>/dev/null && [ $j -lt 180 ]; do sleep 1; j=$((j+1)); done; kill -0 $p2 2>/dev/null && kill_tree $p2
    if grep -qi 'ok' "$t.md"; then fmt_ok=text; echo "[OK] headless text trả lời được: $(head -c 80 "$t.md" | an_toan)"; fi
  fi
  if [ -z "$fmt_ok" ]; then
    if grep -qiE "$RE_AUTH" "$t.err"; then echo "[X] chưa đăng nhập — chạy 'agy' tương tác trong thư mục này, đăng nhập Google, /quit"
    elif grep -qiE "$RE_QUOTA" "$t.err"; then echo "[X] hết hạn mức / 429 — đợi cửa sổ hạn mức mới, hoặc đăng xuất/đăng nhập lại"
    else echo "[X] headless không trả lời được — agy cũ hoặc thư mục chưa được tin cậy: cài lại agy mới nhất, chạy 'agy' tương tác ở đây một lần rồi /quit"; fi
    ok=1
  elif [ "$fmt_ok" != "$AGY_FORMAT" ]; then
    mkdir -p scripts; grep -v '^AGY_FORMAT=' scripts/gemini.env 2>/dev/null > scripts/gemini.env.tmp || true
    echo "AGY_FORMAT=$fmt_ok" >> scripts/gemini.env.tmp; mv scripts/gemini.env.tmp scripts/gemini.env
    echo "[!] đã ghi AGY_FORMAT=$fmt_ok vào scripts/gemini.env — commit file này trước khi giao việc cho Gemini (cây làm việc phải sạch): git add scripts/gemini.env && git commit -m \"kiem-tra: AGY_FORMAT=$fmt_ok\""
  fi
  # Thử một câu ngắn với các model có hạn mức riêng: mọi dạng Argon đang dùng (high cho soát chéo/ý tưởng, medium cho vòng 4) và Sonnet vòng 5.
  # Hết hạn mức / không trả lời → script cho model đó nghỉ; làn vẫn SẴN SÀNG (làn Argon tạm chạy Flash, vòng 4/5 tự bỏ)
  if [ -n "$fmt_ok" ]; then
    local ln b2 e2 combo q=0 n=0 lydo="" da_thu="|$combo_code|"
    local -a tot=(); local -a hong=()
    for ln in soat ytuong doc code sinh kho; do
      if [ "$ln" = kho ]; then b2=$GEMINI_KHO; e2=$EFFORT_KHO; else b2=$(model_lan "$ln"); e2=$(effort_lan "$ln"); fi
      { [ "$(nhom_model "$b2")" = manh ] && co_model "$b2"; } || continue
      r=$(resolve_model "$b2" "$e2"); slug=${r%%|*}; eff=${r#*|}; combo="$slug${eff:+ --effort $eff}"
      case "$da_thu" in *"|$combo|"*) [ "$combo" = "$combo_code" ] && tot+=("$combo"); continue ;; esac
      da_thu+="$combo|"; n=$((n + 1))
      echo "... thử Argon $combo một câu ngắn (tối đa 2 phút)"
      if thu_mot_cau "$slug" "$eff" "$t.manh$n" 120; then tot+=("$combo"); echo "[OK] Argon $combo trả lời được"
      else hong+=("$combo"); grep -qiE "$RE_QUOTA" "$t.manh$n.err" && q=1; lydo=$(head -c 120 "$t.manh$n.err" | an_toan); fi
    done
    if [ ${#tot[@]} -gt 0 ]; then
      hm_ok manh
      if [ ${#hong[@]} -gt 0 ]; then
        for combo in "${hong[@]}"; do echo "[X] Argon dạng '$combo' không chạy được trong khi dạng khác chạy được — mở 'agy models', chép đúng tên kèm hậu tố (vd. gemini-4-argon-medium) vào dòng dùng dạng này trong scripts/gemini.env, hoặc đổi effort dòng đó sang mức chạy được"; done
        ok=1
      fi
    elif [ ${#hong[@]} -gt 0 ]; then
      if [ $q = 1 ]; then hm_can manh "hết hạn mức"; else hm_can manh "không trả lời: $lydo"; fi
      echo "[!] Argon: $(hm_mo_ta manh) — soát chéo/ý tưởng tạm chạy Flash, vòng 4 tự bỏ qua; script tự thử lại khi hết nghỉ"
    fi
    if co_model "$MODEL_VONG5"; then
      r=$(resolve_model "$MODEL_VONG5" "$EFFORT_VONG5"); slug=${r%%|*}; eff=${r#*|}
      echo "... thử vòng 5 ($slug${eff:+ --effort $eff}) một câu ngắn (tối đa 2 phút)"
      if thu_mot_cau "$slug" "$eff" "$t.vong5" 120; then hm_ok vong5; echo "[OK] vòng 5 ($slug) trả lời được"
      else
        if grep -qiE "$RE_QUOTA" "$t.vong5.err"; then hm_can vong5 "hết hạn mức"; else hm_can vong5 "không trả lời: $(head -c 120 "$t.vong5.err" | an_toan)"; fi
        echo "[!] vòng 5: $(hm_mo_ta vong5) — vòng 5 tự bỏ qua tới khi hết nghỉ"
      fi
    fi
  fi
  [ $ok -eq 0 ] && echo "KẾT LUẬN: SẴN SÀNG" || echo "KẾT LUẬN: CHƯA SẴN SÀNG — sửa các dòng [X] ở trên"
  exit $ok
}

trang_thai() {
  local f n now; now=$(date +%s)
  for f in "$OUT"/*.status; do
    [ -f "$f" ] || { echo "(chưa có lượt nào)"; return; }
    sua_status_chet "$f"; n=$(basename "$f" .status)
    echo "$n: $(cat "$f") | hoạt động gần nhất: $(( (now - $(cat "$OUT/$n.heartbeat" 2>/dev/null || echo "$now")) / 60 )) phút trước | giới hạn: $(cat "$OUT/$n.limit" 2>/dev/null || echo '?') phút"
  done
}

# ---------- hạn mức: xem / xóa trạng thái nghỉ ----------
han_muc() {
  if [ "${1:-}" = xoa ]; then rm -f "$HM_FILE"; echo "ĐÃ XÓA trạng thái nghỉ — Argon và Sonnet vòng 5 được dùng lại từ lượt kế tiếp."; return 0; fi
  local ln lanes=""
  for ln in code soat doc sinh ytuong; do [ "$(nhom_model "$(model_lan "$ln")")" = manh ] && lanes+="$ln "; done
  lanes=${lanes% }
  echo "Argon $(goc "$GEMINI_KHO") (vòng 4; làn: ${lanes:-không}): $(hm_mo_ta manh)"
  echo "Vòng 5 $(goc "$MODEL_VONG5") qua agy: $(hm_mo_ta vong5)"
  echo "Argon nghỉ → làn ${lanes:-Argon} tự chạy bằng $(goc "$GEMINI_CODE"), vòng 4 bỏ qua. Vòng 5 nghỉ → bỏ vòng 5. Hạn mức thật: /usage trong agy. Đã có lại sớm: bash scripts/agy-run.sh han-muc xoa"
}

case "${1:-}" in
  doc|soat|sinh|code|ytuong) [ -n "${2:-}" ] || die 42 "Cách dùng: agy-run.sh <code|sinh|soat|doc|ytuong> docs/tasks/<ten>.md [model|kho|vong5]"; chay "$1" "$2" "${3:-}" ;;
  cho)        [ -n "${2:-}" ] || die 42 "Cách dùng: agy-run.sh cho <ten> [giây]"; cho "$2" "${3:-100}" ;;
  ket-qua)    [ -n "${2:-}" ] || die 42 "Cách dùng: agy-run.sh ket-qua <ten>"; ket_qua "$2" ;;
  gia-han)    [ -n "${2:-}" ] || die 42 "Cách dùng: agy-run.sh gia-han <ten> [phút]"; gia_han "$2" "${3:-15}" ;;
  huy)        [ -n "${2:-}" ] || die 42 "Cách dùng: agy-run.sh huy <ten>"; huy "$2" ;;
  kiem-tra)   kiem_tra ;;
  trang-thai) trang_thai ;;
  han-muc)    han_muc "${2:-}" ;;
  _worker)    _worker "$2" "$3" "$4" "$5" "${6:-}" ;;
  *) sed -n '2,13p' "$0"; exit 42 ;;
esac
