package com.sealhackathon.coordinator.event.dto;

import com.sealhackathon.coordinator.event.EventStatus;

import java.time.Instant;
import java.time.LocalDate;

public record EventResponse(
        Long id,
        String name,
        String description,
        EventStatus status,
        LocalDate startDate,
        LocalDate endDate,
        Long criteriaTemplateId,
        long trackCount,
        long roundCount,
        // Team domain thuộc module khác (Team/Submission) — để 0 cho tới khi service đó tồn tại
        // và có thể inject qua một TeamCountProvider (không tạo phụ thuộc cứng tới module Team ở đây).
        long teamCount,
        Instant createdAt,
        Instant updatedAt
) {
}
