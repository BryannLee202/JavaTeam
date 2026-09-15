# Bao cao Phan tich Khoang trong Quy tac Nghiep vu (Business Rules Gap Analysis)

> **Tai lieu thuc hien boi**: Nhom phat trien SHMS  
> **Ngay lap**: 15/09/2026  
> **Muc tieu**: Doi chieu cac quy tac nghiep vu cot loi trong dac ta SRS (SHMS_SRS_v1.0) voi ma nguon thuc te cua he thong, chi ra cac diem da dat va cac lo hong can bo sung kiem soat.

---

## 1. Tong quan ve cac Quy tac Nghiep vu (Business Rules)

Trong he thong SHMS, cac quy tac nghiep vu dong vai tro quyet dinh den tinh cong bang, bao mat va tinh toan ven cua ket qua cuoc thi. Qua qua trinh doi chieu voi code backend (Spring Boot) va frontend (React), chung toi xac dinh duoc 5 quy tac nghiep vu trong tam:

| Ma luat | Ten quy tac | Yeu cau SRS | Trang thai trien khai |
|---|---|---|---|
| **BR-01** | Quy mo thanh vien doi thi | Toi thieu 3, toi da 5 thanh vien | Da kiem soat tran tren (max 5), **chua chan tran duoi (min 3) o backend** |
| **BR-02** | Rang buoc han chot nop bai | Ghi nhan ON_TIME hoac LATE | Da gan co LATE, **chua tu dong ap dung cong thuc tru diem** |
| **BR-03** | Xung dot loi ich Giam khao / Mentor | Khong dong thoi vua mentor vua cham cung track | Da phan tach trong du lieu mau, **chua co validator tu dong chan** |
| **BR-04** | Tong trong so tieu chi danh gia | Tong trong so phai bang 100% | **Hoan thanh 100%** (co CriterionWeightPolicy va unit test) |
| **BR-05** | Khoa diem va hieu chuan | Diem da chot khong duoc sua tuy tien | **Hoan thanh 100%** (finalized check va CalibrationService) |

---

## 2. Chi tiet cac Khoang trong va Bang chung trong Ma nguon

### 2.1. BR-01: Quy mo thanh vien doi thi (3 - 5 thanh vien)

- **Yeu cau trong SRS**:  
  Doi thi chi duoc phep nop bai va tham gia thi dau chinh thuc khi co tu 3 den 5 thanh vien.
- **Doi chieu ma nguon**:
  - ackend/src/main/java/com/seal/hackathon/service/TeamService.java:
    - Dong 40: private static final int MAX_TEAM_SIZE = 5;
    - Ham inviteMember va cceptInvite da kiem tra:  
      kiem tra so luong thanh vien hien tai khong vuot qua 5.
    - Tuy nhien, tai SubmissionService.java khi doi thi thuc hien nop bai, he thong chi kiem tra quyen cua doi truong ma **chua kiem tra dieu kien countByTeamId >= 3**.
- **Ket luan va Kien nghi**:  
  Frontend hien dang canh bao tot, nhung can bo sung validation tran duoi o backend truoc khi cho phep nop bai vong thi chinh thuc.

---

### 2.2. BR-02: Rang buoc han chot nop bai va Nop muon (Late Submission)

- **Yeu cau trong SRS**:  
  He thong phai ghi nhan chinh xac thoi diem nop so voi deadline cua vong thi. Neu nop sau deadline, bai nop bi danh dau la LATE.
- **Doi chieu ma nguon**:
  - ackend/src/main/java/com/seal/hackathon/domain/enums/SubmissionStatus.java:  
    Co du 4 trang thai: PENDING, ON_TIME, LATE, MISSING.
  - ackend/src/main/java/com/seal/hackathon/service/SubmissionService.java:  
    Da co logic so sanh thoi gian nop voi deadline cua vong thi:
    submission.setStatus(submissionTime.isAfter(round.getDeadline()) ? SubmissionStatus.LATE : SubmissionStatus.ON_TIME)
  - **Khoang trong**: Co che tru diem nop muon (vi du tru 10% hoac 20% tren tong diem) chua duoc tinh tu dong vao RankingService.java ma dang de giam khao tru diem bang tay qua nhan xet.

---

### 2.3. BR-03: Phong ngua Xung dot Loi ich (Conflict of Interest)

- **Yeu cau trong SRS**:  
  Giang vien hoac chuyen gia dong vai tro Mentor huong dan mot track khong duoc phep duoc phan cong lam Giam khao cham diem cho chinh track do.
- **Doi chieu ma nguon**:
  - ackend/src/main/resources/data-demo.sql:  
    Du lieu mau da tuan thu nghiem ngat: mentor1 huong dan Track 1, con judge1, judge2 duoc phan cong cham Round 1 va Round 2 theo pham vi ROUND.
  - ackend/src/main/java/com/seal/hackathon/service/JudgeAssignmentService.java:  
    Phuong thuc ssignJudge chi moi kiem tra vai tro tong the cua giam khao, chua co cau truy van kiem tra cheo xem nguoi dung co dang lam mentor cho cung su kien/track hay khong.

---

### 2.4. BR-04: Tong trong so tieu chi phai dung 100%

- **Yeu cau trong SRS**:  
  Bo tieu chi danh gia (Rubric) cua moi vong thi gom nhieu tieu chi voi trong so rieng, tong cac trong so phai luon bang 100% (hoac 1.0).
- **Doi chieu ma nguon**:  
  - Da hoan thien xuat sac tai ackend/src/main/java/com/seal/hackathon/service/CriterionWeightPolicy.java.
  - Duoc bao ve boi bo test toan dien tai CriterionWeightPolicyTest.java (kiem tra tong < 100, tong > 100, trong so am, va trong so dung 100%).

---

### 2.5. BR-05: Quan ly Chot diem va Hieu chuan diem so (Calibration)

- **Yeu cau trong SRS**:  
  Giam khao sau khi hoan thanh cham diem se bam chot diem (finalized). He thong phai ho tro phan tich do lech chuan (Variance Dashboard) va hieu chuan Z-Score giua cac giam khao cham de va giam khao cham kho.
- **Doi chieu ma nguon**:  
  - ScoreService.java: Ngan chan sua diem khi da finalized.
  - CalibrationService.java: Tinh toan he so hieu chuan dua tren diem trung binh va do lech cua tung giam khao.
  - JudgePage.tsx: Giao dien hien thi chi tiet tung tieu chi va danh sach bai nop da phan cong.

---

## 3. Ket luan

Viec phan tich doi chieu tren cho thay he thong SHMS da trien khai dung va chat che phan lon cac quy tac nghiep vu quan trong nhat ve cham thi va tinh diem. Ba khoang trong duoc phat hien (kiem tra tran duoi so thanh vien o backend, tu dong hoa tru diem nop muon, va khoa phan cong cheo Mentor-Judge) se la dinh huong cai tien nang cao cho cac phien ban tiep theo.
