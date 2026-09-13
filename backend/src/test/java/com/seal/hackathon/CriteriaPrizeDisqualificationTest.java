package com.seal.hackathon;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.seal.hackathon.domain.entity.User;
import com.seal.hackathon.domain.enums.AccountStatus;
import com.seal.hackathon.domain.enums.RoleName;
import com.seal.hackathon.domain.enums.ScopeType;
import com.seal.hackathon.domain.enums.UserCategory;
import com.seal.hackathon.repository.UserRepository;
import com.seal.hackathon.security.AuthenticatedPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Kiem thu BE-3: tieu chi cham, giai thuong, xu ly vi pham.
 * Chay tren H2 trong bo nho, khong can cai dat gi them.
 */
@SpringBootTest
@AutoConfigureMockMvc
class CriteriaPrizeDisqualificationTest {

    @Autowired
    private MockMvc mvc;

    /** Tu tao thay vi @Autowired: Spring Boot 4 khong dang ky san bean ObjectMapper. */
    private final ObjectMapper json = new ObjectMapper();

    @Autowired
    private UserRepository userRepository;

    private RequestPostProcessor coordinator;
    private UUID coordinatorId;

    @BeforeEach
    void setUpCoordinator() {
        User user = userRepository.save(User.builder()
                .fullName("Dieu Phoi Vien Kiem Thu")
                .email("coordinator-" + UUID.randomUUID() + "@test.local")
                .passwordHash("khong-dung-den")
                .userCategory(UserCategory.STAFF)
                .accountStatus(AccountStatus.APPROVED)
                .guestJudge(false)
                .build());
        coordinatorId = user.getId();

        var principal = new AuthenticatedPrincipal(
                user.getId(), user.getEmail(), user.getFullName(),
                List.of(new AuthenticatedPrincipal.RoleGrant(
                        RoleName.COORDINATOR, ScopeType.GLOBAL, null, null)));

        coordinator = authentication(new UsernamePasswordAuthenticationToken(
                principal, null, List.of(new SimpleGrantedAuthority("ROLE_COORDINATOR"))));
    }

    private String body(Object value) throws Exception {
        return json.writeValueAsString(value);
    }

    /* ── Bo tieu chi mau ─────────────────────────────────────────────── */

    @Test
    @DisplayName("Tao bo tieu chi mau roi them tieu chi vao")
    void createTemplateAndAddCriterion() throws Exception {
        String templateId = json.readTree(mvc.perform(post("/api/criteria-templates").with(coordinator)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body(Map.of("name", "Bo chuan SEAL", "description", "Dung lai moi mua"))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Bo chuan SEAL"))
                .andExpect(jsonPath("$.isDefault").value(false))
                .andReturn().getResponse().getContentAsString()).get("id").asText();

        mvc.perform(post("/api/criteria-templates/" + templateId + "/criteria").with(coordinator)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body(Map.of("name", "Tinh kha thi", "description", "Trien khai duoc that",
                                "weight", 40, "maxScore", 10))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.templateId").value(templateId))
                .andExpect(jsonPath("$.roundId").doesNotExist());

        mvc.perform(get("/api/criteria-templates/" + templateId).with(coordinator))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.criteria.length()").value(1));
    }

    /* ── Tieu chi cua vong thi ───────────────────────────────────────── */

    @Test
    @DisplayName("Them, sua, xoa tieu chi cua mot vong thi")
    void roundCriterionLifecycle() throws Exception {
        UUID roundId = UUID.randomUUID();

        String criterionId = json.readTree(mvc.perform(post("/api/rounds/" + roundId + "/criteria").with(coordinator)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body(Map.of("name", "Sang tao", "description", "Y tuong moi",
                                "weight", 35, "maxScore", 10))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.roundId").value(roundId.toString()))
                .andReturn().getResponse().getContentAsString()).get("id").asText();

        mvc.perform(put("/api/rounds/" + roundId + "/criteria/" + criterionId).with(coordinator)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body(Map.of("name", "Sang tao va doc dao", "description", "Y tuong moi",
                                "weight", 50, "maxScore", 10))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Sang tao va doc dao"))
                .andExpect(jsonPath("$.weight").value(50));

        mvc.perform(delete("/api/rounds/" + roundId + "/criteria/" + criterionId).with(coordinator))
                .andExpect(status().isNoContent());

        mvc.perform(get("/api/rounds/" + roundId + "/criteria").with(coordinator))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    @DisplayName("Chan khi tong trong so vuot qua 100")
    void rejectsWeightOverflow() throws Exception {
        UUID roundId = UUID.randomUUID();

        mvc.perform(post("/api/rounds/" + roundId + "/criteria").with(coordinator)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body(Map.of("name", "A", "description", "", "weight", 70, "maxScore", 10))))
                .andExpect(status().isCreated());

        mvc.perform(post("/api/rounds/" + roundId + "/criteria").with(coordinator)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body(Map.of("name", "B", "description", "", "weight", 40, "maxScore", 10))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("vuot qua 100")));
    }

    @Test
    @DisplayName("Cho phep tong chua du 100 — giao dien chi canh bao chu khong chan")
    void allowsPartialWeight() throws Exception {
        UUID roundId = UUID.randomUUID();
        mvc.perform(post("/api/rounds/" + roundId + "/criteria").with(coordinator)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body(Map.of("name", "Mot minh", "description", "", "weight", 30, "maxScore", 10))))
                .andExpect(status().isCreated());
    }

    @Test
    @DisplayName("Tu choi trong so bang 0")
    void rejectsZeroWeight() throws Exception {
        mvc.perform(post("/api/rounds/" + UUID.randomUUID() + "/criteria").with(coordinator)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body(Map.of("name", "X", "description", "", "weight", 0, "maxScore", 10))))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Khong sua duoc tieu chi cua vong khac")
    void rejectsCriterionFromAnotherRound() throws Exception {
        UUID roundA = UUID.randomUUID();
        UUID roundB = UUID.randomUUID();

        String id = json.readTree(mvc.perform(post("/api/rounds/" + roundA + "/criteria").with(coordinator)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body(Map.of("name", "Cua vong A", "description", "", "weight", 10, "maxScore", 10))))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString()).get("id").asText();

        mvc.perform(delete("/api/rounds/" + roundB + "/criteria/" + id).with(coordinator))
                .andExpect(status().isBadRequest());
    }

    /* ── Giai thuong ─────────────────────────────────────────────────── */

    @Test
    @DisplayName("Tao giai thuong, thu hoi, va khong thu hoi duoc hai lan")
    void prizeLifecycle() throws Exception {
        UUID eventId = UUID.randomUUID();

        String prizeId = json.readTree(mvc.perform(post("/api/events/" + eventId + "/prizes").with(coordinator)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body(Map.of("name", "Giai Nhat", "rankCondition", 1))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.eventId").value(eventId.toString()))
                .andExpect(jsonPath("$.trackId").doesNotExist())
                .andExpect(jsonPath("$.revoked").value(false))
                .andReturn().getResponse().getContentAsString()).get("id").asText();

        mvc.perform(get("/api/events/" + eventId + "/prizes").with(coordinator))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));

        mvc.perform(post("/api/prizes/" + prizeId + "/revoke").with(coordinator))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.revoked").value(true));

        mvc.perform(post("/api/prizes/" + prizeId + "/revoke").with(coordinator))
                .andExpect(status().isConflict());
    }

