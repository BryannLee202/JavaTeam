<!-- FILE NÀY SINH TỰ ĐỘNG — ĐỪNG SỬA TAY -->
<!-- Nguồn: SHMS_SRS_v1.0.docx  ·  Sinh lại: python3 scripts/docx-sang-markdown.py SHMS_SRS_v1.0.docx docs/01-yeu-cau/SRS.md -->

# Đặc tả yêu cầu phần mềm (SRS)

**Hệ thống quản lý cuộc thi SEAL Hackathon — SHMS**

> Bản Markdown này sinh tự động từ `SHMS_SRS_v1.0.docx`. Sửa bản Word rồi chạy
> lại script, đừng sửa thẳng vào đây — lần sinh sau sẽ ghi đè.
>
> Có bản Markdown để xem được diff trên GitHub và đọc thẳng trên web, không
> phải tải file Word về mới đọc được.

| Thông tin | Nội dung |
| --- | --- |
| Mã tài liệu | SHMS-SRS-1.0 |
| Phiên bản | 1.0 |
| Ngày phát hành | 24/07/2026 |
| Trạng thái | Bản thảo phục vụ báo cáo giảng viên |
| Đối tượng đọc | Giảng viên hướng dẫn, Hội đồng, Nhóm phát triển |


## 1. GIỚI THIỆU

### 1.1. Mục đích tài liệu

Tài liệu này đặc tả toàn bộ yêu cầu nghiệp vụ, yêu cầu chức năng, yêu cầu phi chức năng và mô hình dữ liệu cho Hệ thống Quản lý Cuộc thi SEAL Hackathon (SEAL Hackathon Management System – SHMS), phục vụ cho khóa luận/đồ án tốt nghiệp ngành Kỹ thuật Phần mềm. Tài liệu là cơ sở thống nhất giữa nhóm phát triển và giảng viên hướng dẫn về phạm vi, chức năng và tiêu chí nghiệm thu của hệ thống.

### 1.2. Phạm vi dự án

SHMS là nền tảng web quản lý toàn bộ vòng đời của một cuộc thi hackathon học thuật: từ khởi tạo sự kiện, cấu hình vòng thi và hạng mục, đăng ký đội thi, nộp bài, phân công giám khảo, chấm điểm theo tiêu chí, xếp hạng – thăng vòng – loại, cho đến công bố kết quả và trao giải. Bên cạnh vai trò một hệ thống quản lý vận hành (operations system), SHMS còn đóng vai trò là công cụ thu thập dữ liệu phục vụ đề tài nghiên cứu về độ tin cậy liên đánh giá viên (inter-rater reliability) trong chấm điểm hackathon – một hướng nghiên cứu dựa trên học tập trải nghiệm (Research-Based Learning – RBL).

### 1.3. Bối cảnh và vấn đề hiện tại

Hiện nay công tác tổ chức các cuộc thi hackathon trong Khoa/Bộ môn được thực hiện phần lớn theo phương thức thủ công, phát sinh các vấn đề:

- Đăng ký đội thi và phân bổ hạng mục thi đấu thực hiện thủ công (Excel/Form rời rạc), dễ chậm trễ, sai lệch và trùng lặp dữ liệu.
- Giám khảo chấm điểm trên các file Excel độc lập; Ban tổ chức phải tổng hợp, đối chiếu và nhập lại thủ công, tốn thời gian và tiềm ẩn sai sót khi tính điểm/xếp hạng.
- Kênh liên lạc giữa Ban tổ chức – Mentor – Đội thi – Giám khảo rời rạc, không tập trung, khó truy vết.
- Không có nhật ký (audit log) cho các quyết định chấm điểm và loại đội, làm giảm tính minh bạch, gây khó khăn khi có khiếu nại kết quả.
- Chưa có cơ chế đo lường, phân tích mức độ đồng thuận (consistency) giữa các giám khảo khi chấm cùng một bài nộp — một yếu tố cốt lõi ảnh hưởng đến tính công bằng của cuộc thi nhưng chưa được nghiên cứu bài bản trong bối cảnh hackathon học thuật.

### 1.4. Mục tiêu dự án

- Xây dựng hệ thống web quản lý cuộc thi hackathon tập trung, số hóa toàn bộ quy trình từ đăng ký đến trao giải, giảm thiểu thao tác thủ công và sai sót dữ liệu.
- Cung cấp cơ chế chấm điểm minh bạch, có nhật ký kiểm tra (audit trail) đầy đủ cho mọi hành động chấm điểm và loại đội.
- Thiết kế mô-đun thu thập dữ liệu nghiên cứu (RBL) để phục vụ trả lời câu hỏi nghiên cứu về độ tin cậy liên đánh giá viên (inter-rater reliability) trong chấm điểm hackathon.
- Xuất báo cáo, số liệu (CSV/Excel) phục vụ cả công tác vận hành (kết quả, giải thưởng) lẫn phân tích thống kê phục vụ nghiên cứu.

### 1.5. Định nghĩa, thuật ngữ và từ viết tắt

| Thuật ngữ | Giải thích |
| --- | --- |
| SHMS | SEAL Hackathon Management System – tên gọi hệ thống |
| Event | Sự kiện hackathon (một mùa giải cụ thể) |
| Round | Vòng thi trong một sự kiện (VD: Vòng loại, Vòng chung kết) |
| Track | Hạng mục thi đấu (danh mục/chủ đề) trong một sự kiện |
| Team | Đội thi, gồm 3–5 thành viên |
| Judge | Giám khảo (nội bộ – Internal, hoặc khách mời – Guest) |
| Mentor | Giảng viên hướng dẫn được phân công cho một Hạng mục |
| Submission | Bài nộp của đội thi trong một vòng thi cụ thể |
| Criterion | Tiêu chí chấm điểm (có trọng số) áp dụng cho một vòng/sự kiện |
| RBL | Research-Based Learning – học tập dựa trên nghiên cứu |
| ICC | Intraclass Correlation Coefficient – hệ số tương quan nội lớp |
| Krippendorff's α | Chỉ số đo độ tin cậy liên đánh giá viên (inter-rater reliability) |
| JWT | JSON Web Token – cơ chế xác thực phiên đăng nhập |
| RBAC | Role-Based Access Control – phân quyền theo vai trò |

### 1.6. Tài liệu tham khảo

- Đề cương đề tài do Bộ môn/Khoa Kỹ thuật Phần mềm cung cấp (SEAL Hackathon Management System).
- Kaggle – ARC Prize 2026 (ARC-AGI-2) Competition, tham khảo cấu trúc tổ chức, hạng mục và quy trình chấm giải của một cuộc thi công nghệ quy mô lớn: https://www.kaggle.com/competitions/arc-prize-2026-arc-agi-2
- Các tài liệu học thuật về Inter-rater Reliability: Intraclass Correlation Coefficient (ICC), Krippendorff's Alpha.

## 2. TỔNG QUAN HỆ THỐNG VÀ VAI TRÒ NGHIỆP VỤ

### 2.1. Đối tượng người dùng (Business Roles / Actors)

Hệ thống phục vụ 5 nhóm vai trò nghiệp vụ chính. Một tài khoản có thể đảm nhận nhiều vai trò khác nhau ở các phạm vi khác nhau trong cùng một sự kiện (ví dụ: một giảng viên có thể là Mentor của Hạng mục A và đồng thời là Giám khảo của Hạng mục B trong cùng sự kiện).

| Vai trò | Mô tả | Quyền hạn chính |
| --- | --- | --- |
| Team Member<br>(Thành viên đội) | Sinh viên/người tham gia là thành viên trong một đội thi. | Xem thông tin đội, xem tiêu chí chấm điểm, xem kết quả/xếp hạng của đội mình. |
| Team Leader<br>(Đội trưởng) | Thành viên đứng đầu đội thi, đại diện đội trong các giao dịch với hệ thống. | Tạo/quản lý đội, mời thành viên, đăng ký Hạng mục, nộp bài theo từng vòng. |
| Mentor | Giảng viên/chuyên gia được phân công hướng dẫn một Hạng mục cụ thể trong sự kiện. | Xem tiến độ, hỗ trợ trao đổi với các đội trong Hạng mục được phân công; không chấm điểm Hạng mục mình làm Mentor. |
| Judge<br>(Giám khảo nội bộ / khách mời) | Người chấm điểm bài nộp theo tiêu chí đã cấu hình. Giám khảo khách mời dùng tài khoản tạm thời do BTC tạo. | Chấm điểm theo tiêu chí cho các vòng/đội được phân công; tham gia vòng hiệu chuẩn (nếu có). |
| Event Coordinator<br>(SE Dept / PDP Staff) | Ban tổ chức – quản trị viên nghiệp vụ của hệ thống, thuộc Bộ môn SE hoặc phòng PDP. | Toàn quyền cấu hình sự kiện, vòng thi, hạng mục, tiêu chí; phê duyệt tài khoản; phân công Mentor/Giám khảo; loại đội; công bố kết quả và giải thưởng; xem toàn bộ audit log. |

