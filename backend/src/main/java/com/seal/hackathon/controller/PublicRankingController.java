package com.seal.hackathon.controller;

import com.seal.hackathon.domain.enums.EventStatus;
import com.seal.hackathon.dto.event.EventResponse;
import com.seal.hackathon.dto.event.RoundResponse;
import com.seal.hackathon.dto.scoring.RankingResponse;
import com.seal.hackathon.service.EventService;
import com.seal.hackathon.service.RankingService;
import com.seal.hackathon.service.RoundService;
import com.seal.hackathon.exception.ApiException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;

import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/public/rankings")
public class PublicRankingController {

    private final EventService eventService;
    private final RoundService roundService;
    private final RankingService rankingService;

    public PublicRankingController(
            EventService eventService,
            RoundService roundService,
            RankingService rankingService
    ) {
        this.eventService = eventService;
        this.roundService = roundService;
        this.rankingService = rankingService;
    }

    /** Danh sach su kien dang dien ra hoac da ket thuc — khach xem duoc. */
    @GetMapping("/events")
    public List<EventResponse> publicEvents() {
        return eventService.list().stream()
                .filter(e -> e.status() != EventStatus.DRAFT && e.status() != EventStatus.CANCELLED)
                .collect(Collectors.toList());
    }

    /** Cac vong cua mot su kien. */
    @GetMapping("/events/{eventId}/rounds")
    public List<RoundResponse> publicRounds(@PathVariable UUID eventId) {
        return roundService.listByEvent(eventId);
    }

    /**
     * Bang xep hang cua mot vong.
     * CHI tra ve khi round.results_published = true — chua cong bo thi khong lo diem.
     */
    @GetMapping("/rounds/{roundId}")
    public List<RankingResponse> publicRankings(@PathVariable UUID roundId) {
        RoundResponse round = roundService.get(roundId);
        if (!round.resultsPublished()) {
            return Collections.emptyList();
        }
        return rankingService.listByRound(roundId);
    }

    @GetMapping(value = "/rounds/{roundId}/export", produces = "text/csv; charset=UTF-8")
    public ResponseEntity<byte[]> publicExportCsv(@PathVariable UUID roundId) {
        RoundResponse round = roundService.get(roundId);
        if (!round.resultsPublished()) {
            throw ApiException.forbidden("Bảng xếp hạng chưa được công bố");
        }
        String csv = rankingService.exportCsvByRound(roundId);
        byte[] bytes = csv.getBytes(StandardCharsets.UTF_8);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"rankings_" + roundId + ".csv\"")
                .header(HttpHeaders.CONTENT_TYPE, "text/csv; charset=UTF-8")
                .body(bytes);
    }
}
