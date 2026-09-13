package com.sealhackathon.coordinator.round;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Tiêu chí chấm điểm thuộc một Round. Trọng số (weight) tính theo %, tổng các
 * tiêu chí trong một Round phải bằng 100 — được validate ở RoundService/RoundCriterionService.
 */
@Entity
@Table(name = "round_criterion")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RoundCriterion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "round_id", nullable = false)
    private Round round;

    @Column(nullable = false, length = 150)
    private String name;

    /** Trọng số theo phần trăm, 0–100. */
    @Column(nullable = false)
    private Integer weight;

    /** Thứ tự hiển thị trong danh sách tiêu chí — cùng tên với Round.orderIndex, xem javadoc Round. */
    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;

    public RoundCriterion(Round round, String name, Integer weight, Integer orderIndex) {
        this.round = round;
        this.name = name;
        this.weight = weight;
        this.orderIndex = orderIndex;
    }

    public void applyFields(String name, Integer weight, Integer orderIndex) {
        this.name = name;
        this.weight = weight;
        this.orderIndex = orderIndex;
    }
}
