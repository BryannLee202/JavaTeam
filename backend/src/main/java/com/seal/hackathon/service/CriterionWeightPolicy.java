package com.seal.hackathon.service;

import com.seal.hackathon.domain.entity.Criterion;
import com.seal.hackathon.exception.ApiException;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/**
 * Luat trong so: tong cac tieu chi trong cung mot vong (hoac mot bo mau) quy uoc
 * bang 100.
 *
 * Co y KHONG bat buoc tong phai du 100 ngay khi them tung tieu chi — neu bat buoc
 * thi khong ai them duoc tieu chi dau tien. Giao dien (CriteriaTab.tsx dong 220)
 * cung chi CANH BAO khi tong chua du chu khong chan.
 *
 * Cai bi chan la tong VUOT QUA 100, vi do la trang thai khong bao gio hop le.
 */
@Component
public class CriterionWeightPolicy {

    public static final BigDecimal MAX_TOTAL = new BigDecimal("100");

    /**
     * @param existing     cac tieu chi dang co
     * @param excludingId  id tieu chi dang sua (bo ra khoi tong cu), null khi them moi
     * @param newWeight    trong so sap ghi vao
     */
    public void assertFits(List<Criterion> existing, UUID excludingId, BigDecimal newWeight) {
        BigDecimal othersTotal = existing.stream()
                .filter(c -> excludingId == null || !c.getId().equals(excludingId))
                .map(Criterion::getWeight)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal total = othersTotal.add(newWeight);
        if (total.compareTo(MAX_TOTAL) > 0) {
            throw ApiException.badRequest(
                    "Tong trong so se thanh " + total.stripTrailingZeros().toPlainString()
                            + ", vuot qua 100. Cac tieu chi khac dang chiem "
                            + othersTotal.stripTrailingZeros().toPlainString()
                            + ", nen tieu chi nay nhieu nhat chi duoc "
                            + MAX_TOTAL.subtract(othersTotal).stripTrailingZeros().toPlainString() + ".");
        }
    }
}
