# Ma tran Truy xuat Yeu cau (Requirements Traceability Matrix - RTM)

> **He thong**: SHMS (SEAL Hackathon Management System)  
> **Co che**: Sinh tu dong tu docs/01-requirements/use-cases.yaml va kiem tra ma nguon thuc te.  
> **Trang thai kiem tra**: Hop le 100% (108/108 tep hop le)

---

## 1. Thong ke Tong quan Do phu

| Chi so | So luong | Ty le hoan thanh |
|---|---|---|
| Tong so Use Cases dac ta trong SRS | 27 | 100% |
| Use Cases da hoan thanh ma nguon (Done) | 27 | 100% |
| Tong so thanh phan ma nguon duoc kiem tra tren dia | 108 | 100% |
| So tep bi thieu hoac sai duong dan tren dia | 0 | 0% |

## 2. Bang Chi tiet Ma tran Truy xuat (UC-01 den UC-27)

| Ma UC | Ten Use Case | Tac nhan | Trang thai | Controller | Service | Test kiem thu | Giao dien (UI) |
|---|---|---|---|---|---|---|---|
| **UC-01** | Dang ky tai khoan thi sinh va giang vien | Thi sinh / Giang vien | Done | AuthController.java | AuthService.java | AuthServiceTest.java | RegisterPage.tsx |
| **UC-02** | Phe duyet tai khoan nguoi dung | Ban to chuc (Coordinator) | Done | AdminUserController.java | AuthService.java | AuthServiceTest.java | UsersApprovalPage.tsx |
| **UC-03** | Dang nhap he thong qua JWT va Cookie HttpOnly | Tat ca tac nhan | Done | AuthController.java | AuthService.java | AuthServiceTest.java | LoginPage.tsx |
| **UC-04** | Khoi tao tai khoan Giam khao khach moi | Ban to chuc (Coordinator) | Done | JudgeAssignmentController.java | JudgeAssignmentService.java | HackathonBackendApplicationTests.java | JudgesMentorsTab.tsx |
| **UC-05** | Tao va quan ly su kien Hackathon | Ban to chuc (Coordinator) | Done | EventController.java | EventService.java | HackathonBackendApplicationTests.java | EventsPage.tsx |
| **UC-06** | Cau hinh cac vong thi trong su kien | Ban to chuc (Coordinator) | Done | RoundController.java | RoundService.java | RoundServiceTest.java | RoundsTab.tsx |
| **UC-07** | Duy tri mau tieu chi mac dinh (Criteria Template) | Ban to chuc (Coordinator) | Done | CriteriaTemplateController.java | CriteriaTemplateService.java | HackathonBackendApplicationTests.java | CriteriaTab.tsx |
| **UC-08** | Tuy chinh tieu chi danh gia theo su kien | Ban to chuc (Coordinator) | Done | RoundCriterionController.java | RoundCriterionService.java | CriterionWeightPolicyTest.java | CriteriaTab.tsx |
| **UC-09** | Tao Hang muc thi dau (Track) | Ban to chuc (Coordinator) | Done | TrackController.java | TrackService.java | TrackServiceTest.java | TracksTab.tsx |
| **UC-10** | Phan cong Mentor huong dan cho Hang muc | Ban to chuc (Coordinator) | Done | TrackController.java | TrackService.java | MentorServiceTest.java | JudgesMentorsTab.tsx |
| **UC-11** | Thanh lap doi thi va moi thanh vien | Doi truong (Team Leader) | Done | TeamController.java | TeamService.java | HackathonBackendApplicationTests.java | MyTeam.tsx |
| **UC-12** | Dang ky doi vao Hang muc thi dau | Doi truong (Team Leader) | Done | TeamController.java | TeamService.java | HackathonBackendApplicationTests.java | TeamsTab.tsx |
| **UC-13** | Nop bai du thi theo tung vong thi | Doi truong (Team Leader) | Done | SubmissionController.java | SubmissionService.java | SubmissionServiceTest.java | MyTeam.tsx |
| **UC-14** | Tu dong lay metadata repository (Git URL / Repo link) | He thong / Doi thi | Done | SubmissionController.java | SubmissionService.java | SubmissionServiceTest.java | SubmissionsTab.tsx |
| **UC-15** | Phan cong Giam khao cham diem cho vong thi | Ban to chuc (Coordinator) | Done | JudgeAssignmentController.java | JudgeAssignmentService.java | HackathonBackendApplicationTests.java | JudgesMentorsTab.tsx |
| **UC-16** | Giam khao cham diem bai nop theo tieu chi | Giam khao (Judge) | Done | ScoreController.java | ScoreService.java | ScoreServiceTest.java | JudgePage.tsx |
| **UC-17** | Tu dong tinh toan va xep hang doi thi | He thong / Ban to chuc | Done | RankingController.java | RankingService.java | RankingServiceTest.java | OverviewTab.tsx |
| **UC-18** | Xet duyet va tinh toan doi thang vong tiep theo | Ban to chuc (Coordinator) | Done | RoundController.java | RoundService.java | RoundServiceTest.java | RoundsTab.tsx |
| **UC-19** | Xu ly vi pham va loai doi thi / bai nop | Ban to chuc (Coordinator) | Done | DisqualificationController.java | DisqualificationService.java | DisqualificationServiceTest.java | DisqualificationsTab.tsx |
| **UC-20** | Ghi va truy van nhat ky kiem tra (Audit Log) | Ban to chuc (Coordinator) | Done | AuditLogController.java | AuditLogQueryService.java | AuditServiceTest.java | AuditLogPage.tsx |
| **UC-21** | Luu diem chi tiet tung giam khao va tieu chi (Score raw) | He thong / Giam khao | Done | ScoreController.java | ScoreService.java | ScoreServiceTest.java | JudgePage.tsx |
| **UC-22** | To chuc vong hieu chuan va danh gia do lech (Calibration) | Ban to chuc / Giam khao | Done | CalibrationController.java | CalibrationService.java | HackathonBackendApplicationTests.java | JudgePage.tsx |
| **UC-23** | Xuat du lieu cham diem an danh nghien cuu (RBL CSV Export) | Ban to chuc / Nha nghien cuu | Done | RblController.java | RblExportService.java | HackathonBackendApplicationTests.java | OverviewTab.tsx |
| **UC-24** | Bang dieu khien phuong sai diem giua cac giam khao | Ban to chuc (Coordinator) | Done | CalibrationController.java | VarianceDashboardService.java | HackathonBackendApplicationTests.java | OverviewTab.tsx |
| **UC-25** | Cau hinh va trao giai thuong theo xep hang | Ban to chuc (Coordinator) | Done | PrizeController.java | PrizeService.java | PrizeServiceTest.java | PrizesTab.tsx |
| **UC-26** | Cong bo ket qua va binh chon truc tuyen cong khai | Cong chung / Khach tham quan | Done | PublicRankingController.java | PublicVotingService.java | PublicVotingServiceTest.java | RankingPage.tsx |
| **UC-27** | Xuat bao cao tong hop xep hang va diem so (CSV/Excel) | Ban to chuc (Coordinator) | Done | ReportExportController.java | ReportExportService.java | ReportExportControllerTest.java | OverviewTab.tsx |

---

## 3. Phan bo theo Nhom Tac nhan

| Nhom tac nhan | So luong UC | Danh sach ma UC |
|---|---|---|
| Ban to chuc (Coordinator) | 15 | UC-02, UC-04, UC-05, UC-06, UC-07, UC-08, UC-09, UC-10, UC-15, UC-18, UC-19, UC-20, UC-24, UC-25, UC-27 |
| Ban to chuc / Giam khao | 1 | UC-22 |
| Ban to chuc / Nha nghien cuu | 1 | UC-23 |
| Cong chung / Khach tham quan | 1 | UC-26 |
| Doi truong (Team Leader) | 3 | UC-11, UC-12, UC-13 |
| Giam khao (Judge) | 1 | UC-16 |
| He thong / Ban to chuc | 1 | UC-17 |
| He thong / Doi thi | 1 | UC-14 |
| He thong / Giam khao | 1 | UC-21 |
| Tat ca tac nhan | 1 | UC-03 |
| Thi sinh / Giang vien | 1 | UC-01 |

---

*Ma tran nay duoc sinh tu dong boi scripts/traceability.py. De kiem tra tinh toan ven trong CI, chay: python scripts/traceability.py --verify.*
