# 07 - Van hanh & Trien khai (Production Deployment & Docker)

Thu muc nay huong dan cau hinh ha tang, gioi han tai nguyen va van hanh he thong SHMS tren moi truong Docker.

---

## 1. Kien truc Container & Gioi han Tai nguyen (Resource Limits)

He thong SHMS trien khai duoi dang 4 container doc lap thong qua `docker-compose.yml`.  
De tranh tran bo nho RAM va tranh DoS anh huong toi may chu host, tat ca container deu duoc cau hinh tran tren (`limits`) va bo nho dat truoc (`reservations`):

| Service | Ten Container | CPU Gioi han | RAM Toi da (Limits) | RAM Dat truoc (Reservations) | Cong Port |
|---|---|---|---|---|---|
| **postgres** | `seal-postgres` | 1.00 Core | 512 MB | 128 MB | 5432 (noi bo) |
| **backend** | `seal-backend` | 2.00 Cores | 1024 MB | 256 MB | 8080:8080 |
| **bff** | `seal-bff` | 1.00 Core | 512 MB | 128 MB | 4000:4000 |
| **frontend** | `seal-frontend` | 0.50 Core | 256 MB | 64 MB | 3000:80 |

---

## 2. Chinh sach Xoay vong Log (Log Rotation)

De dam bao o dia may chu khong bi day sau thoi gian dai ghi nhat ky request va audit logs, tat ca 4 container duoc ap dung driver ghi log `json-file` voi quy tac:
- `max-size: "5m"`: Khi file log dat kich thuoc 5MB se tu dong cat sang file luu tru cu.
- `max-file: "2"`: Chi giu toi da 2 file log gan nhat.  
-> Tong dung luong log toi da cho moi service luon duoc kiem soat duoi **10 MB**.

---

## 3. Huong dan Van hanh

### Kiem tra cu phap cau hinh:
```bash
docker compose config
```

### Khoi dong toan bo he thong:
```bash
docker compose up -d --build
```

### Kiem tra trang thai suc khoe (Healthchecks):
```bash
curl http://localhost:8080/actuator/health   # Spring Boot Backend
curl http://localhost:4000/health            # NestJS BFF
curl http://localhost:3000/health            # Nginx Frontend
```
