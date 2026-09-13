package com.sealhackathon.coordinator.event;

import com.sealhackathon.coordinator.event.dto.EventRequest;
import com.sealhackathon.coordinator.event.dto.EventResponse;
import com.sealhackathon.coordinator.event.dto.EventStatusUpdateRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coordinator/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    public List<EventResponse> list() {
        return eventService.list();
    }

    @GetMapping("/{eventId}")
    public EventResponse getOne(@PathVariable Long eventId) {
        return eventService.getById(eventId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EventResponse create(@Valid @RequestBody EventRequest request) {
        return eventService.create(request);
    }

    @PatchMapping("/{eventId}")
    public EventResponse update(@PathVariable Long eventId, @Valid @RequestBody EventRequest request) {
        return eventService.update(eventId, request);
    }

    @DeleteMapping("/{eventId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long eventId) {
        eventService.delete(eventId);
    }

    @PatchMapping("/{eventId}/status")
    public EventResponse changeStatus(@PathVariable Long eventId, @Valid @RequestBody EventStatusUpdateRequest request) {
        return eventService.changeStatus(eventId, request.status());
    }
}
