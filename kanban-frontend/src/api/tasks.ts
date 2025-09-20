import { api } from "./client";
import type {
  Task,
  TaskMoveRequest,
  TaskRequest,
  TaskUpdateRequest,
} from "../types";

export async function fetchTasks() {
  const { data } = await api.get<Task[]>("/api/tasks");
  return data;
}

export async function createTask(payload: TaskRequest) {
  const { data } = await api.post<Task>("/api/tasks", payload);
  return data;
}

export async function updateTask(taskId: number, payload: TaskUpdateRequest) {
  const { data } = await api.put<Task>(`/api/tasks/${taskId}`, payload);
  return data;
}

export async function moveTask(taskId: number, payload: TaskMoveRequest) {
  const { data } = await api.patch<Task>(`/api/tasks/${taskId}/move`, payload);
  return data;
}

export async function deleteTask(taskId: number) {
  await api.delete(`/api/tasks/${taskId}`);
}

export async function exportTasksPdf() {
  const { data } = await api.get<ArrayBuffer>("/api/tasks/export/pdf", {
    responseType: "arraybuffer",
  });
  return data;
}
