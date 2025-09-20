package com.example.kanban.dto;

import com.example.kanban.model.TaskPriority;
import com.example.kanban.model.TaskStatus;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record TaskUpdateRequest(
    @Size(max = 140) String title,
    @Size(max = 2000) String description,
    LocalDate dueDate,
    Boolean removeDueDate,
    TaskPriority priority,
    TaskStatus status
) {
}
