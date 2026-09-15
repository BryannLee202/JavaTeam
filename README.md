# SHMS — SEAL Hackathon Management System

Hệ thống quản lý và chấm điểm cho các cuộc thi hackathon SEAL — quản lý sự
kiện, hạng mục, vòng thi, đội thi, chấm điểm theo tiêu chí (RBL — Rubric-Based
Learning), hiệu chuẩn giám khảo (calibration), xếp hạng và giải thưởng.

## Kiến trúc

Ba tầng, chạy độc lập trên ba cổng:

```
React + Vite (3001 khi dev)  →  BFF (NestJS, 4000)  →  Backend (Spring Boot, 8080)
```

**Frontend không gọi thẳng Backend** — mọi request đi qua BFF. JWT được lưu
trong cookie `httpOnly` (`shms_at`, `shms_rt`), trình duyệt không đọc/chạm được
vào token; BFF là bên giữ và gắn token khi gọi tiếp xuống Backend. Chống CSRF
bằng cặp cookie `XSRF-TOKEN` + header `X-XSRF-TOKEN`.

## Khoi dong Nhanh & Kiem thu 1-Click (Danh cho Buoi Bao ve / Demo)

- **Khoi dong toan bo he thong (1-Click)**: Nhap dup chuot vao file [`start-system.bat`](./start-system.bat) (tu dong kiem tra `.env` va khoi chay Docker Compose / PostgreSQL).
- **Chay toan bo kiem thu tu dong (1-Click)**: Nhap dup chuot vao file [`run-automated-tests.bat`](./run-automated-tests.bat) (chay xac thuc Ma tran RTM 27 Use Cases, 94 tests Backend, 101 tests Frontend va TypeScript).
- **Ho so chuan bi bao ve do an**:
  - [Ban do ma nguon toan dien (Source Map)](./docs/08-report-prep/BAN_DO_SOURCE.md)
  - [Cam nang on tap & van dap phan bien nhanh (30+ Q&A)](./docs/08-report-prep/ON_TAP_NHANH.md)
  - [Danh muc kiem tra truoc gio G (Viva Checklist)](./docs/08-report-prep/VIVA_DEFENSE_CHECKLIST.md)

## Tai lieu he thong & Lich su thay doi

- **Ho so tai lieu he thong & Ho so kien truc ADR**: Xem tai [docs/README.md](./docs/README.md).
    - Ke hoach va ket qua kiem thu: [docs/06-testing/README.md](./docs/06-testing/README.md)
    - Huong dan van hanh va Docker Compose: [docs/07-deployment/README.md](./docs/07-deployment/README.md)
  - Dac ta yeu cau phan mem (SRS v1.0): [docs/01-requirements/srs.md](./docs/01-requirements/srs.md)
  - Ma tran truy xuat yeu cau (Traceability Matrix): [docs/01-requirements/traceability-matrix.md](./docs/01-requirements/traceability-matrix.md)
  - Ho so quyet dinh kien truc: [docs/adr/README.md](./docs/adr/README.md)
  - Phan tich khoang trong quy tac nghiep vu: [docs/02-analysis/business-rules-gap-analysis.md](./docs/02-analysis/business-rules-gap-analysis.md)
- **Lich su thay doi he thong**: Xem tai [docs/CHANGELOG.md](./docs/CHANGELOG.md).

## Cách chạy (dev, 3 terminal riêng)

> Copy từ [`DEMO_SCRIPT.md`](./DEMO_SCRIPT.md), mục "Chuẩn bị trước khi demo".
> Xem file đó để có kịch bản demo đầy đủ (đăng nhập, chấm điểm, xếp hạng...).

**Thứ tự bắt buộc: Backend → BFF → Frontend.**

```powershell
# Terminal 1 — Backend (Spring Boot, cổng 8080)
cd backend
$env:JAVA_HOME='C:\Program Files\Java\jdk-25'   # sửa theo đường dẫn JDK trên máy bạn
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
$env:SPRING_PROFILES_ACTIVE='demo'               # nạp sẵn dữ liệu mẫu, xem mục bên dưới
mvnw.cmd spring-boot:run
# Chờ đến: "Started HackathonBackendApplication in X seconds"
```

```powershell
# Terminal 2 — BFF (NestJS, cổng 4000)
cd bff
npm run start:dev
# Chờ đến: "SEAL Hackathon BFF listening on http://localhost:4000"
```

