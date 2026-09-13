package com.seal.hackathon.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

/**
 * Phieu binh chon khan gia cho mot doi thi trong hang muc cu the.
 * voterIdHash duoc bam SHA-256 tu voterId (an danh trong JWT voterToken).
 * ipHash duoc bam SHA-256 tu IP client de chong spam tu mot mang.
 * Rang buoc duy nhat tren (track_id, voter_id_hash) ngan chan mot nguoi bo phieu 2 lan trong cung 1 hang muc.
 */
@Getter
@Setter
@Entity
@Table(name = "vote", uniqueConstraints = @UniqueConstraint(columnNames = {"track_id", "voter_id_hash"}))
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vote extends BaseEntity {

    @Column(name = "team_id", nullable = false)
    private UUID teamId;

    @Column(name = "track_id", nullable = false)
    private UUID trackId;

    @Column(name = "voter_id_hash", nullable = false, length = 64)
    private String voterIdHash;

    @Column(name = "ip_hash", nullable = false, length = 64)
    private String ipHash;
}
