package com.seal.hackathon.service;

import com.seal.hackathon.domain.entity.HackathonEvent;
import com.seal.hackathon.domain.entity.Round;
import com.seal.hackathon.domain.entity.Track;
import com.seal.hackathon.domain.entity.User;
import com.seal.hackathon.domain.entity.UserRoleAssignment;
import com.seal.hackathon.domain.enums.JudgeType;
import com.seal.hackathon.domain.enums.RoleName;
import com.seal.hackathon.domain.enums.ScopeType;
import com.seal.hackathon.dto.scoring.JudgeAssignmentRequest;
import com.seal.hackathon.dto.scoring.MentorAssignmentRequest;
import com.seal.hackathon.exception.ApiException;
import com.seal.hackathon.repository.RoundRepository;
import com.seal.hackathon.repository.TrackRepository;
import com.seal.hackathon.repository.UserRepository;
import com.seal.hackathon.repository.UserRoleAssignmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JudgeAssignmentServiceTest {

    @Mock
    private UserRoleAssignmentRepository roleAssignmentRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private TrackRepository trackRepository;
    @Mock
    private RoundRepository roundRepository;
    @Mock
    private RoundService roundService;

    @InjectMocks
    private JudgeAssignmentService judgeAssignmentService;

    private UUID eventId;
    private UUID roundId;
    private UUID trackId;
    private UUID userId;
    private HackathonEvent event;
    private Round round;
    private Track track;
    private User user;

    @BeforeEach
    void setUp() {
        eventId = UUID.randomUUID();
        roundId = UUID.randomUUID();
        trackId = UUID.randomUUID();
        userId = UUID.randomUUID();

        event = HackathonEvent.builder().build();
        event.setId(eventId);

        round = Round.builder().event(event).build();
        round.setId(roundId);

        track = Track.builder().event(event).build();
        track.setId(trackId);

        user = User.builder().build();
        user.setId(userId);
    }

    @Test
    void assignJudge_shouldSucceed_whenNoConflict() {
        JudgeAssignmentRequest request = new JudgeAssignmentRequest(userId, JudgeType.INTERNAL);

        when(roundService.findOrThrow(roundId)).thenReturn(round);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(roleAssignmentRepository.existsByUserIdAndRoleNameAndScopeTypeAndScopeId(
                userId, RoleName.JUDGE, ScopeType.ROUND, roundId)).thenReturn(false);
        when(trackRepository.findByEventId(eventId)).thenReturn(List.of(track));
        when(roleAssignmentRepository.existsByUserIdAndRoleNameAndScopeTypeAndScopeIdIn(
                userId, RoleName.MENTOR, ScopeType.TRACK, List.of(trackId))).thenReturn(false);

        judgeAssignmentService.assignJudge(roundId, request);

        verify(roleAssignmentRepository).save(any(UserRoleAssignment.class));
    }

    @Test
    void assignJudge_shouldThrowConflict_whenAlreadyAssignedToRound() {
        JudgeAssignmentRequest request = new JudgeAssignmentRequest(userId, JudgeType.INTERNAL);

        when(roundService.findOrThrow(roundId)).thenReturn(round);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(roleAssignmentRepository.existsByUserIdAndRoleNameAndScopeTypeAndScopeId(
                userId, RoleName.JUDGE, ScopeType.ROUND, roundId)).thenReturn(true);

        assertThatThrownBy(() -> judgeAssignmentService.assignJudge(roundId, request))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("đã được phân công");
    }

    @Test
    void assignJudge_shouldThrowConflict_whenUserIsMentorInSameEvent() {
        JudgeAssignmentRequest request = new JudgeAssignmentRequest(userId, JudgeType.INTERNAL);

        when(roundService.findOrThrow(roundId)).thenReturn(round);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(roleAssignmentRepository.existsByUserIdAndRoleNameAndScopeTypeAndScopeId(
                userId, RoleName.JUDGE, ScopeType.ROUND, roundId)).thenReturn(false);
        when(trackRepository.findByEventId(eventId)).thenReturn(List.of(track));
        when(roleAssignmentRepository.existsByUserIdAndRoleNameAndScopeTypeAndScopeIdIn(
                userId, RoleName.MENTOR, ScopeType.TRACK, List.of(trackId))).thenReturn(true);

        assertThatThrownBy(() -> judgeAssignmentService.assignJudge(roundId, request))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("đang là Mentor trong sự kiện này");
    }

    @Test
    void assignMentor_shouldSucceed_whenNoConflict() {
        MentorAssignmentRequest request = new MentorAssignmentRequest(userId);

        when(trackRepository.findById(trackId)).thenReturn(Optional.of(track));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(roleAssignmentRepository.existsByUserIdAndRoleNameAndScopeTypeAndScopeId(
                userId, RoleName.MENTOR, ScopeType.TRACK, trackId)).thenReturn(false);
        when(roundRepository.findByEventIdOrderByOrderIndexAsc(eventId)).thenReturn(List.of(round));
        when(roleAssignmentRepository.existsByUserIdAndRoleNameAndScopeTypeAndScopeIdIn(
                userId, RoleName.JUDGE, ScopeType.ROUND, List.of(roundId))).thenReturn(false);

        judgeAssignmentService.assignMentor(trackId, request);

        verify(roleAssignmentRepository).save(any(UserRoleAssignment.class));
    }

    @Test
    void assignMentor_shouldThrowConflict_whenUserIsJudgeInSameEvent() {
        MentorAssignmentRequest request = new MentorAssignmentRequest(userId);

        when(trackRepository.findById(trackId)).thenReturn(Optional.of(track));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(roleAssignmentRepository.existsByUserIdAndRoleNameAndScopeTypeAndScopeId(
                userId, RoleName.MENTOR, ScopeType.TRACK, trackId)).thenReturn(false);
        when(roundRepository.findByEventIdOrderByOrderIndexAsc(eventId)).thenReturn(List.of(round));
        when(roleAssignmentRepository.existsByUserIdAndRoleNameAndScopeTypeAndScopeIdIn(
                userId, RoleName.JUDGE, ScopeType.ROUND, List.of(roundId))).thenReturn(true);

        assertThatThrownBy(() -> judgeAssignmentService.assignMentor(trackId, request))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("đang là Giám khảo trong sự kiện này");
    }
}
