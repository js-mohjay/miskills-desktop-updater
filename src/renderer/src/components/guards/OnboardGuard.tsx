// components/OnboardGuard.tsx
import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/store/auth/useAuthStore";

export function OnboardGuard() {
  const { user, studentId } = useAuth();

  console.log("student id", user?.studentId, studentId)
  // Already onboarded → block access
  if (studentId || user?.studentId) {
    return <Navigate to="/student" replace />;
  }

  return <Outlet />;
}
