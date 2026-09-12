import { useState } from "react";
import FeedbackThread from "../../components/FeedbackThread";

type Team = {
    id: number;
    name: string;
    memberCount: number;
    members: string[];
};

function Mentor() {
    const [assignedTrack] = useState<{
    id: number;
    name: string;
} | null>(null);

const [teams] = useState<Team[]>([]);

    const [selectedTeam, setSelectedTeam] =
        useState<Team | null>(null);

        type FeedbackMessage = {
            id: number;
            sender: "Mentor";
            content: string;
            time: string;
            date: string;
        };
        
        const [feedbackByTeam, setFeedbackByTeam] = useState<
        Record<number, FeedbackMessage[]>
        >({});

    return (
        <div className="team-dashboard">
            {/* Sidebar */}
            <aside className="team-sidebar">
                <div className="sidebar-brand">
                    <div className="brand-icon">🏆</div>

                    <div>
                        <h2>Hackathon</h2>
                        <span>Management</span>
                    </div>
                </div>

                <nav className="sidebar-menu">
                    <button className="sidebar-item">
                        <span>👥</span>
                        My Team
                    </button>

                    <button className="sidebar-item active">
                        <span>🧑‍🏫</span>
                        Mentor
                    </button>
                </nav>

                <button className="sidebar-logout">
                    <span>↪</span>
                    Logout
                </button>
            </aside>

            {/* Main */}
            <main className="team-main">
                {/* Topbar */}
                <header className="team-topbar">
                    <div className="topbar-user">

                        <div className="user-avatar">
                            M
                        </div>

                        <strong>Mentor</strong>
                    </div>
                </header>

                <div className="team-content">
                    {/* Heading */}
                    <div className="section-header main-heading">
                        <div>
                            <h1>Mentor</h1>

                            <p>
                                Manage teams and provide feedback
                                for your assigned track.
                            </p>
                        </div>
                    </div>

                    {/* Overview */}
                    <div className="overview-grid">
                        <section className="dashboard-card team-overview-card">
                            <div className="overview-icon blue">
                                🎯
                            </div>

                            <div className="overview-info">
                                <span className="small-label">
                                    Assigned Track
                                </span>

                                <h2>
                                    {assignedTrack ? assignedTrack.name : "Not assigned"}
                                </h2>

                                <p>
                                    {assignedTrack
                                    ? "You are mentoring teams in this track."
                                    : "No track has been assigned yet."}
                                </p>
                            </div>
                        </section>

                        <section className="dashboard-card round-card">
                            <div className="overview-icon green">
                                👥
                            </div>

                            <div className="overview-info">
                                <span className="small-label">
                                    Teams
                                </span>

                                <h2>
                                    {teams.length} Teams
                                </h2>

                                <p>
                                    Teams currently assigned to
                                    your track.
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* Teams list */}
                    <section className="dashboard-card mentor-dashboard-card">
                        <div className="card-heading-row">
                            <div>
                                <h2>👥 Teams</h2>

                                <p>
                                    View team details and give
                                    feedback.
                                </p>
                            </div>
                        </div>

                        <div className="mentor-dashboard-list">
    {teams.length === 0 ? (
        <div className="mentor-empty-state">
            <p>No teams assigned yet.</p>
        </div>
    ) : (
        teams.map((team) => (
        <div
            className="mentor-dashboard-team"
            key={team.id}
        >
            <div className="mentor-team-left">
                <div className="member-avatar">
                    T
                </div>

                <div className="mentor-team-info">
                    <strong>{team.name}</strong>
                    <span>
                        {team.memberCount} / 5 members
                    </span>
                </div>
            </div>

            <button
                className="btn-primary"
                onClick={() =>
                    setSelectedTeam(team)
                }
            >
                View Team
            </button>
        </div>
    ))
)}
</div>
                    </section>

                    {/* Team detail */}
                    {selectedTeam && (
                        <section className="dashboard-card mentor-detail-card">
                            <div className="card-heading-row">
                                <div>
                                    <h2>Team Detail</h2>

                                    <p>
                                        Team information and
                                        mentor feedback.
                                    </p>
                                </div>

                                <button
                                    className="btn-secondary"
                                    onClick={() =>
                                        setSelectedTeam(null)
                                    }
                                >
                                    Close
                                </button>
                            </div>

                            <div className="mentor-detail-overview">
                                <div>
                                    <span className="small-label">
                                        Team Name
                                    </span>

                                    <h3>
                                        {selectedTeam.name}
                                    </h3>
                                </div>

                                <div>
                                    <span className="small-label">
                                        Members
                                    </span>

                                    <h3>
                                        {
                                            selectedTeam.memberCount
                                        }{" "}
                                        / 5
                                    </h3>
                                </div>
                            </div>

                            <div className="mentor-members-section">
                                <h3>Members</h3>

                                <div className="mentor-member-list">
                                    {selectedTeam.members.map(
                                        (member, index) => (
                                            <div
                                                className="mentor-member-item"
                                                key={index}
                                            >
                                                <div className="member-avatar">
                                                    {member
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>

                                                <span>
                                                    {member}
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>

                            <FeedbackThread
                            teamName={selectedTeam.name}
                            messages={feedbackByTeam[selectedTeam.id] || []}
                            onSend={(content) => {
                                const now = new Date();

                                const newMessage: FeedbackMessage = {
                                    id: Date.now(),
                                    sender: "Mentor",
                                    content,

                                    time: new Date().toLocaleString("vi-VN", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    }),

                                    date: now.toLocaleDateString("vi-VN", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    }),
                                };

                                setFeedbackByTeam((prev) => ({
                                    ...prev,
                                    [selectedTeam.id]: [
                                        ...(prev[selectedTeam.id] || []),
                                        newMessage,
                                    ],
                                }));
                                }}
                            />
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Mentor;