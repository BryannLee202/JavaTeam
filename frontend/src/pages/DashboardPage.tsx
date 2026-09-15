import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { Button, Card } from "../components/ui";
import { api } from "../api/client";
import { teamApi } from "../api/teamApi";
import { mentorApi } from "../api/mentorApi";
import {
  closingPhrase,
  daysUntil,
  type PriorityItem,
} from "../lib/dashboardPriority";
import { actionLabel } from "../lib/auditLog";


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

export function DashboardPage() {
  const { user, hasRole, refreshPermissions } = useAuth();
  const { t, language } = useLanguage();
  const isEn = language === "en";

  const isCoordinator = hasRole("COORDINATOR");
  const isJudge = hasRole("JUDGE");
  const isTeam = hasRole("TEAM_LEADER") || hasRole("TEAM_MEMBER");
  const isMentor = hasRole("MENTOR");

  return (
    <div>
      <div className="topbar">
        <div>
          <h1 className="page-title">{t("dashboard.welcome", { name: user?.fullName || "" })} 👋</h1>
          <p className="page-subtitle">
            {isCoordinator
              ? (isEn ? "Coordinator Overview" : "Tổng quan Ban tổ chức")
              : isJudge
                ? (isEn ? "Judging Overview" : "Tổng quan chấm điểm")
                : (isEn ? "Your active roles in the system" : "Đây là vai trò hiện tại của bạn trong hệ thống")}
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={refreshPermissions}>
          {isEn ? "Refresh permissions" : "Làm mới quyền truy cập"}
        </Button>
      </div>

      {isCoordinator ? (
        <CoordinatorOverview />
      ) : isJudge ? (
        <JudgeOverview />
      ) : isMentor ? (
        <MentorOverview />
      ) : isTeam ? (
        <TeamOverview />
      ) : (
        <RoleBadges />
      )}
    </div>
  );
}

