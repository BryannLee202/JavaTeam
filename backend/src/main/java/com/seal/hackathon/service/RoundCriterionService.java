package com.seal.hackathon.service;

import com.seal.hackathon.domain.entity.Criterion;
import com.seal.hackathon.dto.criteria.CriterionRequest;
import com.seal.hackathon.dto.criteria.CriterionResponse;
import com.seal.hackathon.exception.ApiException;
import com.seal.hackathon.repository.CriterionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/** Tieu chi cham cua rieng mot vong thi. */
@Service
public class RoundCriterionService {

    private final CriterionRepository criterionRepository;
    private final CriterionWeightPolicy weightPolicy;
    private final RoundScoreGuard scoreGuard;

    public RoundCriterionService(
            CriterionRepository criterionRepository,
            CriterionWeightPolicy weightPolicy,
            RoundScoreGuard scoreGuard
    ) {
        this.criterionRepository = criterionRepository;
        this.weightPolicy = weightPolicy;
        this.scoreGuard = scoreGuard;
    }

    @Transactional(readOnly = true)
    public List<CriterionResponse> list(UUID roundId) {
        return criterionRepository.findByRoundId(roundId).stream()
                .map(CriterionResponse::from)
                .toList();
    }

    @Transactional
    public CriterionResponse add(UUID roundId, CriterionRequest request) {
        assertNotScoredYet(roundId);
        weightPolicy.assertFits(criterionRepository.findByRoundId(roundId), null, request.weight());

        Criterion criterion = Criterion.builder()
                .roundId(roundId)
                .name(request.name())
                .description(request.description())
                .weight(request.weight())
                .maxScore(request.maxScore())
                .build();
        return CriterionResponse.from(criterionRepository.save(criterion));
    }

    @Transactional
    public CriterionResponse update(UUID roundId, UUID criterionId, CriterionRequest request) {
        assertNotScoredYet(roundId);
        Criterion criterion = findInRoundOrThrow(roundId, criterionId);
        weightPolicy.assertFits(criterionRepository.findByRoundId(roundId), criterionId, request.weight());

        criterion.setName(request.name());
        criterion.setDescription(request.description());
        criterion.setWeight(request.weight());
        criterion.setMaxScore(request.maxScore());
        return CriterionResponse.from(criterionRepository.save(criterion));
    }

    @Transactional
    public void remove(UUID roundId, UUID criterionId) {
        assertNotScoredYet(roundId);
        criterionRepository.delete(findInRoundOrThrow(roundId, criterionId));
    }

    private Criterion findInRoundOrThrow(UUID roundId, UUID criterionId) {
        Criterion criterion = criterionRepository.findById(criterionId)
                .orElseThrow(() -> ApiException.notFound("Khong tim thay tieu chi"));
        if (!roundId.equals(criterion.getRoundId())) {
            throw ApiException.badRequest("Tieu chi nay khong thuoc vong thi da chon");
        }
        return criterion;
    }

    /** Sua tieu chi sau khi da cham diem se lam sai het diem da ghi, nen chan lai. */
    private void assertNotScoredYet(UUID roundId) {
        if (scoreGuard.hasScores(roundId)) {
            throw ApiException.conflict(
                    "Khong the thay doi tieu chi sau khi vong thi da co diem duoc ghi nhan");
        }
    }
}
