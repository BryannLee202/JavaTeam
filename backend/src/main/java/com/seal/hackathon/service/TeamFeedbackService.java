package com.seal.hackathon.service;

import com.seal.hackathon.domain.entity.MentorFeedbackMessage;
import com.seal.hackathon.domain.entity.User;
import com.seal.hackathon.domain.enums.AuditAction;
import com.seal.hackathon.domain.enums.FeedbackAuthorRole;
import com.seal.hackathon.domain.enums.RoleName;
import com.seal.hackathon.domain.enums.ScopeType;
import com.seal.hackathon.dto.mentor.FeedbackMessageRequest;
import com.seal.hackathon.dto.mentor.FeedbackMessageResponse;
import com.seal.hackathon.exception.ApiException;
import com.seal.hackathon.repository.MentorFeedbackMessageRepository;
import com.seal.hackathon.repository.UserRepository;
import com.seal.hackathon.security.AuthenticatedPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TeamFeedbackService {

    private final TeamAccessProvider teamAccessProvider;
    private final MentorFeedbackMessageRepository messageRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;

    public TeamFeedbackService(
            TeamAccessProvider teamAccessProvider,
            MentorFeedbackMessageRepository messageRepository,
            UserRepository userRepository,
            AuditService auditService
    ) {
        this.teamAccessProvider = teamAccessProvider;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.auditService = auditService;
    }

    @Transactional(readOnly = true)
    public List<FeedbackMessageResponse> list(UUID teamId, AuthenticatedPrincipal principal) {
        assertTeamExists(teamId);
        assertCanAccess(teamId, principal);
        return messageRepository.findByTeamIdWithAuthorOrderByCreatedAtAsc(teamId).stream()
                .map(m -> FeedbackMessageResponse.from(m, teamId))
                .collect(Collectors.toList());
    }

    @Transactional
    public FeedbackMessageResponse post(UUID teamId, FeedbackMessageRequest request, AuthenticatedPrincipal principal) {
        assertTeamExists(teamId);
        FeedbackAuthorRole role = assertCanAccess(teamId, principal);
        User author = userRepository.findById(principal.userId())
                .orElseThrow(() -> ApiException.notFound("Không tìm thấy người dùng"));

        MentorFeedbackMessage message = MentorFeedbackMessage.builder()
                .teamId(teamId)
                .author(author)
                .authorRole(role)
                .body(request.body().trim())
                .build();
        message = messageRepository.save(message);

        auditService.record(principal.userId(), AuditAction.MENTOR_MESSAGE_SEND, "Team", teamId, null, role.name());
        return FeedbackMessageResponse.from(message, teamId);
    }

    private FeedbackAuthorRole assertCanAccess(UUID teamId, AuthenticatedPrincipal principal) {
        if (principal == null) {
            throw ApiException.unauthorized("Cần đăng nhập để thực hiện thao tác này");
        }
        if (teamAccessProvider.isTeamMember(teamId, principal.userId())) {
            return FeedbackAuthorRole.TEAM_MEMBER;
        }
        UUID trackId = teamAccessProvider.getTeamTrackId(teamId);
        if (trackId != null && principal.hasRoleInScope(RoleName.MENTOR, ScopeType.TRACK, trackId)) {
            return FeedbackAuthorRole.MENTOR;
        }
        if (principal.isCoordinator() || principal.hasRole(RoleName.MENTOR)) {
            return FeedbackAuthorRole.MENTOR;
        }
        throw ApiException.forbidden("Bạn không có quyền truy cập trao đổi của đội này");
    }

    private void assertTeamExists(UUID teamId) {
        if (!teamAccessProvider.teamExists(teamId)) {
            throw ApiException.notFound("Không tìm thấy đội thi");
        }
    }
}
