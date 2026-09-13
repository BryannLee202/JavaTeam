package com.seal.hackathon.dto.event;

import java.util.UUID;

public record TrackResponse(
        UUID id,
        UUID eventId,
        String name,
        String description,
        Integer maxTeams
) {
}
