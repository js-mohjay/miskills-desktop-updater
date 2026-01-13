export interface CareerSupportItem {
  _id: string;

  userId: {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
  };

  subscriptionId: {
    _id: string;
    status: string;
  };

  expectedSalary: string;
  experience: string;
  jobType: string;
  preferredCompany: string;

  resume: string;

  status: string;
  currentStage?: string;

  createdAt: string;
  updatedAt: string;
}

export interface CareerSupportListResponse {
  success: boolean;
  data: CareerSupportItem[];
  pagination: {
    totalRecords: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}
