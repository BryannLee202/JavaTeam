<!-- FILE NÀY SINH TỰ ĐỘNG — ĐỪNG SỬA TAY -->
<!-- Nguồn: docs/01-yeu-cau/truy-vet.yml · Sinh lại: node scripts/sinh-ma-tran-truy-vet.mjs -->

# Ma trận truy vết yêu cầu

Ánh xạ từng use case trong [SRS](./SRS.md) sang **file code và file test thật**
thực hiện nó.

> Bảng này **sinh tự động** từ [`truy-vet.yml`](./truy-vet.yml). Sửa file YAML rồi
> chạy `node scripts/sinh-ma-tran-truy-vet.mjs`, đừng sửa thẳng vào đây.
>
> CI chạy script với cờ `--check` ở mỗi lần push. **Đổi tên hoặc xoá một file
> bằng chứng là CI hỏng ngay** — nhờ vậy bảng không thể mục dần mà không ai biết.

Kiểm lần cuối: **2026-09-15**

## Tổng kết

| | Số lượng | Tỷ lệ |
| --- | --- | --- |
| ✅ Xong | 22 | 81% |
| ⚠️ Một phần | 4 | 15% |
| ❌ Chưa làm | 1 | 4% |
| **Tổng use case** | **27** | |
| Có ít nhất một test | 12 | 44% |

## Đăng ký & Xác thực

| UC | Tên | Trạng thái | Code | Test |
| --- | --- | --- | --- | --- |
| UC-01 | Đăng ký tài khoản | ✅ Xong | [`AuthController.java`](../../backend/src/main/java/com/seal/hackathon/controller/AuthController.java)<br>[`AuthService.java`](../../backend/src/main/java/com/seal/hackathon/service/AuthService.java)<br>[`RegisterPage.tsx`](../../frontend/src/pages/RegisterPage.tsx) | [`AuthServiceTest.java`](../../backend/src/test/java/com/seal/hackathon/service/AuthServiceTest.java) |
| UC-02 | Phê duyệt tài khoản | ✅ Xong | [`AdminUserController.java`](../../backend/src/main/java/com/seal/hackathon/controller/AdminUserController.java)<br>[`UsersApprovalPage.tsx`](../../frontend/src/pages/coordinator/UsersApprovalPage.tsx) | *chưa có* |
| UC-03 | Đăng nhập (JWT) | ✅ Xong | [`AuthService.java`](../../backend/src/main/java/com/seal/hackathon/service/AuthService.java)<br>[`JwtAuthFilter.java`](../../backend/src/main/java/com/seal/hackathon/security/JwtAuthFilter.java)<br>[`auth.controller.ts`](../../bff/src/auth/auth.controller.ts)<br>[`LoginPage.tsx`](../../frontend/src/pages/LoginPage.tsx) | [`AuthServiceTest.java`](../../backend/src/test/java/com/seal/hackathon/service/AuthServiceTest.java)<br>[`auth.controller.spec.ts`](../../bff/src/auth/auth.controller.spec.ts)<br>[`AuthContext.test.tsx`](../../frontend/src/context/AuthContext.test.tsx) |
| UC-04 | Khởi tạo tài khoản Giám khảo khách mời | ⚠️ Một phần | [`AdminUserController.java`](../../backend/src/main/java/com/seal/hackathon/controller/AdminUserController.java)<br>[`CreateGuestJudgeRequest.java`](../../backend/src/main/java/com/seal/hackathon/dto/auth/CreateGuestJudgeRequest.java) | *chưa có* |

> **UC-02** — Chưa có test riêng cho luồng duyệt/từ chối.

> **UC-04** — Tạo được tài khoản và ghi guestAccessExpiresAt, nhưng KHÔNG chỗ nào kiểm tra hạn đó khi đăng nhập — tài khoản khách mời không bao giờ hết hạn. Xem docs/02-phan-tich/rang-buoc-nghiep-vu.md mục 4.

## Sự kiện & Vòng thi

