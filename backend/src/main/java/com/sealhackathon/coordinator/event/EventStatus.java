package com.sealhackathon.coordinator.event;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.List;
import java.util.Set;

/**
 * Vòng đời của một HackathonEvent.
 * Serialize/deserialize dạng chữ thường (draft, published, ongoing, completed, cancelled)
 * để khớp đúng hợp đồng dữ liệu phía frontend (src/types/index.ts:EventStatus).
 */
public enum EventStatus {
    DRAFT,
    PUBLISHED,
    ONGOING,
    COMPLETED,
    CANCELLED;

    /** Các trạng thái được phép chuyển tới TỪ trạng thái hiện tại — mirror của EVENT_STATUS_TRANSITIONS bên frontend. */
    public List<EventStatus> allowedNextStatuses() {
        return switch (this) {
            case DRAFT -> List.of(PUBLISHED, CANCELLED);
            case PUBLISHED -> List.of(ONGOING, CANCELLED);
            case ONGOING -> List.of(COMPLETED, CANCELLED);
            case COMPLETED, CANCELLED -> List.of();
        };
    }

    public boolean canTransitionTo(EventStatus target) {
        return allowedNextStatuses().contains(target);
    }

    private static final Set<EventStatus> TERMINAL = Set.of(COMPLETED, CANCELLED);

    public boolean isTerminal() {
        return TERMINAL.contains(this);
    }

    @JsonValue
    public String toJson() {
        return name().toLowerCase();
    }

    @JsonCreator
    public static EventStatus fromJson(String value) {
        return EventStatus.valueOf(value.trim().toUpperCase());
    }
}
