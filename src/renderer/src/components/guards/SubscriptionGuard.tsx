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
  const user = useAuth((s) => s.user);

  const { data, isLoading } = useQuery({
    queryKey: ["subscriptions-v3", user?._id], // new key to avoid stale cache
    enabled: !!user,
    queryFn: () => studentService.getSubscriptions(1, 50),
    select: (res) => ({
      subscriptions: Array.isArray(res.data?.data) ? res.data.data : [],
      careerSupportPurchased: res.data?.careerSupportPurchased === true,
    }),
  });

  if (isLoading || !data) return null;

  const hasActiveSubscription =
    data.subscriptions.some(
      (s: Subscription) => s.status === "active"
    ) || data.careerSupportPurchased;

  if (!hasActiveSubscription) {
    console.log('sub guard')
    return <Navigate to="/plans" replace />;
  }

  return <Outlet />;
}
