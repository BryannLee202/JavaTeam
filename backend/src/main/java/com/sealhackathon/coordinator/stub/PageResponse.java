package com.sealhackathon.coordinator.stub;

import java.util.List;

public record PageResponse<T>(List<T> items, int page, int pageSize, long total) {
    public static <T> PageResponse<T> empty(int page, int pageSize) {
        return new PageResponse<>(List.of(), page, pageSize, 0);
    }
}
