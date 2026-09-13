package com.seal.hackathon.dto.auth;

import com.seal.hackathon.domain.enums.UserCategory;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Ho ten khong duoc de trong")
        String fullName,

        @NotBlank(message = "Email khong duoc de trong")
        @Email(message = "Email khong dung dinh dang")
        String email,

        @NotBlank(message = "Mat khau khong duoc de trong")
        @Size(min = 8, message = "Mat khau phai tu 8 ky tu tro len")
        String password,

        @NotNull(message = "Phai chon doi tuong du thi")
        UserCategory userCategory,

        String studentCode,

        String schoolName
) {}
