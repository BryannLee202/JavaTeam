package com.sealhackathon.coordinator.round.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record PromotionRuleDto(
        @NotNull(message = "topNPerTrack không được để trống")
        @Min(value = 1, message = "topNPerTrack phải >= 1")
        Integer topNPerTrack
) {
}
