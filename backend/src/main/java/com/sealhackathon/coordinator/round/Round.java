package com.sealhackathon.coordinator.round;

import com.sealhackathon.coordinator.event.HackathonEvent;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Vòng thi (một giai đoạn trong sự kiện, ví dụ Vòng loại → Vòng chung kết).
 *
 * Quyết định đặt tên trường: frontend hiện có hai tên khác nhau cho cùng khái niệm
 * "thứ tự" — Round dùng 'order', mảng tiêu chí dùng 'orderIndex' — nên cần một lớp
 * P6TabAdapter để hoà giải. Ở backend, TA CHỌN THỐNG NHẤT 'orderIndex' cho cả hai
 * (Round VÀ RoundCriterion) để phía frontend có thể bỏ lớp adapter đó sau khi đổi
 * Round.order → Round.orderIndex.
 */
@Entity
@Table(name = "round")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Round {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "event_id", nullable = false)
    private HackathonEvent event;

    @Column(nullable = false, length = 150)
    private String name;

    /** Thứ tự vòng thi trong sự kiện (1 = vòng đầu tiên). Tên trường thống nhất — xem javadoc lớp. */
    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;

    @Column(name = "submission_deadline", nullable = false)
    private Instant submissionDeadline;

    /** Quy tắc thăng vòng: top N đội mỗi hạng mục được vào vòng tiếp theo. */
    @Column(name = "top_n_per_track", nullable = false)
    private Integer topNPerTrack;

    @OneToMany(mappedBy = "round", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orderIndex ASC")
    private List<RoundCriterion> criteria = new ArrayList<>();

    /**
     * Giám khảo được phân công cho vòng thi. Judge (nội bộ/khách mời) thuộc domain
     * khác nên chỉ lưu id thô ở đây, không @ManyToOne sang một entity Judge.
     */
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "round_judge_assignment", joinColumns = @JoinColumn(name = "round_id"))
    @Column(name = "judge_id", nullable = false)
    private Set<Long> judgeIds = new HashSet<>();

    public Round(HackathonEvent event, String name, Integer orderIndex, Instant submissionDeadline, Integer topNPerTrack) {
        this.event = event;
        this.name = name;
        this.orderIndex = orderIndex;
        this.submissionDeadline = submissionDeadline;
        this.topNPerTrack = topNPerTrack;
    }

    public void applyFields(String name, Integer orderIndex, Instant submissionDeadline, Integer topNPerTrack) {
        this.name = name;
        this.orderIndex = orderIndex;
        this.submissionDeadline = submissionDeadline;
        this.topNPerTrack = topNPerTrack;
    }

    public void replaceCriteria(List<RoundCriterion> newCriteria) {
        this.criteria.clear();
        newCriteria.forEach(c -> c.setRound(this));
        this.criteria.addAll(newCriteria);
    }

    public boolean assignJudge(Long judgeId) {
        return this.judgeIds.add(judgeId);
    }

    public boolean unassignJudge(Long judgeId) {
        return this.judgeIds.remove(judgeId);
    }
}
