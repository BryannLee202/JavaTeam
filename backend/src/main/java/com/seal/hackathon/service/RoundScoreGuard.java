package com.seal.hackathon.service;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;

import java.util.UUID;

/**
 * Cho biet mot vong thi da co diem duoc ghi nhan chua.
 *
 * Nghiep vu BE-3 yeu cau chan sua tieu chi sau khi vong da cham diem (tra 409).
 * Nhung entity Score thuoc BE-5 va chua co tren main, nen o day chi dinh nghia
 * cho trong: ban mac dinh luon tra false (chua co diem).
 *
 * Khi BE-5 len, nguoi lam chi can them MOT class trong package nay:
 *
 *     @Component
 *     class ScoreBackedRoundScoreGuard implements RoundScoreGuard {
 *         private final ScoreRepository scoreRepository;
 *         ...
 *         public boolean hasScores(UUID roundId) {
 *             return scoreRepository.existsByCriterion_RoundId(roundId);
 *         }
 *     }
 *
 * Bean mac dinh se tu dong nhuong cho ban that nho @ConditionalOnMissingBean,
 * khong phai sua RoundCriterionService.
 */
public interface RoundScoreGuard {

    boolean hasScores(UUID roundId);

    @Configuration
    class DefaultConfig {

        @Bean
        @ConditionalOnMissingBean(RoundScoreGuard.class)
        public RoundScoreGuard noScoresYetGuard() {
            return roundId -> false;
        }
    }
}
