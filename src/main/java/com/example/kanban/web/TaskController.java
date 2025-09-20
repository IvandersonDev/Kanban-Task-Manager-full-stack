package com.example.kanban.web;

import com.example.kanban.dto.TaskMoveRequest;
import com.example.kanban.dto.TaskRequest;
import com.example.kanban.dto.TaskResponse;
import com.example.kanban.dto.TaskUpdateRequest;
import com.example.kanban.model.TaskStatus;
import com.example.kanban.model.UserAccount;
import com.example.kanban.service.PdfExportService;
import com.example.kanban.service.TaskService;
import jakarta.validation.Valid;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private static final DateTimeFormatter FILE_DATE_FORMAT = DateTimeFormatter.ofPattern("yyyyMMdd-HHmm")
        .withZone(ZoneId.systemDefault());

    private final TaskService taskService;
    private final PdfExportService pdfExportService;

    @GetMapping
    public ResponseEntity<List<TaskResponse>> list(@AuthenticationPrincipal UserAccount user) {
        return ResponseEntity.ok(taskService.listTasks(user));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<TaskResponse>> listByStatus(
        @AuthenticationPrincipal UserAccount user,
        @PathVariable String status
    ) {
        TaskStatus parsedStatus;
        try {
            parsedStatus = TaskStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Status invalido: " + status);
        }
        return ResponseEntity.ok(taskService.listTasksByStatus(user, parsedStatus));
    }

    @GetMapping("/export/pdf")
    public ResponseEntity<byte[]> export(
        @AuthenticationPrincipal UserAccount user
    ) {
        List<TaskResponse> tasks = taskService.listTasks(user);
        byte[] pdf = pdfExportService.exportTasks(user, tasks);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment()
            .filename("kanban-tarefas-" + FILE_DATE_FORMAT.format(Instant.now()) + ".pdf")
            .build());
        return ResponseEntity.ok()
            .headers(headers)
            .body(pdf);
    }

    @PostMapping
    public ResponseEntity<TaskResponse> create(
        @AuthenticationPrincipal UserAccount user,
        @Valid @RequestBody TaskRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.createTask(user, request));
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<TaskResponse> update(
        @AuthenticationPrincipal UserAccount user,
        @PathVariable Long taskId,
        @Valid @RequestBody TaskUpdateRequest request
    ) {
        return ResponseEntity.ok(taskService.updateTask(taskId, user, request));
    }

    @PatchMapping("/{taskId}/move")
    public ResponseEntity<TaskResponse> move(
        @AuthenticationPrincipal UserAccount user,
        @PathVariable Long taskId,
        @Valid @RequestBody TaskMoveRequest request
    ) {
        return ResponseEntity.ok(taskService.moveTask(taskId, user, request));
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> delete(
        @AuthenticationPrincipal UserAccount user,
        @PathVariable Long taskId
    ) {
        taskService.deleteTask(taskId, user);
        return ResponseEntity.noContent().build();
    }
}
