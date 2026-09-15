# Dac ta API Tro ly AI (AI Assistant API Specification)

> **Phien ban**: `v1.5.0`  
> **Tien to duong dan**: `/api/ai`  
> **Xac thuc**: JWT Bearer Token (cookie httpOnly)  

---

## 1. Kiem tra Trang thai AI

- **Phuong thuc**: `GET`
- **Duong dan**: `/api/ai/status`
- **Quyen truy cap**: Authenticated
- **Phan hoi (200 OK)**:
  ```json
  {
    "status": "ACTIVE",
    "service": "SHMS Hybrid AI Assistant",
    "fallbackMode": "AUTO_HEURISTIC"
  }
  ```

---

## 2. Phan tich Bai nop & Goi y Cau hoi Phan bien

- **Phuong thuc**: `POST`
- **Duong dan**: `/api/ai/submissions/{submissionId}/analyze`
- **Quyen truy cap**: Vai tro `JUDGE`, `COORDINATOR`, `ORGANIZER`
- **Tham so**: `submissionId` (UUID tren URL)
- **Phan hoi (200 OK)**:
  ```json
  {
    "submissionId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "teamName": "TechTitans",
    "trackName": "AI & Machine Learning",
    "summary": "Dự án dự thi của đội TechTitans thuộc chủ đề AI & Machine Learning. Giải pháp kết hợp mô hình phân tích dữ liệu tự động...",
    "strengths": [
      "Kiến trúc dự án hoàn chỉnh, có phân tách rõ ràng giữa mã nguồn và tài liệu kỹ thuật.",
      "Tuân thủ đúng quy chế nộp bài và định dạng repository của Ban tổ chức.",
      "Có tiềm năng ứng dụng thực tế cao phù hợp với định hướng chủ đề AI & Machine Learning."
    ],
    "concerns": [
      "Cần làm rõ phương án mở rộng (scalability) khi số lượng người dùng đồng thời tăng cao.",
      "Cần kiểm tra độ bao phủ kiểm thử tự động trong repository."
    ],
    "counterQuestions": [
      "1. Đội đã áp dụng những giải pháp nào để tối ưu hóa hiệu năng và bảo mật cho API trong giải pháp này?",
      "2. Trong trường hợp dữ liệu tăng đột biến, hệ thống sẽ gặp nút thắt cổ chai ở thành phần nào?",
      "3. Kế hoạch phát triển và thương mại hóa sản phẩm sau cuộc thi Hackathon được định hình như thế nào?"
    ],
    "source": "AI_LIVE"
  }
  ```

---

## 3. Goi y Nhan xet Danh gia theo Rubric

- **Phuong thuc**: `POST`
- **Duong dan**: `/api/ai/rubric-feedback/suggest`
- **Quyen truy cap**: Vai tro `JUDGE`
- **Yeu cau (Request Body)**:
  ```json
  {
    "submissionId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "teamName": "TechTitans",
    "trackName": "AI & Machine Learning",
    "totalScore": 88.5,
    "criterionScores": {
      "Tính sáng tạo": 9.0,
      "Khả thi kỹ thuật": 8.5,
      "Trình bày & Phản biện": 9.0
    },
    "judgeNotes": "Demo rất ấn tượng"
  }
  ```
- **Phan hoi (200 OK)**:
  ```json
  {
    "generalComment": "Đội TechTitans có phần thể hiện xuất sắc, ý tưởng đột phá và giải pháp hoàn thiện cả về kỹ thuật lẫn khả năng giải quyết bài toán thực tế.",
    "keyHighlights": [
      "Sản phẩm demo hoạt động trơn tru, giao diện hiện đại và mạch lạc.",
      "Kiến trúc hệ thống chặt chẽ, áp dụng các chuẩn kỹ thuật cao."
    ],
    "improvementSuggestions": [
      "Cân nhắc bổ sung kịch bản kiểm thử tải tự động và tối ưu hóa chi phí vận hành đám mây."
    ],
    "formattedDraft": "Đoạn văn nhận xét hoàn chỉnh...",
    "source": "AI_LIVE"
  }
  ```
