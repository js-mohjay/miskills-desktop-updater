import api from "@/lib/axios"

/* -------------------------------------------------------------------------- */
/*                                   DASHBOARD                                */
/* -------------------------------------------------------------------------- */

export const adminDashboardService = {
  getStats: () => {
    return api.get("/api/admin/dashboard/stats")
  },
}

/* -------------------------------------------------------------------------- */
/*                                 INSTRUCTORS                                */
/* -------------------------------------------------------------------------- */

export const adminInstructorService = {
  getInstructors: (page: number, limit: number) => {
    return api.get(
      `/api/admin/instructors?page=${page}&limit=${limit}`
    )
  },

  getInstructorById: (id: string) => {
    return api.get(`/api/admin/instructors/${id}`)
  },

  createInstructor: (payload: {
    name: string
    email: string
    phoneNumber: string
    specializations: string
    skills: string[]
  }) => {
    return api.post("/api/admin/instructors", payload)
  },

  updateInstructor: (
    id: string,
    payload: {
      name: string
      email: string
      phoneNumber: string
      specializations: string
      skills: string[]
    }
  ) => {
    return api.patch(
      `/api/admin/instructors/${id}`,
      payload
    )
  },

  deleteInstructor: (id: string) => {
    return api.delete(`/api/admin/instructors/${id}`)
  },
}


/* -------------------------------------------------------------------------- */
/*                                   BATCHES                                  */
/* -------------------------------------------------------------------------- */

export const adminBatchService = {
  getBatches: (page: number, limit: number) => {
    return api.get(`/api/batches?page=${page}&limit=${limit}`)
  },

  getBatchById: (id: string) => {
    return api.get(`/api/batches/${id}`)
  },

  createBatch: (payload: {
    name: string
    description: string
    subcategoryId: string
    assignedInstructor: string
    startDate: string
    endDate: string
    startTime: string
    endTime: string
  }) => {
    return api.post(`/api/batches`, payload)
  },

  updateBatch: (
    id: string,
    payload: {
      name: string
      description: string
      subcategoryId: string
      assignedInstructor: string
      startDate: string
      endDate: string
      startTime: string
      endTime: string
    }
  ) => {
    return api.patch(`/api/batches/${id}`, payload)
  },

  deleteBatch: (id: string) => {
    return api.delete(`/api/batches/${id}`)
  },
}


/* -------------------------------------------------------------------------- */
/*                                  CATEGORIES                                */
/* -------------------------------------------------------------------------- */

export const adminCategoryService = {
  getCategories: () => {
    return api.get("/api/admin/categories")
  },

  getSubcategories: (categoryId: string) => {
    return api.get(
      `/api/admin/categories/${categoryId}/subcategories`
    )
  },
}


/* -------------------------------------------------------------------------- */
/*                             MISSED CLASSES                                 */
/* -------------------------------------------------------------------------- */

export const adminRecoveryService = {
  getStudentsWithMissedClasses: (
    page: number,
    limit: number
  ) => {
    return api.get(
      `/api/batches/admin/recovery/students?page=${page}&limit=${limit}`
    )
  },

  getRecoveryBatches: (
    userId: string,
    subcategoryId: string
  ) => {
    return api.get(
      `/api/batches/admin/recovery?userId=${userId}&subcategoryId=${subcategoryId}`
    )
  },

  recoverMissedClasses: (payload: {
    userId: string
    subcategoryId: string
    newBatchId: string
  }) => {
    return api.post(
      `/api/batches/admin/recover/missed`,
      payload
    )
  },
}
