package com.sealhackathon.coordinator.round.dto;

import jakarta.validation.constraints.NotNull;

public record JudgeAssignmentRequest(
        @NotNull(message = "judgeId không được để trống")
        Long judgeId
) {
}
