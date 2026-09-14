# P3 — Coordinator: Cấu trúc cuộc thi

Frontend cho nhánh `feat/p3-cau-truc-cuoc-thi` của hệ thống quản lý SEAL Hackathon.

## Chạy thử

```bash
npm install
cp .env.example .env   # VITE_USE_MOCK=true — chạy được ngay, không cần backend
npm run dev
```

Mở `http://localhost:5173` → tự động chuyển đến `/coordinator/events`.

Khi backend sẵn sàng, đổi `VITE_USE_MOCK=false` và set `VITE_API_BASE_URL` trỏ tới BFF —
không cần sửa gì trong UI vì mọi component chỉ gọi qua `src/api/events.ts`.

## Cấu trúc theo yêu cầu P3

| Route | File | Trạng thái |
|---|---|---|
| `/coordinator/events` | `src/pages/EventsPage.tsx` | Event CRUD + đổi trạng thái |
| `/coordinator/events/:eventId/:tab` | `src/pages/EventDetailPage.tsx` | Khung chi tiết, tab trên URL, lazy-load 6 tab |
| Tab "Hạng mục" | `src/pages/tabs/TracksTab.tsx` | CRUD hạng mục + gán/gỡ mentor |
| Tab "Vòng thi" | `src/pages/tabs/RoundsTab.tsx` | CRUD vòng thi, tiêu chí chấm điểm (validate tổng trọng số = 100%), quy tắc thăng vòng (top N/hạng mục), gán/gỡ giám khảo |
| Tab "Bài nộp" | `src/pages/tabs/SubmissionsTab.tsx` | Phân trang thật (page/pageSize qua API) |
| Tab "Giám khảo & Mentor" | `src/pages/tabs/JudgesMentorsTab.tsx` | Hiện + gỡ danh sách đã gán, dùng endpoint gộp BFF `getEventAssignments` |
| Tab "Tổng quan" | `src/pages/tabs/OverviewTab.tsx` | Số liệu tổng quan sự kiện |
| Tab "Đội thi" | `src/pages/tabs/TeamsTab.tsx` | **Stub** — do P4 phát triển; route/khai báo lazy đã sẵn để merge |
| API layer | `src/api/events.ts` | Toàn bộ hàm gọi API cho P3 (events/tracks/rounds/submissions/assignments) |

Cả 6 tab được khai báo lazy trong `src/pages/tabConfig.ts` ngay từ Ngày 2, kể cả tab chưa
có UI thật (`Đội thi`), để P4/P6 có thể merge vào đúng chỗ mà không phải sửa
`EventDetailPage`.

## Ghi chú kỹ thuật

- **Interface tab**: mỗi tab nhận props `{ event: HackathonEvent }` (xem `src/pages/tabs/types.ts`)
  — cố định từ Ngày 1 để P4/P6 code song song.
- **api/events.ts** là điểm vào duy nhất; nội bộ tự chuyển giữa gọi HTTP thật
  (`src/api/client.ts`) và mock data (`src/api/mockData.ts`) qua `VITE_USE_MOCK`,
  nên không phải đổi gì ở UI khi backend xong.
- Toàn bộ text hiển thị bằng tiếng Việt theo đúng nghiệp vụ trong đề bài.
