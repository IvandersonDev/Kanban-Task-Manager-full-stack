import { useAuthStore } from "../store/authStore";
import { ClipboardList, CheckCircle2, Timer, LogOut, Plus } from "lucide-react";

type HeaderProps = {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  onCreateTask: () => void;
};

export function Header({ totalTasks, completedTasks, inProgressTasks, onCreateTask }: HeaderProps) {
  const username = useAuthStore((state) => state.username);
  const logout = useAuthStore((state) => state.logout);

  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <header className="shell-header">
      <div className="shell-header__left">
        <div className="shell-title">
          <span className="logo-dot" aria-hidden="true" />
          <div>
            <h1>Kanban Produtividade</h1>
            <p>Planeje sprints, visualize fluxos e acompanhe entregas em tempo real.</p>
          </div>
        </div>
        <div className="shell-stats">
          <div className="shell-stat">
            <ClipboardList size={18} />
            <div>
              <span>Total</span>
              <strong>{totalTasks}</strong>
            </div>
          </div>
          <div className="shell-stat">
            <Timer size={18} />
            <div>
              <span>Em progresso</span>
              <strong>{inProgressTasks}</strong>
            </div>
          </div>
          <div className="shell-stat">
            <CheckCircle2 size={18} />
            <div>
              <span>Concluidas</span>
              <strong>{completedTasks}</strong>
            </div>
          </div>
        </div>
      </div>
      <div className="shell-header__right">
        <div className="completion-chip">
          <span>Performance</span>
          <strong>{completionRate}%</strong>
        </div>
        <button type="button" className="btn-secondary" onClick={onCreateTask}>
          <Plus size={18} />
          Nova tarefa
        </button>
        <div className="user-chip">
          <div className="user-avatar">{username?.slice(0, 2).toUpperCase() ?? "US"}</div>
          <div className="user-info">
            <strong>{username ?? "usuario"}</strong>
            <button type="button" onClick={logout}>
              <LogOut size={16} />
              sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
