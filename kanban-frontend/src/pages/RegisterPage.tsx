import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import { useAuthStore } from "../store/authStore";
import { ArrowRight, AtSign, Lock, User, UserPlus } from "lucide-react";

export function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const tokens = await register({ username, password, fullName, email });
      setAuth(tokens, username);
      navigate("/");
    } catch (err: any) {
      const message = err.response?.data?.message ?? "Falha no cadastro";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-hero">
        <h1>Construa o seu quadro</h1>
        <p>Convide o time, defina prioridades e mantenha o foco com um fluxo visual moderno.</p>
        <ul>
          <li>Colunas inteligentes que mostram status e previsao de entrega.</li>
          <li>Notificacoes de sucesso e falha integradas via toast.</li>
          <li>Resumo executivo com estatisticas em tempo real.</li>
        </ul>
      </div>
      <form className="auth-card" onSubmit={handleSubmit}>
        <span className="modal-badge">Cadastro</span>
        <h2>Crie sua conta</h2>
        <p>Preencha os dados para iniciar com o Kanban Produtividade.</p>
        {error && <p className="feedback error">{error}</p>}
        <label>
          Nome completo
          <div className="input-with-icon">
            <UserPlus size={18} />
            <input
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Nome e sobrenome"
              required
            />
          </div>
        </label>
        <label>
          Email
          <div className="input-with-icon">
            <AtSign size={18} />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="seu.email@empresa.com"
              required
            />
          </div>
        </label>
        <label>
          Usuario
          <div className="input-with-icon">
            <User size={18} />
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="nome.usuario"
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
          {isLoading ? (
            "Salvando..."
          ) : (
            <>
              Criar conta <ArrowRight size={16} />
            </>
          )}
        </button>
        <p className="auth-footnote">
          Ja possui login? <Link to="/login">Entrar com minha conta</Link>
        </p>
      </form>
    </div>
  );
}
