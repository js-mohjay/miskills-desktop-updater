import api from "@/lib/axios"

export const studentService = {
    getSubscriptions: (page: number, limit: number) => {
        return api.get(`/api/student/subscription?page=${page}&limit=${limit}`)
    },
    getDashboard: () => {
        return api.get("/api/student/dashboard")
    },
    getLearnings: (page: number, limit: number) => {
        return api.get(`/api/student/subscription?page=${page}&limit=${limit}`)
    },

    // Student Management
    getAll: (page = 1, limit = 10) =>
        api.get(`/api/admin/students?page=${page}&limit=${limit}`),

    getById: (id: string) =>
        api.get(`/api/admin/students/${id}`),

    update: (id: string, payload: Partial<any>) =>
        api.patch(`/api/admin/students/${id}`, payload),

    delete: (id: string) =>
        api.delete(`/api/admin/students/${id}`),
}