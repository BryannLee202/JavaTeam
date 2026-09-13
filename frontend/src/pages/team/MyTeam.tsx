import { useEffect, useState } from "react";
import PersonPicker from "../../components/PersonPicker";

type Member = {
    name: string;
    role: "Leader" | "Member";
};

type Invitation = {
    email: string;
    status: "Pending";
};

type IncomingInvitation = {
    teamName: string;
    invitedBy: string;
    invitedEmail: string;
};

type Round = {
    id: number;
    name: string;
    deadline: string;
};

type Track = {
    id: number;
    name: string;
};

function MyTeam() {
    const [hasTeam, setHasTeam] = useState(false);
    const [teamName, setTeamName] = useState("");
    const [showCreateForm, setShowCreateForm] = useState(false);

    const [createTeamStep, setCreateTeamStep] = useState(1);
    const [selectedPeople, setSelectedPeople] = useState<string[]>([]);

    const [showInviteForm, setShowInviteForm] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");

    const [members, setMembers] = useState<Member[]>([
        {
            name: "You",
            role: "Leader",
        },
    ]);

    const [invitations, setInvitations] = useState<Invitation[]>([]);

    // Incoming team invitations
    const [incomingInvitations, setIncomingInvitations] =
        useState<IncomingInvitation[]>([]);

    // Invitation view state
    const [isInvitedUser] = useState(false);

    // Notification message
    const [message, setMessage] = useState("");

    // Track
    const [selectedTrack, setSelectedTrack] = useState("");
    const [registeredTrack, setRegisteredTrack] = useState("");
    const [tracks] = useState<Track[]>([]);

    // Submission
    const [showSubmissionForm, setShowSubmissionForm] =
        useState(false);

    const [repositoryUrl, setRepositoryUrl] = useState("");
    const [demoUrl, setDemoUrl] = useState("");
    const [reportSlideUrl, setReportSlideUrl] = useState("");

    const [submitted, setSubmitted] = useState(false);

    const [submissionLoadError, setSubmissionLoadError] =
        useState(false);

    const [currentRound] = useState<Round | null>(null);

    const [timeLeft, setTimeLeft] = useState("");
    const [isDeadlinePassed, setIsDeadlinePassed] =
        useState(false);

    useEffect(() => {
        if (!currentRound) {
            setTimeLeft("");
            setIsDeadlinePassed(false);
            return;
        }
        const updateCountdown = () => {
            const deadlineTime = new Date(
                currentRound.deadline
            ).getTime();

            const now = new Date().getTime();

            const difference = deadlineTime - now;

            if (difference <= 0) {
                setTimeLeft("Deadline passed");
                setIsDeadlinePassed(true);
                return;
            }

            setIsDeadlinePassed(false);

            const days = Math.floor(
                difference / (1000 * 60 * 60 * 24)
            );

            const hours = Math.floor(
                (difference / (1000 * 60 * 60)) % 24
            );

            const minutes = Math.floor(
                (difference / (1000 * 60)) % 60
            );

            const seconds = Math.floor(
                (difference / 1000) % 60
            );

            setTimeLeft(
                `${days}d ${hours}h ${minutes}m ${seconds}s`
            );
        };

        updateCountdown();

        const timer = setInterval(updateCountdown, 1000);

        return () => clearInterval(timer);
    }, [currentRound]);


    const handleCreateTeam = () => {
    const normalizedTeamName = teamName.trim();

    if (!normalizedTeamName) {
        alert("Please enter a team name.");
        return;
    }

    setTeamName(normalizedTeamName);

    const newInvitations: Invitation[] =
        selectedPeople.map((email) => ({
            email,
            status: "Pending",
        }));

    setInvitations(newInvitations);

    setIncomingInvitations(
        selectedPeople.map((email) => ({
            teamName: normalizedTeamName,
            invitedBy: "Leader",
            invitedEmail: email,
        }))
    );

    setHasTeam(true);
    setShowCreateForm(false);
    setCreateTeamStep(1);
    setSelectedPeople([]);
};

    const handleInviteMember = () => {
        if (!inviteEmail.trim()) {
            alert("Please enter member email");
            return;
        }

        const emailRegex =
            /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

        if (!emailRegex.test(inviteEmail.trim())) {
            alert("Please enter a valid email address");
            return;
        }

        if (members.length >= 5) {
            alert("Team can have maximum 5 members");
            return;
        }

        const normalizedEmail = inviteEmail
            .trim()
            .toLowerCase();

        const existedMember = members.some(
            (member) =>
                member.name.toLowerCase() === normalizedEmail
        );

        if (existedMember) {
            alert("This user is already a team member");
            return;
        }

        const existedInvitation = invitations.some(
            (invitation) =>
                invitation.email.toLowerCase() ===
                normalizedEmail
        );

        if (existedInvitation) {
            alert("This email has already been invited");
            return;
        }

        setInvitations((prevInvitations) => [
            ...prevInvitations,
            {
                email: normalizedEmail,
                status: "Pending",
            },
        ]);

        setIncomingInvitations((prevInvitations) => [
            ...prevInvitations,
            {
                teamName: teamName,
                invitedBy: "Leader",
                invitedEmail: normalizedEmail,
            },
        ]);

        setMessage("");
        setInviteEmail("");
        setShowInviteForm(false);
    };

    const handleAcceptInvitation = (email: string) => {
        if (members.length >= 5) {
            alert("Team can have maximum 5 members");
            return;
        }

        const existedMember = members.some(
            (member) =>
                member.name.toLowerCase() ===
                email.toLowerCase()
        );

        if (existedMember) {
            alert("This user is already a team member");
            return;
        }

        setMembers((prevMembers) => [
            ...prevMembers,
            {
                name: email,
                role: "Member",
            },
        ]);

        setInvitations((prevInvitations) =>
            prevInvitations.filter(
                (invitation) => invitation.email !== email
            )
        );

        setIncomingInvitations((prevInvitations) =>
            prevInvitations.filter(
                (invitation) =>
                    invitation.invitedEmail !== email
            )
        );

        setMessage(
            `${email} accepted the team invitation.`
        );
    };

    const handleRejectInvitation = (email: string) => {
        setInvitations((prevInvitations) =>
            prevInvitations.filter(
                (invitation) => invitation.email !== email
            )
        );

        setIncomingInvitations((prevInvitations) =>
            prevInvitations.filter(
                (invitation) =>
                    invitation.invitedEmail !== email
            )
        );

        setMessage(
            `${email} rejected the team invitation.`
        );
    };

    const handleRegisterTrack = () => {
        if (registeredTrack) {
            alert(
                "Team has already registered for a track"
            );
            return;
        }

        if (members.length < 3) {
            alert(
                "Team must have at least 3 members to register for a track"
            );
            return;
        }

        if (!selectedTrack) {
            alert("Please select a track");
            return;
        }

        setRegisteredTrack(selectedTrack);

        alert(
            `Successfully registered for ${selectedTrack}`
        );
    };

    const handleSubmitProject = () => {
        if (isDeadlinePassed) {
            alert("Submission deadline has passed");
            return;
        }

        if (!registeredTrack) {
            alert("Please register for a track first");
            return;
        }

        if (
            !repositoryUrl.trim() ||
            !demoUrl.trim() ||
            !reportSlideUrl.trim()
        ) {
            alert("Please fill in all submission links");
            return;
        }

        const isValidUrl = (url: string) => {
            try {
                const parsedUrl = new URL(url.trim());

                return (
                    parsedUrl.protocol === "http:" ||
                    parsedUrl.protocol === "https:"
                );
            } catch {
                return false;
            }
        };

        if (
            !isValidUrl(repositoryUrl) ||
            !isValidUrl(demoUrl) ||
            !isValidUrl(reportSlideUrl)
        ) {
            alert(
                "Please enter valid URLs starting with http:// or https://"
            );
            return;
        }

        setSubmitted(true);
        setSubmissionLoadError(false);
        setShowSubmissionForm(false);

        alert("Submission successful");
    };

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
                <button className="sidebar-item active">
                    <span>👥</span>
                    My Team
                </button>

                <button className="sidebar-item">
                    <span>🧑‍🏫</span>
                    Mentor
                </button>
            </nav>

            <button className="sidebar-logout">
                <span>↪</span>
                Logout
            </button>
        </aside>


        <main className="team-main">

            <header className="team-topbar">          
                <div className="topbar-user">
                    <div className="user-avatar">T</div>
                    <strong>{teamName || "Team"}</strong>
                </div>
            </header>

            <div className="team-content">
                {isInvitedUser ? (
                    <div className="dashboard-section">
                        <div className="section-header">
                            <div>
                                <h1>Team Invitations</h1>
                                <p>
                                    Review invitations sent to this account.
                                </p>
                            </div>
                        </div>

                        {incomingInvitations.length > 0 ? (
                            <div className="invitation-grid">
                                {incomingInvitations.map(
                                    (invitation) => (
                                        <div
                                            className="dashboard-card invitation-card"
                                            key={
                                                invitation.invitedEmail
                                            }
                                        >
                                            <div className="card-icon">
                                                ✉️
                                            </div>

                                            <h3>
                                                Team Invitation
                                            </h3>

                                            <p>
                                                You have been invited
                                                to join:
                                            </p>

                                            <div className="invitation-detail">
                                                <p>
                                                    <strong>
                                                        Team:
                                                    </strong>{" "}
                                                    {
                                                        invitation.teamName
                                                    }
                                                </p>

                                                <p>
                                                    <strong>
                                                        Invited by:
                                                    </strong>{" "}
                                                    {
                                                        invitation.invitedBy
                                                    }
                                                </p>                                        
                                            </div>

                                            <div className="card-actions">
                                                <button
                                                    className="btn-secondary"
                                                    onClick={() =>
                                                        handleRejectInvitation(
                                                            invitation.invitedEmail
                                                        )
                                                    }
                                                >
                                                    Reject
                                                </button>

                                                <button
                                                    className="btn-primary"
                                                    onClick={() =>
                                                        handleAcceptInvitation(
                                                            invitation.invitedEmail
                                                        )
                                                    }
                                                >
                                                    Accept
                                                </button>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        ) : (
                            <div className="dashboard-card empty-card">
                                <div className="empty-icon">
                                    📭
                                </div>
                                <h3>No Invitations</h3>
                                <p>
                                    You don't have any pending team
                                    invitations.
                                </p>
                            </div>
                        )}
                    </div>
                ) : !hasTeam ? (
                    <div className="dashboard-section">
                        <div className="section-header main-heading">
                            <div>
                                <h1>My Team</h1>
                                <p>
                                    Create your team and start preparing
                                    for the hackathon.
                                </p>
                            </div>
                        </div>

                        <div className="dashboard-card empty-card">
    {!showCreateForm ? (
        <>
            <div className="empty-icon">
                👥
            </div>

            <h2>
                You don't have a team yet
            </h2>

            <p>
                Create a team to participate
                in the hackathon.
            </p>

            <button
                className="btn-primary"
                onClick={() => {
                    setCreateTeamStep(1);
                    setShowCreateForm(true);
                }}
            >
                + Create Team
            </button>
        </>
    ) : (
        <div className="team-wizard">
            <div className="wizard-progress">
                <div
                    className={`wizard-step ${
                        createTeamStep >= 1
                            ? "active"
                            : ""
                    }`}
                >
                    <span>1</span>
                    <p>Team</p>
                </div>

                <div className="wizard-line" />

                <div
                    className={`wizard-step ${
                        createTeamStep >= 2
                            ? "active"
                            : ""
                    }`}
                >
                    <span>2</span>
                    <p>Members</p>
                </div>

                <div className="wizard-line" />

                <div
                    className={`wizard-step ${
                        createTeamStep >= 3
                            ? "active"
                            : ""
                    }`}
                >
                    <span>3</span>
                    <p>Confirm</p>
                </div>
            </div>

            {createTeamStep === 1 && (
                <div className="wizard-content">
                    <h3>Team Information</h3>

                    <p>
                        Choose a name for your team.
                    </p>

                    <div className="form-group">
                        <label>Team Name</label>

                        <input
                            type="text"
                            placeholder="Enter team name"
                            value={teamName}
                            onChange={(e) =>
                                setTeamName(
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div className="wizard-actions">
                        <button
                            className="btn-secondary"
                            onClick={() => {
                                setShowCreateForm(false);
                                setCreateTeamStep(1);
                                setTeamName("");
                                setSelectedPeople([]);
                            }}
                        >
                            Cancel
                        </button>

                        <button
                            className="btn-primary"
                            disabled={!teamName.trim()}
                            onClick={() =>
                                setCreateTeamStep(2)
                            }
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {createTeamStep === 2 && (
                <div className="wizard-content">
                    <h3>Add Members</h3>

                    <p>
                        Invite members to join your
                        team. You can also invite more
                        members later.
                    </p>

                    <PersonPicker
                        selectedPeople={
                            selectedPeople
                        }
                        onChange={
                            setSelectedPeople
                        }
                        maxPeople={4}
                    />

                    <div className="wizard-actions">
                        <button
                            className="btn-secondary"
                            onClick={() =>
                                setCreateTeamStep(1)
                            }
                        >
                            Back
                        </button>

                        <button
                            className="btn-primary"
                            onClick={() =>
                                setCreateTeamStep(3)
                            }
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {createTeamStep === 3 && (
                <div className="wizard-content">
                    <h3>Confirm Team</h3>

                    <p>
                        Review your team information
                        before creating the team.
                    </p>

                    <div className="wizard-summary">
                        <div className="wizard-summary-row">
                            <span>Team Name</span>
                            <strong>
                                {teamName}
                            </strong>
                        </div>

                        <div className="wizard-summary-row">
                            <span>Team Leader</span>
                            <strong>You</strong>
                        </div>

                        <div className="wizard-summary-row">
                            <span>
                                Invited Members
                            </span>
                            <strong>
                                {
                                    selectedPeople.length
                                }
                            </strong>
                        </div>
                    </div>

                    {selectedPeople.length > 0 && (
                        <div className="wizard-member-summary">
                            {selectedPeople.map(
                                (person) => (
                                    <div
                                        key={person}
                                        className="wizard-member"
                                    >
                                        <div className="member-avatar">
                                            {person
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <span>
                                            {person}
                                        </span>
                                    </div>
                                )
                            )}
                        </div>
                    )}

                    <div className="wizard-actions">
                        <button
                            className="btn-secondary"
                            onClick={() =>
                                setCreateTeamStep(2)
                            }
                        >
                            Back
                        </button>

                        <button
                            className="btn-primary"
                            onClick={
                                handleCreateTeam
                            }
                        >
                            Create Team
                        </button>
                    </div>
                </div>
            )}
        </div>
    )}
</div>
                    </div>
                ) : (
                    <>
                        {/* Heading */}
                        <div className="section-header main-heading dashboard-section">
                            <div>
                                <h1>
                                    {hasTeam ? teamName : "My Team"}
                                </h1>                       
                            </div>
                        </div>

                        {message && (
                            <div className="success-message">
                                ✅ {message}
                            </div>
                        )}

                        {/* Overview */}
                        <div className="overview-grid">
                            <section className="dashboard-card team-overview-card">
                                <div className="overview-icon blue">
                                    👥
                                </div>

                                <div className="overview-info">
                                    <h2>{teamName}</h2>

                                    <p>
                                        Members:{" "}
                                        <strong>
                                            {members.length} / 5
                                        </strong>
                                    </p>

                                    <div className="member-progress">
                                        <div
                                            className="member-progress-bar"
                                            style={{
                                                width: `${
                                                    (members.length /
                                                        5) *
                                                    100
                                                }%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </section>

                            {registeredTrack && currentRound ? (
                                <section className="dashboard-card round-card">
                                    <div className="overview-icon green">
                                        📅
                                    </div>

                                    <div className="overview-info">
                                        <span className="small-label">
                                            Current Round
                                        </span>

                                        <h2>{currentRound.name}</h2>

                                        <p>
                                            Deadline:{" "}
                                            {new Date(
                                                currentRound.deadline
                                                ).toLocaleString()}
                                        </p>
                                        

                                        <p>
                                            ⏱ Time Left:{" "}
                                            <strong>{timeLeft}</strong>
                                        </p>
                                    </div>
                                </section>
     
) : (
    <section className="dashboard-card round-card">
        <div className="overview-icon green">
            🔒
        </div>

        <div className="overview-info">
            <span className="small-label">
                Current Round
            </span>

            <h2>Not available yet</h2>

            <p>
                Register for a track to view the
                current round and deadline.
            </p>
        </div>
    </section>
)}
                        </div>

                        {/* Members + Track */}
                        <div className="middle-grid">
                            {/* Members */}
                            <section className="dashboard-card">
                                <div className="card-heading-row">
                                    <div>
                                        <h2>👥 Team Members</h2>
                                        <p>
                                            {members.length} of 5
                                            members
                                        </p>
                                    </div>

                                    {!showInviteForm && (
                                        <button
                                            className="btn-primary"
                                            onClick={() =>
                                                setShowInviteForm(
                                                    true
                                                )
                                            }
                                        >
                                            + Invite Member
                                        </button>
                                    )}
                                </div>

                                <div className="dashboard-member-list">
                                    {members.map(
                                        (member, index) => (
                                            <div
                                                className="dashboard-member"
                                                key={index}
                                            >
                                                <div className="member-avatar">
                                                    {member.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>

                                                <div className="member-name">
                                                    {member.name}
                                                </div>

                                                <span
                                                    className={`dashboard-role ${
                                                        member.role ===
                                                        "Leader"
                                                            ? "leader"
                                                            : "member"
                                                    }`}
                                                >
                                                    {
                                                        member.role
                                                    }
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>

                                {invitations.length > 0 && (
                                    <div className="pending-section">
                                        <h3>
                                            Pending Invitations
                                        </h3>

                                        {invitations.map(
                                            (invitation) => (
                                                <div
                                                    className="dashboard-member pending-member"
                                                    key={
                                                        invitation.email
                                                    }
                                                >
                                                    <div className="member-avatar pending">
                                                        ✉
                                                    </div>

                                                    <div className="member-name">
                                                        {
                                                            invitation.email
                                                        }
                                                    </div>

                                                    <span className="pending-badge">
                                                        {
                                                            invitation.status
                                                        }
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}

                                {showInviteForm && (
                                    <div className="dashboard-form invite-dashboard-form">
                                        <label>
                                            Member Email
                                        </label>

                                        <input
                                            type="email"
                                            placeholder="Enter member email"
                                            value={inviteEmail}
                                            onChange={(e) =>
                                                setInviteEmail(
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <div className="card-actions">
                                            <button
                                                className="btn-secondary"
                                                onClick={() => {
                                                    setShowInviteForm(
                                                        false
                                                    );
                                                    setInviteEmail(
                                                        ""
                                                    );
                                                }}
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                className="btn-primary"
                                                onClick={
                                                    handleInviteMember
                                                }
                                            >
                                                Send Invitation
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </section>

                            {/* Track */}
                            <section className="dashboard-card">
                                <div className="card-heading-row">
                                    <div>
                                        <h2>
                                            🎯 Track Registration
                                        </h2>
                                        <p>
                                            Choose a track for your
                                            team.
                                        </p>
                                    </div>
                                </div>

                                {!registeredTrack ? (
                                    <div className="track-dashboard-form">
                                        <select
                                            value={selectedTrack}
                                            onChange={(e) =>
                                                setSelectedTrack(
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="">
                                                {tracks.length === 0 ? "-- No tracks available --" : "-- Select Track --"}
                                                </option>
                                                
                                                {tracks.map((track) => (
                                                    <option
                                                    key={track.id}
                                                    value={track.name}
                                                    >
                                                        {track.name}
                                                        </option>
                                                ))}
                                        </select>

                                        <button
                                            className="btn-primary full-width"
                                            onClick={
                                                handleRegisterTrack
                                            }
                                            disabled={
                                                members.length < 3 ||
                                                tracks.length === 0
                                            }
                                        >
                                            Register for Track
                                        </button>

                                        {members.length < 3 && (
                                            <p className="helper-text">
                                                You need at least
                                                3 members to
                                                register for a
                                                track.
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="registered-dashboard">
                                        <div className="registered-icon">
                                            ✓
                                        </div>

                                        <div>
                                            <p>
                                                Registered Track
                                            </p>
                                            <strong>
                                                {
                                                    registeredTrack
                                                }
                                            </strong>
                                        </div>
                                    </div>
                                )}
                            </section>
                        </div>

                        <section className="dashboard-card submission-dashboard-card">
                            <div className="card-heading-row">
                                <div>
                                    <h2>📄 Submission</h2>
                                    <p>
                                        Submit your project before
                                        the deadline.
                                    </p>
                                </div>
                            </div>

                            {submissionLoadError ? (
                                <div className="submission-alert warning">
                                    <div className="alert-icon">
                                        ⚠
                                    </div>

                                    <div>
                                        <strong>
                                            Failed to load
                                            submission
                                        </strong>
                                        <p>
                                            Submission data could
                                            not be loaded.
                                        </p>
                                    </div>
                                </div>
                            ) : !submitted ? (
                                <div className="submission-alert danger">
                                    <div className="alert-icon">
                                        !
                                    </div>

                                    <div>
                                        <strong>
                                            Not submitted
                                        </strong>
                                        <p>
                                            Your team has not
                                            submitted the project
                                            for this round yet.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="submission-alert success">
                                    <div className="alert-icon">
                                        ✓
                                    </div>

                                    <div>
                                        <strong>
                                            Submitted successfully
                                        </strong>
                                        <p>
                                            Your project has been
                                            submitted for this
                                            round.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {!showSubmissionForm &&
                                !submitted && (
                                    <div className="submission-action">
                                        <button
                                            className="btn-primary submit-main-button"
                                            onClick={() =>
                                                setShowSubmissionForm(true)
                                            }
                                            disabled={
                                                !registeredTrack ||
                                                !currentRound ||
                                                isDeadlinePassed
                                            }
                                        >
                                            {!currentRound
                                                ? "Submission Not Available"
                                                : isDeadlinePassed
                                                ? "Submission Closed"
                                                : "⬆ Submit Project"}
                                        </button>

                                        {!registeredTrack &&
                                            !isDeadlinePassed && (
                                                <p className="helper-text">
                                                    Please
                                                    register for a
                                                    track before
                                                    submitting your
                                                    project.
                                                </p>
                                            )}
                                    </div>
                                )}

                            {showSubmissionForm &&
                                !isDeadlinePassed && (
                                    <div className="dashboard-form submission-dashboard-form">
                                        <div className="form-group">
                                            <label>
                                                Repository URL
                                            </label>

                                            <input
                                                type="url"
                                                placeholder="https://github.com/..."
                                                value={
                                                    repositoryUrl
                                                }
                                                onChange={(e) =>
                                                    setRepositoryUrl(
                                                        e.target
                                                            .value
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>
                                                Demo URL
                                            </label>

                                            <input
                                                type="url"
                                                placeholder="https://..."
                                                value={demoUrl}
                                                onChange={(e) =>
                                                    setDemoUrl(
                                                        e.target
                                                            .value
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>
                                                Report/Slide URL
                                            </label>

                                            <input
                                                type="url"
                                                placeholder="https://..."
                                                value={
                                                    reportSlideUrl
                                                }
                                                onChange={(e) =>
                                                    setReportSlideUrl(
                                                        e.target
                                                            .value
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="card-actions">
                                            <button
                                                className="btn-secondary"
                                                onClick={() =>
                                                    setShowSubmissionForm(
                                                        false
                                                    )
                                                }
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                className="btn-primary"
                                                onClick={
                                                    handleSubmitProject
                                                }
                                                disabled={
                                                    isDeadlinePassed
                                                }
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                )}

                            {submitted && (
                                <div className="submitted-links">
                                    <div>
                                        <span>
                                            Repository
                                        </span>
                                        <a
                                            href={repositoryUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {repositoryUrl}
                                        </a>
                                    </div>

                                    <div>
                                        <span>Demo</span>
                                        <a
                                            href={demoUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {demoUrl}
                                        </a>
                                    </div>

                                    <div>
                                        <span>
                                            Report/Slide
                                        </span>
                                        <a
                                            href={
                                                reportSlideUrl
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {reportSlideUrl}
                                        </a>
                                    </div>
                                </div>
                            )}
                        </section>
                    </>
                )}
            </div>
        </main>
    </div>
);

}

export default MyTeam;