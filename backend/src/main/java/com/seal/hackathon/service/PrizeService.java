package com.seal.hackathon.service;

import com.seal.hackathon.domain.entity.Prize;
import com.seal.hackathon.domain.enums.AuditAction;
import com.seal.hackathon.dto.prize.PrizeRequest;
import com.seal.hackathon.dto.prize.PrizeResponse;
import com.seal.hackathon.exception.ApiException;
import com.seal.hackathon.repository.PrizeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/** Giai thuong theo hang va theo hang muc, co the thu hoi. */
@Service
public class PrizeService {

    private final PrizeRepository prizeRepository;
    private final AuditService auditService;

    public PrizeService(PrizeRepository prizeRepository, AuditService auditService) {
        this.prizeRepository = prizeRepository;
        this.auditService = auditService;
    }

    @Transactional(readOnly = true)
    public List<PrizeResponse> listByEvent(UUID eventId) {
        return prizeRepository.findByEventId(eventId).stream()
                .map(PrizeResponse::from)
                .toList();
    }

    @Transactional
    public PrizeResponse create(UUID eventId, PrizeRequest request) {
        Prize prize = Prize.builder()
                .eventId(eventId)
                .trackId(request.trackId())
                .name(request.name())
                .rankCondition(request.rankCondition())
                .revoked(false)
                .build();
        return PrizeResponse.from(prizeRepository.save(prize));
    }

    @Transactional
    public PrizeResponse revoke(UUID prizeId, UUID actorId) {
        Prize prize = prizeRepository.findById(prizeId)
                .orElseThrow(() -> ApiException.notFound("Khong tim thay giai thuong"));
        if (prize.isRevoked()) {
            throw ApiException.conflict("Giai thuong nay da bi thu hoi truoc do");
        }
        prize.setRevoked(true);
        prize = prizeRepository.save(prize);

        auditService.record(actorId, AuditAction.PRIZE_AWARD, "Prize", prizeId, "awarded", "revoked");
        return PrizeResponse.from(prize);
    }

    /**
     * Tu dong trao giai theo bang xep hang cua vong chung ket.
     *
     * Chua lam duoc: can entity Ranking cua BE-5, hien chua co tren main. Tra 409 kem
     * thong bao ro thay vi 404, de giao dien PrizesTab hien duoc ly do that cho nguoi dung.
     * Khi BE-5 len, thay than ham nay bang vong lap doc RankingRepository
     * (xem ban tham chieu o nhanh main-backup: service/PrizeService.java).
     */
    @Transactional(readOnly = true)
    public List<PrizeResponse> autoAssign(UUID eventId, UUID finalRoundId) {
        throw ApiException.conflict(
                "Chua tu dong trao giai duoc vi he thong chua co bang xep hang. "
                        + "Phan nay phu thuoc task BE-5 (cham diem va xep hang). "
                        + "Tam thoi hay gan giai thu cong.");
    }
}
