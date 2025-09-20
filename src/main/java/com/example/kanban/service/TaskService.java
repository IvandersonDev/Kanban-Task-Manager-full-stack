package com.example.kanban.service;

import com.example.kanban.dto.TaskMoveRequest;
import com.example.kanban.dto.TaskRequest;
import com.example.kanban.dto.TaskResponse;
import com.example.kanban.dto.TaskUpdateRequest;
import com.example.kanban.model.KanbanTask;
import com.example.kanban.model.TaskPriority;
import com.example.kanban.model.TaskStatus;
import com.example.kanban.model.UserAccount;
import com.example.kanban.repository.KanbanTaskRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final KanbanTaskRepository kanbanTaskRepository;

    @Transactional(readOnly = true)
    public List<TaskResponse> listTasks(UserAccount owner) {
        return kanbanTaskRepository.findAllByOwnerOrderByStatusAscPositionAsc(owner).stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> listTasksByStatus(UserAccount owner, TaskStatus status) {
        return kanbanTaskRepository.findAllByOwnerAndStatusOrderByPosition(owner, status).stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional
    public TaskResponse createTask(UserAccount owner, TaskRequest request) {
        KanbanTask task = new KanbanTask();
        task.setOwner(owner);
        task.setTitle(request.title().trim());
        task.setDescription(normalizeDescription(request.description()));
        task.setPriority(request.priority() != null ? request.priority() : TaskPriority.MEDIUM);
        task.setStatus(TaskStatus.TODO);
        task.setDueDate(request.dueDate());
        int nextPosition = kanbanTaskRepository.countByOwnerAndStatus(owner, TaskStatus.TODO);
        task.setPosition(nextPosition);
        KanbanTask saved = kanbanTaskRepository.save(task);
        return toResponse(saved);
    }

    @Transactional
    public TaskResponse updateTask(Long taskId, UserAccount owner, TaskUpdateRequest request) {
        KanbanTask task = kanbanTaskRepository.findByIdAndOwner(taskId, owner)
            .orElseThrow(() -> new EntityNotFoundException("Tarefa nao encontrada"));

        if (request.title() != null) {
            String trimmedTitle = request.title().trim();
            if (trimmedTitle.isEmpty()) {
                throw new IllegalArgumentException("Titulo nao pode ficar vazio");
            }
            task.setTitle(trimmedTitle);
        }
        if (request.description() != null) {
            task.setDescription(normalizeDescription(request.description()));
        }
        if (Boolean.TRUE.equals(request.removeDueDate())) {
            task.setDueDate(null);
        } else if (request.dueDate() != null) {
            task.setDueDate(request.dueDate());
        }
        if (request.priority() != null) {
            task.setPriority(request.priority());
        }
        if (request.status() != null && !Objects.equals(request.status(), task.getStatus())) {
            return moveTaskInternal(task, owner, new TaskMoveRequest(request.status(), null));
        }
        return toResponse(task);
    }

    @Transactional
    public TaskResponse moveTask(Long taskId, UserAccount owner, TaskMoveRequest request) {
        KanbanTask task = kanbanTaskRepository.findByIdAndOwner(taskId, owner)
            .orElseThrow(() -> new EntityNotFoundException("Tarefa nao encontrada"));
        return moveTaskInternal(task, owner, request);
    }

    @Transactional
    public void deleteTask(Long taskId, UserAccount owner) {
        KanbanTask task = kanbanTaskRepository.findByIdAndOwner(taskId, owner)
            .orElseThrow(() -> new EntityNotFoundException("Tarefa nao encontrada"));
        TaskStatus currentStatus = task.getStatus();
        kanbanTaskRepository.delete(task);
        reorderStatusPositions(owner, currentStatus, task.getId());
    }

    private TaskResponse moveTaskInternal(KanbanTask task, UserAccount owner, TaskMoveRequest request) {
        TaskStatus targetStatus = request.status();
        if (targetStatus == null) {
            throw new IllegalArgumentException("Status alvo eh obrigatorio");
        }

        TaskStatus currentStatus = task.getStatus();
        List<KanbanTask> currentStatusTasks = new ArrayList<>(
            kanbanTaskRepository.findAllByOwnerAndStatusOrderByPosition(owner, currentStatus)
        );
        currentStatusTasks.removeIf(existing -> existing.getId().equals(task.getId()));

        if (!currentStatus.equals(targetStatus)) {
            task.setStatus(targetStatus);
            kanbanTaskRepository.saveAll(currentStatusTasks);
        }

        List<KanbanTask> targetStatusTasks;
        if (currentStatus.equals(targetStatus)) {
            targetStatusTasks = currentStatusTasks;
        } else {
            targetStatusTasks = new ArrayList<>(
                kanbanTaskRepository.findAllByOwnerAndStatusOrderByPosition(owner, targetStatus)
            );
        }

        int desiredPosition = request.newPosition() != null ? request.newPosition() : targetStatusTasks.size();
        desiredPosition = Math.max(0, Math.min(desiredPosition, targetStatusTasks.size()));
        targetStatusTasks.add(desiredPosition, task);

        reorderSequentially(currentStatusTasks, currentStatus);
        reorderSequentially(targetStatusTasks, targetStatus);

        kanbanTaskRepository.saveAll(targetStatusTasks);
        if (!currentStatus.equals(targetStatus)) {
            kanbanTaskRepository.saveAll(currentStatusTasks);
        }

        return toResponse(task);
    }

    private void reorderStatusPositions(UserAccount owner, TaskStatus status, Long excludedTaskId) {
        List<KanbanTask> tasks = new ArrayList<>(
            kanbanTaskRepository.findAllByOwnerAndStatusOrderByPosition(owner, status)
        );
        tasks.removeIf(task -> task.getId().equals(excludedTaskId));
        reorderSequentially(tasks, status);
        kanbanTaskRepository.saveAll(tasks);
    }

    private void reorderSequentially(List<KanbanTask> tasks, TaskStatus status) {
        for (int i = 0; i < tasks.size(); i++) {
            KanbanTask task = tasks.get(i);
            task.setStatus(status);
            task.setPosition(i);
        }
    }

    private String normalizeDescription(String description) {
        if (description == null) {
            return null;
        }
        String trimmed = description.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private TaskResponse toResponse(KanbanTask task) {
        return new TaskResponse(
            task.getId(),
            task.getTitle(),
            task.getDescription(),
            task.getStatus(),
            task.getPriority(),
            task.getPosition(),
            task.getDueDate(),
            task.getCreatedAt(),
            task.getUpdatedAt()
        );
    }
}
