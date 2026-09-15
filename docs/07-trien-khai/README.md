# Triển khai

**Chưa có tài liệu riêng ở đây.** Hướng dẫn chạy hiện nằm ở:

| Cần làm gì | Đọc ở đâu |
|---|---|
| Chạy dev, ba terminal | [`../../README.md`](../../README.md) |
| Kịch bản demo đầy đủ | [`../../DEMO_SCRIPT.md`](../../DEMO_SCRIPT.md) |
| Chạy bằng Docker | [`../../docker-compose.yml`](../../docker-compose.yml) |
| Biến môi trường frontend | [`../../frontend/.env.example`](../../frontend/.env.example) |
| Biến môi trường chung | [`../../.env.example`](../../.env.example) |

## Hai chỗ dễ vấp

**Cổng frontend khác nhau tuỳ cách chạy.** Chạy `vite` trực tiếp là **3001**, chạy
Docker qua Nginx là **3000**. Cả hai đều đúng, chỉ khác ngữ cảnh.

**Phải mở bằng `localhost`, không phải `127.0.0.1`.** Trình duyệt coi hai cái này là
hai origin khác nhau, và CORS của BFF chỉ cho phép `localhost`.