| UC | Tên | Trạng thái | Code | Test |
| --- | --- | --- | --- | --- |
| UC-05 | Tạo và quản lý sự kiện Hackathon | ✅ Xong | [`EventController.java`](../../backend/src/main/java/com/seal/hackathon/controller/EventController.java)<br>[`EventService.java`](../../backend/src/main/java/com/seal/hackathon/service/EventService.java)<br>[`EventsPage.tsx`](../../frontend/src/pages/EventsPage.tsx) | *chưa có* |
| UC-06 | Cấu hình nhiều vòng thi trong sự kiện | ✅ Xong | [`RoundController.java`](../../backend/src/main/java/com/seal/hackathon/controller/RoundController.java)<br>[`RoundService.java`](../../backend/src/main/java/com/seal/hackathon/service/RoundService.java)<br>[`RoundsTab.tsx`](../../frontend/src/pages/tabs/RoundsTab.tsx) | [`RoundServiceTest.java`](../../backend/src/test/java/com/seal/hackathon/service/RoundServiceTest.java) |

## Tiêu chí chấm điểm

| UC | Tên | Trạng thái | Code | Test |
| --- | --- | --- | --- | --- |
| UC-07 | Duy trì mẫu tiêu chí mặc định | ✅ Xong | [`CriteriaTemplateController.java`](../../backend/src/main/java/com/seal/hackathon/controller/CriteriaTemplateController.java)<br>[`CriteriaTemplateService.java`](../../backend/src/main/java/com/seal/hackathon/service/CriteriaTemplateService.java) | *chưa có* |
| UC-08 | Tùy chỉnh tiêu chí theo sự kiện | ✅ Xong | [`RoundCriterionController.java`](../../backend/src/main/java/com/seal/hackathon/controller/RoundCriterionController.java)<br>[`CriterionWeightPolicy.java`](../../backend/src/main/java/com/seal/hackathon/service/CriterionWeightPolicy.java)<br>[`CriteriaTab.tsx`](../../frontend/src/pages/coordinator/CriteriaTab.tsx) | [`CriterionWeightPolicyTest.java`](../../backend/src/test/java/com/seal/hackathon/service/CriterionWeightPolicyTest.java) |

## Hạng mục

| UC | Tên | Trạng thái | Code | Test |
| --- | --- | --- | --- | --- |
| UC-09 | Tạo Hạng mục thi đấu | ✅ Xong | [`TrackController.java`](../../backend/src/main/java/com/seal/hackathon/controller/TrackController.java)<br>[`TrackService.java`](../../backend/src/main/java/com/seal/hackathon/service/TrackService.java)<br>[`TracksTab.tsx`](../../frontend/src/pages/tabs/TracksTab.tsx) | [`TrackServiceTest.java`](../../backend/src/test/java/com/seal/hackathon/service/TrackServiceTest.java) |
| UC-10 | Phân công Mentor cho Hạng mục | ⚠️ Một phần | [`JudgeAssignmentController.java`](../../backend/src/main/java/com/seal/hackathon/controller/JudgeAssignmentController.java)<br>[`JudgeAssignmentService.java`](../../backend/src/main/java/com/seal/hackathon/service/JudgeAssignmentService.java) | *chưa có* |

> **UC-10** — Phân công được, nhưng chưa có endpoint gỡ mentor khỏi hạng mục, và chưa chặn xung đột lợi ích mentor/giám khảo cùng hạng mục.

## Đội thi

| UC | Tên | Trạng thái | Code | Test |
| --- | --- | --- | --- | --- |
| UC-11 | Thành lập đội thi | ⚠️ Một phần | [`TeamController.java`](../../backend/src/main/java/com/seal/hackathon/controller/TeamController.java)<br>[`TeamService.java`](../../backend/src/main/java/com/seal/hackathon/service/TeamService.java)<br>[`MyTeam.tsx`](../../frontend/src/pages/team/MyTeam.tsx) | [`teams.test.ts`](../../frontend/src/api/teams.test.ts) |
| UC-12 | Đăng ký đội vào Hạng mục | ✅ Xong | [`TeamService.java`](../../backend/src/main/java/com/seal/hackathon/service/TeamService.java) | *chưa có* |

