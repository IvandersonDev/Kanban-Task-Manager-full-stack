import { useMemo, useState } from "react";
import { addDays, isBefore, parseISO } from "date-fns";
import { FileText, Loader2, RefreshCcw, Upload, Zap } from "lucide-react";
import { Header } from "../components/Header";
import { TaskModal } from "../components/tasks/TaskModal";
import { TaskBoard } from "../components/tasks/TaskBoard";
import {
  useTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useMoveTaskMutation,
  useDeleteTaskMutation,
} from "../hooks/useTasks";
import type { Task, TaskStatus, TaskRequest, TaskUpdateRequest } from "../types";
import { exportTasksPdf } from "../api/tasks";

const columnSetup: Array<{ status: TaskStatus; title: string }> = [
  { status: "TODO", title: "Backlog imediato" },
  { status: "IN_PROGRESS", title: "Em execucao" },
  { status: "DONE", title: "Finalizado" },
];

export function BoardPage() {
  const { data: tasks = [], isLoading, isFetching, refetch } = useTasksQuery();
  const createTaskMutation = useCreateTaskMutation();
  const updateTaskMutation = useUpdateTaskMutation();
  const moveTaskMutation = useMoveTaskMutation();
  const deleteTaskMutation = useDeleteTaskMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [taskBeingEdited, setTaskBeingEdited] = useState<Task | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const stats = useMemo(() => {
    const total = tasks.length;
    const todo = tasks.filter((task) => task.status === "TODO").length;
    const inProgress = tasks.filter((task) => task.status === "IN_PROGRESS").length;
    const done = tasks.filter((task) => task.status === "DONE").length;
    const dueSoon = tasks.filter((task) => {
      if (!task.dueDate) {
        return false;
      }
      const limit = addDays(new Date(), 3);
      return isBefore(parseISO(task.dueDate), limit) && task.status !== "DONE";
    }).length;
    return {
      total,
      todo,
      inProgress,
      done,
      dueSoon,
    };
  }, [tasks]);

  const columns = useMemo(
    () =>
      columnSetup.map((column) => ({
        ...column,
        tasks: tasks
          .filter((task) => task.status === column.status)
          .sort((a, b) => a.position - b.position),
      })),
    [tasks]
  );

  function openCreateModal() {
    setModalMode("create");
    setTaskBeingEdited(null);
    setModalOpen(true);
  }

  function openEditModal(task: Task) {
    setModalMode("edit");
    setTaskBeingEdited(task);
    setModalOpen(true);
  }

  async function handleCreate(payload: TaskRequest | TaskUpdateRequest) {
    await createTaskMutation.mutateAsync(payload as TaskRequest);
  }

  async function handleUpdate(payload: TaskRequest | TaskUpdateRequest) {
    if (!taskBeingEdited) {
      return;
    }
    await updateTaskMutation.mutateAsync({ taskId: taskBeingEdited.id, payload: payload as TaskUpdateRequest });
  }

  async function handleReorder(taskId: number, status: TaskStatus, newPosition: number) {
    await moveTaskMutation.mutateAsync({ taskId, payload: { status, newPosition } });
  }

  async function handleAdvance(task: Task) {
    const order: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];
    const currentIndex = order.indexOf(task.status);
    const nextStatus = order[currentIndex + 1];
    if (!nextStatus) {
      return;
    }
    const targetColumn = columns.find((column) => column.status === nextStatus);
    const newPosition = targetColumn ? targetColumn.tasks.length : 0;
    await moveTaskMutation.mutateAsync({ taskId: task.id, payload: { status: nextStatus, newPosition } });
  }

  async function handleDelete(task: Task) {
    await deleteTaskMutation.mutateAsync(task.id);
  }

  async function handleExport() {
    setIsExporting(true);
    try {
      const buffer = await exportTasksPdf();
      const blob = new Blob([buffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "kanban-tarefas.pdf";
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  }

  const modalHandler = modalMode === "create" ? handleCreate : handleUpdate;

  return (
    <div className="app-shell">
      <Header
        totalTasks={stats.total}
        completedTasks={stats.done}
        inProgressTasks={stats.inProgress}
        onCreateTask={openCreateModal}
      />

      <main className="shell-content">
        <section className="insights-grid">
          <article className="insight-card">
            <div className="insight-card__icon blue">
              <Zap size={20} />
            </div>
            <div>
              <h3>Backlog ativo</h3>
              <p>{stats.todo} itens aguardando inicio</p>
            </div>
          </article>
          <article className="insight-card">
            <div className="insight-card__icon amber">
              <RefreshCcw size={20} />
            </div>
            <div>
              <h3>Em andamento</h3>
              <p>{stats.inProgress} workflows em execucao</p>
            </div>
          </article>
          <article className="insight-card">
            <div className="insight-card__icon green">
              <FileText size={20} />
            </div>
            <div>
              <h3>Due date proximos</h3>
              <p>{stats.dueSoon} entregas chegando em ate 3 dias</p>
            </div>
          </article>
        </section>

        <div className="board-toolbar">
          <button type="button" className="btn-outline" onClick={() => refetch()} disabled={isFetching}>
            {isFetching ? <Loader2 size={16} className="spin" /> : <RefreshCcw size={16} />}
            Atualizar
          </button>
          <button type="button" className="btn-outline" onClick={handleExport} disabled={isExporting}>
            {isExporting ? <Loader2 size={16} className="spin" /> : <Upload size={16} />}
            Exportar PDF
          </button>
        </div>

        {isLoading ? (
          <div className="loading-state">
            <Loader2 size={28} className="spin" />
            <p>Carregando tarefas...</p>
          </div>
        ) : (
          <TaskBoard
            columns={columns}
            onReorder={handleReorder}
            onEditTask={openEditModal}
            onDeleteTask={handleDelete}
            onAdvanceStatus={handleAdvance}
          />
        )}
      </main>

      <button type="button" className="fab" onClick={openCreateModal}>
        +
      </button>

      <TaskModal
        open={modalOpen}
        mode={modalMode}
        initialTask={taskBeingEdited}
        onClose={() => setModalOpen(false)}
        onSubmit={modalHandler}
      />
    </div>
  );
}
