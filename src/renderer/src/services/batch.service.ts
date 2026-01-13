import api from "@/lib/axios"

export const batchService = {
  getActiveBatches: (subcategoryId: string) =>
    api.get(`/api/batches/active/${subcategoryId}`),

  enrollInBatch: (payload: {
    subscriptionId: string
    batchId: string
  }) =>
    api.post("/api/batches/subs", payload),
}
