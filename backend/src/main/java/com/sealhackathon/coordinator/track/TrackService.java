package com.sealhackathon.coordinator.track;

import com.sealhackathon.coordinator.common.exception.ResourceNotFoundException;
import com.sealhackathon.coordinator.event.EventService;
import com.sealhackathon.coordinator.event.HackathonEvent;
import com.sealhackathon.coordinator.track.dto.TrackRequest;
import com.sealhackathon.coordinator.track.dto.TrackResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TrackService {

    private final TrackRepository trackRepository;
    private final EventService eventService;

    @Transactional(readOnly = true)
    public List<TrackResponse> listByEvent(Long eventId) {
        eventService.findEntity(eventId); // 404 sớm nếu sự kiện không tồn tại
        return trackRepository.findAllByEventIdOrderByIdAsc(eventId).stream().map(this::toResponse).toList();
    }

    public TrackResponse create(Long eventId, TrackRequest request) {
        HackathonEvent event = eventService.findEntity(eventId);
        Track track = new Track(event, request.name(), request.description(), request.mentorId());
        return toResponse(trackRepository.save(track));
    }

    public TrackResponse update(Long eventId, Long trackId, TrackRequest request) {
        Track track = findEntity(eventId, trackId);
        track.applyFields(request.name(), request.description(), request.mentorId());
        return toResponse(track);
    }

    public void delete(Long eventId, Long trackId) {
        Track track = findEntity(eventId, trackId);
        trackRepository.delete(track);
    }

    private Track findEntity(Long eventId, Long trackId) {
        return trackRepository.findByIdAndEventId(trackId, eventId)
                .orElseThrow(() -> ResourceNotFoundException.of("Hạng mục", trackId));
    }

    private TrackResponse toResponse(Track track) {
        return new TrackResponse(
                track.getId(),
                track.getEvent().getId(),
                track.getName(),
                track.getDescription(),
                track.getMentorId(),
                0L
        );
    }
}
