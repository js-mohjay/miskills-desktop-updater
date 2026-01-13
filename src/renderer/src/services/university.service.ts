import api from "@/lib/axios";

export const universityService = {
  getUniversities: (state: string) => {
    return api.get(`/api/universities/${state}`);
  }
}
