package com.seal.hackathon.dto.scoring;

import com.seal.hackathon.domain.entity.Disqualification;
import com.seal.hackathon.domain.enums.DisqualificationTargetType;

import java.time.Instant;
import java.util.UUID;

/** Khop voi interface DisqualificationItem trong frontend/src/api/types/criteria.ts. */
public record DisqualificationResponse(
        UUID id,
        DisqualificationTargetType targetType,
        UUID teamId,
        UUID submissionId,
        String reason,
        String decidedByName,
        Instant decidedAt,
        boolean revoked
) {
    public static DisqualificationResponse from(Disqualification d) {
        return new DisqualificationResponse(
                d.getId(),
                d.getTargetType(),
                d.getTeamId(),
                d.getSubmissionId(),
                d.getReason(),
                d.getDecidedBy().getFullName(),
                d.getDecidedAt(),
                d.isRevoked()
        );
    }
}
