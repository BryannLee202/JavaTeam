package com.seal.hackathon.dto.event;

import com.seal.hackathon.domain.entity.Track;

import java.util.UUID;

/**
 * Dữ liệu một hạng mục trả về cho frontend.
 *
 * mentorId / mentorName / teamCount không nằm trên entity Track:
 *   - mentor gắn với hạng mục qua UserRoleAssignment (MENTOR + TRACK + scopeId)
 *   - số đội đếm từ TeamRepository
 * {@code TrackService} tra hai thứ đó rồi truyền vào qua {@link #withDetails}.
 */
public record TrackResponse(
        UUID id,
        UUID eventId,
        String name,
        String description,
        Integer maxTeams,
        UUID mentorId,
        String mentorName,
        long teamCount
) {
    /** Dùng cho các đường ghi — chưa cần mentor và số đội. */
    public static TrackResponse from(Track track) {
        return withDetails(track, null, null, 0);
    }

    public static TrackResponse withDetails(Track track, UUID mentorId, String mentorName, long teamCount) {
        return new TrackResponse(
                track.getId(),
                track.getEvent().getId(),
                track.getName(),
                track.getDescription(),
                track.getMaxTeams(),
                mentorId,
                mentorName,
                teamCount
        );
    }
}