### 2.2. Ràng buộc nghiệp vụ quan trọng

- Một đội thi có từ 3 đến 5 thành viên và chỉ đăng ký vào đúng một Hạng mục trong một sự kiện.
- Một giảng viên có thể là Mentor của Hạng mục này và là Giám khảo của Hạng mục khác trong cùng sự kiện, nhưng không được vừa làm Mentor vừa làm Giám khảo của cùng một Hạng mục (tránh xung đột lợi ích).
- Giám khảo khách mời chỉ có quyền chấm điểm cho đúng những vòng/hạng mục được Ban tổ chức phân công, tài khoản có thời hạn sử dụng gắn với sự kiện.
- Mọi tài khoản (trừ tài khoản BTC khởi tạo) đều ở trạng thái “Chờ duyệt” sau khi đăng ký và cần Ban tổ chức phê duyệt trước khi được tham gia bất kỳ hoạt động nào của cuộc thi.
- Việc thăng vòng được tính tự động theo quy tắc Top N đội mỗi Hạng mục do Ban tổ chức cấu hình cho từng vòng.

## 3. YÊU CẦU CHỨC NĂNG

Các yêu cầu chức năng được nhóm theo 10 mô-đun nghiệp vụ. Mỗi Use Case trọng yếu được đặc tả theo mẫu: Actor, độ ưu tiên (Cao/Trung bình/Thấp), mô tả, điều kiện tiên quyết, luồng chính và luồng ngoại lệ.

### 3.1. Mô-đun Đăng ký & Xác thực người dùng

#### UC-01 — Đăng ký tài khoản

| Thuộc tính | Nội dung |
| --- | --- |
| Actor | Người tham gia (chưa có tài khoản) |
| Độ ưu tiên | Cao |
| Mô tả | Người dùng đăng ký tài khoản bằng Email/Mật khẩu và tự phân loại là Sinh viên FPT (nhập mã số sinh viên FPT) hoặc Sinh viên ngoài trường (nhập mã số sinh viên + tên trường). |
| Điều kiện tiên quyết | Email chưa tồn tại trong hệ thống. |
| Luồng chính | 1) Người dùng chọn loại tài khoản (FPT/ngoài trường) → 2) Nhập thông tin cá nhân, email, mật khẩu → 3) Hệ thống kiểm tra hợp lệ và tạo tài khoản ở trạng thái “Chờ duyệt” → 4) Gửi email xác nhận đã tiếp nhận đăng ký. |
| Luồng ngoại lệ / thay thế | Email đã tồn tại → báo lỗi trùng email. Mật khẩu không đạt độ mạnh tối thiểu → yêu cầu nhập lại. |

#### UC-02 — Phê duyệt tài khoản

| Thuộc tính | Nội dung |
| --- | --- |
| Actor | Event Coordinator |
| Độ ưu tiên | Cao |
| Mô tả | Ban tổ chức xem danh sách tài khoản chờ duyệt, kiểm tra thông tin và phê duyệt hoặc từ chối. |
| Điều kiện tiên quyết | Tài khoản ở trạng thái “Chờ duyệt”. |
| Luồng chính | 1) BTC mở danh sách tài khoản chờ duyệt → 2) Xem chi tiết hồ sơ → 3) Chọn Phê duyệt/Từ chối (kèm lý do nếu từ chối) → 4) Hệ thống cập nhật trạng thái và gửi thông báo cho người dùng. |
| Luồng ngoại lệ / thay thế | Từ chối do thông tin không hợp lệ → tài khoản chuyển trạng thái “Bị từ chối”, ghi log. |

#### UC-03 — Đăng nhập (JWT)

| Thuộc tính | Nội dung |
| --- | --- |
| Actor | Tất cả người dùng đã được duyệt |
| Độ ưu tiên | Cao |
| Mô tả | Người dùng đăng nhập bằng Email/Mật khẩu, hệ thống cấp JSON Web Token (JWT) cho phiên làm việc. |
| Điều kiện tiên quyết | Tài khoản đã được BTC phê duyệt. |
| Luồng chính | 1) Nhập email/mật khẩu → 2) Hệ thống xác thực → 3) Trả về access token + refresh token → 4) Client lưu token cho các yêu cầu tiếp theo. |
| Luồng ngoại lệ / thay thế | Sai thông tin đăng nhập → báo lỗi, giới hạn số lần thử. Tài khoản chưa duyệt → chặn đăng nhập kèm thông báo trạng thái. |

#### UC-04 — Khởi tạo tài khoản Giám khảo khách mời

| Thuộc tính | Nội dung |
| --- | --- |
| Actor | Event Coordinator |
| Độ ưu tiên | Trung bình |
| Mô tả | BTC tạo tài khoản tạm thời cho Giám khảo khách mời và phân công trực tiếp vào (các) vòng thi cụ thể. |
| Điều kiện tiên quyết | Sự kiện và vòng thi đã được cấu hình. |
| Luồng chính | 1) BTC nhập thông tin Giám khảo khách mời → 2) Hệ thống sinh tài khoản + mật khẩu tạm/ liên kết đặt mật khẩu → 3) BTC phân công vòng thi cho tài khoản → 4) Hệ thống gửi thông tin đăng nhập qua email. |
| Luồng ngoại lệ / thay thế | Giám khảo khách mời không được cấp quyền ngoài phạm vi vòng thi đã phân công. |

### 3.2. Mô-đun Quản lý sự kiện & vòng thi

#### UC-05 — Tạo và quản lý sự kiện Hackathon

| Thuộc tính | Nội dung |
| --- | --- |
| Actor | Event Coordinator |
| Độ ưu tiên | Cao |
| Mô tả | BTC tạo mới một sự kiện hackathon với thông tin tổng quan (tên, mô tả, thời gian, trạng thái) và quản lý vòng đời sự kiện (Nháp → Đang mở đăng ký → Đang diễn ra → Đã kết thúc). |
| Điều kiện tiên quyết | Tài khoản có vai trò Event Coordinator. |
| Luồng chính | 1) Nhập thông tin sự kiện → 2) Chọn mẫu tiêu chí mặc định để kế thừa → 3) Lưu sự kiện ở trạng thái Nháp → 4) Chuyển trạng thái khi sẵn sàng mở đăng ký. |
| Luồng ngoại lệ / thay thế | Sự kiện đã có đội đăng ký thì không được xoá, chỉ có thể chuyển sang trạng thái Huỷ/Đóng. |

#### UC-06 — Cấu hình nhiều vòng thi trong sự kiện

| Thuộc tính | Nội dung |
| --- | --- |
| Actor | Event Coordinator |
| Độ ưu tiên | Cao |
| Mô tả | BTC cấu hình các vòng thi (VD: Vòng loại, Vòng chung kết) theo thứ tự, mỗi vòng có hạn nộp bài, giám khảo phụ trách và bộ tiêu chí riêng. |
| Điều kiện tiên quyết | Sự kiện đã tồn tại. |
| Luồng chính | 1) Thêm vòng thi mới, đặt tên và thứ tự → 2) Thiết lập hạn nộp bài → 3) Gắn bộ tiêu chí cho vòng → 4) Phân công giám khảo cho vòng → 5) Thiết lập quy tắc thăng vòng (Top N theo Hạng mục). |
| Luồng ngoại lệ / thay thế | Hạn nộp bài của vòng sau phải muộn hơn vòng trước. Không cho phép chỉnh sửa quy tắc thăng vòng sau khi vòng đã kết thúc và có kết quả chính thức. |

### 3.3. Mô-đun Quản lý tiêu chí chấm điểm

#### UC-07 — Duy trì mẫu tiêu chí mặc định (Criteria Template)

| Thuộc tính | Nội dung |
| --- | --- |
| Actor | Event Coordinator |
| Độ ưu tiên | Trung bình |
| Mô tả | BTC xây dựng và duy trì các mẫu bộ tiêu chí chấm điểm dùng lại được qua nhiều sự kiện (VD: Tính sáng tạo, Tính khả thi kỹ thuật, Trải nghiệm người dùng, Thuyết trình...). |
| Điều kiện tiên quyết | Không. |
| Luồng chính | 1) Tạo mẫu tiêu chí mới → 2) Thêm các tiêu chí thành phần với trọng số (%) và thang điểm tối đa → 3) Lưu mẫu để tái sử dụng cho các sự kiện sau. |
| Luồng ngoại lệ / thay thế | Tổng trọng số các tiêu chí trong một mẫu phải bằng 100%; hệ thống từ chối lưu nếu không thỏa. |