> **UC-11** — Giới hạn 3-5 thành viên chỉ chặn ở frontend, backend không đếm số thành viên. Xem docs/02-phan-tich/rang-buoc-nghiep-vu.md mục 1.

## Nộp bài

| UC | Tên | Trạng thái | Code | Test |
| --- | --- | --- | --- | --- |
| UC-13 | Nộp bài dự thi theo vòng | ✅ Xong | [`SubmissionController.java`](../../backend/src/main/java/com/seal/hackathon/controller/SubmissionController.java)<br>[`SubmissionService.java`](../../backend/src/main/java/com/seal/hackathon/service/SubmissionService.java)<br>[`SubmissionStatus.java`](../../backend/src/main/java/com/seal/hackathon/domain/enums/SubmissionStatus.java) | [`SubmissionServiceTest.java`](../../backend/src/test/java/com/seal/hackathon/service/SubmissionServiceTest.java) |
| UC-14 | Tự động lấy metadata repository | ❌ Chưa làm | — | *chưa có* |

> **UC-14** — SRS đánh dấu là tuỳ chọn. Chưa có dòng code nào.

## Đánh giá

| UC | Tên | Trạng thái | Code | Test |
| --- | --- | --- | --- | --- |
| UC-15 | Phân công Giám khảo cho vòng thi | ✅ Xong | [`JudgeAssignmentController.java`](../../backend/src/main/java/com/seal/hackathon/controller/JudgeAssignmentController.java)<br>[`JudgeAssignmentService.java`](../../backend/src/main/java/com/seal/hackathon/service/JudgeAssignmentService.java) | *chưa có* |
| UC-16 | Chấm điểm bài nộp | ✅ Xong | [`ScoreController.java`](../../backend/src/main/java/com/seal/hackathon/controller/ScoreController.java)<br>[`ScoreService.java`](../../backend/src/main/java/com/seal/hackathon/service/ScoreService.java)<br>[`JudgePage.tsx`](../../frontend/src/pages/judge/JudgePage.tsx) | [`ScoreServiceTest.java`](../../backend/src/test/java/com/seal/hackathon/service/ScoreServiceTest.java)<br>[`JudgePage.test.tsx`](../../frontend/src/pages/judge/JudgePage.test.tsx) |

## Xếp hạng & Loại

| UC | Tên | Trạng thái | Code | Test |
| --- | --- | --- | --- | --- |
| UC-17 | Tự động xếp hạng đội thi | ✅ Xong | [`RankingController.java`](../../backend/src/main/java/com/seal/hackathon/controller/RankingController.java)<br>[`RankingService.java`](../../backend/src/main/java/com/seal/hackathon/service/RankingService.java)<br>[`RankingPage.tsx`](../../frontend/src/pages/public/RankingPage.tsx) | [`RankingServiceTest.java`](../../backend/src/test/java/com/seal/hackathon/service/RankingServiceTest.java)<br>[`RankingControllerTest.java`](../../backend/src/test/java/com/seal/hackathon/controller/RankingControllerTest.java) |
| UC-18 | Tính toán thăng vòng | ✅ Xong | [`RankingService.java`](../../backend/src/main/java/com/seal/hackathon/service/RankingService.java) | [`RankingServiceTest.java`](../../backend/src/test/java/com/seal/hackathon/service/RankingServiceTest.java) |
| UC-19 | Loại đội / bài nộp vi phạm quy chế | ✅ Xong | [`DisqualificationController.java`](../../backend/src/main/java/com/seal/hackathon/controller/DisqualificationController.java)<br>[`DisqualificationService.java`](../../backend/src/main/java/com/seal/hackathon/service/DisqualificationService.java)<br>[`DisqualificationsTab.tsx`](../../frontend/src/pages/coordinator/DisqualificationsTab.tsx) | *chưa có* |
| UC-20 | Nhật ký kiểm tra chấm điểm & loại đội | ✅ Xong | [`AuditLogController.java`](../../backend/src/main/java/com/seal/hackathon/controller/AuditLogController.java)<br>[`AuditService.java`](../../backend/src/main/java/com/seal/hackathon/service/AuditService.java)<br>[`AuditLogPage.tsx`](../../frontend/src/pages/coordinator/AuditLogPage.tsx)<br>[`auditLog.ts`](../../frontend/src/lib/auditLog.ts) | *chưa có* |

