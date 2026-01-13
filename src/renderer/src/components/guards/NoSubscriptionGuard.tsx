// components/NoSubscriptionGuard.tsx
import { Navigate, Outlet } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { studentService } from "@/services/student.service";
import { useAuth } from "@/store/auth/useAuthStore";

export function NoSubscriptionGuard() {
  const user = useAuth((s) => s.user);

  const { data: subData, isLoading } = useQuery({
    queryKey: ["subscriptions", user?._id],
    enabled: !!user,
    queryFn: () => studentService.getSubscriptions(1, 50),
    select: (res) => ({
      subscriptions: res.data.data ?? [],
      careerSupportPurchased: res.data.careerSupportPurchased === true,
    }),
  });

  // ⛔ blocks render until data exists
  if (isLoading || !subData) return null;

  const hasActiveSubscription = subData.subscriptions.some(
    (s: any) => s.status === "active"
  );

  if (hasActiveSubscription || subData.careerSupportPurchased) {
    return <Navigate to="/student" replace />;
  }

  return <Outlet />;
}
