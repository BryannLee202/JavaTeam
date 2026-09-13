package com.seal.hackathon.domain.entity;

import com.seal.hackathon.domain.enums.AccountStatus;
import com.seal.hackathon.domain.enums.UserCategory;
import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "app_user")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserCategory userCategory;

    private String studentCode;

    private String schoolName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountStatus accountStatus;

    @Column(nullable = false)
    private boolean guestJudge;

    private Instant guestAccessExpiresAt;

    private String rejectionReason;
}