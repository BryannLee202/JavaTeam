package com.seal.hackathon.dto.auth;

/** approve = false thi rejectionReason nen duoc dien de nguoi dung biet ly do bi tu choi. */
public record ApproveUserRequest(
        boolean approve,
        String rejectionReason
) {}
