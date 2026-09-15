package com.seal.hackathon.service;

import com.seal.hackathon.domain.entity.UserRoleAssignment;
import com.seal.hackathon.domain.enums.RoleName;
import com.seal.hackathon.domain.enums.ScopeType;
import com.seal.hackathon.domain.enums.TeamStatus;
import com.seal.hackathon.dto.team.TeamResponse;
import com.seal.hackathon.repository.UserRoleAssignmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MentorServiceTest {

    @Mock
    private UserRoleAssignmentRepository roleAssignmentRepository;
    @Mock
    private TeamService teamService;

    @InjectMocks
    private MentorService mentorService;

    private UUID mentorUserId;
    private UUID trackId1;
    private UUID trackId2;

    @BeforeEach
    void setUp() {
        mentorUserId = UUID.randomUUID();
        trackId1 = UUID.randomUUID();
        trackId2 = UUID.randomUUID();
    }

    @Test
    @DisplayName("Loc danh sach doi thi theo dung quyen Mentor tren tung Track")
    void listMyTeams_WhenMentorHasAssignedTracks_ShouldFilterAndReturnTeams() {
        UserRoleAssignment assign1 = UserRoleAssignment.builder()
                .roleName(RoleName.MENTOR)
                .scopeType(ScopeType.TRACK)
                .scopeId(trackId1)
                .build();

        UserRoleAssignment assign2 = UserRoleAssignment.builder()
                .roleName(RoleName.MENTOR)
                .scopeType(ScopeType.TRACK)
                .scopeId(trackId2)
                .build();

        UserRoleAssignment assignJudge = UserRoleAssignment.builder()
                .roleName(RoleName.JUDGE)
                .scopeType(ScopeType.TRACK)
                .scopeId(UUID.randomUUID())
                .build();

        when(roleAssignmentRepository.findByUserId(mentorUserId))
                .thenReturn(List.of(assign1, assign2, assignJudge));

        TeamResponse teamResp = new TeamResponse(
                UUID.randomUUID(),
                UUID.randomUUID(),
                "Doi Mau",
                trackId1,
                "Track 1",
                TeamStatus.REGISTERED,
                List.of()
        );

        when(teamService.listByTracks(List.of(trackId1, trackId2)))
                .thenReturn(List.of(teamResp));

        List<TeamResponse> results = mentorService.listMyTeams(mentorUserId);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).name()).isEqualTo("Doi Mau");
        verify(teamService).listByTracks(List.of(trackId1, trackId2));
    }

    @Test
    @DisplayName("Tra ve danh sach rong khi Mentor chua duoc phan cong Track nao")
    void listMyTeams_WhenMentorHasNoTracks_ShouldPassEmptyList() {
        when(roleAssignmentRepository.findByUserId(mentorUserId)).thenReturn(Collections.emptyList());
        when(teamService.listByTracks(Collections.emptyList())).thenReturn(Collections.emptyList());

        List<TeamResponse> results = mentorService.listMyTeams(mentorUserId);

        assertThat(results).isEmpty();
        verify(teamService).listByTracks(Collections.emptyList());
    }
}
