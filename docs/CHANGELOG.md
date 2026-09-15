<!-- FILE NÀY SINH TỰ ĐỘNG — ĐỪNG SỬA TAY -->
<!-- Nguồn: lịch sử git · Sinh lại: node scripts/sinh-changelog.mjs -->

# Nhật ký thay đổi

Tổng hợp **38 pull request** đã merge vào `main`, nhóm theo tháng.

> Sinh tự động từ lịch sử git. Sửa file này bằng tay là mất công — lần chạy
> script sau sẽ ghi đè. Muốn một thay đổi hiện đẹp hơn ở đây thì viết tiêu đề
> commit đầu tiên của nhánh cho rõ nghĩa.

## Tháng 9/2026

*38 pull request*

### Tính năng

- **#42** Them cac ham dem cho Track, Round va Team repository — Huynhnguyen06
- **#35** feat(mentor): them lop goi API cho man hinh Mentor — toan05
- **#31** JAV-21 them du lieu mau va API cong khai cho bang xep hang — Giang-alt
- **#23** JAV-21 hien thuc kenh phan hoi mentor va xuat bao cao rbl excel — Giang-alt
- **#22** JAV-14 add team API service — Tran Thi Yen Vy
- **#16** feat: implement judge scoring (chấm điểm) feature — ThucToan
- **#2** [P6] Tieu chi cham, giai thuong va xu ly vi pham — LeMinhTai

### Sửa lỗi

- **#40** fix(demo): sua chuoi bam mat khau sai khien khong ai dang nhap duoc — DESKTOP-3PASSR8\Acer
- **#39** test: khoi phuc test cho trang Binh chon — Tran Thi Yen Vy
- **#37** chore: khoi phuc 7 file Docker tu main-backup, doi cong BFF 4001 sang 4000 — Huynhnguyen06
- **#34** fix: sua dong score bi trung khoa trong du lieu mau — Giang-alt
- **#33** fix: khoi phuc /health cho BFF va thong nhat cong 4000 — LeMinhTai
- **#32** fix(frontend): dong bo mockData voi du lieu mau that trong data-demo.sql — LeMinhTai
- **#24** fix(JAV-19): update team invite flow per requirements — Tran Thi Yen Vy
- **#20** fix(backend): bo sung phan con thieu de backend build va chay duoc — LeMinhTai
- **#12** fix: tra JAV-20, JAV-21, JAV-26 ve To Do va va lo jq bi vo — LeMinhTai
- **#11** fix: in thong bao loi that cua Jira khi go remote link that bai — LeMinhTai
- **#10** fix: chi quet dong dau commit, va khong fail khi issue khong ton tai — LeMinhTai
- **#9** fix: workflow Jira nhan nhieu ma JAV va bao ro khi khong tim thay — LeMinhTai

### Giao diện

- **#44** Them lib/dashboardPriority.ts - mo hinh du lieu cho trang chu — LeMinhTai
- **#43** Bo phan reset nen bi trung trong global.css — toan05
- **#41** Bo sung muc dieu huong con thieu cho Mentor, xep hang va duyet tai khoan — Giang-alt
- **#38** Them UI trang AuditLogPage — DESKTOP-3PASSR8\Acer
- **#28** feat(JAV-23): add coordinator team management UI — Tran Thi Yen Vy
- **#21** JAV-11 hoan thien LandingPage, VotingPage, RankingPage va bo UI dung chung — Giang-alt
- **#21** JAV-11 hoan thien LandingPage, VotingPage, RankingPage va bo UI dung chung — Giang-alt
- **#19** JAV-14 port giao dien doi thi va mentor len main moi — Tran Thi Yen Vy
- **#19** JAV-14 port giao dien doi thi va mentor len main moi — Tran Thi Yen Vy

### Hạ tầng & kiểm thử

- **#27** ci: them workflow build/test cho backend — LeMinhTai
- **#25** feat(JAV-24): add contestant team and submission UI — Tran Thi Yen Vy
- **#5** ci: dinh huong lai task theo cach dung main-backup, them 2 task FE — LeMinhTai
- **#4** ci: them che do list-issues cho workflow Jira — LeMinhTai
- **#3** ci: them workflow liet ke thanh vien va tao task Jira hang loat — LeMinhTai

### Tài liệu

- **#36** docs: viet lai README cho dung thuc te repo, cap nhat bang phan cong — Huynhnguyen06

### Dọn dẹp

- **#29** chore: go bo toan bo tich hop Jira — LeMinhTai
- **#8** chore: dong 4 issue frontend da hoan thanh tren main — LeMinhTai
- **#7** chore: giao them 8 task frontend con thieu cho demo — LeMinhTai
- **#6** chore: chia lai viec backend/bff theo so do phu thuoc entity — LeMinhTai

---

## Ghi chú về cách phân nhóm

Nhóm đoán từ từ khoá trong tên nhánh và tiêu đề commit. Cố ý **không** dùng quy
ước Conventional Commits (`feat:` / `fix:` / `chore:`) vì nhóm không viết commit
theo quy ước đó — ép vào sẽ ra một bảng phân loại sai mà trông như đúng.

Nhóm sai thì sửa hàm `phanNhom()` trong `scripts/sinh-changelog.mjs`, đừng sửa
file markdown này.
