package com.sealhackathon.coordinator.round;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoundCriterionRepository extends JpaRepository<RoundCriterion, Long> {
    List<RoundCriterion> findAllByRoundIdOrderByOrderIndexAsc(Long roundId);

    Optional<RoundCriterion> findByIdAndRoundId(Long criterionId, Long roundId);
}
