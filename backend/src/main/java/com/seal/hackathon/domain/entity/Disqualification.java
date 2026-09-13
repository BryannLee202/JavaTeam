package com.seal.hackathon.domain.entity;

import com.seal.hackathon.domain.enums.DisqualificationTargetType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

/**
 * Quyet dinh loai mot doi hoac mot bai nop. Luon ghi vet ai quyet dinh va vi sao.
 *
 * eventId duoc luu truc tiep de tra cuu theo su kien ma khong phai join qua Team,
 * vi Team thuoc BE-4 va chua co tren main.
 */
@Getter
@Setter
@Entity
@Table(name = "disqualification")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Disqualification extends BaseEntity {

    @Column(name = "event_id", nullable = false)
    private UUID eventId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DisqualificationTargetType targetType;

    /** Co gia tri khi targetType = TEAM. */
    @Column(name = "team_id")
    private UUID teamId;

    /** Co gia tri khi targetType = SUBMISSION. */
    @Column(name = "submission_id")
    private UUID submissionId;

    @Column(nullable = false, length = 1000)
    private String reason;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "decided_by", nullable = false)
    private User decidedBy;

    @Column(nullable = false)
    private Instant decidedAt;

    @Column(nullable = false)
    private boolean revoked;
}
