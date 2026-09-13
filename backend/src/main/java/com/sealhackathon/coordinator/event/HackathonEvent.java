package com.sealhackathon.coordinator.event;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;

/**
 * Sự kiện Hackathon (mùa giải). Đây là gốc của toàn bộ cấu trúc cuộc thi —
 * Track và Round đều tham chiếu tới HackathonEvent bằng eventId.
 *
 * criteriaTemplateId: khoá ngoại tới CriteriaTemplate — entity đó thuộc phạm vi BE-3.
 * Để không chặn tiến độ, ở đây chỉ lưu id thô (không @ManyToOne) cho tới khi
 * thống nhất xong với người làm BE-3; khi đó đổi sang @ManyToOne thật.
 */
@Entity
@Table(name = "hackathon_event")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class HackathonEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EventStatus status = EventStatus.DRAFT;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    /** FK sang CriteriaTemplate (BE-3) — xem javadoc lớp. Có thể null nếu sự kiện chưa chọn mẫu tiêu chí. */
    @Column(name = "criteria_template_id")
    private Long criteriaTemplateId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public HackathonEvent(String name, String description, LocalDate startDate, LocalDate endDate) {
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = EventStatus.DRAFT;
    }

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = Instant.now();
    }

    public void applyBasicFields(String name, String description, LocalDate startDate, LocalDate endDate) {
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}
