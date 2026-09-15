# 04 - Co so Du lieu (Database Design & Migrations)

Thu muc nay quan ly thiet ke co so du lieu, lich su migration Flyway va du lieu mau cua he thong SHMS.

---

## 1. Quy uoc Danh so Migration Flyway (Zero-Padded 3 chu so)

He thong ap dung quy uoc danh so migration Flyway 3 chu so (`V001__` den `V999__`) thay cho cach danh so 1 chu so truyen thong:

- **Ly do ky thuat**: Flyway sap xep thu tu thuc thi cac script SQL theo thu tu chuoi ky tu (alphabetical sort). Neu dung `V1`, `V2`... `V10`, Flyway se thuc thi `V10` ngay sau `V1` va truoc `V2`. Dieu nay dan den loi lech schema nghiem trong khi he thong vuot qua 9 migrations.
- **Tep luu tru**: Toan bo script nam tai `backend/src/main/resources/db/migration/`.

### Danh muc 6 Ban Migration Hien tai:

| Phien ban | Ten tep SQL | Muc dich |
|---|---|---|
| **V001** | `V001__init_schema.sql` | Khoi tao toan bo schema co so du lieu ban dau (bang, khoa ngoai, constraint) |
| **V002** | `V002__seed_data.sql` | Nap du lieu khoi tao he thong (vai tro, tai khoan quan tri mac dinh) |
| **V003** | `V003__disqualification_indexes.sql` | Bo sung chi muc (indexes) toi uu truy van xu ly vi pham va loai doi thi |
| **V004** | `V004__mentor_feedback_message.sql` | Bo sung bang trao doi thong diep giua Mentor va Doi thi |
| **V005** | `V005__vote.sql` | Bo sung bang luu tru binh chon truc tuyen cua khach tham quan |
| **V006** | `V006__demo_seed_users.sql` | Bo sung tai khoan nguoi dung demo voi mat khau da ma hoa BCrypt |

---

## 2. Danh muc 21 Thuc the JPA (Entities)

Toan bo 21 thuc the duoc dinh nghia tai `backend/src/main/java/com/seal/hackathon/domain/entity/`:

1. `User`: Nguoi dung he thong va thong tin xac thuc.
2. `UserRoleAssignment`: Phan quyen vai tro va pham vi (GLOBAL, EVENT, TRACK, ROUND).
3. `Role`: Danh muc vai tro (ADMIN, COORDINATOR, JUDGE, MENTOR, CONTESTANT).
4. `Event`: Su kien cuoc thi Hackathon.
5. `Track`: Hang muc thi dau thuoc su kien.
6. `Round`: Vong thi dau trong su kien.
7. `CriteriaTemplate`: Mau tieu chi danh gia tieu chuan.
8. `RoundCriterion`: Tieu chi danh gia kem trong so cua tung vong thi.
9. `Team`: Doi thi tham gia hackathon.
10. `TeamMember`: Thanh vien trong doi thi kem vai tro (LEADER, MEMBER).
11. `TeamInvite`: Loi moi tham gia doi thi qua email.
12. `Submission`: Bai nop du thi theo vong cua doi thi.
13. `Score`: Diem cham chi tiet theo tung tieu chi va giam khao.
14. `Ranking`: Ket qua xep hang tong hop va diem trung binh.
15. `Disqualification`: Quyết dinh xu ly vi pham va loai doi thi / bai nop.
16. `AuditLog`: Nhat ky kiem tra moi thao tac quan trong trong he thong.
17. `CalibrationSession`: Phien hieu chuan danh gia do lech giam khao.
18. `FeedbackThread`: Chu de trao doi giua Mentor va Doi thi.
19. `FeedbackMessage`: Tin nhan chi tiet trong chu de trao doi.
20. `Prize`: Giai thuong cuoc thi duoc trao cho cac doi xuat sac.
21. `Vote`: Luot binh chon cong khai tu khan gia.

---

## 3. Du lieu Mau phuc vu Demo

- File `backend/src/main/resources/data-demo.sql` nap san 1 su kien, 3 hang muc, 2 vong thi, 6 doi thi va 42 luot cham diem day du.
- Khi chay profile `demo`, he thong dung H2 in-memory co so du lieu se tu dong khoi tao create-drop sach se va nap du lieu mau ngay lap tuc.
