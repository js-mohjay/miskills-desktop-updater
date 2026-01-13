import api from "@/lib/axios";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const REFRESH_URL = "/auth/refresh";

export type Role = "admin" | "training" | "placement" | "finance" | "instructor" | "student";

interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: Role;
  avatar: string;
  phoneVerified: Boolean;
  emailVerified: Boolean;
  studentId: string;

}

interface AuthState {
  user: User | null;
  studentId: string | null;
  setStudentId: (val: string) => void;

  accessToken: string | null;
  refreshToken: string | null;

  clearState: () => void;
  login: (user: User, access: string, refresh: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;

  refreshAccessToken: () => Promise<string | null>;

  hasRole: (role: Role) => boolean;

  rehydrated: boolean; // <-- new
}

export const useAuth = create<AuthState>()(
  devtools(persist(
    (set, get) => ({
      user: null,

      studentId: null,
      setStudentId: (val) => set({ studentId: val }),

      accessToken: null,
      refreshToken: null,

      rehydrated: false,

      clearState: async () => {
        set({ user: null, accessToken: null, refreshToken: null })
      },

      // login: (user, accessToken, refreshToken) => set({ user, accessToken, refreshToken }),
      login: (user, accessToken, refreshToken) => {
        const formattedUser = {
          ...user,
          avatar: (import.meta.env.VITE_BACKEND_BASE_URL ?? "http://54.80.254.224:5000") + user.avatar
        }

        if (formattedUser?.studentId) set({ studentId: formattedUser.studentId })

        set({ user: formattedUser, accessToken, refreshToken })
      },



      logout: async () => {
        try {
          const res = await api.post("/api/user/logout")

          get().clearState()

          return res
        } catch (err) {
          console.error("Logout Request Failed", err);
          return null;
        }
      },



      updateUser: (data) => {
        const current = get().user;
        if (!current) return;
        set({ user: { ...current, ...data } });
      },

      refreshAccessToken: async () => {
        const refreshToken = get().refreshToken;
        if (!refreshToken) return null;

        try {
          const res = await api.post(REFRESH_URL, { refreshToken });

          const newAccess = res.data.accessToken;
          const newRefresh = res.data.refreshToken ?? refreshToken;

          set({
            accessToken: newAccess,
            refreshToken: newRefresh,
          });

          return newAccess;
        } catch (err) {
          console.error("Token refresh failed", err);
          get().logout();
          return null;
        }
      },

      hasRole: (role) => get().user?.role === role,
    }),

    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        studentId: state.studentId, // ✅ REQUIRED
      }),
      onRehydrateStorage: () => (state, error) => {
        if (!error && state) {
          // ✅ manually set `rehydrated` in state
          setTimeout(() => {
            useAuth.setState({ rehydrated: true });
          });
        }
      },
    }
  ))
);