```powershell
# Terminal 3 — Frontend (React + Vite, cổng 3001)
cd frontend
$env:VITE_BFF_URL='http://localhost:4000'
npx vite --host 0.0.0.0 --port 3001
# Chờ đến: "ready in X ms" và "Local: http://localhost:3001/"
```

### Kiểm tra cả 3 service đã lên

```powershell
Invoke-WebRequest -Uri 'http://localhost:8080/actuator/health'   # 200
Invoke-WebRequest -Uri 'http://localhost:4000/health'             # 200, {"status":"ok"}
Invoke-WebRequest -Uri 'http://localhost:3001/'                   # 200, HTML
```

Mở trình duyệt: `http://localhost:3001/login`

> Lưu ý: cổng frontend khi chạy Docker (`docker compose up`, xem
> [`docker-compose.yml`](./docker-compose.yml)) là **3000** qua Nginx — khác với
> cổng **3001** khi chạy `vite` trực tiếp lúc dev như trên. Cả hai đều đúng, chỉ
> khác ngữ cảnh sử dụng.


## Biến môi trường

Xem [`frontend/.env.example`](./frontend/.env.example) — đã ghi rõ ba biến môi
trường cần thiết và phạm vi ảnh hưởng của từng biến (bao gồm `VITE_USE_MOCK` —
xem mục "Chế độ dữ liệu giả" bên dưới).

## Chế độ dữ liệu giả

**Bốn tab trong khu điều phối** (Sự kiện, Hạng mục, Vòng thi, Đội thi) chạy
bằng dữ liệu giả từ `frontend/src/api/mockData.ts` khi `VITE_USE_MOCK=true` —
**đây là giá trị mặc định**.

**Phần còn lại của hệ thống luôn gọi Backend thật**, không phụ thuộc
`VITE_USE_MOCK`: trang công khai (Landing/Voting/Ranking), chấm điểm, "Đội của
tôi", Mentor, Tiêu chí, Giải thưởng, và xử lý vi phạm.

## Dữ liệu mẫu (demo)

Chạy với `SPRING_PROFILES_ACTIVE=demo`, file `backend/src/main/resources/data-demo.sql`
nạp sẵn: 1 sự kiện, 3 hạng mục, 2 vòng thi, 6 đội, 42 lượt chấm điểm, và bảng
xếp hạng. Tên dữ liệu trong đó được đặt **trùng** với `mockData.ts`, để hai
nửa hệ thống (mock và dữ liệu mẫu thật) hiển thị cùng nội dung khi demo.

Tài khoản demo dùng để đăng nhập thử (xem chi tiết trong `DEMO_SCRIPT.md`):
```
Email: judge1@demo.local
Password: Demo@123456
```

## Số liệu thật của repo (tính đến 15/09/2026)

| Hạng mục | Số lượng |
|---|---|
| Controller (backend) | 24 |
| Entity | 21 |
| Service | 29 |
| Màn hình (frontend) | 24 |
| Migration Flyway | 6 (V1 → V6) |
| Test backend | 49, tất cả pass |
| Test frontend | 7, tất cả pass |

## Phân chia công việc

| Người phụ trách | Phần việc |
|---|---|
| Phạm Nguyễn Hoài Long | Nền tảng + xác thực, phê duyệt tài khoản (Auth, AdminUser) |
| Hoàng Lê Giang | Trang công khai, bình chọn khán giả, bảng xếp hạng, dữ liệu mẫu demo |
| Tạ Huỳnh Nguyên | Coordinator — cấu trúc cuộc thi (Event, Track, Round, RoundCriterion) |
| Huỳnh Thúc Toàn | Chấm điểm + hiệu chuẩn, màn hình Mentor (Judge Assignment, Score, Calibration, RBL, Mentor) |
| Trần Thị Yến Vy | Đội thi, mời thành viên và bài nộp (Team, TeamInvite, Submission) |
| Lê Minh Tài | Tiêu chí chấm + giải thưởng, xử lý vi phạm, CI/CD |

> Không liệt kê tên nhánh ở đây nữa — các nhánh JAV-9, JAV-11... phía trên đã
> merge xong hoặc bị bỏ, giữ lại dễ gây hiểu nhầm là đang còn hiệu lực. Xem
> lịch sử nhánh thật trên GitHub nếu cần tra cứu.

Chi tiết quy trình làm việc: xem mục "Đóng góp" bên dưới.

## Đóng góp

Xem [`CONTRIBUTING.md`](./CONTRIBUTING.md) để biết quy ước nhánh, commit, và
quy trình mở Pull Request.