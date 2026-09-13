package com.sealhackathon.coordinator.common.exception;

/** Thrown when an Event/Track/Round/Criterion id doesn't exist. Mapped to HTTP 404. */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }

    public static ResourceNotFoundException of(String entity, Object id) {
        return new ResourceNotFoundException(entity + " không tồn tại (id=" + id + ")");
    }
}
