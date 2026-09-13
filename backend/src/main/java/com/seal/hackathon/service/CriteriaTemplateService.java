package com.seal.hackathon.service;

import com.seal.hackathon.domain.entity.CriteriaTemplate;
import com.seal.hackathon.domain.entity.Criterion;
import com.seal.hackathon.dto.criteria.CriteriaTemplateRequest;
import com.seal.hackathon.dto.criteria.CriteriaTemplateResponse;
import com.seal.hackathon.dto.criteria.CriterionRequest;
import com.seal.hackathon.dto.criteria.CriterionResponse;
import com.seal.hackathon.exception.ApiException;
import com.seal.hackathon.repository.CriteriaTemplateRepository;
import com.seal.hackathon.repository.CriterionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/** Quan ly cac bo tieu chi mau dung lai duoc giua nhieu su kien. */
@Service
public class CriteriaTemplateService {

    private final CriteriaTemplateRepository templateRepository;
    private final CriterionRepository criterionRepository;
    private final CriterionWeightPolicy weightPolicy;

    public CriteriaTemplateService(
            CriteriaTemplateRepository templateRepository,
            CriterionRepository criterionRepository,
            CriterionWeightPolicy weightPolicy
    ) {
        this.templateRepository = templateRepository;
        this.criterionRepository = criterionRepository;
        this.weightPolicy = weightPolicy;
    }

    @Transactional(readOnly = true)
    public List<CriteriaTemplateResponse> list() {
        return templateRepository.findAll().stream()
                .map(t -> CriteriaTemplateResponse.from(t, criteriaOf(t.getId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public CriteriaTemplateResponse get(UUID templateId) {
        CriteriaTemplate template = findOrThrow(templateId);
        return CriteriaTemplateResponse.from(template, criteriaOf(templateId));
    }

    @Transactional
    public CriteriaTemplateResponse create(CriteriaTemplateRequest request) {
        CriteriaTemplate template = CriteriaTemplate.builder()
                .name(request.name())
                .description(request.description())
                .isDefault(false)
                .build();
        return CriteriaTemplateResponse.from(templateRepository.save(template), List.of());
    }

    @Transactional
    public CriterionResponse addCriterion(UUID templateId, CriterionRequest request) {
        CriteriaTemplate template = findOrThrow(templateId);
        weightPolicy.assertFits(criterionRepository.findByTemplateId(templateId), null, request.weight());

        Criterion criterion = Criterion.builder()
                .template(template)
                .name(request.name())
                .description(request.description())
                .weight(request.weight())
                .maxScore(request.maxScore())
                .build();
        return CriterionResponse.from(criterionRepository.save(criterion));
    }

    @Transactional
    public void removeCriterion(UUID templateId, UUID criterionId) {
        Criterion criterion = criterionRepository.findById(criterionId)
                .orElseThrow(() -> ApiException.notFound("Khong tim thay tieu chi"));
        if (criterion.getTemplate() == null || !criterion.getTemplate().getId().equals(templateId)) {
            throw ApiException.badRequest("Tieu chi nay khong thuoc bo mau da chon");
        }
        criterionRepository.delete(criterion);
    }

    private List<CriterionResponse> criteriaOf(UUID templateId) {
        return criterionRepository.findByTemplateId(templateId).stream()
                .map(CriterionResponse::from)
                .toList();
    }

    private CriteriaTemplate findOrThrow(UUID templateId) {
        return templateRepository.findById(templateId)
                .orElseThrow(() -> ApiException.notFound("Khong tim thay bo tieu chi mau"));
    }
}
