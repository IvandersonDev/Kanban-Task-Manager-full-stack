import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchTasks,
  createTask,
  updateTask,
  moveTask,
  deleteTask,
} from "../api/tasks";
import type {
  Task,
  TaskMoveRequest,
  TaskRequest,
  TaskUpdateRequest,
} from "../types";
import { toast } from "react-hot-toast";

const TASKS_QUERY_KEY = ["tasks"] as const;

export function useTasksQuery() {
  return useQuery({
    queryKey: TASKS_QUERY_KEY,
    queryFn: fetchTasks,
    staleTime: 1000 * 30,
  });
}

export function useCreateTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TaskRequest) => createTask(payload),
    onSuccess: () => {
      toast.success("Tarefa criada com sucesso");
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message ?? "Nao foi possivel criar a tarefa";
      toast.error(message);
    },
  });
}

export function useUpdateTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, payload }: { taskId: number; payload: TaskUpdateRequest }) =>
      updateTask(taskId, payload),
    onSuccess: () => {
      toast.success("Tarefa atualizada");
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message ?? "Nao foi possivel atualizar a tarefa";
      toast.error(message);
    },
  });
}

export function useMoveTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, payload }: { taskId: number; payload: TaskMoveRequest }) =>
      moveTask(taskId, payload),
    onSuccess: (data: Task) => {
      toast.success(`Tarefa movida para ${data.status}`);
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message ?? "Nao foi possivel mover a tarefa";
      toast.error(message);
    },
  });
}

export function useDeleteTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: number) => deleteTask(taskId),
    onSuccess: () => {
      toast.success("Tarefa excluida");
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message ?? "Nao foi possivel excluir a tarefa";
      toast.error(message);
    },
  });
}
