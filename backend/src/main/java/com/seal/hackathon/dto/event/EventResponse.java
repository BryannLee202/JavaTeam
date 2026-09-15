package com.seal.hackathon.dto.event;

import com.seal.hackathon.domain.entity.HackathonEvent;
import com.seal.hackathon.domain.enums.EventStatus;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Dữ liệu một sự kiện trả về cho frontend.
 *
 * Ba trường đếm (trackCount / roundCount / teamCount) không nằm trên entity mà
 * do {@code EventService} truy vấn rồi truyền vào. Màn "Quản lý cuộc thi" hiện
 * chúng thành ba ô số liệu, nên nếu thiếu thì ba ô đó rỗng.
 */
public record EventResponse(
        UUID id,
        String name,
        String description,
        LocalDate startDate,
        LocalDate endDate,
        EventStatus status,
        UUID baseCriteriaTemplateId,
        boolean rblEnabled,
        long trackCount,
        long roundCount,
        long teamCount,
        Instant createdAt,
        Instant updatedAt
) {
    /**
     * Dùng khi chưa cần số liệu đếm — ba trường đếm trả về 0.
     *
     * Giữ lại để các chỗ gọi cũ (tạo mới, cập nhật, đổi trạng thái) không phải
     * chạy thêm ba câu đếm cho một sự kiện vừa mới thay đổi.
     */
    public static EventResponse from(HackathonEvent event) {
        return withCounts(event, 0, 0, 0);
    }

    public static EventResponse withCounts(HackathonEvent event, long trackCount, long roundCount, long teamCount) {
        return new EventResponse(
                event.getId(),
                event.getName(),
                event.getDescription(),
                event.getStartDate(),
                event.getEndDate(),
                event.getStatus(),
                event.getBaseCriteriaTemplate() == null ? null : event.getBaseCriteriaTemplate().getId(),
                event.isRblEnabled(),
                trackCount,
                roundCount,
                teamCount,
                event.getCreatedAt(),
                event.getUpdatedAt()
        );
    }
}
