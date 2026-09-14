package com.seal.hackathon.service;

import com.seal.hackathon.dto.rbl.VarianceStatResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class VarianceDashboardService {

    private final RblDataProvider rblDataProvider;

    public VarianceDashboardService(RblDataProvider rblDataProvider) {
        this.rblDataProvider = rblDataProvider;
    }

    @Transactional(readOnly = true)
    public List<VarianceStatResponse> computeForRound(UUID roundId) {
        List<VarianceStatResponse> precomputed = rblDataProvider.computeVariance(roundId);
        if (precomputed != null && !precomputed.isEmpty()) {
            return precomputed;
        }

        List<RblDataProvider.RblScoreRecord> records = rblDataProvider.getRblScores(roundId);
        if (records == null || records.isEmpty()) {
            return Collections.emptyList();
        }

        Map<String, List<BigDecimal>> scoresByCriterion = records.stream()
                .filter(r -> r.criterionName() != null && r.scoreValue() != null)
                .collect(Collectors.groupingBy(
                        RblDataProvider.RblScoreRecord::criterionName,
                        Collectors.mapping(RblDataProvider.RblScoreRecord::scoreValue, Collectors.toList())
                ));

        return scoresByCriterion.entrySet().stream()
                .map(entry -> buildStat(null, entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    public static VarianceStatResponse buildStat(UUID criterionId, String criterionName, List<BigDecimal> values) {
        if (values == null || values.isEmpty()) {
            return new VarianceStatResponse(criterionId, criterionName, 0, null, null, null, null);
        }
        BigDecimal sum = values.stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal mean = sum.divide(BigDecimal.valueOf(values.size()), MathContext.DECIMAL64);

        BigDecimal sumSquaredDiff = values.stream()
                .map(v -> v.subtract(mean).pow(2))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal variance = values.size() > 1
                ? sumSquaredDiff.divide(BigDecimal.valueOf(values.size() - 1), MathContext.DECIMAL64)
                : BigDecimal.ZERO;
        BigDecimal stdDev = BigDecimal.valueOf(Math.sqrt(variance.doubleValue()));

        BigDecimal min = values.stream().min(BigDecimal::compareTo).orElse(BigDecimal.ZERO);
        BigDecimal max = values.stream().max(BigDecimal::compareTo).orElse(BigDecimal.ZERO);

        return new VarianceStatResponse(
                criterionId,
                criterionName,
                values.size(),
                mean.setScale(2, RoundingMode.HALF_UP),
                stdDev.setScale(2, RoundingMode.HALF_UP),
                min,
                max
        );
    }
}