## Nghiên cứu RBL

| UC | Tên | Trạng thái | Code | Test |
| --- | --- | --- | --- | --- |
| UC-21 | Ghi điểm chi tiết từng giám khảo/tiêu chí | ✅ Xong | [`Score.java`](../../backend/src/main/java/com/seal/hackathon/domain/entity/Score.java)<br>[`ScoreService.java`](../../backend/src/main/java/com/seal/hackathon/service/ScoreService.java) | [`ScoreServiceTest.java`](../../backend/src/test/java/com/seal/hackathon/service/ScoreServiceTest.java) |
| UC-22 | Vòng hiệu chuẩn (Calibration Round) | ✅ Xong | [`CalibrationController.java`](../../backend/src/main/java/com/seal/hackathon/controller/CalibrationController.java)<br>[`CalibrationService.java`](../../backend/src/main/java/com/seal/hackathon/service/CalibrationService.java)<br>[`JudgePage.tsx`](../../frontend/src/pages/judge/JudgePage.tsx) | *chưa có* |
| UC-23 | Xuất dữ liệu chấm điểm đã ẩn danh (CSV) | ✅ Xong | [`RblController.java`](../../backend/src/main/java/com/seal/hackathon/controller/RblController.java)<br>[`RblExportService.java`](../../backend/src/main/java/com/seal/hackathon/service/RblExportService.java) | *chưa có* |
| UC-24 | Dashboard phương sai điểm giữa các giám khảo | ✅ Xong | [`VarianceDashboardService.java`](../../backend/src/main/java/com/seal/hackathon/service/VarianceDashboardService.java) | *chưa có* |

## Giải thưởng

| UC | Tên | Trạng thái | Code | Test |
| --- | --- | --- | --- | --- |
| UC-25 | Trao giải dựa trên kết quả xếp hạng | ✅ Xong | [`PrizeController.java`](../../backend/src/main/java/com/seal/hackathon/controller/PrizeController.java)<br>[`PrizeService.java`](../../backend/src/main/java/com/seal/hackathon/service/PrizeService.java)<br>[`PrizesTab.tsx`](../../frontend/src/pages/coordinator/PrizesTab.tsx) | *chưa có* |
| UC-26 | Thông báo & công bố kết quả | ⚠️ Một phần | [`PublicRankingController.java`](../../backend/src/main/java/com/seal/hackathon/controller/PublicRankingController.java)<br>[`LandingPage.tsx`](../../frontend/src/pages/LandingPage.tsx) | *chưa có* |
| UC-27 | Xuất báo cáo xếp hạng và điểm (CSV/Excel) | ✅ Xong | [`ReportExportController.java`](../../backend/src/main/java/com/seal/hackathon/controller/ReportExportController.java)<br>[`ReportExportService.java`](../../backend/src/main/java/com/seal/hackathon/service/ReportExportService.java) | [`ReportExportControllerTest.java`](../../backend/src/test/java/com/seal/hackathon/controller/ReportExportControllerTest.java) |

> **UC-26** — Công bố công khai thì có, nhưng chưa có cơ chế gửi thông báo tới người dùng.

---

## Vì sao sinh tự động thay vì viết tay

Bảng truy vết viết tay luôn mục dần. Người ta đổi tên class, gộp file, xoá test —
bảng vẫn ghi đường dẫn cũ và vẫn **trông như đúng**. Càng lâu càng sai, mà không
có tín hiệu nào báo.

Ở đây nguồn sự thật là file YAML, và CI kiểm ba điều ở mỗi lần push:

1. mọi đường dẫn bằng chứng phải tồn tại thật
2. file markdown phải khớp với YAML (không ai sửa YAML rồi quên chạy lại script)
3. use case khai là "xong" thì phải có ít nhất một đường dẫn code

Đổi tên một file là CI đỏ ngay lần push kế tiếp.
