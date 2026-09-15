package com.seal.hackathon.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.seal.hackathon.config.AiConfigurationProperties;
import com.seal.hackathon.domain.entity.HackathonEvent;
import com.seal.hackathon.domain.entity.Round;
import com.seal.hackathon.domain.entity.Submission;
import com.seal.hackathon.domain.entity.Team;
import com.seal.hackathon.domain.entity.Track;
import com.seal.hackathon.dto.ai.AiSubmissionAnalysisDto;
import com.seal.hackathon.dto.ai.AiFeedbackSuggestionRequestDto;
import com.seal.hackathon.dto.ai.AiFeedbackSuggestionResponseDto;
import java.math.BigDecimal;
import java.util.Map;
import com.seal.hackathon.exception.ApiException;
import com.seal.hackathon.repository.SubmissionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AiAssistantServiceTest {

    @Mock
    private SubmissionRepository submissionRepository;

    @Spy
    private AiConfigurationProperties aiProperties = new AiConfigurationProperties();

    @Spy
    private ObjectMapper objectMapper = new ObjectMapper();

    @InjectMocks
    private AiAssistantService aiAssistantService;

    private UUID submissionId;
    private Submission mockSubmission;

    @BeforeEach
    void setUp() {
        submissionId = UUID.randomUUID();
        HackathonEvent event = HackathonEvent.builder().name("SEAL AI Hackathon").build();
        Track track = Track.builder().name("AI / Machine Learning").build();
        Team team = Team.builder().name("TechTitans").event(event).track(track).build();
        Round round = Round.builder().name("Chung kết").build();

        mockSubmission = Submission.builder()
                .team(team)
                .round(round)
                .repoUrl("https://github.com/techtitans/seal-solution")
                .demoUrl("https://techtitans.seal.edu.vn")
                .docUrl("https://docs.techtitans.seal.edu.vn")
                .repoMetadataJson("{\"stars\": 42}")
                .submittedAt(Instant.now())
                .isLate(false)
                .build();
        mockSubmission.setId(submissionId);
    }

    @Test
    @DisplayName("analyzeSubmission: Nem loi NotFound khi ID bai nop khong ton tai")
    void analyzeSubmission_NotFound() {
        when(submissionRepository.findById(submissionId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> aiAssistantService.analyzeSubmission(submissionId))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("Không tìm thấy bài nộp");
    }

    @Test
    @DisplayName("analyzeSubmission: Tu dong su dung Heuristic Fallback khi AI disabled")
    void analyzeSubmission_DisabledFallback() {
        aiProperties.setEnabled(false);
        when(submissionRepository.findById(submissionId)).thenReturn(Optional.of(mockSubmission));

        AiSubmissionAnalysisDto result = aiAssistantService.analyzeSubmission(submissionId);

        assertThat(result).isNotNull();
        assertThat(result.getSubmissionId()).isEqualTo(submissionId);
        assertThat(result.getTeamName()).isEqualTo("TechTitans");
        assertThat(result.getTrackName()).isEqualTo("AI / Machine Learning");
        assertThat(result.getSource()).isEqualTo("HEURISTIC_FALLBACK");
        assertThat(result.getSummary()).contains("TechTitans");
        assertThat(result.getStrengths()).isNotEmpty();
        assertThat(result.getConcerns()).isNotEmpty();
        assertThat(result.getCounterQuestions()).hasSize(3);
    }

    @Test
    @DisplayName("generateHeuristicAnalysis: Tao day du thong tin phan tich truc quan cho bai nop")
    void generateHeuristicAnalysis_Success() {
        AiSubmissionAnalysisDto result = aiAssistantService.generateHeuristicAnalysis(mockSubmission);

        assertThat(result).isNotNull();
        assertThat(result.getTeamName()).isEqualTo("TechTitans");
        assertThat(result.getCounterQuestions().get(0)).contains("hiệu năng");
        assertThat(result.getStrengths()).hasSize(3);
    }

    @Test
    @DisplayName("suggestFeedback: Goi y nhan xet cho diem xuat sac (>= 85)")
    void suggestFeedback_ExcellentScore() {
        AiFeedbackSuggestionRequestDto request = AiFeedbackSuggestionRequestDto.builder()
                .teamName("AlphaTech")
                .totalScore(new BigDecimal("92.5"))
                .criterionScores(Map.of("Innovation", new BigDecimal("9.5"), "Tech", new BigDecimal("9.0")))
                .build();

        AiFeedbackSuggestionResponseDto response = aiAssistantService.suggestFeedback(request);

        assertThat(response).isNotNull();
        assertThat(response.getSource()).isEqualTo("HEURISTIC_FALLBACK");
        assertThat(response.getGeneralComment()).contains("xuất sắc");
        assertThat(response.getKeyHighlights()).isNotEmpty();
        assertThat(response.getImprovementSuggestions()).isNotEmpty();
        assertThat(response.getFormattedDraft()).contains("AlphaTech");
    }

    @Test
    @DisplayName("suggestFeedback: Goi y nhan xet cho diem trung binh (< 70)")
    void suggestFeedback_ModerateScore() {
        AiFeedbackSuggestionRequestDto request = AiFeedbackSuggestionRequestDto.builder()
                .teamName("BetaTeam")
                .totalScore(new BigDecimal("65.0"))
                .build();

        AiFeedbackSuggestionResponseDto response = aiAssistantService.suggestFeedback(request);

        assertThat(response).isNotNull();
        assertThat(response.getSource()).isEqualTo("HEURISTIC_FALLBACK");
        assertThat(response.getGeneralComment()).contains("tiềm năng");
        assertThat(response.getImprovementSuggestions().get(0)).contains("Happy Path");
    }
}
