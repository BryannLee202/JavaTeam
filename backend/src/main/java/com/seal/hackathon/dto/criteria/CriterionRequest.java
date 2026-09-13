package com.seal.hackathon.dto.criteria;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record CriterionRequest(
        @NotBlank(message = "Ten tieu chi khong duoc de trong")
        String name,

        String description,

        @NotNull(message = "Trong so khong duoc de trong")
        @DecimalMin(value = "0.01", message = "Trong so phai lon hon 0")
        BigDecimal weight,

        @NotNull(message = "Diem toi da khong duoc de trong")
        @DecimalMin(value = "0.01", message = "Diem toi da phai lon hon 0")
        BigDecimal maxScore
) {}
