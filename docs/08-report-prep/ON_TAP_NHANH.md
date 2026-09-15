# Cam nang On tap & Van dap Phan bien Nhanh (SHMS Viva Q&A Cheat Sheet)

> **Tai lieu thuc hien boi**: Le Minh Tai va Nhom phat trien SHMS  
> **Muc tieu**: Bo 30+ cau hoi va cau tra loi mau sat thuc te giup ca 6 thanh vien trong nhom tu tin tra loi troi chay moi cau hoi chat van cua Hoi dong Thay/Co khi bao ve do an.  
> **Ngay cap nhat**: 16/09/2026 (Phien ban v1.6.0 Production Ready)  

---

## Phan 1: Kien truc Tong the, BFF Pattern & Bao mat (Le Minh Tai ⭐)

### Cau 1: Tai sao he thong phai them tang BFF (NestJS) o giua ma khong cho React goi thang Spring Boot? (Xem ADR-001)
- **Tra loi**:
  1. **Bao mat JWT Cookie HttpOnly**: Trinh duyet goi BFF va nhan cookie phien voi co `httpOnly; Secure; SameSite=Strict`. Ma doc JavaScript (XSS) tren Frontend hoan toan khong the danh cap duoc Access Token.
  2. **An toan mang noi bo**: Backend Spring Boot khong can mo cong truc tiep ra Internet, chi lang nghe ket noi noi bo tu container BFF.
  3. **Dong goi API cho UI**: BFF dong vai tro lam gon du lieu, xu ly tap trung ma hoa/giai ma CSRF truoc khi chuyen tiep ve Backend.

### Cau 2: Co che phong chong tan cong CSRF duoc trien khai nhu the nao? (Xem ADR-002)
- **Tra loi**:
  - He thong su dung ky thuat **Double-Submit Cookie Pattern**:
    1. Khi dang nhap, BFF sinh cookie `XSRF-TOKEN` (co the doc bang JS) va kem cookie phien `ACCESS_TOKEN` (`httpOnly`).
    2. Frontend voi moi request thay doi du lieu (POST, PUT, DELETE) phai doc gia tri tu `XSRF-TOKEN` va gui len trong header `X-XSRF-TOKEN`.
    3. BFF so khop gia tri header va cookie truoc khi xu ly. Ke tan cong tu trang web thu ba khong the doc duoc cookie de tao header gia mao vi bi chan boi Same-Origin Policy.

### Cau 3: Trong Spring Security 6, vi sao lai tat csrf (`csrf.disable()`) o tang Backend?
- **Tra loi**:
  - Backend Spring Boot hoat dong theo kien truc **Stateless REST API** (khong luu session trong bo nho ram cua may chu ma xac thuc hoan toan qua header Bearer token tu BFF truyen xuong).
  - Vi khong su dung HTTP Session cookies o tang Backend, ky thuat tan cong CSRF dua vao session trinh duyet khong the xay ra o tang nay. Viec gop CSRF da duoc thuc hien triet de va an toan tai tang cong BFF.

---

## Phan 2: Backend Spring Boot, JPA & Giao dich (Hoang Le Giang)

### Cau 4: Annotation `@Transactional(readOnly = true)` mang lai loi ich gi trong cac Service doc du lieu?
- **Tra loi**:
  1. **Hieu nang Hibernate**: Giup Hibernate bo qua co che Dirty Checking (khong can tao ban sao snapshot cua entity de theo doi thay doi), tiet kiem bo nho va CPU.
  2. **Toi uu Database**: Cho phep Spring va driver JDBC dinh tuyen truy van toi cac ban sao Read-Only (Read Replicas) trong cac he thong co che Master-Slave.

### Cau 5: Hay giai thich cach trien khai Quy tac BR-01 (Doi thi phai co tu 3 den 5 thanh vien)?
- **Tra loi**:
  - Kiem soat 2 dau chat che:
    - Tran tren (Toi da 5 nguoi): Kiem tra trong `TeamService.java` khi truong doi moi thanh vien.
    - Tran duoi (Toi thieu 3 nguoi): Kiem tra tai `SubmissionService.java` bang query `teamMemberRepository.countByTeamId(teamId) >= 3`. Neu it hon 3 nguoi, he thong lap tuc chan nop bai va nem `ApiException.badRequest(...)`. Duoc bao ve boi unit test `SubmissionServiceTest.java`.

---

## Phan 3: Tri tue Nhan tao Hybrid & Phong thu 2 Lop (Le Minh Tai ⭐ & Hoang Le Giang)

### Cau 6: Neu khi bao ve do an bi mat ket noi Internet hoac API AI het han muc (quota) thi sao? (Xem ADR-004)
- **Tra loi**:
  - He thong cua nhom duoc thiet ke theo **Kien truc Phong thu 2 Lop (Two-layer Defensive Fallback)**:
    - **Lop 1 (Backend Heuristic Fallback)**: `AiAssistantService.java` tu dong bat ngoai le khi ket noi loi va phan tich heuristic dua tren metadata thuc te cua doi thi (ten doi, track, repo URL, slide).
    - **Lop 2 (Client Offline Engine)**: `mockAiEngine.ts` o Frontend tu dong kich hoat neu Backend hoan toan mat ket noi.
  - Nho do, trong moi tinh huong demo truoc Hoi dong, giao dien luon phan hoi nhanh, muot ma va tra ve day du tom tat, diem manh, rui ro va 3 cau hoi phan bien thong minh ma khong bao gio bi crash.

