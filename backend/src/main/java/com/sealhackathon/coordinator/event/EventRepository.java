package com.sealhackathon.coordinator.event;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRepository extends JpaRepository<HackathonEvent, Long> {
    List<HackathonEvent> findAllByOrderByCreatedAtDesc();
}
