package com.seal.hackathon.domain.entity;

import com.seal.hackathon.domain.enums.AuditAction;
import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "audit_log")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "actor_id")
    private User actor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuditAction action;

    @Column(nullable = false)
    private String entityType;

    private UUID entityId;

    @Column(columnDefinition = "TEXT")
    private String oldValueJson;

    @Column(columnDefinition = "TEXT")
    private String newValueJson;

    @Column(nullable = false)
    private Instant timestamp;
}
