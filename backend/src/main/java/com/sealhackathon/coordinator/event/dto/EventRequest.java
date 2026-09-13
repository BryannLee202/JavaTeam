package com.sealhackathon.coordinator.event.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record EventRequest(
        @NotBlank(message = "Tên sự kiện không được để trống")
        @Size(max = 200, message = "Tên sự kiện tối đa 200 ký tự")
        String name,

        @Size(max = 2000, message = "Mô tả tối đa 2000 ký tự")
        String description,

        @NotNull(message = "Ngày bắt đầu không được để trống")
        LocalDate startDate,

        @NotNull(message = "Ngày kết thúc không được để trống")
        LocalDate endDate,

        Long criteriaTemplateId
) {
}
