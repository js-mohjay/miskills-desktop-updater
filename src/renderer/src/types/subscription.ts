export type SubscriptionStatus = "active" | "expired" | "cancelled";

export interface StudentSubscription {
  _id: string;
  status: SubscriptionStatus;

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
