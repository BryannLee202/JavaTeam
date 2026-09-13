package com.sealhackathon.coordinator.event.dto;

import com.sealhackathon.coordinator.event.EventStatus;
import jakarta.validation.constraints.NotNull;

public record EventStatusUpdateRequest(
        @NotNull(message = "Trạng thái không được để trống")
        EventStatus status
) {
}
