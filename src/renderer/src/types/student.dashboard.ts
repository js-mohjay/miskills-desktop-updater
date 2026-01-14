import { CareerSupportSummary } from "./careerSupport";
import { StudentSubscription } from "./subscription";

export interface StudentDashboardResponse {
  success: boolean;
  data: {
    summary: {
      totalSubscriptions: number;
      avgProgress: number;
      avgDaysRemaining: number;
      totalTimeFormatted: string;
      careerSupport?: CareerSupportSummary;
      showRenewBanner?: boolean;
    };
    subscriptions: StudentSubscription[];
  };
}
