package com.example.kanban.dto;

import com.example.kanban.model.TaskStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record TaskMoveRequest(
    @NotNull TaskStatus status,
    @Min(0) Integer newPosition
) {
}
