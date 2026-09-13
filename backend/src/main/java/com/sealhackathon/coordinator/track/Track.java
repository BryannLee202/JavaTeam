package com.sealhackathon.coordinator.track;

import com.sealhackathon.coordinator.event.HackathonEvent;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Hạng mục (danh mục thi đấu) trong một sự kiện. Đội thi đăng ký vào một Track cụ thể.
 * mentorId: tham chiếu tới Mentor — domain Mentor không thuộc phạm vi P3 nên chỉ lưu id thô,
 * gán/gỡ mentor thực hiện qua endpoint update Track (PATCH mentorId = null để gỡ).
 */
@Entity
@Table(name = "track")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Track {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "event_id", nullable = false)
    private HackathonEvent event;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(name = "mentor_id")
    private Long mentorId;

    public Track(HackathonEvent event, String name, String description, Long mentorId) {
        this.event = event;
        this.name = name;
        this.description = description;
        this.mentorId = mentorId;
    }

    public void applyFields(String name, String description, Long mentorId) {
        this.name = name;
        this.description = description;
        this.mentorId = mentorId;
    }
}
