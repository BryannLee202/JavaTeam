package com.sealhackathon.coordinator.round;

import com.sealhackathon.coordinator.common.exception.BusinessRuleException;
import com.sealhackathon.coordinator.common.exception.ResourceNotFoundException;
import com.sealhackathon.coordinator.round.dto.RoundCriterionRequest;
import com.sealhackathon.coordinator.round.dto.RoundCriterionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * CRUD chi tiết cho từng tiêu chí — dùng khi frontend cần sửa/xoá một tiêu chí
 * riêng lẻ thay vì gửi lại toàn bộ RoundRequest (ví dụ thao tác kéo-thả sắp xếp).
 * Không validate tổng trọng số = 100% ở đây (cho phép trạng thái tạm thời không
 * hợp lệ trong lúc chỉnh sửa) — việc đó chỉ bắt buộc khi RoundService lưu cả Round.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class RoundCriterionService {

    private final RoundCriterionRepository criterionRepository;
    private final RoundService roundService;

    @Transactional(readOnly = true)
    public List<RoundCriterionResponse> list(Long eventId, Long roundId) {
        roundService.findEntity(eventId, roundId);
        return criterionRepository.findAllByRoundIdOrderByOrderIndexAsc(roundId).stream().map(this::toResponse).toList();
    }

    public RoundCriterionResponse add(Long eventId, Long roundId, RoundCriterionRequest request) {
        Round round = roundService.findEntity(eventId, roundId);
        validateWeightRange(request.weight());
        // Frontend không gửi orderIndex — nối vào cuối danh sách tiêu chí hiện có.
        int nextOrderIndex = round.getCriteria().size();
        RoundCriterion criterion = new RoundCriterion(round, request.name(), request.weight(), nextOrderIndex);
        round.getCriteria().add(criterion);
        return toResponse(criterionRepository.save(criterion));
    }

    public RoundCriterionResponse update(Long eventId, Long roundId, Long criterionId, RoundCriterionRequest request) {
        roundService.findEntity(eventId, roundId);
        RoundCriterion criterion = findEntity(roundId, criterionId);
        validateWeightRange(request.weight());
        // Không đổi thứ tự khi sửa tên/trọng số — cần endpoint reorder riêng nếu sau này cần kéo-thả sắp xếp lại.
        criterion.applyFields(request.name(), request.weight(), criterion.getOrderIndex());
        return toResponse(criterion);
    }

    public void delete(Long eventId, Long roundId, Long criterionId) {
        roundService.findEntity(eventId, roundId);
        RoundCriterion criterion = findEntity(roundId, criterionId);
        criterionRepository.delete(criterion);
    }

    private RoundCriterion findEntity(Long roundId, Long criterionId) {
        return criterionRepository.findByIdAndRoundId(criterionId, roundId)
                .orElseThrow(() -> ResourceNotFoundException.of("Tiêu chí chấm điểm", criterionId));
    }

    private void validateWeightRange(Integer weight) {
        if (weight == null || weight < 0 || weight > 100) {
            throw new BusinessRuleException("Trọng số tiêu chí phải trong khoảng 0–100.");
        }
    }

    private RoundCriterionResponse toResponse(RoundCriterion criterion) {
        return new RoundCriterionResponse(
                criterion.getId(),
                criterion.getRound().getId(),
                criterion.getName(),
                criterion.getWeight()
        );
    }
}
