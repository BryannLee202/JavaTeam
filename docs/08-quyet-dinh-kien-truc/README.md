# Nhật ký quyết định kiến trúc (ADR)

Mỗi file ở đây ghi lại **một** quyết định kiến trúc: lúc đó đang vướng gì, đã cân
nhắc những phương án nào, chọn cái nào, và đánh đổi gì.

Viết ADR để trả lời được câu hỏi *"sao lại làm thế này?"* sáu tháng sau, khi người
quyết định đã quên còn người đọc code thì chưa từng biết.

| ADR | Quyết định | Trạng thái |
|---|---|---|
| [ADR-001](./ADR-001-chen-tang-BFF.md) | Chèn tầng BFF NestJS giữa React và Spring Boot | Đang áp dụng |
| [ADR-002](./ADR-002-token-trong-cookie-httponly.md) | Giữ JWT trong cookie `httpOnly` thay vì `localStorage` | Đang áp dụng |
| [ADR-003](./ADR-003-rubric-co-trong-so-va-hieu-chuan.md) | Chấm điểm theo rubric có trọng số, kèm vòng hiệu chuẩn | Đang áp dụng |

## Quy ước

**Đánh số liền mạch từ 001.** Không nhảy cóc — thiếu số ở giữa thì người đọc không
biết là ADR đã bị xoá hay chưa bao giờ tồn tại.

**Không sửa ADR cũ khi đổi ý.** Viết ADR mới, đặt trạng thái ADR cũ thành *Đã thay
thế bởi ADR-00x*. Nhật ký quyết định mà sửa được thì mất luôn giá trị làm nhật ký.

**Mỗi ADR phải có mục "Kiểm chứng bằng cách nào".** Một quyết định kiến trúc không
kiểm được thì không phân biệt được với một ý kiến. Mục này chỉ ra lệnh hoặc file test
chứng minh quyết định vẫn đang có hiệu lực trong code.
