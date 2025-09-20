import { useState } from "react";
import type { Task, TaskStatus } from "../types";

type Props = {
  task: Task;
  onStatusChange: (taskId: number, status: TaskStatus) => Promise<void>;
  onDelete: (taskId: number) => Promise<void>;
  onMove: (taskId: number, status: TaskStatus, position: number) => Promise<void>;
};

const statuses: Array<{ label: string; value: TaskStatus }> = [
  { label: "A Fazer", value: "TODO" },
  { label: "Fazendo", value: "IN_PROGRESS" },
  { label: "Concluido", value: "DONE" },
];

export function TaskCard({ task, onStatusChange, onDelete, onMove }: Props) {
  const [isMoving, setIsMoving] = useState(false);
  const [targetStatus, setTargetStatus] = useState<TaskStatus>(task.status);
  const [position, setPosition] = useState<number>(task.position);

  async function handleStatusChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const status = event.target.value as TaskStatus;
    await onStatusChange(task.id, status);
  }

  async function handleDelete() {
    if (confirm("Remover esta tarefa?")) {
      await onDelete(task.id);
    }
  }

  async function handleMoveSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onMove(task.id, targetStatus, position);
    setIsMoving(false);
  }

  const priorityClass = `tag tag-${task.priority.toLowerCase()}`;

  return (
    <article className="task-card">
      <header>
        <h3>{task.title}</h3>
        <span className={priorityClass}>{task.priority}</span>
      </header>
      {task.description && <p>{task.description}</p>}
      <dl>
        <div>
          <dt>Status</dt>
          <dd>
            <select value={task.status} onChange={handleStatusChange}>
              {statuses.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </dd>
        </div>
        <div>
          <dt>Posicao</dt>
          <dd>{task.position + 1}</dd>
        </div>
        <div>
          <dt>Prazo</dt>
          <dd>{task.dueDate ?? "Sem data"}</dd>
        </div>
      </dl>
      <footer>
        <button type="button" onClick={() => setIsMoving((state) => !state)}>
          {isMoving ? "Cancelar" : "Mover"}
        </button>
        <button type="button" className="danger" onClick={handleDelete}>
          Excluir
        </button>
      </footer>
      {isMoving && (
        <form className="move-form" onSubmit={handleMoveSubmit}>
          <div>
            <label>
              Coluna
              <select
                value={targetStatus}
                onChange={(event) =>
                  setTargetStatus(event.target.value as TaskStatus)
                }
              >
                {statuses.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Posicao
              <input
                type="number"
                min={1}
                value={position + 1}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  setPosition(value > 0 ? value - 1 : 0);
                }}
              />
            </label>
          </div>
          <button type="submit">Aplicar</button>
        </form>
      )}
    </article>
  );
}
