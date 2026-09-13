package com.sealhackathon.coordinator.round.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

/**
 * Không có trường thứ tự — frontend không gửi orderIndex cho tiêu chí; server
 * tự đánh số theo vị trí trong mảng `criteria` gửi lên (xem RoundService).
 */
public record RoundCriterionRequest(
        @NotBlank(message = "Tên tiêu chí không được để trống")
        String name,

        @Min(value = 0, message = "Trọng số tối thiểu 0")
        @Max(value = 100, message = "Trọng số tối đa 100")
        Integer weight
) {
}
