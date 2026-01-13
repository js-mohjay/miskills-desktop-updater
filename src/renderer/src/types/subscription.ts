export type SubscriptionStatus = "active" | "expired" | "cancelled";

export interface Subscription {
  _id: string;
  status: SubscriptionStatus;

  // dashboard-only fields (optional)
  progress?: number;
  daysRemaining?: number;
  totalDays?: number;
  attendedDays?: number;
  attendedTimeFormatted?: string;

  subcategoryId?: {
    _id: string;
    name: string;
  };
}
