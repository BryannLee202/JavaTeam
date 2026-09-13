# coordinator-service (Backend — P3)

Spring Boot service quản lý `HackathonEvent`, `Track`, `Round`, `RoundCriterion` —
tầng nền móng mà Team/Submission/Prize/Ranking (module khác) tham chiếu tới.

## Chạy thử (dùng H2 in-memory, không cần cài DB)

```bash
mvn spring-boot:run
```

Service chạy ở `http://localhost:8080`. Console H2 (xem dữ liệu trực tiếp): `http://localhost:8080/h2-console`
(JDBC URL: `jdbc:h2:mem:coordinator`, user `sa`, pass rỗng).

## Quyết định về đặt tên trường (đã áp dụng)

Ban đầu có 2 lựa chọn: đổi backend theo tên nội bộ cũ (`orderIndex` phẳng) hoặc
đổi theo đúng tên frontend đang dùng. **Đã chọn: backend đổi theo frontend** —
để không phải sửa lại UI đã code xong. Kết quả:

- `RoundRequest`/`RoundResponse` dùng `order` (không phải `orderIndex`).
- Quy tắc thăng vòng lồng trong object `promotionRule: { topNPerTrack }`
  (không phải field phẳng).
- `RoundCriterionRequest`/`RoundCriterionResponse` **không có** trường thứ tự —
  server tự đánh số theo vị trí trong mảng `criteria` gửi lên (xem
  `RoundService.toCriterionEntities`).

Cột DB (`order_index`) và field Java nội bộ trên entity (`Round.orderIndex`,
`RoundCriterion.orderIndex`) vẫn giữ nguyên tên cũ — chỉ có **DTO** (JSON trả
về/nhận vào) là đổi theo frontend. Điều này tránh phải migrate schema chỉ vì
đổi tên ở tầng API.

## Endpoint tạm thời (stub) — để test frontend end-to-end không bị lỗi

Mentor, Judge, Submission là domain thuộc module khác, chưa có trong phạm vi P3.
Nếu không có gì trả lời các endpoint mà frontend cần, 3 tab (Hạng mục, Vòng thi,
Bài nộp, Giám khảo & Mentor) sẽ lỗi. Gói `com.sealhackathon.coordinator.stub`
chứa các controller tạm thời, **xoá khi module thật xong**:

| Endpoint | File | Trả về |
|---|---|---|
| `GET /api/coordinator/directory/mentors` | `stub/DirectoryController.java` | `[]` |
| `GET /api/coordinator/directory/judges` | `stub/DirectoryController.java` | `[]` |
| `GET /api/coordinator/events/{id}/submissions` | `stub/SubmissionStubController.java` | Danh sách rỗng, đúng shape phân trang |
| `GET /api/coordinator/events/{id}/assignments` | `stub/AssignmentStubController.java` | Ghép thật từ `Track.mentorId`/`Round.judgeIds`, tên hiển thị là placeholder |

## Endpoint

| Method | Path | Mô tả |
|---|---|---|
| GET | `/api/coordinator/events` | Danh sách sự kiện |
| GET | `/api/coordinator/events/{eventId}` | Chi tiết 1 sự kiện |
| POST | `/api/coordinator/events` | Tạo sự kiện (mặc định status=draft) |
| PATCH | `/api/coordinator/events/{eventId}` | Sửa thông tin cơ bản |
| DELETE | `/api/coordinator/events/{eventId}` | Xoá sự kiện |
| PATCH | `/api/coordinator/events/{eventId}/status` | Đổi trạng thái (validate theo vòng đời) |
| GET/POST | `/api/coordinator/events/{eventId}/tracks` | Danh sách / tạo hạng mục |
| PATCH/DELETE | `/api/coordinator/events/{eventId}/tracks/{trackId}` | Sửa / xoá hạng mục (mentorId=null để gỡ mentor) |
| GET/POST | `/api/coordinator/events/{eventId}/rounds` | Danh sách / tạo vòng thi |
| GET/PATCH/DELETE | `/api/coordinator/events/{eventId}/rounds/{roundId}` | Chi tiết / sửa / xoá vòng thi |
| POST | `/api/coordinator/events/{eventId}/rounds/{roundId}/judges` | Gán giám khảo |
| DELETE | `/api/coordinator/events/{eventId}/rounds/{roundId}/judges/{judgeId}` | Gỡ giám khảo |
| GET/POST | `/api/coordinator/events/{eventId}/rounds/{roundId}/criteria` | Danh sách / thêm tiêu chí (chỉnh lẻ, không qua PATCH round) |
| PATCH/DELETE | `/api/coordinator/events/{eventId}/rounds/{roundId}/criteria/{criterionId}` | Sửa / xoá 1 tiêu chí |

## Vòng đời EventStatus

```
draft → published → ongoing → completed
  ↓         ↓           ↓
cancelled cancelled  cancelled
```
Mọi request đổi trạng thái không nằm trong sơ đồ trên trả về **409 Conflict**.

## Khoá ngoại cần chốt với BE-3

- `HackathonEvent.criteriaTemplateId`: hiện lưu id thô (không `@ManyToOne`) vì entity
  `CriteriaTemplate` thuộc BE-3 chưa tồn tại trong service này. Khi BE-3 xong, thống
  nhất: (a) `CriteriaTemplate` sống ở service nào — nếu cùng service, đổi sang
  `@ManyToOne`; nếu khác service/microservice, giữ nguyên id thô + validate qua
  API call. (b) Tên bảng/id kiểu dữ liệu (`Long` hay `UUID`) phải khớp.
- `RoundCriterion` → `Round`: đã có FK thật (`@ManyToOne` trong cùng service này),
  không cần chờ BE-3.

## Judge / Mentor

`Track.mentorId` và `Round.judgeIds` chỉ lưu id thô — domain Mentor/Judge không
thuộc phạm vi P3. Gán/gỡ mentor thực hiện qua `PATCH .../tracks/{id}` (set/xoá
`mentorId`); gán/gỡ giám khảo có endpoint riêng trên `RoundController` vì đó là
quan hệ nhiều-nhiều thuộc về Round.
