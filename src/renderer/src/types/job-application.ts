export interface JobApplication {
  applicationId: string;
  studentName: string;
  studentEmail: string;
  studentInitial: string;
  interviewStatus: string;
  company: string;
  subcategory: string;
  package: string;
}

export interface JobApplicationListResponse {
  success: boolean;
  total: number;
  page: number;
  totalPages: number;
  data: JobApplication[];
}