    @Test
    @DisplayName("Tu dong trao giai bao ro la dang cho task BE-5")
    void autoAssignExplainsDependency() throws Exception {
        mvc.perform(post("/api/events/" + UUID.randomUUID() + "/prizes/auto-assign").with(coordinator)
                        .param("finalRoundId", UUID.randomUUID().toString()))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("BE-5")));
    }

    /* ── Xu ly vi pham ───────────────────────────────────────────────── */

    @Test
    @DisplayName("Loai mot doi: ghi vet nguoi quyet dinh va ly do")
    void disqualifyTeam() throws Exception {
        UUID eventId = UUID.randomUUID();
        UUID teamId = UUID.randomUUID();

        mvc.perform(post("/api/disqualifications").with(coordinator)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body(Map.of("targetType", "TEAM", "teamId", teamId,
                                "reason", "Nop bai sao chep", "eventId", eventId))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.targetType").value("TEAM"))
                .andExpect(jsonPath("$.teamId").value(teamId.toString()))
                .andExpect(jsonPath("$.decidedByName").value("Dieu Phoi Vien Kiem Thu"))
                .andExpect(jsonPath("$.revoked").value(false));

        mvc.perform(get("/api/events/" + eventId + "/disqualifications").with(coordinator))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    @DisplayName("TEAM ma thieu teamId thi bi tu choi")
    void rejectsMismatchedTarget() throws Exception {
        mvc.perform(post("/api/disqualifications").with(coordinator)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body(Map.of("targetType", "TEAM", "submissionId", UUID.randomUUID(),
                                "reason", "Sai kieu", "eventId", UUID.randomUUID()))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("teamId")));
    }

    @Test
    @DisplayName("Khong loai mot doi hai lan")
    void rejectsDoubleDisqualification() throws Exception {
        UUID eventId = UUID.randomUUID();
        UUID teamId = UUID.randomUUID();
        var payload = body(Map.of("targetType", "TEAM", "teamId", teamId,
                "reason", "Vi pham quy che", "eventId", eventId));

        mvc.perform(post("/api/disqualifications").with(coordinator)
                .contentType(MediaType.APPLICATION_JSON).content(payload))
                .andExpect(status().isCreated());

        mvc.perform(post("/api/disqualifications").with(coordinator)
                .contentType(MediaType.APPLICATION_JSON).content(payload))
                .andExpect(status().isConflict());
    }

    /* ── Phan quyen ──────────────────────────────────────────────────── */

    @Test
    @DisplayName("Khong dang nhap thi khong goi duoc API")
    void rejectsAnonymous() throws Exception {
        mvc.perform(get("/api/criteria-templates")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/events/" + UUID.randomUUID() + "/prizes")).andExpect(status().isUnauthorized());
    }
}
