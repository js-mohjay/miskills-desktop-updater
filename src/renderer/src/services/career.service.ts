import axios from "@/lib/axios"

export const careerService = {
  getInterviews: (page = 1, limit = 10) =>
    axios.get(`/api/application/interviews?page=${page}&limit=${limit}`),

  getPlacements: (page = 1, limit = 10) =>
    axios.get(`/api/application/placements?page=${page}&limit=${limit}`),
}
