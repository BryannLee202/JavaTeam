package com.sealhackathon.coordinator.round;

import com.sealhackathon.coordinator.round.dto.JudgeAssignmentRequest;
import com.sealhackathon.coordinator.round.dto.RoundRequest;
import com.sealhackathon.coordinator.round.dto.RoundResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coordinator/events/{eventId}/rounds")
@RequiredArgsConstructor
public class RoundController {

    private final RoundService roundService;

    @GetMapping
    public List<RoundResponse> list(@PathVariable Long eventId) {
        return roundService.listByEvent(eventId);
    }

    @GetMapping("/{roundId}")
    public RoundResponse getOne(@PathVariable Long eventId, @PathVariable Long roundId) {
        return roundService.getById(eventId, roundId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RoundResponse create(@PathVariable Long eventId, @Valid @RequestBody RoundRequest request) {
        return roundService.create(eventId, request);
    }

    @PatchMapping("/{roundId}")
    public RoundResponse update(@PathVariable Long eventId, @PathVariable Long roundId, @Valid @RequestBody RoundRequest request) {
        return roundService.update(eventId, roundId, request);
    }

    @DeleteMapping("/{roundId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long eventId, @PathVariable Long roundId) {
        roundService.delete(eventId, roundId);
    }

    @PostMapping("/{roundId}/judges")
    public RoundResponse assignJudge(@PathVariable Long eventId, @PathVariable Long roundId, @Valid @RequestBody JudgeAssignmentRequest request) {
        return roundService.assignJudge(eventId, roundId, request.judgeId());
    }

    @DeleteMapping("/{roundId}/judges/{judgeId}")
    public RoundResponse unassignJudge(@PathVariable Long eventId, @PathVariable Long roundId, @PathVariable Long judgeId) {
        return roundService.unassignJudge(eventId, roundId, judgeId);
    }
}