#### UC-08 — Tùy chỉnh tiêu chí theo sự kiện

| Thuộc tính | Nội dung |
| --- | --- |
| Actor | Event Coordinator |
| Độ ưu tiên | Cao |
| Mô tả | Mỗi sự kiện kế thừa mẫu tiêu chí mặc định và có thể thêm, bớt hoặc điều chỉnh trọng số cho phù hợp với sự kiện cụ thể. |
| Điều kiện tiên quyết | Sự kiện đã chọn một mẫu tiêu chí gốc. |
| Luồng chính | 1) Hệ thống nạp danh sách tiêu chí từ mẫu gốc → 2) BTC thêm/xoá/sửa tiêu chí và trọng số cho sự kiện hiện tại → 3) Lưu bộ tiêu chí áp dụng riêng cho sự kiện/vòng. |
| Luồng ngoại lệ / thay thế | Không cho phép thay đổi bộ tiêu chí của một vòng sau khi vòng đó đã có điểm được ghi nhận, để đảm bảo tính nhất quán. |

### 3.4. Mô-đun Quản lý hạng mục (Track)

#### UC-09 — Tạo Hạng mục thi đấu

| Thuộc tính | Nội dung |
| --- | --- |
| Actor | Event Coordinator |
| Độ ưu tiên | Cao |
| Mô tả | BTC tạo các Hạng mục (danh mục thi đấu, VD: AI/ML, Fintech, EdTech...) trong một sự kiện để đội thi đăng ký. |
| Điều kiện tiên quyết | Sự kiện đã tồn tại. |
| Luồng chính | 1) Nhập tên, mô tả Hạng mục → 2) Lưu Hạng mục thuộc sự kiện. |
| Luồng ngoại lệ / thay thế | Không xoá được Hạng mục đã có đội đăng ký; chỉ có thể đóng đăng ký. |

#### UC-10 — Phân công Mentor cho Hạng mục

| Thuộc tính | Nội dung |
| --- | --- |
| Actor | Event Coordinator |
| Độ ưu tiên | Trung bình |
| Mô tả | BTC phân công một hoặc nhiều Mentor phụ trách hướng dẫn cho từng Hạng mục. |
| Điều kiện tiên quyết | Hạng mục và tài khoản Mentor đã tồn tại và được duyệt. |
| Luồng chính | 1) Chọn Hạng mục → 2) Chọn giảng viên → 3) Gán vai trò Mentor cho Hạng mục đó. |
| Luồng ngoại lệ / thay thế | Hệ thống cảnh báo nếu giảng viên được chọn đã là Giám khảo của chính Hạng mục này trong cùng sự kiện (xung đột vai trò). |

### 3.5. Mô-đun Quản lý đội thi

#### UC-11 — Thành lập đội thi

| Thuộc tính | Nội dung |
| --- | --- |
| Actor | Team Leader |
| Độ ưu tiên | Cao |
| Mô tả | Một sinh viên đã được duyệt tài khoản tạo đội thi mới, mời 2–4 thành viên khác tham gia (tổng 3–5 thành viên). |
| Điều kiện tiên quyết | Sự kiện đang mở đăng ký đội. |
| Luồng chính | 1) Tạo đội, đặt tên đội → 2) Mời thành viên bằng email → 3) Thành viên xác nhận tham gia → 4) Đội đạt tối thiểu 3 thành viên để đủ điều kiện đăng ký Hạng mục. |
| Luồng ngoại lệ / thay thế | Một thành viên chỉ được thuộc một đội trong cùng một sự kiện. Đội chưa đủ 3 thành viên không được đăng ký Hạng mục. |

#### UC-12 — Đăng ký đội vào Hạng mục

| Thuộc tính | Nội dung |
| --- | --- |
| Actor | Team Leader |
| Độ ưu tiên | Cao |
| Mô tả | Đội trưởng đăng ký đội thi của mình vào một Hạng mục cụ thể trong sự kiện. |
| Điều kiện tiên quyết | Đội đã đủ số lượng thành viên tối thiểu; sự kiện còn mở đăng ký. |
| Luồng chính | 1) Chọn sự kiện → 2) Chọn Hạng mục → 3) Xác nhận đăng ký → 4) Hệ thống khoá Hạng mục của đội cho sự kiện đó (không đổi hạng mục tùy tiện sau khi đã có bài nộp). |
| Luồng ngoại lệ / thay thế | Hạng mục đã đủ số lượng đội tối đa (nếu BTC giới hạn) → từ chối đăng ký, gợi ý Hạng mục khác. |

### 3.6. Mô-đun Nộp bài (Submission)

#### UC-13 — Nộp bài dự thi theo vòng

| Thuộc tính | Nội dung |
| --- | --- |
| Actor | Team Leader |
| Độ ưu tiên | Cao |
| Mô tả | Đội thi nộp bài cho một vòng cụ thể bằng cách cung cấp các đường dẫn URL: repository dự án, demo, báo cáo/slide. |
| Điều kiện tiên quyết | Đội đã đăng ký Hạng mục; vòng thi đang mở nộp bài (chưa quá hạn). |
| Luồng chính | 1) Chọn vòng thi → 2) Nhập URL repository, URL demo, URL báo cáo/slide → 3) Hệ thống kiểm tra định dạng URL hợp lệ → 4) Ghi nhận thời điểm nộp bài, cho phép nộp lại (ghi đè) trước hạn. |
| Luồng ngoại lệ / thay thế | Quá hạn nộp bài → hệ thống khoá form nộp bài, không cho nộp/không cho sửa (trừ khi BTC gia hạn thủ công có ghi log). |

#### UC-14 — Tự động lấy metadata repository (tuỳ chọn)

| Thuộc tính | Nội dung |
| --- | --- |
| Actor | Hệ thống (tích hợp GitHub/GitLab API) |
| Độ ưu tiên | Thấp |
| Mô tả | Hệ thống gọi GitHub/GitLab API để tự động lấy các thông tin metadata của repository (số commit, ngày cập nhật cuối, ngôn ngữ chính...) phục vụ tham khảo cho giám khảo. |
| Điều kiện tiên quyết | URL repository hợp lệ và công khai (hoặc đã cấp quyền truy cập). |
| Luồng chính | 1) Khi đội nộp URL repository → 2) Hệ thống gọi API tương ứng → 3) Lưu metadata kèm theo submission → 4) Hiển thị cho giám khảo khi chấm điểm. |
| Luồng ngoại lệ / thay thế | API lỗi/hết hạn mức truy vấn (rate limit) → hệ thống bỏ qua bước lấy metadata, không chặn việc nộp bài. |

### 3.7. Mô-đun Đánh giá (Chấm điểm)

#### UC-15 — Phân công Giám khảo cho vòng thi

| Thuộc tính | Nội dung |
| --- | --- |
| Actor | Event Coordinator |
| Độ ưu tiên | Cao |
| Mô tả | BTC phân công Giám khảo nội bộ và/hoặc Giám khảo khách mời cho từng vòng thi theo nhu cầu (có thể phân theo Hạng mục). |
| Điều kiện tiên quyết | Vòng thi đã tồn tại; tài khoản Giám khảo đã được duyệt. |
| Luồng chính | 1) Chọn vòng thi/Hạng mục → 2) Chọn danh sách Giám khảo → 3) Xác nhận phân công → 4) Hệ thống gửi thông báo cho Giám khảo. |
| Luồng ngoại lệ / thay thế | Cảnh báo xung đột nếu Giám khảo được chọn đang là Mentor của chính Hạng mục đó. |

#### UC-16 — Chấm điểm bài nộp

| Thuộc tính | Nội dung |
| --- | --- |
| Actor | Judge |
| Độ ưu tiên | Cao |
| Mô tả | Giám khảo chấm điểm một bài nộp theo từng tiêu chí đã cấu hình cho vòng thi; điểm của mỗi giám khảo cho mỗi tiêu chí được lưu riêng biệt, không gộp chung với giám khảo khác. |
| Điều kiện tiên quyết | Giám khảo được phân công cho vòng/hạng mục chứa bài nộp; bài nộp đã tồn tại. |
| Luồng chính | 1) Giám khảo mở danh sách bài nộp được phân công → 2) Chọn bài nộp → 3) Nhập điểm cho từng tiêu chí (kèm nhận xét tuỳ chọn) → 4) Lưu/nộp điểm → 5) Hệ thống ghi log hành động chấm điểm (ai, khi nào, giá trị điểm). |
| Luồng ngoại lệ / thay thế | Giám khảo có thể lưu nháp và chỉnh sửa điểm trước khi “chốt” điểm; sau khi chốt, mọi thay đổi đều được ghi log kèm lý do. |

