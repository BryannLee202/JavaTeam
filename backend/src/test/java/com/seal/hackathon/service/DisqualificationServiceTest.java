package com.seal.hackathon.service;

import com.seal.hackathon.domain.entity.Disqualification;
import com.seal.hackathon.domain.entity.Submission;
import com.seal.hackathon.domain.entity.Team;
import com.seal.hackathon.domain.entity.User;
import com.seal.hackathon.domain.enums.AuditAction;
import com.seal.hackathon.domain.enums.DisqualificationTargetType;
import com.seal.hackathon.domain.enums.TeamStatus;
import com.seal.hackathon.dto.scoring.DisqualificationRequest;
import com.seal.hackathon.dto.scoring.DisqualificationResponse;
import com.seal.hackathon.exception.ApiException;
import com.seal.hackathon.repository.DisqualificationRepository;
import com.seal.hackathon.repository.SubmissionRepository;
import com.seal.hackathon.repository.TeamRepository;
import com.seal.hackathon.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DisqualificationServiceTest {

    @Mock
    private DisqualificationRepository disqualificationRepository;
    @Mock
    private TeamRepository teamRepository;
    @Mock
    private SubmissionRepository submissionRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private AuditService auditService;

    @InjectMocks
    private DisqualificationService disqualificationService;

    private UUID actorId;
    private UUID teamId;
    private UUID submissionId;
    private User actor;
    private Team team;
    private Submission submission;

    @BeforeEach
    void setUp() {
        actorId = UUID.randomUUID();
        teamId = UUID.randomUUID();
        submissionId = UUID.randomUUID();

        actor = User.builder()
                .fullName("Ban To Chuc")
                .email("btc@seal.edu.vn")
                .build();
        actor.setId(actorId);

        team = Team.builder()
                .name("Doi Thi Mau")
                .status(TeamStatus.REGISTERED)
                .build();
        team.setId(teamId);

        submission = Submission.builder()
                .team(team)
                .repoUrl("https://github.com/seal/demo")
                .submittedAt(Instant.now())
                .isLate(false)
                .build();
        submission.setId(submissionId);
    }

    @Test
    @DisplayName("Truat quyen thi dau cua doi thi thanh cong va ghi nhan audit")
    void disqualify_WhenTargetIsTeam_ShouldUpdateTeamStatusAndAudit() {
        DisqualificationRequest request = new DisqualificationRequest(
                DisqualificationTargetType.TEAM, teamId, null, "Gian lan thoi gian nop bai"
        );

        when(userRepository.findById(actorId)).thenReturn(Optional.of(actor));
        when(teamRepository.findById(teamId)).thenReturn(Optional.of(team));
        when(disqualificationRepository.save(any(Disqualification.class))).thenAnswer(invocation -> {
            Disqualification d = invocation.getArgument(0);
            d.setId(UUID.randomUUID());
            return d;
        });

        DisqualificationResponse response = disqualificationService.disqualify(request, actorId);

        assertThat(response).isNotNull();
        assertThat(response.targetType()).isEqualTo(DisqualificationTargetType.TEAM);
        assertThat(response.teamId()).isEqualTo(teamId);
        assertThat(team.getStatus()).isEqualTo(TeamStatus.DISQUALIFIED);

        verify(teamRepository).save(team);
        verify(disqualificationRepository).save(any(Disqualification.class));
        verify(auditService).record(eq(actorId), eq(AuditAction.TEAM_DISQUALIFY), eq("Team"), eq(teamId), any(), eq("Gian lan thoi gian nop bai"));
    }

    @Test
    @DisplayName("Truat quyen bai nop thanh cong va ghi nhan audit")
    void disqualify_WhenTargetIsSubmission_ShouldRecordAndAudit() {
        DisqualificationRequest request = new DisqualificationRequest(
                DisqualificationTargetType.SUBMISSION, null, submissionId, "Dao van ma nguon"
        );

        when(userRepository.findById(actorId)).thenReturn(Optional.of(actor));
        when(submissionRepository.findById(submissionId)).thenReturn(Optional.of(submission));
        when(disqualificationRepository.save(any(Disqualification.class))).thenAnswer(invocation -> {
            Disqualification d = invocation.getArgument(0);
            d.setId(UUID.randomUUID());
            return d;
        });

        DisqualificationResponse response = disqualificationService.disqualify(request, actorId);

        assertThat(response).isNotNull();
        assertThat(response.targetType()).isEqualTo(DisqualificationTargetType.SUBMISSION);
        assertThat(response.submissionId()).isEqualTo(submissionId);

        verify(submissionRepository).findById(submissionId);
        verify(disqualificationRepository).save(any(Disqualification.class));
        verify(auditService).record(eq(actorId), eq(AuditAction.SUBMISSION_DISQUALIFY), eq("Submission"), eq(submissionId), any(), eq("Dao van ma nguon"));
    }

    @Test
    @DisplayName("Bao loi khi nguoi thuc hien khong ton tai trong he thong")
    void disqualify_WhenActorNotFound_ShouldThrowNotFound() {
        DisqualificationRequest request = new DisqualificationRequest(
                DisqualificationTargetType.TEAM, teamId, null, "Vi pham quy che"
        );

        when(userRepository.findById(actorId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> disqualificationService.disqualify(request, actorId))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("Không tìm thấy người dùng");
    }

    @Test
    @DisplayName("Bao loi khi doi thi can truat quyen khong ton tai")
    void disqualify_WhenTeamNotFound_ShouldThrowNotFound() {
        DisqualificationRequest request = new DisqualificationRequest(
                DisqualificationTargetType.TEAM, teamId, null, "Vi pham quy che"
        );

        when(userRepository.findById(actorId)).thenReturn(Optional.of(actor));
        when(teamRepository.findById(teamId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> disqualificationService.disqualify(request, actorId))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("Không tìm thấy đội thi");
    }

    @Test
    @DisplayName("Bao loi khi bai nop can truat quyen khong ton tai")
    void disqualify_WhenSubmissionNotFound_ShouldThrowNotFound() {
        DisqualificationRequest request = new DisqualificationRequest(
                DisqualificationTargetType.SUBMISSION, null, submissionId, "Vi pham quy che"
        );

        when(userRepository.findById(actorId)).thenReturn(Optional.of(actor));
        when(submissionRepository.findById(submissionId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> disqualificationService.disqualify(request, actorId))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("Không tìm thấy bài nộp");
    }

    @Test
    @DisplayName("Lay danh sach truat quyen theo su kien tong hop tu ca doi thi va bai nop")
    void listByEvent_ShouldReturnCombinedList() {
        UUID eventId = UUID.randomUUID();
        Disqualification d1 = Disqualification.builder()
                .targetType(DisqualificationTargetType.TEAM)
                .team(team)
                .decidedBy(actor)
                .decidedAt(Instant.now())
                .reason("Ly do 1")
                .revoked(false)
                .build();
        d1.setId(UUID.randomUUID());

        Disqualification d2 = Disqualification.builder()
                .targetType(DisqualificationTargetType.SUBMISSION)
                .submission(submission)
                .decidedBy(actor)
                .decidedAt(Instant.now())
                .reason("Ly do 2")
                .revoked(false)
                .build();
        d2.setId(UUID.randomUUID());

        when(disqualificationRepository.findByTeam_Event_Id(eventId)).thenReturn(List.of(d1));
        when(disqualificationRepository.findBySubmission_Round_Event_Id(eventId)).thenReturn(List.of(d2));

        List<DisqualificationResponse> responses = disqualificationService.listByEvent(eventId);

        assertThat(responses).hasSize(2);
        verify(disqualificationRepository).findByTeam_Event_Id(eventId);
        verify(disqualificationRepository).findBySubmission_Round_Event_Id(eventId);
    }
}
