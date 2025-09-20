import type { Task, TaskStatus } from "../types";
import { TaskCard } from "./TaskCard";

type Props = {
  title: string;
  tasks: Task[];
  onStatusChange: (taskId: number, status: TaskStatus) => Promise<void>;
  onDelete: (taskId: number) => Promise<void>;
  onMove: (taskId: number, status: TaskStatus, position: number) => Promise<void>;
};

export function TaskColumn({ title, tasks, onStatusChange, onDelete, onMove }: Props) {
  return (
    <section className="column">
      <header>
        <h2>{title}</h2>
        <span className="counter">{tasks.length}</span>
      </header>
      <div className="column-body">
        {tasks.length === 0 ? (
          <p className="empty">Sem tarefas nesta coluna.</p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
              onMove={onMove}
            />
          ))
        )}
      </div>
    </section>
  );
}
