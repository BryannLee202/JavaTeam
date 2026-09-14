package com.seal.hackathon.dto.team;

import com.seal.hackathon.domain.enums.TeamStatus;

import java.util.List;
import java.util.UUID;

public record TeamResponse(
        UUID id,
        UUID eventId,
        String name,
        UUID trackId,
        String trackName,
        TeamStatus status,
        List<TeamMemberResponse> members
) {
}
