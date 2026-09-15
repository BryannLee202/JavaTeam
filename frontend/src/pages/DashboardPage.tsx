import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import type {
  AuditLogItem,
  CalibrationRoundItem,
  CriterionItem,
  EventItem,
  Page,
  RoleName,
  RoundItem,
  ScoreItem,
  SubmissionItem,
  UserSummary,
} from "../api/types";
import { IconGavel, IconHome } from "../components/icons";
import type { ReactNode } from "react";
import {
  ActivityList,
  MetricGrid,
  PrioritySection,
  SectionLabel,
} from "../components/dashboard/DashboardSections";
import { coordinatorMetrics, coordinatorPriorities } from "../lib/coordinatorDashboard";
import {
  judgeMetrics,
  judgePriorities,
  recentJudgeActivity,
  type JudgeRoundView,
} from "../lib/judgeDashboard";
import { actionLabel } from "../lib/auditLog";

export function DashboardPage() {
  const { user, hasRole, refreshPermissions } = useAuth();

  const isCoordinator = hasRole("COORDINATOR");
  const isJudge = hasRole("JUDGE");

  return (
    <div>
      <div className="topbar">
        <div>
          <h1 className="page-title">Xin chào, {user?.fullName} 👋</h1>
          <p className="page-subtitle">
            {isCoordinator
              ? "Tổng quan Ban tổ chức"
              : isJudge
                ? "Tổng quan chấm điểm"
                : "Đây là vai trò hiện tại của bạn trong hệ thống"}
          </p>
        </div>
        <button className="btn secondary small" onClick={refreshPermissions}>
          Làm mới quyền truy cập
        </button>
      </div>

      {isCoordinator ? (
        <CoordinatorOverview />
      ) : isJudge ? (
        <JudgeOverview />
      ) : (
        <RoleBadges />
      )}
    </div>
  );
}

/**
 * Trang chủ của Ban tổ chức.
 *
 * Ba lời gọi API độc lập nhau nên để chạy song song và giữ ba ô state riêng:
 * hỏng một cái thì hai khối kia vẫn hiện, thay vì cả trang trắng.
 */
function CoordinatorOverview() {
  const [pendingCount, setPendingCount] = useState<number | null>(null);
  const [events, setEvents] = useState<EventItem[] | null>(null);
  const [recentLogs, setRecentLogs] = useState<AuditLogItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let huy = false;

    api
      .get<Page<UserSummary>>("/api/admin/users/pending")
      .then((res) => {
        if (!huy) setPendingCount(res.data.totalElements);
      })
      .catch(() => {
        if (!huy) setError("Không tải được một phần dữ liệu trang chủ.");
      });

    api
      .get<EventItem[]>("/api/events")
      .then((res) => {
        if (!huy) setEvents(res.data);
      })
      .catch(() => {
        if (!huy) setError("Không tải được một phần dữ liệu trang chủ.");
      });

    api
      .get<Page<AuditLogItem>>("/api/admin/audit-logs/recent", { params: { page: 0, size: 5 } })
      .then((res) => {
        if (!huy) setRecentLogs(res.data.content);
      })
      .catch(() => {
        if (!huy) setError("Không tải được một phần dữ liệu trang chủ.");
      });

    return () => {
      huy = true;
    };
  }, []);

  // Chỉ tính khi CẢ HAI nguồn đã về. Tính sớm thì trong lúc chờ danh sách sự
  // kiện, khu "Cần chú ý" sẽ hiện thiếu dòng rồi mới bổ sung sau — nhìn như
  // hệ thống tự đổi ý.
  const daSanSang = pendingCount !== null && events !== null;

  const priorityItems = daSanSang
    ? coordinatorPriorities({ pendingUserCount: pendingCount, events })
    : null;

  const metrics = daSanSang ? coordinatorMetrics(events, pendingCount) : null;

  const activities = recentLogs
    ? recentLogs.map((log) => ({
        id: log.id,
        text: actionLabel(log.action),
        actor: log.actorName,
        at: log.timestamp,
      }))
    : null;

  return (
    <>
      {error && (
        <div className="alert error" role="alert">
          {error}
        </div>
      )}

      <SectionLabel>Cần chú ý</SectionLabel>
      <PrioritySection items={priorityItems} />

      <SectionLabel>Tổng quan</SectionLabel>
      <MetricGrid metrics={metrics} />

      <SectionLabel>Hoạt động gần đây</SectionLabel>
      <ActivityList
        entries={activities}
        moreTo="/coordinator/audit-logs"
        moreLabel="Xem toàn bộ nhật ký"
      />
    </>
  );
}

/**
 * Trang chủ của Giám khảo.
 *
 * Gom dữ liệu từ nhiều lời gọi lồng nhau (vòng → bài nộp → điểm), nên gọi
 * song song ở từng tầng bằng Promise.all thay vì await trong vòng lặp: một
 * giám khảo hai vòng, mỗi vòng sáu bài thì cách tuần tự là mười hai lượt chờ
 * nối đuôi nhau.
 */
