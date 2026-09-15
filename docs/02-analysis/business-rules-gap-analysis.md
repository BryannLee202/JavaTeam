# Bao cao Phan tich Khoang trong Quy tac Nghiep vu (Business Rules Gap Analysis)

> **Tai lieu thuc hien boi**: Nhom phat trien SHMS  
> **Ngay cap nhat**: 16/09/2026 (Phien ban v1.4.0)  
> **Muc tieu**: Doi chieu cac quy tac nghiep vu cot loi trong dac ta SRS (SHMS_SRS_v1.0) voi ma nguon thuc te cua he thong, chi ra cac diem da dat va ket qua khac phuc toan bo cac lo hong nghiep vu.

---

## 1. Tong quan ve cac Quy tac Nghiep vu (Business Rules)

Trong he thong SHMS, cac quy tac nghiep vu dong vai tro quyet dinh den tinh cong bang, bao mat va tinh toan ven cua ket qua cuoc thi. Qua qua trinh doi chieu va nang cap trong phien ban **v1.4.0**, toan bo 6 quy tac nghiep vu trong tam da duoc trien khai va kiem thu **dat 100%**:

| Ma luat | Ten quy tac | Yeu cau SRS | Trang thai trien khai (v1.4.0) |
|---|---|---|---|
| **BR-01** | Quy mo thanh vien doi thi | Toi thieu 3, toi da 5 thanh vien | **Hoan thanh 100%** (Chan tran tren max 5 va chan tran duoi min 3 tai `SubmissionService`) |
| **BR-02** | Rang buoc han chot nop bai | Ghi nhan ON_TIME hoac LATE, phat nop muon | **Hoan thanh 100%** (Tu dong chiet khau 10% diem nop muon trong `RankingService`) |
| **BR-03** | Xung dot loi ich Giam khao / Mentor | Khong dong thoi vua mentor vua cham cung su kien | **Hoan thanh 100%** (Validator kiem tra cheo 2 chieu trong `JudgeAssignmentService`) |
| **BR-04** | Tong trong so tieu chi danh gia | Tong trong so phai bang 100% | **Hoan thanh 100%** (`CriterionWeightPolicy` va unit test) |
| **BR-05** | Khoa diem va hieu chuan | Diem da chot khong duoc sua tuy tien | **Hoan thanh 100%** (finalized check va `CalibrationService`) |
| **BR-06** | Xuat ket qua Bang xep hang | Trich xuat bang diem ra file CSV chuan | **Hoan thanh 100%** (`RankingService.exportCsv` va UI `RankingPage.tsx`) |

---

## 2. Chi tiet cac Quy tac Nghiep vu va Bang chung trong Ma nguon

### 2.1. BR-01: Quy mo thanh vien doi thi (3 - 5 thanh vien)
- **Yeu cau trong SRS**:  
  Doi thi chi duoc phep nop bai va tham gia thi dau chinh thuc khi co tu 3 den 5 thanh vien.
- **Doi chieu ma nguon & Ket qua trien khai (v1.4.0)**:
  - `backend/src/main/java/com/seal/hackathon/repository/TeamMemberRepository.java`: Bo sung phuong thuc `countByTeamId(UUID teamId)`.
  - `backend/src/main/java/com/seal/hackathon/service/SubmissionService.java`: Kiem tra `countByTeamId(teamId) >= 3` ngay khi thuc hien `submit()`. Neu khong du 3 nguoi, nem ngoai le `ApiException.badRequest("Đội thi phải có tối thiểu 3 thành viên mới đủ điều kiện nộp bài")`.
  - Duoc bao ve boi unit test `SubmissionServiceTest.java` (kiem tra chan thanh cong doi co duoi 3 thanh vien).

---

### 2.2. BR-02: Rang buoc han chot nop bai va Phat nop muon (Late Penalty)
- **Yeu cau trong SRS**:  
  He thong phai ghi nhan chinh xac thoi diem nop so voi deadline cua vong thi. Neu nop sau deadline, bai nop bi danh dau la LATE va tu dong bi tru diem khi xep hang.
- **Doi chieu ma nguon & Ket qua trien khai (v1.4.0)**:
  - `backend/src/main/java/com/seal/hackathon/domain/enums/SubmissionStatus.java`: Co du cac trang thai `PENDING`, `ON_TIME`, `LATE`, `MISSING`.
  - `backend/src/main/java/com/seal/hackathon/service/RankingService.java`: Trong phuong thuc tinh diem `compute()`, he thong tu dong kiem tra neu `submission.isLate() == true`, tong diem co trong so cua doi thi se bi tru 10% (nhan voi he so `0.90` va lam tron `HALF_UP`).
  - Duoc bao ve boi unit test `RankingServiceTest.java` (kiem tra bai nop muon 100 diem bi tru con 90 diem).

