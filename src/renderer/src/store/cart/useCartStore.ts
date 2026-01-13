import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { paymentsService } from "@/services/payments.service"
import { toast } from "sonner"
import { CreateSubscriptionOrderResponse, CreateSubscriptionPayload, FullBundlePayload, MonthlyDifferentMonthsPayload } from "@/types/payment"
// import SubCategories from "@/components/SubCategories"

/* ---------- Types ---------- */

export type CartItem = {
  _id: string
  name: string
  type: "BUNDLE" | "INDIVIDUAL"
  billingType: "ONE_TIME" | "MONTHLY"
  subscriptionMode: "FULL" | "MONTHLY"
  price: number;
  selectedMonths: number
}


interface CartState {
  items: CartItem[]

  isCreatingOrder: boolean;
  setIsCreatingOrder: (val: boolean) => void

  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void

  subtotal: () => number
  tax: () => number
  total: () => number

  apiPayload: () => CreateSubscriptionPayload
  createOrder: () => Promise<CreateSubscriptionOrderResponse>
}


/* ---------- Store ---------- */

export const useCartStore = create<CartState>()(
  devtools(
    (set, get) => ({
      items: [],

      isCreatingOrder: false,
      /* ---------- Actions ---------- */

      setIsCreatingOrder: (val) => set({ isCreatingOrder: val }),

      addItem: (item) =>
        set((state) => {
          const exists = state.items.find((i) => i._id === item._id)
          if (exists) return state
          return { items: [...state.items, item] }
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item._id !== id),
        })),

      clearCart: () =>
        set({
          items: []
        }),


      /* ---------- Selectors ---------- */

      subtotal: () =>
        get().items.reduce((sum, item) => sum + item.price, 0),

      tax: () => {
        const subtotal = get().subtotal()
        return subtotal * 0.18
      },

      total: () => get().subtotal() + get().tax(),

      apiPayload: (): CreateSubscriptionPayload => {
        const { items } = get()

        if (items.length === 0) {
          throw new Error("No items in cart")
        }

        const hasBundle = items.some(i => i.type === "BUNDLE")
        const hasIndividual = items.some(i => i.type === "INDIVIDUAL")

        if (hasBundle && hasIndividual) {
          throw new Error("Cannot mix bundle and individual plans")
        }

        const mode = items[0].subscriptionMode

        // ---------- FULL ----------
        if (mode === "FULL") {
          return {
            subscriptionMode: "FULL",
            subcategories: items.map(i => i._id),
          }
        }

        // ---------- MONTHLY ----------
        const monthsSet = new Set(items.map(i => i.selectedMonths))

        if (monthsSet.size === 1) {
          return {
            subscriptionMode: "MONTHLY",
            subcategories: items.map(i => i._id),
            selectedMonths: items[0].selectedMonths,
          }
        }

        return {
          subscriptionMode: "MONTHLY",
          subcategories: items.map(i => ({
            subcategoryId: i._id,
            months: i.selectedMonths,
          })),
        }
      },


      /* ---------- API ---------- */

      createOrder: async () => {
        try {
          const payload = get().apiPayload()
          const res = await paymentsService.createSubscriptionOrder(payload, "DESKTOP" )
          return res.data
        } catch (err: any) {
          toast.error(
            err?.response?.data?.message ||
            "Failed to create order, Please try again later."
          )
          return undefined
        }
      },
    }),
    {
      name: "CartStore", // 👈 THIS MAKES IT VISIBLE
    }
  )
)