function JudgeOverview() {
  const { user } = useAuth();
  const [snapshot, setSnapshot] = useState<{
    rounds: JudgeRoundView[];
    openCalibrationCount: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const judgeUserId = user?.userId;
  const roundIds = (user?.roles ?? [])
    .filter((r) => r.roleName === "JUDGE" && r.scopeType === "ROUND" && r.scopeId)
    .map((r) => r.scopeId as string);

  // roundIds là mảng mới mỗi lần render nên không dùng trực tiếp làm phụ thuộc
  // của useEffect — sẽ gọi lại API vô hạn. Nối thành chuỗi để so sánh theo giá trị.
  const roundKey = roundIds.join(",");

  useEffect(() => {
    let huy = false;

    if (!judgeUserId || roundKey === "") {
      setSnapshot({ rounds: [], openCalibrationCount: 0 });
      return;
    }

    const ids = roundKey.split(",");

    (async () => {
      const roundInfos = await Promise.all(ids.map((id) => api.get<RoundItem>(`/api/rounds/${id}`)));

      const rounds = await Promise.all(
        ids.map(async (roundId) => {
          const [criteria, submissions] = await Promise.all([
            api.get<CriterionItem[]>(`/api/rounds/${roundId}/criteria`),
            api.get<Page<SubmissionItem>>(`/api/rounds/${roundId}/submissions`),
          ]);

          const views = await Promise.all(
            submissions.data.content.map(async (submission) => {
              const scores = await api.get<ScoreItem[]>(`/api/submissions/${submission.id}/scores`);
              const mine = scores.data.filter((sc) => sc.judgeId === judgeUserId);

              return {
                submissionId: submission.id,
                teamName: submission.teamName,
                myFinalizedCount: mine.filter((sc) => sc.finalized).length,
                myLastScoredAt: mine.reduce<string | null>(
                  (max, sc) => (sc.scoredAt && (!max || sc.scoredAt > max) ? sc.scoredAt : max),
                  null,
                ),
              };
            }),
          );

          return { roundId, criterionCount: criteria.data.length, submissions: views };
        }),
      );

      // Một giám khảo có thể chấm nhiều vòng của cùng một sự kiện — lọc trùng
      // để không hỏi cùng một sự kiện hai lần.
      const eventIds = Array.from(new Set(roundInfos.map((r) => r.data.eventId)));
      const calibrations = await Promise.all(
        eventIds.map((eventId) =>
          api.get<CalibrationRoundItem[]>(`/api/events/${eventId}/calibration-rounds`),
        ),
      );
      const openCalibrationCount = calibrations
        .flatMap((res) => res.data)
        .filter((cr) => cr.active).length;

      if (!huy) setSnapshot({ rounds, openCalibrationCount });
    })().catch(() => {
      if (!huy) setError("Không tải được dữ liệu chấm điểm.");
    });

    return () => {
      huy = true;
    };
  }, [judgeUserId, roundKey]);

  return (
    <>
      {error && (
        <div className="alert error" role="alert">
          {error}
        </div>
      )}

      <SectionLabel>Cần chú ý</SectionLabel>
      <PrioritySection items={snapshot ? judgePriorities(snapshot) : null} />

      <SectionLabel>Tổng quan</SectionLabel>
      <MetricGrid metrics={snapshot ? judgeMetrics(snapshot) : null} />

      <SectionLabel>Hoạt động gần đây</SectionLabel>
      <ActivityList
        entries={snapshot ? recentJudgeActivity(snapshot.rounds) : null}
        emptyText="Bạn chưa chấm bài nào."
        moreTo="/judge"
        moreLabel="Tới màn chấm điểm"
      />
    </>
  );
}

/** Màn mặc định cho vai trò chưa có trang chủ riêng. */
function RoleBadges() {
  const { user, hasRole } = useAuth();

  return (
    <>
      <div className="grid grid-3">
        {user?.roles.map((r, idx) => (
          <div className={`stat-tile${idx === 0 ? " featured" : ""}`} key={idx}>
            <div className="icon-chip">{roleIcon(r.roleName)}</div>
            <div className="value">{roleLabel(r.roleName)}</div>
            <div className="label">
              Phạm vi: {scopeLabel(r.scopeType)}
              {r.judgeType ? ` • ${r.judgeType === "GUEST" ? "Giám khảo khách mời" : "Giám khảo nội bộ"}` : ""}
            </div>
          </div>
        ))}
      </div>

      <div className="card section-gap">
        <div className="card-title">Lối tắt</div>
        <div className="flex wrap">
          {(hasRole("TEAM_MEMBER") || hasRole("TEAM_LEADER")) && (
            <Link className="btn secondary small" to="/team">
              Đội của tôi
            </Link>
          )}
          {hasRole("JUDGE") && (
            <Link className="btn secondary small" to="/judge">
              Chấm điểm
            </Link>
          )}
          {hasRole("MENTOR") && (
            <Link className="btn secondary small" to="/mentor">
              Đội được phân công
            </Link>
          )}
          <Link className="btn secondary small" to="/rankings">
            Bảng xếp hạng
          </Link>
        </div>
      </div>
    </>
  );
}

function roleLabel(role: string) {
  switch (role) {
    case "COORDINATOR":
      return "Ban tổ chức";
    case "MENTOR":
      return "Mentor";
    case "JUDGE":
      return "Giám khảo";
    case "TEAM_LEADER":
      return "Đội trưởng";
    case "TEAM_MEMBER":
      return "Thành viên đội";
    default:
      return role;
  }
}

function scopeLabel(scope: string) {
  switch (scope) {
    case "GLOBAL":
      return "Toàn hệ thống";
    case "EVENT":
      return "Sự kiện";
    case "TRACK":
      return "Hạng mục";
    case "ROUND":
      return "Vòng thi";
    default:
      return scope;
  }
}

function roleIcon(role: RoleName): ReactNode {
  switch (role) {
    case "JUDGE":
      return <IconGavel />;
    default:
      return <IconHome />;
  }
}
