package com.seal.hackathon.dto.submission;

import com.seal.hackathon.domain.enums.SubmissionStatus;

import java.util.UUID;

public record SubmissionStatusResponse(
        UUID teamId,
        UUID roundId,
        SubmissionStatus status
) {
}