package com.sealhackathon.coordinator.stub;

import com.sealhackathon.coordinator.event.EventService;
import com.sealhackathon.coordinator.round.Round;
import com.sealhackathon.coordinator.round.RoundRepository;
import com.sealhackathon.coordinator.track.Track;
import com.sealhackathon.coordinator.track.TrackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * TẠM THỜI — ghép dữ liệu Track.mentorId / Round.judgeIds (đã có thật) thành
 * hình dạng mà tab "Giám khảo & Mentor" mong đợi. Vì domain Mentor/Judge chưa
 * tồn tại, tên hiển thị chỉ là placeholder ("Mentor #<id>", "Giám khảo #<id>")
 * — thay bằng lookup thật khi module đó xong.
 */
@RestController
@RequestMapping("/api/coordinator/events/{eventId}/assignments")
@RequiredArgsConstructor
public class AssignmentStubController {

    private final EventService eventService;
    private final TrackRepository trackRepository;
    private final RoundRepository roundRepository;

    @GetMapping
    public Map<String, Object> getAssignments(@PathVariable Long eventId) {
        eventService.findEntity(eventId);

        List<Track> tracks = trackRepository.findAllByEventIdOrderByIdAsc(eventId);
        List<Round> rounds = roundRepository.findAllByEventIdOrderByOrderIndexAsc(eventId);

        List<Map<String, Object>> trackAssignments = tracks.stream()
                .map(t -> {
                    Map<String, Object> mentor = t.getMentorId() == null ? null : Map.of(
                            "id", t.getMentorId(),
                            "name", "Mentor #" + t.getMentorId(),
                            "email", ""
                    );
                    Map<String, Object> row = new java.util.HashMap<>();
                    row.put("trackId", t.getId());
                    row.put("trackName", t.getName());
                    row.put("mentor", mentor);
                    return row;
                })
                .toList();

        List<Map<String, Object>> roundAssignments = rounds.stream()
                .map(r -> Map.<String, Object>of(
                        "roundId", r.getId(),
                        "roundName", r.getName(),
                        "judges", r.getJudgeIds().stream()
                                .map(id -> Map.of("id", id, "name", "Giám khảo #" + id, "type", "internal", "email", ""))
                                .toList()
                ))
                .toList();

        return Map.of("eventId", eventId, "tracks", trackAssignments, "rounds", roundAssignments);
    }
}
