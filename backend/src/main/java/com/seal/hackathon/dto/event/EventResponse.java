package com.seal.hackathon.dto.event;

import com.seal.hackathon.domain.enums.EventStatus;

import java.time.LocalDate;
import java.util.UUID;

public record EventResponse(
        UUID id,
        String name,
        String description,
        LocalDate startDate,
        LocalDate endDate,
        EventStatus status,
        UUID baseCriteriaTemplateId,
        boolean rblEnabled
) {
}
