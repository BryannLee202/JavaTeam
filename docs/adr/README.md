# Ho so Quyet dinh Kien truc (Architecture Decision Records - ADR)

Thu muc nay luu tru cac ban ghi quyet dinh kien truc quan trong cua he thong SHMS (SEAL Hackathon Management System). Moi ban ghi mo ta mot quyet dinh cong nghe hoac kien truc lon, bối canh dan den quyet dinh, cac phuong an da can nhac, va danh doi di kem.

## Danh muc cac Quyet dinh da Chap thuan (Accepted)

| Ma ADR | Ten quyet dinh | Trang thai | Nguoi de xuat | Ngay ghi nhan |
|---|---|---|---|---|
| [**ADR-001**](ADR-001-kien-truc-3-tang-bff-nestjs.md) | Kien truc 3 tang voi Backend-for-Frontend (BFF) NestJS lam API Gateway va Quan ly Phien | Accepted | Pham Nguyen Hoai Long | 15/09/2026 |
| [**ADR-002**](ADR-002-xac-thuc-cookie-httponly-va-csrf.md) | Co che Xac thuc Token qua Cookie HttpOnly va Phong chong CSRF Double-Submit | Accepted | Pham Nguyen Hoai Long | 15/09/2026 |
| [**ADR-003**](ADR-003-rubric-trong-so-va-hieu-chuan-diem-calibration.md) | Mo hinh Cham diem Rubric da Tieu chi co Trong so va Hieu chuan Do lech Giam khao (Calibration) | Accepted | Pham Nguyen Hoai Long | 15/09/2026 |

---

## Quy trinh De xuat ADR moi

Khi doi phat trien co nhu cau thay doi kien truc (vi du tich hop he thong moi, thay doi giao thuc bao mat, hoac them engine AI):
1. Tao ban nhap theo mau ADR-xxx-<ten-ngan-gon>.md voi trang thai Proposed.
2. Mo Pull Request de ca nhom phan bien va danh gia rui ro.
3. Khi duoc thong qua, cap nhat trang thai thanh Accepted va merge vao main.
