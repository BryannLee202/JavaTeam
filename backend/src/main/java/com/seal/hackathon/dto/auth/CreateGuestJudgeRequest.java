package com.seal.hackathon.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.time.Instant;

public record CreateGuestJudgeRequest(
        @NotBlank(message = "Ho ten khong duoc de trong")
        String fullName,

        @NotBlank(message = "Email khong duoc de trong")
        @Email(message = "Email khong dung dinh dang")
        String email,

        /** Null nghia la khong gioi han thoi gian truy cap. */
        Instant guestAccessExpiresAt
) {}
