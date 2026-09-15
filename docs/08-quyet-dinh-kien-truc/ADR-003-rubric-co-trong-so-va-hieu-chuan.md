# ADR-003 — Chấm điểm theo rubric có trọng số, kèm vòng hiệu chuẩn

| | |
|---|---|
| **Trạng thái** | Đang áp dụng |
| **Ngày** | 2026-07 (ghi lại 2026-09-15) |
| **Liên quan** | [SRS §3.9](../01-yeu-cau/SRS.md) — mô-đun thu thập dữ liệu nghiên cứu (RBL) |

## Bối cảnh

Đề tài không chỉ yêu cầu một hệ thống chấm điểm chạy được. [SRS §1.2](../01-yeu-cau/SRS.md)
nêu rõ hệ thống còn là **công cụ thu thập dữ liệu cho nghiên cứu về độ tin cậy liên
đánh giá viên** (inter-rater reliability).

Hai mục tiêu này kéo thiết kế về hai hướng khác nhau:

- Vận hành muốn **một con số cuối** để xếp hạng — càng gọn càng tốt
- Nghiên cứu muốn **giữ nguyên từng điểm thô** của từng giám khảo trên từng tiêu chí —
  gộp lại là mất dữ liệu, không khôi phục được

Ngoài ra còn vấn đề công bằng: hai giám khảo chấm cùng một bài có thể lệch nhau
nhiều. Người chấm "chặt" và người chấm "rộng" cho cùng một bài hai điểm rất khác nhau,
mà đội thi thì chịu hậu quả.

## Các phương án đã cân nhắc

**1. Mỗi giám khảo cho một điểm tổng (0–100).**
Gọn nhất. Nhưng mất trắng dữ liệu nghiên cứu — không biết lệch nhau ở tiêu chí nào,
và không giải thích được cho đội thi vì sao bị điểm đó.

**2. Chấm theo tiêu chí, lưu điểm tổng đã gộp sẵn.**
Có rubric, nhưng gộp lúc ghi. Vẫn mất điểm thô — muốn phân tích lại phải chấm lại.

**3. Lưu điểm thô ở mức chi tiết nhất, tính tổng khi cần.** ← đã chọn
Mỗi bản ghi `Score` = (một giám khảo, một tiêu chí, một bài nộp). Điểm tổng là kết
quả **tính ra** chứ không phải dữ liệu lưu.

## Quyết định

**Lưu ở mức chi tiết nhất.** Bảng `score` giữ từng cặp (giám khảo × tiêu chí × bài
nộp). Không có cột nào chứa điểm tổng.

**Tính điểm tổng có chuẩn hoá.** `RankingService.computeWeightedTotal()` (dòng 143):

```java
avg          = trung bình điểm của MỌI giám khảo cho tiêu chí đó
normalized   = avg / criterion.maxScore        // đưa về thang 0–1
contribution = normalized × criterion.weight   // nhân trọng số
total        = tổng contribution của mọi tiêu chí
```

Bước `normalized` là chỗ quan trọng: nhờ chia cho `maxScore` mà tiêu chí thang 10 và
tiêu chí thang 100 trộn chung được, trọng số vẫn có ý nghĩa.

**Trọng số quy ước tổng 100, nhưng chỉ chặn khi VƯỢT.**
`CriterionWeightPolicy` chặn tổng > 100, **không** bắt buộc đủ 100. Lý do rất thực tế:
bắt buộc đủ 100 thì không ai thêm được tiêu chí đầu tiên — tiêu chí đầu luôn làm tổng
nhỏ hơn 100. Giao diện chỉ cảnh báo khi chưa đủ.

**Vòng hiệu chuẩn.** Trước vòng chấm thật, mọi giám khảo chấm chung một bài mẫu.
`VarianceDashboardService` tính trung bình và độ lệch chuẩn (dòng 57–65) để Ban tổ
chức thấy ai lệch khỏi nhóm và trao đổi trước khi chấm thật.

## Đánh đổi

**Tốn nhiều lời gọi để dựng lại một con số.** Muốn biết một bài đã chấm xong chưa,
phải lấy tiêu chí của vòng, lấy điểm của bài, rồi đếm. Đây là nguyên nhân trực tiếp
khiến trang chủ giám khảo tốn **28 lời gọi API** cho một màn hình, và đã từng làm BFF
trả `ThrottlerException`. Cách sửa gốc là thêm endpoint gộp ở backend — chưa làm.

**Hiệu chuẩn chỉ đo, không ép.** Hệ thống hiện ra số liệu lệch nhưng **không** tự
điều chỉnh điểm, cũng không chặn giám khảo lệch quá mức. Quyết định cuối vẫn là của
con người. Đúng với mục tiêu nghiên cứu (không can thiệp vào dữ liệu), nhưng nghĩa là
hiệu chuẩn **không tự động làm cho kết quả công bằng hơn** — nó chỉ cho người ta thấy
vấn đề.

**Điểm tổng có thể đổi khi thêm giám khảo.** Vì `avg` tính trên mọi giám khảo đã
chấm, một giám khảo chấm muộn sẽ làm thay đổi điểm đã hiển thị. Chấp nhận được, nhưng
phải chốt đủ điểm trước khi công bố kết quả.

## Kiểm chứng bằng cách nào

```bash
# 1. Bảng score KHÔNG có cột điểm tổng — phải không ra kết quả nào
grep -in "total_score\|final_score" backend/src/main/resources/db/migration/*.sql

# 2. Điểm tổng được TÍNH RA, không lưu
grep -n "computeWeightedTotal" backend/src/main/java/com/seal/hackathon/service/RankingService.java

# 3. Luật trọng số vẫn chặn khi vượt 100 — 6 test
cd backend && ./mvnw test -Dtest=CriterionWeightPolicyTest

# 4. Xếp hạng tính đúng — test riêng
cd backend && ./mvnw test -Dtest=RankingServiceTest
```

Điều 1 phải **không ra kết quả nào**. Ra kết quả nghĩa là có ai đó đã thêm cột điểm
tổng vào cơ sở dữ liệu — lúc đó dữ liệu thô không còn là nguồn sự thật duy nhất, và
mục tiêu nghiên cứu của đề tài bị phá.
