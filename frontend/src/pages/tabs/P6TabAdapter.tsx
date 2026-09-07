import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import { eventsApi } from "@/api/events";
import { Spinner, ErrorState } from "@/components/Feedback";
import type { EventTabProps, RoundRef, TrackRef } from "@/api/types/criteria";
import type { TabProps } from "@/pages/tabs/types";

/**
 * Cầu nối giữa khung tab của P3 (JAV-12) và các tab của P6 (JAV-15).
 *
 * P3 truyền cho mọi tab một props duy nhất là `{ event }`, trong khi các tab
 * của P6 cần `{ eventId, rounds, tracks }`. Adapter này tự nạp tracks/rounds
 * của sự kiện rồi ánh xạ sang đúng kiểu P6 mong đợi.
 *
 * `TrackRef` khớp thẳng với `Track` của P3 nhờ structural typing; riêng
 * `RoundRef` cần `orderIndex` còn P3 đặt tên trường là `order`, nên phải đổi
 * tên ở đây thay vì sửa kiểu của bên nào — giữ nguyên code gốc cả hai người.
 */
export function withP6Tab(Tab: ComponentType<EventTabProps>) {
  return function P6Tab({ event }: TabProps) {
    const [tracks, setTracks] = useState<TrackRef[] | null>(null);
    const [rounds, setRounds] = useState<RoundRef[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      let cancelled = false;
      setError(null);
      Promise.all([eventsApi.listTracks(event.id), eventsApi.listRounds(event.id)])
        .then(([trackList, roundList]) => {
          if (cancelled) return;
          setTracks(trackList.map((t) => ({ id: t.id, name: t.name })));
          setRounds(roundList.map((r) => ({ id: r.id, name: r.name, orderIndex: r.order })));
        })
        .catch((e) => {
          if (!cancelled) setError(e?.message ?? "Không tải được hạng mục / vòng thi.");
        });
      return () => {
        cancelled = true;
      };
    }, [event.id]);

    if (error) return <ErrorState message={error} />;
    if (!tracks || !rounds) return <Spinner label="Đang tải hạng mục và vòng thi…" />;

    return <Tab eventId={event.id} rounds={rounds} tracks={tracks} />;
  };
}
