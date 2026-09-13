package com.seal.hackathon.repository;

import com.seal.hackathon.domain.entity.Disqualification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface DisqualificationRepository extends JpaRepository<Disqualification, UUID> {

    List<Disqualification> findByEventIdOrderByDecidedAtDesc(UUID eventId);

    boolean existsByTeamIdAndRevokedFalse(UUID teamId);

    boolean existsBySubmissionIdAndRevokedFalse(UUID submissionId);
}
