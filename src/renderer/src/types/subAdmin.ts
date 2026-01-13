export type SubAdminRole = "training" | "placement";

export interface SubAdmin {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: SubAdminRole;
  role_state: string | null;
  createdAt: string;
}

export interface SubAdminListResponse {
  success: boolean;
  data: {
    admins: SubAdmin[];
    pagination: {
      current: number;
      totalPages: number;
      totalItems: number;
      limit: number;
    };
  };
}
