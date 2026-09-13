package com.sealhackathon.coordinator.round.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;
import java.util.List;

/**
 * Tên trường khớp 1:1 với frontend (src/types/index.ts): 'order' (không phải
 * orderIndex) và 'promotionRule' lồng nhau (không phải topNPerTrack phẳng) —
 * quyết định cuối: backend đổi theo frontend thay vì ngược lại, để khỏi phải
 * sửa lại UI đã có.
 */
public record RoundRequest(
        @NotBlank(message = "Tên vòng thi không được để trống")
        String name,

        @NotNull(message = "order không được để trống")
        @Min(value = 1, message = "order phải >= 1")
        Integer order,

        @NotNull(message = "Hạn nộp bài không được để trống")
        Instant submissionDeadline,

        @NotEmpty(message = "Vòng thi cần ít nhất một tiêu chí chấm điểm")
        @Valid
        List<RoundCriterionRequest> criteria,

        @NotNull(message = "promotionRule không được để trống")
        @Valid
        PromotionRuleDto promotionRule
) {
}
