package com.seal.hackathon.dto.team;

import com.seal.hackathon.domain.enums.TeamMemberRole;

import java.util.UUID;

public record TeamMemberResponse(
        UUID userId,
        String fullName,
        String email,
        TeamMemberRole roleInTeam
) {
}
