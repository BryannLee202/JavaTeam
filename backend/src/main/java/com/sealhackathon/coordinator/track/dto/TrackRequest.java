package com.sealhackathon.coordinator.track.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TrackRequest(
        @NotBlank(message = "Tên hạng mục không được để trống")
        @Size(max = 150, message = "Tên hạng mục tối đa 150 ký tự")
        String name,

        @Size(max = 1000, message = "Mô tả tối đa 1000 ký tự")
        String description,

        Long mentorId
) {
}
