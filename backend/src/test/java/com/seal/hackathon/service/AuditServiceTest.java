package com.seal.hackathon.service;

import com.seal.hackathon.domain.entity.AuditLog;
import com.seal.hackathon.domain.entity.User;
import com.seal.hackathon.domain.enums.AuditAction;
import com.seal.hackathon.repository.AuditLogRepository;
import com.seal.hackathon.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuditServiceTest {

    @Mock
    private AuditLogRepository auditLogRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuditService auditService;

    private UUID actorId;
    private User actor;

    @BeforeEach
    void setUp() {
        actorId = UUID.randomUUID();
        actor = User.builder()
                .fullName("Nguoi Kiem Toan")
                .email("audit@seal.edu.vn")
                .build();
        actor.setId(actorId);
    }

    @Test
    @DisplayName("Ghi nhan nhat ky kiem toan voi nguoi thuc hien hop le va du lieu JSON")
    void record_WithValidActor_ShouldSaveAuditLogWithJson() {
        UUID entityId = UUID.randomUUID();
        when(userRepository.findById(actorId)).thenReturn(Optional.of(actor));

        auditService.record(
                actorId,
                AuditAction.SCORE_CREATE,
                "Score",
                entityId,
                Map.of("oldPoints", 50),
                Map.of("newPoints", 90)
        );

        ArgumentCaptor<AuditLog> captor = ArgumentCaptor.forClass(AuditLog.class);
        verify(auditLogRepository).save(captor.capture());

        AuditLog saved = captor.getValue();
        assertThat(saved).isNotNull();
        assertThat(saved.getActor()).isEqualTo(actor);
        assertThat(saved.getAction()).isEqualTo(AuditAction.SCORE_CREATE);
        assertThat(saved.getEntityType()).isEqualTo("Score");
        assertThat(saved.getEntityId()).isEqualTo(entityId);
        assertThat(saved.getOldValueJson()).contains("oldPoints");
        assertThat(saved.getNewValueJson()).contains("newPoints");
        assertThat(saved.getTimestamp()).isNotNull();
    }

    @Test
    @DisplayName("Ghi nhan nhat ky kiem toan cho tac vu he thong khi khong co actor")
    void record_WithoutActor_ShouldSaveSystemAuditLog() {
        UUID entityId = UUID.randomUUID();

        auditService.record(
                null,
                AuditAction.VOTE_CAST,
                "Vote",
                entityId,
                null,
                "Thanh cong"
        );

        ArgumentCaptor<AuditLog> captor = ArgumentCaptor.forClass(AuditLog.class);
        verify(auditLogRepository).save(captor.capture());

        AuditLog saved = captor.getValue();
        assertThat(saved).isNotNull();
        assertThat(saved.getActor()).isNull();
        assertThat(saved.getAction()).isEqualTo(AuditAction.VOTE_CAST);
        assertThat(saved.getOldValueJson()).isNull();
        assertThat(saved.getNewValueJson()).isEqualTo("\"Thanh cong\"");
    }

    @Test
    @DisplayName("Ghi nhan nhat ky khi actorId khong ton tai trong he thong")
    void record_WhenActorNotFound_ShouldSaveWithNullActor() {
        UUID unknownActorId = UUID.randomUUID();
        when(userRepository.findById(unknownActorId)).thenReturn(Optional.empty());

        auditService.record(
                unknownActorId,
                AuditAction.RESULT_PUBLISH,
                "Event",
                UUID.randomUUID(),
                null,
                null
        );

        ArgumentCaptor<AuditLog> captor = ArgumentCaptor.forClass(AuditLog.class);
        verify(auditLogRepository).save(captor.capture());

        AuditLog saved = captor.getValue();
        assertThat(saved.getActor()).isNull();
        assertThat(saved.getAction()).isEqualTo(AuditAction.RESULT_PUBLISH);
    }
}
