# Ràng buộc nghiệp vụ — đối chiếu với code thật

Tài liệu này lấy các ràng buộc nghiệp vụ trong [SRS §2.2](../01-yeu-cau/SRS.md) và
trả lời **một câu hỏi duy nhất cho từng ràng buộc: chỗ nào trong code thực thi nó?**

Không phải bảng "đã làm / chưa làm" tự đánh giá. Mỗi dòng phải chỉ được ra file và
số dòng cụ thể, hoặc thừa nhận là chưa có chỗ nào thực thi. Ràng buộc chỉ nằm trong
tài liệu mà không có trong code thì **không phải là ràng buộc** — nó là mong muốn.

Kiểm lần cuối: **15/09/2026**, trên `main`.

---

## Tổng kết

| | Số lượng |
|---|---|
| Thực thi đầy đủ ở backend | 3 |
| **Chỉ chặn ở frontend — gọi thẳng API là lách được** | **1** |
| **Có trường dữ liệu nhưng không có chỗ nào kiểm tra** | **1** |
| **Chưa thực thi ở đâu cả** | **1** |

---

## 1. Đội thi có từ 3 đến 5 thành viên

> SRS §2.2: *"Một đội thi có từ 3 đến 5 thành viên và chỉ đăng ký vào đúng một Hạng
> mục trong một sự kiện."*

**Trạng thái: ⚠️ CHỈ CHẶN Ở FRONTEND.**

| Nơi | Có chặn? |
|---|---|
| `frontend/src/types/index.ts:120-121` | ✅ `TEAM_MIN_MEMBERS = 3`, `TEAM_MAX_MEMBERS = 5` |
| `backend/.../service/TeamService.java` | ❌ không có chỗ nào đếm số thành viên |

Hệ quả: gọi thẳng `POST /api/teams/{teamId}/invites` qua `curl` thì mời được thành
viên thứ 6, 7, 8... Và một đội 1 người vẫn nộp bài được.

Cách sửa: thêm kiểm tra trong `TeamService.inviteMember()` và chặn nộp bài khi đội
chưa đủ 3 người.

---

## 2. Một đội chỉ đăng ký đúng một hạng mục trong một sự kiện

**Trạng thái: ✅ THỰC THI Ở BACKEND.**

`backend/.../service/TeamService.java:74`

```java
throw ApiException.conflict("Bạn đã thuộc một đội trong sự kiện này");
```

---

## 3. Một người không được vừa làm Mentor vừa làm Giám khảo của cùng một hạng mục

> SRS §2.2: *"...nhưng không được vừa làm Mentor vừa làm Giám khảo của cùng một Hạng
> mục (tránh xung đột lợi ích)."*

**Trạng thái: ❌ CHƯA THỰC THI Ở ĐÂU CẢ.**

`JudgeAssignmentService.assignJudge()` chỉ kiểm tra **một** điều — người này đã được
phân công cho vòng này chưa:

```java
if (roleAssignmentRepository.existsByUserIdAndRoleNameAndScopeTypeAndScopeId(
        judge.getId(), RoleName.JUDGE, ScopeType.ROUND, roundId)) {
    throw ApiException.conflict("Giám khảo đã được phân công cho vòng thi này");
}
```

Không có dòng nào hỏi: *"người này có đang là MENTOR của hạng mục nào trong vòng này
không?"*

Hệ quả: Ban tổ chức phân công được mentor của hạng mục "AI / Machine Learning" làm
giám khảo cho chính vòng thi có hạng mục đó. Đây là **xung đột lợi ích mà SRS nêu
đích danh là phải tránh** — và cũng là loại lỗi khó phát hiện khi demo, vì nó chỉ lộ
ra khi có người thực sự bị phân công trùng.

Cách sửa: trong `assignJudge()`, tra các `UserRoleAssignment` có
`roleName = MENTOR, scopeType = TRACK` của người đó, đối chiếu với danh sách hạng mục
thuộc sự kiện của vòng thi đang phân công.

---

## 4. Giám khảo khách mời có tài khoản giới hạn thời gian

> SRS §2.2: *"...tài khoản có thời hạn sử dụng gắn với sự kiện."*

**Trạng thái: ⚠️ CÓ TRƯỜNG DỮ LIỆU NHƯNG KHÔNG AI KIỂM TRA.**

Trường tồn tại và được ghi vào cơ sở dữ liệu:

| Nơi | Vai trò |
|---|---|
| `domain/entity/User.java:51` | khai báo `private Instant guestAccessExpiresAt` |
| `dto/auth/CreateGuestJudgeRequest.java:11` | nhận giá trị từ Ban tổ chức |
| `service/AuthService.java:148` | ghi vào bản ghi người dùng |

Nhưng **không có chỗ nào đọc nó ra để so với thời điểm hiện tại**. Tìm trong toàn bộ
`AuthService` và thư mục `security/` chỉ ra đúng một lần xuất hiện — dòng 148 ở trên,
là dòng *ghi*.

Hệ quả: tài khoản giám khảo khách mời **không bao giờ hết hạn**. Đặt hạn hôm qua thì
hôm nay vẫn đăng nhập và chấm điểm được.

Cách sửa: thêm kiểm tra trong `AuthService.login()` cạnh chỗ đã kiểm
`accountStatus != APPROVED`.

---

## 5. Mọi tài khoản phải được Ban tổ chức duyệt trước khi tham gia

**Trạng thái: ✅ THỰC THI Ở BACKEND.**

`service/AuthService.java` — chặn ở cả hai chỗ:

| Dòng | Chặn ở đâu |
|---|---|
| 68 | tài khoản mới tạo mặc định `AccountStatus.PENDING` |
| 95 | chặn khi đăng nhập |
| 114 | chặn khi làm mới token |

---

## 6. Thăng vòng tính tự động theo Top N mỗi hạng mục

**Trạng thái: ✅ THỰC THI Ở BACKEND.**

`service/RankingService.java:114`

```java
boolean promoted = round.getPromotionTopN() != null
        && trackId != null
        && rankInTrack <= round.getPromotionTopN();
```

Xếp hạng tính trong phạm vi từng hạng mục (`rankInTrack`), đúng như SRS mô tả.

---

## Vì sao viết tài liệu kiểu này

Cách thường gặp là liệt kê yêu cầu rồi tự đánh dấu "Done / Partial / Planned". Vấn đề
là không ai kiểm chứng được — người viết tự chấm điểm cho chính mình, và bảng đó mục
dần theo thời gian mà không ai biết.

Ở đây mỗi dòng phải **chỉ ra file và số dòng**. Ai đọc cũng mở ra kiểm lại được trong
ba mươi giây. Và khi chưa có chỗ nào thực thi thì ghi thẳng là chưa có, kèm gợi ý sửa
ở đâu — hữu ích hơn nhiều so với đánh dấu "Partial" rồi để đó.

Ba lỗ hổng ở mục 1, 3, 4 tìm ra được **chính nhờ viết tài liệu theo cách này**.
