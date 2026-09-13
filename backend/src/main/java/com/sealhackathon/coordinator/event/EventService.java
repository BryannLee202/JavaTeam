package com.sealhackathon.coordinator.event;

import com.sealhackathon.coordinator.common.exception.InvalidStateTransitionException;
import com.sealhackathon.coordinator.common.exception.ResourceNotFoundException;
import com.sealhackathon.coordinator.event.dto.EventRequest;
import com.sealhackathon.coordinator.event.dto.EventResponse;
import com.sealhackathon.coordinator.round.RoundRepository;
import com.sealhackathon.coordinator.track.TrackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class EventService {

    private final EventRepository eventRepository;
    // Chỉ cần Repository (không cần Service) để đếm số lượng — tránh phụ thuộc chéo giữa các module.
    private final TrackRepository trackRepository;
    private final RoundRepository roundRepository;

    @Transactional(readOnly = true)
    public List<EventResponse> list() {
        return eventRepository.findAllByOrderByCreatedAtDesc().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public EventResponse getById(Long eventId) {
        return toResponse(findEntity(eventId));
    }

    public EventResponse create(EventRequest request) {
        validateDateRange(request);
        HackathonEvent event = new HackathonEvent(request.name(), request.description(), request.startDate(), request.endDate());
        event.setCriteriaTemplateId(request.criteriaTemplateId());
        return toResponse(eventRepository.save(event));
    }

    public EventResponse update(Long eventId, EventRequest request) {
        validateDateRange(request);
        HackathonEvent event = findEntity(eventId);
        event.applyBasicFields(request.name(), request.description(), request.startDate(), request.endDate());
        event.setCriteriaTemplateId(request.criteriaTemplateId());
        return toResponse(event);
    }

    public void delete(Long eventId) {
        HackathonEvent event = findEntity(eventId);
        eventRepository.delete(event);
    }

    /** Áp dụng vòng đời EventStatus: draft→published/cancelled, published→ongoing/cancelled, ongoing→completed/cancelled. */
    public EventResponse changeStatus(Long eventId, EventStatus targetStatus) {
        HackathonEvent event = findEntity(eventId);
        EventStatus current = event.getStatus();

        if (current == targetStatus) {
            return toResponse(event);
        }
        if (!current.canTransitionTo(targetStatus)) {
            throw new InvalidStateTransitionException(
                    "Không thể chuyển sự kiện từ trạng thái '%s' sang '%s'.".formatted(current.toJson(), targetStatus.toJson())
            );
        }
        event.setStatus(targetStatus);
        return toResponse(event);
    }

    private void validateDateRange(EventRequest request) {
        if (request.endDate().isBefore(request.startDate())) {
            throw new IllegalArgumentException("Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.");
        }
    }

    public HackathonEvent findEntity(Long eventId) {
        return eventRepository.findById(eventId)
                .orElseThrow(() -> ResourceNotFoundException.of("Sự kiện", eventId));
    }

    private EventResponse toResponse(HackathonEvent event) {
        long trackCount = trackRepository.countByEventId(event.getId());
        long roundCount = roundRepository.countByEventId(event.getId());
        return new EventResponse(
                event.getId(),
                event.getName(),
                event.getDescription(),
                event.getStatus(),
                event.getStartDate(),
                event.getEndDate(),
                event.getCriteriaTemplateId(),
                trackCount,
                roundCount,
                0L,
                event.getCreatedAt(),
                event.getUpdatedAt()
        );
    }
}
