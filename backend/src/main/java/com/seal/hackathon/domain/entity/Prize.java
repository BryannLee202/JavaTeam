package com.seal.hackathon.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

/**
 * Giai thuong cua mot su kien. trackId null nghia la giai chung cho ca cuoc thi,
 * co gia tri thi la giai rieng cua mot hang muc.
 *
 * eventId / trackId / awardedTeamId de dang UUID tran vi HackathonEvent, Track, Team
 * thuoc BE-2 va BE-4, chua co tren main. awardedTeamName luu kem de hien thi duoc
 * ma khong phai join sang bang Team chua ton tai.
 */
@Getter
@Setter
@Entity
@Table(name = "prize")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prize extends BaseEntity {

    @Column(name = "event_id", nullable = false)
    private UUID eventId;

    @Column(name = "track_id")
    private UUID trackId;

    @Column(nullable = false)
    private String name;

    /** Hang duoc trao giai nay: 1 la giai Nhat, 2 la giai Nhi... */
    @Column(nullable = false)
    private int rankCondition;

    @Column(name = "awarded_team_id")
    private UUID awardedTeamId;

    @Column(name = "awarded_team_name")
    private String awardedTeamName;

    /** Giai da bi thu hoi thi khong con hieu luc nhung van giu lai de tra cuu. */
    @Column(nullable = false)
    private boolean revoked;
}
