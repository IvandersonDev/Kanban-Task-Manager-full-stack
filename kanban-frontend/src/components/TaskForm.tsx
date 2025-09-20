import { useState } from "react";
import type { TaskPriority, TaskRequest } from "../types";

type Props = {
  onSubmit: (payload: TaskRequest) => Promise<void>;
  isSubmitting: boolean;
};

const priorities: Array<{ label: string; value: TaskPriority }> = [
  { label: "Alta", value: "HIGH" },
  { label: "Media", value: "MEDIUM" },
  { label: "Baixa", value: "LOW" },
];

export function TaskForm({ onSubmit, isSubmitting }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) {
      return;
    }
    await onSubmit({
      title: title.trim(),
      description: description.trim() ? description.trim() : undefined,
      dueDate: dueDate ? dueDate : undefined,
      priority,
    });
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("MEDIUM");
  }

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <h2>Criar tarefa</h2>
      <label>
        Titulo
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Defina um titulo"
          required
        />
      </label>
      <label>
        Descricao
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Detalhes opcionais"
          rows={3}
        />
      </label>
      <div className="grid-2">
        <label>
          Prazo
          <input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />
        </label>
        <label>
          Prioridade
          <select
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value as TaskPriority)
            }
          >
            {priorities.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Adicionar"}
      </button>
    </form>
  );
}
