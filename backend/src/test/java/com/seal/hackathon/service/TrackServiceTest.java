package com.seal.hackathon.service;

import com.seal.hackathon.domain.entity.HackathonEvent;
import com.seal.hackathon.domain.entity.Track;
import com.seal.hackathon.domain.entity.User;
import com.seal.hackathon.domain.entity.UserRoleAssignment;
import com.seal.hackathon.domain.enums.RoleName;
import com.seal.hackathon.domain.enums.ScopeType;
import com.seal.hackathon.dto.event.TrackResponse;
import com.seal.hackathon.repository.TeamRepository;
import com.seal.hackathon.repository.TrackRepository;
import com.seal.hackathon.repository.UserRoleAssignmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

/**
 * Kiểm tra hai trường mà màn Hạng mục của Ban tổ chức cần nhưng entity Track
 * không có: mentor phụ trách và số đội.
 */
@ExtendWith(MockitoExtension.class)
class TrackServiceTest {

    @Mock
    private TrackRepository trackRepository;
    @Mock
    private TeamRepository teamRepository;
    @Mock
    private EventService eventService;
    @Mock
    private UserRoleAssignmentRepository roleAssignmentRepository;

    @InjectMocks
    private TrackService trackService;

    private UUID eventId;
    private UUID trackId;
    private Track track;

    @BeforeEach
    void setUp() {
        eventId = UUID.randomUUID();
        trackId = UUID.randomUUID();

        HackathonEvent event = new HackathonEvent();
        event.setId(eventId);

        track = Track.builder()
                .event(event)
                .name("AI / Machine Learning")
                .description("Hạng mục AI")
                .maxTeams(10)
                .build();
        track.setId(trackId);
    }

    private UserRoleAssignment mentorAssignment(UUID userId, String fullName) {
        User mentor = User.builder().fullName(fullName).build();
        mentor.setId(userId);

        UserRoleAssignment assignment = new UserRoleAssignment();
        assignment.setUser(mentor);
        assignment.setRoleName(RoleName.MENTOR);
        assignment.setScopeType(ScopeType.TRACK);
        assignment.setScopeId(trackId);
        return assignment;
    }

    @Test
    void listByEvent_gan_mentor_va_so_doi_vao_tung_hang_muc() {
        UUID mentorId = UUID.randomUUID();
        when(trackRepository.findByEventId(eventId)).thenReturn(List.of(track));
        when(roleAssignmentRepository.findByRoleNameAndScopeTypeAndScopeId(RoleName.MENTOR, ScopeType.TRACK, trackId))
                .thenReturn(List.of(mentorAssignment(mentorId, "Mentor One")));
        when(teamRepository.countByTrackId(trackId)).thenReturn(4L);

        List<TrackResponse> result = trackService.listByEvent(eventId);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).mentorId()).isEqualTo(mentorId);
        assertThat(result.get(0).mentorName()).isEqualTo("Mentor One");
        assertThat(result.get(0).teamCount()).isEqualTo(4L);
    }

    @Test
    void hang_muc_chua_co_mentor_thi_tra_ve_null_chu_khong_nem_loi() {
        when(trackRepository.findByEventId(eventId)).thenReturn(List.of(track));
        when(roleAssignmentRepository.findByRoleNameAndScopeTypeAndScopeId(RoleName.MENTOR, ScopeType.TRACK, trackId))
                .thenReturn(List.of());
        when(teamRepository.countByTrackId(trackId)).thenReturn(0L);

        List<TrackResponse> result = trackService.listByEvent(eventId);

        assertThat(result.get(0).mentorId()).isNull();
        assertThat(result.get(0).mentorName()).isNull();
        assertThat(result.get(0).teamCount()).isZero();
    }

    @Test
    void nhieu_phan_cong_mentor_thi_lay_cai_dau_tien_chu_khong_lam_sap_danh_sach() {
        UUID first = UUID.randomUUID();
        when(trackRepository.findByEventId(eventId)).thenReturn(List.of(track));
        when(roleAssignmentRepository.findByRoleNameAndScopeTypeAndScopeId(RoleName.MENTOR, ScopeType.TRACK, trackId))
                .thenReturn(List.of(
                        mentorAssignment(first, "Mentor One"),
                        mentorAssignment(UUID.randomUUID(), "Mentor Two")));
        when(teamRepository.countByTrackId(trackId)).thenReturn(2L);

        List<TrackResponse> result = trackService.listByEvent(eventId);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).mentorId()).isEqualTo(first);
    }

    @Test
    void duong_ghi_van_dung_from_nen_chua_co_mentor_va_so_doi() {
        TrackResponse response = TrackResponse.from(track);

        assertThat(response.id()).isEqualTo(trackId);
        assertThat(response.eventId()).isEqualTo(eventId);
        assertThat(response.maxTeams()).isEqualTo(10);
        assertThat(response.mentorId()).isNull();
        assertThat(response.teamCount()).isZero();
    }
}
