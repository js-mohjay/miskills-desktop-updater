import api from "@/lib/axios"

export const attendanceService = {
  getBySubcategory: (subcategoryId: string) =>
    api.get(`/api/attendance/subscription?subcategoryId=${subcategoryId}`),
}
