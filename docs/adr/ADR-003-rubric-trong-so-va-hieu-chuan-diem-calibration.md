# ADR-003: Mo hinh Cham diem Rubric da Tieu chi co Trong so va Hieu chuan Do lech Giam khao (Calibration)

- **Trang thai**: Accepted (Da chap thuan va dua vao van hanh)
- **Nguoi de xuat**: Pham Nguyen Hoai Long (Nen tang & Xac thuc)
- **Ngay ghi nhan**: 15/09/2026
- **Pham vi**: Phan he Cham diem, Hieu chuan va Tinh toan Xep hang (Scoring & Ranking Engine)

---

## 1. Boi canh (Context)

Trong cac cuoc thi lap trinh va sang tao cong nghe (Hackathon), khau cham thi thuong doi mat voi hai thach thuc lon:
1. **Cham diem cam tinh va thieu chuan muc**: Khi chi cho giam khao nhap mot diem tong duy nhat (thang 100), diem so de bi chi phoi boi an tuong chu quan ma bo qua cac yeu to ky thuat (Kien truc code, UI/UX, tinh kha thi, tinh sang tao).
2. **Hien tuong lech mat bang diem giua cac giam khao (Inter-Rater Variability)**:
   - Co giam khao co xu huong cham rong rai (mat bang diem tu 80 - 95).
   - Co giam khao lai rat khat khe (mat bang diem chi tu 55 - 75).
   - Neu mot doi thi vo tinh duoc phan cong vao mot hoi dong toan giam khao cham kho, doi do se bi tut hang nghiem trong du chat luong bai thi xuat sac.

---

## 2. Quyet dinh (Decision)

Nhom SHMS quyet dinh trien khai giai phap ket hop giua **Mo hinh Rubric RBL da tieu chi co trong so** va **Co che Hieu chuan do lech (Calibration & Variance Analysis)**:

### 2.1. Mo hinh Rubric co trong so (Weighted Rubric Policy)
- Moi vong thi co mot bo tieu chi danh gia (RoundCriterion).
- Moi tieu chi duoc gan mot trong so (weight) the hien do uu tien (vi du: Y tuong 30%, Kien truc 40%, Demo 30%).
- CriterionWeightPolicy.java bat buoc tong trong so phai luon bang 100% (chuan hoa 1.0). Neu tong trong so khac 100% hoac ton tai trong so <= 0, he thong se nem loi BusinessRuleException ngay khi luu tieu chi.
- Diem so cua mot bai nop boi mot giam khao la tong trong so cua tung tieu chi con:  
  TotalScore = SUM(CriterionScore_i * Weight_i) / 100.

### 2.2. Vong hieu chuan & Bang dieu khien phuong sai (Calibration & Variance Dashboard)
- He thong cho phep to chuc Vong hieu chuan (Calibration Round): Toan bo giam khao cung cham thu 1 den 2 bai nop tieu chuan truoc gio cham chinh thuc.
- VarianceDashboardService.java tinh toan phuong sai va do lech giua cac giam khao tren tung tieu chi. Neu phuong sai o tieu chi nao vuot nguong canh bao, Ban to chuc se to chuc hop nhanh de cac giam khao dong thuan lai dinh nghia thang diem.

### 2.3. Thuat toan Hieu chuan Diem so (Calibration Algorithm)
- Khi tinh toan xep hang chung cuoc, CalibrationService.java cung cap thuat toan chuan hoa Z-Score:
  - Tinh diem trung binh (Mean) va do lech chuan (Standard Deviation) cua tung giam khao tren toan bo cac bai nop ma ho da cham.
  - Chuyen doi diem tho (
awScore) ve diem chuan hoa:  
    Z = (rawScore - Mean_judge) / StdDev_judge.
  - Quy doi diem ve thang chuan cua toan su kien de dam bao mot diem 80 cua giam khao kho tuong duong gia tri voi mot diem 90 cua giam khao de.

---

## 3. Hau qua & Danh doi (Consequences)

### Uu diem:
- **Cong bang tuyet doi**: Loai bo rui ro doi thi bi loai oan uong do bat dong quan diem hoac do lech tinh cach cua giam khao.
- **Minh bach va de giai thich**: Tung tieu chi deu co diem rieng kem theo nhan xet cu the, giup doi thi hieu ro diem manh va diem yeu cua san pham.
- **Phuc vu nghien cuu hoc thuat**: Du lieu diem cham chi tiet theo tieu chi co the xuat ra duoi dang an danh (RblExportService.java) de phuc vu nghien cuu danh gia phuong phap hoc tap theo du an (Research-Based Learning - RBL).

### Danh doi / Thach thuc:
- **Khoi luong thao tac cua giam khao tang**: Thay vi chi nhap 1 o diem, giam khao can nhap diem cho 3-5 tieu chi va viet nhan xet cho tung tieu chi.
- Giao dien cham diem tren web phai duoc thiet ke toi uu, ho tro luu nhap va tinh toan tong diem tuc thi (da duoc giai quyet tai JudgePage.tsx).

## 4. Bang chung & Kiem chung Tu dong (Automated Verification)

Quyet dinh ve Rubric va Calibration duoc kiem chung bang 16 unit tests trong backend:

1. **Bo test chinh sach trong so tieu chi (CriterionWeightPolicyTest)**:
   - `backend/src/test/java/com/seal/hackathon/service/CriterionWeightPolicyTest.java`:
     - `shouldPassWhenTotalWeightIs100`: Xac thuc tong trong so bang 100% duoc chap nhan.
     - `shouldFailWhenTotalWeightLessThan100`: Nem `BusinessRuleException` khi tong < 100.
     - `shouldFailWhenTotalWeightGreaterThan100`: Nem `BusinessRuleException` khi tong > 100.
     - `shouldFailWhenAnyWeightIsZeroOrNegative`: Nem ngoai le khi trong so <= 0.
2. **Bo test cham diem va xep hang**:
   - `backend/src/test/java/com/seal/hackathon/service/ScoreServiceTest.java`: Kiem tra tinh toan tong diem co trong so va khoa sua doi khi `finalized = true`.
   - `backend/src/test/java/com/seal/hackathon/service/RankingServiceTest.java`: Kiem tra thu tu xep hang dua tren diem tong hop sau danh gia.
3. **Lenh kiem chung**:
   ```bash
   cd backend && mvn test -Dtest=CriterionWeightPolicyTest,ScoreServiceTest,RankingServiceTest
   # 16/16 tests pass
   ```
