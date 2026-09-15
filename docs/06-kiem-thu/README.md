# Kiểm thử

**Chưa có kế hoạch kiểm thử viết tay.** Số liệu thật, cập nhật 15/09/2026:

| Tầng | Số test | Cách chạy |
|---|---|---|
| Backend | 53 | `cd backend && ./mvnw test` |
| Frontend | 59 | `cd frontend && npm test` |
| BFF | 19 | `cd bff && npm test` |

Cả ba đều chạy tự động trong CI — xem `.github/workflows/`.

## Chỗ còn mỏng

`backend/src/main/java/.../service/` có **23 service** nhưng chỉ **9 file test**.
Các service chưa có test riêng, xếp theo mức độ đáng viết trước:

1. `PublicVotingService` — có logic chặn bình chọn trùng, đáng kiểm
2. `DisqualificationService` — thao tác không hoàn tác được
3. `PrizeService` — tính giải tự động
4. `MentorService`
5. `AuditService`
