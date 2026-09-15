package com.seal.hackathon.service;

import com.seal.hackathon.domain.entity.HackathonEvent;
import com.seal.hackathon.domain.entity.Track;
import com.seal.hackathon.domain.entity.UserRoleAssignment;
import com.seal.hackathon.domain.enums.RoleName;
import com.seal.hackathon.domain.enums.ScopeType;
import com.seal.hackathon.dto.event.TrackRequest;
import com.seal.hackathon.dto.event.TrackResponse;
import com.seal.hackathon.exception.ApiException;
import com.seal.hackathon.repository.TeamRepository;
import com.seal.hackathon.repository.TrackRepository;
import com.seal.hackathon.repository.UserRoleAssignmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TrackService {

    private final TrackRepository trackRepository;
    private final TeamRepository teamRepository;
    private final EventService eventService;
    private final UserRoleAssignmentRepository roleAssignmentRepository;

    public TrackService(TrackRepository trackRepository,
                        TeamRepository teamRepository,
                        EventService eventService,
                        UserRoleAssignmentRepository roleAssignmentRepository) {
        this.trackRepository = trackRepository;
        this.teamRepository = teamRepository;
        this.eventService = eventService;
        this.roleAssignmentRepository = roleAssignmentRepository;
    }

    @Transactional
    public TrackResponse create(UUID eventId, TrackRequest request) {
        HackathonEvent event = eventService.findOrThrow(eventId);
        Track track = Track.builder()
                .event(event)
                .name(request.name())
                .description(request.description())
                .maxTeams(request.maxTeams())
                .build();
        return TrackResponse.from(trackRepository.save(track));
    }

    @Transactional(readOnly = true)
    public List<TrackResponse> listByEvent(UUID eventId) {
        return trackRepository.findByEventId(eventId).stream()
                .map(this::toResponseWithDetails)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TrackResponse get(UUID trackId) {
        return toResponseWithDetails(findOrThrow(trackId));
    }

    /**
     * Gắn mentor phụ trách và số đội vào một hạng mục.
     *
     * Một hạng mục về nguyên tắc chỉ có một mentor. Nếu dữ liệu lỡ có nhiều
     * phân công thì lấy cái đầu tiên thay vì ném lỗi — màn hình chỉ có một ô
     * để hiện, và hỏng dữ liệu không đáng làm sập cả danh sách hạng mục.
     */
    private TrackResponse toResponseWithDetails(Track track) {
        UUID trackId = track.getId();

        UserRoleAssignment mentorAssignment = roleAssignmentRepository
                .findByRoleNameAndScopeTypeAndScopeId(RoleName.MENTOR, ScopeType.TRACK, trackId)
                .stream()
                .findFirst()
                .orElse(null);

        UUID mentorId = mentorAssignment == null ? null : mentorAssignment.getUser().getId();
        String mentorName = mentorAssignment == null ? null : mentorAssignment.getUser().getFullName();

        return TrackResponse.withDetails(track, mentorId, mentorName, teamRepository.countByTrackId(trackId));
    }

    @Transactional
    public TrackResponse update(UUID trackId, TrackRequest request) {
        Track track = findOrThrow(trackId);
        track.setName(request.name());
        track.setDescription(request.description());
        track.setMaxTeams(request.maxTeams());
        return TrackResponse.from(trackRepository.save(track));
    }

    @Transactional
    public void delete(UUID trackId) {
        Track track = findOrThrow(trackId);
        if (!teamRepository.findByTrackId(trackId).isEmpty()) {
            throw ApiException.conflict("Không thể xoá Hạng mục đã có đội đăng ký");
        }
        trackRepository.delete(track);
    }

    Track findOrThrow(UUID trackId) {
        return trackRepository.findById(trackId)
                .orElseThrow(() -> ApiException.notFound("Không tìm thấy Hạng mục"));
    }
}
