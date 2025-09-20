package com.example.kanban.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
    @NotBlank @Size(min = 3, max = 40) String username,
    @NotBlank @Size(min = 8, max = 120) String password,
    @NotBlank @Size(max = 120) String fullName,
    @Email @NotBlank @Size(max = 180) String email
) {
}
