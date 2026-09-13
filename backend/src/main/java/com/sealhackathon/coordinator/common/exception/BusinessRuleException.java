package com.sealhackathon.coordinator.common.exception;

/** Thrown for business-rule violations that aren't simple bean-validation failures (e.g. criteria weights must sum to 100). Mapped to HTTP 400. */
public class BusinessRuleException extends RuntimeException {
    public BusinessRuleException(String message) {
        super(message);
    }
}
