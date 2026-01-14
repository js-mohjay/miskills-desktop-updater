import api from "@/lib/axios";

export const subAdminService = {
  getAll: (page = 1, limit = 10) =>
    api.get(`/api/admin/sub-admins?page=${page}&limit=${limit}`),

  create: (payload: {
    name: string;
    email: string;
    phoneNumber: string;
    role: "training" | "placement" | "instructor";
    skills?: string;
    // specializations?: string;
  }) =>
    api.post("/api/auth/register-admin", payload),

  update: (id: string, payload: Partial<any>) =>
    api.patch(`/api/admin/sub-admins/${id}`, payload),

  delete: (id: string) =>
    api.delete(`/api/admin/sub-admins/${id}`),
};
