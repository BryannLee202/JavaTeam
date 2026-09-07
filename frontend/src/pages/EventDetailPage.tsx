import { Suspense, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { eventsApi } from "@/api/events";
import { StatusBadge } from "@/components/StatusBadge";
import { Spinner, ErrorState } from "@/components/Feedback";
import { DEFAULT_TAB, TAB_DEFS } from "@/pages/tabConfig";
import type { HackathonEvent } from "@/types";

export default function EventDetailPage() {
  const { eventId, tab } = useParams<{ eventId: string; tab: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<HackathonEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;
    setLoading(true);
    setError(null);
    eventsApi
      .get(eventId)
      .then(setEvent)
      .catch((e) => setError(e.message ?? "Không tải được sự kiện."))
      .finally(() => setLoading(false));
  }, [eventId]);

  const activeTab = TAB_DEFS.find((t) => t.id === tab) ?? TAB_DEFS.find((t) => t.id === DEFAULT_TAB)!;
  const ActiveComponent = activeTab.component;

  if (!eventId) return <ErrorState message="Thiếu mã sự kiện." />;

  return (
    <div className="page">
      <Link to="/coordinator/events" className="back-link">
        ← Danh sách sự kiện
      </Link>

      {loading && <Spinner label="Đang tải sự kiện…" />}
      {!loading && error && <ErrorState message={error} onRetry={() => navigate(0)} />}

      {!loading && !error && event && (
        <>
          <header className="page__header page__header--detail">
            <div>
              <p className="eyebrow">Sự kiện</p>
              <h1>{event.name}</h1>
              <p className="page__subtitle">{event.description}</p>
            </div>
            <StatusBadge status={event.status} />
          </header>

          <nav className="tab-strip" aria-label="Chuyển tab chi tiết sự kiện">
            {TAB_DEFS.map((t) => (
              <button
                key={t.id}
                className={`tab-strip__item ${t.id === activeTab.id ? "tab-strip__item--active" : ""}`}
                onClick={() => navigate(`/coordinator/events/${eventId}/${t.id}`)}
              >
                {t.label}
                {t.owner !== "P3" && <span className="tab-strip__badge">{t.owner}</span>}
              </button>
            ))}
          </nav>

          <div className="tab-panel">
            <Suspense fallback={<Spinner label="Đang tải tab…" />}>
              <ActiveComponent event={event} />
            </Suspense>
          </div>
        </>
      )}
    </div>
  );
}
