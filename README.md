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
mvn spring-boot:run
```

Mặc định chạy **H2 trong bộ nhớ**, không cần cài Postgres. Server lên ở
`http://localhost:8080`, kiểm tra bằng:

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

Backend tự tạo sẵn một tài khoản Ban tổ chức khi khởi động lần đầu:

```
Email:    coordinator@seal.edu.vn
Mật khẩu: Coordinator@123
```

Hoặc tự đăng ký ở `/register` rồi dùng tài khoản trên để duyệt.

---

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

Backend đọc từ biến môi trường, đều có giá trị mặc định để chạy local ngay:

| Biến | Mặc định | Ghi chú |
|---|---|---|
| `DB_URL` | H2 trong bộ nhớ | Đổi sang Postgres: `jdbc:postgresql://localhost:5432/shms` |
| `DB_USERNAME` / `DB_PASSWORD` | `sa` / rỗng | |
| `APP_JWT_SECRET` | khoá dev | **Bắt buộc đặt nếu deploy thật** |
| `APP_CORS_ALLOWED_ORIGINS` | `http://localhost:5173` | Nhiều origin ngăn bằng dấu phẩy |
| `SERVER_PORT` | `8080` | |
| `FLYWAY_ENABLED` | `false` | Bật khi đã đủ bộ migration V1..V5 |

Chạy với Postgres:

```bash
DB_URL=jdbc:postgresql://localhost:5432/shms \
DB_USERNAME=postgres DB_PASSWORD=postgres \
mvn -f backend/pom.xml spring-boot:run
```

---

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
backend/src/main/java/com/seal/hackathon/
├── domain/entity/     Thực thể JPA
├── domain/enums/      Enum dùng chung
├── repository/        Spring Data JPA
├── service/           Nghiệp vụ
├── controller/        REST API
├── dto/               Đối tượng vào/ra của API
├── security/          JWT, filter, principal
└── exception/         ApiException + handler chung

frontend/src/
├── api/               Lớp gọi API, gom theo mảng nghiệp vụ
├── components/        Component dùng lại
├── pages/             Màn hình theo đường dẫn
├── context/           AuthContext
└── styles/            CSS

bff/src/               NestJS: auth, proxy, voting
```

---

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
