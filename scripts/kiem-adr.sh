#!/usr/bin/env bash
# =============================================================================
# Kiểm các quyết định kiến trúc trong docs/08-quyet-dinh-kien-truc/ còn hiệu lực
# =============================================================================
# ADR thường chỉ là văn bản. Viết xong để đó, code đi một đường, tài liệu đi một
# nẻo, và không có tín hiệu nào báo là quyết định đã bị phá.
#
# Script này chạy phần "Kiểm chứng bằng cách nào" của từng ADR. Ai đi tắt qua
# tầng BFF, ai lưu token vào localStorage, ai thêm cột điểm tổng vào cơ sở dữ
# liệu — script đỏ ngay.
#
# Chỉ chạy các phép kiểm NHANH (grep). Phần chạy test nằm trong CI của backend
# và BFF rồi, không lặp lại ở đây.
#
# Dùng:  bash scripts/kiem-adr.sh
# =============================================================================

set -uo pipefail
cd "$(dirname "$0")/.."

SO_LOI=0

# Bỏ các dòng đã bị chú thích trước khi kiểm.
#
# Vì sao cần: phép kiểm đầu tiên viết ra KHÔNG bắt được lỗi. Thử bằng cách
# comment dòng `credentials: "include"` trong http.ts thì script vẫn báo xanh —
# vì dòng `// credentials: "include",` VẪN CHỨA đúng chuỗi đang tìm.
#
# Một cái gác không bắt được lỗi còn tệ hơn không có gác: nó tạo cảm giác an
# toàn giả. Nên lọc bỏ dòng bắt đầu bằng // hoặc # hoặc * trước khi grep.
loc_dong_song() {
  grep -rhE "$@" 2>/dev/null | grep -vE '^\s*(//|#|\*|/\*)'
}

# Kiểm một mẫu PHẢI xuất hiện trong code đang chạy (không tính dòng chú thích).
phai_co() {
  local mo_ta="$1" mau="$2"; shift 2
  if [ -n "$(loc_dong_song "$mau" "$@")" ]; then
    printf '  ✅ %s\n' "$mo_ta"
  else
    printf '  ❌ %s\n' "$mo_ta"
    printf '     không tìm thấy /%s/ trong code đang chạy của: %s\n' "$mau" "$*"
    printf '     (dòng đã bị chú thích không tính)\n'
    SO_LOI=$((SO_LOI + 1))
  fi
}

# Kiểm một mẫu KHÔNG được xuất hiện.
khong_duoc_co() {
  local mo_ta="$1" mau="$2"; shift 2
  local thay
  thay=$(grep -rnE "$mau" "$@" 2>/dev/null | grep -vE ':\s*(//|#|\*|/\*)' || true)
  if [ -z "$thay" ]; then
    printf '  ✅ %s\n' "$mo_ta"
  else
    printf '  ❌ %s\n' "$mo_ta"
    printf '%s\n' "$thay" | sed 's/^/     /'
    SO_LOI=$((SO_LOI + 1))
  fi
}

echo "ADR-001 — Chèn tầng BFF giữa React và Spring Boot"
phai_co "BFF đặt cookie httpOnly" \
        "httpOnly: true" bff/src/common/cookies.ts
khong_duoc_co "Frontend không lưu token vào localStorage" \
        "localStorage\.(set|get)Item\(['\"]?(shms_at|shms_rt|token|accessToken)" frontend/src
khong_duoc_co "Frontend không gọi thẳng backend, bỏ qua BFF" \
        "localhost:8080" frontend/src

echo
echo "ADR-002 — JWT trong cookie httpOnly, chống CSRF double-submit"
phai_co "Guard bỏ qua các phương thức an toàn" \
        "SAFE_METHODS" bff/src/common/csrf.guard.ts
phai_co "Cookie CSRF cố ý KHÔNG httpOnly để client đọc được" \
        "httpOnly: false" bff/src/common/cookies.ts
phai_co "Lớp axios gửi kèm cookie" \
        "withCredentials: true" frontend/src/api/client.ts
phai_co "Lớp fetch gửi kèm cookie" \
        "credentials: \"include\"" frontend/src/api/http.ts
phai_co "Lớp fetch gắn header CSRF" \
        "X-XSRF-TOKEN" frontend/src/api/http.ts

echo
echo "ADR-003 — Chấm điểm rubric có trọng số"
khong_duoc_co "Cơ sở dữ liệu không có cột điểm tổng gộp sẵn" \
        "total_score|final_score|diem_tong" backend/src/main/resources/db/migration
phai_co "Điểm tổng được tính ra lúc chạy" \
        "computeWeightedTotal" backend/src/main/java/com/seal/hackathon/service/RankingService.java
phai_co "Luật trọng số vẫn tồn tại" \
        "MAX_TOTAL" backend/src/main/java/com/seal/hackathon/service/CriterionWeightPolicy.java

echo
if [ "$SO_LOI" -eq 0 ]; then
  echo "Cả 3 ADR còn hiệu lực — 11/11 phép kiểm đạt."
  exit 0
fi

echo "$SO_LOI phép kiểm KHÔNG đạt."
echo
echo "Nghĩa là code đã đi chệch khỏi một quyết định kiến trúc đã chốt. Chọn một:"
echo "  - sửa code cho khớp lại với ADR, hoặc"
echo "  - viết ADR mới thay thế ADR cũ (đừng sửa ADR cũ — xem quy ước ở"
echo "    docs/08-quyet-dinh-kien-truc/README.md)"
exit 1