### 3.8. Mô-đun Chấm điểm, Xếp hạng & Loại

#### UC-17 — Tự động xếp hạng đội thi

| Thuộc tính | Nội dung |
| --- | --- |
| Actor | Hệ thống |
| Độ ưu tiên | Cao |
| Mô tả | Hệ thống tự động tính điểm tổng hợp (theo trọng số tiêu chí) và xếp hạng đội theo từng vòng, từng Hạng mục và toàn bộ sự kiện. |
| Điều kiện tiên quyết | Tất cả giám khảo được phân công đã chốt điểm cho bài nộp (hoặc theo ngưỡng tối thiểu BTC quy định). |
| Luồng chính | 1) Hệ thống tổng hợp điểm từng tiêu chí từ tất cả giám khảo → 2) Tính điểm trung bình có trọng số cho mỗi bài nộp → 3) Xếp hạng trong Hạng mục và trong vòng → 4) Cập nhật bảng xếp hạng theo thời gian thực (cho BTC). |
| Luồng ngoại lệ / thay thế | Có đội bị loại (Disqualified) → loại khỏi bảng xếp hạng chính thức nhưng vẫn lưu vết trong hệ thống. |

#### UC-18 — Tính toán thăng vòng

| Thuộc tính | Nội dung |
| --- | --- |
| Actor | Hệ thống |
| Độ ưu tiên | Cao |
| Mô tả | Dựa trên bảng xếp hạng và quy tắc Top N mỗi Hạng mục đã cấu hình, hệ thống xác định danh sách đội đủ điều kiện vào vòng tiếp theo. |
| Điều kiện tiên quyết | Vòng hiện tại đã có kết quả xếp hạng đầy đủ. |
| Luồng chính | 1) Hệ thống lọc Top N đội mỗi Hạng mục theo quy tắc đã cấu hình → 2) Đánh dấu trạng thái “Thăng vòng” cho các đội đạt → 3) BTC xác nhận/công bố danh sách thăng vòng. |
| Luồng ngoại lệ / thay thế | Đồng điểm ở vị trí biên (N và N+1) → hệ thống cảnh báo cho BTC để quyết định thủ công (ghi log lý do quyết định). |

#### UC-19 — Loại đội / bài nộp vi phạm quy chế

| Thuộc tính | Nội dung |
| --- | --- |
| Actor | Event Coordinator |
| Độ ưu tiên | Trung bình |
| Mô tả | BTC loại một đội hoặc một bài nộp cụ thể do vi phạm quy chế cuộc thi (đạo văn, sai phạm quy định...); kết quả liên quan bị huỷ và lý do được ghi lại. |
| Điều kiện tiên quyết | Đội/bài nộp thuộc sự kiện đang quản lý. |
| Luồng chính | 1) BTC chọn đội/bài nộp → 2) Chọn “Loại” và nhập lý do bắt buộc → 3) Hệ thống cập nhật trạng thái “Bị loại”, loại khỏi bảng xếp hạng chính thức → 4) Ghi log đầy đủ (ai loại, khi nào, lý do). |
| Luồng ngoại lệ / thay thế | Đội đã được trao giải mà sau đó bị phát hiện vi phạm → BTC có thể thu hồi giải kèm ghi log, không xoá dữ liệu lịch sử. |

#### UC-20 — Nhật ký kiểm tra chấm điểm & loại đội (Audit Log)

| Thuộc tính | Nội dung |
| --- | --- |
| Actor | Hệ thống |
| Độ ưu tiên | Cao |
| Mô tả | Hệ thống tự động ghi lại mọi hành động liên quan đến chấm điểm (tạo/sửa điểm) và loại đội/bài nộp, phục vụ minh bạch và truy vết khi có khiếu nại. |
| Điều kiện tiên quyết | Không. |
| Luồng chính | 1) Mỗi hành động ghi/sửa điểm hoặc loại đội được hệ thống bắt sự kiện → 2) Lưu: người thực hiện, thời gian, loại hành động, giá trị cũ/mới, đối tượng liên quan → 3) BTC có thể tra cứu, lọc log theo sự kiện/đối tượng/người thực hiện. |
| Luồng ngoại lệ / thay thế | Không cho phép xoá bản ghi audit log dưới bất kỳ vai trò nào (chỉ append, immutable). |

### 3.9. Mô-đun Thu thập dữ liệu nghiên cứu (RBL)

Mô-đun này chỉ kích hoạt khi nhóm chọn hướng nghiên cứu RBL (Research-Based Learning) — được cộng điểm theo đề bài. Đặc tả chi tiết về phương pháp nghiên cứu trình bày ở Chương 8.

#### UC-21 — Ghi điểm chi tiết từng giám khảo/tiêu chí (không gộp)

| Thuộc tính | Nội dung |
| --- | --- |
| Actor | Hệ thống |
| Độ ưu tiên | Cao (nếu chọn RBL) |
| Mô tả | Mọi điểm số được lưu ở mức chi tiết nhất: (giám khảo × tiêu chí × bài nộp), không tính trung bình/gộp ngay tại thời điểm lưu, phục vụ phân tích thống kê sau này. |
| Điều kiện tiên quyết | Có ít nhất 2 giám khảo chấm cùng một bài nộp. |
| Luồng chính | 1) Mỗi lần Giám khảo chốt điểm → 2) Hệ thống lưu bản ghi Score riêng biệt gắn (judgeId, criterionId, submissionId) → 3) Dữ liệu thô này được giữ nguyên vẹn, độc lập với điểm tổng hợp hiển thị công khai. |
| Luồng ngoại lệ / thay thế | Không có luồng thay thế; đây là ràng buộc lưu trữ bắt buộc. |

#### UC-22 — Vòng hiệu chuẩn (Calibration Round)

| Thuộc tính | Nội dung |
| --- | --- |
| Actor | Judge, Event Coordinator |
| Độ ưu tiên | Trung bình (nếu chọn RBL) |
| Mô tả | Trước khi chấm chính thức, giám khảo chấm thử một bộ bài mẫu chung; hệ thống hiển thị phân bố điểm của tất cả giám khảo để hỗ trợ thảo luận, đồng thuận cách hiểu tiêu chí. |
| Điều kiện tiên quyết | BTC đã chọn bài mẫu và kích hoạt vòng hiệu chuẩn cho sự kiện. |
| Luồng chính | 1) BTC chọn 1-2 bài nộp mẫu → 2) Toàn bộ giám khảo được mời chấm thử → 3) Hệ thống tổng hợp và hiển thị biểu đồ phân bố điểm theo từng giám khảo/tiêu chí → 4) BTC/Mentor điều phối thảo luận thống nhất cách hiểu tiêu chí trước khi vào vòng chấm chính thức. |
| Luồng ngoại lệ / thay thế | Giám khảo khách mời tham gia muộn, chưa qua hiệu chuẩn → hệ thống gắn cờ (flag) trên dữ liệu điểm của giám khảo đó để loại trừ khi phân tích nếu cần. |

#### UC-23 — Xuất dữ liệu chấm điểm đã ẩn danh (CSV)

| Thuộc tính | Nội dung |
| --- | --- |
| Actor | Event Coordinator / Nhà nghiên cứu |
| Độ ưu tiên | Cao (nếu chọn RBL) |
| Mô tả | Xuất bộ dữ liệu điểm chi tiết dạng CSV, đã ẩn danh hoá thông tin định danh giám khảo/đội thi, phục vụ phân tích độ tin cậy liên đánh giá viên. |
| Điều kiện tiên quyết | Sự kiện đã có dữ liệu chấm điểm. |
| Luồng chính | 1) Chọn sự kiện/vòng cần xuất → 2) Hệ thống thay thế ID thực bằng mã ẩn danh (hash/alias) cho giám khảo và đội thi → 3) Xuất file CSV gồm: mã ẩn danh giám khảo, mã ẩn danh bài nộp, tiêu chí, điểm, loại giám khảo (nội bộ/khách mời) → 4) Tải file. |
| Luồng ngoại lệ / thay thế | Không xuất kèm bất kỳ trường định danh trực tiếp nào (họ tên, email) trong file phục vụ nghiên cứu. |

