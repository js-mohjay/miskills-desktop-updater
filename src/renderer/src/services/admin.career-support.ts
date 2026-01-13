import api from "@/lib/axios";

export const adminCareerSupportService = {
  getAll: (page: number, limit: number) =>
    api.get(
      `/api/application/career-support/admin/list?page=${page}&limit=${limit}`
    ),

  createApplication: (payload: {
    careerProfileId: string;
    interviewDate: string;
    interviewTime: string;
    company: string;
    stages: string[];
  }) =>
    api.post(
      "/api/application/career-support/admin/create-application",
      payload
    ),

  updateStatus: (
    id: string,
    payload: {
      interviewStatus: string;
      currentStage: string;
    }
  ) =>
    api.patch(`/api/application/admin/${id}/status`, payload),
};