function TeamOverview() {
  const [teams, setTeams] = useState<Awaited<ReturnType<typeof teamApi.getMyTeams>> | null>(null);

  const [invites, setInvites] = useState<Awaited<ReturnType<typeof teamApi.getMyInvites>> | null>(null);

  const [rounds, setRounds] = useState<RoundItem[] | null>(null);

  const [submissionStatuses, setSubmissionStatuses] = useState<
    Awaited<ReturnType<typeof teamApi.getSubmissionStatus>>[] | null
  >(null);

  const [messages, setMessages] = useState<
    Awaited<ReturnType<typeof mentorApi.listMessages>> | null
  >(null);

  const [error, setError] = useState<string | null>(null);

  const team = teams?.[0] ?? null;
  const teamId = team?.id ?? null;
  const eventId = team?.eventId ?? null;

  useEffect(() => {
    let huy = false;

    Promise.all([
      teamApi.getMyTeams(),
      teamApi.getMyInvites(),
    ])
      .then(([teamData, inviteData]) => {
        if (huy) return;

        setTeams(teamData);
        setInvites(inviteData);
      })
      .catch(() => {
        if (!huy) {
          setError("Không tải được dữ liệu đội thi.");
        }
      });

    return () => {
      huy = true;
    };
  }, []);

  useEffect(() => {
    let huy = false;

    if (teams === null) {
      return;
    }

    if (!teamId || !eventId) {
      setRounds([]);
      setSubmissionStatuses([]);
      setMessages([]);
      return;
    }

    api
      .get<RoundItem[]>(`/api/events/${eventId}/rounds`)
      .then((res) => {
        if (!huy) {
          setRounds(res.data);
        }
      })
      .catch(() => {
        if (!huy) {
          setError("Không tải được danh sách vòng thi.");
        }
      });

    return () => {
      huy = true;
    };
  }, [teams, teamId, eventId]);


  useEffect(() => {
    let huy = false;

    if (!teamId || rounds === null) {
      return;
    }

    if (rounds.length === 0) {
      setSubmissionStatuses([]);
      return;
    }

    Promise.all(
      rounds.map((round) =>
        teamApi.getSubmissionStatus(teamId, round.id),
      ),
    )
      .then((statuses) => {
        if (!huy) {
          setSubmissionStatuses(statuses);
        }
      })
      .catch(() => {
        if (!huy) {
          setError("Không tải được trạng thái nộp bài.");
        }
      });

    return () => {
      huy = true;
    };
  }, [teamId, rounds]);

  useEffect(() => {
    let huy = false;

    if (!teamId) {
      return;
    }

    mentorApi
      .listMessages(teamId)
      .then((data) => {
        if (!huy) {
          setMessages(data);
        }
      })
      .catch(() => {
        if (!huy) {
          setError("Không tải được hoạt động gần đây.");
        }
      });

    return () => {
      huy = true;
    };
  }, [teamId]);

  const metrics =
    teams !== null &&
      invites !== null &&
      submissionStatuses !== null
      ? [
        {
          label: "Thành viên",
          value: team ? `${team.members.length}/5` : "0/5",
        },
        {
          label: "Vòng đã nộp",
          value: submissionStatuses.filter(
            (status) =>
              status.status === "ON_TIME" ||
              status.status === "LATE",
          ).length,
        },
        {
          label: "Vòng chưa nộp",
          value: submissionStatuses.filter(
            (status) =>
              status.status === "PENDING" ||
              status.status === "MISSING",
          ).length,
        },
        {
          label: "Lời mời đang chờ",
          value: invites.length,
        },
      ]
      : null;

  let priorities: PriorityItem[] | null = null;

  if (
    teams !== null &&
    invites !== null &&
    rounds !== null &&
    submissionStatuses !== null
  ) {
    priorities = [];

    // 1. Người dùng chưa có đội
    if (!team) {
      priorities.push({
        key: "no-team",
        tone: "warning",
        text: "Bạn chưa có đội thi nào",
        to: "/team",
      });
    }

    // 2. Có lời mời tham gia đội đang chờ
    if (invites.length > 0) {
      priorities.push({
        key: "pending-invites",
        tone: "info",
        text: `${invites.length} lời mời tham gia đội đang chờ`,
        to: "/team",
      });
    }

    // 3. Các vòng chưa nộp và sắp hết hạn
    if (team) {
      rounds.forEach((round) => {
        const submissionStatus = submissionStatuses.find(
          (status) => status.roundId === round.id,
        );

        const isNotSubmitted =
          submissionStatus?.status === "PENDING" ||
          submissionStatus?.status === "MISSING";

        if (!isNotSubmitted || !round.submissionDeadline) {
          return;
        }

        const daysLeft = daysUntil(round.submissionDeadline);

        // Deadline đã qua thì không hiện cảnh báo này
        if (daysLeft === null || daysLeft < 0 || daysLeft > 3) {
          return;
        }

        priorities!.push({
          key: `round-deadline-${round.id}`,
          tone: daysLeft <= 1 ? "danger" : "warning",
          text: `Chưa nộp bài vòng ${round.name}, hạn ${closingPhrase(daysLeft)}`,
          to: "/team",
        });
      });
    }
  }

  const activities =
    messages === null
      ? null
      : [...messages]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime(),
        )
        .slice(0, 5)
        .map((message) => ({
          id: message.id,
          actor:
            message.authorRole === "MENTOR"
              ? "Mentor"
              : "Đội của bạn",
          text:
            message.body.length > 60
              ? `${message.body.slice(0, 57)}...`
              : message.body,
          at: message.createdAt,
        }));
  return (
    <>

      {error && (
        <div className="alert error" role="alert">
          {error}
        </div>
      )}

      <SectionLabel>Cần chú ý</SectionLabel>
      <PrioritySection
        items={priorities}
        emptyText="Hiện không có việc nào cần chú ý."
      />

      <SectionLabel>Tổng quan</SectionLabel>
      <MetricGrid metrics={metrics} />

      <SectionLabel>Hoạt động gần đây</SectionLabel>
      <ActivityList
        entries={activities}
        emptyText="Chưa có hoạt động nào."
        moreTo="/team"
        moreLabel="Xem toàn bộ trao đổi"
      />
    </>
  );
}

