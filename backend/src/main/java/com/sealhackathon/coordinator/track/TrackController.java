package com.sealhackathon.coordinator.track;

import com.sealhackathon.coordinator.track.dto.TrackRequest;
import com.sealhackathon.coordinator.track.dto.TrackResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coordinator/events/{eventId}/tracks")
@RequiredArgsConstructor
public class TrackController {

    private final TrackService trackService;

    @GetMapping
    public List<TrackResponse> list(@PathVariable Long eventId) {
        return trackService.listByEvent(eventId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TrackResponse create(@PathVariable Long eventId, @Valid @RequestBody TrackRequest request) {
        return trackService.create(eventId, request);
    }

    @PatchMapping("/{trackId}")
    public TrackResponse update(@PathVariable Long eventId, @PathVariable Long trackId, @Valid @RequestBody TrackRequest request) {
        return trackService.update(eventId, trackId, request);
    }

    @DeleteMapping("/{trackId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long eventId, @PathVariable Long trackId) {
        trackService.delete(eventId, trackId);
    }
}
