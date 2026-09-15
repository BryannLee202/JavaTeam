# Yêu cầu phần mềm

Ba file ở đây liên quan chặt với nhau — biết file nào là nguồn, file nào là kết quả
thì mới sửa đúng chỗ.

```
SHMS_SRS_v1.0.docx          ← bản Word chính thức (ở gốc repo)
        │
        │  python3 scripts/docx-sang-markdown.py
        ▼
    SRS.md                   ← SINH TỰ ĐỘNG, đừng sửa tay

  truy-vet.yml               ← VIẾT TAY. Khai use case → file code + file test
        │
        │  node scripts/sinh-ma-tran-truy-vet.mjs
        ▼
 ma-tran-truy-vet.md         ← SINH TỰ ĐỘNG, đừng sửa tay
```

| File | Sửa được? | Sửa ở đâu nếu sai |
|---|---|---|
| [`SRS.md`](./SRS.md) | ❌ | sửa `SHMS_SRS_v1.0.docx` rồi chạy lại script |
| [`truy-vet.yml`](./truy-vet.yml) | ✅ | sửa thẳng, rồi chạy lại script sinh bảng |
| [`ma-tran-truy-vet.md`](./ma-tran-truy-vet.md) | ❌ | sửa `truy-vet.yml` rồi chạy lại script |

## Khi nào phải cập nhật truy-vet.yml

**Bất cứ khi nào đổi tên, gộp hay xoá một file đang được khai làm bằng chứng.** CI
sẽ đỏ ở lần push kế tiếp và nói rõ đường dẫn nào không còn tồn tại.

Ngoài ra nên cập nhật khi:

- làm xong một use case đang là `mot_phan` hoặc `chua_lam` → đổi `trang_thai`
- viết test mới cho một use case → thêm đường dẫn vào `test:`
- phát hiện một use case khai `xong` mà thực ra còn thiếu → hạ xuống `mot_phan` kèm
  `ghi_chu` nói rõ thiếu gì

Hạ trạng thái xuống không phải là việc xấu. Bảng nói đúng sự thật thì mới có ích.

## Chạy tại máy

```bash
node scripts/sinh-ma-tran-truy-vet.mjs           # sinh lại bảng
node scripts/sinh-ma-tran-truy-vet.mjs --check   # kiểm như CI, không ghi file
```
