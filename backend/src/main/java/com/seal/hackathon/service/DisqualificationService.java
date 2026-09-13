package com.seal.hackathon.service;

import com.seal.hackathon.domain.entity.Disqualification;
import com.seal.hackathon.domain.entity.User;
import com.seal.hackathon.domain.enums.AuditAction;
import com.seal.hackathon.domain.enums.DisqualificationTargetType;
import com.seal.hackathon.dto.scoring.DisqualificationRequest;
import com.seal.hackathon.dto.scoring.DisqualificationResponse;
import com.seal.hackathon.exception.ApiException;
import com.seal.hackathon.repository.DisqualificationRepository;
import com.seal.hackathon.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/** Loai doi hoac loai bai nop, luon kem ly do va ghi vet nguoi quyet dinh. */
@Service
public class DisqualificationService {

    private final DisqualificationRepository disqualificationRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;

    public DisqualificationService(
            DisqualificationRepository disqualificationRepository,
            UserRepository userRepository,
            AuditService auditService
    ) {
        this.disqualificationRepository = disqualificationRepository;
        this.userRepository = userRepository;
        this.auditService = auditService;
    }

    @Transactional(readOnly = true)
    public List<DisqualificationResponse> listByEvent(UUID eventId) {
        return disqualificationRepository.findByEventIdOrderByDecidedAtDesc(eventId).stream()
                .map(DisqualificationResponse::from)
                .toList();
    }

    @Transactional
    public DisqualificationResponse disqualify(DisqualificationRequest request, UUID actorId) {
        UUID targetId = assertTargetMatchesType(request);

        User actor = userRepository.findById(actorId)
                .orElseThrow(() -> ApiException.notFound("Khong tim thay nguoi quyet dinh"));

        assertNotAlreadyDisqualified(request.targetType(), targetId);

        Disqualification decision = Disqualification.builder()
                .eventId(request.eventId())
                .targetType(request.targetType())
                .teamId(request.teamId())
                .submissionId(request.submissionId())
                .reason(request.reason().trim())
                .decidedBy(actor)
                .decidedAt(Instant.now())
                .revoked(false)
                .build();
        decision = disqualificationRepository.save(decision);

        AuditAction action = request.targetType() == DisqualificationTargetType.TEAM
                ? AuditAction.TEAM_DISQUALIFY
                : AuditAction.SUBMISSION_DISQUALIFY;
        auditService.record(actorId, action, request.targetType().name(), targetId, null, decision.getReason());

        return DisqualificationResponse.from(decision);
    }

    /** targetType = TEAM thi phai co dung teamId, = SUBMISSION thi phai co dung submissionId. */
    private UUID assertTargetMatchesType(DisqualificationRequest request) {
        boolean isTeam = request.targetType() == DisqualificationTargetType.TEAM;
        UUID expected = isTeam ? request.teamId() : request.submissionId();
        UUID unexpected = isTeam ? request.submissionId() : request.teamId();
        String expectedField = isTeam ? "teamId" : "submissionId";
        String unexpectedField = isTeam ? "submissionId" : "teamId";

        if (expected == null) {
            throw ApiException.badRequest(
                    "Loai doi tuong la " + request.targetType() + " nen bat buoc phai co " + expectedField);
        }
        if (unexpected != null) {
            throw ApiException.badRequest(
                    "Loai doi tuong la " + request.targetType() + " thi khong duoc gui kem " + unexpectedField);
        }
        return expected;
    }

    private void assertNotAlreadyDisqualified(DisqualificationTargetType type, UUID targetId) {
        boolean already = type == DisqualificationTargetType.TEAM
                ? disqualificationRepository.existsByTeamIdAndRevokedFalse(targetId)
                : disqualificationRepository.existsBySubmissionIdAndRevokedFalse(targetId);
        if (already) {
            throw ApiException.conflict("Doi tuong nay da bi loai truoc do roi");
        }
    }
}
