# Cơ sở dữ liệu

**Chưa có tài liệu riêng ở đây.** Nguồn sự thật về cấu trúc dữ liệu:

| Cần biết | Đọc ở đâu |
|---|---|
| Danh sách thực thể và thuộc tính | [`../01-yeu-cau/SRS.md`](../01-yeu-cau/SRS.md) §6 — 13 thực thể, có bảng cho từng cái |
| Quan hệ giữa các thực thể | SRS §6.2 |
| Cấu trúc bảng thật đang chạy | `backend/src/main/resources/db/migration/` — 6 file Flyway |
| Dữ liệu mẫu để demo | `backend/src/main/resources/data-demo.sql` |

**Lưu ý:** SRS mô tả thiết kế *dự kiến*. Khi hai bên lệch nhau thì migration là đúng,
vì đó là thứ đang thực sự chạy.