### Cau 7: Vi sao trong prompt AI lai cai dat `temperature = 0.1` va bat buoc tra ve JSON thuan?
- **Tra loi**:
  - `temperature = 0.1` giup giam thieu tinh ngau nhien, tang tinh nhat quan va dinh huong logic chinh xac cho danh gia hoc thuat.
  - Ep tra ve JSON thuan giup Jackson (Backend) va TypeScript (Frontend) parse truc tiep vao DTOs mot cach an toan (type-safe), tranh bi loi vo giao dien do cac the markdown ```json thua.

---

## Phan 4: Thuat toan Cham thi, Rubric & Xep hang (Huynh Thuc Toan & Tran Thi Yen Vy)

### Cau 8: He thong xu ly thuat toan Hieu chuan diem so (Z-Score Calibration) nhu the nao? (Xem ADR-003)
- **Tra loi**:
  - Moi giam khao co xu huong cham khac nhau (nguoi cham de thuong cho diem cao lech, nguoi cham kho thuong cho diem thap).
  - `CalibrationService.java` su dung cong thuc chuan hoa: `Z = (X - Mean) / StdDev` de quy doi ve cung mot mat bang do lech chuan, giup Ban to chuc phat hien phuong sai bat thuong va danh gia cong bang giua cac hoi dong cham thi.

### Cau 9: Quy tac BR-02 (Phat nop muon 10%) duoc tinh toan tai dau va lam tron the nao?
- **Tra loi**:
  - Tinh toan tai `RankingService.compute(UUID roundId)`.
  - Neu `submission.isLate() == true`, tong diem co trong so `weightedTotal` se duoc nhan voi he so `0.90` (chiet khau 10%) va ap dung lam tron `RoundingMode.HALF_UP` 2 chu so thap phan.

### Cau 10: Lam the nao de ngan chan Xung dot Loi ich giua Mentor va Giam khao (BR-03)?
- **Tra loi**:
  - Kiem tra cheo 2 chieu trong `JudgeAssignmentService.java`:
    - Khi phan cong Giám khảo cho vong thi: Kiem tra nguoi dung co dang huong dan bat ky track nao trong cung su kien hay khong.
    - Khi phan cong Mentor cho track: Kiem tra nguoi dung co dang lam giam khao bat ky vong thi nao trong su kien do hay khong. Neu co xung dot lap tuc nem `ApiException.conflict(...)`.

---

## Phan 5: Frontend React 19, Design System & Chatbot (Pham Nguyen Hoai Long)

### Cau 11: Tai sao nhom lai chuyen tu class CSS sang thu vien `components/ui/` nguyen tu?
- **Tra loi**:
  - Giup dam bao tinh **Type-Safe**: TypeScript bat buoc phai truyen dung variant (`primary`, `secondary`, `danger`), size (`sm`, `md`, `lg`).
  - Tranh trung lap code, de dang thay doi giao dien tap trung (Theme Tokens, Dark Mode), va component nhu `Modal` co the tu dong quan ly cac hieu ung phuc tap nhu khoa cuon trang va xu ly phim `Escape`.

### Cau 12: MascotBot hoat hoa duoc xay dung bang cong nghe gi va MascotChatDrawer tu van nhung gi?
- **Tra loi**:
  - `MascotBot.tsx` duoc ve hoan toan bang ma nguon vector **SVG nguyen ban ket hop CSS keyframes** (hieu ung nhap nhay mat, bay luon va tia set nguc), khong su dung bat ky anh bitmap ngoai nao giup tai trang tuc thi.
  - `MascotChatDrawer.tsx` tich hop cac quick prompts giup nguoi dung tra cuu tuc thi ve 6 quy tac nghiep vu BR-01 den BR-06 bang cach goi `aiApi.askMascot()`.

---

## Phan 6: Ma tran RTM & CI/CD Pipeline (Ta Huynh Nguyen)

### Cau 13: Ma tran Truy xuat Nguon goc (Traceability Matrix) cua nhom co diem gi khac biet so voi cac nhom khac?
- **Tra loi**:
  - Cac nhom khac thuong viet bang Markdown thu cong rat de bi lech voi ma nguon thuc te.
  - Nhom em su dung **Co che sinh tu dong va CI Gac cong**: File `scripts/traceability.py` doc truc tiep tu `use-cases.yaml`, quet va kiem tra su ton tai cua 100% file Controller, Service, Test va UI tren o dia.
  - Neu ai sua code lam sai duong dan, GitHub Actions Workflow `traceability.yml` se bao do ngay lap tuc de ngan chan loi.

### Cau 14: Vi sao trong Dockerfile can chay bang User Non-root thay vi root mac dinh?
- **Tra loi**:
  - Tuan thu nguyen tac bao mat **Dac quyen toi thieu (Principle of Least Privilege)**: Neu tien trinh trong container bi khai thac lo hong bao mat (RCE), ke tan cong cung chi chiem duoc quyen han cua user han che (`node` UID 1000) chu khong the leo thang dac quyen de kiem soat may chu Host.
