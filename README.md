# Kanban Task Manager

Aplicacao full stack para gestao de tarefas estilo Kanban, combinando Spring Boot (back-end) com React + Vite (front-end). Usuarios podem registrar/login via JWT, criar tarefas com prioridades, arrasta-las entre colunas, acompanhar estatisticas em tempo real e exportar o board em PDF.

## ? Principais funcionalidades

- Autenticacao JWT (registro e login) com rotas protegidas e CORS configurado
- CRUD de tarefas com prioridades, datas, ordenacao e movimentacao entre colunas
- Drag-and-drop responsivo no front-end para reordenar tarefas
- Exportacao do board completo em PDF agrupado por status e prioridade
- Dashboard com estatisticas (totais, em progresso, concluidas, tarefas com prazo curto)
- UI premium (glassmorphism, modais ricos, botao flutuante) pensada para desktop e mobile
- Feedback visual em cada acao (toasts, estados de loading, erros centralizados)

## ?? Arquitetura

```
kanban-task-manager/
+-- src/main/java/com/example/kanban
�   +-- config/        # Propriedades JWT
�   +-- security/      # Filtro, service e configuracao JWT/Security
�   +-- service/       # Regras de negocio (usuarios, tarefas, PDF)
�   +-- web/           # REST controllers (Auth e Tasks)
�   +-- model/...      # Entidades JPA (UserAccount, KanbanTask, enums)
+-- src/main/resources/application.properties
+-- kanban-frontend/
�   +-- src/
�   �   +-- api/       # Axios + rotas REST
�   �   +-- hooks/     # React Query helpers
�   �   +-- components/# Header, TaskBoard, modais, etc
�   �   +-- pages/     # Login, Register, Board
�   �   +-- index.css  # Tema moderno e responsivo
�   +-- public/
�   +-- package.json
+-- README.md
```

## ??? Stack principal

| Nivel | Tecnologias |
|-------|-------------|
| Back-end | Spring Boot 3.5, Spring Security, Spring Data JPA, Hibernate, H2 (dev), JWT, OpenPDF |
| Front-end | React 19 + Vite, React Query, Zustand, React Router, @hello-pangea/dnd, React Hot Toast, Lucide Icons |
| Ferramentas | Maven, Node 20.19+, npm, Java 21, TypeScript 5 |

## ?? Como rodar

### 1. Pre-requisitos

- Java 21 (ex.: Amazon Corretto 21) e Maven (ou usar `mvnw` incluso)
- Node.js **>= 20.19.0** e npm

### 2. Back-end (Spring Boot)

```bash
cd kanban-task-manager
# primeira vez: compilar
./mvnw.cmd clean install

# executar localmente
./mvnw.cmd spring-boot:run
```

Aplicacao disponivel em `http://localhost:8080`. Console H2 opcional em `http://localhost:8080/h2-console` (jdbc:h2:mem:kanban, usuario `sa`).

### 3. Front-end (React + Vite)

```bash
cd kanban-task-manager/kanban-frontend
npm install
npm run dev
```

O Vite exibira a url (ex.: `http://localhost:5173`). Para build de producao:

```bash
npm run build
npm run preview
```

> ?? O Vite exige Node 20.19+. Caso esteja com 20.17, atualize para evitar warnings.

### 4. Variaveis de ambiente

- Backend: configuradas em `src/main/resources/application.properties` (ajuste `kanban.jwt.secret` e `kanban.jwt.expiration` conforme necessidade).
- Frontend: opcionalmente crie `.env` baseado em `.env.example` (`VITE_API_BASE_URL=http://localhost:8080`).

## ?? Endpoints principais

| Metodo | Rota | Descricao |
|--------|------|-----------|
| POST | `/api/auth/register` | Cria usuario e retorna token JWT |
| POST | `/api/auth/login` | Autentica usuario existente |
| GET | `/api/tasks` | Lista tarefas do usuario autenticado |
| POST | `/api/tasks` | Cria nova tarefa (status default TODO) |
| PUT | `/api/tasks/{id}` | Atualiza titulo, descricao, prioridade, status, data |
| PATCH | `/api/tasks/{id}/move` | Move tarefa para outra coluna/posicao |
| DELETE | `/api/tasks/{id}` | Remove tarefa |
| GET | `/api/tasks/export/pdf` | Exporta board atual em PDF |

A colecao Postman pronta encontra-se em `postmanTask` (substitua variavel `token` apos login). Exemplos via `curl`:

```bash
# Registro
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"joao","password":"SenhaForte1","fullName":"Joao Silva","email":"joao@example.com"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"joao","password":"SenhaForte1"}'

# Criar tarefa (usar token obtido)
curl -X POST http://localhost:8080/api/tasks \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Planejar sprint","description":"Revisar backlog","priority":"HIGH","dueDate":"2025-09-30"}'
```

## ??? Screenshots sugeridos

- Tela de login/cadastro com tema glassmorphism
- Board Kanban exibindo colunas e drag-and-drop
- Modal de criacao/edicao de tarefa
- PDF exportado aberto no navegador

(Insira imagens na pasta `docs/` ou links externos se for publicar no GitHub.)

## ?? Testes

- Back-end: `./mvnw.cmd -q test`
- Front-end: `npm run build` (executa TypeScript + Vite build). Adicione futuramente suites E2E (ex.: Playwright/Cypress) para o board.

## ?? Roadmap / ideias futuras

- Autenticacao social ou OAuth2
- Compartilhamento de boards em equipe
- Historico de movimentacoes / comentarios por tarefa
- Testes E2E automatizados e deploy CI/CD
- Internacionalizacao (pt-BR/en-US)

## ?? Contribuindo

1. Fork o repositorio
2. Crie uma branch feature (`git checkout -b feature/nome`)
3. Commit suas mudancas (`git commit -m 'feat: ...'`)
4. Push (`git push origin feature/nome`)
5. Abra um Pull Request

Issues, feedbacks e melhorias sao super bem-vindos!


---

> Desenvolvido para explorar boas praticas de arquitetura, experiencia do usuario e produtividade em uma stack moderna Java + JavaScript. Se montar algo legal com este repo, marque e compartilhe!
