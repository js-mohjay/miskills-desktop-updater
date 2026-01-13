import { Navigate } from "react-router";
import { useAuth } from "@/store/auth/useAuthStore";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { studentService } from "@/services/student.service";
import { toast } from "sonner";
import { StudentSubscription } from "@/types/subscription";

export default function RootRedirect() {
  const user = useAuth((s) => s.user);
  const rehydrated = useAuth((s) => s.rehydrated);

  const {
    data: subscriptions = [],
    error,
    isLoading,
  } = useQuery({
    // 🔒 ISOLATED KEY — array-only forever
    queryKey: ["student-subscriptions-array", user?._id],
    enabled: rehydrated && user?.role === "student",

    queryFn: () => studentService.getSubscriptions(1, 50),

    // 🔒 ENFORCE ARRAY SHAPE NO MATTER WHAT
    select: (res) =>
      Array.isArray(res.data?.data)
        ? (res.data.data as StudentSubscription[])
        : [],
  });

  useEffect(() => {
    if (error) {
      const err = error as AxiosError<any>;
      toast.error(
        err.response?.data?.message ??
          "Failed to get subscriptions. Please try again."
      );
    }
  }, [error]);

  // ⛔ wait until auth is rehydrated
  if (!rehydrated) return null;

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  switch (user.role) {
    case "student": {
      if (isLoading) return null;

      // ✅ SAFE: subscriptions is GUARANTEED array
      const hasActiveSubscription = subscriptions.some(
        (sub) => sub.status === "active"
      );

      // ❌ no active subscription → plans
      if (user.studentId && !hasActiveSubscription) {
        return <Navigate to="/plans" replace />;
      }

      // ✅ active subscription or onboarding
      return (
        <Navigate
          to={user.studentId ? "/student" : "/onboard"}
          replace
        />
      );
    }

    case "admin":
      return <Navigate to="/admin" replace />;

    case "training":
      return <Navigate to="/training" replace />;

    default:
      return <Navigate to="/signin" replace />;
  }
}
