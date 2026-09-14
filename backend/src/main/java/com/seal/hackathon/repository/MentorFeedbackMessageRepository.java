package com.seal.hackathon.repository;

import com.seal.hackathon.domain.entity.MentorFeedbackMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MentorFeedbackMessageRepository extends JpaRepository<MentorFeedbackMessage, UUID> {

    @Query("SELECT m FROM MentorFeedbackMessage m JOIN FETCH m.author WHERE m.teamId = :teamId ORDER BY m.createdAt ASC")
    List<MentorFeedbackMessage> findByTeamIdWithAuthorOrderByCreatedAtAsc(@Param("teamId") UUID teamId);
}
