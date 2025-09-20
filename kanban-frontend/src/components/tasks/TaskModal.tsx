import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import type { Task, TaskPriority, TaskStatus, TaskRequest, TaskUpdateRequest } from "../../types";
import { Calendar, Flag, ListChecks, X } from "lucide-react";

const priorities: Array<{ label: string; value: TaskPriority }> = [
  { label: "Alta", value: "HIGH" },
  { label: "Media", value: "MEDIUM" },
  { label: "Baixa", value: "LOW" },
];

const statuses: Array<{ label: string; value: TaskStatus }> = [
  { label: "A fazer", value: "TODO" },
  { label: "Fazendo", value: "IN_PROGRESS" },
  { label: "Concluido", value: "DONE" },
];

type TaskModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initialTask?: Task | null;
  onClose: () => void;
  onSubmit: (payload: TaskRequest | TaskUpdateRequest) => Promise<void>;
};

const modalRoot = typeof document !== "undefined" ? document.body : null;

export function TaskModal({ open, mode, initialTask, onClose, onSubmit }: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [status, setStatus] = useState<TaskStatus>("TODO");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description ?? "");
      setDueDate(initialTask.dueDate ?? "");
      setPriority(initialTask.priority);
      setStatus(initialTask.status);
    } else {
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("MEDIUM");
      setStatus("TODO");
    }
  }, [open, initialTask]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) {
      return;
    }
    setIsSubmitting(true);
    try {
      if (mode === "create") {
        await onSubmit({
          title: title.trim(),
          description: description.trim() ? description.trim() : undefined,
          dueDate: dueDate || undefined,
          priority,
        });
      } else {
        const trimmedDescription = description.trim();
        const updatePayload: TaskUpdateRequest = {
          title: title.trim(),
          description: trimmedDescription ? trimmedDescription : "",
          priority,
          status,
        };
        if (dueDate) {
          updatePayload.dueDate = dueDate;
        } else {
          updatePayload.removeDueDate = true;
        }
        await onSubmit(updatePayload);
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!open || !modalRoot) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card">
        <header className="modal-header">
          <div>
            <span className="modal-badge">{mode === "create" ? "Adicionar" : "Editar"}</span>
            <h2>{mode === "create" ? "Nova tarefa" : "Atualizar tarefa"}</h2>
            <p>Preencha os campos abaixo para {mode === "create" ? "criar" : "alterar"} uma tarefa.</p>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Fechar modal">
            <X size={18} />
          </button>
        </header>

        <form className="modal-form" onSubmit={handleSubmit}>
          <label>
            Titulo da tarefa
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Resumo claro e objetivo"
              required
            />
          </label>

          <label>
            Descricao detalhada
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Inclua contexto, entregaveis e expectativas"
              rows={4}
            />
          </label>

          <div className="modal-grid">
            <label>
              <span className="field-label">
                <Flag size={16} /> Prioridade
              </span>
              <select value={priority} onChange={(event) => setPriority(event.target.value as TaskPriority)}>
                {priorities.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="field-label">
                <Calendar size={16} /> Prazo
              </span>
              <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
            </label>

            {mode === "edit" && (
              <label>
                <span className="field-label">
                  <ListChecks size={16} /> Status
                </span>
                <select value={status} onChange={(event) => setStatus(event.target.value as TaskStatus)}>
                  {statuses.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>

          <footer className="modal-footer">
            <button type="button" className="btn-ghost" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : mode === "create" ? "Criar tarefa" : "Salvar alteracoes"}
            </button>
          </footer>
        </form>
      </div>
    </div>,
    modalRoot
  );
}
