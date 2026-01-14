export interface CareerSupportSummary {
  enabled: boolean;
  totalPlans: number;
  totalInterviews: number;
  usedInterviews: number;
  remainingInterviews: number;
  isProfileSubmitted: boolean;
}

export interface CareerSupportApplication {
  _id: string;
  status: "pending" | "approved" | "rejected";
  expectedSalary: string;
  experience: string;
  jobType: string;
  preferredCompany: string;
  createdAt: string;
}
