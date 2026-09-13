package com.sealhackathon.coordinator.track.dto;

public record TrackResponse(
        Long id,
        Long eventId,
        String name,
        String description,
        Long mentorId,
        // Team domain thuộc module khác — để 0 cho tới khi có TeamRepository thật.
        long teamCount
) {
}
