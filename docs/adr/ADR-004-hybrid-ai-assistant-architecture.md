# ADR-004: Kien truc Tich hop Tri tue Nhan tao Hybrid va Co che Phong thu Da lop (Hybrid AI with Multi-layer Fallback)

- **Trang thai**: Da chap thuan (Accepted)  
- **Nguoi de xuat**: Nhom phat trien SHMS  
- **Ngay quyet dinh**: 16/09/2026  
- **Phien ban ap dung**: `v1.5.0`  

---

## 1. Boi canh (Context)

He thong quan ly Hackathon (SHMS) can ho tro Ban giam khao trong qua trinh cham diem:
1. Doc hieu va tom tat nhanh giai phap cua tung doi thi giua hang chuc bai nop trong thoi gian ngan.
2. De xuat cac cau hoi phan bien chuyen sau giup giam khao danh gia chinh xac nang luc cua thi sinh.
3. Soan thao nhan xet mang tinh su pham xay dung dua tren diem so rubric.
4. Giai dap the le cuoc thi (BR-01 den BR-06) cho thi sinh va cong dong thong qua tro ly linh vat (MascotBot).

Tuy nhien, viec tich hop AI trong boi canh cuoc thi hackathon va danh gia do an gap phai nhung thach thuc lon:
- **Rui ro bao mat API Key**: Neu hardcode API Key vao ma nguon (nhu cach repo AURA tung mac phai) se de lo thong tin bao mat tren GitHub.
- **Rui ro ket noi & Quota**: Khi bao ve do an hoac cham thi thuc te, ket noi mang co the khong on dinh, hoac API AI (Gemini/OpenAI) co the het han muc (quota), bi rate-limit, hoac phan hoi cham.
- **Do tin cay cua ket qua**: AI can tra ve du lieu JSON co cau truc, khong duoc hallucinate hoac vo dinh dang gay crash giao dien.

---

## 2. Cac Phuong an da Can nhac

1. **Phuong an 1: Goi truc tiep API AI tu Frontend**:
   - *Uu diem*: Don gian, khong can sua backend.
   - *Nhuoc diem*: De lo API Key ngay tren trinh duyet nguoi dung (Network tab), khong the kiem soat chi phi va bao mat.
2. **Phuong an 2: Goi AI hoan toan qua Backend khong co Fallback**:
   - *Uu diem*: An toan API Key.
   - *Nhuoc diem*: Khi mang chap chon hoac loi dich vu AI, he thong se nem ma loi 500 gay gian doan buoi cham thi hoac bao ve do an.
3. **Phuong an 3 (Lua chon Chinh thuc): Kien truc Hybrid voi Co che Phong thu 2 Lop (Two-layer Defensive Fallback)**:
   - Backend la cong giao tiep AI tap trung (`AiAssistantService`), doc API Key tu bien moi truong `AI_API_KEY`, co co `enabled`.
   - **Lop phong thu 1 (Server-side Heuristic Fallback)**: Neu AI bi tat, khong co key, hoac request timeout/error -> Backend tu dong tra ve ket qua phan tich heuristic dua tren thong tin thuc cua bai nop.
   - **Lop phong thu 2 (Client-side Offline Mock Engine)**: Neu toan bo server bi mat ket noi -> Frontend su dung `mockAiEngine.ts` phan tich noi bo voi do chinh xac va tinh su pham cao.

---

## 3. Quyet dinh Kien truc (Decision)

Quyet dinh ap dung **Phuong an 3: Hybrid AI with Two-layer Defensive Fallback**.

### Cac thanh phan cot loi:
- `AiConfigurationProperties.java`: Quan ly cac tham so `app.ai.*` (enabled, apiKey, model, endpoint, timeoutMs).
- `AiAssistantService.java`: Su dung `java.net.http.HttpClient` nguyen ban cua Java 21, goi OpenAI-compatible chat completion voi `temperature = 0.1` de dam bao output on dinh va yeu cau JSON thuan.
- `mockAiEngine.ts`: Cung cap dong co phan tich Offline hoan hao tai phia Client.
- `useAiProgress.ts`: Quan ly cac giai doan phan tich AI truc quan (`READING` -> `EVALUATING` -> `FORMULATING` -> `COMPLETED`).
- `MascotChatDrawer.tsx`: Cung cap giao dien tro ly hoi dap the le voi tri thuc nghiep vu BR-01 den BR-06.

---

## 4. He qua va Danh doi (Consequences)

### Tich cuc:
- **Tuyet doi an toan**: Khong bao gio lo API Key, khoa duoc quan ly qua bien moi truong.
- **Chong fail 100% khi Demo / Bao ve**: Du mat mang, het quota, hay khong co key, ung dung van phan hoi muot ma voi chat luong chuyen mon cao.
- **Trang nghiem phan tich chan thuc**: Co tien trinh giai doan truc quan giup giam khao tin tuong vao ket qua danh gia.

### Danh doi:
- Can duy tri dong bo giua heuristic rules tren Backend va `mockAiEngine` tren Frontend.
