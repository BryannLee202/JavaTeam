package com.sealhackathon.coordinator.round;

import com.sealhackathon.coordinator.round.dto.RoundCriterionRequest;
import com.sealhackathon.coordinator.round.dto.RoundCriterionResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coordinator/events/{eventId}/rounds/{roundId}/criteria")
@RequiredArgsConstructor
public class RoundCriterionController {

    private final RoundCriterionService criterionService;

    @GetMapping
    public List<RoundCriterionResponse> list(@PathVariable Long eventId, @PathVariable Long roundId) {
        return criterionService.list(eventId, roundId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RoundCriterionResponse add(@PathVariable Long eventId, @PathVariable Long roundId, @Valid @RequestBody RoundCriterionRequest request) {
        return criterionService.add(eventId, roundId, request);
    }

    @PatchMapping("/{criterionId}")
    public RoundCriterionResponse update(
            @PathVariable Long eventId,
            @PathVariable Long roundId,
            @PathVariable Long criterionId,
            @Valid @RequestBody RoundCriterionRequest request
    ) {
        return criterionService.update(eventId, roundId, criterionId, request);
    }

    @DeleteMapping("/{criterionId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long eventId, @PathVariable Long roundId, @PathVariable Long criterionId) {
        criterionService.delete(eventId, roundId, criterionId);
    }
}
