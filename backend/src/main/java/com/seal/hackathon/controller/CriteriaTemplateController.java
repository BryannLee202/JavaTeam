package com.seal.hackathon.controller;

import com.seal.hackathon.dto.criteria.CriteriaTemplateRequest;
import com.seal.hackathon.dto.criteria.CriteriaTemplateResponse;
import com.seal.hackathon.dto.criteria.CriterionRequest;
import com.seal.hackathon.dto.criteria.CriterionResponse;
import com.seal.hackathon.service.CriteriaTemplateService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/criteria-templates")
@PreAuthorize("hasRole('COORDINATOR')")
public class CriteriaTemplateController {

    private final CriteriaTemplateService templateService;

    public CriteriaTemplateController(CriteriaTemplateService templateService) {
        this.templateService = templateService;
    }

    @GetMapping
    public List<CriteriaTemplateResponse> list() {
        return templateService.list();
    }

    @GetMapping("/{templateId}")
    public CriteriaTemplateResponse get(@PathVariable UUID templateId) {
        return templateService.get(templateId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CriteriaTemplateResponse create(@Valid @RequestBody CriteriaTemplateRequest request) {
        return templateService.create(request);
    }

    @PostMapping("/{templateId}/criteria")
    @ResponseStatus(HttpStatus.CREATED)
    public CriterionResponse addCriterion(
            @PathVariable UUID templateId,
            @Valid @RequestBody CriterionRequest request
    ) {
        return templateService.addCriterion(templateId, request);
    }

    @DeleteMapping("/{templateId}/criteria/{criterionId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeCriterion(@PathVariable UUID templateId, @PathVariable UUID criterionId) {
        templateService.removeCriterion(templateId, criterionId);
    }
}
