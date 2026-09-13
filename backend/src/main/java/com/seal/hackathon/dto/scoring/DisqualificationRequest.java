package com.seal.hackathon.dto.scoring;

import com.seal.hackathon.domain.enums.DisqualificationTargetType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

/**
 * Rang buoc: targetType = TEAM thi phai co teamId, = SUBMISSION thi phai co
 * submissionId — khong bao gio ca hai. DisqualificationService kiem tra.
 */
public record DisqualificationRequest(
        @NotNull(message = "Phai chon loai doi tuong bi xu ly")
        DisqualificationTargetType targetType,

        UUID teamId,

        UUID submissionId,

        @NotBlank(message = "Phai ghi ly do xu ly vi pham")
        String reason,

        @NotNull(message = "Thieu ma su kien")
        UUID eventId
) {}
