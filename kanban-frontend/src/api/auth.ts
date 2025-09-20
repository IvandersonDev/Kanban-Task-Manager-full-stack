import { api } from "./client";
import type { AuthTokens, Credentials, RegisterPayload } from "../types";

export async function login(payload: Credentials) {
  const { data } = await api.post<AuthTokens>("/api/auth/login", payload);
  return data;
}

export async function register(payload: RegisterPayload) {
  const { data } = await api.post<AuthTokens>("/api/auth/register", payload);
  return data;
}