#### UC-24 — Dashboard phương sai điểm giữa các giám khảo

| Thuộc tính | Nội dung |
| --- | --- |
| Actor | Event Coordinator / Nhà nghiên cứu |
| Độ ưu tiên | Trung bình (nếu chọn RBL) |
| Mô tả | Hiển thị trực quan phương sai/độ lệch điểm giữa các giám khảo theo từng tiêu chí, giúp BTC và nhà nghiên cứu quan sát nhanh mức độ đồng thuận. |
| Điều kiện tiên quyết | Có tối thiểu 2 giám khảo đã chấm chung ít nhất 1 bài nộp. |
| Luồng chính | 1) Chọn sự kiện/vòng/tiêu chí → 2) Hệ thống tính độ lệch chuẩn, khoảng điểm (min-max) theo từng tiêu chí, từng bài nộp → 3) Hiển thị biểu đồ (boxplot/heatmap) theo tiêu chí và theo loại giám khảo (nội bộ/khách mời). |
| Luồng ngoại lệ / thay thế | Không đủ dữ liệu (chỉ có 1 giám khảo/bài) → hệ thống hiển thị thông báo “không đủ dữ liệu để tính phương sai”. |

### 3.10. Mô-đun Giải thưởng & Thông báo kết quả

#### UC-25 — Trao giải dựa trên kết quả xếp hạng

| Thuộc tính | Nội dung |
| --- | --- |
| Actor | Event Coordinator |
| Độ ưu tiên | Trung bình |
| Mô tả | BTC cấu hình cơ cấu giải thưởng theo Hạng mục/toàn sự kiện và gán giải cho đội đạt thứ hạng tương ứng. |
| Điều kiện tiên quyết | Sự kiện đã có bảng xếp hạng chung kết chính thức. |
| Luồng chính | 1) Cấu hình cơ cấu giải (Nhất/Nhì/Ba/Giải chuyên đề...) theo Hạng mục hoặc toàn sự kiện → 2) Hệ thống gợi ý đội theo thứ hạng → 3) BTC xác nhận gán giải → 4) Công bố. |
| Luồng ngoại lệ / thay thế | Đội đạt giải nhưng đang trong diện khiếu nại → BTC có thể tạm hoãn công bố giải đó, ghi log lý do. |

#### UC-26 — Thông báo & công bố kết quả

| Thuộc tính | Nội dung |
| --- | --- |
| Actor | Hệ thống, Event Coordinator |
| Độ ưu tiên | Trung bình |
| Mô tả | Hệ thống gửi thông báo kết quả (qua email/thông báo trong hệ thống) đến tất cả người tham gia khi có cập nhật quan trọng (thăng vòng, kết quả chung cuộc, giải thưởng). |
| Điều kiện tiên quyết | Kết quả liên quan đã được BTC xác nhận công bố. |
| Luồng chính | 1) BTC bấm “Công bố kết quả” cho vòng/sự kiện → 2) Hệ thống gửi thông báo tới các đội/giám khảo/mentor liên quan → 3) Kết quả hiển thị công khai trên trang xếp hạng. |
| Luồng ngoại lệ / thay thế | Không tự động công bố khi dữ liệu chấm điểm chưa đầy đủ; hệ thống cảnh báo BTC trước khi cho phép công bố. |

#### UC-27 — Xuất báo cáo xếp hạng và điểm (CSV/Excel)

| Thuộc tính | Nội dung |
| --- | --- |
| Actor | Event Coordinator |
| Độ ưu tiên | Trung bình |
| Mô tả | Xuất báo cáo xếp hạng, điểm chi tiết và danh sách giải thưởng dưới dạng CSV/Excel phục vụ lưu trữ, báo cáo cấp trên. |
| Điều kiện tiên quyết | Sự kiện/vòng đã có dữ liệu. |
| Luồng chính | 1) Chọn phạm vi xuất (sự kiện/vòng/hạng mục) → 2) Chọn định dạng CSV hoặc Excel → 3) Hệ thống sinh file → 4) Tải về. |
| Luồng ngoại lệ / thay thế | Không có dữ liệu trong phạm vi chọn → thông báo “không có dữ liệu để xuất”. |

## 4. MA TRẬN PHÂN QUYỀN (ROLE-BASED ACCESS MATRIX)

Hệ thống áp dụng cơ chế phân quyền theo vai trò (RBAC) kết hợp phạm vi (scope) theo sự kiện/hạng mục/vòng thi mà người dùng được gán. Ký hiệu: X = Toàn quyền, C = Chỉ trong phạm vi được phân công, X* = Có điều kiện, — = Không có quyền.

| Chức năng | Team<br>Member | Team<br>Leader | Mentor | Judge | Event<br>Coordinator |
| --- | --- | --- | --- | --- | --- |
| Đăng ký tài khoản | X | X | X | — | — |
| Phê duyệt tài khoản | — | — | — | — | X |
| Tạo/cấu hình sự kiện, vòng thi | — | — | — | — | X |
| Quản lý mẫu & tiêu chí chấm điểm | — | — | — | — | X |
| Tạo Hạng mục, phân công Mentor/Giám khảo | — | — | — | — | X |
| Thành lập đội, mời thành viên | — | X | — | — | — |
| Đăng ký Hạng mục cho đội | — | X | — | — | — |
| Nộp bài dự thi | — | X | — | — | — |
| Xem tiến độ đội trong Hạng mục phụ trách | — | — | C | — | X |
| Chấm điểm bài nộp | — | — | — | C | — |
| Tham gia vòng hiệu chuẩn | — | — | — | C | X* |
| Xem bảng xếp hạng công khai | X | X | X | X | X |
| Loại đội / bài nộp vi phạm | — | — | — | — | X |
| Xem audit log | — | — | — | — | X |
| Xuất dữ liệu CSV/Excel (vận hành) | — | — | — | — | X |
| Xuất dữ liệu ẩn danh phục vụ nghiên cứu | — | — | — | — | X |
| Cấu hình & công bố giải thưởng | — | — | — | — | X |

## 5. YÊU CẦU PHI CHỨC NĂNG

### 5.1. Bảo mật

- Xác thực bằng JWT (access token có thời hạn ngắn + refresh token); mật khẩu lưu dưới dạng băm (bcrypt/Argon2), không lưu plaintext.
- Áp dụng RBAC ở tầng API (không chỉ ở giao diện) để chống truy cập trái phép qua gọi API trực tiếp.
- Toàn bộ giao tiếp qua HTTPS; dữ liệu nhạy cảm (điểm số, thông tin cá nhân) không truyền ở dạng rõ qua log hệ thống.
- Audit log là bất biến (append-only), không route API nào được phép xoá/sửa bản ghi log.

### 5.2. Hiệu năng

- Thời gian phản hồi API trung bình dưới 500ms cho các thao tác đọc dữ liệu thông thường (danh sách đội, bảng xếp hạng) với tải tối thiểu 200 người dùng đồng thời.
- Chức năng tính xếp hạng tự động phải hoàn tất trong vòng vài giây sau khi giám khảo cuối cùng chốt điểm cho một vòng có tối đa ~200 đội.

### 5.3. Khả năng mở rộng & bảo trì

- Kiến trúc phân lớp rõ ràng (Controller – Service – Repository) giúp dễ mở rộng thêm mô-đun (VD: tích hợp thanh toán phí thi, chatbot hỗ trợ) trong tương lai.
- Cấu hình tiêu chí, quy tắc thăng vòng, cơ cấu giải thưởng đều là dữ liệu cấu hình (data-driven), không hard-code, cho phép tái sử dụng giữa các mùa giải.

### 5.4. Khả dụng & sao lưu dữ liệu

- Hệ thống hoạt động ổn định trong khung giờ diễn ra sự kiện (đặc biệt giai đoạn chấm điểm và công bố kết quả); mục tiêu uptime ≥ 99% trong thời gian diễn ra cuộc thi.
- Sao lưu dữ liệu định kỳ (tối thiểu hằng ngày trong giai đoạn diễn ra sự kiện), đặc biệt trước và sau các mốc chốt điểm.

### 5.5. Nhật ký kiểm tra & minh bạch

- Mọi hành động chấm điểm, sửa điểm, loại đội/bài nộp, phê duyệt/từ chối tài khoản đều được ghi log kèm actor, thời gian, giá trị trước/sau.
- BTC có thể tra cứu, lọc và xuất log phục vụ giải trình khi có khiếu nại kết quả.

### 5.6. Khả năng sử dụng (Usability)

