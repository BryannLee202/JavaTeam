# Quy ước migration

## Đánh số ba chữ số

```
V001__init_schema.sql
V002__seed_data.sql
...
V006__demo_seed_users.sql
```

**Vì sao ba chữ số.** Flyway sắp thứ tự *chạy* theo phiên bản, nhưng khi liệt kê thư
mục thì công cụ đọc theo thứ tự chuỗi. Với tên `V1__` đến `V9__` chưa thấy vấn đề,
nhưng thêm file thứ 10 là `V10__` đứng ngay sau `V1__`:

```
V1__init_schema.sql
V10__them_bang_thong_bao.sql   ← đứng nhầm chỗ khi đọc bằng mắt
V2__seed_data.sql
```

Đổi lúc còn 6 file thì rẻ. Để đến lúc có 15 file thì phiền, và lúc đó đã có người
dựng cơ sở dữ liệu thật rồi.

## Đổi tên migration đã chạy có an toàn không

**Có.** Đã kiểm bằng Postgres 16 thật, không phải suy đoán:

| Bước | Kết quả |
|---|---|
| Chạy lần 1 với tên cũ `V1__`…`V6__` | ghi 6 dòng vào `flyway_schema_history` |
| Đổi tên file thành `V001__`…`V006__`, chạy lại trên **chính** cơ sở dữ liệu đó | `Successfully validated 6 migrations`, `Current version: 6` |
| Kiểm `flyway_schema_history` | vẫn đúng 6 dòng, không chạy lại, không sinh dòng trùng |

Lý do: Flyway so sánh theo **phiên bản** chứ không theo tên file. `MigrationVersion.fromVersion("1")`
và `fromVersion("001")` trả về hai đối tượng bằng nhau. Cột `script` trong
`flyway_schema_history` chỉ để tra cứu, không tham gia so sánh.

Nghĩa là ai đã có cơ sở dữ liệu local **không phải làm gì cả**.

## ⚠️ Một bẫy khi kéo code về

Sau khi kéo commit đổi tên, **phải chạy `clean` trước**:

```bash
cd backend && ./mvnw clean spring-boot:run
```

Không làm vậy thì `target/classes/db/migration/` còn giữ **cả bản cũ lẫn bản mới**,
và Flyway dừng ngay khi khởi động:

```
Found more than one migration with version 1
-> target/classes/db/migration/V1__init_schema.sql (SQL)
-> target/classes/db/migration/V001__init_schema.sql (SQL)
```

Lỗi này đã gặp thật lúc kiểm. Nó không phải lỗi của việc đổi tên — chỉ là bản build
cũ còn sót.

## Khi thêm migration mới

1. Đặt tên `V007__mo_ta_ngan.sql`, số tiếp theo, ba chữ số
2. Mô tả viết không dấu, ngăn bằng gạch dưới — nó thành cột `description` trong
   `flyway_schema_history`
3. **Không bao giờ sửa file migration đã merge vào `main`.** Flyway lưu checksum nội
   dung; sửa file cũ là mọi cơ sở dữ liệu đang chạy báo lỗi lệch checksum. Cần thay
   đổi thì viết migration mới.

## Migration chỉ chạy ở profile nào

| Profile | Flyway | Cách dựng schema |
|---|---|---|
| `demo` | **tắt** (`flyway.enabled: false`) | Hibernate `ddl-auto: create-drop` + `data-demo.sql` |
| `dev` | bật | Flyway, Postgres lưu bền |
| mặc định | bật | Flyway |

Nên buổi demo **không** đụng tới Flyway. Đó cũng là lý do đổi tên migration không gây
rủi ro gì cho buổi demo.
