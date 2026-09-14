package com.seal.hackathon.service;

import com.seal.hackathon.dto.team.TeamResponse;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

/**
 * Cung cap quyen truy cap va thong tin doi thi cho MentorService va TeamFeedbackService.
 * Giup decouple khoi module BE-4 khi chua duoc merge len main.
 */
public interface TeamAccessProvider {

    boolean isTeamMember(UUID teamId, UUID userId);

    UUID getTeamTrackId(UUID teamId);

    boolean teamExists(UUID teamId);

    List<TeamResponse> listTeamsByTracks(List<UUID> trackIds);

    @Configuration
    class DefaultConfig {

        @Bean
        @ConditionalOnMissingBean(TeamAccessProvider.class)
        public TeamAccessProvider defaultTeamAccessProvider() {
            return new TeamAccessProvider() {
                @Override
                public boolean isTeamMember(UUID teamId, UUID userId) {
                    return false;
                }

                @Override
                public UUID getTeamTrackId(UUID teamId) {
                    return null;
                }

                @Override
                public boolean teamExists(UUID teamId) {
                    return true;
                }

                @Override
                public List<TeamResponse> listTeamsByTracks(List<UUID> trackIds) {
                    return Collections.emptyList();
                }
            };
        }
    }
}
