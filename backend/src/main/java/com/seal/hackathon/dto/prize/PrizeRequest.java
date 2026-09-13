package com.seal.hackathon.dto.prize;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

/** trackId = null nghia la giai chung cho ca su kien. */
public record PrizeRequest(
        @NotBlank(message = "Ten giai thuong khong duoc de trong")
        String name,

        UUID trackId,

        @Min(value = 1, message = "Hang trao giai phai tu 1 tro len")
        int rankCondition
) {}
