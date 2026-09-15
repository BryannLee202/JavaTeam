# ADR-001 — Chèn tầng BFF giữa React và Spring Boot

| | |
|---|---|
| **Trạng thái** | Đang áp dụng |
| **Ngày** | 2026-07 (ghi lại 2026-09-15) |
| **Ảnh hưởng tới** | Toàn bộ luồng gọi API, cách lưu token, cách chống CSRF |

## Bối cảnh

Kiến trúc thông thường cho bài tập dạng này là React gọi thẳng Spring Boot, token
lưu ở `localStorage` và gắn vào header `Authorization` bằng tay.

Cách đó có một điểm yếu không vá được: **JavaScript chạy trong trang đọc được
`localStorage`**. Chỉ cần một lỗ XSS ở bất kỳ đâu — một thư viện npm bị chèn mã, một
chỗ render nội dung người dùng nhập mà quên escape — là token bị lấy đi, và kẻ tấn
công dùng được nó từ máy khác cho tới khi token hết hạn.

Với hệ thống này thì hậu quả cụ thể là: lấy được token của giám khảo thì sửa được
điểm; lấy được token của Ban tổ chức thì loại được đội thi. Nhật ký kiểm tra vẫn ghi
đúng tên người bị mạo danh.

## Các phương án đã cân nhắc

**1. React gọi thẳng backend, token ở `localStorage`.**
Ít việc nhất, một tầng ít đi. Nhưng token phơi ra cho mọi đoạn JavaScript trong trang.

**2. React gọi thẳng backend, token ở cookie do Spring Boot đặt.**
Token an toàn hơn, nhưng Spring Boot phải tự lo CORS cho trình duyệt, tự lo CSRF, và
mọi endpoint đều phải phơi ra Internet. Backend gánh cả việc của tầng web.

**3. Chèn một tầng BFF (Backend For Frontend) ở giữa.** ← đã chọn
Frontend chỉ nói chuyện với BFF. BFF giữ token trong cookie `httpOnly`, gắn
`Authorization: Bearer` khi gọi tiếp xuống Spring Boot.

## Quyết định

Chọn phương án 3. Chèn một BFF viết bằng NestJS, chạy ở cổng 4000.

```
React (3001 dev / 3000 Docker)  →  BFF NestJS (4000)  →  Spring Boot (8080)
       không giữ token              giữ token trong        chỉ nhận Bearer
                                    cookie httpOnly
```

## Đánh đổi — nói thẳng phần mất

**Thêm một tầng phải chạy và phải debug.** Thứ tự khởi động thành bắt buộc: Backend
→ BFF → Frontend. Sai thứ tự là hỏng, và thông báo lỗi không nói rõ nguyên nhân.

**Một lời gọi đi qua hai chặng.** Chậm hơn, và khi lỗi thì phải xem log ở hai nơi.

**Dễ lệch cấu hình.** Đã dính thật hai lần:

- `frontend/src/api/client.ts` từng trỏ cổng 4001 trong khi BFF chạy ở 4000
- CORS mặc định của BFF chỉ có `localhost:3000`, trong khi README bảo chạy dev ở
  `3001` — làm đúng README thì đăng nhập báo "Network Error"

Cả hai đều đã sửa, nhưng chúng là cái giá thật của việc thêm một tầng.

**Hai lớp gọi API ở frontend.** `api/client.ts` (axios) và `api/http.ts` (fetch) từng
cấu hình lệch nhau — lớp fetch thiếu `credentials: "include"` nên mọi lời gọi thật
đều 401. Đây là loại lỗi chỉ nảy sinh vì có tầng BFF.

## Vì sao vẫn chọn

Điểm yếu của phương án 1 là **không vá được**: token ở `localStorage` thì luôn đọc
được bằng JavaScript, không có cách nào làm khác. Còn các nhược điểm của phương án 3
đều là **lỗi cấu hình sửa được** — và thực tế đã sửa xong cả bốn chỗ kể trên.

## Kiểm chứng bằng cách nào

Quyết định này còn hiệu lực khi cả bốn điều dưới đây đúng:

```bash
# 1. BFF đặt cookie httpOnly — phải thấy httpOnly: true
grep -n "httpOnly" bff/src/common/cookies.ts

# 2. Frontend KHÔNG lưu token vào localStorage — phải không ra kết quả nào
grep -rn "localStorage.*token\|setItem.*shms_at" frontend/src

# 3. Mọi lời gọi của frontend đều trỏ tới BFF, không trỏ thẳng 8080
grep -rn "localhost:8080" frontend/src

# 4. Test của BFF cho luồng đăng nhập vẫn xanh
cd bff && npm test
```

Điều 2 và 3 phải **không ra kết quả nào**. Ra kết quả nghĩa là có chỗ đang đi tắt
qua BFF, và quyết định này đã bị phá mà không ai ghi lại.
