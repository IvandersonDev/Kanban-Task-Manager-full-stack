export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  position: number;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskRequest {
  title: string;
  description?: string | null;
  dueDate?: string | null;
  priority?: TaskPriority;
}

export interface TaskUpdateRequest extends Partial<TaskRequest> {
  status?: TaskStatus;
  removeDueDate?: boolean;
}

export interface TaskMoveRequest {
  status: TaskStatus;
  newPosition?: number;
}

export interface AuthTokens {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface Credentials {
  username: string;
  password: string;
}

export interface RegisterPayload extends Credentials {
  fullName: string;
  email: string;
}
