# API

**Chưa có bản đặc tả viết tay.** Danh sách endpoint hiện lấy trực tiếp từ code:

```bash
# Liệt kê mọi endpoint backend
grep -rhoE '@(Get|Post|Put|Patch|Delete)Mapping\("[^"]*"\)' \
  backend/src/main/java/com/seal/hackathon/controller/ | sort -u
```

Một số controller đặt tiền tố ở mức class bằng `@RequestMapping`, nên đường dẫn đầy
đủ phải ghép hai phần.

| Cần biết | Đọc ở đâu |
|---|---|
| Quy ước lỗi trả về | `backend/.../exception/GlobalExceptionHandler.java` |
| Lớp gọi API phía frontend | `frontend/src/api/` |
| Vì sao đi qua BFF chứ không gọi thẳng | [`../08-quyet-dinh-kien-truc/`](../08-quyet-dinh-kien-truc/) |

⚠️ `frontend/src/api/events.ts` đang trỏ tới các đường dẫn tiền tố `/coordinator/...`
mà **backend không có** — xem ghi chú ở đầu file đó, có liệt kê 11 endpoint còn thiếu.
