export type StudentDashboardResponse = {
  success: boolean;
  data: {
    summary: {
      totalSubscriptions: number;
      avgProgress: number;
      avgDaysRemaining: number;
      totalTimeFormatted: string;
    };
    subscriptions: {
      _id: string;
      subcategoryId: {
        _id: string;
        name: string;
        description: string;
      };
      startDate: string;
      endDate: string;
      daysRemaining: number;
      progress: number;
      attendedDays: number;
      totalDays: number;
      attendedTimeSeconds: number;
      attendedTimeFormatted: string;
    }[];
  };
};
