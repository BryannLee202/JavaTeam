package com.seal.hackathon.service;

import com.seal.hackathon.security.AuthenticatedPrincipal;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

/**
 * Cung cap du lieu bang xep hang cho ReportExportService de xuat file Excel.
 * Decouple khoi Ranking (BE-5) khi chua merge len main.
 */
public interface RankingDataProvider {

    List<RankingExportRow> getRankingsForRound(UUID roundId);

    default void assertCanAccessRanking(UUID roundId, AuthenticatedPrincipal principal) {
    }

    record RankingExportRow(
            Integer rankOverall,
            Integer rankInTrack,
            String teamName,
            String trackName,
            Double totalWeightedScore,
            boolean promoted
    ) {
    }

    @Configuration
    class DefaultConfig {

        @Bean
        @ConditionalOnMissingBean(RankingDataProvider.class)
        public RankingDataProvider defaultRankingDataProvider() {
            return roundId -> Collections.emptyList();
        }
    }
}
