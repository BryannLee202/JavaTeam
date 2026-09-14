package com.seal.hackathon.service;

import com.seal.hackathon.dto.rbl.VarianceStatResponse;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

/**
 * Cung cap du lieu cham diem va phuong sai cho nghien cuu RBL.
 * Decouple khoi entity Score (BE-5) va Submission (BE-4) khi chua merge len main.
 */
public interface RblDataProvider {

    List<RblScoreRecord> getRblScores(UUID roundId);

    List<VarianceStatResponse> computeVariance(UUID roundId);

    record RblScoreRecord(
            String judgeAlias,
            String judgeType,
            boolean judgeCalibrated,
            String submissionAlias,
            String criterionName,
            BigDecimal scoreValue
    ) {
    }

    @Configuration
    class DefaultConfig {

        @Bean
        @ConditionalOnMissingBean(RblDataProvider.class)
        public RblDataProvider defaultRblDataProvider() {
            return new RblDataProvider() {
                @Override
                public List<RblScoreRecord> getRblScores(UUID roundId) {
                    return Collections.emptyList();
                }

                @Override
                public List<VarianceStatResponse> computeVariance(UUID roundId) {
                    return Collections.emptyList();
                }
            };
        }
    }
}
