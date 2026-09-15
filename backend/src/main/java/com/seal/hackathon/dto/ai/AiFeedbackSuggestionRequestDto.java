package com.seal.hackathon.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiFeedbackSuggestionRequestDto {
    private UUID submissionId;
    private String teamName;
    private String trackName;
    private Map<String, BigDecimal> criterionScores;
    private BigDecimal totalScore;
    private String judgeNotes;
}
