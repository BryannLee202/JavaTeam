package com.seal.hackathon.dto.criteria;

import com.seal.hackathon.domain.entity.Criterion;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Khop voi interface CriterionItem trong frontend/src/api/types/criteria.ts.
 * templateId va roundId loai tru nhau: dung mot cai khac null.
 */
public record CriterionResponse(
        UUID id,
        UUID templateId,
        UUID roundId,
        String name,
        String description,
        BigDecimal weight,
        BigDecimal maxScore
) {
    public static CriterionResponse from(Criterion c) {
        return new CriterionResponse(
                c.getId(),
                c.getTemplate() == null ? null : c.getTemplate().getId(),
                c.getRoundId(),
                c.getName(),
                c.getDescription(),
                c.getWeight(),
                c.getMaxScore()
        );
    }
}