---

### 2.3. BR-03: Phong ngua Xung dot Loi ich (Conflict of Interest)
- **Yeu cau trong SRS**:  
  Giang vien hoac chuyen gia dong vai tro Mentor huong dan mot track khong duoc phep duoc phan cong lam Giam khao cham diem cho cac vong thi cua cung su kien, va nguoc lai.
- **Doi chieu ma nguon & Ket qua trien khai (v1.4.0)**:
  - `backend/src/main/java/com/seal/hackathon/repository/UserRoleAssignmentRepository.java`: Bo sung truy van kiem tra vai tro pham vi `existsByUserIdAndRoleNameAndScopeTypeAndScopeIdIn`.
  - `backend/src/main/java/com/seal/hackathon/service/JudgeAssignmentService.java`:
    - Phuong thuc `assignJudge()`: Kiem tra neu giam khao dang la Mentor cua bat ky track nao trong su kien thi lap tuc nem `ApiException.conflict("Người dùng đang là Mentor trong sự kiện này, không thể phân công làm Giám khảo")`.
    - Phuong thuc `assignMentor()`: Kiem tra neu giang vien dang la Giam khao cua bat ky vong nao trong su kien thi lap tuc nem `ApiException.conflict("Người dùng đang là Giám khảo trong sự kiện này, không thể phân công làm Mentor")`.
  - Duoc bao ve boi bo unit test chuyen biet `JudgeAssignmentServiceTest.java` voi 5 test cases bao phu day du cac truong hop xung dot loi ich.

---

### 2.4. BR-04: Tong trong so tieu chi phai dung 100%
- **Yeu cau trong SRS**:  
  Bo tieu chi danh gia (Rubric) cua moi vong thi gom nhieu tieu chi voi trong so rieng, tong cac trong so phai luon bang 100% (hoac 1.0).
- **Doi chieu ma nguon**:  
  - Trien khai tai `backend/src/main/java/com/seal/hackathon/service/CriterionWeightPolicy.java`.
  - Duoc bao ve boi bo test toan dien tai `CriterionWeightPolicyTest.java` (kiem tra tong < 100, tong > 100, trong so am, va trong so dung 100%).

---

### 2.5. BR-05: Quan ly Chot diem va Hieu chuan diem so (Calibration)
- **Yeu cau trong SRS**:  
  Giam khao sau khi hoan thanh cham diem se bam chot diem (`finalized`). He thong phai ho tro phan tich do lech chuan (Variance Dashboard) va hieu chuan Z-Score giua cac giam khao cham de va giam khao cham kho.
- **Doi chieu ma nguon**:  
  - `ScoreService.java`: Ngan chan sua diem khi da finalized.
  - `CalibrationService.java`: Tinh toan he so hieu chuan dua tren diem trung binh va do lech cua tung giam khao.
  - `JudgePage.tsx`: Giao dien hien thi chi tiet tung tieu chi va danh sach bai nop da phan cong.

---

### 2.6. BR-06: Xuat ket qua Bang xep hang ra file CSV (Export Leaderboard)
- **Yeu cau trong SRS**:  
  He thong cho phep Ban to chuc va nguoi dung cong khai trich xuat bang diem tong hop va xep hang chinh thuc ra tap tin CSV de luu tru va bao cao.
- **Doi chieu ma nguon & Ket qua trien khai (v1.4.0)**:
  - `backend/src/main/java/com/seal/hackathon/service/RankingService.java`: Xay dung ham `exportCsv()` va `exportCsvByRound()` sinh noi dung CSV chuan RFC 4180 voi day du: Hang tong, Ten doi, Hang muc, Diem tong hop, va Trang thai thang vong.
  - `backend/src/main/java/com/seal/hackathon/controller/RankingController.java` & `PublicRankingController.java`: Cung cap cac endpoint `GET /api/rounds/{roundId}/rankings/export` va `GET /api/public/rankings/rounds/{roundId}/export`.
  - `frontend/src/pages/public/RankingPage.tsx`: Tich hop UI `Button variant="secondary"` tai file CSV bang diem ve may tinh.
  - Duoc bao ve boi unit test `RankingServiceTest.java` va `RankingPage.test.tsx`.

---

## 3. Ket luan

Qua qua trinh ra soat va cai tien trong phien ban **v1.4.0**, he thong SHMS da khac phuc hoan toan cac khoang trong quy tac nghiep vu truoc day. Toan bo cac co che kiem soat tinh cong bang (chan min/max thanh vien, phat nop muon, chong xung dot loi ich giua Mentor va Giam khao, va trich xuat du lieu) deu duoc thi hanh chat che o tang Backend va bao ve bang he thong kiem thu tu dong 100% xanh.
