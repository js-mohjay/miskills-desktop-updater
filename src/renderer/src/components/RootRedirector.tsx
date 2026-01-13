import { Navigate } from "react-router";
import { useAuth } from "@/store/auth/useAuthStore";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { studentService } from "@/services/student.service";
import { toast } from "sonner";

type Subscription = {
  _id: string;
  status: "active" | "expired" | "cancelled";
  startDate: string;
  endDate: string;
};

export default function RootRedirect() {
  const user = useAuth((s) => s.user);
  const rehydrated = useAuth((s) => s.rehydrated);

  const {
    data: subscriptions,
    error,
    isLoading,
  } = useQuery<Subscription[], AxiosError>({
    queryKey: ["subscriptions", user?._id],
    enabled: rehydrated && user?.role === "student",
    queryFn: async () => {
      const res = await studentService.getSubscriptions(1, 50);
      return res.data.data;
    },
  });

  useEffect(() => {
    if (error) {
      const err = error as AxiosError<any>

      toast.error(
        err.response?.data?.message ??
        "Failed to get subscriptions. Please try again."
      );
    }
  }, [error]);

  // ⛔ wait until auth + subs are resolved
  if (!rehydrated) return null;
  if (user?.role === "student" && isLoading) return null;

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  switch (user.role) {
    case "student": {
      const hasActiveSubscription = subscriptions?.some(
        (sub) => sub.status === "active"
      );

      // ❌ no active subscription → plans
      if (user.studentId && !hasActiveSubscription) {
        return <Navigate to="/student" replace />;
      }

      // ✅ active subscription
      const route = user.studentId ? "/student" : "/onboard";
      return <Navigate to={route} replace />;
    }

    case "admin":
      return <Navigate to="/admin" replace />;

    case "training":
      return <Navigate to="/training" replace />;

    default:
      return <Navigate to="/signin" replace />;
  }
}
