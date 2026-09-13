package com.seal.hackathon.dto.prize;

import com.seal.hackathon.domain.entity.Prize;

import java.util.UUID;

/** Khop voi interface PrizeItem trong frontend/src/api/types/criteria.ts. */
public record PrizeResponse(
        UUID id,
        UUID eventId,
        UUID trackId,
        String name,
        int rankCondition,
        UUID awardedTeamId,
        String awardedTeamName,
        boolean revoked
) {
    public static PrizeResponse from(Prize p) {
        return new PrizeResponse(
                p.getId(),
                p.getEventId(),
                p.getTrackId(),
                p.getName(),
                p.getRankCondition(),
                p.getAwardedTeamId(),
                p.getAwardedTeamName(),
                p.isRevoked()
        );
    }
}
