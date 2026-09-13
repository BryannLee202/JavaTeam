package com.seal.hackathon.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Mot tieu cham diem. Thuoc VE MOT TRONG HAI: mot bo mau, hoac mot vong thi —
 * khong bao gio ca hai, va khong bao gio ca hai deu null.
 *
 * roundId de dang UUID tran thay vi @ManyToOne vi entity Round thuoc BE-2 va
 * chua co tren main. Khi BE-2 len, doi sang quan he that ma khong pha hop dong API.
 */
@Getter
@Setter
@Entity
@Table(name = "criterion")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Criterion extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "template_id")
    private CriteriaTemplate template;

    @Column(name = "round_id")
    private UUID roundId;

    @Column(nullable = false)
    private String name;

    private String description;

    /** Trong so phan tram. Tong cac tieu chi trong cung mot vong quy uoc bang 100. */
    @Column(nullable = false, precision = 6, scale = 2)
    private BigDecimal weight;

    /** Diem toi da giam khao cham cho tieu chi nay. */
    @Column(nullable = false, precision = 6, scale = 2)
    private BigDecimal maxScore;
}
