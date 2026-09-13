package com.seal.hackathon.dto.audit;

import com.seal.hackathon.domain.entity.AuditLog;
import com.seal.hackathon.domain.enums.AuditAction;

import java.time.Instant;
import java.util.UUID;

public record AuditLogResponse(
        UUID id,
        UUID actorId,
        String actorName,
        AuditAction action,
        String entityType,
        UUID entityId,
        String oldValueJson,
        String newValueJson,
        Instant timestamp
) {
    public static AuditLogResponse from(AuditLog log) {
        // actor cho phep null: cac hanh dong he thong tu sinh khong gan voi nguoi dung nao.
        var actor = log.getActor();
        return new AuditLogResponse(
                log.getId(),
                actor == null ? null : actor.getId(),
                actor == null ? null : actor.getFullName(),
                log.getAction(),
                log.getEntityType(),
                log.getEntityId(),
                log.getOldValueJson(),
                log.getNewValueJson(),
                log.getTimestamp()
        );
    }
}
