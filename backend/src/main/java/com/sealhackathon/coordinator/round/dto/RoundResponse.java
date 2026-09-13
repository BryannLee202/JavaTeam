package com.sealhackathon.coordinator.round.dto;

import java.time.Instant;
import java.util.List;
import java.util.Set;

public record RoundResponse(
        Long id,
        Long eventId,
        String name,
        Integer order,
        Instant submissionDeadline,
        List<RoundCriterionResponse> criteria,
        PromotionRuleDto promotionRule,
        Set<Long> judgeIds
) {
}
