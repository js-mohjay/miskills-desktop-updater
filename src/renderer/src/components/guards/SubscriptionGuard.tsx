// components/SubscriptionGuard.tsx
import { Navigate, Outlet } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { studentService } from "@/services/student.service";
import { useAuth } from "@/store/auth/useAuthStore";

type Subscription = {
  _id: string;
  status: "active" | "expired" | "cancelled";
};

export function SubscriptionGuard() {
  const user = useAuth(s => s.user);

  const { data, isLoading } = useQuery<Subscription[]>({
    queryKey: ["subscriptions", user?._id],
    enabled: !!user,
    queryFn: async () => {
      const res = await studentService.getSubscriptions(1, 50);
      return res.data.data;
    },
  });

  if (isLoading) return null;

  const hasActiveSubscription = data?.some(s => s.status === "active");

  if (!hasActiveSubscription) {
    return <Navigate to="/plans" replace />;
  }

  return <Outlet />;
}
