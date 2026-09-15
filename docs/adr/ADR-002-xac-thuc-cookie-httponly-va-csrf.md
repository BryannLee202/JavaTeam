# ADR-002: Co che Xac thuc Token qua Cookie HttpOnly va Phong chong CSRF Double-Submit

- **Trang thai**: Accepted (Da chap thuan va dua vao van hanh)
- **Nguoi de xuat**: Pham Nguyen Hoai Long (Nen tang & Xac thuc)
- **Ngay ghi nhan**: 15/09/2026
- **Pham vi**: Bao mat xac thuc nguoi dung va giao tiep HTTP giua Client va BFF

---

## 1. Boi canh (Context)

Trong cac ung dung Single Page Application (SPA) su dung React, kien truc pho bien nhat thuong la:
- Nhan chuoi JWT sau khi dang nhap va luu vao localStorage hoac sessionStorage.
- Moi lan goi API, client doc tu localStorage va gan vao header Authorization: Bearer <token>.

### Rui ro an ninh cua cach lam tren:
1. **Lo hong XSS (Cross-Site Scripting)**: Bat ky doan ma doc JavaScript nao duoc chen vao trang web (qua thu vien npm doc hai hoac injection trong noi dung bai nop/nhan xet) deu co the doc localStorage.getItem('token') va gui ra server cua ke tan cong.
2. **Khong the thu hoi token tuc thi**: Token nam hoan toan duoi trinh duyet, khi muon dang xuat chi xoa o client chu server khong the thu hoi neu khong duy tri blacklist phuc tap.

---

## 2. Quyet dinh (Decision)

He thong SHMS quyet dinh **cam tuyet doi luu Token JWT trong localStorage**, thay vao do trien khai mo hinh **Cookie HttpOnly ket hop CSRF Double-Submit Cookie**:

### 2.1. Cookie HttpOnly cho JWT (shms_at & shms_rt)
- Access Token duoc ghi vao cookie shms_at voi cac co bao mat:
  - httpOnly: true -> Trinh duyet chan hoan toan moi truy cap tu document.cookie bang JavaScript.
  - secure: true trong moi truong production (yeu cau HTTPS).
  - sameSite: 'lax' -> Ngan chan cookie bi gui tu dong trong cac cross-site POST requests.
  - path: '/'.
- Refresh Token duoc ghi vao cookie shms_rt voi thoi gian song dai hon, chi dung khi can lay phien moi.

### 2.2. Co che Double-Submit Cookie chong CSRF
Khi chuyen sang dung cookie tu dong gui kem theo request, ung dung co nguy co bi tan cong CSRF (Cross-Site Request Forgery). De giai quyet:
1. Khi dang nhap thanh cong, BFF thiet lap them mot cookie XSRF-TOKEN voi cờ httpOnly: false.
2. Frontend doc cookie nay (qua helper getCookie('XSRF-TOKEN') tai rontend/src/api/client.ts va http.ts).
3. Voi moi yeu cau thay doi trang thai (POST, PUT, PATCH, DELETE), Frontend doc gia tri nay va gan vao Header HTTP:  
   X-XSRF-TOKEN: <gia tri token>.
4. Tai BFF, CsrfGuard kiem tra:
   - Request thuoc nhom mutating methods (POST, PUT, DELETE, PATCH)?
   - Header X-XSRF-TOKEN co ton tai va co gia tri trung khop voi Cookie XSRF-TOKEN hay khong?
   - Neu khong khop hoac thieu -> Tra ve ma loi 403 Forbidden.

---

## 3. Hau qua & Danh doi (Consequences)

### Uu diem:
- **Khac phuc 100% lo hong danh cap Token qua XSS**: JavaScript khong co quyen truy cap token.
- **Phong ve CSRF chu dong**: Ke tan cong tu domain khac khong the doc duoc noi dung cookie XSRF-TOKEN cua nguoi dung (theo Same-Origin Policy) nen khong the gia mao header X-XSRF-TOKEN.
- **Trai nghiem nguoi dung lien mach**: Cookie tu dong duy tri phien lam viec ma khong can code frontend phai tu viet boilerplate code refresh token thu cong trong storage.

### Yeu cau nghiem ngat khi lap trinh:
- Khi thuc hien cac loi goi etch o Frontend, bat buoc phai khai bao credentials: 'include' de trinh duyet gui kem cookie qua cac origin (vi du frontend 3001 va BFF 4000).
- Tat ca cac endpoint thay doi du lieu phai duoc bao ve boi CsrfGuard.
