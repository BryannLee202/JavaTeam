package com.seal.hackathon.dto.criteria;

import jakarta.validation.constraints.NotBlank;

public record CriteriaTemplateRequest(
        @NotBlank(message = "Ten bo tieu chi khong duoc de trong")
        String name,

        String description
) {}
