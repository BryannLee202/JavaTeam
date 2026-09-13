package com.seal.hackathon.controller;

import com.seal.hackathon.dto.criteria.CriterionRequest;
import com.seal.hackathon.dto.criteria.CriterionResponse;
import com.seal.hackathon.service.RoundCriterionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/rounds/{roundId}/criteria")
public class RoundCriterionController {

    private final RoundCriterionService roundCriterionService;

    public RoundCriterionController(RoundCriterionService roundCriterionService) {
        this.roundCriterionService = roundCriterionService;
    }

    /** Giam khao cung phai doc duoc tieu chi de cham, nen khong gioi han COORDINATOR. */
    @GetMapping
    public List<CriterionResponse> list(@PathVariable UUID roundId) {
        return roundCriterionService.list(roundId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('COORDINATOR')")
    public CriterionResponse add(@PathVariable UUID roundId, @Valid @RequestBody CriterionRequest request) {
        return roundCriterionService.add(roundId, request);
    }

    @PutMapping("/{criterionId}")
    @PreAuthorize("hasRole('COORDINATOR')")
    public CriterionResponse update(
            @PathVariable UUID roundId,
            @PathVariable UUID criterionId,
            @Valid @RequestBody CriterionRequest request
    ) {
        return roundCriterionService.update(roundId, criterionId, request);
    }

    @DeleteMapping("/{criterionId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('COORDINATOR')")
    public void remove(@PathVariable UUID roundId, @PathVariable UUID criterionId) {
        roundCriterionService.remove(roundId, criterionId);
    }
}
