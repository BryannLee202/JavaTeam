package com.seal.hackathon.dto.auth;

import com.seal.hackathon.domain.entity.User;
import com.seal.hackathon.domain.enums.AccountStatus;
import com.seal.hackathon.domain.enums.UserCategory;

import java.time.Instant;
import java.util.UUID;

/**
 * Ban rut gon cua User de tra ra API. Khong bao gio chua passwordHash.
 * Cac field khop voi interface UserSummary trong frontend/src/api/types.ts.
 */
public record UserSummaryResponse(
        UUID id,
        String fullName,
        String email,
        UserCategory userCategory,
        String studentCode,
        String schoolName,
        AccountStatus accountStatus,
        boolean guestJudge,
        String rejectionReason,
        Instant createdAt
) {
    public static UserSummaryResponse from(User user) {
        return new UserSummaryResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getUserCategory(),
                user.getStudentCode(),
                user.getSchoolName(),
                user.getAccountStatus(),
                user.isGuestJudge(),
                user.getRejectionReason(),
                user.getCreatedAt()
        );
    }
}
