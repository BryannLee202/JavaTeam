package com.seal.hackathon.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiSubmissionAnalysisDto {
    private UUID submissionId;
    private String teamName;
    private String trackName;
    private String summary;
    private List<String> strengths;
    private List<String> concerns;
    private List<String> counterQuestions;
    private String source; // "AI_LIVE" hoặc "HEURISTIC_FALLBACK"
}
