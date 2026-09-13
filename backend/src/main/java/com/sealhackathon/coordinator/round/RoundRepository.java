package com.sealhackathon.coordinator.round;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoundRepository extends JpaRepository<Round, Long> {
    List<Round> findAllByEventIdOrderByOrderIndexAsc(Long eventId);

    Optional<Round> findByIdAndEventId(Long roundId, Long eventId);

    long countByEventId(Long eventId);

    boolean existsByEventIdAndOrderIndexAndIdNot(Long eventId, Integer orderIndex, Long excludingId);

    default boolean orderIndexTaken(Long eventId, Integer orderIndex) {
        return existsByEventIdAndOrderIndexAndIdNot(eventId, orderIndex, -1L);
    }
}
