import clsx from "clsx";
import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";
import type { Task, TaskStatus } from "../../types";
import { TaskCard } from "./TaskCard";

const statusLabels: Record<TaskStatus, string> = {
  TODO: "A fazer",
  IN_PROGRESS: "Fazendo",
  DONE: "Concluido",
};

type TaskBoardColumn = {
  status: TaskStatus;
  title: string;
  tasks: Task[];
};

type TaskBoardProps = {
  columns: TaskBoardColumn[];
  onReorder: (taskId: number, status: TaskStatus, newPosition: number) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onAdvanceStatus: (task: Task) => void;
};

export function TaskBoard({ columns, onReorder, onEditTask, onDeleteTask, onAdvanceStatus }: TaskBoardProps) {
  function handleDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }
    const targetStatus = destination.droppableId as TaskStatus;
    const sourceStatus = source.droppableId as TaskStatus;
    const taskId = Number(draggableId);
    if (targetStatus === sourceStatus && destination.index === source.index) {
      return;
    }
    onReorder(taskId, targetStatus, destination.index);
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="board-grid">
        {columns.map((column) => (
          <Droppable droppableId={column.status} key={column.status}>
            {(provided, snapshot) => (
              <section
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={clsx("board-column", { "is-over": snapshot.isDraggingOver })}
              >
                <header className="board-column__header">
                  <div>
                    <span className="board-column__title">{column.title}</span>
                    <p>{statusLabels[column.status]}</p>
                  </div>
                  <span className="board-column__counter">{column.tasks.length}</span>
                </header>

                <div className="board-column__body">
                  {column.tasks.length === 0 && (
                    <p className="column-empty">Nenhuma tarefa aqui ainda.</p>
                  )}
                  {column.tasks.map((task, index) => (
                    <Draggable draggableId={String(task.id)} index={index} key={task.id}>
                      {(dragProvided, dragSnapshot) => (
                        <div
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          {...dragProvided.dragHandleProps}
                          className={clsx("draggable-card", { dragging: dragSnapshot.isDragging })}
                        >
                          <TaskCard
                            task={task}
                            onEdit={onEditTask}
                            onDelete={onDeleteTask}
                            onStatusAdvance={onAdvanceStatus}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </section>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
