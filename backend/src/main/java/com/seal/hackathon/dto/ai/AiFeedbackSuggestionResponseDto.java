package com.seal.hackathon.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiFeedbackSuggestionResponseDto {
    private String generalComment;
    private List<String> keyHighlights;
    private List<String> improvementSuggestions;
    private String formattedDraft;
    private String source;
}
