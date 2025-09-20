package com.example.kanban.dto;

import com.example.kanban.model.TaskPriority;
import com.example.kanban.model.TaskStatus;
import java.time.Instant;
import java.time.LocalDate;

public record TaskResponse(
    Long id,
    String title,
    String description,
    TaskStatus status,
    TaskPriority priority,
    Integer position,
    LocalDate dueDate,
    Instant createdAt,
    Instant updatedAt
) {
}
