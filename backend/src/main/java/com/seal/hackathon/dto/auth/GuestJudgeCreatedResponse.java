package com.seal.hackathon.dto.auth;

import java.util.UUID;

/**
 * tempPassword chi tra ve dung mot lan ngay luc tao, khong luu dang ro va
 * khong co API nao doc lai duoc. Dieu phoi vien phai gui ngay cho giam khao.
 */
public record GuestJudgeCreatedResponse(
        UUID id,
        String fullName,
        String email,
        String tempPassword
) {}
