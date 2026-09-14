# JavaTeam — SHMS (SEAL Hackathon Management System)

Nhánh `main` đã được dọn về trạng thái trống để cả nhóm xây frontend lại từ đầu
trong sprint **JAV Sprint 3: Xây FE**.

> Toàn bộ code cũ (backend, bff, frontend cũ, SRS, docker-compose) vẫn còn nguyên
> ở nhánh **`main-backup`**. Xem lại: `git checkout main-backup`

## Cách làm việc

Mỗi người làm trên nhánh của mình, xong thì mở Pull Request vào `main`.
Chỉ merge sau khi đã review.

| Task Jira | Nhánh | Người phụ trách |
|---|---|---|
| JAV-9  Nền tảng + xác thực quản trị     | `JAV-9-nen-tang`            | Phạm Nguyễn Hoài Long |
| JAV-11 Landingpage + Bảng kết quả       | `JAV-11-cong-khai`          | Lê Minh Tài |
| JAV-12 Coordinator + cấu trúc cuộc thi  | `JAV-12-cau-truc-cuoc-thi`  | Nguyên Tạ Huỳnh |
| JAV-13 Chấm điểm + Hiệu chuẩn           | `JAV-13-cham-diem`          | Toàn Huỳnh Thúc |
| JAV-14 Đội thi và mentor                | `JAV-14-doi-thi`            | Trần Thị Yến Vy |
| JAV-15 Tiêu chí chấm + giải thưởng      | `JAV-15-tieu-chi`           | Lê Minh Tài |

## Quy ước commit (bắt buộc)

Commit message và tiêu đề PR phải mở đầu bằng mã task:

```
JAV-13 them form cham diem cho giam khao
```

Cài hook kiểm tra tự động, mỗi người chạy 1 lần:

```bash
bash .github/hooks/setup-hooks.sh     # macOS / Linux
.github\hooks\setup-hooks.bat         # Windows
```

Chi tiết: [CONTRIBUTING.md](CONTRIBUTING.md)
