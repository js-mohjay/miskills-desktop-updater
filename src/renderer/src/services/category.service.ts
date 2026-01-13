import api from "@/lib/axios";

export const categoryService = {
  getCategories: () => {
    return api.get("/api/categories/")
  },
  getSubcategories: (categoryId: string) => {
    return api.get(`/api/categories/with-subscription?catId=${categoryId}`)
  }
}
