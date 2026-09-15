# ADR-002 — Giữ JWT trong cookie `httpOnly`, chống CSRF bằng double-submit

| | |
|---|---|
| **Trạng thái** | Đang áp dụng |
| **Ngày** | 2026-07 (ghi lại 2026-09-15) |
| **Liên quan** | [ADR-001](./ADR-001-chen-tang-BFF.md) — quyết định này chỉ thực hiện được vì có tầng BFF |

## Bối cảnh

[ADR-001](./ADR-001-chen-tang-BFF.md) chọn kiến trúc BFF để token không phơi ra cho
JavaScript. Nhưng chuyển token vào cookie lại mở ra một lỗ khác: **trình duyệt tự gửi
cookie kèm mọi request tới đúng tên miền đó** — kể cả request do trang web khác kích
hoạt.

Nghĩa là một trang bất kỳ có thể nhúng:

```html
<form action="https://shms/api/teams/xxx/disqualify" method="POST">
```

Nạn nhân đang đăng nhập SHMS mà mở trang đó là đội thi bị loại — trình duyệt tự gắn
cookie vào. Đây chính là CSRF, và nó **không tồn tại** ở cách lưu `localStorage`, vì
header `Authorization` phải gắn bằng tay.

Vá một lỗ thì mở lỗ khác. Phải xử lý cả hai.

## Các phương án đã cân nhắc

**1. Chỉ dựa vào `SameSite=Strict`.**
Đơn giản nhất, trình duyệt tự chặn. Nhưng `Strict` làm hỏng luồng quay lại từ link
ngoài, và khi frontend với BFF khác cổng (3001 và 4000) thì phải dùng `SameSite=None`
— lúc đó mất sạch tác dụng chống CSRF.

**2. Token CSRF lưu ở phía máy chủ (synchronizer token).**
Chắc chắn nhất. Nhưng BFF phải giữ trạng thái cho từng phiên — mất tính không trạng
thái, và phải thêm chỗ lưu.

**3. Double-submit cookie.** ← đã chọn
Đặt thêm một cookie CSRF **đọc được bằng JavaScript**, client tự đọc rồi gửi lại
trong header. Kẻ tấn công ở tên miền khác không đọc được cookie của mình nên không
tạo được header khớp.

## Quyết định

Ba cookie, hai loại khác hẳn nhau:

| Cookie | `httpOnly` | Vai trò |
|---|---|---|
| `shms_at` | ✅ true | access token, hạn 1 giờ |
| `shms_rt` | ✅ true | refresh token, hạn 7 ngày |
| `XSRF-TOKEN` | ❌ **false** | token CSRF, client PHẢI đọc được |

`XSRF-TOKEN` để `httpOnly: false` là **cố ý**, không phải sơ suất. Client phải đọc
được nó để gửi lại trong header `X-XSRF-TOKEN`. Nó không phải bí mật — nó chỉ chứng
minh "request này do JavaScript cùng tên miền tạo ra".

`csrf.guard.ts` bỏ qua các phương thức an toàn (GET/HEAD/OPTIONS) và chỉ kiểm với
POST/PUT/PATCH/DELETE.

## Đánh đổi

**Mọi lớp gọi API phải cấu hình đúng, không sót lớp nào.** Đây là điểm yếu thật, và
đã dính: `frontend/src/api/http.ts` thiếu cả `credentials: "include"` lẫn header CSRF,
trong khi `api/client.ts` có đủ. Kết quả là mọi lời gọi qua lớp fetch đều 401, và
mọi thao tác ghi đều trượt CSRF. Lỗi nằm im vì lớp đó chỉ dùng khi tắt dữ liệu giả.

**`SameSite` khác nhau giữa dev và production.** `lax` khi dev, `none` khi production
(vì khác tên miền). Hai môi trường hành xử khác nhau ở đúng chỗ liên quan tới bảo mật
— dễ "chạy tốt ở máy em".

**Không chống được XSS.** Cookie `httpOnly` chặn kẻ tấn công *đọc* token, nhưng nếu
đã có XSS thì chúng gọi API ngay trong trang nạn nhân được — trình duyệt vẫn tự gắn
cookie. Quyết định này giảm thiệt hại khi bị XSS, **không** thay thế việc phải escape
đầu ra cho đúng.

## Kiểm chứng bằng cách nào

```bash
# 1. Hai token phải httpOnly, cookie CSRF phải KHÔNG httpOnly
grep -n "httpOnly" bff/src/common/cookies.ts

# 2. Guard chỉ bỏ qua phương thức an toàn
grep -n "SAFE_METHODS" bff/src/common/csrf.guard.ts

# 3. Cả hai lớp gọi API của frontend đều gửi cookie
grep -n "withCredentials" frontend/src/api/client.ts
grep -n "credentials" frontend/src/api/http.ts

# 4. Test CSRF của BFF vẫn xanh
cd bff && npm test -- csrf
```

Điều 3 là chỗ đã từng hỏng — **phải ra kết quả ở cả hai file**. Thiếu một file nghĩa
là có lớp gọi API đang không gửi cookie, và quyết định này đã bị phá ở một nửa hệ thống.
