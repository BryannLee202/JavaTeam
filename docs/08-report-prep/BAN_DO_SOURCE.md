# Ban do Ma nguon He thong (SHMS Source Code Map)

> **Muc tieu**: Cung cap ban do tra cuu nhanh toan bo ma nguon, kien truc thu muc va su lien ket giua cac file cho buoi bao ve do an / chung ket Hackathon.  
> **Ngay cap nhat**: 16/09/2026 (Phien ban v1.6.0 Production Ready)  

---

## 1. Tong quan Cay Thu muc He thong

```
SEAL_HACKATHON/
├── backend/                   # Spring Boot 4.1.0 (Java 21) - Tầng nghiệp vụ và dữ liệu
├── bff/                       # NestJS 10 (TypeScript) - Tầng cổng bảo mật & Cookie HttpOnly
├── frontend/                  # React 19 + Vite 8 + Tailwind 4 - Giao diện người dùng
├── docs/                      # Tài liệu kỹ thuật 8 phân khu chuẩn công nghiệp
│   ├── 01-requirements/       # SRS, Use Cases, RTM Traceability Matrix
│   ├── 02-analysis/           # Báo cáo Business Rules Gap Analysis
│   ├── 03-architecture/       # Kiến trúc hệ thống, sơ đồ C4, bảo mật
│   ├── 04-database/           # Thiết kế CSDL, Data Dictionary
│   ├── 05-api/                # Đặc tả API, AI API Spec
│   ├── 06-testing/            # Test plan, ma trận kiểm thử
│   ├── 07-deployment/         # Hướng dẫn Docker, biến môi trường
│   ├── 08-report-prep/        # Hồ sơ bảo vệ: Bản đồ source, ôn tập vấn đáp, checklist
│   └── adr/                   # Architecture Decision Records (ADR-001 -> ADR-004)
├── scripts/                   # Script tự động hóa kiểm tra Ma trận RTM (traceability.py)
├── docker-compose.yml         # Triển khai 4 container (PostgreSQL, Backend, BFF, Frontend)
├── run-automated-tests.bat    # 1-Click chạy toàn bộ kiểm thử tự động (94 BE + 101 FE tests)
└── start-system.bat           # 1-Click khởi động toàn bộ hệ sinh thái
```

---

## 2. Ban do Chi tiet Tang Backend (`backend/src/main/java/com/seal/hackathon/`)

### 2.1. Cau hinh He thong (`config/`)
| File | Vai tro & Chuc nang |
|---|---|
| `SecurityConfig.java` | Cau hinh Spring Security 6, JWT Filter, phan quyen endpoint, vo hieu hoa CSRF cho stateless API |
| `AiConfigurationProperties.java` | Quan ly cau hinh AI (`app.ai.*`): `enabled`, `apiKey`, `model`, `endpoint`, `timeoutMs` |
| `DataInitializer.java` | Tu dong khoi tao tai khoan quan tri mac dinh (`coordinator@seal.edu.vn`) |
| `JacksonConfig.java` | Cau hinh serialization/deserialization JSON cho Instant va BigDecimal |

### 2.2. Dich vu Nghiep vu Cot loi (`service/`)
| File | Vai tro & Quy tac Nghiep vu lien quan | Test case tuong ung |
|---|---|---|
| `AiAssistantService.java` | Goi API LLM chat completions, phong thu 2 lop Heuristic Fallback khi offline, phan tich bai nop va goi y nhan xet | `AiAssistantServiceTest.java` (5 tests) |
| `SubmissionService.java` | Xu ly nop bai du thi, thi hanh **BR-01** chan tran duoi doi co duoi 3 thanh vien | `SubmissionServiceTest.java` (12 tests) |
| `RankingService.java` | Tinh toan xep hang, thi hanh **BR-02** chiet khau 10% diem bai nop muon, thi hanh **BR-06** xuat bang diem CSV | `RankingServiceTest.java` (7 tests) |
| `JudgeAssignmentService.java` | Phan cong giam khao, thi hanh **BR-03** chan xung dot loi ich hai chieu giua Mentor va Judge | `JudgeAssignmentServiceTest.java` (5 tests) |
| `CriterionWeightPolicy.java` | Thi hanh **BR-04** xac thuc tong trong so cac tieu chi rubric bang dung 100% | `CriterionWeightPolicyTest.java` (6 tests) |
| `ScoreService.java` | Ghi nhan diem tung tieu chi, khoa sua diem sau khi giam khao chot (**BR-05**) | `ScoreServiceTest.java` (5 tests) |
| `CalibrationService.java` | Tinh toan he so lech chuan Z-Score giua cac giam khao cham de/kho (**BR-05**) | `HackathonBackendApplicationTests` |
| `PrizeService.java` | Cau hinh va tu dong trao giai thuong theo thu hang cuoc thi | `PrizeServiceTest.java` (7 tests) |
| `DisqualificationService.java` | Xu ly vi pham quy che va loai doi thi / bai nop khoi cuoc thi | `DisqualificationServiceTest.java` (6 tests) |
| `PublicVotingService.java` | Binh chon cong khai tren mang, gioi han tran IP va chong gian lan | `PublicVotingServiceTest.java` (10 tests) |
| `AuditService.java` | Ghi nhat ky kiem toan he thong bat bien | `AuditServiceTest.java` (3 tests) |

