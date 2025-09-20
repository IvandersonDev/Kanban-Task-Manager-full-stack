package com.example.kanban.repository;

import com.example.kanban.model.KanbanTask;
import com.example.kanban.model.TaskStatus;
import com.example.kanban.model.UserAccount;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KanbanTaskRepository extends JpaRepository<KanbanTask, Long> {

    List<KanbanTask> findAllByOwnerOrderByStatusAscPositionAsc(UserAccount owner);

    List<KanbanTask> findAllByOwnerAndStatusOrderByPosition(UserAccount owner, TaskStatus status);

    Optional<KanbanTask> findByIdAndOwner(Long id, UserAccount owner);

    int countByOwnerAndStatus(UserAccount owner, TaskStatus status);
}
