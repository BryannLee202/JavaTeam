package com.seal.hackathon.service;

import com.seal.hackathon.domain.entity.Vote;
import com.seal.hackathon.domain.enums.AuditAction;
import com.seal.hackathon.dto.event.EventResponse;
import com.seal.hackathon.dto.event.TrackResponse;
import com.seal.hackathon.dto.vote.CastVoteRequest;
import com.seal.hackathon.dto.vote.PublicTeamResponse;
import com.seal.hackathon.dto.vote.TeamVoteTallyResponse;
import com.seal.hackathon.dto.vote.VoteCastResponse;
import com.seal.hackathon.exception.ApiException;
import com.seal.hackathon.repository.VoteRepository;
import com.seal.hackathon.security.JwtService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Comparator;
import java.util.HexFormat;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PublicVotingService {

    private static final long IP_VOTE_CAP_PER_TRACK = 20;

    private final VoteRepository voteRepository;
    private final JwtService jwtService;
    private final AuditService auditService;
    private final PublicVotingDataProvider dataProvider;

    public PublicVotingService(
            VoteRepository voteRepository,
            JwtService jwtService,
            AuditService auditService,
            PublicVotingDataProvider dataProvider
    ) {
        this.voteRepository = voteRepository;
        this.jwtService = jwtService;
        this.auditService = auditService;
        this.dataProvider = dataProvider;
    }

    @Transactional(readOnly = true)
    public List<EventResponse> listVotableEvents() {
        return dataProvider.listVotableEvents();
    }

    @Transactional(readOnly = true)
    public List<TrackResponse> listTracks(UUID eventId) {
        return dataProvider.listTracks(eventId);
    }

    @Transactional(readOnly = true)
    public List<PublicTeamResponse> listTeams(UUID trackId) {
        return dataProvider.listTeams(trackId);
    }

    @Transactional(readOnly = true)
    public List<TeamVoteTallyResponse> tallyByTrack(UUID trackId) {
        List<VoteRepository.TeamVoteCount> tallies = voteRepository.countGroupedByTeamForTrack(trackId);
        List<PublicTeamResponse> teams = dataProvider.listTeams(trackId);

        if (!teams.isEmpty()) {
            Map<UUID, Long> counts = tallies.stream()
                    .collect(Collectors.toMap(VoteRepository.TeamVoteCount::getTeamId, VoteRepository.TeamVoteCount::getVoteCount));
            return teams.stream()
                    .map(t -> new TeamVoteTallyResponse(t.id(), t.name(), counts.getOrDefault(t.id(), 0L)))
                    .sorted(Comparator.comparingLong(TeamVoteTallyResponse::voteCount).reversed())
                    .collect(Collectors.toList());
        }

        return tallies.stream()
                .map(item -> new TeamVoteTallyResponse(
                        item.getTeamId(),
                        dataProvider.getTeamName(item.getTeamId()),
                        item.getVoteCount() != null ? item.getVoteCount() : 0L
                ))
                .sorted(Comparator.comparingLong(TeamVoteTallyResponse::voteCount).reversed())
                .collect(Collectors.toList());
    }

    @Transactional
    public VoteCastResponse castVote(UUID trackId, CastVoteRequest request, String incomingVoterToken, String clientIp) {
        if (trackId == null) {
            throw ApiException.badRequest("Mã Hạng mục không được để trống");
        }
        if (request == null || request.teamId() == null) {
            throw ApiException.badRequest("Mã đội thi không được để trống");
        }

        UUID voterId = jwtService.resolveOrCreateVoterId(incomingVoterToken);
        String voterToken = jwtService.generateVoterToken(voterId);
        String voterIdHash = sha256Hex(voterId.toString());
        String ipHash = sha256Hex(clientIp == null ? "unknown" : clientIp);

        if (voteRepository.existsByTrackIdAndVoterIdHash(trackId, voterIdHash)) {
            throw ApiException.conflict("Bạn đã bình chọn cho Hạng mục này rồi");
        }
        if (voteRepository.countByTrackIdAndIpHash(trackId, ipHash) >= IP_VOTE_CAP_PER_TRACK) {
            throw ApiException.conflict("Đã đạt giới hạn số lượt bình chọn từ mạng này cho Hạng mục này");
        }

        try {
            voteRepository.save(Vote.builder()
                    .teamId(request.teamId())
                    .trackId(trackId)
                    .voterIdHash(voterIdHash)
                    .ipHash(ipHash)
                    .build());
        } catch (DataIntegrityViolationException raceLoser) {
            throw ApiException.conflict("Bạn đã bình chọn cho Hạng mục này rồi");
        }

        auditService.record(null, AuditAction.VOTE_CAST, "Team", request.teamId(), null, trackId);
        long teamVoteCount = voteRepository.countByTeamId(request.teamId());
        return new VoteCastResponse(request.teamId(), teamVoteCount, voterToken);
    }

    private String sha256Hex(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(value.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }
}
