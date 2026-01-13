import api from "@/lib/axios";

export const jobApplicationService = {
  getAll: (params: {
    page?: number;
    limit?: number;
    interviewStatus?: string;
    placementStatus?: string;
    subcategory?: string;
    company?: string;
    package?: string;
  }) => {
    const query = new URLSearchParams(
      Object.entries(params)
        .filter(([_, v]) => v !== undefined && v !== "")
        .map(([k, v]) => [k, String(v)])
    ).toString();

    return api.get(`/api/application?${query}`);
  },

  apply: (formData: FormData) =>
    api.post("/api/application/apply", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  updateInterviewStatus: (id: string, interviewStatus: string) =>
    api.patch(`/api/application/${id}/interview`, {
      interviewStatus,
    }),
};
