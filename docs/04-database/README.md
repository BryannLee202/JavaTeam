# 04 - Co so Du lieu (Database Design, Entities & Migrations)

Thu muc nay quan ly thiet ke co so du lieu, danh muc thuc the JPA va lich su migration Flyway cua he thong SHMS.

---

## 1. Co che Migration Flyway & Quy uoc 3 chu so (V001 - V999)

### 1.1. Co che xac dinh phien ban cua Flyway
- Flyway phan tich chuoi phien ban bang lop `org.flywaydb.core.api.MigrationVersion` dua tren cac phan doan so hoc (numeric segments).  
- Do do, Flyway mac dinh sap xep thu tu thuc thi theo gia tri so hoc thuc te: `1 < 2 < 3 < ... < 9 < 10 < 11`. Hoan toan **khong phai sap xep theo chuoi ky tu tho (lexicographical sort)**. Script `V10` se luon duoc chay sau script `V9`.

### 1.2. Ly do ky thuat cua quy uoc dem so 0 (Zero-Padded: V001..V999)
- **Hien thi tren cong cu lap trinh (IDE & OS File Explorer)**: Trinh quan ly file cua Windows/Linux va cac IDE (VS Code, IntelliJ IDEA, Git CLI) thuong ap dung thuat toan sap xep ky tu ASCII mac dinh. Neu khong dem so 0, `V10` se hien thi ngay canh `V1` truoc `V2`, gay roi mat va kho quan sat cho lap trinh vien.
- **Tu dong hoa & Regular Expression**: Giup cac script CI/CD, regex parser (nhu `^V\d{3}__.*\.sql$`) de dang kiem tra tinh nhat quan va bat dung dinh dang migration ma khong can xu ly logic do dai bien thien.

### Danh muc 6 Ban Migration:

| Phien ban | Ten tep SQL | Muc dich |
|---|---|---|
| **V001** | `V001__init_schema.sql` | Khoi tao toan bo schema co so du lieu ban dau (bang, khoa ngoai, constraint) |
| **V002** | `V002__seed_data.sql` | Nap du lieu khoi tao he thong (vai tro, tai khoan quan tri mac dinh) |
| **V003** | `V003__disqualification_indexes.sql` | Bo sung chi muc (indexes) toi uu truy van xu ly vi pham va loai doi thi |
| **V004** | `V004__mentor_feedback_message.sql` | Bo sung bang trao doi thong diep giua Mentor va Doi thi |
| **V005** | `V005__vote.sql` | Bo sung bang luu tru binh chon truc tuyen cua khach tham quan |
| **V006** | `V006__demo_seed_users.sql` | Bo sung tai khoan nguoi dung demo voi mat khau da ma hoa BCrypt |

---

## 2. Danh muc 21 Thuc the JPA (Entities) Thuc te

Toan bo 21 thuc the duoc dinh nghia tai package `com.seal.hackathon.domain.entity`:

1. `BaseEntity`: Lop truu tuong co so chua `id` (UUID), `createdAt`, `updatedAt`.
2. `User`: Nguoi dung he thong, email, mat khau ma hoa BCrypt va trang thai tai khoan.
3. `UserRoleAssignment`: Phan cong vai tro va pham vi hoat dong (Scope) cua nguoi dung.
4. `HackathonEvent`: Su kien Hackathon (ten, mo ta, trang thai DRAFT/OPEN/ONGOING/CLOSED).
5. `Track`: Hang muc thi dau thuoc su kien (AI, Web, Mobile, IoT...).
6. `Round`: Vong thi dau thuoc su kien kem moc thoi gian deadline.
7. `CriteriaTemplate`: Mau tieu chi danh gia tieu chuan duoc luu tru san.
8. `Criterion`: Tieu chi danh gia cua tung vong thi kem trong so (Weight).
9. `Team`: Doi thi tham gia cuoc thi va trang thai hoat dong.
10. `TeamMember`: Quan he thanh vien thuoc doi va vai tro trong doi.
11. `TeamInvite`: Loi moi tham gia doi thi gui den email ung vien.
12. `Submission`: Bai nop du thi cua doi theo tung vong thi.
13. `Score`: Diem danh gia chi tiet theo tung tieu chi va giam khao.
14. `Ranking`: Ket qua xep hang tong hop va diem trung binh cua doi.
15. `Disqualification`: Quyet dinh xu ly vi pham doi thi hoac bai nop.
16. `AuditLog`: Nhat ky he thong ghi lai moi thao tac quan trong.
17. `CalibrationRound`: Vong thi hieu chuan danh gia do lech giam khao.
18. `CalibrationScore`: Diem cham thu nghiem trong phien hieu chuan.
19. `MentorFeedbackMessage`: Tin nhan trao doi giua Mentor va Doi thi.
20. `Prize`: Co cau giai thuong trao cho cac doi dat thu hang cao.
21. `Vote`: Luot binh chon truc tuyen cong khai tu khan gia.

---

## 3. He thong Enum Chuan hoa trong Ma nguon

Dinh nghia tai package `com.seal.hackathon.domain.enums`:

- **RoleName (Vai tro nguoi dung)**:
  - `COORDINATOR`: Ban to chuc cuoc thi, quan ly toan bo su kien, vong thi va xep hang.
  - `JUDGE`: Giam khao cham thi theo tieu chi va tham gia hieu chuan.
  - `MENTOR`: Giang vien / Chuyen gia huong dan doi thi theo track.
  - `TEAM_LEADER`: Doi truong doi thi, co quyen nop bai va moi thanh vien.
  - `TEAM_MEMBER`: Thanh vien chinh thuc trong doi thi.
  *(Luu y: He thong khong su dung enum ADMIN hay CONTESTANT rieng biet ma phan quyen dua tren RoleName va ScopeType).*
- **ScopeType (Pham vi phan quyen)**: `GLOBAL`, `EVENT`, `TRACK`, `ROUND`.
- **AccountStatus (Trang thai tai khoan)**: `PENDING`, `APPROVED`, `REJECTED`.
- **SubmissionStatus (Trang thai bai nop)**: `PENDING`, `ON_TIME`, `LATE`, `MISSING`.
- **TeamStatus (Trang thai doi thi)**: `FORMING`, `REGISTERED`, `DISQUALIFIED`.
- **TeamMemberRole (Vai tro trong doi)**: `LEADER`, `MEMBER`.
- **TeamInviteStatus (Trang thai loi moi)**: `PENDING`, `ACCEPTED`, `DECLINED`.
- **DisqualificationTargetType**: `TEAM`, `SUBMISSION`.
- **JudgeType**: `INTERNAL`, `GUEST`.
- **AuditAction**: 17 loai hanh dong duoc kiem toan trong he thong.
