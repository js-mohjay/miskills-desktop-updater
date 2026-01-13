import { CareerSupportSummary } from "./careerSupport";
import { Subscription } from "./subscription";


export interface StudentDashboardResponse {
  success: boolean;
  data: {
    summary: {
      totalSubscriptions: number;
      avgProgress: number;
      avgDaysRemaining: number;
      totalTimeFormatted: string;
      careerSupport?: CareerSupportSummary;
    };
    subscriptions: Subscription[];
  };
}
