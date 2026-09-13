package com.sealhackathon.coordinator.round;

import com.sealhackathon.coordinator.common.exception.BusinessRuleException;
import com.sealhackathon.coordinator.common.exception.ResourceNotFoundException;
import com.sealhackathon.coordinator.event.EventService;
import com.sealhackathon.coordinator.event.HackathonEvent;
import com.sealhackathon.coordinator.round.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class RoundService {

    private final RoundRepository roundRepository;
    private final EventService eventService;

    @Transactional(readOnly = true)
    public List<RoundResponse> listByEvent(Long eventId) {
        eventService.findEntity(eventId);
        return roundRepository.findAllByEventIdOrderByOrderIndexAsc(eventId).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public RoundResponse getById(Long eventId, Long roundId) {
        return toResponse(findEntity(eventId, roundId));
    }

    public RoundResponse create(Long eventId, RoundRequest request) {
        HackathonEvent event = eventService.findEntity(eventId);
        validateCriteriaWeights(request.criteria());
        validateOrderAvailable(eventId, request.order(), null);

        Round round = new Round(event, request.name(), request.order(), request.submissionDeadline(), request.promotionRule().topNPerTrack());
        round.replaceCriteria(toCriterionEntities(request.criteria()));
        return toResponse(roundRepository.save(round));
    }

    public RoundResponse update(Long eventId, Long roundId, RoundRequest request) {
        Round round = findEntity(eventId, roundId);
        validateCriteriaWeights(request.criteria());
        validateOrderAvailable(eventId, request.order(), roundId);

        round.applyFields(request.name(), request.order(), request.submissionDeadline(), request.promotionRule().topNPerTrack());
        round.replaceCriteria(toCriterionEntities(request.criteria()));
        return toResponse(round);
    }

    public void delete(Long eventId, Long roundId) {
        Round round = findEntity(eventId, roundId);
        roundRepository.delete(round);
    }

    public RoundResponse assignJudge(Long eventId, Long roundId, Long judgeId) {
        Round round = findEntity(eventId, roundId);
        round.assignJudge(judgeId);
        return toResponse(round);
    }

    public RoundResponse unassignJudge(Long eventId, Long roundId, Long judgeId) {
        Round round = findEntity(eventId, roundId);
        round.unassignJudge(judgeId);
        return toResponse(round);
    }

    // ---- helpers -----------------------------------------------------------

    Round findEntity(Long eventId, Long roundId) {
        return roundRepository.findByIdAndEventId(roundId, eventId)
                .orElseThrow(() -> ResourceNotFoundException.of("Vòng thi", roundId));
    }

    /** Tổng trọng số các tiêu chí trong một vòng thi phải đúng 100%. */
    private void validateCriteriaWeights(List<RoundCriterionRequest> criteria) {
        int sum = criteria.stream().mapToInt(RoundCriterionRequest::weight).sum();
        if (sum != 100) {
            throw new BusinessRuleException("Tổng trọng số tiêu chí phải bằng 100%% (hiện tại: %d%%).".formatted(sum));
        }
    }

    /** Mỗi order chỉ được dùng một lần trong cùng một sự kiện (không hai vòng thi trùng thứ tự). */
    private void validateOrderAvailable(Long eventId, Integer order, Long excludingRoundId) {
        boolean taken = excludingRoundId == null
                ? roundRepository.orderIndexTaken(eventId, order)
                : roundRepository.existsByEventIdAndOrderIndexAndIdNot(eventId, order, excludingRoundId);
        if (taken) {
            throw new BusinessRuleException("Thứ tự vòng thi (%d) đã được dùng trong sự kiện này.".formatted(order));
        }
    }

    /** Frontend không gửi thứ tự tiêu chí — dùng luôn vị trí trong mảng làm orderIndex nội bộ. */
    private List<RoundCriterion> toCriterionEntities(List<RoundCriterionRequest> requests) {
        List<RoundCriterion> result = new ArrayList<>();
        for (int i = 0; i < requests.size(); i++) {
            RoundCriterionRequest r = requests.get(i);
            result.add(new RoundCriterion(null, r.name(), r.weight(), i));
        }
        return result;
    }

    private RoundResponse toResponse(Round round) {
        List<RoundCriterionResponse> criteria = round.getCriteria().stream()
                .map(c -> new RoundCriterionResponse(c.getId(), round.getId(), c.getName(), c.getWeight()))
                .toList();
        return new RoundResponse(
                round.getId(),
                round.getEvent().getId(),
                round.getName(),
                round.getOrderIndex(),
                round.getSubmissionDeadline(),
                criteria,
                new PromotionRuleDto(round.getTopNPerTrack()),
                round.getJudgeIds()
        );
    }
}
