package com.seal.hackathon.repository;

import com.seal.hackathon.domain.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VoteRepository extends JpaRepository<Vote, UUID> {

    boolean existsByTrackIdAndVoterIdHash(UUID trackId, String voterIdHash);

    long countByTrackIdAndIpHash(UUID trackId, String ipHash);

    long countByTeamId(UUID teamId);

    @Query("SELECT v.teamId AS teamId, COUNT(v) AS voteCount FROM Vote v WHERE v.trackId = :trackId GROUP BY v.teamId")
    List<TeamVoteCount> countGroupedByTeamForTrack(@Param("trackId") UUID trackId);

    interface TeamVoteCount {
        UUID getTeamId();
        Long getVoteCount();
    }
}
