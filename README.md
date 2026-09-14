# SHMS — SEAL Hackathon Management System

Hệ thống quản lý và chấm điểm cuộc thi hackathon. Đồ án môn Java, 6 thành viên.

- **Frontend** React 19 + TypeScript + Vite
- **Backend** Spring Boot 4.1 + Spring Security + JPA (Java 17)
- **BFF** NestJS — lớp trung gian giữ JWT trong cookie HttpOnly, chống CSRF

---

## Chạy thử trong 3 phút

Cần sẵn: **JDK 17+**, **Node 20+**, **Maven 3.9+**. Không cần cài database.

### 1. Backend

```bash
cd backend
SPRING_PROFILES_ACTIVE=demo mvn spring-boot:run
```

> **Phải có `SPRING_PROFILES_ACTIVE=demo`.** Profile mặc định là `dev`, và `dev`
> trỏ tới Postgres ở `localhost:5432` — không có Postgres thì backend sẽ không
> khởi động được. Profile `demo` dùng H2 trong bộ nhớ, không cần cài gì.

Server lên ở `http://localhost:8080`, kiểm tra bằng:

```bash
curl http://localhost:8080/actuator/health
# {"status":"UP"}
```

### 2. Frontend

Mở terminal thứ hai:

```bash
cd frontend
npm ci
npm run dev
```

Mở `http://localhost:5173`.

### 3. Đăng nhập

Backend tự tạo sẵn một tài khoản Ban tổ chức khi khởi động lần đầu
(`config/DataInitializer.java`):

```
Email:    coordinator@seal.edu.vn
Mật khẩu: Coordinator@123
```

Hoặc tự đăng ký ở `/register` rồi dùng tài khoản trên để duyệt.

> **Lưu ý:** `data-demo.sql` có thêm 3 tài khoản `coordinator@demo.local`,
> `judge1@demo.local`, `judge2@demo.local`, nhưng mật khẩu của chúng chưa được
> ghi lại ở đâu cả nên hiện **không đăng nhập được**. Dùng tài khoản ở trên.

### Ba profile

| Profile | Database | Dùng khi nào |
|---|---|---|
| `demo` | H2 trong bộ nhớ, tự seed | **Chạy thử, demo** — không cần cài gì |
| `dev` | Postgres `localhost:5432/seal_hackathon` | Phát triển với DB thật, Flyway chạy V1–V6 |
| `prod` | Theo biến môi trường | Deploy thật |

## Xem giao diện khi chưa có backend

Không cần chạy backend vẫn xem được một số màn, nhờ lớp dữ liệu giả trong
`frontend/src/devMock.ts`:

| Đường dẫn | Xem được gì |
|---|---|
| `/coordinator/events?mock=coordinator` | Khu điều phối viên |
| `/judge?mock=judge` | Màn chấm điểm của giám khảo |
| `/register?mock=auth` | Luồng đăng ký |
| `/` `/vote` `/rankings` | Trang công khai — không cần mock, cũng không cần đăng nhập |

Chế độ mock chỉ hoạt động khi chạy `npm run dev`, không có trong bản build.

---

## Các màn hình

| Đường dẫn | Nội dung | Cần đăng nhập |
|---|---|---|
| `/` | Landing page | Không |
| `/vote` | Bình chọn khán giả | Không |
| `/rankings` | Bảng xếp hạng công khai | Không |
| `/login` `/register` | Đăng nhập, đăng ký | Không |
| `/app` | Trang chủ theo vai trò | Có |
| `/team` | Màn đội thi | Có |
| `/mentor` | Màn mentor | Có |
| `/judge` | Chấm điểm | Có — vai trò JUDGE |
| `/coordinator/events` | Quản lý cuộc thi | Có — vai trò COORDINATOR |
| `/coordinator/users` | Duyệt tài khoản | Có — vai trò COORDINATOR |

---

## Cấu hình

Backend đọc từ biến môi trường. Tên biến lấy đúng từ `application*.yml`:

