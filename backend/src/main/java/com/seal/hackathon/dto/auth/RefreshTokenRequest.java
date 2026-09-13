package com.seal.hackathon.dto.auth;

import jakarta.validation.constraints.NotBlank;

public record RefreshTokenRequest(
        @NotBlank(message = "Thieu refresh token")
        String refreshToken
) {}
