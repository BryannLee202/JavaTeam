package com.sealhackathon.coordinator.common.exception;

/** Thrown when a coordinator tries to move an event to a status not reachable from its current one. Mapped to HTTP 409. */
public class InvalidStateTransitionException extends RuntimeException {
    public InvalidStateTransitionException(String message) {
        super(message);
    }
}
