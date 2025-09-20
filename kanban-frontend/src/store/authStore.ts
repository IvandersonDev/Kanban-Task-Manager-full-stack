import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthTokens } from "../types";

type AuthState = {
  token: string | null;
  expiresAt: number | null;
  username: string | null;
  setAuth: (tokens: AuthTokens, username: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      expiresAt: null,
      username: null,
      setAuth: (tokens, username) => {
        const now = Date.now();
        const expiresAt = now + tokens.expiresIn;
        set({ token: tokens.accessToken, username, expiresAt });
      },
      logout: () => set({ token: null, username: null, expiresAt: null }),
    }),
    {
      name: "kanban-auth",
    }
  )
);
