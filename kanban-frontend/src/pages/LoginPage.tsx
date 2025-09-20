import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { useAuthStore } from "../store/authStore";
import { ArrowRight, Lock, User } from "lucide-react";

export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const tokens = await login({ username, password });
      setAuth(tokens, username);
      navigate("/");
    } catch (err: any) {
      const message = err.response?.data?.message ?? "Falha ao autenticar";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-hero">
        <h1>Kanban Produtividade</h1>
        <p>Organize fluxos, sincronize o time e acompanhe entregas com um painel elegante e poderoso.</p>
        <ul>
          <li>Gerencie tarefas com drag and drop intuitivo.</li>
          <li>Visualize prioridades, prazos e progresso em um so lugar.</li>
          <li>Exporte relatorios em PDF para compartilhar avanços.</li>
        </ul>
      </div>
      <form className="auth-card" onSubmit={handleSubmit}>
        <span className="modal-badge">Entrar</span>
        <h2>Boas-vindas de volta</h2>
        <p>Acesse o painel com suas credenciais.</p>
        {error && <p className="feedback error">{error}</p>}
        <label>
          Usuario
          <div className="input-with-icon">
            <User size={18} />
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="seu.usuario"
              autoFocus
              required
            />
          </div>
        </label>
        <label>
          Senha
          <div className="input-with-icon">
            <Lock size={18} />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="********"
              required
            />
          </div>
        </label>
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? "Entrando..." : (<>Entrar <ArrowRight size={16} /></>)}
        </button>
        <p className="auth-footnote">
          Ainda nao possui conta? <Link to="/register">Criar conta agora</Link>
        </p>
      </form>
    </div>
  );
}