- Giao diện responsive, sử dụng tốt trên cả máy tính và thiết bị di động (giám khảo/BTC thường thao tác tại chỗ trong sự kiện).
- Luồng nộp bài và chấm điểm tối giản số bước thao tác, có xác nhận rõ ràng trước khi chốt (submit) để tránh sai sót không thể hoàn tác.

### 5.7. Quốc tế hoá & ngôn ngữ

- Giao diện hỗ trợ song ngữ Việt – Anh, phù hợp với sự tham gia của sinh viên ngoài trường và giám khảo khách mời quốc tế.

## 6. MÔ HÌNH DỮ LIỆU (DOMAIN MODEL)

Mục này liệt kê các thực thể miền nghiệp vụ cốt lõi: Hackathon Event, Track, Round, Team, Team Member, Mentor, Judge, Submission, Criterion, Score, Ranking, Prize, cùng các thực thể hỗ trợ (User, AuditLog) và thực thể phục vụ nghiên cứu RBL (CalibrationRound).

### 6.1. Danh sách thực thể chính

#### User (Người dùng)

| Thuộc tính | Kiểu dữ liệu | Ghi chú |
| --- | --- | --- |
| id | UUID / Long | Khoá chính |
| fullName | String | Họ tên |
| email | String (unique) | Dùng để đăng nhập |
| passwordHash | String | Mật khẩu đã băm |
| userCategory | Enum | FPT_STUDENT / EXTERNAL_STUDENT |
| studentCode | String | Mã số sinh viên |
| schoolName | String (nullable) | Bắt buộc nếu là sinh viên ngoài trường |
| accountStatus | Enum | PENDING / APPROVED / REJECTED |
| isGuestJudge | Boolean | Đánh dấu tài khoản giám khảo khách mời tạm thời |
| createdAt | DateTime |  |

#### Role & UserRoleAssignment (Vai trò & Phân công vai trò)

| Thuộc tính | Kiểu dữ liệu | Ghi chú |
| --- | --- | --- |
| id | UUID / Long | Khoá chính |
| userId | FK → User |  |
| roleName | Enum | TEAM_MEMBER / TEAM_LEADER / MENTOR / JUDGE / COORDINATOR |
| scopeType | Enum | EVENT / TRACK / ROUND |
| scopeId | FK (đa hình) | ID của Event/Track/Round tương ứng phạm vi vai trò |
| judgeType | Enum (nullable) | INTERNAL / GUEST — chỉ áp dụng khi roleName = JUDGE |

#### HackathonEvent (Sự kiện)

| Thuộc tính | Kiểu dữ liệu | Ghi chú |
| --- | --- | --- |
| id | UUID / Long | Khoá chính |
| name | String | Tên sự kiện |
| description | Text |  |
| startDate / endDate | Date |  |
| status | Enum | DRAFT / OPEN / ONGOING / CLOSED / CANCELLED |
| baseCriteriaTemplateId | FK → CriteriaTemplate | Mẫu tiêu chí kế thừa ban đầu |

#### Track (Hạng mục)

| Thuộc tính | Kiểu dữ liệu | Ghi chú |
| --- | --- | --- |
| id | UUID / Long | Khoá chính |
| eventId | FK → HackathonEvent |  |
| name | String |  |
| description | Text |  |
| maxTeams | Integer (nullable) | Giới hạn số đội (nếu có) |

#### Round (Vòng thi)

| Thuộc tính | Kiểu dữ liệu | Ghi chú |
| --- | --- | --- |
| id | UUID / Long | Khoá chính |
| eventId | FK → HackathonEvent |  |
| name | String | VD: Vòng loại, Vòng chung kết |
| orderIndex | Integer | Thứ tự vòng |
| submissionDeadline | DateTime |  |
| promotionTopN | Integer | Số đội/Hạng mục được thăng vòng tiếp theo |

#### CriteriaTemplate & Criterion (Mẫu & Tiêu chí chấm điểm)

| Thuộc tính | Kiểu dữ liệu | Ghi chú |
| --- | --- | --- |
| id | UUID / Long | Khoá chính |
| templateId (nullable) / eventId / roundId | FK | Tiêu chí thuộc mẫu dùng chung hoặc thuộc riêng 1 sự kiện/vòng |
| name | String | VD: Tính sáng tạo, Kỹ thuật, UX, Thuyết trình |
| weight | Decimal (%) | Tổng trọng số các tiêu chí trong 1 bộ = 100% |
| maxScore | Decimal | Thang điểm tối đa, VD 10 |
| isDefault | Boolean | Đánh dấu mẫu mặc định của hệ thống |

#### Team & TeamMember (Đội thi & Thành viên)

| Thuộc tính | Kiểu dữ liệu | Ghi chú |
| --- | --- | --- |
| id | UUID / Long | Khoá chính (Team) |
| name | String | Tên đội |
| trackId | FK → Track | Hạng mục đã đăng ký |
| status | Enum | FORMING / REGISTERED / DISQUALIFIED |
| TeamMember.teamId / userId | FK / FK | Quan hệ N-N Team–User qua bảng trung gian |
| TeamMember.roleInTeam | Enum | LEADER / MEMBER |

#### Submission (Bài nộp)

| Thuộc tính | Kiểu dữ liệu | Ghi chú |
| --- | --- | --- |
| id | UUID / Long | Khoá chính |
| teamId / roundId | FK / FK |  |
| repoUrl / demoUrl / docUrl | String | Các đường dẫn bắt buộc/tuỳ chọn |
| repoMetadataJson | JSON (nullable) | Metadata lấy tự động qua GitHub/GitLab API |
| submittedAt | DateTime |  |
| isLate | Boolean | Đánh dấu nộp trễ nếu BTC cho phép gia hạn |

#### Score (Điểm chấm — mức chi tiết nhất)

| Thuộc tính | Kiểu dữ liệu | Ghi chú |
| --- | --- | --- |
| id | UUID / Long | Khoá chính |
| submissionId / judgeId / criterionId | FK / FK / FK | Khoá tổ hợp duy nhất — 1 giám khảo chấm 1 tiêu chí trên 1 bài nộp đúng 1 bản ghi hiện hành |
| scoreValue | Decimal |  |
| comment | Text (nullable) |  |
| isFinalized | Boolean | Đã “chốt” điểm hay còn nháp |
| scoredAt / updatedAt | DateTime |  |

#### Ranking (Xếp hạng — dữ liệu tổng hợp)

| Thuộc tính | Kiểu dữ liệu | Ghi chú |
| --- | --- | --- |
| id | UUID / Long | Khoá chính |
| teamId / roundId | FK / FK |  |
| totalWeightedScore | Decimal | Tính từ trung bình có trọng số các Score |
| rankInTrack / rankOverall | Integer |  |
| isPromoted | Boolean |  |

#### Disqualification (Loại đội/bài nộp) & AuditLog

| Thuộc tính | Kiểu dữ liệu | Ghi chú |
| --- | --- | --- |
| Disqualification.teamId / submissionId | FK / FK (nullable) |  |
| Disqualification.reason | Text | Bắt buộc nhập |
| Disqualification.decidedBy / decidedAt | FK → User / DateTime |  |
| AuditLog.actorId / action | FK / Enum | VD: SCORE_CREATE, SCORE_UPDATE, TEAM_DISQUALIFY, ACCOUNT_APPROVE |
| AuditLog.entityType / entityId | String / ID | Đối tượng bị tác động |
| AuditLog.oldValue / newValue | JSON | Giá trị trước/sau (nếu có) |
| AuditLog.timestamp | DateTime |  |

#### Prize (Giải thưởng)

| Thuộc tính | Kiểu dữ liệu | Ghi chú |
| --- | --- | --- |
| id | UUID / Long | Khoá chính |
| eventId / trackId (nullable) | FK / FK | Giải theo Hạng mục hoặc toàn sự kiện |
| name | String | VD: Giải Nhất, Giải Ý tưởng sáng tạo nhất |
| rankCondition | Integer | Thứ hạng tương ứng để nhận giải |
| awardedTeamId | FK → Team (nullable) | Được gán sau khi có kết quả chính thức |

#### CalibrationRound & CalibrationScore (phục vụ RBL)

| Thuộc tính | Kiểu dữ liệu | Ghi chú |
| --- | --- | --- |
| CalibrationRound.eventId / sampleSubmissionId | FK / FK | Bài mẫu dùng để hiệu chuẩn |
| CalibrationScore.calibrationRoundId / judgeId / criterionId | FK / FK / FK |  |
| CalibrationScore.scoreValue | Decimal | Điểm thử của giám khảo trên bài mẫu |

### 6.2. Quan hệ giữa các thực thể (tóm tắt)