function MentorOverview() {
  const [teams, setTeams] = useState<
    Awaited<ReturnType<typeof mentorApi.listMyTeams>> | null
  >(null);

  const [teamMessages, setTeamMessages] = useState<
    {
      team: Awaited<ReturnType<typeof mentorApi.listMyTeams>>[number];
      messages: Awaited<ReturnType<typeof mentorApi.listMessages>>;
    }[] | null
  >(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let huy = false;

    mentorApi
      .listMyTeams()
      .then((data) => {
        if (!huy) {
          setTeams(data);
        }
      })
      .catch(() => {
        if (!huy) {
          setError("Không tải được danh sách đội.");
        }
      });

    return () => {
      huy = true;
    };
  }, []);

  useEffect(() => {
    let huy = false;

    if (teams === null) {
      return;
    }

    if (teams.length === 0) {
      setTeamMessages([]);
      return;
    }

    Promise.all(
      teams.map(async (team) => ({
        team,
        messages: await mentorApi.listMessages(team.id),
      })),
    )
      .then((data) => {
        if (!huy) {
          setTeamMessages(data);
        }
      })
      .catch(() => {
        if (!huy) {
          setError("Không tải được trao đổi của các đội.");
        }
      });

    return () => {
      huy = true;
    };
  }, [teams]);

  let priorities: PriorityItem[] | null = null;

  if (teams !== null && teamMessages !== null) {
    priorities = [];

    // 1. Mentor chưa được phân công đội nào
    if (teams.length === 0) {
      priorities.push({
        key: "no-assigned-team",
        tone: "info",
        text: "Chưa được phân công hạng mục nào",
        to: "/mentor",
      });
    }

    // 2. Kiểm tra đội nào đang chờ Mentor phản hồi
    teamMessages.forEach(({ team, messages }) => {
      const latestMessage = [...messages].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime(),
      )[0];

      if (latestMessage && latestMessage.authorRole !== "MENTOR") {
        priorities!.push({
          key: `waiting-reply-${team.id}`,
          tone: "warning",
          text: `Đội ${team.name} đang chờ phản hồi của bạn`,
          to: "/mentor",
        });
      }
    });
  }

  const metrics =
    teams !== null && teamMessages !== null
      ? [
        {
          label: "Đội được phân công",
          value: teams.length,
        },
        {
          label: "Cần phản hồi",
          value: teamMessages.filter(({ messages }) => {
            const latestMessage = [...messages].sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            )[0];

            return (
              latestMessage !== undefined &&
              latestMessage.authorRole !== "MENTOR"
            );
          }).length,
        },
        {
          label: "Tổng thành viên",
          value: teams.reduce(
            (total, team) => total + team.members.length,
            0,
          ),
        },
        {
          label: "Tổng trao đổi",
          value: teamMessages.reduce(
            (total, item) => total + item.messages.length,
            0,
          ),
        },
      ]
      : null;

  const activities =
    teamMessages === null
      ? null
      : teamMessages
        .flatMap(({ team, messages }) =>
          messages.map((message) => ({
            id: message.id,
            text:
              message.body.length > 60
                ? `${message.body.slice(0, 57)}...`
                : message.body,
            actor:
              message.authorRole === "MENTOR"
                ? "Bạn"
                : `Đội ${team.name}`,
            at: message.createdAt,
          })),
        )
        .sort(
          (a, b) =>
            new Date(b.at).getTime() -
            new Date(a.at).getTime(),
        )
        .slice(0, 5);

  return (
    <>
      {error && (
        <div className="alert error" role="alert">
          {error}
        </div>
      )}

      <SectionLabel>Cần chú ý</SectionLabel>
      <PrioritySection
        items={priorities}
        emptyText="Hiện không có việc nào cần chú ý."
      />

      <SectionLabel>Tổng quan</SectionLabel>
      <MetricGrid metrics={metrics} />

      <SectionLabel>Hoạt động gần đây</SectionLabel>
      <ActivityList
        entries={activities}
        emptyText="Chưa có hoạt động nào."

        moreTo="/mentor"
        moreLabel="Xem tất cả đội được phân công"
      />
    </>
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

      <Card className="section-gap">
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
      </Card>
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
