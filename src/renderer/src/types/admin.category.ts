// types/admin.category.ts

export type Category = {
  _id: string
  name: string
  description: string
  icon: string
  order: number
  backgroundColor: string
  slug: string
}

export type CategoryListResponse = {
  success: boolean
  data: {
    categories: Category[]
  }
}

/* -------------------------------------------------------------------------- */

export type Subcategory = {
  _id: string
  name: string
  description: string
  categoryId: string
  type: "INDIVIDUAL" | "BUNDLE"
  billingType: "MONTHLY" | "ONE_TIME"
  dailyHours: number
  durationMonths: number
  monthlyPrice: number | null
  totalPrice: number
}

export type SubcategoryListResponse = {
  success: boolean
  data: {
    subcategories: Subcategory[]
  }
}
