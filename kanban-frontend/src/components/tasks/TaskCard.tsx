import clsx from "clsx";
import { format, isBefore, parseISO } from "date-fns";
import { CalendarDays, Clock3, Pencil, Trash2 } from "lucide-react";
import type { Task, TaskStatus } from "../../types";

type TaskCardProps = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusAdvance: (task: Task) => void;
};

const priorityLabels: Record<Task["priority"], string> = {
  HIGH: "Alta prioridade",
  MEDIUM: "Prioridade media",
  LOW: "Prioridade baixa",
};

const statusOrder: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

function formatDue(value: string | null) {
  if (!value) {
    return "Sem data";
  }
  try {
    return format(parseISO(value), "dd MMM");
  } catch (err) {
    return value;
  }
}

export function TaskCard({ task, onEdit, onDelete, onStatusAdvance }: TaskCardProps) {
  const priorityClass = clsx("badge", {
    "badge-high": task.priority === "HIGH",
    "badge-medium": task.priority === "MEDIUM",
    "badge-low": task.priority === "LOW",
  });

  let dueSoon = false;
  if (task.dueDate) {
    try {
      dueSoon = isBefore(parseISO(task.dueDate), new Date());
    } catch (error) {
      dueSoon = false;
    }
  }
  const nextStatusIndex = statusOrder.indexOf(task.status) + 1;
  const hasNextStatus = nextStatusIndex < statusOrder.length;

  return (
    <article className="task-card">
      <header className="task-card__header">
        <div>
          <span className={priorityClass} title={priorityLabels[task.priority]}>
            {task.priority === "HIGH" ? "Alta" : task.priority === "MEDIUM" ? "Media" : "Baixa"}
          </span>
          <h3>{task.title}</h3>
        </div>
        <div className="task-card__actions">
          <button type="button" className="icon-button" onClick={() => onEdit(task)} aria-label="Editar tarefa">
            <Pencil size={16} />
          </button>
          <button
            type="button"
            className="icon-button danger"
            onClick={() => onDelete(task)}
            aria-label="Excluir tarefa"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </header>

      {task.description && <p className="task-card__description">{task.description}</p>}

      <dl className="task-card__meta">
        <div>
          <dt>Status</dt>
          <dd>{task.status === "TODO" ? "A fazer" : task.status === "IN_PROGRESS" ? "Fazendo" : "Concluido"}</dd>
        </div>
        <div>
          <dt>Atualizado</dt>
          <dd>
            <Clock3 size={14} /> {format(parseISO(task.updatedAt), "dd/MM HH:mm")}
          </dd>
        </div>
        <div>
          <dt>Entrega</dt>
          <dd className={clsx({ warning: dueSoon })}>
            <CalendarDays size={14} /> {formatDue(task.dueDate)}
          </dd>
        </div>
      </dl>

      <footer className="task-card__footer">
        {hasNextStatus ? (
          <button type="button" className="btn-outline" onClick={() => onStatusAdvance(task)}>
            Avancar para {statusOrder[nextStatusIndex] === "IN_PROGRESS" ? "Fazendo" : "Concluido"}
          </button>
        ) : (
          <span className="task-card__done">Workflow finalizado</span>
        )}
      </footer>
    </article>
  );
}
