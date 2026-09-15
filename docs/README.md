# Tài liệu dự án SHMS

Thư mục này là nơi duy nhất chứa tài liệu của dự án. Đánh số theo pha làm việc,
đọc từ trên xuống là đi từ "cần làm gì" đến "chạy nó ra sao".

| Thư mục | Nội dung | Trả lời câu hỏi |
|---|---|---|
| [`01-yeu-cau/`](./01-yeu-cau/) | Đặc tả yêu cầu phần mềm (SRS), ma trận truy vết | Hệ thống phải làm được gì? |
| [`02-phan-tich/`](./02-phan-tich/) | Vai trò nghiệp vụ, ràng buộc, từ điển thuật ngữ | Ai dùng, luật nghiệp vụ là gì? |
| [`03-kien-truc/`](./03-kien-truc/) | Kiến trúc ba tầng, thiết kế bảo mật | Ghép các phần lại thế nào? |
| [`04-co-so-du-lieu/`](./04-co-so-du-lieu/) | Mô hình dữ liệu, từ điển dữ liệu, migration | Dữ liệu nằm ở đâu, hình dạng ra sao? |
| [`05-api/`](./05-api/) | Danh sách endpoint, quy ước mã lỗi | Gọi hệ thống bằng cách nào? |
| [`06-kiem-thu/`](./06-kiem-thu/) | Kế hoạch kiểm thử, phạm vi bao phủ | Làm sao biết nó chạy đúng? |
| [`07-trien-khai/`](./07-trien-khai/) | Hướng dẫn cài đặt, bảng biến môi trường | Dựng lên máy khác thế nào? |
| [`08-quyet-dinh-kien-truc/`](./08-quyet-dinh-kien-truc/) | ADR — nhật ký quyết định kiến trúc | Vì sao chọn cách này mà không phải cách kia? |

## Quy ước

**Đánh số liền mạch.** Từ 01 đến 08, không nhảy cóc. Thêm pha mới thì chèn số
tiếp theo, không chèn số lẻ vào giữa.

**Tiếng Việt.** Toàn bộ tài liệu viết tiếng Việt, trừ tên riêng kỹ thuật
(endpoint, tên class, tên bảng) giữ nguyên.

**Tài liệu sinh tự động thì không sửa tay.** File nào có dòng cảnh báo
`<!-- FILE NÀY SINH TỰ ĐỘNG -->` ở đầu thì sửa nguồn rồi chạy lại script, đừng
sửa thẳng vào file — lần chạy sau sẽ ghi đè mất.

## Bắt đầu từ đâu

- Muốn hiểu hệ thống làm gì: [`01-yeu-cau/SRS.md`](./01-yeu-cau/SRS.md)
- Muốn biết yêu cầu nào đã code xong: [`01-yeu-cau/ma-tran-truy-vet.md`](./01-yeu-cau/ma-tran-truy-vet.md)
  — 27 use case, mỗi cái chỉ thẳng tới file code và file test. Bảng này sinh tự động
  và có CI gác, nên không mục theo thời gian.
- Muốn biết luật nghiệp vụ nào chưa được code thực thi:
  [`02-phan-tich/rang-buoc-nghiep-vu.md`](./02-phan-tich/rang-buoc-nghiep-vu.md)
- Muốn chạy hệ thống lên: [`../README.md`](../README.md) và [`../DEMO_SCRIPT.md`](../DEMO_SCRIPT.md)
