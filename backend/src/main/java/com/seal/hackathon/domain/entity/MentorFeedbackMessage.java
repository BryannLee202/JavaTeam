package com.seal.hackathon.domain.entity;

import com.seal.hackathon.domain.enums.FeedbackAuthorRole;
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

import java.util.UUID;

/**
 * Tin nhan trao doi/phan hoi giua mentor va doi thi.
 * teamId luu dang UUID de dong bo voi database ma khong bi phu thuoc bien dich
 * vao entity Team (BE-4 chua co tren main).
 */
@Getter
@Setter
@Entity
@Table(name = "mentor_feedback_message")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MentorFeedbackMessage extends BaseEntity {

    @Column(name = "team_id", nullable = false)
    private UUID teamId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "author_user_id", nullable = false)
    private User author;

    @Enumerated(EnumType.STRING)
    @Column(name = "author_role", nullable = false, length = 20)
    private FeedbackAuthorRole authorRole;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String body;
}
