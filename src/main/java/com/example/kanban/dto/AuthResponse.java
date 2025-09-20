package com.example.kanban.dto;

public record AuthResponse(String accessToken, String tokenType, long expiresIn) {
}
