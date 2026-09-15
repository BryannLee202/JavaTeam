# Script tiện ích

Bốn script, chia làm hai loại.

## Loại 1 — sinh tài liệu

Chạy lại mỗi khi nguồn đổi. File sinh ra có dòng `<!-- FILE NÀY SINH TỰ ĐỘNG -->`
ở đầu.

| Script | Nguồn | Sinh ra |
|---|---|---|
| `docx-sang-markdown.py` | `SHMS_SRS_v1.0.docx` | `docs/01-yeu-cau/SRS.md` |
| `sinh-ma-tran-truy-vet.mjs` | `docs/01-yeu-cau/truy-vet.yml` | `docs/01-yeu-cau/ma-tran-truy-vet.md` |
| `sinh-changelog.mjs` | lịch sử git | `docs/CHANGELOG.md` |

```bash
python3 scripts/docx-sang-markdown.py SHMS_SRS_v1.0.docx docs/01-yeu-cau/SRS.md
node scripts/sinh-ma-tran-truy-vet.mjs
node scripts/sinh-changelog.mjs
```

## Loại 2 — gác

Chạy trong CI, thoát mã 1 khi phát hiện vấn đề.

| Script | Kiểm gì |
|---|---|
| `sinh-ma-tran-truy-vet.mjs --check` | đường dẫn bằng chứng còn tồn tại, bảng còn khớp YAML |
| `sinh-changelog.mjs --check` | CHANGELOG còn khớp lịch sử git |
| `kiem-adr.sh` | 11 phép kiểm — ba quyết định kiến trúc còn hiệu lực trong code |

```bash
node scripts/sinh-ma-tran-truy-vet.mjs --check
node scripts/sinh-changelog.mjs --check
bash scripts/kiem-adr.sh
```

Cả ba chạy trong [`.github/workflows/tai-lieu-ci.yml`](../.github/workflows/tai-lieu-ci.yml).

## Vì sao sinh tự động thay vì viết tay

Tài liệu viết tay mục dần mà không có tín hiệu nào báo. Đổi tên một class là bảng
truy vết sai ngay, nhưng vẫn **trông như đúng** — càng để lâu càng lệch.

Ở đây nguồn sự thật là code và file cấu hình, còn markdown chỉ là kết quả. CI so lại
ở mỗi lần push, nên tài liệu không thể lệch quá một commit.

## Phụ thuộc

| Script | Cần gì |
|---|---|
| `docx-sang-markdown.py` | Python 3 + `pip install python-docx` |
| `sinh-ma-tran-truy-vet.mjs` | Node 18+ — **không cần npm install** |
| `sinh-changelog.mjs` | Node 18+ và `git` — **không cần npm install** |
| `kiem-adr.sh` | bash + grep |

Ba script sau cố ý không dùng thư viện ngoài để CI khỏi phải cài gì thêm.
