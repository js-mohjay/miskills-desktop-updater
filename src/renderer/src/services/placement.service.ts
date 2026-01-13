import api from "@/lib/axios"

export const placementService = {
  getPlacements: (page: number, limit: number) => {
    return api.get(
      `/api/placements?page=${page}&limit=${limit}`
    )
  },

  addPlacement: (payload: any) => {
    return api.post("/api/placements", payload)
  },

  updatePlacement: (id: string, payload: any) => {
    return api.patch(`/api/placements/${id}`, payload)
  },

  deletePlacement: (id: string) => {
    return api.delete(`/api/placements/${id}`)
  },
}
