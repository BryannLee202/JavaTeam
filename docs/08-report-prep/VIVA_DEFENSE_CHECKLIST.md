# Danh muc Kiem tra Truoc gio G & Kich ban Bao ve Do an (Viva Defense Checklist)

> **Tai lieu thuc hien boi**: Pham Nguyen Hoai Long va Nhom phat trien SHMS  
> **Ngay cap nhat**: 16/09/2026 (Phien ban v1.6.0 Production Ready)  

---

## 1. Danh muc Kiem tra Thiet bi & Moi truong (Truoc 24h)

- [x] **Moi truong Java**: JDK 21 da cai dat (`java -version` hien thi Java 21 LTS).
- [x] **Moi truong Node.js**: Node 20+ hoac Node 22 (`node -v` va `npm -v` hoat dong).
- [x] **Docker Desktop**: Da khoi chay, kiem tra lenh `docker compose version` hop le.
- [x] **Kiem tra Test Suites**: Chay `run-automated-tests.bat` va xac nhan toan bo:
  - 27/27 Use Cases tren Ma tran RTM hop le 100%.
  - 94 tests Backend Spring Boot xanh 100%.
  - 101 tests Frontend Vitest xanh 100%.
  - TypeScript Typecheck `npx tsc -b` dat 0 loi.
- [x] **Tep bien moi truong**: Kiem tra tep `.env` da duoc tao day du voi `JWT_SECRET`.

---

## 2. Danh sach Tai khoan Demo San sang

He thong da khoi tao san day du cac tai khoan vai tro trong CSDL mau:

| Vai tro | Email dang nhap | Mat khau | Chuc nang show khi demo |
|---|---|---|---|
| **Ban to chuc (Coordinator)** | `coordinator@seal.edu.vn` | `Coordinator@123` | Quan ly cuoc thi, vong thi, track, tieu chi, duyet tai khoan, audit log |
| **Giam khao (Judge)** | `judge1@seal.edu.vn` | `Judge@123` | Cham diem bai nop, dung Tro ly AI phan tich & goi y nhan xet, chot diem |
| **Co van (Mentor)** | `mentor1@seal.edu.vn` | `Mentor@123` | Xem danh sach doi thi va theo doi tien do trong track duoc phan cong |
| **Doi truong (Team Leader)** | `leader1@seal.edu.vn` | `Leader@123` | Quan ly thanh vien doi, nop bai thi (repo Git, demo, slide) |
| **Thanh vien (Team Member)** | `member1@seal.edu.vn` | `Member@123` | Xem thong tin doi va thong bao cuoc thi |
| **Khach / Thi sinh** | *Khong can dang nhap* | *Khong can* | Xem bang xep hang cong khai, xuat CSV, hoi MascotBot |

---

## 3. Kich ban Demo Mau 5 Phut (The 5-Minute Golden Demo Flow)

### Phut 1: Giao dien, Design System & Da ngon ngu
1. Mo trang chu `http://localhost:3000`.
2. Bấm nut **ThemeToggle** de trinh dien giao dien Dark Mode sang trong voi do tuong phan cao chuan WCAG.
3. Bấm nut **LanguageSwitcher** chuyen doi giua Tieng Viet va Tieng Anh (i18n tuc thi).

### Phut 2: Quan tri Cuoc thi & Quy tac Nghiep vu BR-01, BR-03
1. Dang nhap tai khoan `coordinator@seal.edu.vn`.
2. Vao man hinh Su kien -> Cau hinh vong thi & Tieu chi (show tong trong so rubric dung 100% BR-04).
3. Vao tab Phan cong: Trinh bay viec he thong chan khong cho Mentor lam Giam khao cung su kien (BR-03).
4. Show kịch ban doi duoi 3 thanh vien bi chan nop bai (BR-01).

### Phut 3: Tro ly Giam khao AI (Judge AI Assistant) ⭐
1. Dang nhap tai khoan `judge1@seal.edu.vn` -> vao man hinh `Chấm điểm`.
2. Mo rong mot the bai nop cua doi thi -> Bấm nut **`✨ Trợ lý AI`**.
3. Show Modal: AI tu dong tom tat giai phap, diem manh ky thuat, canh bao rui ro va de xuat **3 cau hoi phan bien chuyen sau** cho Giam khao.
4. Keo cac thanh diem rubric -> Bấm **`✨ AI Gợi ý nhận xét`** -> Bấm **`Áp dụng vào nhận xét`** de dien tu dong vao form.

### Phut 4: Bang xep hang, Phat nop muon & Xuat CSV (BR-02, BR-06)
1. Vao man hinh `Bảng xếp hạng` (`/rankings`).
2. Show bai nop muon bi tu dong chiet khau 10% diem co trong so (BR-02).
3. Bấm nut **`Xuất CSV`** -> Trinh duyet tai ngay tep `shms-bang-xep-hang.csv` chuan RFC 4180 ve may.

### Phut 5: Linh vat SEAL Mascot Chatbot tu van the le
1. Nhấp vao linh vat **MascotBot** o goc phai duoi man hinh -> Cua so **SEAL Bot Chat Drawer** mo ra.
2. Bấm vao cac quick prompt: "BR-01: Quy mo doi thi", "BR-02: Nop muon tru diem", "BR-03: Xung dot loi ich".
3. MascotBot tra loi thong minh, nhanh chong va chinh xac ve the le.

---

## 4. Ke hoach Du phong Su co (Contingency Plan B)

| Tinh huong bat ngo | Giai phap xu ly ngay lap tuc |
|---|---|
| **Phong thi mat ket noi mang Internet** | He thong tu dong chuyen sang `mockAiEngine.ts` o Frontend va Heuristic Fallback o Backend. Moi tinh nang AI phan tich, goi y nhan xet va MascotBot van phan hoi muot ma 100%. |
| **May trinh chieu khong bat duoc Docker** | Khoi chay Backend Spring Boot voi profile `dev` su dung CSDL H2 in-memory co san du lieu mau qua lenh: `cd backend && mvnw.cmd spring-boot:run`. |
| **Thoi gian demo bi cat ngan xuong 3 phut** | Tap trung thang vao 3 diem an diem nhat: (1) Tro ly Giam khao AI, (2) Xuat CSV bang diem, va (3) MascotBot hoi dap the le. |
