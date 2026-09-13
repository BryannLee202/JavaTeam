package com.seal.hackathon.controller;

import com.seal.hackathon.dto.prize.PrizeRequest;
import com.seal.hackathon.dto.prize.PrizeResponse;
import com.seal.hackathon.security.AuthenticatedPrincipal;
import com.seal.hackathon.service.PrizeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@PreAuthorize("hasRole('COORDINATOR')")
public class PrizeController {

    private final PrizeService prizeService;

    public PrizeController(PrizeService prizeService) {
        this.prizeService = prizeService;
    }

    @GetMapping("/api/events/{eventId}/prizes")
    public List<PrizeResponse> list(@PathVariable UUID eventId) {
        return prizeService.listByEvent(eventId);
    }

    @PostMapping("/api/events/{eventId}/prizes")
    @ResponseStatus(HttpStatus.CREATED)
    public PrizeResponse create(@PathVariable UUID eventId, @Valid @RequestBody PrizeRequest request) {
        return prizeService.create(eventId, request);
    }

    @PostMapping("/api/events/{eventId}/prizes/auto-assign")
    public List<PrizeResponse> autoAssign(
            @PathVariable UUID eventId,
            @RequestParam UUID finalRoundId
    ) {
        return prizeService.autoAssign(eventId, finalRoundId);
    }

    @PostMapping("/api/prizes/{prizeId}/revoke")
    public PrizeResponse revoke(
            @PathVariable UUID prizeId,
            @AuthenticationPrincipal AuthenticatedPrincipal principal
    ) {
        return prizeService.revoke(prizeId, principal.userId());
    }
}