| Quan hệ | Bản chất |
| --- | --- |
| HackathonEvent (1) — (N) Track | Một sự kiện có nhiều Hạng mục |
| HackathonEvent (1) — (N) Round | Một sự kiện có nhiều vòng thi, có thứ tự |
| Track (1) — (N) Team | Một Hạng mục có nhiều đội đăng ký |
| Team (N) — (N) User | Qua bảng TeamMember, ràng buộc 3–5 thành viên/đội |
| Track (N) — (N) User(Mentor) | Một Mentor có thể phụ trách nhiều Hạng mục; một Hạng mục có thể có nhiều Mentor |
| Round (N) — (N) User(Judge) | Phân công giám khảo theo vòng (có thể lọc thêm theo Hạng mục) |
| Team (1) — (N) Submission | Một đội có tối đa 1 bài nộp hiện hành cho mỗi vòng |
| Submission (1) — (N) Score | Mỗi bài nộp có nhiều bản ghi điểm (giám khảo × tiêu chí) |
| Round (1) — (N) Criterion | Bộ tiêu chí áp dụng cho vòng (kế thừa/tuỳ biến từ CriteriaTemplate) |
| Team (1) — (N) Ranking | Một đội có 1 bản ghi xếp hạng cho mỗi vòng |
| Team/Submission (1) — (0..1) Disqualification | Một đội/bài nộp có tối đa 1 quyết định loại đang hiệu lực |
| * (N) — (1) AuditLog | Mọi thực thể nghiệp vụ đều có thể phát sinh bản ghi log liên quan |

Ghi chú: Sơ đồ ERD chi tiết (dạng hình vẽ) sẽ được nhóm phát triển bổ sung ở giai đoạn thiết kế chi tiết (Detailed Design), sử dụng công cụ mô hình hoá (dbdiagram.io/MySQL Workbench) dựa trên đặc tả thực thể ở trên.

## 7. KIẾN TRÚC HỆ THỐNG ĐỀ XUẤT

### 7.1. Kiến trúc tổng quan

Hệ thống được đề xuất theo kiến trúc phân lớp (layered architecture) triển khai dạng client–server, gồm 3 lớp chính:

- Lớp trình bày (Presentation Layer): Ứng dụng web Single Page Application (SPA), giao tiếp với backend qua RESTful API.
- Lớp nghiệp vụ (Application/Service Layer): Xử lý logic nghiệp vụ (tính điểm, xếp hạng, thăng vòng, phân quyền), triển khai theo mô hình Controller – Service – Repository.
- Lớp dữ liệu (Data Layer): Cơ sở dữ liệu quan hệ lưu trữ toàn bộ dữ liệu nghiệp vụ và audit log.

### 7.2. Công nghệ đề xuất

| Thành phần | Công nghệ đề xuất | Lý do lựa chọn |
| --- | --- | --- |
| Backend / API | Java Spring Boot (Spring Web, Spring Security, Spring Data JPA) | Hệ sinh thái Java phổ biến trong chương trình đào tạo SE, hỗ trợ tốt RBAC, JWT, kiến trúc phân lớp rõ ràng |
| Xác thực | Spring Security + JWT (access/refresh token) | Chuẩn công nghiệp cho REST API stateless |
| Frontend | ReactJS (hoặc Next.js) + TypeScript | SPA hiệu năng tốt, hệ sinh thái thư viện biểu đồ (dashboard phương sai điểm) phong phú |
| Cơ sở dữ liệu | PostgreSQL (hoặc MySQL) | CSDL quan hệ phù hợp với dữ liệu có ràng buộc chặt (điểm số, phân quyền, audit log) |
| Tích hợp ngoài | GitHub REST API / GitLab API | Lấy metadata repository tự động (tuỳ chọn) |
| Xuất báo cáo | Apache POI (Excel), thư viện CSV chuẩn | Xuất kết quả và dữ liệu nghiên cứu |
| Triển khai | Docker container, CI/CD (GitHub Actions) | Dễ triển khai, tái lập môi trường cho demo/báo cáo |

### 7.3. Luồng nghiệp vụ tổng quát

Sự kiện được tạo → Cấu hình vòng thi & tiêu chí → Mở đăng ký đội → Đội thành lập & đăng ký Hạng mục → Đội nộp bài theo vòng → Giám khảo được phân công chấm điểm theo tiêu chí → Hệ thống tự động tổng hợp điểm, xếp hạng → Xác định danh sách thăng vòng (Top N/Hạng mục) → Lặp lại cho vòng tiếp theo (nếu có) → Kết thúc vòng cuối, tổng hợp bảng xếp hạng chung cuộc → Trao giải → Công bố kết quả. Song song, mọi hành động chấm điểm/loại đội được ghi vào Audit Log; nếu áp dụng hướng RBL, dữ liệu điểm chi tiết được tích luỹ liên tục để phục vụ xuất dữ liệu và phân tích thống kê ở giai đoạn sau sự kiện.

## 8. THÀNH PHẦN NGHIÊN CỨU (RESEARCH-BASED LEARNING)

### 8.1. Câu hỏi nghiên cứu

RQ (câu hỏi nghiên cứu chính): Mức độ nhất quán (consistency) giữa điểm số của các giám khảo khác nhau khi đánh giá cùng một bài nộp trong các cuộc thi hackathon học thuật ngành Kỹ thuật Phần mềm như thế nào?

- RQ1: Độ tin cậy liên đánh giá viên (inter-rater reliability) tổng thể của việc chấm điểm SEAL Hackathon — đo bằng ICC (Intraclass Correlation Coefficient) và Krippendorff's Alpha — ở mức nào?
- RQ2: Tiêu chí chấm điểm nào có mức đồng thuận cao nhất và thấp nhất giữa các giám khảo? (So sánh nhóm tiêu chí Kỹ thuật/khách quan — VD: chất lượng code, tính khả thi kỹ thuật — với nhóm tiêu chí Mềm/chủ quan — VD: thuyết trình, tính sáng tạo, trải nghiệm người dùng).
- RQ3: Loại giám khảo (Giảng viên SE nội bộ so với Giám khảo khách mời từ doanh nghiệp) có ảnh hưởng đến độ nhất quán chấm điểm hay không?

### 8.2. Phương pháp thu thập dữ liệu

Dữ liệu phục vụ nghiên cứu được thu thập tự nhiên trong quá trình vận hành hệ thống, không cần thao tác thu thập rời rạc:

- Mỗi bài nộp được chấm bởi tối thiểu 2 giám khảo trở lên (thiết lập bắt buộc ở tầng phân công UC-15) để có cơ sở so sánh liên đánh giá viên.
- Toàn bộ điểm số được lưu ở mức chi tiết nhất — (giám khảo × tiêu chí × bài nộp) — theo UC-21, không gộp hay làm tròn tại thời điểm lưu.
- Vòng hiệu chuẩn (UC-22) được tổ chức trước khi chấm chính thức: toàn bộ giám khảo (kể cả khách mời) chấm chung 1–2 bài mẫu; dữ liệu vòng này dùng để (a) hỗ trợ thống nhất cách hiểu tiêu chí và (b) làm đối chứng (baseline) khi phân tích độ tin cậy — vì mọi giám khảo chấm cùng đối tượng trong điều kiện được kiểm soát.
- Kết thúc sự kiện, dữ liệu được xuất dưới dạng CSV ẩn danh (UC-23) gồm các trường: mã ẩn danh giám khảo, loại giám khảo (nội bộ/khách mời), mã ẩn danh bài nộp, mã tiêu chí, giá trị điểm, thời điểm chấm.

### 8.3. Phương pháp phân tích thống kê

| Chỉ số | Mục đích sử dụng | Diễn giải kết quả |
| --- | --- | --- |
| ICC (Intraclass Correlation Coefficient) | Đo mức độ tương đồng điểm số định lượng (liên tục) giữa các giám khảo cho cùng bài nộp — trả lời RQ1, RQ3 | ICC < 0.5: kém; 0.5–0.75: trung bình; 0.75–0.9: tốt; > 0.9: xuất sắc (theo Koo & Li, 2016) |
| Krippendorff's Alpha (α) | Đo độ tin cậy liên đánh giá viên tổng quát, chấp nhận dữ liệu khuyết (giám khảo không chấm hết mọi bài) — dùng đối chiếu với ICC | α ≥ 0.8: đáng tin cậy; 0.667 ≤ α < 0.8: chấp nhận được có điều kiện; α < 0.667: không đủ tin cậy |
| Độ lệch chuẩn / phương sai theo tiêu chí | So sánh mức phân tán điểm giữa các tiêu chí — trả lời RQ2 (hiển thị trực tiếp qua Dashboard UC-24) | Phương sai càng cao → tiêu chí càng dễ gây bất đồng giữa giám khảo, cần làm rõ hướng dẫn chấm (rubric) |
| Kiểm định so sánh nhóm (Independent t-test / Mann-Whitney U) | So sánh mức đồng thuận giữa nhóm Giám khảo nội bộ và Giám khảo khách mời — trả lời RQ3 | p-value < 0.05: có khác biệt có ý nghĩa thống kê giữa hai nhóm giám khảo |

