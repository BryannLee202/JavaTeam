package com.seal.hackathon.service;

import com.seal.hackathon.dto.event.EventResponse;
import com.seal.hackathon.dto.event.TrackResponse;
import com.seal.hackathon.dto.vote.PublicTeamResponse;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

/**
 * Cung cap du lieu su kien, hang muc va doi thi cho chuc nang binh chon cong khai.
 * HackathonEvent, Track (BE-2) va Team (BE-4) thuoc cac task khac nen o day
 * tach thanh interface de khong phai phu thuoc truc tiep vao entity chua merge.
 * Khi BE-2 va BE-4 merge vao main, chi can mot @Component implement interface nay.
 */
public interface PublicVotingDataProvider {

    List<EventResponse> listVotableEvents();

    List<TrackResponse> listTracks(UUID eventId);

    List<PublicTeamResponse> listTeams(UUID trackId);

    String getTeamName(UUID teamId);

    @Configuration
    class DefaultConfig {

        @Bean
        @ConditionalOnMissingBean(PublicVotingDataProvider.class)
        public PublicVotingDataProvider defaultPublicVotingDataProvider() {
            return new PublicVotingDataProvider() {
                @Override
                public List<EventResponse> listVotableEvents() {
                    return Collections.emptyList();
                }

                @Override
                public List<TrackResponse> listTracks(UUID eventId) {
                    return Collections.emptyList();
                }

                @Override
                public List<PublicTeamResponse> listTeams(UUID trackId) {
                    return Collections.emptyList();
                }

                @Override
                public String getTeamName(UUID teamId) {
                    return "Đội " + teamId.toString().substring(0, 8);
                }
            };
        }
    }
}
