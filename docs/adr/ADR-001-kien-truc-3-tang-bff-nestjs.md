# ADR-001: Kien truc 3 tang voi Backend-for-Frontend (BFF) NestJS lam API Gateway va Quan ly Phien

- **Trang thai**: Accepted (Da chap thuan va dua vao van hanh)
- **Nguoi de xuat**: Pham Nguyen Hoai Long (Nen tang & Xac thuc)
- **Ngay ghi nhan**: 15/09/2026
- **Pham vi**: Kien truc tong the he thong SHMS

---

## 1. Boi canh (Context)

He thong SHMS (SEAL Hackathon Management System) phuc vu cuoc thi quy mo toan Khoa voi nhieu vai tro khac nhau (Ban to chuc, Giam khao, Mentor, Thi sinh, Khach binh chon).
Khi thiet ke he thong, nhom doi mat voi van de ket noi giua Frontend (React 19) va Backend (Spring Boot 4.1):

1. Neu Frontend goi truc tiep den Spring Boot (mo hinh truyen thong nhu he thong AURA):
   - Trinh duyet phai truc tiep cam Token JWT hoac phai cau hinh CORS phuc tap giua cac domain.
   - Spring Boot phai vua phuc vu cac tac vu API nghiep vu nang, vua phai chiu tai cac ket noi truc tiep tu client (session handling, rate limiting).
   - Mang noi bo cua Spring Boot va Co so du lieu bi phoi ra public network.
2. Neu chi dung Nginx lam Reverse Proxy don thuan:
   - Kho thuc thi cac logic xu ly phien phuc tap (nhu tu dong refresh token, tao va xac thuc CSRF double-submit token).

---

## 2. Quyet dinh (Decision)

Nhom quyet dinh trien khai kien truc **3 tang doc lap**:

`
[ Trinh duyet Web (React 19 + Vite 8) ]
                 |  (Cong 3001 dev / 3000 prod)
                 |  Cookie HttpOnly (shms_at, shms_rt) + Header X-XSRF-TOKEN
                 v
[ Tang BFF (NestJS API Gateway) ]
                 |  (Cong 4000)
                 |  Giai ma Cookie -> Gan Header Bearer JWT -> Throttle 200 req/min
                 v
[ Tang Backend Core (Spring Boot 4.1 + Java 21) ]
                 |  (Cong 8080)
                 v
[ PostgreSQL 16 Database ]
`

### Cac trach nhiem then chot cua BFF NestJS:
1. **API Gateway & Proxy**: Don toan bo request tu React tai /api/* va chuyen tiep xuong Spring Boot.
2. **Quan ly Phien an toan**:
   - Khi dang nhap thanh cong, BFF nhan JWT tu Spring Boot va ghi vao Cookie httpOnly (shms_at voi access token, shms_rt voi refresh token).
   - Trinh duyet khong the dung JavaScript doc duoc token nay, triet tieu hoan toan nguy co danh cap token qua lo hong XSS.
3. **Chong tan cong CSRF**: BFF phat sinh cookie XSRF-TOKEN (cho phep JS doc) va bat buoc cac request thay doi du lieu (POST, PUT, DELETE, PATCH) phai mang header X-XSRF-TOKEN tuong ung (CsrfGuard).
4. **Gioi han Tan suat (Rate Limiting)**: Cau hinh ThrottlerModule o muc 200 requests/phut, ngan chan brute force va DoS vao backend.

---

## 3. Hau qua & Danh doi (Consequences)

### Uu diem:
- **Bao mat tuyet doi**: Khong bao gio luu Token JWT trong localStorage hay sessionStorage.
- **Tach biet moi quan tam (Separation of Concerns)**: Backend chi tap trung vao nghiep vu Hackathon (Event, Score, Team, Ranking); BFF quan ly ket noi client va giao thuc web.
- **Linh hoat**: Khi can them giao dien Mobile app hoac tich hop ben thu ba, chi can bo sung route tai BFF ma khong can sua doi logic Spring Boot.

### Danh doi / Nhuoc diem:
- **Them mot hop phan can van hanh**: He thong co them service NestJS (cong 4000), yeu cau them quy trinh build Docker va giam sat container.
- **Do tre mang (Latency)**: Request phai qua them 1 buoc nhay (hop) qua BFF. Tuy nhien vi BFF va Backend chay cung mang Docker noi bo nen do tre tang them la khong dang ke (< 3ms).

## 4. Bang chung & Kiem chung Tu dong (Automated Verification)

Quyet dinh kien truc nay duoc bao ve va giam sat boi cac bo test tu dong sau:

1. **Bo test xac thuc & Proxy BFF**:
   - `bff/src/auth/auth.controller.spec.ts`: Kiem tra luong uy quyen dang nhap tu BFF sang Backend, dam bao token duoc dong goi an toan vao cookie.
   - `bff/src/common/cookies.spec.ts`: Kiem tra cac thuoc tinh cua cookie (`httpOnly: true`, `sameSite: 'lax'`).
2. **Kiem tra tan suat (Rate Limiting)**:
   - `ThrottlerModule` duoc cau hinh voi nguong 200 req/min tai `bff/src/app.module.ts`.
3. **Lenh kiem chung**:
   ```bash
   cd bff && npm test
   # 19/19 tests pass
   ```
