package com.seal.hackathon.service;

import com.seal.hackathon.domain.entity.Criterion;
import com.seal.hackathon.exception.ApiException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Luat trong so cua BE-3: tong cac tieu chi trong cung mot vong quy uoc bang 100.
 * Kiem tra logic thuan, khong can Spring context.
 */
class CriterionWeightPolicyTest {

    private final CriterionWeightPolicy policy = new CriterionWeightPolicy();

    private Criterion criterion(String weight) {
        Criterion c = new Criterion();
        c.setId(UUID.randomUUID());
        c.setWeight(new BigDecimal(weight));
        return c;
    }

    @Test
    @DisplayName("Cho phep tong chua du 100 — giao dien chi canh bao chu khong chan")
    void allowsPartialTotal() {
        assertDoesNotThrow(() ->
                policy.assertFits(List.of(criterion("30")), null, new BigDecimal("20")));
    }

    @Test
    @DisplayName("Cho phep tong dung bang 100")
    void allowsExactlyOneHundred() {
        assertDoesNotThrow(() ->
                policy.assertFits(List.of(criterion("60"), criterion("30")), null, new BigDecimal("10")));
    }

    @Test
    @DisplayName("Chan khi tong vuot qua 100")
    void rejectsOverflow() {
        ApiException ex = assertThrows(ApiException.class, () ->
                policy.assertFits(List.of(criterion("70")), null, new BigDecimal("40")));
        assertTrue(ex.getMessage().contains("vuot qua 100"), ex.getMessage());
        assertEquals(400, ex.getStatus().value());
    }

    @Test
    @DisplayName("Bao ro con du bao nhieu trong so")
    void reportsRemainingBudget() {
        ApiException ex = assertThrows(ApiException.class, () ->
                policy.assertFits(List.of(criterion("85")), null, new BigDecimal("20")));
        assertTrue(ex.getMessage().contains("15"), ex.getMessage());
    }

    @Test
    @DisplayName("Khi sua mot tieu chi thi bo chinh no ra khoi tong cu")
    void excludesCriterionBeingEdited() {
        Criterion editing = criterion("40");
        // 60 (cai khac) + 40 (ban moi) = 100 -> hop le, vi 40 cu da duoc tru ra
        assertDoesNotThrow(() ->
                policy.assertFits(List.of(criterion("60"), editing), editing.getId(), new BigDecimal("40")));
    }

    @Test
    @DisplayName("Tieu chi dau tien luon duoc chap nhan")
    void allowsFirstCriterion() {
        assertDoesNotThrow(() ->
                policy.assertFits(List.of(), null, new BigDecimal("100")));
    }
}
