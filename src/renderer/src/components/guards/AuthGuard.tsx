// components/AuthGuard.tsx
import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/store/auth/useAuthStore";

export type Role = "student" | "admin" | "training" | "placement" | "instructor";

export function AuthGuard({ role }: { role?: Role }) {
  const user = useAuth(s => s.user);
  const rehydrated = useAuth((s) => s.rehydrated);

  if (!rehydrated) return null;
  if (!user) return <Navigate to="/signin" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return <Outlet />;
}
