package com.example.kanban.dto;

import com.example.kanban.model.TaskPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record TaskRequest(
    @NotBlank @Size(max = 140) String title,
    @Size(max = 2000) String description,
    LocalDate dueDate,
    TaskPriority priority
) {
}
