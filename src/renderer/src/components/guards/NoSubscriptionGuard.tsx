// components/NoSubscriptionGuard.tsx
import { Navigate, Outlet } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { studentService } from "@/services/student.service";
import { useAuth } from "@/store/auth/useAuthStore";

export function NoSubscriptionGuard() {
  const user = useAuth(s => s.user);

  const { data, isLoading } = useQuery({
    queryKey: ["subscriptions", user?._id],
    enabled: !!user,
    queryFn: async () => {
      const res = await studentService.getSubscriptions(1, 50);
      return res.data.data;
    },
  });

  if (isLoading) return null;

  const hasActiveSubscription = data?.some(
    (s: any) => s.status === "active"
  );

  // Already subscribed → block plans
  if (hasActiveSubscription) {
    return <Navigate to="/student" replace />;
  }

  return <Outlet />;
}