### 2.3. Bo dieu khien REST API (`controller/`)
| File | Endpoint chinh |
|---|---|
| `AiController.java` | `POST /api/ai/submissions/{id}/analyze`, `POST /api/ai/rubric-feedback/suggest` |
| `RankingController.java` | `GET /api/rounds/{id}/rankings`, `GET /api/rounds/{id}/rankings/export` |
| `PublicRankingController.java` | `GET /api/public/rankings/rounds/{id}`, `GET /api/public/rankings/rounds/{id}/export` |
| `SubmissionController.java` | `POST /api/submissions`, `GET /api/submissions/{id}` |
| `ScoreController.java` | `PUT /api/submissions/{id}/scores` |
| `JudgeAssignmentController.java`| `POST /api/rounds/{id}/judges`, `POST /api/tracks/{id}/mentors` |

---

## 3. Ban do Chi tiet Tang Frontend (`frontend/src/`)

### 3.1. UI Components Nguyen tu & Tai su dung (`components/ui/`)
- `Button.tsx`: Ho tro 4 variants (`primary`, `secondary`, `danger`, `ghost`), 3 sizes (`sm`, `md`, `lg`), `loading` spinner va `disabled`.
- `Badge.tsx`: 6 bien the mau (`success`, `warning`, `danger`, `primary`, `info`, `neutral`).
- `Card.tsx`: Cac khoi `CardHeader`, `CardTitle`, `CardContent`, `CardFooter`.
- `Modal.tsx`: Hop thoai noi, tu dong khoa cuon trang (`overflow: hidden`), dong bang phim `Esc` va click backdrop.
- `StateFeedback.tsx`: Hop nhat trang thai dang tai (`loading`), rong (`empty`) va loi (`error` voi nut `onRetry`).
- `index.ts`: Barrel export giup import gon gang: `import { Button, Modal } from '@/components/ui'`.

### 3.2. Tro ly AI & Mascot (`components/`)
- `MascotBot.tsx`: Linh vat thiet ke nguyen ban bang thuan SVG + CSS animation (mat chop, tia set nguc, bay bong).
- `MascotChatDrawer.tsx`: Cua so chat bot thong minh gan tai `Layout.tsx`, ho tro cac nut goi y nhanh hoi dap the le BR-01 den BR-06.

### 3.3. Dong co Offline Fallback & Hooks (`api/` & `hooks/`)
- `api/mockAiEngine.ts`: Dong co AI gia lap phan tich chuyen sau chay 100% Offline tai trinh duyet.
- `api/aiApi.ts`: Client goi AI theo co che Hybrid: Thu goi Backend truoc, neu mat mang tu dong chuyen sang `mockAiEngine`.
- `hooks/useAiProgress.ts`: Hook quan ly 4 giai doan phan tich AI truc quan (`READING` -> `EVALUATING` -> `FORMULATING` -> `COMPLETED`).

### 3.4. Man hinh Chuc nang (`pages/`)
- `pages/judge/JudgePage.tsx`: Man hinh giam khao cham thi tich hop nut `✨ Trợ lý AI` va `✨ AI Gợi ý nhận xét`.
- `pages/public/RankingPage.tsx`: Bang xep hang cong khai tich hop nut `Xuất CSV` tai bang diem ve may tinh.
- `pages/dashboard/DashboardPage.tsx`: Tong quan cac chi so su kien, cuoc thi va thong tin song ngu.

---

## 4. Anh xa 6 Quy tac Nghiep vu (Business Rules Matrix)

| Ma luat | Ten quy tac | File Backend | File Frontend | Unit Test bao ve |
|---|---|---|---|---|
| **BR-01** | Quy mo doi thi 3-5 nguoi | `SubmissionService.java` | `MyTeam.tsx` | `SubmissionServiceTest.java` |
| **BR-02** | Phat nop muon tru 10% | `RankingService.java` | `RankingPage.tsx` | `RankingServiceTest.java` |
| **BR-03** | Chong xung dot Mentor/Judge | `JudgeAssignmentService.java` | `JudgesMentorsTab.tsx` | `JudgeAssignmentServiceTest.java` |
| **BR-04** | Tong trong so rubric dung 100% | `CriterionWeightPolicy.java` | `CriteriaTab.tsx` | `CriterionWeightPolicyTest.java` |
| **BR-05** | Khoa diem & Hieu chuan Z-Score | `ScoreService.java`, `CalibrationService.java` | `JudgePage.tsx` | `ScoreServiceTest.java` |
| **BR-06** | Xuat bang xep hang CSV | `RankingService.java` | `RankingPage.tsx` | `RankingServiceTest.java`, `RankingPage.test.tsx` |