### 8.4. Thiết kế hệ thống hỗ trợ nghiên cứu

- Ràng buộc phân công tối thiểu 2 giám khảo/bài nộp được thực thi ở tầng nghiệp vụ khi BTC phân công giám khảo (UC-15), hệ thống cảnh báo nếu một bài nộp chỉ có 1 giám khảo.
- Cờ (flag) is_calibrated gắn trên từng giám khảo/sự kiện để phân biệt dữ liệu điểm “đã qua hiệu chuẩn” và “chưa qua hiệu chuẩn” khi phân tích (loại trừ hoặc phân tích riêng nhóm giám khảo tham gia muộn).
- API xuất dữ liệu (UC-23) tách biệt hoàn toàn khỏi API vận hành (bảng xếp hạng công khai) để đảm bảo dữ liệu phục vụ nghiên cứu luôn ở dạng ẩn danh, không rò rỉ thông tin định danh.
- Dashboard phương sai (UC-24) sử dụng trực tiếp dữ liệu Score chi tiết, không phụ thuộc bảng Ranking đã tổng hợp, đảm bảo tính độc lập giữa số liệu vận hành và số liệu phân tích.

### 8.5. Đạo đức nghiên cứu và ẩn danh dữ liệu

- Người tham gia (giám khảo, đội thi) được thông báo rõ trong quy chế cuộc thi rằng dữ liệu chấm điểm có thể được sử dụng cho mục đích nghiên cứu học thuật ở dạng ẩn danh.
- Dữ liệu xuất phục vụ nghiên cứu không chứa thông tin định danh trực tiếp (họ tên, email); việc ánh xạ mã ẩn danh về danh tính thật chỉ được lưu nội bộ, không xuất kèm file nghiên cứu.
- Kết quả nghiên cứu (số liệu ICC/Krippendorff's α) không được dùng để đánh giá/xử lý cá nhân giám khảo cụ thể, chỉ phục vụ mục tiêu cải tiến quy trình chấm điểm và rubric tiêu chí cho các mùa giải sau.

## 9. LỘ TRÌNH TRIỂN KHAI ĐỀ XUẤT

Lộ trình tham khảo theo mô hình phát triển lặp (Agile/Scrum), chia thành 5 giai đoạn, phù hợp khung thời gian một học kỳ đồ án tốt nghiệp.

| Giai đoạn | Nội dung chính | Đầu ra |
| --- | --- | --- |
| Giai đoạn 1 — Khởi tạo & Thiết kế | Hoàn thiện SRS, thiết kế CSDL chi tiết (ERD), thiết kế API, dựng khung dự án (Spring Boot + React) | Tài liệu SRS (bản này), ERD chi tiết, API spec, source code khung |
| Giai đoạn 2 — Mô-đun người dùng & sự kiện | Đăng ký/xác thực (JWT, RBAC), quản lý sự kiện/vòng thi/hạng mục, quản lý tiêu chí | Chức năng UC-01 → UC-10 hoạt động, kiểm thử đơn vị |
| Giai đoạn 3 — Đội thi, nộp bài & chấm điểm | Quản lý đội, đăng ký hạng mục, nộp bài, phân công & chấm điểm giám khảo, audit log | Chức năng UC-11 → UC-20 hoạt động, kiểm thử tích hợp |
| Giai đoạn 4 — Xếp hạng, RBL & giải thưởng | Tính xếp hạng/thăng vòng tự động, mô-đun RBL (hiệu chuẩn, xuất CSV ẩn danh, dashboard phương sai), giải thưởng | Chức năng UC-21 → UC-27 hoạt động |
| Giai đoạn 5 — Kiểm thử, thử nghiệm thực tế & báo cáo | Kiểm thử toàn diện (UAT), tổ chức thử nghiệm/pilot với dữ liệu thật hoặc mô phỏng, phân tích số liệu nghiên cứu, hoàn thiện báo cáo khóa luận | Báo cáo khóa luận, bộ số liệu phân tích ICC/Krippendorff's α, slide bảo vệ |

## 10. TIÊU CHÍ NGHIỆM THU (DEFINITION OF DONE)

Một chức năng được xem là hoàn thành khi thoả toàn bộ các điều kiện sau:

- Đáp ứng đúng luồng chính và các luồng ngoại lệ đã đặc tả trong Chương 3.
- Tuân thủ ma trận phân quyền ở Chương 4 — kiểm thử với đủ các vai trò liên quan, bao gồm cả trường hợp truy cập trái phép bị từ chối.
- Có ghi nhận audit log đầy đủ đối với các hành động chấm điểm, loại đội, phê duyệt tài khoản.
- Đạt yêu cầu phi chức năng liên quan (Chương 5) đã được kiểm thử: thời gian phản hồi, bảo mật cơ bản (không lộ mật khẩu, không bypass RBAC qua API).
- Có kiểm thử tự động (unit test/integration test) cho logic nghiệp vụ cốt lõi: tính điểm trọng số, xếp hạng, thăng vòng.
- (Áp dụng riêng cho mô-đun RBL) Bộ dữ liệu xuất ra đúng định dạng ẩn danh, có thể nạp trực tiếp vào công cụ thống kê (R/Python) để tính ICC và Krippendorff's α mà không cần xử lý thủ công thêm.

## 11. RỦI RO VÀ BIỆN PHÁP GIẢM THIỂU

| Rủi ro | Mức độ | Biện pháp giảm thiểu |
| --- | --- | --- |
| Không đủ số lượng giám khảo chấm chung mỗi bài nộp (ảnh hưởng chất lượng nghiên cứu RQ1–RQ3) | Cao | Ràng buộc bắt buộc tối thiểu 2 giám khảo/bài nộp ngay ở bước phân công (UC-15); cảnh báo BTC nếu vi phạm. |
| Giám khảo khách mời tham gia trễ, bỏ qua vòng hiệu chuẩn | Trung bình | Gắn cờ is_calibrated để tách nhóm dữ liệu khi phân tích, không loại bỏ hoàn toàn dữ liệu. |
| Trễ tiến độ do phạm vi lớn (vừa hệ thống quản lý, vừa mô-đun nghiên cứu) | Trung bình | Ưu tiên triển khai theo lộ trình 5 giai đoạn (Chương 9); mô-đun RBL có thể triển khai sau nếu thời gian hạn chế, không chặn phần lõi vận hành. |
| Rủi ro bảo mật do quản lý nhiều vai trò/phạm vi phức tạp | Trung bình | Kiểm thử phân quyền riêng biệt cho từng vai trò (Chương 4); áp RBAC ở tầng API, không chỉ tầng giao diện. |
| Cỡ mẫu nhỏ (số sự kiện/số bài nộp ít) làm giảm ý nghĩa thống kê của ICC/Krippendorff's α | Cao (đối với phần nghiên cứu) | Nêu rõ giới hạn nghiên cứu (limitation) trong báo cáo khóa luận; đề xuất thu thập dữ liệu qua nhiều mùa giải để tăng cỡ mẫu. |

## 12. KẾT LUẬN

Tài liệu đã đặc tả toàn diện yêu cầu nghiệp vụ, chức năng, phi chức năng, mô hình dữ liệu và kiến trúc đề xuất cho Hệ thống Quản lý Cuộc thi SEAL Hackathon (SHMS). Hệ thống không chỉ giải quyết các vấn đề vận hành thủ công hiện tại (đăng ký, chấm điểm rời rạc trên Excel, thiếu minh bạch) mà còn được thiết kế ngay từ đầu để hỗ trợ hướng nghiên cứu RBL về độ tin cậy liên đánh giá viên — một đóng góp học thuật có giá trị thực tiễn cho việc cải thiện tính công bằng trong các cuộc thi hackathon.

Tài liệu này là cơ sở để nhóm phát triển tiến hành thiết kế chi tiết (ERD đầy đủ, API specification), lập kế hoạch sprint và triển khai hệ thống theo lộ trình đề xuất ở Chương 9, đồng thời là căn cứ để giảng viên hướng dẫn đánh giá mức độ đầy đủ và tính khả thi của phạm vi đề tài.
