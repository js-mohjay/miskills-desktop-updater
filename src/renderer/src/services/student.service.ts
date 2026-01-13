import api from "@/lib/axios";
import { Subscription } from "@/types/subscription";
import { StudentDashboardResponse } from "@/types/student.dashboard";
import { CareerSupportApplication } from "@/types/careerSupport";
import { PaginatedResponse } from "@/types/api";

export const studentService = {
  /* ---------------------------------- */
  /* Subscriptions */
  /* ---------------------------------- */

  getSubscriptions: (page = 1, limit = 50) => {
    return api.get<{
      success: boolean;
      data: Subscription[];
      careerSupportPurchased?: boolean;
    }>(`/api/student/subscription?page=${page}&limit=${limit}`);
  },

  /* ---------------------------------- */
  /* Dashboard */
  /* ---------------------------------- */

  getDashboard: () => {
    return api.get<StudentDashboardResponse>("/api/student/dashboard");
  },

  /* ---------------------------------- */
  /* Career Support */
  /* ---------------------------------- */

  submitCareerSupportProfile: (payload: FormData) => {
    return api.post(
      "/api/application/career-support/profile",
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  getCareerSupportApplications: (
    page = 1,
    limit = 10,
    status: string | null = null
  ) => {
    const statusParam = status ? `&status=${status}` : "";
    return api.get<PaginatedResponse<CareerSupportApplication>>(
      `/api/application/student/list?page=${page}&limit=${limit}${statusParam}`
    );
  },

  /* ---------------------------------- */
  /* Learnings (alias) */
  /* ---------------------------------- */

  getLearnings: (page = 1, limit = 10) => {
    return api.get(`/api/student/subscription?page=${page}&limit=${limit}`);
  },

  /* ---------------------------------- */
  /* Admin – Student Management */
  /* ---------------------------------- */

  getAll: (page = 1, limit = 10) =>
    api.get(`/api/admin/students?page=${page}&limit=${limit}`),

  getById: (id: string) =>
    api.get(`/api/admin/students/${id}`),

  update: (id: string, payload: Partial<any>) =>
    api.patch(`/api/admin/students/${id}`, payload),

  delete: (id: string) =>
    api.delete(`/api/admin/students/${id}`),
};