| Biến | Mặc định (profile `demo`) | Ghi chú |
|---|---|---|
| `SPRING_PROFILES_ACTIVE` | `dev` | Đặt `demo` để chạy không cần Postgres |
| `DB_URL` | `jdbc:h2:mem:demo;MODE=PostgreSQL` | Profile `dev` mặc định là Postgres |
| `DB_USERNAME` / `DB_PASSWORD` | `sa` / rỗng | |
| `JWT_SECRET` | khoá dev dựng sẵn | **Bắt buộc đặt nếu deploy thật** |
| `JWT_ACCESS_EXP_MS` | `3600000` (1 giờ) | |
| `JWT_REFRESH_EXP_MS` | `604800000` (7 ngày) | |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173,3000,4000` | Vite chạy ở 5173 |
| `SERVER_PORT` | `8080` | |

Chạy với Postgres:

```bash
cd backend
SPRING_PROFILES_ACTIVE=dev \
DB_URL=jdbc:postgresql://localhost:5432/seal_hackathon \
DB_USERNAME=postgres DB_PASSWORD=postgres \
mvn spring-boot:run
```

Profile `dev` bật Flyway và chạy đủ bộ migration `V1__init_schema.sql` đến
`V6__demo_seed_users.sql` trong `backend/src/main/resources/db/migration/`.

## Kiểm thử

```bash
# Backend
mvn -f backend/pom.xml test

# Frontend
cd frontend
npm run lint
npm run build
npm test
```

---

## Cấu trúc thư mục

```
backend/src/main/java/com/seal/hackathon/     157 file, 21 entity
├── domain/entity/     User, HackathonEvent, Track, Round, Team, TeamMember,
│                      TeamInvite, Submission, CriteriaTemplate, Criterion,
│                      Score, Ranking, CalibrationRound, Prize, Vote,
│                      Disqualification, MentorFeedbackMessage, AuditLog...
├── domain/enums/      Enum dùng chung
├── repository/        Spring Data JPA
├── service/           Nghiệp vụ
├── controller/        REST API — 21 controller
├── dto/               Đối tượng vào/ra, gom theo mảng nghiệp vụ
├── security/          JWT, filter, principal
├── config/            SecurityConfig, DataInitializer
└── exception/         ApiException + handler chung

backend/src/main/resources/
├── application.yml          Cấu hình chung
├── application-{dev,demo,prod}.yml
├── db/migration/            Flyway V1..V6
└── data-demo.sql            Seed cho profile demo

frontend/src/
├── api/               Lớp gọi API, gom theo mảng nghiệp vụ
├── components/        Component dùng lại
├── pages/             23 màn hình theo đường dẫn
├── context/           AuthContext
└── styles/            CSS

bff/src/               NestJS: auth, proxy, voting
```

## Quy trình làm việc

Mỗi người làm trên nhánh riêng, xong mở Pull Request vào `main`.

```bash
# LUÔN tách nhánh từ main mới nhất
git fetch origin main
git checkout -b JAV-18-mo-ta-ngan origin/main
```

Tên nhánh và commit **phải mở đầu bằng mã task Jira**:

```
JAV-18 them entity Criterion va Prize
```

Cài hook kiểm tra tự động, mỗi người chạy một lần:

```bash
bash .github/hooks/setup-hooks.sh     # macOS / Linux
.github\hooks\setup-hooks.bat         # Windows
```

### Trước khi push, kiểm tra 1 phút

```bash
git diff origin/main --stat
```

Nhìn cột dấu trừ. **Thấy file mình không định sửa mà bị xoá nhiều dòng thì dừng
lại** — nhiều khả năng đang ghi đè việc của người khác.

Đã xảy ra vài lần: thay cả file thay vì thêm vào file có sẵn, làm mất route,
mất hàm mock, hoặc sập build backend của người khác.

### Merge

Chỉ merge sau khi review, và luôn dùng **"Create a merge commit"**. Repo đã tắt
Squash để mọi commit của từng người được giữ nguyên trong lịch sử `main`.

Chi tiết thêm: [CONTRIBUTING.md](CONTRIBUTING.md)

---

## Trạng thái

Bảng Jira: project **JAV**. Workflow trong `.github/workflows/` tự chuyển task
sang *In Progress* khi tạo nhánh và sang *Done* khi PR được merge.
