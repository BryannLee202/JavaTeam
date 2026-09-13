package com.sealhackathon.coordinator.track;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TrackRepository extends JpaRepository<Track, Long> {
    List<Track> findAllByEventIdOrderByIdAsc(Long eventId);

    Optional<Track> findByIdAndEventId(Long trackId, Long eventId);

    long countByEventId(Long eventId);
}
