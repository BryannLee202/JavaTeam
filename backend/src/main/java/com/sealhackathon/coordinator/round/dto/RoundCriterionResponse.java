package com.sealhackathon.coordinator.round.dto;

public record RoundCriterionResponse(
        Long id,
        Long roundId,
        String name,
        Integer weight
) {
}
